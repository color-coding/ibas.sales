package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 销售订单，订购契约
 * 
 * @author Niuren.Zhu
 *
 */
public interface ISalesOrderOrderContract extends IBusinessLogicContract {

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

	/**
	 * 基于单据行号
	 * 
	 * @return
	 */
	Integer getBaseDocumentLineId();

	/**
	 * 数量（库存单位）。
	 * 采购、生产等来源回写销售订单时，调用方必须提供库存单位数量。
	 * 
	 * @return 库存单位数量
	 */
	BigDecimal getQuantity();

}
