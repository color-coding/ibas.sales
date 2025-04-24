package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleDeductionCurrencyAmount extends BusinessRuleCommon {

	private final static BigDecimal PRICE_DIFF = new BigDecimal("0.01");

	protected BusinessRuleDeductionCurrencyAmount() {
		this.setName(I18N.prop("msg_sl_business_rule_deduction_currency_amount"));
	}

	/**
	 * 构造
	 * 
	 * @param amountLC 本币金额
	 * @param amount   金额
	 * @param rate     汇率
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
		this.getAffectedProperties().add(this.getRate());
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
			amountLC = Decimals.VALUE_ZERO;
		}
		BigDecimal amount = (BigDecimal) context.getInputValues().get(this.getAmount());
		if (amount == null) {
			amount = Decimals.VALUE_ZERO;
		}
		BigDecimal rate = (BigDecimal) context.getInputValues().get(this.getRate());
		if (rate == null) {
			rate = Decimals.VALUE_ZERO;
		}
		if (Decimals.isZero(rate)) {
			// 未设置汇率则为1
			rate = Decimals.VALUE_ONE;
		}
		if (Decimals.isZero(amount) && !Decimals.isZero(amountLC)) {
			// 输入了本币
			BigDecimal result = Decimals.multiply(amountLC, rate);
			if (amount.scale() > 0) {
				result = result.setScale(amount.scale(), Decimals.ROUNDING_MODE_DEFAULT);
			} else if (amountLC.scale() > 0) {
				result = result.setScale(amountLC.scale(), Decimals.ROUNDING_MODE_DEFAULT);
			}
			if (amount.subtract(result).abs().compareTo(PRICE_DIFF) > 0) {
				context.getOutputValues().put(this.getAmount(), result);
			}
		} else {
			// 输入了交易币
			BigDecimal result = Decimals.divide(amount, rate);
			if (amountLC.scale() > 0) {
				result = result.setScale(amountLC.scale(), Decimals.ROUNDING_MODE_DEFAULT);
			} else if (amount.scale() > 0) {
				result = result.setScale(amount.scale(), Decimals.ROUNDING_MODE_DEFAULT);
			}
			if (amountLC.subtract(result).abs().compareTo(PRICE_DIFF) > 0) {
				context.getOutputValues().put(this.getAmountLC(), result);
			}
		}
	}

}
