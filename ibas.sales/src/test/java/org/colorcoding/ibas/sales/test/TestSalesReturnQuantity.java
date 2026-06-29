package org.colorcoding.ibas.sales.test;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.bo.BOUtilities;
import org.colorcoding.ibas.bobas.common.DateTimes;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.businesspartner.bo.customer.ICustomer;
import org.colorcoding.ibas.businesspartner.repository.BORepositoryBusinessPartner;
import org.colorcoding.ibas.materials.bo.material.IMaterial;
import org.colorcoding.ibas.materials.bo.materialbatch.IMaterialBatchItem;
import org.colorcoding.ibas.materials.bo.materialserial.IMaterialSerialItem;
import org.colorcoding.ibas.materials.bo.warehouse.IWarehouse;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturnItem;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 销售退货 数量逻辑 测试。
 *
 * <p>覆盖：SL-C40 ~ SL-C45</p>
 * <p>核心 logic：MaterialInventoryService（OnHand+）、DocumentQuantityReturnService（SD/SO.closedQuantity 回退）</p>
 */
public class TestSalesReturnQuantity extends AbstractSalesQuantityTestCase {

	private static final BigDecimal QTY = Decimals.valueOf(10);
	private static final BigDecimal PRICE = Decimals.valueOf(50);

	private BORepositorySales createSalesRepository() throws Exception {
		BORepositorySales repo = new BORepositorySales();
		repo.setUserToken(org.colorcoding.ibas.bobas.organization.OrganizationFactory.SYSTEM_USER);
		return repo;
	}

	// ---------------- 通用 ----------------

	private void seedInventory(BORepositoryMaterials mRepo, IMaterial mt, IWarehouse wh, BigDecimal qty,
			MaterialKind kind) throws Exception {
		org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt gr =
				new org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt();
		org.colorcoding.ibas.materials.bo.goodsreceipt.IGoodsReceiptLine line = gr.getGoodsReceiptLines().create();
		line.setItemCode(mt.getCode());
		line.setQuantity(qty);
		line.setPrice(Decimals.valueOf(20));
		line.setWarehouse(wh.getCode());
		line.setBatchManagement(mt.getBatchManagement());
		line.setSerialManagement(mt.getSerialManagement());
		if (kind == MaterialKind.BATCH) {
			IMaterialBatchItem b = line.getMaterialBatches().create();
			b.setBatchCode("BSR-" + DateTimes.now().toString("yyyyMMddHHmmss"));
			b.setQuantity(qty);
		} else if (kind == MaterialKind.SERIAL) {
			int n = qty.intValue();
			for (int i = 0; i < n; i++) {
				IMaterialSerialItem s = line.getMaterialSerials().create();
				s.setSerialCode("SSR-" + DateTimes.now().toString("yyyyMMddHHmmss") + "-" + i);
			}
		}
		BOUtilities.valueOf(mRepo.saveGoodsReceipt(gr)).firstOrDefault();
	}

	private ISalesOrder createOrder(BORepositorySales sRepo, ICustomer cu, IMaterial mt, IWarehouse wh, BigDecimal qty)
			throws Exception {
		ISalesOrder so = new SalesOrder();
		so.setCustomerCode(cu.getCode());
		ISalesOrderItem it = so.getSalesOrderItems().create();
		it.setItemCode(mt.getCode());
		it.setQuantity(qty);
		it.setPrice(PRICE);
		it.setWarehouse(wh.getCode());
		it.setBatchManagement(mt.getBatchManagement());
		it.setSerialManagement(mt.getSerialManagement());
		return BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
	}

