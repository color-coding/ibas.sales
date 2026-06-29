package org.colorcoding.ibas.sales.test;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.bo.BOUtilities;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;
import org.colorcoding.ibas.businesspartner.bo.customer.ICustomer;
import org.colorcoding.ibas.businesspartner.repository.BORepositoryBusinessPartner;
import org.colorcoding.ibas.materials.bo.material.IMaterial;
import org.colorcoding.ibas.materials.bo.warehouse.IWarehouse;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.bo.salesquote.ISalesQuote;
import org.colorcoding.ibas.sales.bo.salesquote.ISalesQuoteItem;
import org.colorcoding.ibas.sales.bo.salesquote.SalesQuote;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 销售报价 → 销售订单 链路 测试。
 *
 * <p>覆盖：SL-C10 / C11 / C13</p>
 */
public class TestSalesQuoteToOrder extends AbstractSalesQuantityTestCase {

	private static final BigDecimal QTY = Decimals.valueOf(10);

	private BORepositorySales createSalesRepository() throws Exception {
		BORepositorySales repo = new BORepositorySales();
		repo.setUserToken(OrganizationFactory.SYSTEM_USER);
		return repo;
	}

	private ISalesQuote createSQ(BORepositorySales sRepo, ICustomer cu, IMaterial mt, IWarehouse wh, BigDecimal qty)
			throws Exception {
		ISalesQuote sq = new SalesQuote();
		sq.setCustomerCode(cu.getCode());
		ISalesQuoteItem it = sq.getSalesQuoteItems().create();
		it.setItemCode(mt.getCode());
		it.setQuantity(qty);
		it.setPrice(Decimals.valueOf(50));
		it.setWarehouse(wh.getCode());
		it.setBatchManagement(mt.getBatchManagement());
		it.setSerialManagement(mt.getSerialManagement());
		return BOUtilities.valueOf(sRepo.saveSalesQuote(sq)).firstOrDefault();
	}

	// ==================================================================
	// SL-C10: SQ 保存 -> 三量均不变（报价不影响数量）
	// ==================================================================

	public void testSL_C10_QuoteSave_NoEffect() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C10I");

			ISalesQuote sq = createSQ(sRepo, cu, mt, wh, QTY);
			assertTrue("SQ DocEntry assigned.", sq.getDocEntry() > 0);

			// 报价单不影响任何量
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);
		}
	}

	// ==================================================================
	// SL-C11: SO 基于 SQ -> SQ.closedQuantity 不变（SalesOrderItem 不实现
	//   IDocumentQuantityClosingContract，故不会推进 SQ.closedQuantity）
	//   说明：SQ 实现了 ClosingContract（可被关闭），但 SO 不实现，链路实际不存在
	//   SO 创建只触发 OnCommited+=Q，与 SQ 无关联
	// ==================================================================

	public void testSL_C11_OrderFromQuote_Inventory() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C11I");

			ISalesQuote sq = createSQ(sRepo, cu, mt, wh, QTY);
			ISalesQuoteItem sqi = sq.getSalesQuoteItems().firstOrDefault();

			// 基于 SQ 创建 SO（带 baseDocument 引用）
			ISalesOrder so = new SalesOrder();
			so.setCustomerCode(cu.getCode());
			ISalesOrderItem soi = so.getSalesOrderItems().create();
			soi.setItemCode(sqi.getItemCode());
			soi.setQuantity(sqi.getQuantity());
			soi.setPrice(sqi.getPrice());
			soi.setWarehouse(sqi.getWarehouse());
			soi.setBatchManagement(sqi.getBatchManagement());
			soi.setSerialManagement(sqi.getSerialManagement());
			soi.setBaseDocumentType(sqi.getObjectCode());
			soi.setBaseDocumentEntry(sqi.getDocEntry());
			soi.setBaseDocumentLineId(sqi.getLineId());
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();

			// SO 创建：OnCommited+=Q
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, QTY, Decimals.VALUE_ZERO);

			// SQ.closedQuantity 保持 0（链路不存在）
			ISalesQuote sqReload = BOUtilities.valueOf(sRepo.fetchSalesQuote(sq.getCriteria())).firstOrDefault();
			assertEqualsBD("SQ.closedQuantity stays 0 (no closing link from SO).", Decimals.VALUE_ZERO,
					sqReload.getSalesQuoteItems().sum(c -> c.getClosedQuantity()));
		}
	}

	// ==================================================================
	// SL-C13: SO 取消 -> SQ.closedQuantity 回退到 0
	// ==================================================================

	public void testSL_C13_OrderCancel_SQClosedQuantityRollback() throws Exception {
		try (BORepositoryMaterials mRepo = createMaterialsRepository();
				BORepositoryBusinessPartner bRepo = createBPRepository();
				BORepositorySales sRepo = createSalesRepository()) {
			IWarehouse wh = prepareWarehouse(mRepo);
			ICustomer cu = prepareCustomer(bRepo);
			IMaterial mt = prepareMaterial(mRepo, MaterialKind.INVENTORY, "C13I");

			ISalesQuote sq = createSQ(sRepo, cu, mt, wh, QTY);
			ISalesQuoteItem sqi = sq.getSalesQuoteItems().firstOrDefault();

			ISalesOrder so = new SalesOrder();
			so.setCustomerCode(cu.getCode());
			ISalesOrderItem soi = so.getSalesOrderItems().create();
			soi.setItemCode(sqi.getItemCode());
			soi.setQuantity(sqi.getQuantity());
			soi.setPrice(sqi.getPrice());
			soi.setWarehouse(sqi.getWarehouse());
			soi.setBatchManagement(sqi.getBatchManagement());
			soi.setSerialManagement(sqi.getSerialManagement());
			soi.setBaseDocumentType(sqi.getObjectCode());
			soi.setBaseDocumentEntry(sqi.getDocEntry());
			soi.setBaseDocumentLineId(sqi.getLineId());
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();

			// 取消 SO
			so.setCanceled(emYesNo.YES);
			so = BOUtilities.valueOf(sRepo.saveSalesOrder(so)).firstOrDefault();

			// OnCommited 回退
			assertQuantities(mRepo, mt, wh.getCode(), Decimals.VALUE_ZERO, Decimals.VALUE_ZERO, Decimals.VALUE_ZERO);

			// SQ.closedQuantity 回退到 0
			ISalesQuote sqReload = BOUtilities.valueOf(sRepo.fetchSalesQuote(sq.getCriteria())).firstOrDefault();
			assertEqualsBD("SQ.closedQuantity rollback.", Decimals.VALUE_ZERO,
					sqReload.getSalesQuoteItems().sum(c -> c.getClosedQuantity()));
		}
	}
}
