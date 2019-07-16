package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;

/**
 * 客户检查契约
 * 
 * @author Niuren.Zhu
 *
 */
public interface ICustomerCheckContract
		extends IBusinessLogicContract, org.colorcoding.ibas.businesspartner.logic.ICustomerCheckContract {

	/**
	 * 获取-底价清单
	 * 
	 * @return 值
	 */
	Integer getFloorList();

	/**
	 * 设置-底价清单
	 * 
	 * @param value 值
	 */
	void setFloorList(Integer value);
}
