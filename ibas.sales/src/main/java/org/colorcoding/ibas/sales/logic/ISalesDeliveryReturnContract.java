package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 销售交货，退货契约
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesDeliveryReturnContract extends IBusinessLogicContract, ISalesBaseDocumentItem {

	/**
	 * 数量
	 * 
	 * @return
	 */
	BigDecimal getQuantity();

}
