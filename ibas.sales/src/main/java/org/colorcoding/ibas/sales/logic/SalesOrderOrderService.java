package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.common.ConditionOperation;
import org.colorcoding.ibas.bobas.common.ConditionRelationship;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.logic.BusinessLogic;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.bobas.message.MessageLevel;
import org.colorcoding.ibas.sales.MyConfiguration;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 销售订单-订购服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ISalesOrderOrderContract.class)
public class SalesOrderOrderService extends BusinessLogic<ISalesOrderOrderContract, ISalesOrder> {

	@Override
	protected boolean checkDataStatus(Object data) {
		if (data instanceof ISalesOrderOrderContract) {
			ISalesOrderOrderContract contract = (ISalesOrderOrderContract) data;
			if (!MyConfiguration.applyVariables(SalesOrder.BUSINESS_OBJECT_CODE)
					.equals(contract.getBaseDocumentType())) {
				Logger.log(MessageLevel.DEBUG, MSG_LOGICS_SKIP_LOGIC_EXECUTION, this.getClass().getName(),
						"BaseDocumentType", contract.getBaseDocumentType());
				return false;
			}
		}
		return super.checkDataStatus(data);
	}

	@Override
	protected ISalesOrder fetchBeAffected(ISalesOrderOrderContract contract) {
		// 必须要差完整对象，不然业务逻辑会出错
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(SalesOrder.PROPERTY_OBJECTCODE.getName());
		condition.setOperation(ConditionOperation.EQUAL);
		condition.setValue(contract.getBaseDocumentType());
		condition = criteria.getConditions().create();
		condition.setRelationship(ConditionRelationship.AND);
		condition.setAlias(SalesOrder.PROPERTY_DOCENTRY.getName());
		condition.setOperation(ConditionOperation.EQUAL);
		condition.setValue(contract.getBaseDocumentEntry());

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
			throw new BusinessLogicException(I18N.prop("msg_sl_not_found_order", contract.getBaseDocumentType(),
					contract.getBaseDocumentEntry()));
		}
		return order;
	}

	@Override
	protected void impact(ISalesOrderOrderContract contract) {
		ISalesOrderItem orderItem = this.getBeAffected().getSalesOrderItems()
				.firstOrDefault(c -> c.getLineId().compareTo(contract.getBaseDocumentLineId()) == 0);
		if (orderItem == null) {
			throw new BusinessLogicException(I18N.prop("msg_sl_not_found_order_item", contract.getBaseDocumentType(),
					contract.getBaseDocumentEntry(), contract.getBaseDocumentLineId()));
		}
		BigDecimal orderedQuantity = orderItem.getOrderedQuantity();
		if (orderedQuantity == null) {
			orderedQuantity = Decimal.ZERO;
		}
		orderedQuantity = orderedQuantity.add(contract.getQuantity());
		orderItem.setOrderedQuantity(orderedQuantity);
		if (orderItem.getClosedQuantity().compareTo(Decimal.ZERO) > 0) {
			orderItem.setReferenced(emYesNo.YES);
		}
	}

	@Override
	protected void revoke(ISalesOrderOrderContract contract) {
		ISalesOrderItem orderItem = this.getBeAffected().getSalesOrderItems()
				.firstOrDefault(c -> c.getLineId().compareTo(contract.getBaseDocumentLineId()) == 0);
		if (orderItem == null) {
			throw new BusinessLogicException(I18N.prop("msg_sl_not_found_order_item", contract.getBaseDocumentType(),
					contract.getBaseDocumentEntry(), contract.getBaseDocumentLineId()));
		}
		BigDecimal orderedQuantity = orderItem.getOrderedQuantity();
		if (orderedQuantity == null) {
			orderedQuantity = Decimal.ZERO;
		}
		orderedQuantity = orderedQuantity.subtract(contract.getQuantity());
		orderItem.setOrderedQuantity(orderedQuantity);
		if (orderItem.getClosedQuantity().compareTo(Decimal.ZERO) <= 0) {
			orderItem.setReferenced(emYesNo.NO);
		}
	}

}