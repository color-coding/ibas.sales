package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 采购退货-付款契约（付款单据）
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesReturnPaymentContract extends IBusinessLogicContract {

	/**
	 * 单据类型
	 * 
	 * @return
	 */
	String getDocumentType();

	/**
	 * 单据编号
	 * 
	 * @return
	 */
	Integer getDocumentEntry();

	/**
	 * 金额
	 * 
	 * @return
	 */
	Decimal getAmount();

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
	Decimal getRate();
}
