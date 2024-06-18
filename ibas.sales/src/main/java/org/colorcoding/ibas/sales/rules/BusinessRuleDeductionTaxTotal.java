package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleDeductionTaxTotal extends BusinessRuleCommon {

	protected BusinessRuleDeductionTaxTotal() {
		this.setName(I18N.prop("msg_sl_business_rule_deduction_tax_total"));
	}

	/**
	 * 构造方法
	 * 
	 * @param tax     属性-税总计
	 * @param total   属性-税前总计
	 * @param taxRate 属性-税率
	 */
	public BusinessRuleDeductionTaxTotal(IPropertyInfo<BigDecimal> tax, IPropertyInfo<BigDecimal> total,
			IPropertyInfo<BigDecimal> taxRate) {
		this();
		this.setTax(tax);
		this.setTotal(total);
		this.setTaxRate(taxRate);
		// 要输入的参数
		this.getInputProperties().add(this.getTax());
		this.getInputProperties().add(this.getTotal());
		this.getInputProperties().add(this.getTaxRate());
		// 要输出的参数
		this.getAffectedProperties().add(this.getTax());
		this.getAffectedProperties().add(this.getTotal());
		this.getAffectedProperties().add(this.getTaxRate());
	}

	private IPropertyInfo<BigDecimal> tax;

	protected final IPropertyInfo<BigDecimal> getTax() {
		return tax;
	}

	protected final void setTax(IPropertyInfo<BigDecimal> tax) {
		this.tax = tax;
	}

	private IPropertyInfo<BigDecimal> total;

	protected final IPropertyInfo<BigDecimal> getTotal() {
		return total;
	}

	protected final void setTotal(IPropertyInfo<BigDecimal> total) {
		this.total = total;
	}

	private IPropertyInfo<BigDecimal> taxRate;

	protected final IPropertyInfo<BigDecimal> getTaxRate() {
		return taxRate;
	}

	protected final void setTaxRate(IPropertyInfo<BigDecimal> taxRate) {
		this.taxRate = taxRate;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		BigDecimal taxRate = (BigDecimal) context.getInputValues().get(this.getTaxRate());
		if (taxRate == null) {
			taxRate = Decimal.ZERO;
		}
		BigDecimal tax = (BigDecimal) context.getInputValues().get(this.getTax());
		if (tax == null) {
			tax = Decimal.ZERO;
		}
		BigDecimal total = (BigDecimal) context.getInputValues().get(this.getTotal());
		if (total == null) {
			total = Decimal.ZERO;
		}
		if (taxRate.compareTo(Decimal.ZERO) <= 0) {
			context.getOutputValues().put(this.getTaxRate(), Decimal.ZERO);
			context.getOutputValues().put(this.getTax(), Decimal.ZERO);
		} else {
			if (Decimal.ZERO.compareTo(tax) == 0 && Decimal.ZERO.compareTo(total) != 0) {
				tax = Decimal.multiply(total, taxRate);
				context.getOutputValues().put(this.getTax(), tax);
			} else if (Decimal.ZERO.compareTo(total) == 0 && Decimal.ZERO.compareTo(tax) != 0) {
				total = Decimal.divide(tax, taxRate);
				context.getOutputValues().put(this.getTotal(), total);
			} else {
				BigDecimal result = Decimal.multiply(total, taxRate);
				result.setScale(tax.scale(), Decimal.ROUNDING_MODE_DEFAULT);
				if (Decimal.ONE.compareTo(result.subtract(tax).abs().multiply(Decimal.ONE.add(Decimal.ONE))) <= 0) {
					context.getOutputValues().put(this.getTax(), tax);
				}
			}
		}
	}

}
