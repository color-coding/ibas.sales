package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleDeductionInverseDiscount extends BusinessRuleCommon {

	protected BusinessRuleDeductionInverseDiscount() {
		this.setName(I18N.prop("msg_sl_business_rule_deduction_discount"));
	}

	/**
	 * 构造方法
	 * 
	 * @param discount        属性-折扣
	 * @param inverseDiscount 属性-反向折扣
	 */
	public BusinessRuleDeductionInverseDiscount(IPropertyInfo<BigDecimal> discount,
			IPropertyInfo<BigDecimal> inverseDiscount) {
		this();
		this.setDiscount(discount);
		this.setInverseDiscount(inverseDiscount);
		// 要输入的参数
		this.getInputProperties().add(this.getDiscount());
		this.getInputProperties().add(this.getInverseDiscount());
		// 要输出的参数
		this.getAffectedProperties().add(this.getInverseDiscount());
	}

	private IPropertyInfo<BigDecimal> discount;

	public final IPropertyInfo<BigDecimal> getDiscount() {
		return discount;
	}

	public final void setDiscount(IPropertyInfo<BigDecimal> discount) {
		this.discount = discount;
	}

	private IPropertyInfo<BigDecimal> inverseDiscount;

	public final IPropertyInfo<BigDecimal> getInverseDiscount() {
		return inverseDiscount;
	}

	public final void setInverseDiscount(IPropertyInfo<BigDecimal> inverseDiscount) {
		this.inverseDiscount = inverseDiscount;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		BigDecimal discount = (BigDecimal) context.getInputValues().get(this.getDiscount());
		if (discount == null) {
			discount = Decimal.ZERO;
		}
		BigDecimal inverseDiscount = (BigDecimal) context.getInputValues().get(this.getInverseDiscount());
		if (inverseDiscount == null) {
			inverseDiscount = Decimal.ZERO;
		}
		BigDecimal result = Decimal.ONE.subtract(discount);
		if (discount.scale() > 0) {
			result = result.setScale(discount.scale(), Decimal.ROUNDING_MODE_DEFAULT);
			if (result.compareTo(inverseDiscount) != 0) {
				context.getOutputValues().put(this.getInverseDiscount(), result);
			}
		} else {
			context.getOutputValues().put(this.getInverseDiscount(), result);
		}
	}

}
