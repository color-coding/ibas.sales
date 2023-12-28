package org.colorcoding.ibas.sales.repository;

import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.repository.IBORepositorySmartService;
import org.colorcoding.ibas.sales.bo.blanketagreement.BlanketAgreement;
import org.colorcoding.ibas.sales.bo.downpaymentrequest.DownPaymentRequest;
import org.colorcoding.ibas.sales.bo.productsuit.ProductSuit;
import org.colorcoding.ibas.sales.bo.salescreditnote.SalesCreditNote;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesinvoice.SalesInvoice;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.bo.salesquote.SalesQuote;
import org.colorcoding.ibas.sales.bo.salesreserveinvoice.SalesReserveInvoice;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;

/**
 * Sales仓库服务
 */
public interface IBORepositorySalesSvc extends IBORepositorySmartService {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-产品套装
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<ProductSuit> fetchProductSuit(ICriteria criteria, String token);

	/**
	 * 保存-产品套装
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<ProductSuit> saveProductSuit(ProductSuit bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售交货
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<SalesDelivery> fetchSalesDelivery(ICriteria criteria, String token);

	/**
	 * 保存-销售交货
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<SalesDelivery> saveSalesDelivery(SalesDelivery bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售订单
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<SalesOrder> fetchSalesOrder(ICriteria criteria, String token);

	/**
	 * 保存-销售订单
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<SalesOrder> saveSalesOrder(SalesOrder bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售退货
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<SalesReturn> fetchSalesReturn(ICriteria criteria, String token);

	/**
	 * 保存-销售退货
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<SalesReturn> saveSalesReturn(SalesReturn bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售报价
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<SalesQuote> fetchSalesQuote(ICriteria criteria, String token);

	/**
	 * 保存-销售报价
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<SalesQuote> saveSalesQuote(SalesQuote bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售贷项
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<SalesCreditNote> fetchSalesCreditNote(ICriteria criteria, String token);

	/**
	 * 保存-销售贷项
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<SalesCreditNote> saveSalesCreditNote(SalesCreditNote bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售发票
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<SalesInvoice> fetchSalesInvoice(ICriteria criteria, String token);

	/**
	 * 保存-销售发票
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<SalesInvoice> saveSalesInvoice(SalesInvoice bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-一揽子协议
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<BlanketAgreement> fetchBlanketAgreement(ICriteria criteria, String token);

	/**
	 * 保存-一揽子协议
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<BlanketAgreement> saveBlanketAgreement(BlanketAgreement bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-预收款申请
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<DownPaymentRequest> fetchDownPaymentRequest(ICriteria criteria, String token);

	/**
	 * 保存-预收款申请
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<DownPaymentRequest> saveDownPaymentRequest(DownPaymentRequest bo, String token);

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售预留发票
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	OperationResult<SalesReserveInvoice> fetchSalesReserveInvoice(ICriteria criteria, String token);

	/**
	 * 保存-销售预留发票
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	OperationResult<SalesReserveInvoice> saveSalesReserveInvoice(SalesReserveInvoice bo, String token);

	// --------------------------------------------------------------------------------------------//

}
