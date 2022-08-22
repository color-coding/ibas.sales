package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 销售订单，订购契约
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesOrderOrderContract extends IBusinessLogicContract, ISalesBaseDocumentItem {

	/**
	 * 数量
	 * 
	 * @return
	 */
	BigDecimal getQuantity();

}
