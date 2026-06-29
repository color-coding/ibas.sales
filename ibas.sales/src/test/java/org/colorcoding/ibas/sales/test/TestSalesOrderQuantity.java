package org.colorcoding.ibas.sales.test;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.bo.BOUtilities;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.data.emBOStatus;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.businesspartner.bo.customer.ICustomer;
import org.colorcoding.ibas.businesspartner.repository.BORepositoryBusinessPartner;
import org.colorcoding.ibas.materials.bo.material.IMaterial;
import org.colorcoding.ibas.materials.bo.warehouse.IWarehouse;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 销售订单 数量逻辑 测试。
 *
 * <p>覆盖：SL-C01 ~ SL-C08</p>
 * <p>核心 logic：MaterialCommitedService（OnCommited）</p>
 */
public class TestSalesOrderQuantity extends AbstractSalesQuantityTestCase {

	private static final BigDecimal QTY = Decimals.valueOf(10);

	// ---------------- 构造 ----------------

	private ISalesOrder buildOrder(ICustomer customer, IMaterial material, IWarehouse warehouse, BigDecimal qty) {
		ISalesOrder so = new SalesOrder();
		so.setCustomerCode(customer.getCode());
		ISalesOrderItem it = so.getSalesOrderItems().create();
		it.setItemCode(material.getCode());
		it.setQuantity(qty);
		it.setPrice(Decimals.valueOf(50));
		it.setWarehouse(warehouse.getCode());
		it.setBatchManagement(material.getBatchManagement());
		it.setSerialManagement(material.getSerialManagement());
		return so;
	}

	private BORepositorySales createSalesRepository() throws Exception {
		BORepositorySales repo = new BORepositorySales();
		repo.setUserToken(org.colorcoding.ibas.bobas.organization.OrganizationFactory.SYSTEM_USER);
		return repo;
	}

	// ==================================================================
	// SL-C01: 新建 SO -> OnCommited+Q, OnHand/OnOrdered 不变
	// ==================================================================

	public void testSL_C01_Create_Inventory() throws Exception { runCreate(MaterialKind.INVENTORY, "C01I"); }
	public void testSL_C01_Create_Batch()     throws Exception { runCreate(MaterialKind.BATCH,     "C01B"); }
	public void testSL_C01_Create_Serial()    throws Exception { runCreate(MaterialKind.SERIAL,    "C01N"); }

