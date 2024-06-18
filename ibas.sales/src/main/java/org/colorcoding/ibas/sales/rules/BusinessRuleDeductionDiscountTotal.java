package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleDeductionDiscountTotal extends BusinessRuleCommon {

	protected BusinessRuleDeductionDiscountTotal() {
		this.setName(I18N.prop("msg_sl_business_rule_deduction_discount_total"));
	}

	/**
	 * 构造方法
	 * 
	 * @param total    属性-折扣后总计
	 * @param preTotal 属性-折扣前总计
	 * @param discount 属性-折扣
	 */
	public BusinessRuleDeductionDiscountTotal(IPropertyInfo<BigDecimal> total, IPropertyInfo<BigDecimal> preTotal,
			IPropertyInfo<BigDecimal> discount) {
		this();
		this.setTotal(total);
		this.setPreTotal(preTotal);
		this.setDiscount(discount);
		// 要输入的参数
		this.getInputProperties().add(this.getTotal());
		this.getInputProperties().add(this.getPreTotal());
		this.getInputProperties().add(this.getDiscount());
		// 要输出的参数
		this.getAffectedProperties().add(this.getTotal());
		this.getAffectedProperties().add(this.getDiscount());
	}

	private IPropertyInfo<BigDecimal> total;

	protected final IPropertyInfo<BigDecimal> getTotal() {
		return total;
	}

	protected final void setTotal(IPropertyInfo<BigDecimal> total) {
		this.total = total;
	}

	private IPropertyInfo<BigDecimal> preTotal;

	protected final IPropertyInfo<BigDecimal> getPreTotal() {
		return preTotal;
	}

	protected final void setPreTotal(IPropertyInfo<BigDecimal> preTotal) {
		this.preTotal = preTotal;
	}

	private IPropertyInfo<BigDecimal> discount;

	protected final IPropertyInfo<BigDecimal> getDiscount() {
		return discount;
	}

	protected final void setDiscount(IPropertyInfo<BigDecimal> discount) {
		this.discount = discount;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		BigDecimal discount = (BigDecimal) context.getInputValues().get(this.getDiscount());
		if (discount == null) {
			discount = Decimal.ZERO;
		}
		BigDecimal total = (BigDecimal) context.getInputValues().get(this.getTotal());
		if (total == null) {
			total = Decimal.ZERO;
		}
		BigDecimal preTotal = (BigDecimal) context.getInputValues().get(this.getPreTotal());
		if (preTotal == null) {
			preTotal = Decimal.ZERO;
		}
		if (discount.compareTo(Decimal.ZERO) < 0) {
			context.getOutputValues().put(this.getDiscount(), Decimal.ONE);
			context.getOutputValues().put(this.getTotal(), preTotal);
		} else {
			if (Decimal.ZERO.compareTo(total) == 0 && Decimal.ZERO.compareTo(preTotal) != 0) {
				total = Decimal.multiply(preTotal, discount);
				context.getOutputValues().put(this.getTotal(), total);
			} else if (Decimal.ZERO.compareTo(preTotal) == 0 && Decimal.ZERO.compareTo(total) != 0) {
				preTotal = Decimal.isZero(discount) ? Decimal.ZERO : Decimal.divide(total, discount);
				context.getOutputValues().put(this.getPreTotal(), preTotal);
			} else {
				BigDecimal result = Decimal.isZero(preTotal) ? Decimal.ONE : Decimal.divide(total, preTotal);
				if (Decimal.ZERO.compareTo(discount) == 0) {
					context.getOutputValues().put(this.getDiscount(), result);
				} else {
					result.setScale(discount.scale(), Decimal.ROUNDING_MODE_DEFAULT);
					if (Decimal.ONE.compareTo(result.subtract(total).abs().multiply(Decimal.valueOf("100"))
							.multiply(Decimal.ONE.add(Decimal.ONE))) <= 0) {
						context.getOutputValues().put(this.getDiscount(), result);
					}
				}
			}
		}
	}

}
