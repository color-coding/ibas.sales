package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 销售的基于单据
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesBaseDocument extends IBusinessLogicContract {

	/**
	 * 基于单据类型
	 * 
	 * @return
	 */
	String getBaseDocumentType();

	/**
	 * 基于单据编号
	 * 
	 * @return
	 */
	Integer getBaseDocumentEntry();

}
