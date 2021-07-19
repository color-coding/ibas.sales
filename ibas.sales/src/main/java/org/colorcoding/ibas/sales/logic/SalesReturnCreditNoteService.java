package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturnItem;

/**
 * 销售退货-贷项服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ISalesReturnCreditNoteContract.class)
public class SalesReturnCreditNoteService extends SalesReturnService<ISalesReturnCreditNoteContract> {

	@Override
	protected ISalesReturn fetchBeAffected(ISalesReturnCreditNoteContract contract) {
		return this.fetchBeAffected(contract.getBaseDocumentType(), contract.getBaseDocumentEntry());
	}

	@Override
	protected void impact(ISalesReturnCreditNoteContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
		ISalesReturnItem orderItem = this.getBeAffected().getSalesReturnItems()
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
	}

	@Override
	protected void revoke(ISalesReturnCreditNoteContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
		ISalesReturnItem orderItem = this.getBeAffected().getSalesReturnItems()
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
	}

}