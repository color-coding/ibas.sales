package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 销售订单，发货契约
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesOrderIssueContract extends IBusinessLogicContract, ISalesBaseDoucmentItem {

	/**
	 * 数量
	 * 
	 * @return
	 */
	BigDecimal getQuantity();

}
