package org.colorcoding.ibas.sales.logic;

import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.bobas.message.Logger;
import org.colorcoding.ibas.bobas.message.MessageLevel;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;

/**
 * 销售收货-付款服务
 * 
 * @author Niuren.Zhu
 *
 */
@LogicContract(ISalesDeliveryPaymentContract.class)
public class SalesDeliveryPaymentService extends SalesDeliveryService<ISalesDeliveryPaymentContract> {

	@Override
	protected boolean checkDataStatus(Object data) {
		if (data instanceof ISalesDeliveryPaymentContract) {
			ISalesDeliveryPaymentContract contract = (ISalesDeliveryPaymentContract) data;
			if (!SalesDelivery.BUSINESS_OBJECT_CODE.equals(contract.getDocumentType())) {
				Logger.log(MessageLevel.DEBUG, MSG_LOGICS_SKIP_LOGIC_EXECUTION, this.getClass().getName(),
						"DocumentType", contract.getDocumentType());
				return false;
			}
		}
		return super.checkDataStatus(data);
	}

	@Override
	protected ISalesDelivery fetchBeAffected(ISalesDeliveryPaymentContract contract) {
		return this.fetchBeAffected(contract.getDocumentType(), contract.getDocumentEntry());
	}

	@Override
	protected void impact(ISalesDeliveryPaymentContract contract) {
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
	protected void revoke(ISalesDeliveryPaymentContract contract) {
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