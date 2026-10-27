package org.colorcoding.ibas.sales.test;

import java.math.BigDecimal;
import java.util.function.Function;

import org.colorcoding.ibas.bobas.bo.BOIdentifierBuilder;
import org.colorcoding.ibas.bobas.bo.BOUtilities;
import org.colorcoding.ibas.bobas.bo.IBODocument;
import org.colorcoding.ibas.bobas.bo.IBOTagCanceled;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleException;
import org.colorcoding.ibas.businesspartner.bo.customer.ICustomer;
import org.colorcoding.ibas.businesspartner.repository.BORepositoryBusinessPartner;
import org.colorcoding.ibas.materials.bo.goodsreceipt.GoodsReceipt;
import org.colorcoding.ibas.materials.bo.goodsreceipt.IGoodsReceiptLine;
import org.colorcoding.ibas.materials.bo.material.IMaterial;
import org.colorcoding.ibas.materials.bo.materialbatch.IMaterialBatchItem;
import org.colorcoding.ibas.materials.bo.warehouse.IWarehouse;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;
import org.colorcoding.ibas.sales.bo.blanketagreement.BlanketAgreement;
import org.colorcoding.ibas.sales.bo.blanketagreement.IBlanketAgreement;
import org.colorcoding.ibas.sales.bo.blanketagreement.IBlanketAgreementItem;
import org.colorcoding.ibas.sales.bo.downpaymentrequest.DownPaymentRequest;
import org.colorcoding.ibas.sales.bo.downpaymentrequest.IDownPaymentRequest;
import org.colorcoding.ibas.sales.bo.downpaymentrequest.IDownPaymentRequestItem;
import org.colorcoding.ibas.sales.bo.salescreditnote.ISalesCreditNote;
import org.colorcoding.ibas.sales.bo.salescreditnote.ISalesCreditNoteItem;
import org.colorcoding.ibas.sales.bo.salescreditnote.SalesCreditNote;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoice;
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoiceItem;
import org.colorcoding.ibas.sales.bo.salesinvoice.SalesInvoice;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.bo.salesreserveinvoice.ISalesReserveInvoice;
import org.colorcoding.ibas.sales.bo.salesreserveinvoice.ISalesReserveInvoiceItem;
import org.colorcoding.ibas.sales.bo.salesreserveinvoice.SalesReserveInvoice;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturnItem;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturnrequest.ISalesReturnRequest;
import org.colorcoding.ibas.sales.bo.salesreturnrequest.ISalesReturnRequestItem;
import org.colorcoding.ibas.sales.bo.salesreturnrequest.SalesReturnRequest;
import org.colorcoding.ibas.sales.data.emAgreementMethod;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 单行订单的状态往返及上下游保护。库存初始量：销售 20；订单量 10。
 * 每次保存后重新查询单据头、行、关闭数量、引用标记及物料/仓库库存。
 * 关闭会计分录及成本服务以验证允许的库存往返；成本冲销、已有分录的拒绝路径分别验证。
 */
public class TestDocumentStateTransitions extends AbstractSalesQuantityTestCase {

	private String previousJournalService;
	private String previousMaterialCosts;

	@Override
	protected void setUp() throws Exception {
		super.setUp();
		previousMaterialCosts = org.colorcoding.ibas.materials.MyConfiguration.getConfigValue(
				org.colorcoding.ibas.materials.MyConfiguration.CONFIG_ITEM_ENABLE_MATERIAL_COSTS);
		org.colorcoding.ibas.materials.MyConfiguration.create().addConfigValue(
				org.colorcoding.ibas.materials.MyConfiguration.CONFIG_ITEM_ENABLE_MATERIAL_COSTS, "false");
		previousJournalService = org.colorcoding.ibas.accounting.MyConfiguration.getConfigValue(
				org.colorcoding.ibas.accounting.MyConfiguration.CONFIG_ITEM_ENABLE_JOURNAL_ENTRY_SERVICE);
		org.colorcoding.ibas.accounting.MyConfiguration.create().addConfigValue(
				org.colorcoding.ibas.accounting.MyConfiguration.CONFIG_ITEM_ENABLE_JOURNAL_ENTRY_SERVICE, "false");
	}

