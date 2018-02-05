package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.bobas.message.MessageLevel;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;

/**
 * 销售退货-付款服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ISalesReturnPaymentContract.class)
public class SalesReturnPaymentService extends SalesReturnService<ISalesReturnPaymentContract> {

	@Override
	protected boolean checkDataStatus(Object data) {
		if (data instanceof ISalesReturnPaymentContract) {
			ISalesReturnPaymentContract contract = (ISalesReturnPaymentContract) data;
			if (!SalesReturn.BUSINESS_OBJECT_CODE.equals(contract.getDocumentType())) {
				Logger.log(MessageLevel.DEBUG, MSG_LOGICS_SKIP_LOGIC_EXECUTION, this.getClass().getName(),
						"DocumentType", contract.getDocumentType());
				return false;
			}
		}
		return super.checkDataStatus(data);
	}

	@Override
	protected ISalesReturn fetchBeAffected(ISalesReturnPaymentContract contract) {
		return this.fetchBeAffected(contract.getDocumentType(), contract.getDocumentEntry());
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