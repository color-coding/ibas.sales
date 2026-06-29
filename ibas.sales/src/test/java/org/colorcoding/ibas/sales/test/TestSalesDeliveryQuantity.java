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
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 销售交货 数量逻辑 测试（基于销售订单）。
 *
 * <p>覆盖：SL-C20 ~ SL-C29</p>
 * <p>核心 logic：MaterialInventoryService（OnHand-）、MaterialCommitedService（OnCommited-）、
 * DocumentQuantityClosingService（SO.closedQuantity / lineStatus 推进）</p>
 */
public class TestSalesDeliveryQuantity extends AbstractSalesQuantityTestCase {

	private static final BigDecimal QTY = Decimals.valueOf(10);
	private static final BigDecimal PRICE = Decimals.valueOf(50);

	private BORepositorySales createSalesRepository() throws Exception {
		BORepositorySales repo = new BORepositorySales();
		repo.setUserToken(org.colorcoding.ibas.bobas.organization.OrganizationFactory.SYSTEM_USER);
		return repo;
	}

	// ---------------- 构造 ----------------

	/** 1. 准备先决条件：仓库 + 客户 + 物料 + 已收货保证 OnHand 足够。
	 *  注意：批次/序列号 code 必须基于物料编码（确定性），后续 SD 才能复用 */
	private void seedInventory(BORepositoryMaterials mRepo, IMaterial mt, IWarehouse wh, BigDecimal qty,
			MaterialKind kind) throws Exception {
		org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt gr =
				new org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt();
		gr.setReference1("seed-" + kind.name());
		org.colorcoding.ibas.materials.bo.goodsreceipt.IGoodsReceiptLine line = gr.getGoodsReceiptLines().create();
		line.setItemCode(mt.getCode());
		line.setQuantity(qty);
		line.setPrice(Decimals.valueOf(20));
		line.setWarehouse(wh.getCode());
		line.setBatchManagement(mt.getBatchManagement());
		line.setSerialManagement(mt.getSerialManagement());
		if (kind == MaterialKind.BATCH) {
			IMaterialBatchItem b = line.getMaterialBatches().create();
			b.setBatchCode(batchCodeOf(mt));
			b.setQuantity(qty);
		} else if (kind == MaterialKind.SERIAL) {
			int n = qty.intValue();
			for (int i = 0; i < n; i++) {
				IMaterialSerialItem s = line.getMaterialSerials().create();
				s.setSerialCode(serialCodeOf(mt, i));
			}
		}
		BOUtilities.valueOf(mRepo.saveGoodsReceipt(gr)).firstOrDefault();
	}

	/** 物料对应的确定性批次编码 */
	private static String batchCodeOf(IMaterial mt) {
		return batchCodeOfItem(mt.getCode());
	}

	private static String batchCodeOfItem(String itemCode) {
		return "B-" + itemCode;
	}

	/** 物料对应的确定性序列号编码 */
	private static String serialCodeOf(IMaterial mt, int index) {
		return serialCodeOfItem(mt.getCode(), index);
	}

	private static String serialCodeOfItem(String itemCode, int index) {
		return "S-" + itemCode + "-" + index;
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

	/** 基于 SO 创建 SD，逐行携带 base 引用 */
	private ISalesDelivery buildDeliveryFromOrder(ISalesOrder so, MaterialKind kind, BigDecimal qty) {
		ISalesDelivery sd = new SalesDelivery();
		sd.setCustomerCode(so.getCustomerCode());
		ISalesOrderItem soi = so.getSalesOrderItems().firstOrDefault();
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
			b.setBatchCode(batchCodeOfItem(soi.getItemCode()));
			b.setQuantity(qty);
		} else if (kind == MaterialKind.SERIAL) {
			int n = qty.intValue();
			for (int i = 0; i < n; i++) {
				IMaterialSerialItem s = sdi.getMaterialSerials().create();
				s.setSerialCode(serialCodeOfItem(soi.getItemCode(), i));
			}
		}
		return sd;
	}

	private ISalesOrder reload(BORepositorySales sRepo, ISalesOrder so) throws Exception {
		return BOUtilities.valueOf(sRepo.fetchSalesOrder(so.getCriteria())).firstOrDefault();
	}

	// ==================================================================
	// SL-C20: SD 基于 SO -> OnHand-Q, OnCommited-Q, SO.closedQuantity+=Q
	// ==================================================================

	public void testSL_C20_DeliveryFromOrder_Inventory() throws Exception {
		runDeliveryFromOrder(MaterialKind.INVENTORY, "C20I");
	}

	public void testSL_C20_DeliveryFromOrder_Batch() throws Exception {
		runDeliveryFromOrder(MaterialKind.BATCH, "C20B");
	}

	public void testSL_C20_DeliveryFromOrder_Serial() throws Exception {
		runDeliveryFromOrder(MaterialKind.SERIAL, "C20N");
	}