	@Override
	protected void tearDown() throws Exception {
		org.colorcoding.ibas.accounting.MyConfiguration.create().addConfigValue(
				org.colorcoding.ibas.accounting.MyConfiguration.CONFIG_ITEM_ENABLE_JOURNAL_ENTRY_SERVICE,
				previousJournalService == null ? "" : previousJournalService);
		org.colorcoding.ibas.materials.MyConfiguration.create().addConfigValue(
				org.colorcoding.ibas.materials.MyConfiguration.CONFIG_ITEM_ENABLE_MATERIAL_COSTS,
				previousMaterialCosts == null ? "" : previousMaterialCosts);
		super.tearDown();
	}

	private class Scenario implements AutoCloseable {
		private final BORepositoryMaterials materials = createMaterialsRepository();
		private final BORepositoryBusinessPartner partners = createBPRepository();
		private final BORepositorySales repository = createSalesRepository();
		private final IWarehouse warehouse;
		private final IMaterial material;
		private ISalesOrder order;

		Scenario(String tag, MaterialKind kind) throws Exception {
			warehouse = prepareWarehouse(materials);
			material = prepareMaterial(materials, kind, tag);
			ICustomer partner = prepareCustomer(partners);
			GoodsReceipt receipt = new GoodsReceipt();
			IGoodsReceiptLine receiptLine = receipt.getGoodsReceiptLines().create();
			receiptLine.setItemCode(material.getCode());
			receiptLine.setWarehouse(warehouse.getCode());
			receiptLine.setQuantity(Decimals.valueOf(20));
			receiptLine.setPrice(Decimals.valueOf(20));
			receiptLine.setBatchManagement(material.getBatchManagement());
			if (kind == MaterialKind.BATCH) {
				for (String batch : new String[] { "B1", "B2" }) {
					IMaterialBatchItem item = receiptLine.getMaterialBatches().create();
					item.setBatchCode(material.getCode() + batch);
					item.setQuantity(Decimals.valueOf(10));
				}
			}
			BOUtilities.valueOf(materials.saveGoodsReceipt(receipt));
			order = new SalesOrder();
			order.setCustomerCode(partner.getCode());
			ISalesOrderItem line = order.getSalesOrderItems().create();
			line.setItemCode(material.getCode());
			line.setWarehouse(warehouse.getCode());
			line.setQuantity(Decimals.valueOf(10));
			line.setPrice(Decimals.valueOf(20));
			line.setBatchManagement(material.getBatchManagement());
			if (kind == MaterialKind.BATCH) {
				for (int i = 0; i < 2; i++) {
					IMaterialBatchItem batch = line.getMaterialBatches().create();
					batch.setBatchCode(material.getCode() + (i == 0 ? "B1" : "B2"));
					batch.setQuantity(Decimals.valueOf(i == 0 ? 4 : 6));
				}
			}
			saveOrder();
		}

		private void saveOrder() {
			order = BOUtilities.valueOf(repository.saveSalesOrder(order)).firstOrDefault();
			order = BOUtilities.valueOf(repository.fetchSalesOrder(order.getCriteria())).firstOrDefault();
		}

		private void assertOrder(int closed, emDocumentStatus status) throws Exception {
			order = BOUtilities.valueOf(repository.fetchSalesOrder(order.getCriteria())).firstOrDefault();
			assertNotNull("Order must persist through state changes.", order);
			ISalesOrderItem line = order.getSalesOrderItems().firstOrDefault();
			assertEquals("Order header status mismatch for this scenario.", status, order.getDocumentStatus());
			assertEquals("Source line state mismatch.", status, line.getLineStatus());
			assertEqualsBD("Source closed quantity mismatch.", Decimals.valueOf(closed), line.getClosedQuantity());
			assertEquals("Reference flag must reflect active downstream quantity.",
					closed == 0 ? emYesNo.NO : emYesNo.YES, line.getReferenced());
		}

		private void assertStock(int onHand, int remaining) throws Exception {
			assertQuantities(materials, material, warehouse.getCode(), Decimals.valueOf(onHand),
					Decimals.valueOf(remaining), BigDecimal.ZERO);
		}

