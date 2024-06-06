package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleDeductionDiscount extends BusinessRuleCommon {

	protected BusinessRuleDeductionDiscount() {
		this.setName(I18N.prop("msg_sl_business_rule_deduction_discount"));
	}

	/**
	 * 构造方法
	 * 
	 * @param discount      属性-折扣
	 * @param preDiscount   属性-折扣前
	 * @param afterDiscount 属性-折扣后
	 */
	public BusinessRuleDeductionDiscount(IPropertyInfo<BigDecimal> discount, IPropertyInfo<BigDecimal> preDiscount,
			IPropertyInfo<BigDecimal> afterDiscount) {
		this();
		this.setDiscount(discount);
		this.setAfterDiscount(afterDiscount);
		this.setPreDiscount(preDiscount);
		// 要输入的参数
		this.getInputProperties().add(this.getDiscount());
		this.getInputProperties().add(this.getPreDiscount());
		this.getInputProperties().add(this.getAfterDiscount());
		// 要输出的参数
		this.getAffectedProperties().add(this.getDiscount());
		this.getAffectedProperties().add(this.getPreDiscount());
		this.getAffectedProperties().add(this.getAfterDiscount());
	}

	private IPropertyInfo<BigDecimal> preDiscount;

	public final IPropertyInfo<BigDecimal> getPreDiscount() {
		return preDiscount;
	}

	public final void setPreDiscount(IPropertyInfo<BigDecimal> preDiscount) {
		this.preDiscount = preDiscount;
	}

	private IPropertyInfo<BigDecimal> discount;

	public final IPropertyInfo<BigDecimal> getDiscount() {
		return discount;
	}

	public final void setDiscount(IPropertyInfo<BigDecimal> discount) {
		this.discount = discount;
	}

	private IPropertyInfo<BigDecimal> afterDiscount;

	public final IPropertyInfo<BigDecimal> getAfterDiscount() {
		return afterDiscount;
	}

	public final void setAfterDiscount(IPropertyInfo<BigDecimal> afterDiscount) {
		this.afterDiscount = afterDiscount;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		BigDecimal discount = (BigDecimal) context.getInputValues().get(this.getDiscount());
		if (discount == null) {
			discount = Decimal.ZERO;
		}
		BigDecimal preDiscount = (BigDecimal) context.getInputValues().get(this.getPreDiscount());
		if (preDiscount == null) {
			preDiscount = Decimal.ZERO;
		}
		BigDecimal afterDiscount = (BigDecimal) context.getInputValues().get(this.getAfterDiscount());
		if (afterDiscount == null) {
			afterDiscount = Decimal.ZERO;
		}
		// 无效折扣，则为1
		if (Decimal.ZERO.compareTo(discount) >= 0) {
			discount = Decimal.ONE;
			context.getOutputValues().put(this.getDiscount(), discount);
		}
		if (Decimal.ZERO.compareTo(afterDiscount) == 0 && Decimal.ZERO.compareTo(preDiscount) != 0) {
			// 根据折前计算折后
			afterDiscount = Decimal.multiply(preDiscount, discount);
			context.getOutputValues().put(this.getAfterDiscount(), afterDiscount);
		} else if (Decimal.ZERO.compareTo(preDiscount) == 0 && Decimal.ZERO.compareTo(afterDiscount) != 0) {
			// 根据折后计算折前
			preDiscount = Decimal.divide(afterDiscount, discount);
			context.getOutputValues().put(this.getPreDiscount(), preDiscount);
		} else {
			// 计算折扣
			BigDecimal result = Decimal.isZero(preDiscount) ? Decimal.ONE : Decimal.divide(afterDiscount, preDiscount);
			if (discount.scale() > 0) {
				result.setScale(discount.scale(), Decimal.ROUNDING_MODE_DEFAULT);
				if (result.compareTo(discount) != 0) {
					context.getOutputValues().put(this.getDiscount(), result);
				}
			} else {
				context.getOutputValues().put(this.getDiscount(), result);
			}
		}
	}

}
