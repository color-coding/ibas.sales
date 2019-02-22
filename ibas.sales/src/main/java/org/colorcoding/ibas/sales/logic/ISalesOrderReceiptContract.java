package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 销售订单，收货契约
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesOrderReceiptContract extends IBusinessLogicContract, ISalesBaseDoucmentItem {

	/**
	 * 数量
	 * 
	 * @return
	 */
	BigDecimal getQuantity();

}
