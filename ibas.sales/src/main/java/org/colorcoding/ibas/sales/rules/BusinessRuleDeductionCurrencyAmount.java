package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleDeductionCurrencyAmount extends BusinessRuleCommon {
	protected BusinessRuleDeductionCurrencyAmount() {
		this.setName(I18N.prop("msg_sl_business_rule_deduction_currency_amount"));
	}

	/**
	 * 构造
	 * @param amountLC 本币金额
	 * @param amount 金额
	 * @param rate 汇率
	 */
	public BusinessRuleDeductionCurrencyAmount(IPropertyInfo<BigDecimal> amountLC, IPropertyInfo<BigDecimal> amount,
			IPropertyInfo<BigDecimal> rate) {
		this();
		this.setAmountLC(amountLC);
		this.setAmount(amount);
		this.setRate(rate);
		// 要输入的参数
		this.getInputProperties().add(this.getAmountLC());
		this.getInputProperties().add(this.getAmount());
		this.getInputProperties().add(this.getRate());
		// 要输出的参数
		this.getAffectedProperties().add(this.getAmountLC());
		this.getAffectedProperties().add(this.getAmount());
	}

	private IPropertyInfo<BigDecimal> amountLC;

	protected final IPropertyInfo<BigDecimal> getAmountLC() {
		return amountLC;
	}

	protected final void setAmountLC(IPropertyInfo<BigDecimal> amountLC) {
		this.amountLC = amountLC;
	}

	private IPropertyInfo<BigDecimal> amount;

	protected final IPropertyInfo<BigDecimal> getAmount() {
		return amount;
	}

	protected final void setAmount(IPropertyInfo<BigDecimal> amount) {
		this.amount = amount;
	}

	private IPropertyInfo<BigDecimal> rate;

	protected final IPropertyInfo<BigDecimal> getRate() {
		return rate;
	}

	protected final void setRate(IPropertyInfo<BigDecimal> rate) {
		this.rate = rate;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		BigDecimal amountLC = (BigDecimal) context.getInputValues().get(this.getAmountLC());
		if (amountLC == null) {
			amountLC = Decimal.ZERO;
		}
		BigDecimal amount = (BigDecimal) context.getInputValues().get(this.getAmount());
		if (amount == null) {
			amount = Decimal.ZERO;
		}
		BigDecimal rate = (BigDecimal) context.getInputValues().get(this.getRate());
		if (rate == null) {
			rate = Decimal.ZERO;
		}
		if (Decimal.isZero(rate)) {
			throw new BusinessLogicException(I18N.prop("msg_ac_data_not_set_currency_rate", context.getSource()));
		}
		if (Decimal.isZero(amount) && !Decimal.isZero(amountLC)) {
			// 输入了本币
			BigDecimal result = Decimal.divide(amountLC, rate);
			if (amount.scale() > 0) {
				result.setScale(amount.scale(), Decimal.ROUNDING_MODE_DEFAULT);
			} else if (amountLC.scale() > 0) {
				result.setScale(amountLC.scale(), Decimal.ROUNDING_MODE_DEFAULT);
			}
			if (amount.compareTo(result) != 0) {
				context.getOutputValues().put(this.getAmount(), result);
			}
		} else {
			// 输入了交易币
			BigDecimal result = Decimal.multiply(amount, rate);
			if (amountLC.scale() > 0) {
				result.setScale(amountLC.scale(), Decimal.ROUNDING_MODE_DEFAULT);
			} else if (amount.scale() > 0) {
				result.setScale(amount.scale(), Decimal.ROUNDING_MODE_DEFAULT);
			}
			if (amountLC.compareTo(result) != 0) {
				context.getOutputValues().put(this.getAmountLC(), result);
			}
		}
	}

}
