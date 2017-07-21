package org.colorcoding.ibas.sales.repository;

import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.repository.*;
import org.colorcoding.ibas.sales.bo.productsuit.*;
import org.colorcoding.ibas.sales.bo.salesdelivery.*;
import org.colorcoding.ibas.sales.bo.salesorder.*;
import org.colorcoding.ibas.sales.bo.salesreturn.*;

/**
* Sales仓库服务
*/
public interface IBORepositorySalesSvc extends IBORepositorySmartService {


    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-产品套装
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<ProductSuit> fetchProductSuit(ICriteria criteria, String token);

    /**
     * 保存-产品套装
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<ProductSuit> saveProductSuit(ProductSuit bo, String token);

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-销售交货
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<SalesDelivery> fetchSalesDelivery(ICriteria criteria, String token);

    /**
     * 保存-销售交货
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<SalesDelivery> saveSalesDelivery(SalesDelivery bo, String token);

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-销售订单
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<SalesOrder> fetchSalesOrder(ICriteria criteria, String token);

    /**
     * 保存-销售订单
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<SalesOrder> saveSalesOrder(SalesOrder bo, String token);

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-销售退货
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<SalesReturn> fetchSalesReturn(ICriteria criteria, String token);

    /**
     * 保存-销售退货
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<SalesReturn> saveSalesReturn(SalesReturn bo, String token);

    //--------------------------------------------------------------------------------------------//

}
