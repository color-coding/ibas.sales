package org.colorcoding.ibas.sales.repository;

import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.repository.BORepositoryServiceApplication;
import org.colorcoding.ibas.sales.bo.blanketagreement.BlanketAgreement;
import org.colorcoding.ibas.sales.bo.blanketagreement.IBlanketAgreement;
import org.colorcoding.ibas.sales.bo.downpaymentrequest.DownPaymentRequest;
import org.colorcoding.ibas.sales.bo.downpaymentrequest.IDownPaymentRequest;
import org.colorcoding.ibas.sales.bo.productsuit.IProductSuit;
import org.colorcoding.ibas.sales.bo.productsuit.ProductSuit;
import org.colorcoding.ibas.sales.bo.salescreditnote.ISalesCreditNote;
import org.colorcoding.ibas.sales.bo.salescreditnote.SalesCreditNote;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoice;
import org.colorcoding.ibas.sales.bo.salesinvoice.SalesInvoice;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.bo.salesquote.ISalesQuote;
import org.colorcoding.ibas.sales.bo.salesquote.SalesQuote;
import org.colorcoding.ibas.sales.bo.salesreserveinvoice.ISalesReserveInvoice;
import org.colorcoding.ibas.sales.bo.salesreserveinvoice.SalesReserveInvoice;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturnrequest.ISalesReturnRequest;
import org.colorcoding.ibas.sales.bo.salesreturnrequest.SalesReturnRequest;

/**
 * Sales仓库
 */
