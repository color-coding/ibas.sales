package org.colorcoding.ibas.sales.service.soap;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.cxf.WebServicePath;
import org.colorcoding.ibas.sales.bo.productspecification.ProductSpecification;
import org.colorcoding.ibas.sales.bo.productsuit.ProductSuit;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.bo.salesquote.SalesQuote;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;
import org.colorcoding.ibas.sales.bo.specification.Specification;
import org.colorcoding.ibas.sales.bo.specification.SpecificationTree;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * Sales 数据服务JSON
 */
@WebService
@WebServicePath("data")
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
	@WebMethod
	public OperationResult<ProductSpecification> fetchProductSpecification(
			@WebParam(name = "criteria") Criteria criteria, @WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<ProductSpecification> saveProductSpecification(
			@WebParam(name = "bo") ProductSpecification bo, @WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<ProductSuit> fetchProductSuit(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<ProductSuit> saveProductSuit(@WebParam(name = "bo") ProductSuit bo,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<SalesDelivery> fetchSalesDelivery(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<SalesDelivery> saveSalesDelivery(@WebParam(name = "bo") SalesDelivery bo,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<SalesOrder> fetchSalesOrder(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<SalesOrder> saveSalesOrder(@WebParam(name = "bo") SalesOrder bo,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<SalesReturn> fetchSalesReturn(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<SalesReturn> saveSalesReturn(@WebParam(name = "bo") SalesReturn bo,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<SalesQuote> fetchSalesQuote(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<SalesQuote> saveSalesQuote(@WebParam(name = "bo") SalesQuote bo,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<Specification> fetchSpecification(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
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
	@WebMethod
	public OperationResult<Specification> saveSpecification(@WebParam(name = "bo") Specification bo,
			@WebParam(name = "token") String token) {
		return super.saveSpecification(bo, token);
	}

	/**
	 * 查询-规格树
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	@WebMethod
	public OperationResult<SpecificationTree> fetchSpecificationTree(@WebParam(name = "criteria") Criteria criteria,
			@WebParam(name = "token") String token) {
		return super.fetchSpecificationTree(criteria, token);
	}
	// --------------------------------------------------------------------------------------------//

}
