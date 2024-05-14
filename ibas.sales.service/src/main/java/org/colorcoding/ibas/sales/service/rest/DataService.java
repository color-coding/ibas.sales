package org.colorcoding.ibas.sales.service.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.sales.MyConfiguration;
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
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * Sales 数据服务JSON
 */
@Path("data")
public class DataService extends BORepositorySales {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-产品套装
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchProductSuit")
	public OperationResult<ProductSuit> fetchProductSuit(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchProductSuit(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-产品套装
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveProductSuit")
	public OperationResult<ProductSuit> saveProductSuit(ProductSuit bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveProductSuit(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售交货
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesDelivery")
	public OperationResult<SalesDelivery> fetchSalesDelivery(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchSalesDelivery(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-销售交货
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesDelivery")
	public OperationResult<SalesDelivery> saveSalesDelivery(SalesDelivery bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveSalesDelivery(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售订单
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesOrder")
	public OperationResult<SalesOrder> fetchSalesOrder(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchSalesOrder(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-销售订单
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesOrder")
	public OperationResult<SalesOrder> saveSalesOrder(SalesOrder bo, @HeaderParam("authorization") String authorization,
			@QueryParam("token") String token) {
		return super.saveSalesOrder(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售退货
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesReturn")
	public OperationResult<SalesReturn> fetchSalesReturn(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchSalesReturn(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-销售退货
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesReturn")
	public OperationResult<SalesReturn> saveSalesReturn(SalesReturn bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveSalesReturn(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售报价
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesQuote")
	public OperationResult<SalesQuote> fetchSalesQuote(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchSalesQuote(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-销售报价
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesQuote")
	public OperationResult<SalesQuote> saveSalesQuote(SalesQuote bo, @HeaderParam("authorization") String authorization,
			@QueryParam("token") String token) {
		return super.saveSalesQuote(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售贷项
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesCreditNote")
	public OperationResult<SalesCreditNote> fetchSalesCreditNote(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchSalesCreditNote(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-销售贷项
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesCreditNote")
	public OperationResult<SalesCreditNote> saveSalesCreditNote(SalesCreditNote bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveSalesCreditNote(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售发票
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesInvoice")
	public OperationResult<SalesInvoice> fetchSalesInvoice(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchSalesInvoice(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-销售发票
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesInvoice")
	public OperationResult<SalesInvoice> saveSalesInvoice(SalesInvoice bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveSalesInvoice(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-一揽子协议
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchBlanketAgreement")
	public OperationResult<BlanketAgreement> fetchBlanketAgreement(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchBlanketAgreement(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-一揽子协议
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveBlanketAgreement")
	public OperationResult<BlanketAgreement> saveBlanketAgreement(BlanketAgreement bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveBlanketAgreement(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-预付款申请
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchDownPaymentRequest")
	public OperationResult<DownPaymentRequest> fetchDownPaymentRequest(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchDownPaymentRequest(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-预付款申请
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveDownPaymentRequest")
	public OperationResult<DownPaymentRequest> saveDownPaymentRequest(DownPaymentRequest bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveDownPaymentRequest(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售预留发票
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesReserveInvoice")
	public OperationResult<SalesReserveInvoice> fetchSalesReserveInvoice(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchSalesReserveInvoice(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-销售预留发票
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesReserveInvoice")
	public OperationResult<SalesReserveInvoice> saveSalesReserveInvoice(SalesReserveInvoice bo,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.saveSalesReserveInvoice(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//

}
