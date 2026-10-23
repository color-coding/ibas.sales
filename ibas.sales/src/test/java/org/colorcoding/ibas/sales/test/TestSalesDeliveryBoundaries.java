package org.colorcoding.ibas.sales.test;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.bo.BOIdentifierBuilder;
import org.colorcoding.ibas.bobas.bo.BOUtilities;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.businesspartner.bo.customer.ICustomer;
import org.colorcoding.ibas.businesspartner.repository.BORepositoryBusinessPartner;
import org.colorcoding.ibas.materials.MyConfiguration;
import org.colorcoding.ibas.materials.bo.material.IMaterial;
import org.colorcoding.ibas.materials.bo.warehouse.IWarehouse;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/** 超量限制、多行事务回滚及重复保存的业务边界。 */
public class TestSalesDeliveryBoundaries extends AbstractSalesQuantityTestCase {

	private ISalesOrder createOrder(BORepositorySales repo, ICustomer partner, IMaterial material, IWarehouse warehouse) {
		ISalesOrder order = new SalesOrder();
		order.setCustomerCode(partner.getCode());
		ISalesOrderItem line = order.getSalesOrderItems().create();
		line.setItemCode(material.getCode());
		line.setWarehouse(warehouse.getCode());
		line.setQuantity(Decimals.valueOf(10));
		line.setPrice(Decimals.valueOf(20));
		return BOUtilities.valueOf(repo.saveSalesOrder(order)).firstOrDefault();
	}

	private ISalesDelivery delivery(ISalesOrder order, int... quantities) {
		ISalesDelivery delivery = new SalesDelivery();
		delivery.setCustomerCode(order.getCustomerCode());
		ISalesOrderItem source = order.getSalesOrderItems().firstOrDefault();
		for (int quantity : quantities) {
			ISalesDeliveryItem line = delivery.getSalesDeliveryItems().create();
			line.setItemCode(source.getItemCode());
			line.setWarehouse(source.getWarehouse());
			line.setPrice(source.getPrice());
			line.setQuantity(Decimals.valueOf(quantity));
			line.setBaseDocumentType(source.getObjectCode());
			line.setBaseDocumentEntry(source.getDocEntry());
			line.setBaseDocumentLineId(source.getLineId());
		}
		return delivery;
	}

	private void seedInventory(BORepositoryMaterials repo, IMaterial material, IWarehouse warehouse) {
		org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt receipt = new org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt();
		org.colorcoding.ibas.materials.bo.goodsreceipt.IGoodsReceiptLine line = receipt.getGoodsReceiptLines().create();
		line.setItemCode(material.getCode());
		line.setWarehouse(warehouse.getCode());
		line.setQuantity(Decimals.valueOf(20));
		line.setPrice(Decimals.valueOf(20));
		BOUtilities.valueOf(repo.saveGoodsReceipt(receipt));
	}

	public void testSL_C53_ExcessSecondLineRollsBackWholeDelivery() throws Exception {
		String previous = MyConfiguration.getConfigValue(MyConfiguration.CONFIG_ITEM_LIMIT_CLOSED_QUANTIT_DOCUMENTS);
		try (BORepositoryMaterials materials = createMaterialsRepository();
				BORepositoryBusinessPartner partners = createBPRepository();
				BORepositorySales repo = createSalesRepository()) {
			IWarehouse warehouse = prepareWarehouse(materials);
			IMaterial material = prepareMaterial(materials, MaterialKind.INVENTORY, "SaLIMIT");
			ICustomer partner = prepareCustomer(partners);
			seedInventory(materials, material, warehouse);
			ISalesOrder order = createOrder(repo, partner, material, warehouse);
			MyConfiguration.create().addConfigValue(MyConfiguration.CONFIG_ITEM_LIMIT_CLOSED_QUANTIT_DOCUMENTS, order.getObjectCode() + ";");
			ISalesDelivery document = delivery(order, 6, 6);
			document.setReference1(material.getCode());
			IOperationResult<ISalesDelivery> result = repo.saveSalesDelivery(document);
			assertTrue("Second line must be rejected for exceeding source quantity.", result.getError() instanceof BusinessLogicException);
			assertEquals(I18N.prop("msg_mm_document_closed_quantity_exceeds_quantity",
					BOIdentifierBuilder.document(order.getObjectCode(), order.getDocEntry(),
							order.getSalesOrderItems().firstOrDefault().getLineId()).build()), result.getError().getMessage());
			ISalesOrder savedOrder = BOUtilities.valueOf(repo.fetchSalesOrder(order.getCriteria())).firstOrDefault();
			assertEqualsBD("Failed delivery must not close its source.", BigDecimal.ZERO,
					savedOrder.getSalesOrderItems().firstOrDefault().getClosedQuantity());
			assertQuantities(materials, material, warehouse.getCode(), Decimals.valueOf(20),
					Decimals.valueOf(10), Decimals.valueOf(0));
			ICriteria failedCriteria = new Criteria();
			failedCriteria.getConditions().create().setAlias("Reference1");
			failedCriteria.getConditions().get(0).setValue(material.getCode());
			assertTrue("Failed document must not persist.", BOUtilities.valueOf(repo.fetchSalesDelivery(failedCriteria)).isEmpty());
		} finally {
			MyConfiguration.create().addConfigValue(MyConfiguration.CONFIG_ITEM_LIMIT_CLOSED_QUANTIT_DOCUMENTS, previous == null ? "" : previous);
		}
	}

	public void testSL_C54_RepeatedDeliverySaveDoesNotDuplicateSourceQuantity() throws Exception {
		try (BORepositoryMaterials materials = createMaterialsRepository();
				BORepositoryBusinessPartner partners = createBPRepository();
				BORepositorySales repo = createSalesRepository()) {
			IWarehouse warehouse = prepareWarehouse(materials);
			IMaterial material = prepareMaterial(materials, MaterialKind.INVENTORY, "SaDSAVE");
			ICustomer partner = prepareCustomer(partners);
			seedInventory(materials, material, warehouse);
			ISalesOrder order = createOrder(repo, partner, material, warehouse);
			ISalesDelivery document = BOUtilities.valueOf(repo.saveSalesDelivery(delivery(order, 4))).firstOrDefault();
			document = BOUtilities.valueOf(repo.saveSalesDelivery(document)).firstOrDefault();
			ISalesOrder savedOrder = BOUtilities.valueOf(repo.fetchSalesOrder(order.getCriteria())).firstOrDefault();
			assertEqualsBD("Repeated save must close source only once.", Decimals.valueOf(4),
					savedOrder.getSalesOrderItems().firstOrDefault().getClosedQuantity());
			assertQuantities(materials, material, warehouse.getCode(), Decimals.valueOf(16),
					Decimals.valueOf(6), Decimals.valueOf(0));
			document.setCanceled(emYesNo.YES);
			document = BOUtilities.valueOf(repo.saveSalesDelivery(document)).firstOrDefault();
			BOUtilities.valueOf(repo.saveSalesDelivery(document));
			savedOrder = BOUtilities.valueOf(repo.fetchSalesOrder(order.getCriteria())).firstOrDefault();
			assertEqualsBD("Repeated cancellation must reopen source only once.", BigDecimal.ZERO,
					savedOrder.getSalesOrderItems().firstOrDefault().getClosedQuantity());
			assertQuantities(materials, material, warehouse.getCode(), Decimals.valueOf(20),
					Decimals.valueOf(10), Decimals.valueOf(0));
		}
	}
}
