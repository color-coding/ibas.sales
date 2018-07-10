package org.colorcoding.ibas.sales.service.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.sales.bo.productspecification.ProductSpecification;
import org.colorcoding.ibas.sales.bo.productsuit.ProductSuit;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.bo.salesquote.SalesQuote;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;
import org.colorcoding.ibas.sales.bo.specification.Specification;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * Sales 数据服务JSON
 */
@Path("data")
public class DataService extends BORepositorySales {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-产品规格
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchProductSpecification")
	public OperationResult<ProductSpecification> fetchProductSpecification(Criteria criteria,
			@QueryParam("token") String token) {
		return super.fetchProductSpecification(criteria, token);
	}

	/**
	 * 保存-产品规格
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveProductSpecification")
	public OperationResult<ProductSpecification> saveProductSpecification(ProductSpecification bo,
			@QueryParam("token") String token) {
		return super.saveProductSpecification(bo, token);
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-产品套装
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchProductSuit")
	public OperationResult<ProductSuit> fetchProductSuit(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchProductSuit(criteria, token);
	}

	/**
	 * 保存-产品套装
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveProductSuit")
	public OperationResult<ProductSuit> saveProductSuit(ProductSuit bo, @QueryParam("token") String token) {
		return super.saveProductSuit(bo, token);
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售交货
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesDelivery")
	public OperationResult<SalesDelivery> fetchSalesDelivery(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchSalesDelivery(criteria, token);
	}

	/**
	 * 保存-销售交货
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesDelivery")
	public OperationResult<SalesDelivery> saveSalesDelivery(SalesDelivery bo, @QueryParam("token") String token) {
		return super.saveSalesDelivery(bo, token);
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售订单
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesOrder")
	public OperationResult<SalesOrder> fetchSalesOrder(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchSalesOrder(criteria, token);
	}

	/**
	 * 保存-销售订单
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesOrder")
	public OperationResult<SalesOrder> saveSalesOrder(SalesOrder bo, @QueryParam("token") String token) {
		return super.saveSalesOrder(bo, token);
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售退货
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesReturn")
	public OperationResult<SalesReturn> fetchSalesReturn(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchSalesReturn(criteria, token);
	}

	/**
	 * 保存-销售退货
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesReturn")
	public OperationResult<SalesReturn> saveSalesReturn(SalesReturn bo, @QueryParam("token") String token) {
		return super.saveSalesReturn(bo, token);
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-销售报价
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSalesQuote")
	public OperationResult<SalesQuote> fetchSalesQuote(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchSalesQuote(criteria, token);
	}

	/**
	 * 保存-销售报价
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSalesQuote")
	public OperationResult<SalesQuote> saveSalesQuote(SalesQuote bo, @QueryParam("token") String token) {
		return super.saveSalesQuote(bo, token);
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-规格模板
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchSpecification")
	public OperationResult<Specification> fetchSpecification(Criteria criteria, @QueryParam("token") String token) {
		return super.fetchSpecification(criteria, token);
	}

	/**
	 * 保存-规格模板
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveSpecification")
	public OperationResult<Specification> saveSpecification(Specification bo, @QueryParam("token") String token) {
		return super.saveSpecification(bo, token);
	}

	// --------------------------------------------------------------------------------------------//

}
