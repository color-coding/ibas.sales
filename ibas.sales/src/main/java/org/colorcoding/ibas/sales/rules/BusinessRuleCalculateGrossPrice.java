package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleCalculateGrossPrice extends BusinessRuleCommon {

	protected BusinessRuleCalculateGrossPrice() {
		this.setName(I18N.prop("msg_sl_business_rule_calculate_gross_price"));
	}

	/**
	 * 构造方法
	 * 
	 * @param result     属性-结果
	 * @param original   属性-原价
	 * @param multiplier 属性-税率
	 */
	public BusinessRuleCalculateGrossPrice(IPropertyInfo<BigDecimal> result, IPropertyInfo<BigDecimal> original,
			IPropertyInfo<BigDecimal> taxRate) {
		this();
		this.setOriginal(original);
		this.setTaxRate(taxRate);
		this.setResult(result);
		// 要输入的参数
		this.getInputProperties().add(this.getOriginal());
		this.getInputProperties().add(this.getTaxRate());
		// 结果
		this.getAffectedProperties().add(this.getResult());
	}

	private IPropertyInfo<BigDecimal> original;

	public final IPropertyInfo<BigDecimal> getOriginal() {
		return original;
	}

	public final void setOriginal(IPropertyInfo<BigDecimal> original) {
		this.original = original;
	}

	private IPropertyInfo<BigDecimal> taxRate;

	public final IPropertyInfo<BigDecimal> getTaxRate() {
		return taxRate;
	}

	public final void setTaxRate(IPropertyInfo<BigDecimal> taxRate) {
		this.taxRate = taxRate;
	}

	private IPropertyInfo<BigDecimal> result;

	public final IPropertyInfo<BigDecimal> getResult() {
		return result;
	}

	public final void setResult(IPropertyInfo<BigDecimal> result) {
		this.result = result;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		BigDecimal original = (BigDecimal) context.getInputValues().get(this.getOriginal());
		if (original == null) {
			original = Decimal.ZERO;
		}
		BigDecimal taxRate = (BigDecimal) context.getInputValues().get(this.getTaxRate());
		if (taxRate == null) {
			taxRate = Decimal.ZERO;
		}
		BigDecimal result = Decimal.multiply(original, taxRate.add(Decimal.ONE));
		// 截取精度
		result = Decimal.round(result, Decimal.DECIMAL_PLACES_RUNNING);
		context.getOutputValues().put(this.getResult(), result);
	}

}
