package org.colorcoding.ibas.sales.repository;

import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.repository.IBORepositorySmartService;
import org.colorcoding.ibas.sales.bo.productspecification.ProductSpecification;
import org.colorcoding.ibas.sales.bo.productsuit.ProductSuit;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.bo.salesquote.SalesQuote;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;
import org.colorcoding.ibas.sales.bo.specification.Specification;

/**
 * Sales仓库服务
 */
public interface IBORepositorySalesSvc extends IBORepositorySmartService {

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
	OperationResult<ProductSpecification> fetchProductSpecification(ICriteria criteria, String token);

	/**
	 * 保存-产品规格
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<ProductSpecification> saveProductSpecification(ProductSpecification bo, String token);

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
	OperationResult<ProductSuit> fetchProductSuit(ICriteria criteria, String token);

	/**
	 * 保存-产品套装
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<ProductSuit> saveProductSuit(ProductSuit bo, String token);

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
	OperationResult<SalesDelivery> fetchSalesDelivery(ICriteria criteria, String token);

	/**
	 * 保存-销售交货
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<SalesDelivery> saveSalesDelivery(SalesDelivery bo, String token);

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
	OperationResult<SalesOrder> fetchSalesOrder(ICriteria criteria, String token);

	/**
	 * 保存-销售订单
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<SalesOrder> saveSalesOrder(SalesOrder bo, String token);

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
	OperationResult<SalesReturn> fetchSalesReturn(ICriteria criteria, String token);

	/**
	 * 保存-销售退货
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<SalesReturn> saveSalesReturn(SalesReturn bo, String token);

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
	OperationResult<SalesQuote> fetchSalesQuote(ICriteria criteria, String token);

	/**
	 * 保存-销售报价
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<SalesQuote> saveSalesQuote(SalesQuote bo, String token);

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
	OperationResult<Specification> fetchSpecification(ICriteria criteria, String token);

	/**
	 * 保存-规格模板
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	OperationResult<Specification> saveSpecification(Specification bo, String token);
	// --------------------------------------------------------------------------------------------//

}
