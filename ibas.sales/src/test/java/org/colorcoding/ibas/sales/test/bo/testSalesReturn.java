package org.colorcoding.ibas.sales.test.bo;

import junit.framework.TestCase;
import org.colorcoding.ibas.bobas.data.*;
import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.repository.*;
import org.colorcoding.ibas.sales.data.*;
import org.colorcoding.ibas.sales.bo.salesreturn.*;
import org.colorcoding.ibas.sales.repository.*;

/**
* 销售退货 测试
* 
*/
public class testSalesReturn extends TestCase {
    /**
     * 获取连接口令
    */
    String getToken() {
        return "";
    }
    
    /**
     * 基本项目测试
     * @throws Exception 
    */
    public void testBasicItems() throws Exception {
        SalesReturn bo = new SalesReturn();
        // 测试属性赋值

        // 测试销售退货-行
        ISalesReturnItem salesreturnitem = bo.getSalesReturnItems().create();
        // 测试属性赋值
        


        // 测试对象的保存和查询
        IOperationResult<?> operationResult = null;
        ICriteria criteria = null;
        IBORepositorySalesApp boRepository = new BORepositorySales();
        //设置用户口令
        boRepository.setUserToken(this.getToken());

        // 测试保存
        operationResult = boRepository.saveSalesReturn(bo);
        assertEquals(operationResult.getMessage(), operationResult.getResultCode(), 0);
        SalesReturn boSaved = (SalesReturn)operationResult.getResultObjects().firstOrDefault();


        // 测试查询
        criteria = boSaved.getCriteria();
        criteria.setResultCount(10);
        operationResult = boRepository.fetchSalesReturn(criteria);
        assertEquals(operationResult.getMessage(), operationResult.getResultCode(), 0);


    }

}