	private ISalesDelivery createDelivery(BORepositorySales sRepo, ISalesOrder so, MaterialKind kind, BigDecimal qty)
			throws Exception {
		ISalesOrderItem soi = so.getSalesOrderItems().firstOrDefault();
		ISalesDelivery sd = new SalesDelivery();
		sd.setCustomerCode(so.getCustomerCode());
		ISalesDeliveryItem sdi = sd.getSalesDeliveryItems().create();
		sdi.setItemCode(soi.getItemCode());
		sdi.setQuantity(qty);
		sdi.setPrice(soi.getPrice());
		sdi.setWarehouse(soi.getWarehouse());
		sdi.setBatchManagement(soi.getBatchManagement());
		sdi.setSerialManagement(soi.getSerialManagement());
		sdi.setBaseDocumentType(soi.getObjectCode());
		sdi.setBaseDocumentEntry(soi.getDocEntry());
		sdi.setBaseDocumentLineId(soi.getLineId());
		if (kind == MaterialKind.BATCH) {
			IMaterialBatchItem b = sdi.getMaterialBatches().create();
			b.setBatchCode("BSR-" + DateTimes.now().toString("yyyyMMddHHmmss"));
			b.setQuantity(qty);
		} else if (kind == MaterialKind.SERIAL) {
			int n = qty.intValue();
			for (int i = 0; i < n; i++) {
				IMaterialSerialItem s = sdi.getMaterialSerials().create();
				s.setSerialCode("SSR-" + DateTimes.now().toString("yyyyMMddHHmmss") + "-" + i);
			}
		}
		return BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();
	}

	private ISalesOrder reloadSO(BORepositorySales sRepo, ISalesOrder so) throws Exception {
		return BOUtilities.valueOf(sRepo.fetchSalesOrder(so.getCriteria())).firstOrDefault();
	}

	private ISalesDelivery reloadSD(BORepositorySales sRepo, ISalesDelivery sd) throws Exception {
		return BOUtilities.valueOf(sRepo.fetchSalesDelivery(sd.getCriteria())).firstOrDefault();
	}

	// ==================================================================
	// SL-C40: SR 基于 SD -> OnHand+Q (退回库存)，SD.closedQuantity 增加 (SR 关闭 SD)
	//   关键：SalesReturnItem 在 baseDoc!=SO 时实现 IDocumentQuantityClosingContract
	//        意味着 SR 退货实际"消化"了 SD 的剩余量，SD.closedQuantity += SR.qty
	// ==================================================================

	public void testSL_C40_ReturnFromDelivery_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C40I");