		private ISalesDelivery delivery(int quantity, boolean batches) {
			ISalesDelivery document = new SalesDelivery();
			document.setCustomerCode(order.getCustomerCode());
			ISalesOrderItem source = order.getSalesOrderItems().firstOrDefault();
			ISalesDeliveryItem line = document.getSalesDeliveryItems().create();
			line.setItemCode(source.getItemCode());
			line.setWarehouse(source.getWarehouse());
			line.setQuantity(Decimals.valueOf(quantity));
			line.setPrice(source.getPrice());
			line.setBatchManagement(source.getBatchManagement());
			line.setBaseDocumentType(source.getObjectCode());
			line.setBaseDocumentEntry(source.getDocEntry());
			line.setBaseDocumentLineId(source.getLineId());
			if (batches) {
				for (IMaterialBatchItem sourceBatch : source.getMaterialBatches()) {
					IMaterialBatchItem batch = line.getMaterialBatches().create();
					batch.setBatchCode(sourceBatch.getBatchCode());
					batch.setQuantity(sourceBatch.getQuantity());
				}
			}
			return BOUtilities.valueOf(repository.saveSalesDelivery(document)).firstOrDefault();
		}

		@Override
		public void close() throws Exception {
			repository.close();
			partners.close();
			materials.close();
		}
	}

	/** SL_C55：无下游订单；头级计划/下达往返两次；三量不累计，头行状态均落库。 */
	public void testSL_C55_OrderDocumentStatusRoundTrip() throws Exception {
		try (Scenario scenario = new Scenario("SL_C55", MaterialKind.INVENTORY)) {
			for (int cycle = 0; cycle < 2; cycle++) {
				scenario.order.setDocumentStatus(emDocumentStatus.PLANNED);
				scenario.saveOrder();
				scenario.assertOrder(0, emDocumentStatus.PLANNED);
				scenario.assertStock(20, 0);
				scenario.order.setDocumentStatus(emDocumentStatus.RELEASED);
				scenario.saveOrder();
				scenario.assertOrder(0, emDocumentStatus.RELEASED);
				scenario.assertStock(20, 10);
			}
		}
	}

	/** SL_C56：无下游订单；行设计划并显式撤回单头，再下达行；验证单头聚合恢复下达及有效数量往返，不假定全计划行自动撤回单头。 */
	public void testSL_C56_OrderLineStatusRoundTrip() throws Exception {
		try (Scenario scenario = new Scenario("SL_C56", MaterialKind.INVENTORY)) {
			for (int cycle = 0; cycle < 2; cycle++) {
				scenario.order.getSalesOrderItems().firstOrDefault().setLineStatus(emDocumentStatus.PLANNED);
				scenario.order.setDocumentStatus(emDocumentStatus.PLANNED);
				scenario.saveOrder();
				scenario.assertOrder(0, emDocumentStatus.PLANNED);
				scenario.assertStock(20, 0);
				scenario.order.getSalesOrderItems().firstOrDefault().setLineStatus(emDocumentStatus.RELEASED);
				scenario.saveOrder();
				scenario.assertOrder(0, emDocumentStatus.RELEASED);
				scenario.assertStock(20, 10);
			}
		}
	}

	/** SL_C57：部分交货 4；订单取消/删除应被拒绝；撤销、恢复交货后数量及引用标记往返。 */
	public void testSL_C57_PartialDeliveryProtectsSourceAndRestoresOnce() throws Exception {
		try (Scenario scenario = new Scenario("SL_C57", MaterialKind.INVENTORY)) {
			ISalesDelivery delivery = scenario.delivery(4, false);
			scenario.assertOrder(4, emDocumentStatus.RELEASED);
			scenario.assertStock(16, 6);
			ISalesOrder rejected = ((SalesOrder) scenario.order).clone();
			rejected.setCanceled(emYesNo.YES);
			IOperationResult<ISalesOrder> result = scenario.repository.saveSalesOrder(rejected);
			assertNotNull("Referenced order cancellation must be rejected.", result.getError());
			assertEquals(I18N.prop("msg_mm_document_closed_quantity_not_allowed_canceled",
					BOIdentifierBuilder.document(scenario.order.getObjectCode(), scenario.order.getDocEntry(),
							scenario.order.getSalesOrderItems().firstOrDefault().getLineId()).build()), result.getError().getMessage());
			scenario.assertOrder(4, emDocumentStatus.RELEASED);
			assertEquals(emYesNo.NO, scenario.order.getCanceled());
			rejected = ((SalesOrder) scenario.order).clone();
			rejected.delete();
			result = scenario.repository.saveSalesOrder(rejected);
			assertNotNull("Referenced order deletion must be rejected.", result.getError());
			scenario.assertOrder(4, emDocumentStatus.RELEASED);
			scenario.assertStock(16, 6);
			for (emYesNo canceled : new emYesNo[] { emYesNo.YES, emYesNo.NO }) {
				delivery.setCanceled(canceled);
				delivery = BOUtilities.valueOf(scenario.repository.saveSalesDelivery(delivery)).firstOrDefault();
				BOUtilities.valueOf(scenario.repository.saveSalesDelivery(delivery));
				assertEquals(canceled, BOUtilities.valueOf(scenario.repository.fetchSalesDelivery(delivery.getCriteria()))
						.firstOrDefault().getCanceled());
				scenario.assertOrder(canceled == emYesNo.YES ? 0 : 4, emDocumentStatus.RELEASED);
				scenario.assertStock(canceled == emYesNo.YES ? 20 : 16, canceled == emYesNo.YES ? 10 : 6);
			}
		}
	}

