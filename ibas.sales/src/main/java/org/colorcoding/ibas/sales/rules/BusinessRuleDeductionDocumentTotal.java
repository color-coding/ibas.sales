package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleDeductionDocumentTotal extends BusinessRuleCommon {

	protected BusinessRuleDeductionDocumentTotal() {
		this.setName(I18N.prop("msg_sl_business_rule_deduction_document_total"));
	}

	/**
	 * 构造方法
	 * 
	 * @param docTotal  属性-单据总计
	 * @param disTotal  属性-折扣总计
	 * @param shipTotal 属性-运费总计
	 * @param diffAmount 属性-舍入
	 */
	public BusinessRuleDeductionDocumentTotal(IPropertyInfo<BigDecimal> docTotal, IPropertyInfo<BigDecimal> disTotal,
			IPropertyInfo<BigDecimal> shipTotal, IPropertyInfo<BigDecimal> diffAmount) {
		this();
		this.setDocTotal(docTotal);
		this.setDisTotal(disTotal);
		this.setShipTotal(shipTotal);
		this.setDiffAmount(diffAmount);
		// 要输入的参数
		this.getInputProperties().add(this.getDocTotal());
		this.getInputProperties().add(this.getDisTotal());
		this.getInputProperties().add(this.getShipTotal());
		this.getInputProperties().add(this.getDiffAmount());
		// 要输出的参数
		this.getAffectedProperties().add(this.getDocTotal());
		this.getAffectedProperties().add(this.getDisTotal());
	}

	private IPropertyInfo<BigDecimal> docTotal;

	public final IPropertyInfo<BigDecimal> getDocTotal() {
		return docTotal;
	}

	public final void setDocTotal(IPropertyInfo<BigDecimal> docTotal) {
		this.docTotal = docTotal;
	}

	private IPropertyInfo<BigDecimal> disTotal;

	public final IPropertyInfo<BigDecimal> getDisTotal() {
		return disTotal;
	}

	public final void setDisTotal(IPropertyInfo<BigDecimal> disTotal) {
		this.disTotal = disTotal;
	}

	private IPropertyInfo<BigDecimal> shipTotal;

	public final IPropertyInfo<BigDecimal> getShipTotal() {
		return shipTotal;
	}

	public final void setShipTotal(IPropertyInfo<BigDecimal> shipTotal) {
		this.shipTotal = shipTotal;
	}

	private IPropertyInfo<BigDecimal> diffAmount;

	public final IPropertyInfo<BigDecimal> getDiffAmount() {
		return diffAmount;
	}

	public final void setDiffAmount(IPropertyInfo<BigDecimal> diffAmount) {
		this.diffAmount = diffAmount;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		BigDecimal docTotal = (BigDecimal) context.getInputValues().get(this.getDocTotal());
		if (docTotal == null) {
			docTotal = Decimal.ZERO;
		}
		BigDecimal disTotal = (BigDecimal) context.getInputValues().get(this.getDisTotal());
		if (disTotal == null) {
			disTotal = Decimal.ZERO;
		}
		BigDecimal shipTotal = this.getShipTotal() != null
				? (BigDecimal) context.getInputValues().get(this.getShipTotal())
				: Decimal.ZERO;
		if (shipTotal == null) {
			shipTotal = Decimal.ZERO;
		}
		BigDecimal diffAmount = this.getDiffAmount() != null
				? (BigDecimal) context.getInputValues().get(this.getDiffAmount())
				: Decimal.ZERO;
		if (diffAmount == null) {
			diffAmount = Decimal.ZERO;
		}
		if (Decimal.ZERO.compareTo(docTotal) == 0) {
			docTotal = Decimal.add(disTotal, shipTotal, diffAmount);
			context.getOutputValues().put(this.getDocTotal(), docTotal);
		} else if (Decimal.ZERO.compareTo(disTotal) == 0) {
			disTotal = Decimal.subtract(docTotal, shipTotal, diffAmount);
			context.getOutputValues().put(this.getDisTotal(), disTotal);
		} else {
			BigDecimal result = Decimal.add(disTotal, shipTotal, diffAmount);
			result = result.setScale(docTotal.scale(), Decimal.ROUNDING_MODE_DEFAULT);
			if (Decimal.ONE.compareTo(result.subtract(docTotal).abs().multiply(Decimal.ONE.add(Decimal.ONE))) <= 0) {
				context.getOutputValues().put(this.getDocTotal(), result);
			}
		}
	}

}
