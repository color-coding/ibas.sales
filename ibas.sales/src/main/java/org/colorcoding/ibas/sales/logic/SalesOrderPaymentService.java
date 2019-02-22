package org.colorcoding.ibas.sales.logic;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrder;

/**
 * 销售订单-付款服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ISalesOrderPaymentContract.class)
public class SalesOrderPaymentService extends SalesOrderService<ISalesOrderPaymentContract> {

	@Override
	protected ISalesOrder fetchBeAffected(ISalesOrderPaymentContract contract) {
		return this.fetchBeAffected(contract.getBaseDocumentType(), contract.getBaseDocumentEntry());
	}

	@Override
	protected void impact(ISalesOrderPaymentContract contract) {
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
	protected void revoke(ISalesOrderPaymentContract contract) {
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