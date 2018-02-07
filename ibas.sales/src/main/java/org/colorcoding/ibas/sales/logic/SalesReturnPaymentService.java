package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturn;

/**
 * 销售退货-付款服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ISalesReturnPaymentContract.class)
public class SalesReturnPaymentService extends SalesReturnService<ISalesReturnPaymentContract> {

	@Override
	protected ISalesReturn fetchBeAffected(ISalesReturnPaymentContract contract) {
		return this.fetchBeAffected(contract.getBaseDocumentType(), contract.getBaseDocumentEntry());
	}

	@Override
	protected void impact(ISalesReturnPaymentContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
		Decimal paidTotal = this.getBeAffected().getPaidTotal();
		if (paidTotal == null) {
			paidTotal = Decimal.ZERO;
		}
		paidTotal = paidTotal.add(contract.getAmount());
		this.getBeAffected().setPaidTotal(paidTotal);
	}

	@Override
	protected void revoke(ISalesReturnPaymentContract contract) {
		if (this.getBeAffected() == null) {
			return;
		}
		Decimal paidTotal = this.getBeAffected().getPaidTotal();
		if (paidTotal == null) {
			paidTotal = Decimal.ZERO;
		}
		paidTotal = paidTotal.subtract(contract.getAmount());
		this.getBeAffected().setPaidTotal(paidTotal);
	}

}