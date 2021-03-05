package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 销售交货，开票契约
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesDeliveryInvoiceContract extends IBusinessLogicContract, ISalesBaseDoucmentItem {

	/**
	 * 数量
	 * 
	 * @return
	 */
	BigDecimal getQuantity();

}
