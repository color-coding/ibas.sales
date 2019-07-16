package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.mapping.LogicContract;

/**
 * 客户检查服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ICustomerCheckContract.class)
public class CustomerCheckService extends org.colorcoding.ibas.businesspartner.logic.CustomerCheckService {
	@Override
	protected void impact(org.colorcoding.ibas.businesspartner.logic.ICustomerCheckContract contract) {
		super.impact(contract);
		// 设置默认底价清单
		if (contract instanceof ICustomerCheckContract) {
			ICustomerCheckContract mContract = (ICustomerCheckContract) contract;
			if (this.getBeAffected().getFloorList() != null
					&& Integer.compare(this.getBeAffected().getFloorList(), 0) > 0) {
				if (mContract.getFloorList() == null || Integer.compare(mContract.getFloorList(), 0) <= 0) {
					mContract.setFloorList(this.getBeAffected().getFloorList());
				}
			}
		}
	}
}