	private void runCreate(MaterialKind kind, String tag) throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, kind, tag);

			ISalesOrder so = buildOrder(cu, mt, wh, QTY);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertTrue("SO DocEntry assigned.", so.getDocEntry() > 0);

			// 销售订单只影响 OnCommited
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, QTY, Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-C02: 头取消 -> OnCommited 回滚
	// ==================================================================

	public void testSL_C02_HeaderCancel_Inventory() throws Exception { runHeaderCancel(MaterialKind.INVENTORY, "C02I"); }
	public void testSL_C02_HeaderCancel_Batch()     throws Exception { runHeaderCancel(MaterialKind.BATCH,     "C02B"); }
	public void testSL_C02_HeaderCancel_Serial()    throws Exception { runHeaderCancel(MaterialKind.SERIAL,    "C02N"); }

	private void runHeaderCancel(MaterialKind kind, String tag) throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, kind, tag);

			ISalesOrder so = buildOrder(cu, mt, wh, QTY);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, QTY, Decimals.VALUE_ZERO);

			so.setCanceled(emYesNo.YES);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-C03: 头删除 -> OnCommited 回滚
	// ==================================================================

	public void testSL_C03_HeaderDelete_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C03I");

			ISalesOrder so = buildOrder(cu, mt, wh, QTY);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();

			so.delete();
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();

			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-C04: 行删除 -> 仅对应行 OnCommited 回滚
	// ==================================================================

	public void testSL_C04_LineDelete_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C04I");

			ISalesOrder so = new SalesOrder();
			so.setCustomerCode(cu.getCode());
			ISalesOrderItem l1 = so.getSalesOrderItems().create();
			l1.setItemCode(mt.getCode()); l1.setQuantity(Decimals.valueOf(6));
			l1.setPrice(Decimals.valueOf(50)); l1.setWarehouse(wh.getCode());
			l1.setBatchManagement(mt.getBatchManagement());
			l1.setSerialManagement(mt.getSerialManagement());
			ISalesOrderItem l2 = so.getSalesOrderItems().create();
			l2.setItemCode(mt.getCode()); l2.setQuantity(Decimals.valueOf(4));
			l2.setPrice(Decimals.valueOf(50)); l2.setWarehouse(wh.getCode());
			l2.setBatchManagement(mt.getBatchManagement());
			l2.setSerialManagement(mt.getSerialManagement());

			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.valueOf(10), Decimals.VALUE_ZERO);

			so.getSalesOrderItems().get(1).delete();
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.valueOf(6), Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-C05: SO status=CLOSED -> OnCommited 保持（CLOSED 仅"跳过"逻辑，不主动回滚）
	//   说明：MaterialCommitedService 在 status==CLOSED 时 checkDataStatus 返回 false，
	//        框架仅"跳过"此次 impact，不会主动 revoke 之前已生效的承诺
	//        若要回滚 OnCommited，应使用 canceled=YES 或 documentStatus=PLANNED
	// ==================================================================

	public void testSL_C05_StatusClosed_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C05I");

			ISalesOrder so = buildOrder(cu, mt, wh, QTY);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, QTY, Decimals.VALUE_ZERO);

			so.setStatus(emBOStatus.CLOSED);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			// CLOSED 不主动回滚，OnCommited 仍 = QTY
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, QTY, Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-C06: 数量修改 -> OnCommited 同步
	// ==================================================================

	public void testSL_C06_QtyModify_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C06I");

			ISalesOrder so = buildOrder(cu, mt, wh, Decimals.valueOf(10));
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.valueOf(10), Decimals.VALUE_ZERO);

			// 10 -> 15
			so.getSalesOrderItems().firstOrDefault().setQuantity(Decimals.valueOf(15));
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.valueOf(15), Decimals.VALUE_ZERO);

			// 15 -> 8
			so.getSalesOrderItems().firstOrDefault().setQuantity(Decimals.valueOf(8));
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.valueOf(8), Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-C07: 服务物料 SO -> 三量恒为 0（MaterialCommitedService 直接跳过）
	// ==================================================================

	public void testSL_C07_ServiceMaterial_NoEffect() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.SERVICE, "C07S");

			ISalesOrder so = buildOrder(cu, mt, wh, QTY);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertTrue("SO saved for service.", so.getDocEntry() > 0);

			// 服务物料的三量恒为 0；因服务物料无 MaterialInventory 记录，
			// 直接断言物料层而不查仓库层
			IMaterial m = reload(mRepo, mt);
			assertEqualsBD("Service OnHand=0.", Decimals.VALUE_ZERO, m.getOnHand());
			assertEqualsBD("Service OnCommited=0.", Decimals.VALUE_ZERO, m.getOnCommited());
			assertEqualsBD("Service OnOrdered=0.", Decimals.VALUE_ZERO, m.getOnOrdered());
		}
	}

	// ==================================================================
	// SL-C08: 行 lineStatus PLANNED -> 不承诺；切到 RELEASED -> 承诺
	// ==================================================================

	public void testSL_C08_LineStatus_PlannedReleased() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C08I");

			ISalesOrder so = buildOrder(cu, mt, wh, QTY);
			so.getSalesOrderItems().firstOrDefault().setLineStatus(emDocumentStatus.PLANNED);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			so.getSalesOrderItems().firstOrDefault().setLineStatus(emDocumentStatus.RELEASED);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, QTY, Decimals.VALUE_ZERO);
		}
	}
}
