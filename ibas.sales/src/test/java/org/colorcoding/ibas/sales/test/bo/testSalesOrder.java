package org.colorcoding.ibas.sales.test.bo;

import junit.framework.TestCase;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.repository.BORepositorySales;
import org.colorcoding.ibas.sales.repository.IBORepositorySalesApp;

/**
* 销售订单 测试
* 
*/
public class testSalesOrder extends TestCase {
    /**
     * 获取连接口令
    */
    String getToken() {
        return "68fc6bac014d06ad94c5734116487cff";
    }
    
    /**
     * 基本项目测试
     * @throws Exception 
    */
    public void testBasicItems() throws Exception {
        //创建一个销售订单
        SalesOrder bo = new SalesOrder();
        // 测试属性赋值
        bo.setCustomerCode("C0001");
        bo.setCustomerName("奥维奥");
        bo.setGrossProfitPriceList(1);//毛利价格清单
        // 测试销售订单-行
        ISalesOrderItem salesorderitem = bo.getSalesOrderItems().create();
        // 测试属性赋值
        salesorderitem.setItemCode("I0001");
        salesorderitem.setItemDescription("CPU");
        salesorderitem.setPrice(1800);
        salesorderitem.setQuantity(1);


        // 测试对象的保存和查询
        IOperationResult<?> operationResult = null;
        ICriteria criteria = null;
        IBORepositorySalesApp boRepository = new BORepositorySales();
        //设置用户口令
        boRepository.setUserToken(this.getToken());

        // 测试保存
        operationResult = boRepository.saveSalesOrder(bo);
        assertEquals(operationResult.getMessage(), operationResult.getResultCode(), 0);
        SalesOrder boSaved = (SalesOrder)operationResult.getResultObjects().firstOrDefault();

        //测试修改
        salesorderitem.setItemCode("I0002");
        salesorderitem.setItemDescription("内存条");
        salesorderitem.setPrice(2800);
        salesorderitem.setQuantity(1);

        operationResult = boRepository.saveSalesOrder(bo);
        assertEquals(operationResult.getMessage(), operationResult.getResultCode(), 0);
        boSaved = (SalesOrder)operationResult.getResultObjects().firstOrDefault();

        // 测试查询
        criteria = boSaved.getCriteria();
        criteria.setResultCount(10);
        operationResult = boRepository.fetchSalesOrder(criteria);
        assertEquals(operationResult.getMessage(), operationResult.getResultCode(), 0);


    }

}
