package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.data.Decimal;
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
	Decimal getQuantity();

}