	private void runDeliveryFromOrder(MaterialKind kind, String tag) throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, kind, tag);

			// 预先入库 10，使 OnHand=10
			seedInventory(mRepo, mt, wh, QTY, kind);
			assertQuantities(mRepo, mt, wh.getCode(), QTY, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			// 创建销售订单 10，OnCommited+=10
			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);
			assertQuantities(mRepo, mt, wh.getCode(), QTY, QTY, Decimals.VALUE_ZERO);

			// 基于 SO 全量交货 10：OnHand-10, OnCommited-10
			ISalesDelivery sd = buildDeliveryFromOrder(so, kind, QTY);
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();
			assertTrue("SD DocEntry assigned.", sd.getDocEntry() > 0);
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			// SO.lineStatus 应推进；closedQuantity = QTY
			ISalesOrder soReload = reload(sRepo, so);
			ISalesOrderItem soiReload = soReload.getSalesOrderItems().firstOrDefault();
			assertEqualsBD("SO.closedQuantity should = QTY.", QTY, soiReload.getClosedQuantity());
			assertEquals("SO line should be FINISHED.", emDocumentStatus.FINISHED, soiReload.getLineStatus());
		}
	}

	// ==================================================================
	// SL-C21: SD 头取消 -> OnHand 回补, OnCommited 回补, SO.closedQuantity 回退
	// ==================================================================

	public void testSL_C21_DeliveryCancel_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C21I");

			seedInventory(mRepo, mt, wh, QTY, MaterialKind.INVENTORY);
			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);

			ISalesDelivery sd = buildDeliveryFromOrder(so, MaterialKind.INVENTORY, QTY);
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			// 取消交货
			sd.setCanceled(emYesNo.YES);
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();

			// OnHand 回补 + OnCommited 回补
			assertQuantities(mRepo, mt, wh.getCode(), QTY, QTY, Decimals.VALUE_ZERO);

			// SO.closedQuantity 回退到 0；lineStatus 回 RELEASED
			ISalesOrder soReload = reload(sRepo, so);
			ISalesOrderItem soiReload = soReload.getSalesOrderItems().firstOrDefault();
			assertEqualsBD("SO.closedQuantity should rollback to 0.", Decimals.VALUE_ZERO,
					soiReload.getClosedQuantity());
			assertEquals("SO line should be RELEASED.", emDocumentStatus.RELEASED, soiReload.getLineStatus());
		}
	}

	// ==================================================================
	// SL-C22: SD 头删除 -> 与 C21 同
	// ==================================================================

	public void testSL_C22_DeliveryDelete_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C22I");

			seedInventory(mRepo, mt, wh, QTY, MaterialKind.INVENTORY);
			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);

			ISalesDelivery sd = buildDeliveryFromOrder(so, MaterialKind.INVENTORY, QTY);
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();

			sd.delete();
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();

			assertQuantities(mRepo, mt, wh.getCode(), QTY, QTY, Decimals.VALUE_ZERO);

			ISalesOrder soReload = reload(sRepo, so);
			ISalesOrderItem soiReload = soReload.getSalesOrderItems().firstOrDefault();
			assertEqualsBD("SO.closedQuantity should rollback to 0.", Decimals.VALUE_ZERO,
					soiReload.getClosedQuantity());
		}
	}

	// ==================================================================
	// SL-C24: 部分交货 -> SO.lineStatus=PROCESSING, closedQuantity=部分
	// ==================================================================

	public void testSL_C24_PartialDelivery_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C24I");

			seedInventory(mRepo, mt, wh, QTY, MaterialKind.INVENTORY);
			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);

			// 部分交货 6
			ISalesDelivery sd = buildDeliveryFromOrder(so, MaterialKind.INVENTORY, Decimals.valueOf(6));
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();

			// OnHand=4, OnCommited=4（未交货部分）
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.valueOf(4), Decimals.valueOf(4), Decimals.VALUE_ZERO);

			ISalesOrder soReload = reload(sRepo, so);
			ISalesOrderItem soiReload = soReload.getSalesOrderItems().firstOrDefault();
			assertEqualsBD("SO.closedQuantity = 6.", Decimals.valueOf(6), soiReload.getClosedQuantity());
		}
	}

	// ==================================================================
	// SL-C28: 服务物料 SD -> 仅推进 closedQuantity，不影响 OnHand
	// ==================================================================

	public void testSL_C28_ServiceDelivery_NoOnHand() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.SERVICE, "C28S");

			ISalesOrder so = createOrder(sRepo, cu, mt, wh, QTY);
			ISalesDelivery sd = buildDeliveryFromOrder(so, MaterialKind.SERVICE, QTY);
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();
			assertTrue("SD saved for service.", sd.getDocEntry() > 0);

			// 物料层三量恒 0
			IMaterial m = BOUtilities.valueOf(mRepo.fetchMaterial(mt.getCriteria())).firstOrDefault();
			assertEqualsBD("Service OnHand=0.", Decimals.VALUE_ZERO, m.getOnHand());

			// SO.closedQuantity 已推进
			ISalesOrder soReload = reload(sRepo, so);
			ISalesOrderItem soiReload = soReload.getSalesOrderItems().firstOrDefault();
			assertEqualsBD("Service SO.closedQuantity = QTY.", QTY, soiReload.getClosedQuantity());
		}
	}

	// ==================================================================
	// SL-C29: 独立 SD（不基于上游）-> 仅 OnHand-Q
	// ==================================================================

	public void testSL_C29_IndependentDelivery_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C29I");

			seedInventory(mRepo, mt, wh, QTY, MaterialKind.INVENTORY);

			ISalesDelivery sd = new SalesDelivery();
			sd.setCustomerCode(cu.getCode());
			ISalesDeliveryItem sdi = sd.getSalesDeliveryItems().create();
			sdi.setItemCode(mt.getCode());
			sdi.setQuantity(QTY);
			sdi.setPrice(PRICE);
			sdi.setWarehouse(wh.getCode());
			sdi.setBatchManagement(mt.getBatchManagement());
			sdi.setSerialManagement(mt.getSerialManagement());
			sd = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd)).firstOrDefault();

			// 没有 SO，故 OnCommited 不变；OnHand 扣减
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);
		}
	}
}
