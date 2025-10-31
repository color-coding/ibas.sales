package org.colorcoding.ibas.sales.rules;

import org.colorcoding.ibas.bobas.common.DateTimes;
import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleCancellationDate extends BusinessRuleCommon {

	public BusinessRuleCancellationDate(IPropertyInfo<emYesNo> canceled, IPropertyInfo<DateTime> cancellationDate) {
		this.setName(I18N.prop("msg_sl_business_rule_cancellation_date"));
		this.canceled = canceled;
		this.cancellationDate = cancellationDate;
		this.getInputProperties().add(canceled);
		this.getInputProperties().add(cancellationDate);
		this.getAffectedProperties().add(cancellationDate);
	}

	private IPropertyInfo<emYesNo> canceled;

	protected final IPropertyInfo<emYesNo> getCanceled() {
		return canceled;
	}

	protected final void setCanceled(IPropertyInfo<emYesNo> canceled) {
		this.canceled = canceled;
	}

	private IPropertyInfo<DateTime> cancellationDate;

	protected final IPropertyInfo<DateTime> getCancellationDate() {
		return cancellationDate;
	}

	protected final void setCancellationDate(IPropertyInfo<DateTime> cancellationDate) {
		this.cancellationDate = cancellationDate;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		emYesNo canceled = (emYesNo) context.getInputValues().get(this.getCanceled());
		if (canceled == null) {
			canceled = emYesNo.NO;
		}
		DateTime cancellationDate = (DateTime) context.getInputValues().get(this.getCancellationDate());
		if (cancellationDate == null) {
			cancellationDate = DateTimes.VALUE_MIN;
		}
		if (canceled == emYesNo.YES) {
			if (DateTimes.VALUE_MIN.equals(cancellationDate)) {
				context.getOutputValues().put(this.getCancellationDate(), DateTimes.today());
			}
		} else {
			if (!DateTimes.VALUE_MIN.equals(cancellationDate)) {
				context.getOutputValues().put(this.getCancellationDate(), DateTimes.VALUE_MIN);
			}
		}

	}

}
