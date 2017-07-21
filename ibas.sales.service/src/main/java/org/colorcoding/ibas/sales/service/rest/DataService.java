package org.colorcoding.ibas.sales.service.rest;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.sales.repository.*;
import org.colorcoding.ibas.sales.bo.productsuit.*;
import org.colorcoding.ibas.sales.bo.salesdelivery.*;
import org.colorcoding.ibas.sales.bo.salesorder.*;
import org.colorcoding.ibas.sales.bo.salesreturn.*;

/**
* Sales 数据服务JSON
*/
@Path("data")
public class DataService extends BORepositorySales {

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-产品套装
     * @param criteria 查询
     * @param token 口令
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
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("saveProductSuit")
    public OperationResult<ProductSuit> saveProductSuit(ProductSuit bo, @QueryParam("token") String token) {
        return super.saveProductSuit(bo, token);
    }

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-销售交货
     * @param criteria 查询
     * @param token 口令
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
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("saveSalesDelivery")
    public OperationResult<SalesDelivery> saveSalesDelivery(SalesDelivery bo, @QueryParam("token") String token) {
        return super.saveSalesDelivery(bo, token);
    }

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-销售订单
     * @param criteria 查询
     * @param token 口令
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
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("saveSalesOrder")
    public OperationResult<SalesOrder> saveSalesOrder(SalesOrder bo, @QueryParam("token") String token) {
        return super.saveSalesOrder(bo, token);
    }

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-销售退货
     * @param criteria 查询
     * @param token 口令
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
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("saveSalesReturn")
    public OperationResult<SalesReturn> saveSalesReturn(SalesReturn bo, @QueryParam("token") String token) {
        return super.saveSalesReturn(bo, token);
    }

    //--------------------------------------------------------------------------------------------//

}
