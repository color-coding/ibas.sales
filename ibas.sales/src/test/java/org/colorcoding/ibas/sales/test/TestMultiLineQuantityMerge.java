package org.colorcoding.ibas.sales.test;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.bo.BOUtilities;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;
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
 * 多行同物料 + 下游多行基于同一上游行的数量合并 测试。
 *
 * <p>基于 LOGIC-MATRIX §1.6 推导：</p>
 * <ul>
 * <li>MaterialCommitedJournalService.fetchBeAffected 按 baseDocumentLineId 查找 journal，
 *     每行创建独立 journal，但 impact 到同一 Material.OnCommited 上累加</li>
 * <li>DocumentQuantityClosingService.impact 按 lineId 匹配上游行，
 *     closedQuantity 逐次累加（多行基于同一上游行时累加）</li>
 * </ul>
 *
 * <p>覆盖：</p>
 * <ul>
 * <li>SL-M01：SO 两行同物料 → OnCommited = 行1 + 行2</li>
 * <li>SL-M02：SO 两行同物料，取消其中一行 → OnCommited 仅减去被取消行</li>
 * <li>SL-M03：SD 两行基于 SO 同一行 → SO.closedQuantity = 行1 + 行2</li>
 * <li>SL-M04：SD 两行基于 SO 同一行，取消其中一行 → SO.closedQuantity 仅减去被取消行</li>
 * <li>SL-M05：SD 两行基于 SO 同一行，合计超出 SO 行数量 → 默认不抛异常（除非配置限制）</li>
 * </ul>
 */
public class TestMultiLineQuantityMerge extends AbstractSalesQuantityTestCase {

	private BORepositorySales createSalesRepository() throws Exception {
		BORepositorySales repo = new BORepositorySales();
		repo.setUserToken(OrganizationFactory.SYSTEM_USER);
		return repo;
	}

	private void seedInventory(BORepositoryMaterials mRepo, IMaterial mt, IWarehouse wh, BigDecimal qty)
			throws Exception {
		org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt gr =
				new org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt();
		org.colorcoding.ibas.materials.bo.goodsreceipt.IGoodsReceiptLine line = gr.getGoodsReceiptLines().create();
		line.setItemCode(mt.getCode());
		line.setQuantity(qty);
		line.setPrice(Decimals.valueOf(20));
		line.setWarehouse(wh.getCode());
		line.setBatchManagement(mt.getBatchManagement());
		line.setSerialManagement(mt.getSerialManagement());
		BOUtilities.valueOf(mRepo.saveGoodsReceipt(gr)).firstOrDefault();
	}

	/** 构造 SO，两行同物料，分别 qty1 和 qty2 */
	private ISalesOrder buildOrderTwoLines(ICustomer cu, IMaterial mt, IWarehouse wh, BigDecimal qty1,
			BigDecimal qty2) {
		ISalesOrder so = new SalesOrder();
		so.setCustomerCode(cu.getCode());
		ISalesOrderItem l1 = so.getSalesOrderItems().create();
		l1.setItemCode(mt.getCode());
		l1.setQuantity(qty1);
		l1.setPrice(Decimals.valueOf(50));
		l1.setWarehouse(wh.getCode());
		l1.setBatchManagement(mt.getBatchManagement());
		l1.setSerialManagement(mt.getSerialManagement());
		ISalesOrderItem l2 = so.getSalesOrderItems().create();
		l2.setItemCode(mt.getCode());
		l2.setQuantity(qty2);
		l2.setPrice(Decimals.valueOf(50));
		l2.setWarehouse(wh.getCode());
		l2.setBatchManagement(mt.getBatchManagement());
		l2.setSerialManagement(mt.getSerialManagement());
		return so;
	}

	/** 基于 SO 指定行创建 SD 行 */
	private void addDeliveryLineFromOrderLine(ISalesDelivery sd, ISalesOrderItem soi, BigDecimal qty) {
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
	}

	private ISalesOrder reloadSO(BORepositorySales sRepo, ISalesOrder so) throws Exception {
		return BOUtilities.valueOf(sRepo.fetchSalesOrder(so.getCriteria())).firstOrDefault();
	}

	// ==================================================================
	// SL-M01：SO 两行同物料 (5 + 3) → OnCommited = 8
	//   推导依据：每行创建独立 MaterialEstimateJournal (按 baseDocumentLineId)，
	//   但 impact 到同一 Material.OnCommited 上累加
	// ==================================================================