	/** SL_C58：直接基于订单开票；取消/恢复发票；源订单关闭数量、完成状态、库存均只生效一次。 */
	public void testSL_C58_DirectInvoiceCancelRestoreUpdatesSourceState() throws Exception {
		try (Scenario scenario = new Scenario("SL_C58", MaterialKind.INVENTORY)) {
			ISalesInvoice invoice = new SalesInvoice();
			invoice.setCustomerCode(scenario.order.getCustomerCode());
			ISalesOrderItem source = scenario.order.getSalesOrderItems().firstOrDefault();
			ISalesInvoiceItem line = invoice.getSalesInvoiceItems().create();
			line.setItemCode(source.getItemCode());
			line.setWarehouse(source.getWarehouse());
			line.setQuantity(source.getQuantity());
			line.setPrice(source.getPrice());
			line.setBaseDocumentType(source.getObjectCode());
			line.setBaseDocumentEntry(source.getDocEntry());
			line.setBaseDocumentLineId(source.getLineId());
			invoice = BOUtilities.valueOf(scenario.repository.saveSalesInvoice(invoice)).firstOrDefault();
			scenario.assertOrder(10, emDocumentStatus.FINISHED);
			scenario.assertStock(10, 0);
			for (emYesNo canceled : new emYesNo[] { emYesNo.YES, emYesNo.NO }) {
				invoice.setCanceled(canceled);
				invoice = BOUtilities.valueOf(scenario.repository.saveSalesInvoice(invoice)).firstOrDefault();
				BOUtilities.valueOf(scenario.repository.saveSalesInvoice(invoice));
				assertEquals(canceled, BOUtilities.valueOf(scenario.repository.fetchSalesInvoice(invoice.getCriteria()))
						.firstOrDefault().getCanceled());
				scenario.assertOrder(canceled == emYesNo.YES ? 0 : 10,
						canceled == emYesNo.YES ? emDocumentStatus.RELEASED : emDocumentStatus.FINISHED);
				scenario.assertStock(canceled == emYesNo.YES ? 20 : 10, canceled == emYesNo.YES ? 10 : 0);
			}
		}
	}

	/** SL_C59：源订单预分配两个批次 4+6；全量交货、撤销、恢复；按行总量判断完成，逐批回写关闭数量。 */
	public void testSL_C59_MultipleBatchesFinishAndReopenSource() throws Exception {
		try (Scenario scenario = new Scenario("SL_C59", MaterialKind.BATCH)) {
			ISalesDelivery delivery = scenario.delivery(10, true);
			for (emYesNo canceled : new emYesNo[] { emYesNo.NO, emYesNo.YES, emYesNo.NO }) {
				delivery.setCanceled(canceled);
				delivery = BOUtilities.valueOf(scenario.repository.saveSalesDelivery(delivery)).firstOrDefault();
				scenario.assertOrder(canceled == emYesNo.YES ? 0 : 10,
						canceled == emYesNo.YES ? emDocumentStatus.RELEASED : emDocumentStatus.FINISHED);
				scenario.assertStock(canceled == emYesNo.YES ? 20 : 10, canceled == emYesNo.YES ? 10 : 0);
				for (IMaterialBatchItem batch : scenario.order.getSalesOrderItems().firstOrDefault().getMaterialBatches()) {
					assertEqualsBD("Each assigned source batch must close or reopen independently.",
							canceled == emYesNo.YES ? BigDecimal.ZERO : batch.getQuantity(), batch.getClosedQuantity());
				}
			}
		}
	}

