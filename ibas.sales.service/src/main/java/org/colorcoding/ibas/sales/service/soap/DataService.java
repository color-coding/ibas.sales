package org.colorcoding.ibas.sales.service.soap;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.cxf.WebServicePath;
import org.colorcoding.ibas.sales.repository.*;
import org.colorcoding.ibas.sales.bo.productsuit.*;
import org.colorcoding.ibas.sales.bo.salesdelivery.*;
import org.colorcoding.ibas.sales.bo.salesorder.*;
import org.colorcoding.ibas.sales.bo.salesreturn.*;

/**
* Sales 数据服务JSON
*/
@WebService
@WebServicePath("data")
public class DataService extends BORepositorySales {

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-产品套装
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<ProductSuit> fetchProductSuit(@WebParam(name = "criteria") Criteria criteria, @WebParam(name = "token") String token) {
        return super.fetchProductSuit(criteria, token);
    }

    /**
     * 保存-产品套装
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<ProductSuit> saveProductSuit(@WebParam(name = "bo") ProductSuit bo, @WebParam(name = "token") String token) {
        return super.saveProductSuit(bo, token);
    }

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-销售交货
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<SalesDelivery> fetchSalesDelivery(@WebParam(name = "criteria") Criteria criteria, @WebParam(name = "token") String token) {
        return super.fetchSalesDelivery(criteria, token);
    }

    /**
     * 保存-销售交货
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<SalesDelivery> saveSalesDelivery(@WebParam(name = "bo") SalesDelivery bo, @WebParam(name = "token") String token) {
        return super.saveSalesDelivery(bo, token);
    }

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-销售订单
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<SalesOrder> fetchSalesOrder(@WebParam(name = "criteria") Criteria criteria, @WebParam(name = "token") String token) {
        return super.fetchSalesOrder(criteria, token);
    }

    /**
     * 保存-销售订单
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<SalesOrder> saveSalesOrder(@WebParam(name = "bo") SalesOrder bo, @WebParam(name = "token") String token) {
        return super.saveSalesOrder(bo, token);
    }

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-销售退货
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<SalesReturn> fetchSalesReturn(@WebParam(name = "criteria") Criteria criteria, @WebParam(name = "token") String token) {
        return super.fetchSalesReturn(criteria, token);
    }

    /**
     * 保存-销售退货
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<SalesReturn> saveSalesReturn(@WebParam(name = "bo") SalesReturn bo, @WebParam(name = "token") String token) {
        return super.saveSalesReturn(bo, token);
    }

    //--------------------------------------------------------------------------------------------//

}
