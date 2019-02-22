package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 销售订单-付款契约（收款单据）
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesOrderPaymentContract extends IBusinessLogicContract, ISalesBaseDoucment {

	/**
	 * 金额
	 * 
	 * @return
	 */
	BigDecimal getAmount();

	/**
	 * 币种
	 * 
	 * @return
	 */
	String getCurrency();

	/**
	 * 汇率
	 * 
	 * @return
	 */
	BigDecimal getRate();
}