	/** SL_C60：全量交货后基于订单退回 2；取消、恢复退货；订单在完成/下达间往返，余量及库存一致。 */
	public void testSL_C60_PartialReturnCancelRestoreReopensSource() throws Exception {
		try (Scenario scenario = new Scenario("SL_C60", MaterialKind.INVENTORY)) {
			scenario.delivery(10, false);
			scenario.assertOrder(10, emDocumentStatus.FINISHED);
			ISalesReturn document = new SalesReturn();
			document.setCustomerCode(scenario.order.getCustomerCode());
			ISalesOrderItem source = scenario.order.getSalesOrderItems().firstOrDefault();
			ISalesReturnItem line = document.getSalesReturnItems().create();
			line.setItemCode(source.getItemCode());
			line.setWarehouse(source.getWarehouse());
			line.setQuantity(Decimals.valueOf(2));
			line.setPrice(source.getPrice());
			line.setBaseDocumentType(source.getObjectCode());
			line.setBaseDocumentEntry(source.getDocEntry());
			line.setBaseDocumentLineId(source.getLineId());
			document = BOUtilities.valueOf(scenario.repository.saveSalesReturn(document)).firstOrDefault();
			for (emYesNo canceled : new emYesNo[] { emYesNo.NO, emYesNo.YES, emYesNo.NO }) {
				document.setCanceled(canceled);
				document = BOUtilities.valueOf(scenario.repository.saveSalesReturn(document)).firstOrDefault();
				BOUtilities.valueOf(scenario.repository.saveSalesReturn(document));
				scenario.assertOrder(canceled == emYesNo.YES ? 10 : 8,
						canceled == emYesNo.YES ? emDocumentStatus.FINISHED : emDocumentStatus.RELEASED);
				scenario.assertStock(canceled == emYesNo.YES ? 10 : 12, canceled == emYesNo.YES ? 0 : 2);
			}
		}
	}
	/** 无来源单据的基础生命周期：重复保存、取消、恢复；验证本单持久化及对既有订单、库存没有意外影响。 */
	private <T extends IBODocument> void assertStandaloneCycle(Scenario scenario, T document,
			Function<T, IOperationResult<T>> save, Function<ICriteria, IOperationResult<T>> fetch,
			int baselineStock, int effectiveStock) throws Exception {
		document = BOUtilities.valueOf(save.apply(document)).firstOrDefault();
		for (emYesNo canceled : new emYesNo[] { emYesNo.NO, emYesNo.YES, emYesNo.NO }) {
			((IBOTagCanceled) document).setCanceled(canceled);
			document = BOUtilities.valueOf(save.apply(document)).firstOrDefault();
			BOUtilities.valueOf(save.apply(document));
			document = BOUtilities.valueOf(fetch.apply(document.getCriteria())).firstOrDefault();
			assertNotNull("Lifecycle document must remain persisted.", document);
			assertEquals("Cancellation flag must persist through the complete round trip.", canceled,
					((IBOTagCanceled) document).getCanceled());
			scenario.assertOrder(0, emDocumentStatus.RELEASED);
			scenario.assertStock(canceled == emYesNo.YES ? baselineStock : effectiveStock, 10);
		}
	}

	/** SL_C61：无来源SalesReserveInvoice，数量 2；取消/恢复及重复保存，库存不变化且既有订单不被关闭。 */
	public void testSL_C61_SalesReserveInvoiceStandaloneCancelRestore() throws Exception {
		try (Scenario scenario = new Scenario("SL_C61", MaterialKind.INVENTORY)) {
			ISalesReserveInvoice document = new SalesReserveInvoice();
			document.setCustomerCode(scenario.order.getCustomerCode());
			ISalesReserveInvoiceItem line = document.getSalesReserveInvoiceItems().create();
			line.setItemCode(scenario.material.getCode());
			line.setQuantity(Decimals.valueOf(2));
			line.setPrice(Decimals.valueOf(20));
			line.setWarehouse(scenario.warehouse.getCode());
			assertStandaloneCycle(scenario, document, scenario.repository::saveSalesReserveInvoice,
					scenario.repository::fetchSalesReserveInvoice, 20, 20);
		}
	}

