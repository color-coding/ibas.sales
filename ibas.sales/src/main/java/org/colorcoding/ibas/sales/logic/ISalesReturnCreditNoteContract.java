package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 销售退货，贷项契约
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesReturnCreditNoteContract extends IBusinessLogicContract, ISalesBaseDocumentItem {

	/**
	 * 数量
	 * 
	 * @return
	 */
	BigDecimal getQuantity();

}
