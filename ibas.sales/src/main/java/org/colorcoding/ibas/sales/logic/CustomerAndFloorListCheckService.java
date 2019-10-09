package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.common.ConditionOperation;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.materials.bo.materialpricelist.IMaterialPriceList;
import org.colorcoding.ibas.materials.bo.materialpricelist.MaterialPriceList;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;

/**
 * 客户检查服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ICustomerAndFloorListCheckContract.class)
public class CustomerAndFloorListCheckService extends org.colorcoding.ibas.businesspartner.logic.CustomerCheckService {
	@Override
	protected void impact(org.colorcoding.ibas.businesspartner.logic.ICustomerCheckContract contract) {
		super.impact(contract);
		// 设置默认底价清单
		if (contract instanceof ICustomerAndFloorListCheckContract) {
			ICustomerAndFloorListCheckContract mContract = (ICustomerAndFloorListCheckContract) contract;
			// 获取底价清单
			boolean done = false;
			if (mContract.getPriceList() != null && mContract.getPriceList().compareTo(0) > 0) {
				// 使用价格清单的
				ICriteria criteria = new Criteria();
				criteria.setResultCount(1);
				criteria.setNoChilds(true);
				ICondition condition = criteria.getConditions().create();
				condition.setAlias(MaterialPriceList.PROPERTY_OBJECTKEY.getName());
				condition.setOperation(ConditionOperation.EQUAL);
				condition.setValue(mContract.getPriceList());

				BORepositoryMaterials boRepository = new BORepositoryMaterials();
				boRepository.setRepository(super.getRepository());
				IMaterialPriceList priceList = boRepository.fetchMaterialPriceList(criteria).getResultObjects()
						.firstOrDefault();
				if (priceList != null && priceList.getFloorList() != null
						&& priceList.getFloorList().compareTo(0) > 0) {
					mContract.setFloorList(priceList.getFloorList());
					done = true;
				}
			}
			if (!done && this.getBeAffected().getFloorList() != null
					&& this.getBeAffected().getFloorList().compareTo(0) > 0) {
				// 使用客户的
				mContract.setFloorList(this.getBeAffected().getFloorList());
			}
		}
	}
}