	/** SL_C62：无来源SalesCreditNote，数量 2；取消/恢复及重复保存，库存反向变化 2且既有订单不被关闭。 */
	public void testSL_C62_SalesCreditNoteStandaloneCancelRestore() throws Exception {
		try (Scenario scenario = new Scenario("SL_C62", MaterialKind.INVENTORY)) {
			ISalesCreditNote document = new SalesCreditNote();
			document.setCustomerCode(scenario.order.getCustomerCode());
			ISalesCreditNoteItem line = document.getSalesCreditNoteItems().create();
			line.setItemCode(scenario.material.getCode());
			line.setQuantity(Decimals.valueOf(2));
			line.setPrice(Decimals.valueOf(20));
			line.setWarehouse(scenario.warehouse.getCode());
			assertStandaloneCycle(scenario, document, scenario.repository::saveSalesCreditNote,
					scenario.repository::fetchSalesCreditNote, 20, 22);
		}
	}

	/** SL_C63：无来源SalesReturnRequest，数量 2；取消/恢复及重复保存，库存不变化且既有订单不被关闭。 */
	public void testSL_C63_SalesReturnRequestStandaloneCancelRestore() throws Exception {
		try (Scenario scenario = new Scenario("SL_C63", MaterialKind.INVENTORY)) {
			ISalesReturnRequest document = new SalesReturnRequest();
			document.setCustomerCode(scenario.order.getCustomerCode());
			ISalesReturnRequestItem line = document.getSalesReturnRequestItems().create();
			line.setItemCode(scenario.material.getCode());
			line.setQuantity(Decimals.valueOf(2));
			line.setPrice(Decimals.valueOf(20));
			line.setWarehouse(scenario.warehouse.getCode());
			assertStandaloneCycle(scenario, document, scenario.repository::saveSalesReturnRequest,
					scenario.repository::fetchSalesReturnRequest, 20, 20);
		}
	}

	/** SL_C64：无来源DownPaymentRequest，数量 2；取消/恢复及重复保存，库存不变化且既有订单不被关闭。 */
	public void testSL_C64_DownPaymentRequestStandaloneCancelRestore() throws Exception {
		try (Scenario scenario = new Scenario("SL_C64", MaterialKind.INVENTORY)) {
			IDownPaymentRequest document = new DownPaymentRequest();
			document.setCustomerCode(scenario.order.getCustomerCode());
			IDownPaymentRequestItem line = document.getDownPaymentRequestItems().create();
			line.setItemCode(scenario.material.getCode());
			line.setQuantity(Decimals.valueOf(2));
			line.setPrice(Decimals.valueOf(20));
			line.setWarehouse(scenario.warehouse.getCode());
			assertStandaloneCycle(scenario, document, scenario.repository::saveDownPaymentRequest,
					scenario.repository::fetchDownPaymentRequest, 20, 20);
		}
	}

	/** SL_C65：无来源BlanketAgreement，数量 2；取消/恢复及重复保存，库存不变化且既有订单不被关闭。 */
	public void testSL_C65_BlanketAgreementStandaloneCancelRestore() throws Exception {
		try (Scenario scenario = new Scenario("SL_C65", MaterialKind.INVENTORY)) {
			IBlanketAgreement document = new BlanketAgreement();
			document.setCustomerCode(scenario.order.getCustomerCode());
			document.setAgreementMethod(emAgreementMethod.ITEM);
			IBlanketAgreementItem line = document.getBlanketAgreementItems().create();
			line.setItemCode(scenario.material.getCode());
			line.setQuantity(Decimals.valueOf(2));
			line.setPrice(Decimals.valueOf(20));
			assertStandaloneCycle(scenario, document, scenario.repository::saveBlanketAgreement,
					scenario.repository::fetchBlanketAgreement, 20, 20);
		}
	}

