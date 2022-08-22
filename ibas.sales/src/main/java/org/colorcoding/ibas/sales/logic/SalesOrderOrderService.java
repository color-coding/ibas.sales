package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;

/**
 * 销售订单-订购服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ISalesOrderOrderContract.class)
public class SalesOrderOrderService extends SalesOrderService<ISalesOrderOrderContract> {

	@Override
	protected ISalesOrder fetchBeAffected(ISalesOrderOrderContract contract) {
		return this.fetchBeAffected(contract.getBaseDocumentType(), contract.getBaseDocumentEntry());
	}

	@Override
	protected void impact(ISalesOrderOrderContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
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
	}

	@Override
	protected void revoke(ISalesOrderOrderContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
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
	}

}