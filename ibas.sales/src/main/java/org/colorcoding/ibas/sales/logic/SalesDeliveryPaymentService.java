package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;

/**
 * 销售收货-付款服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ISalesDeliveryPaymentContract.class)
public class SalesDeliveryPaymentService extends SalesDeliveryService<ISalesDeliveryPaymentContract> {

	@Override
	protected ISalesDelivery fetchBeAffected(ISalesDeliveryPaymentContract contract) {
		return this.fetchBeAffected(contract.getBaseDocumentType(), contract.getBaseDocumentEntry());
	}

	@Override
	protected void impact(ISalesDeliveryPaymentContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
		BigDecimal paidTotal = this.getBeAffected().getPaidTotal();
		if (paidTotal == null) {
			paidTotal = Decimal.ZERO;
		}
		paidTotal = paidTotal.add(contract.getAmount());
		this.getBeAffected().setPaidTotal(paidTotal);
	}

	@Override
	protected void revoke(ISalesDeliveryPaymentContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
		BigDecimal paidTotal = this.getBeAffected().getPaidTotal();
		if (paidTotal == null) {
			paidTotal = Decimal.ZERO;
		}
		paidTotal = paidTotal.subtract(contract.getAmount());
		this.getBeAffected().setPaidTotal(paidTotal);
	}

}