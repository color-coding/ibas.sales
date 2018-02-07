package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.common.ConditionOperation;
import org.colorcoding.ibas.bobas.common.ConditionRelationship;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.logic.BusinessLogic;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.bobas.message.MessageLevel;
import org.colorcoding.ibas.sales.MyConfiguration;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 销售订单-服务
 * 
 * @author Niuren.Zhu
 *
 */
public abstract class SalesOrderService<L extends IBusinessLogicContract> extends BusinessLogic<L, ISalesOrder> {

	@Override
	protected boolean checkDataStatus(Object data) {
		if (data instanceof ISalesBaseDoucment) {
			ISalesBaseDoucment contract = (ISalesBaseDoucment) data;
			if (!MyConfiguration.applyVariables(SalesOrder.BUSINESS_OBJECT_CODE)
					.equals(contract.getBaseDocumentType())) {
				Logger.log(MessageLevel.DEBUG, MSG_LOGICS_SKIP_LOGIC_EXECUTION, this.getClass().getName(),
						"BaseDocumentType", contract.getBaseDocumentType());
				return false;
			}
		}
		return super.checkDataStatus(data);
	}

	protected ISalesOrder fetchBeAffected(String docType, Integer docEntry) {
		// 必须要差完整对象，不然业务逻辑会出错
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(SalesOrder.PROPERTY_OBJECTCODE.getName());
		condition.setOperation(ConditionOperation.EQUAL);
		condition.setValue(docType);
		condition = criteria.getConditions().create();
		condition.setRelationship(ConditionRelationship.AND);
		condition.setAlias(SalesOrder.PROPERTY_DOCENTRY.getName());
		condition.setOperation(ConditionOperation.EQUAL);
		condition.setValue(docEntry);

		ISalesOrder order = this.fetchBeAffected(criteria, ISalesOrder.class);
		if (order == null) {
			BORepositorySales boRepository = new BORepositorySales();
			boRepository.setRepository(super.getRepository());
			IOperationResult<ISalesOrder> operationResult = boRepository.fetchSalesOrder(criteria);
			if (operationResult.getError() != null) {
				throw new BusinessLogicException(operationResult.getError());
			}
			order = operationResult.getResultObjects().firstOrDefault();
		}
		if (order == null) {
			throw new BusinessLogicException(I18N.prop("msg_sl_not_found_order", docType, docEntry));
		}
		return order;
	}

}