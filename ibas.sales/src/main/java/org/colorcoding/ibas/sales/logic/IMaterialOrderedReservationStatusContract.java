package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 物料订购预留关闭契约（通过目标单据）
 */
public interface IMaterialOrderedReservationStatusContract extends IBusinessLogicContract {

	/**
	 * 获取-目标单据类型
	 * 
	 * @return 值
	 */
	String getTargetDocumentType();

	/**
	 * 获取-目标单据编号
	 * 
	 * @return 值
	 */
	Integer getTargetDocumentEntry();

	/**
	 * 获取-目标单据行号
	 * 
	 * @return 值
	 */
	Integer getTargetDocumentLineId();

	/**
	 * 获取-目标单据状态
	 * 
	 * @return
	 */
	emDocumentStatus getTargetDocumentStatus();
}
