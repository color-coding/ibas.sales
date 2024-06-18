package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleDeductionTaxPrice extends BusinessRuleCommon {

	protected BusinessRuleDeductionTaxPrice() {
		this.setName(I18N.prop("msg_sl_business_rule_deduction_tax_price"));
	}

	/**
	 * 构造方法
	 * 
	 * @param taxRate  属性-税率
	 * @param preTax   属性-税前
	 * @param afterTax 属性-税后
	 */
	public BusinessRuleDeductionTaxPrice(IPropertyInfo<BigDecimal> taxRate, IPropertyInfo<BigDecimal> preTax,
			IPropertyInfo<BigDecimal> afterTax) {
		this();
		this.setTaxRate(taxRate);
		this.setAfterTax(afterTax);
		this.setPreTax(preTax);
		// 要输入的参数
		this.getInputProperties().add(this.getTaxRate());
		this.getInputProperties().add(this.getPreTax());
		this.getInputProperties().add(this.getAfterTax());
		// 要输出的参数
		this.getAffectedProperties().add(this.getTaxRate());
		this.getAffectedProperties().add(this.getPreTax());
		this.getAffectedProperties().add(this.getAfterTax());
	}

	private IPropertyInfo<BigDecimal> preTax;

	public final IPropertyInfo<BigDecimal> getPreTax() {
		return preTax;
	}

	public final void setPreTax(IPropertyInfo<BigDecimal> preTax) {
		this.preTax = preTax;
	}

	private IPropertyInfo<BigDecimal> taxRate;

	public final IPropertyInfo<BigDecimal> getTaxRate() {
		return taxRate;
	}

	public final void setTaxRate(IPropertyInfo<BigDecimal> taxRate) {
		this.taxRate = taxRate;
	}

	private IPropertyInfo<BigDecimal> afterTax;

	public final IPropertyInfo<BigDecimal> getAfterTax() {
		return afterTax;
	}

	public final void setAfterTax(IPropertyInfo<BigDecimal> afterTax) {
		this.afterTax = afterTax;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		BigDecimal taxRate = (BigDecimal) context.getInputValues().get(this.getTaxRate());
		if (taxRate == null) {
			taxRate = Decimal.ZERO;
		}
		BigDecimal preTax = (BigDecimal) context.getInputValues().get(this.getPreTax());
		if (preTax == null) {
			preTax = Decimal.ZERO;
		}
		BigDecimal afterTax = (BigDecimal) context.getInputValues().get(this.getAfterTax());
		if (afterTax == null) {
			afterTax = Decimal.ZERO;
		}
		if (taxRate.compareTo(Decimal.ZERO) <= 0) {
			context.getOutputValues().put(this.getTaxRate(), Decimal.ZERO);
			context.getOutputValues().put(this.getAfterTax(), preTax);
		} else {
			if (Decimal.ZERO.compareTo(afterTax) == 0 && Decimal.ZERO.compareTo(preTax) != 0) {
				afterTax = Decimal.multiply(preTax, taxRate.add(Decimal.ONE));
				context.getOutputValues().put(this.getAfterTax(), afterTax);
			} else if (Decimal.ZERO.compareTo(preTax) == 0 && Decimal.ZERO.compareTo(afterTax) != 0) {
				preTax = Decimal.divide(afterTax, taxRate.add(Decimal.ONE));
				context.getOutputValues().put(this.getPreTax(), preTax);
			} else {
				BigDecimal result = Decimal.divide(afterTax, taxRate.add(Decimal.ONE));
				result.setScale(preTax.scale(), Decimal.ROUNDING_MODE_DEFAULT);
				if (Decimal.ONE.compareTo(result.subtract(preTax).abs().multiply(Decimal.ONE.add(Decimal.ONE))) <= 0) {
					context.getOutputValues().put(this.getPreTax(), preTax);
				}
			}
		}
	}

}