			seedInventory(mRepo, mt, wh, QTY, MaterialKind.INVENTORY);
			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);
			ISalesDelivery sd = createDelivery(sRepo, so, MaterialKind.INVENTORY, QTY);
			// 此时 OnHand=0, OnCommited=0
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			// 基于 SD 退货
			ISalesDeliveryItem sdi = sd.getSalesDeliveryItems().firstOrDefault();
			ISalesReturn sr = new SalesReturn();
			sr.setCustomerCode(sd.getCustomerCode());
			ISalesReturnItem sri = sr.getSalesReturnItems().create();
			sri.setItemCode(sdi.getItemCode());
			sri.setQuantity(QTY);
			sri.setPrice(sdi.getPrice());
			sri.setWarehouse(sdi.getWarehouse());
			sri.setBatchManagement(sdi.getBatchManagement());
			sri.setSerialManagement(sdi.getSerialManagement());
			sri.setBaseDocumentType(sdi.getObjectCode());
			sri.setBaseDocumentEntry(sdi.getDocEntry());
			sri.setBaseDocumentLineId(sdi.getLineId());
			sr = BOUtilities.valueOf(sRepo.saveSalesReturn(sr)).firstOrDefault();
			assertTrue("SR DocEntry assigned.", sr.getDocEntry() > 0);

			// OnHand 回库
			assertQuantities(mRepo, mt, wh.getCode(), QTY, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			// SD.closedQuantity 回退
			ISalesDelivery sdReload = reloadSD(sRepo, sd);
			ISalesDeliveryItem sdiReload = sdReload.getSalesDeliveryItems().firstOrDefault();
			assertEqualsBD("SD.closedQuantity should advance by SR.qty.", QTY, sdiReload.getClosedQuantity());
		}
	}

	// ==================================================================
	// SL-C41: SR 基于 SO -> OnCommited 不变, SO.closedQuantity 回退
	//   适用于"未交货直接退货"场景：仅作 SO 的关闭量退回
	// ==================================================================

	public void testSL_C41_ReturnFromOrder_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C41I");

			seedInventory(mRepo, mt, wh, QTY, MaterialKind.INVENTORY);
			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);
			// 先让 SO 全量交货使 closedQuantity = QTY，lineStatus=FINISHED
			createDelivery(sRepo, so, MaterialKind.INVENTORY, QTY);

			ISalesOrder soReload = reloadSO(sRepo, so);
			ISalesOrderItem soi = soReload.getSalesOrderItems().firstOrDefault();

			// 基于 SO 退货：closedQuantity 应退回到 0
			ISalesReturn sr = new SalesReturn();
			sr.setCustomerCode(soReload.getCustomerCode());
			ISalesReturnItem sri = sr.getSalesReturnItems().create();
			sri.setItemCode(soi.getItemCode());
			sri.setQuantity(QTY);
			sri.setPrice(soi.getPrice());
			sri.setWarehouse(soi.getWarehouse());
			sri.setBatchManagement(soi.getBatchManagement());
			sri.setSerialManagement(soi.getSerialManagement());
			sri.setBaseDocumentType(soi.getObjectCode());
			sri.setBaseDocumentEntry(soi.getDocEntry());
			sri.setBaseDocumentLineId(soi.getLineId());
			sr = BOUtilities.valueOf(sRepo.saveSalesReturn(sr)).firstOrDefault();
			assertTrue("SR DocEntry assigned.", sr.getDocEntry() > 0);

			ISalesOrder soReload2 = reloadSO(sRepo, so);
			ISalesOrderItem soi2 = soReload2.getSalesOrderItems().firstOrDefault();
			assertEqualsBD("SO.closedQuantity should rollback.", Decimals.VALUE_ZERO, soi2.getClosedQuantity());
			assertEquals("SO.lineStatus should be RELEASED again.", emDocumentStatus.RELEASED, soi2.getLineStatus());
		}
	}

	// ==================================================================
	// SL-C42: SR 取消/删除 -> 反向 (OnHand-Q, closedQuantity 推回)
	// ==================================================================

	public void testSL_C42_ReturnCancel_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C42I");

			seedInventory(mRepo, mt, wh, QTY, MaterialKind.INVENTORY);
			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);
			ISalesDelivery sd = createDelivery(sRepo, so, MaterialKind.INVENTORY, QTY);

			ISalesDeliveryItem sdi = sd.getSalesDeliveryItems().firstOrDefault();
			ISalesReturn sr = new SalesReturn();
			sr.setCustomerCode(sd.getCustomerCode());
			ISalesReturnItem sri = sr.getSalesReturnItems().create();
			sri.setItemCode(sdi.getItemCode());
			sri.setQuantity(QTY);
			sri.setPrice(sdi.getPrice());
			sri.setWarehouse(sdi.getWarehouse());
			sri.setBatchManagement(sdi.getBatchManagement());
			sri.setSerialManagement(sdi.getSerialManagement());
			sri.setBaseDocumentType(sdi.getObjectCode());
			sri.setBaseDocumentEntry(sdi.getDocEntry());
			sri.setBaseDocumentLineId(sdi.getLineId());
			sr = BOUtilities.valueOf(sRepo.saveSalesReturn(sr)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), QTY, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			// 取消退货
			sr.setCanceled(emYesNo.YES);
			sr = BOUtilities.valueOf(sRepo.saveSalesReturn(sr)).firstOrDefault();

			// OnHand 回到 0；SD.closedQuantity 回到 QTY
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);
			ISalesDelivery sdReload = reloadSD(sRepo, sd);
			ISalesDeliveryItem sdiReload = sdReload.getSalesDeliveryItems().firstOrDefault();
			assertEqualsBD("SD.closedQuantity rollback after SR cancel.", Decimals.VALUE_ZERO,
					sdiReload.getClosedQuantity());
		}
	}

	// ==================================================================
	// SL-C43: SR 部分退货 -> SD.closedQuantity = QTY - partial
	// ==================================================================

	public void testSL_C43_PartialReturn_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C43I");

			seedInventory(mRepo, mt, wh, QTY, MaterialKind.INVENTORY);
			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);
			ISalesDelivery sd = createDelivery(sRepo, so, MaterialKind.INVENTORY, QTY);

			ISalesDeliveryItem sdi = sd.getSalesDeliveryItems().firstOrDefault();
			ISalesReturn sr = new SalesReturn();
			sr.setCustomerCode(sd.getCustomerCode());
			ISalesReturnItem sri = sr.getSalesReturnItems().create();
			sri.setItemCode(sdi.getItemCode());
			sri.setQuantity(Decimals.valueOf(4));
			sri.setPrice(sdi.getPrice());
			sri.setWarehouse(sdi.getWarehouse());
			sri.setBatchManagement(sdi.getBatchManagement());
			sri.setSerialManagement(sdi.getSerialManagement());
			sri.setBaseDocumentType(sdi.getObjectCode());
			sri.setBaseDocumentEntry(sdi.getDocEntry());
			sri.setBaseDocumentLineId(sdi.getLineId());
			sr = BOUtilities.valueOf(sRepo.saveSalesReturn(sr)).firstOrDefault();

			// 部分退货：OnHand 加回 4
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.valueOf(4), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			ISalesDelivery sdReload = reloadSD(sRepo, sd);
			ISalesDeliveryItem sdiReload = sdReload.getSalesDeliveryItems().firstOrDefault();
			// SR.qty=4 关闭了 SD 的 4 个量
			assertEqualsBD("SD.closedQuantity after partial return.", Decimals.valueOf(4),
					sdiReload.getClosedQuantity());
		}
	}

	// ==================================================================
	// SL-C45: 服务物料 SR -> 仅 closedQuantity 退回，不影响 OnHand
	// ==================================================================

	public void testSL_C45_ServiceReturn_NoOnHand() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.SERVICE, "C45S");

			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);
			ISalesDelivery sd = createDelivery(sRepo, so, MaterialKind.SERVICE, QTY);

			ISalesDeliveryItem sdi = sd.getSalesDeliveryItems().firstOrDefault();
			ISalesReturn sr = new SalesReturn();
			sr.setCustomerCode(sd.getCustomerCode());
			ISalesReturnItem sri = sr.getSalesReturnItems().create();
			sri.setItemCode(sdi.getItemCode());
			sri.setQuantity(QTY);
			sri.setPrice(sdi.getPrice());
			sri.setWarehouse(sdi.getWarehouse());
			sri.setBatchManagement(sdi.getBatchManagement());
			sri.setSerialManagement(sdi.getSerialManagement());
			sri.setBaseDocumentType(sdi.getObjectCode());
			sri.setBaseDocumentEntry(sdi.getDocEntry());
			sri.setBaseDocumentLineId(sdi.getLineId());
			sr = BOUtilities.valueOf(sRepo.saveSalesReturn(sr)).firstOrDefault();
			assertTrue("SR for service saved.", sr.getDocEntry() > 0);

			// 服务物料 OnHand 始终 0
			IMaterial m = BOUtilities.valueOf(mRepo.fetchMaterial(mt.getCriteria())).firstOrDefault();
			assertEqualsBD("Service OnHand=0 after return.", Decimals.VALUE_ZERO, m.getOnHand());

			// SD.closedQuantity 回退
			ISalesDelivery sdReload = reloadSD(sRepo, sd);
			ISalesDeliveryItem sdiReload = sdReload.getSalesDeliveryItems().firstOrDefault();
			assertEqualsBD("Service SD.closedQuantity advance by SR.qty.", QTY, sdiReload.getClosedQuantity());
		}
	}
}