	/** SL_C66：启用成本后交货 4 并取消；旧成本已冲销的单据恢复必须拒绝，本单及源单据和库存保持取消后结果。 */
	public void testSL_C66_CostOffsettingRejectsReactivationAtomically() throws Exception {
		org.colorcoding.ibas.materials.MyConfiguration.create().addConfigValue(
				org.colorcoding.ibas.materials.MyConfiguration.CONFIG_ITEM_ENABLE_MATERIAL_COSTS, "true");
		try (Scenario scenario = new Scenario("SL_C66", MaterialKind.INVENTORY)) {
			ISalesDelivery delivery = scenario.delivery(4, false);
			scenario.assertOrder(4, emDocumentStatus.RELEASED);
			scenario.assertStock(16, 6);
			delivery.setCanceled(emYesNo.YES);
			delivery = BOUtilities.valueOf(scenario.repository.saveSalesDelivery(delivery)).firstOrDefault();
			scenario.assertOrder(0, emDocumentStatus.RELEASED);
			scenario.assertStock(20, 10);
			delivery.setCanceled(emYesNo.NO);
			IOperationResult<ISalesDelivery> rejected = scenario.repository.saveSalesDelivery(delivery);
			assertNotNull("Costed document with an offsetting journal cannot be reactivated.", rejected.getError());
			assertEquals(I18N.prop("msg_mm_costed_document_not_support_reactivation",
					BOIdentifierBuilder.document(delivery.getObjectCode(), delivery.getDocEntry(),
							delivery.getSalesDeliveryItems().firstOrDefault().getLineId()).build()), rejected.getError().getMessage());
			assertEquals("Rejected restoration must retain the canceled document.", emYesNo.YES,
					BOUtilities.valueOf(scenario.repository.fetchSalesDelivery(delivery.getCriteria())).firstOrDefault().getCanceled());
			scenario.assertOrder(0, emDocumentStatus.RELEASED);
			scenario.assertStock(20, 10);
		}
	}

	/** SL_C67：交货 4 后全量开票；拒绝撤销已开票交货；按发票→交货逆序撤销，再正序恢复，三层状态与库存一致。 */
	public void testSL_C67_InvoicedDeliveryRequiresReverseDependencyOrder() throws Exception {
		try (Scenario scenario = new Scenario("SL_C67", MaterialKind.INVENTORY)) {
			ISalesDelivery delivery = scenario.delivery(4, false);
			ISalesDeliveryItem source = delivery.getSalesDeliveryItems().firstOrDefault();
			ISalesInvoice invoice = new SalesInvoice();
			invoice.setCustomerCode(scenario.order.getCustomerCode());
			ISalesInvoiceItem line = invoice.getSalesInvoiceItems().create();
			line.setItemCode(source.getItemCode());
			line.setWarehouse(source.getWarehouse());
			line.setPrice(source.getPrice());
			line.setQuantity(source.getQuantity());
			line.setBaseDocumentType(source.getObjectCode());
			line.setBaseDocumentEntry(source.getDocEntry());
			line.setBaseDocumentLineId(source.getLineId());
			invoice = BOUtilities.valueOf(scenario.repository.saveSalesInvoice(invoice)).firstOrDefault();
			delivery = BOUtilities.valueOf(scenario.repository.fetchSalesDelivery(delivery.getCriteria())).firstOrDefault();
			assertEquals("Invoicing finishes the delivery.", emDocumentStatus.FINISHED, delivery.getDocumentStatus());
			assertEqualsBD("Invoice closes its immediate source.", Decimals.valueOf(4),
					delivery.getSalesDeliveryItems().firstOrDefault().getClosedQuantity());
			delivery.setCanceled(emYesNo.YES);
			IOperationResult<ISalesDelivery> rejected = scenario.repository.saveSalesDelivery(delivery);
			assertNotNull("Delivery with an active invoice must reject cancellation.", rejected.getError());
			assertEquals(I18N.prop("msg_mm_document_closed_amount_not_allowed_canceled",
					BOIdentifierBuilder.document(delivery.getObjectCode(), delivery.getDocEntry(), source.getLineId()).build()),
					rejected.getError().getMessage());
			delivery = BOUtilities.valueOf(scenario.repository.fetchSalesDelivery(delivery.getCriteria())).firstOrDefault();
			assertEquals(emYesNo.NO, delivery.getCanceled());
			assertEquals(emDocumentStatus.FINISHED, delivery.getDocumentStatus());
			assertEqualsBD("Rejected cancellation must preserve its invoice-closed quantity.", Decimals.valueOf(4),
					delivery.getSalesDeliveryItems().firstOrDefault().getClosedQuantity());
			assertEquals("Dependent invoice must remain active.", emYesNo.NO,
					BOUtilities.valueOf(scenario.repository.fetchSalesInvoice(invoice.getCriteria())).firstOrDefault().getCanceled());
			scenario.assertOrder(4, emDocumentStatus.RELEASED);
			scenario.assertStock(16, 6);
			invoice.setCanceled(emYesNo.YES);
			invoice = BOUtilities.valueOf(scenario.repository.saveSalesInvoice(invoice)).firstOrDefault();
			delivery = BOUtilities.valueOf(scenario.repository.fetchSalesDelivery(delivery.getCriteria())).firstOrDefault();
			assertEquals(emDocumentStatus.RELEASED, delivery.getDocumentStatus());
			assertEqualsBD("Canceling invoice reopens its delivery.", BigDecimal.ZERO,
					delivery.getSalesDeliveryItems().firstOrDefault().getClosedQuantity());
			delivery.setCanceled(emYesNo.YES);
			delivery = BOUtilities.valueOf(scenario.repository.saveSalesDelivery(delivery)).firstOrDefault();
			scenario.assertOrder(0, emDocumentStatus.RELEASED);
			scenario.assertStock(20, 10);
			delivery.setCanceled(emYesNo.NO);
			delivery = BOUtilities.valueOf(scenario.repository.saveSalesDelivery(delivery)).firstOrDefault();
			scenario.assertOrder(4, emDocumentStatus.RELEASED);
			scenario.assertStock(16, 6);
			invoice.setCanceled(emYesNo.NO);
			invoice = BOUtilities.valueOf(scenario.repository.saveSalesInvoice(invoice)).firstOrDefault();
			BOUtilities.valueOf(scenario.repository.saveSalesInvoice(invoice));
			delivery = BOUtilities.valueOf(scenario.repository.fetchSalesDelivery(delivery.getCriteria())).firstOrDefault();
			assertEquals(emDocumentStatus.FINISHED, delivery.getDocumentStatus());
			assertEqualsBD("Restoring invoice must close delivery only once.", Decimals.valueOf(4),
					delivery.getSalesDeliveryItems().firstOrDefault().getClosedQuantity());
			scenario.assertOrder(4, emDocumentStatus.RELEASED);
			scenario.assertStock(16, 6);
		}
	}