	public void testSL_M01_TwoLinesSameMaterial_OnCommitedMerged() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "M01I");

			ISalesOrder so = buildOrderTwoLines(cu, mt, wh, Decimals.valueOf(5), Decimals.valueOf(3));
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();

			// OnCommited 应为 5 + 3 = 8
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.valueOf(8),
					Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-M02：SO 两行同物料 (5 + 3)，取消行 2 → OnCommited = 5
	//   推导依据：取消行 2 触发 revoke，仅减去行 2 的 3
	// ==================================================================

	public void testSL_M02_TwoLines_CancelOneLine() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "M02I");

			ISalesOrder so = buildOrderTwoLines(cu, mt, wh, Decimals.valueOf(5), Decimals.valueOf(3));
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.valueOf(8),
					Decimals.VALUE_ZERO);

			// 取消行 2
			so.getSalesOrderItems().get(1).setCanceled(emYesNo.YES);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();

			// OnCommited = 8 - 3 = 5
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.valueOf(5),
					Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-M03：SD 两行基于 SO 同一行 (3 + 4) → SO.closedQuantity = 7
	//   推导依据：DocumentQuantityClosingService.impact 按 lineId 匹配，
	//   每行 SD 保存时 closedQuantity += qty，累加到同一上游行
	// ==================================================================

	public void testSL_M03_TwoDeliveryLines_SameOrderLine_ClosedQuantityAccumulated() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "M03I");

			// 入库 10
			seedInventory(mRepo, mt, wh, Decimals.valueOf(10));

			// SO 一行 qty=10
			ISalesOrder so = new SalesOrder();
			so.setCustomerCode(cu.getCode());
			ISalesOrderItem soi = so.getSalesOrderItems().create();
			soi.setItemCode(mt.getCode());
			soi.setQuantity(Decimals.valueOf(10));
			soi.setPrice(Decimals.valueOf(50));
			soi.setWarehouse(wh.getCode());
			soi.setBatchManagement(mt.getBatchManagement());
			soi.setSerialManagement(mt.getSerialManagement());
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			ISalesOrderItem soiSaved = so.getSalesOrderItems().firstOrDefault();

			// SD 第一行基于 SO.line1，qty=3
			ISalesDelivery sd1 = new SalesDelivery();
			sd1.setCustomerCode(so.getCustomerCode());
			addDeliveryLineFromOrderLine(sd1, soiSaved, Decimals.valueOf(3));
			sd1 = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd1)).firstOrDefault();

			// SO.closedQuantity = 3
			ISalesOrder soReload = reloadSO(sRepo, so);
			assertEqualsBD("SO.closedQuantity = 3 after first SD.", Decimals.valueOf(3),
					soReload.getSalesOrderItems().firstOrDefault().getClosedQuantity());

			// SD 第二行基于 SO.line1，qty=4
			ISalesDelivery sd2 = new SalesDelivery();
			sd2.setCustomerCode(so.getCustomerCode());
			addDeliveryLineFromOrderLine(sd2, soiSaved, Decimals.valueOf(4));
			sd2 = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd2)).firstOrDefault();

			// SO.closedQuantity = 3 + 4 = 7
			soReload = reloadSO(sRepo, so);
			assertEqualsBD("SO.closedQuantity = 7 after second SD.", Decimals.valueOf(7),
					soReload.getSalesOrderItems().firstOrDefault().getClosedQuantity());

			// OnHand = 10 - 3 - 4 = 3
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.valueOf(3), Decimals.valueOf(3),
					Decimals.VALUE_ZERO);
			// OnCommited = 10 - 7 = 3 (journal.quantity=10, journal.closedQuantity=7, effect=3)
		}
	}

	// ==================================================================
	// SL-M04：SD 两行基于 SO 同一行 (3 + 4)，取消第一个 SD → SO.closedQuantity = 4
	//   推导依据：取消 sd1 触发 DocumentQuantityClosingService.revoke，
	//   closedQuantity -= 3，从 7 变 4
	// ==================================================================

	public void testSL_M04_TwoDeliveryLines_CancelFirst_ClosedQuantityPartialRollback() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "M04I");

			seedInventory(mRepo, mt, wh, Decimals.valueOf(10));

			ISalesOrder so = new SalesOrder();
			so.setCustomerCode(cu.getCode());
			ISalesOrderItem soi = so.getSalesOrderItems().create();
			soi.setItemCode(mt.getCode());
			soi.setQuantity(Decimals.valueOf(10));
			soi.setPrice(Decimals.valueOf(50));
			soi.setWarehouse(wh.getCode());
			soi.setBatchManagement(mt.getBatchManagement());
			soi.setSerialManagement(mt.getSerialManagement());
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			ISalesOrderItem soiSaved = so.getSalesOrderItems().firstOrDefault();

			ISalesDelivery sd1 = new SalesDelivery();
			sd1.setCustomerCode(so.getCustomerCode());
			addDeliveryLineFromOrderLine(sd1, soiSaved, Decimals.valueOf(3));
			sd1 = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd1)).firstOrDefault();

			ISalesDelivery sd2 = new SalesDelivery();
			sd2.setCustomerCode(so.getCustomerCode());
			addDeliveryLineFromOrderLine(sd2, soiSaved, Decimals.valueOf(4));
			sd2 = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd2)).firstOrDefault();

			// closedQuantity = 7
			ISalesOrder soReload = reloadSO(sRepo, so);
			assertEqualsBD("SO.closedQuantity = 7.", Decimals.valueOf(7),
					soReload.getSalesOrderItems().firstOrDefault().getClosedQuantity());

			// 取消 sd1
			sd1.setCanceled(emYesNo.YES);
			sd1 = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd1)).firstOrDefault();

			// closedQuantity = 7 - 3 = 4
			soReload = reloadSO(sRepo, so);
			assertEqualsBD("SO.closedQuantity = 4 after cancel sd1.", Decimals.valueOf(4),
					soReload.getSalesOrderItems().firstOrDefault().getClosedQuantity());

			// OnHand: 10 - 7 + 3 = 6 (回补 sd1 的 3)
			// OnCommited: 10 - 4 = 6 (journal closedQuantity 回退到 4)
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.valueOf(6), Decimals.valueOf(6),
					Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-M05：SD 两行基于 SO 同一行，合计超出 SO 行数量 (6 + 6 = 12 > 10)
	//   推导依据：DocumentQuantityClosingService.impact 中
	//   若 closedQuantity > quantity 且配置了 LIMIT_CLOSED_QUANTIT_DOCUMENTS
	//   才抛异常；默认不限制
	// ==================================================================

	public void testSL_M05_TwoDeliveryLines_ExceedOrderQuantity_NoExceptionByDefault() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "M05I");

			// 入库 15 以保证库存充足
			seedInventory(mRepo, mt, wh, Decimals.valueOf(15));

			// SO qty=10
			ISalesOrder so = new SalesOrder();
			so.setCustomerCode(cu.getCode());
			ISalesOrderItem soi = so.getSalesOrderItems().create();
			soi.setItemCode(mt.getCode());
			soi.setQuantity(Decimals.valueOf(10));
			soi.setPrice(Decimals.valueOf(50));
			soi.setWarehouse(wh.getCode());
			soi.setBatchManagement(mt.getBatchManagement());
			soi.setSerialManagement(mt.getSerialManagement());
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			ISalesOrderItem soiSaved = so.getSalesOrderItems().firstOrDefault();

			// SD1 qty=6
			ISalesDelivery sd1 = new SalesDelivery();
			sd1.setCustomerCode(so.getCustomerCode());
			addDeliveryLineFromOrderLine(sd1, soiSaved, Decimals.valueOf(6));
			sd1 = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd1)).firstOrDefault();

			// SD2 qty=6（合计 12 > 10）
			ISalesDelivery sd2 = new SalesDelivery();
			sd2.setCustomerCode(so.getCustomerCode());
			addDeliveryLineFromOrderLine(sd2, soiSaved, Decimals.valueOf(6));
			sd2 = BOUtilities.valueOf(sRepo.saveSalesDelivery(sd2)).firstOrDefault();

			// 默认不抛异常，closedQuantity = 12（超量）
			ISalesOrder soReload = reloadSO(sRepo, so);
			assertEqualsBD("SO.closedQuantity = 12 (exceeds, but no exception by default).",
					Decimals.valueOf(12), soReload.getSalesOrderItems().firstOrDefault().getClosedQuantity());

			// lineStatus 仍为 FINISHED（closedQty >= qty）
			assertEquals("SO.lineStatus should be FINISHED.", emDocumentStatus.FINISHED,
					soReload.getSalesOrderItems().firstOrDefault().getLineStatus());
		}
	}
}