public class BORepositorySales extends BORepositoryServiceApplication
		implements IBORepositorySalesSvc, IBORepositorySalesApp {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-产品套装
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<ProductSuit> fetchProductSuit(ICriteria criteria, String token) {
		return super.fetch(criteria, token, ProductSuit.class);
	}

	/**
	 * 查询-产品套装（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<IProductSuit> fetchProductSuit(ICriteria criteria) {
		return new OperationResult<IProductSuit>(this.fetchProductSuit(criteria, this.getUserToken()));
	}

	/**
	 * 保存-产品套装
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<ProductSuit> saveProductSuit(ProductSuit bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-产品套装（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<IProductSuit> saveProductSuit(IProductSuit bo) {
		return new OperationResult<IProductSuit>(this.saveProductSuit((ProductSuit) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售交货
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<SalesDelivery> fetchSalesDelivery(ICriteria criteria, String token) {
		return super.fetch(criteria, token, SalesDelivery.class);
	}

	/**
	 * 查询-销售交货（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<ISalesDelivery> fetchSalesDelivery(ICriteria criteria) {
		return new OperationResult<ISalesDelivery>(this.fetchSalesDelivery(criteria, this.getUserToken()));
	}

	/**
	 * 保存-销售交货
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<SalesDelivery> saveSalesDelivery(SalesDelivery bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-销售交货（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<ISalesDelivery> saveSalesDelivery(ISalesDelivery bo) {
		return new OperationResult<ISalesDelivery>(this.saveSalesDelivery((SalesDelivery) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售订单
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<SalesOrder> fetchSalesOrder(ICriteria criteria, String token) {
		return super.fetch(criteria, token, SalesOrder.class);
	}

	/**
	 * 查询-销售订单（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<ISalesOrder> fetchSalesOrder(ICriteria criteria) {
		return new OperationResult<ISalesOrder>(this.fetchSalesOrder(criteria, this.getUserToken()));
	}

	/**
	 * 保存-销售订单
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<SalesOrder> saveSalesOrder(SalesOrder bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-销售订单（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<ISalesOrder> saveSalesOrder(ISalesOrder bo) {
		return new OperationResult<ISalesOrder>(this.saveSalesOrder((SalesOrder) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售退货
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<SalesReturn> fetchSalesReturn(ICriteria criteria, String token) {
		return super.fetch(criteria, token, SalesReturn.class);
	}

	/**
	 * 查询-销售退货（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<ISalesReturn> fetchSalesReturn(ICriteria criteria) {
		return new OperationResult<ISalesReturn>(this.fetchSalesReturn(criteria, this.getUserToken()));
	}

	/**
	 * 保存-销售退货
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<SalesReturn> saveSalesReturn(SalesReturn bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-销售退货（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<ISalesReturn> saveSalesReturn(ISalesReturn bo) {
		return new OperationResult<ISalesReturn>(this.saveSalesReturn((SalesReturn) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售报价
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<SalesQuote> fetchSalesQuote(ICriteria criteria, String token) {
		return super.fetch(criteria, token, SalesQuote.class);
	}

	/**
	 * 查询-销售报价（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<ISalesQuote> fetchSalesQuote(ICriteria criteria) {
		return new OperationResult<ISalesQuote>(this.fetchSalesQuote(criteria, this.getUserToken()));
	}

	/**
	 * 保存-销售报价
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<SalesQuote> saveSalesQuote(SalesQuote bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-销售报价（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<ISalesQuote> saveSalesQuote(ISalesQuote bo) {
		return new OperationResult<ISalesQuote>(this.saveSalesQuote((SalesQuote) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售贷项
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<SalesCreditNote> fetchSalesCreditNote(ICriteria criteria, String token) {
		return super.fetch(criteria, token, SalesCreditNote.class);
	}

	/**
	 * 查询-销售贷项（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<ISalesCreditNote> fetchSalesCreditNote(ICriteria criteria) {
		return new OperationResult<ISalesCreditNote>(this.fetchSalesCreditNote(criteria, this.getUserToken()));
	}

	/**
	 * 保存-销售贷项
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<SalesCreditNote> saveSalesCreditNote(SalesCreditNote bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-销售贷项（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<ISalesCreditNote> saveSalesCreditNote(ISalesCreditNote bo) {
		return new OperationResult<ISalesCreditNote>(
				this.saveSalesCreditNote((SalesCreditNote) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售发票
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<SalesInvoice> fetchSalesInvoice(ICriteria criteria, String token) {
		return super.fetch(criteria, token, SalesInvoice.class);
	}

	/**
	 * 查询-销售发票（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<ISalesInvoice> fetchSalesInvoice(ICriteria criteria) {
		return new OperationResult<ISalesInvoice>(this.fetchSalesInvoice(criteria, this.getUserToken()));
	}

	/**
	 * 保存-销售发票
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<SalesInvoice> saveSalesInvoice(SalesInvoice bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-销售发票（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<ISalesInvoice> saveSalesInvoice(ISalesInvoice bo) {
		return new OperationResult<ISalesInvoice>(this.saveSalesInvoice((SalesInvoice) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-一揽子协议
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<BlanketAgreement> fetchBlanketAgreement(ICriteria criteria, String token) {
		return super.fetch(criteria, token, BlanketAgreement.class);
	}

	/**
	 * 查询-一揽子协议（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<IBlanketAgreement> fetchBlanketAgreement(ICriteria criteria) {
		return new OperationResult<IBlanketAgreement>(this.fetchBlanketAgreement(criteria, this.getUserToken()));
	}

	/**
	 * 保存-一揽子协议
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<BlanketAgreement> saveBlanketAgreement(BlanketAgreement bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-一揽子协议（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<IBlanketAgreement> saveBlanketAgreement(IBlanketAgreement bo) {
		return new OperationResult<IBlanketAgreement>(
				this.saveBlanketAgreement((BlanketAgreement) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-预收款申请
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<DownPaymentRequest> fetchDownPaymentRequest(ICriteria criteria, String token) {
		return super.fetch(criteria, token, DownPaymentRequest.class);
	}

	/**
	 * 查询-预收款申请（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<IDownPaymentRequest> fetchDownPaymentRequest(ICriteria criteria) {
		return new OperationResult<IDownPaymentRequest>(this.fetchDownPaymentRequest(criteria, this.getUserToken()));
	}

	/**
	 * 保存-预收款申请
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<DownPaymentRequest> saveDownPaymentRequest(DownPaymentRequest bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-预收款申请（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<IDownPaymentRequest> saveDownPaymentRequest(IDownPaymentRequest bo) {
		return new OperationResult<IDownPaymentRequest>(
				this.saveDownPaymentRequest((DownPaymentRequest) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售预留发票
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	public OperationResult<SalesReserveInvoice> fetchSalesReserveInvoice(ICriteria criteria, String token) {
		return super.fetch(criteria, token, SalesReserveInvoice.class);
	}

	/**
	 * 查询-销售预留发票（提前设置用户口令）
	 * 
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<ISalesReserveInvoice> fetchSalesReserveInvoice(ICriteria criteria) {
		return new OperationResult<ISalesReserveInvoice>(this.fetchSalesReserveInvoice(criteria, this.getUserToken()));
	}

	/**
	 * 保存-销售预留发票
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<SalesReserveInvoice> saveSalesReserveInvoice(SalesReserveInvoice bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-销售预留发票（提前设置用户口令）
	 * 
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<ISalesReserveInvoice> saveSalesReserveInvoice(ISalesReserveInvoice bo) {
		return new OperationResult<ISalesReserveInvoice>(
				this.saveSalesReserveInvoice((SalesReserveInvoice) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售退货请求
	 * @param criteria 查询
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<SalesReturnRequest> fetchSalesReturnRequest(ICriteria criteria, String token) {
		return super.fetch(criteria, token, SalesReturnRequest.class);
	}

	/**
	 * 查询-销售退货请求（提前设置用户口令）
	 * @param criteria 查询
	 * @return 操作结果
	 */
	public IOperationResult<ISalesReturnRequest> fetchSalesReturnRequest(ICriteria criteria) {
		return new OperationResult<ISalesReturnRequest>(this.fetchSalesReturnRequest(criteria, this.getUserToken()));
	}

	/**
	 * 保存-销售退货请求
	 * @param bo 对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	public OperationResult<SalesReturnRequest> saveSalesReturnRequest(SalesReturnRequest bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-销售退货请求（提前设置用户口令）
	 * @param bo 对象实例
	 * @return 操作结果
	 */
	public IOperationResult<ISalesReturnRequest> saveSalesReturnRequest(ISalesReturnRequest bo) {
		return new OperationResult<ISalesReturnRequest>(
				this.saveSalesReturnRequest((SalesReturnRequest) bo, this.getUserToken()));
	}
	// --------------------------------------------------------------------------------------------//

}
