package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;

/**
 * 销售订单-交货服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ISalesOrderIssueContract.class)
public class SalesOrderIssueService extends SalesOrderService<ISalesOrderIssueContract> {

	@Override
	protected ISalesOrder fetchBeAffected(ISalesOrderIssueContract contract) {
		return this.fetchBeAffected(contract.getBaseDocumentType(), contract.getBaseDocumentEntry());
	}

	@Override
	protected void impact(ISalesOrderIssueContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
		ISalesOrderItem orderItem = this.getBeAffected().getSalesOrderItems()
				.firstOrDefault(c -> c.getLineId().compareTo(contract.getBaseDocumentLineId()) == 0);
		if (orderItem == null) {
			throw new BusinessLogicException(I18N.prop("msg_sl_not_found_order_item", contract.getBaseDocumentType(),
					contract.getBaseDocumentEntry(), contract.getBaseDocumentLineId()));
		}
		BigDecimal closedQuantity = orderItem.getClosedQuantity();
		if (closedQuantity == null) {
			closedQuantity = Decimal.ZERO;
		}
		closedQuantity = closedQuantity.add(contract.getQuantity());
		orderItem.setClosedQuantity(closedQuantity);
		if (orderItem.getLineStatus() == emDocumentStatus.RELEASED
				&& closedQuantity.compareTo(orderItem.getQuantity()) >= 0) {
			orderItem.setLineStatus(emDocumentStatus.FINISHED);
		}
		if (orderItem.getClosedQuantity().compareTo(Decimal.ZERO) > 0) {
			orderItem.setReferenced(emYesNo.YES);
		}
	}

	@Override
	protected void revoke(ISalesOrderIssueContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
		ISalesOrderItem orderItem = this.getBeAffected().getSalesOrderItems()
				.firstOrDefault(c -> c.getLineId().compareTo(contract.getBaseDocumentLineId()) == 0);
		if (orderItem == null) {
			throw new BusinessLogicException(I18N.prop("msg_sl_not_found_order_item", contract.getBaseDocumentType(),
					contract.getBaseDocumentEntry(), contract.getBaseDocumentLineId()));
		}
		BigDecimal closedQuantity = orderItem.getClosedQuantity();
		if (closedQuantity == null) {
			closedQuantity = Decimal.ZERO;
		}
		closedQuantity = closedQuantity.subtract(contract.getQuantity());
		orderItem.setClosedQuantity(closedQuantity);
		if (orderItem.getLineStatus() == emDocumentStatus.FINISHED
				&& closedQuantity.compareTo(orderItem.getQuantity()) < 0) {
			orderItem.setLineStatus(emDocumentStatus.RELEASED);
		}
		if (orderItem.getClosedQuantity().compareTo(Decimal.ZERO) <= 0) {
			orderItem.setReferenced(emYesNo.NO);
		}
	}

}