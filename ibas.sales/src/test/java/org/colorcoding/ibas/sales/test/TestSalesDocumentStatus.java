package org.colorcoding.ibas.sales.test;

import java.math.BigDecimal;

import org.colorcoding.ibas.accounting.MyConfiguration;
import org.colorcoding.ibas.bobas.bo.BOUtilities;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.businesspartner.bo.customer.ICustomer;
import org.colorcoding.ibas.businesspartner.repository.BORepositoryBusinessPartner;
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

/**
 * 销售单据 头级 documentStatus 维度 测试。
 *
 * <p>无会计分录时，计划状态回退库存及源单据关闭数量；已有分录时必须拒绝并保持数据库原值。</p>
 * <p>覆盖：SL-C09（SO documentStatus）/ SL-C23（SD documentStatus）</p>
 */
public class TestSalesDocumentStatus extends AbstractSalesQuantityTestCase {

	private static final BigDecimal QTY = Decimals.valueOf(10);

	private void seedInventory(BORepositoryMaterials mRepo, IMaterial mt, IWarehouse wh, BigDecimal qty)
			throws Exception {
		org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt gr =
				new org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt();
		org.colorcoding.ibas.materials.bo.goodsreceipt.IGoodsReceiptLine line = gr.getGoodsReceiptLines().create();
		line.setItemCode(mt.getCode());
		line.setQuantity(qty);
		line.setPrice(Decimals.valueOf(20));
		line.setCurrency(org.colorcoding.ibas.accounting.MyConfiguration
				.getConfigValue(org.colorcoding.ibas.accounting.MyConfiguration.CONFIG_ITEM_LOCAL_CURRENCY));
		line.setRate(Decimals.VALUE_ONE);
		line.setWarehouse(wh.getCode());
		line.setBatchManagement(mt.getBatchManagement());
		line.setSerialManagement(mt.getSerialManagement());
		BOUtilities.valueOf(mRepo.saveGoodsReceipt(gr)).firstOrDefault();
	}

	// ==================================================================
	// SL-C09: SO 头 documentStatus=PLANNED -> OnCommited 回滚
	// ==================================================================

	public void testSL_C09_SO_DocumentStatusPlanned_Rollback() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C09I");

			ISalesOrder so = new SalesOrder();
			so.setCustomerCode(cu.getCode());
			ISalesOrderItem soi = so.getSalesOrderItems().create();
			soi.setItemCode(mt.getCode());
			soi.setQuantity(QTY);
			soi.setPrice(Decimals.valueOf(50));
			soi.setWarehouse(wh.getCode());
			soi.setBatchManagement(mt.getBatchManagement());
			soi.setSerialManagement(mt.getSerialManagement());
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, QTY, Decimals.VALUE_ZERO);

			so.setDocumentStatus(emDocumentStatus.PLANNED);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-C23: SD 头 documentStatus=PLANNED -> 无分录时回滚，有分录时拒绝并保持原数量
	// ==================================================================

	public void testSL_C23_SD_DocumentStatusPlanned_Rollback() throws Exception {
		runSL_C23_SD_DocumentStatusPlanned(false);
	}

	public void testSL_C23_SD_DocumentStatusPlanned_WithJournalEntry() throws Exception {
		runSL_C23_SD_DocumentStatusPlanned(true);
	}

	private void runSL_C23_SD_DocumentStatusPlanned(boolean journalEntryEnabled) throws Exception {
		boolean previous = MyConfiguration.getConfigValue(MyConfiguration.CONFIG_ITEM_ENABLE_JOURNAL_ENTRY_SERVICE, false);
		MyConfiguration.create().addConfigValue(MyConfiguration.CONFIG_ITEM_ENABLE_JOURNAL_ENTRY_SERVICE,
				String.valueOf(journalEntryEnabled));
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, journalEntryEnabled ? "C23IJ" : "C23I");

			seedInventory(mRepo, mt, wh, QTY);

			ISalesOrder so = new SalesOrder();
			so.setCustomerCode(cu.getCode());
			ISalesOrderItem soi = so.getSalesOrderItems().create();
			soi.setItemCode(mt.getCode());
			soi.setQuantity(QTY);
			soi.setPrice(Decimals.valueOf(50));
			soi.setWarehouse(wh.getCode());
			soi.setBatchManagement(mt.getBatchManagement());
			soi.setSerialManagement(mt.getSerialManagement());
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();

			ISalesOrderItem soiSaved = so.getSalesOrderItems().firstOrDefault();
			ISalesDelivery sd = new SalesDelivery();
			sd.setCustomerCode(so.getCustomerCode());
			ISalesDeliveryItem sdi = sd.getSalesDeliveryItems().create();
			sdi.setItemCode(soiSaved.getItemCode());
			sdi.setQuantity(soiSaved.getQuantity());
			sdi.setPrice(soiSaved.getPrice());
			sdi.setWarehouse(soiSaved.getWarehouse());
			sdi.setBatchManagement(soiSaved.getBatchManagement());
			sdi.setSerialManagement(soiSaved.getSerialManagement());
			sdi.setBaseDocumentType(soiSaved.getObjectCode());
			sdi.setBaseDocumentEntry(soiSaved.getDocEntry());
			sdi.setBaseDocumentLineId(soiSaved.getLineId());
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			// 切 SD documentStatus = PLANNED
			sd.setDocumentStatus(emDocumentStatus.PLANNED);
			if (journalEntryEnabled) {
				try {
					BOUtilities.valueOf(sRepo.saveSalesDelivery(sd));
					fail("Document with journal entries must reject status change.");
				} catch (BusinessLogicException e) {
					assertEquals(I18N.prop("msg_ac_document_has_journalentry_not_allowed_change_status", sd.toString()),
							e.getMessage());
				}
				ISalesDelivery deliveryReload = BOUtilities.valueOf(sRepo.fetchSalesDelivery(sd.getCriteria()))
						.firstOrDefault();
				assertEquals(emDocumentStatus.RELEASED, deliveryReload.getDocumentStatus());
				assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);
				ISalesOrder orderReload = BOUtilities.valueOf(sRepo.fetchSalesOrder(so.getCriteria())).firstOrDefault();
				assertEqualsBD("Order.closedQuantity must remain unchanged.", QTY,
						orderReload.getSalesOrderItems().sum(c -> c.getClosedQuantity()));
				return;
			}
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();

			// OnHand 回补；OnCommited 回补（SO 重新预留）
			assertQuantities(mRepo, mt, wh.getCode(), QTY, QTY, Decimals.VALUE_ZERO);

			// SO.closedQuantity 回退到 0
			ISalesOrder soReload = BOUtilities.valueOf(sRepo.fetchSalesOrder(so.getCriteria())).firstOrDefault();
			assertEqualsBD("SO.closedQuantity rollback.", Decimals.VALUE_ZERO,
					soReload.getSalesOrderItems().sum(c -> c.getClosedQuantity()));
		} finally {
			MyConfiguration.create().addConfigValue(MyConfiguration.CONFIG_ITEM_ENABLE_JOURNAL_ENTRY_SERVICE,
					String.valueOf(previous));
		}
	}
}