	/** SL_C68：有已履行数量的源订单；分别物理删除、单头标记删除、行标记删除，三条入口均必须拒绝。 */
	public void testSL_C68_FulfilledClosedQuantityRejectsPhysicalAndTaggedDeletion() {
		assertFulfilledDeletionRejected(false);
	}

	/** SL_C69：有已履行金额的源订单；分别物理删除、单头标记删除、行标记删除，三条入口均必须拒绝。 */
	public void testSL_C69_FulfilledClosedAmountRejectsPhysicalAndTaggedDeletion() {
		assertFulfilledDeletionRejected(true);
	}

	/** 直接验证自定义删除保护，不保存对象；必填字段及事务行为由上面的真实链路场景验证。 */
	private void assertFulfilledDeletionRejected(boolean amount) {
		for (int path = 0; path < 3; path++) {
			SalesOrder order = new SalesOrder();
			order.setDocEntry(1);
			ISalesOrderItem line = order.getSalesOrderItems().create();
			line.setLineId(1);
			line.setQuantity(Decimals.valueOf(10));
			if (amount) {
				line.setClosedAmount(Decimals.valueOf(40));
			} else {
				line.setClosedQuantity(Decimals.valueOf(4));
			}
			if (path == 0) {
				order.delete();
			} else if (path == 1) {
				order.setDeleted(emYesNo.YES);
			} else {
				line.setDeleted(emYesNo.YES);
			}
			try {
				order.check();
				fail("Fulfilled document must protect deletion path " + path);
			} catch (BusinessRuleException expected) {
				assertEquals(I18N.prop("msg_mm_document_closed_" + (amount ? "amount" : "quantity") + "_not_allowed_deleted",
						BOIdentifierBuilder.document(order.getObjectCode(), order.getDocEntry(), line.getLineId()).build()),
						expected.getMessage());
			}
		}
	}
}
