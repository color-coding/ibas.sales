package org.colorcoding.ibas.sales.rules;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.rule.BusinessRuleCommon;

public class BusinessRuleDeductionPriceTaxTotal extends BusinessRuleCommon {

	protected BusinessRuleDeductionPriceTaxTotal() {
		this.setName(I18N.prop("msg_sl_business_rule_deduction_price_tax_total"));
	}

	/**
	 * 构造方法
	 * 
	 * @param total    属性-总计
	 * @param price    属性-价格
	 * @param quantity 属性-数量
	 * @param taxRate  属性-税率
	 * @param taxTotal 属性-税总计
	 * @param preTotal 属性-税前总计
	 * @param prePrice 属性-税前价格
	 */
	public BusinessRuleDeductionPriceTaxTotal(IPropertyInfo<BigDecimal> total, IPropertyInfo<BigDecimal> price,
			IPropertyInfo<BigDecimal> quantity, IPropertyInfo<BigDecimal> taxRate, IPropertyInfo<BigDecimal> taxTotal,
			IPropertyInfo<BigDecimal> preTotal, IPropertyInfo<BigDecimal> prePrice) {
		this();
		this.setTotal(total);
		this.setPrice(price);
		this.setQuantity(quantity);
		this.setTaxRate(taxRate);
		this.setTaxTotal(taxTotal);
		this.setPreTotal(preTotal);
		this.setPrePrice(prePrice);
		// 要输入的参数
		this.getInputProperties().add(this.getTotal());
		this.getInputProperties().add(this.getPrice());
		this.getInputProperties().add(this.getQuantity());
		this.getInputProperties().add(this.getTaxRate());
		this.getInputProperties().add(this.getTaxTotal());
		this.getInputProperties().add(this.getPreTotal());
		this.getInputProperties().add(this.getPrePrice());
		// 要输出的参数
		this.getAffectedProperties().add(this.getTotal());
		this.getAffectedProperties().add(this.getTaxTotal());
		this.getAffectedProperties().add(this.getPreTotal());
		this.getAffectedProperties().add(this.getPrice());
		this.getAffectedProperties().add(this.getPrePrice());
	}

	/** 价格 */
	private IPropertyInfo<BigDecimal> price;

	protected final IPropertyInfo<BigDecimal> getPrice() {
		return price;
	}

	protected final void setPrice(IPropertyInfo<BigDecimal> price) {
		this.price = price;
	}

	/** 数量 */
	private IPropertyInfo<BigDecimal> quantity;

	protected final IPropertyInfo<BigDecimal> getQuantity() {
		return quantity;
	}

	protected final void setQuantity(IPropertyInfo<BigDecimal> quantity) {
		this.quantity = quantity;
	}

	/** 总计 */
	private IPropertyInfo<BigDecimal> total;

	protected final IPropertyInfo<BigDecimal> getTotal() {
		return total;
	}

	protected final void setTotal(IPropertyInfo<BigDecimal> total) {
		this.total = total;
	}

	/** 税率 */
	private IPropertyInfo<BigDecimal> taxRate;

	protected final IPropertyInfo<BigDecimal> getTaxRate() {
		return taxRate;
	}

	protected final void setTaxRate(IPropertyInfo<BigDecimal> taxRate) {
		this.taxRate = taxRate;
	}

	/** 税总计 */
	private IPropertyInfo<BigDecimal> taxTotal;

	protected final IPropertyInfo<BigDecimal> getTaxTotal() {
		return taxTotal;
	}

	protected final void setTaxTotal(IPropertyInfo<BigDecimal> taxTotal) {
		this.taxTotal = taxTotal;
	}

	/** 税前总计 */
	private IPropertyInfo<BigDecimal> preTotal;

	protected final IPropertyInfo<BigDecimal> getPreTotal() {
		return preTotal;
	}

	protected final void setPreTotal(IPropertyInfo<BigDecimal> preTotal) {
		this.preTotal = preTotal;
	}

	private IPropertyInfo<BigDecimal> prePrice;

	/** 税前价格 */
	protected final IPropertyInfo<BigDecimal> getPrePrice() {
		return prePrice;
	}

	protected final void setPrePrice(IPropertyInfo<BigDecimal> prePrice) {
		this.prePrice = prePrice;
	}

	@Override
	protected void execute(BusinessRuleContext context) throws Exception {
		BigDecimal price = (BigDecimal) context.getInputValues().get(this.getPrice());
		if (price == null) {
			price = Decimal.ZERO;
		}
		BigDecimal quantity = (BigDecimal) context.getInputValues().get(this.getQuantity());
		if (quantity == null) {
			quantity = Decimal.ZERO;
		}
		BigDecimal total = (BigDecimal) context.getInputValues().get(this.getTotal());
		if (total == null) {
			total = Decimal.ZERO;
		}
		BigDecimal taxRate = (BigDecimal) context.getInputValues().get(this.getTaxRate());
		if (taxRate == null) {
			taxRate = Decimal.ZERO;
		}
		BigDecimal taxTotal = (BigDecimal) context.getInputValues().get(this.getTaxTotal());
		if (taxTotal == null) {
			taxTotal = Decimal.ZERO;
		}
		BigDecimal preTotal = (BigDecimal) context.getInputValues().get(this.getPreTotal());
		if (preTotal == null) {
			preTotal = Decimal.ZERO;
		}
		BigDecimal prePrice = (BigDecimal) context.getInputValues().get(this.getPrePrice());
		if (prePrice == null) {
			prePrice = Decimal.ZERO;
		}
		if (Decimal.ZERO.compareTo(quantity) == 0) {
			/** 数量为0，总计等为0 */
			context.getOutputValues().put(this.getTaxTotal(), Decimal.ZERO);
			context.getOutputValues().put(this.getTotal(), Decimal.ZERO);
			context.getOutputValues().put(this.getPreTotal(), Decimal.ZERO);
		} else {
			/** 数量不是0 */
			if (Decimal.ZERO.compareTo(taxRate) == 0 && Decimal.ZERO.compareTo(taxTotal) != 0) {
				// 税率为0，税总计为0
				taxTotal = Decimal.ZERO;
				context.getOutputValues().put(this.getTaxTotal(), taxTotal);
			}
			if (Decimal.ZERO.compareTo(total) == 0) {
				// 总计是0
				if (Decimal.ZERO.compareTo(price) != 0) {
					// 价格不是0
					total = Decimal.multiply(price, quantity);
					context.getOutputValues().put(this.getTotal(), total);
				} else {
					// 由税前推
					if (Decimal.ZERO.compareTo(preTotal) == 0) {
						if (Decimal.ZERO.compareTo(prePrice) != 0) {
							preTotal = Decimal.multiply(prePrice, quantity);
							context.getOutputValues().put(this.getPreTotal(), preTotal);
						} else if (Decimal.ZERO.compareTo(taxTotal) != 0 && Decimal.ZERO.compareTo(taxRate) != 0) {
							preTotal = Decimal.divide(taxTotal, taxRate);
							context.getOutputValues().put(this.getPreTotal(), total);
						}
					}
					if (Decimal.ZERO.compareTo(preTotal) != 0) {
						if (Decimal.ZERO.compareTo(taxRate) == 0) {
							// 税率0
							total = preTotal;
							context.getOutputValues().put(this.getTotal(), total);
						} else if (Decimal.ZERO.compareTo(taxTotal) != 0) {
							// 税率不是0
							total = preTotal.add(taxTotal);
							context.getOutputValues().put(this.getTotal(), total);
						} else {
							taxTotal = Decimal.multiply(preTotal, taxRate);
							context.getOutputValues().put(this.getTaxTotal(), taxTotal);
							total = preTotal.add(taxTotal);
							context.getOutputValues().put(this.getTotal(), total);
						}
					}
					// 计算价格
					if (Decimal.ZERO.compareTo(price) == 0) {
						price = Decimal.divide(total, quantity);
						context.getOutputValues().put(this.getPrice(), price);
					}
				}
			} else {
				// 总计不是0
				if (Decimal.ZERO.compareTo(price) == 0) {
					// 价格是0
					price = Decimal.divide(total, quantity);
					context.getOutputValues().put(this.getPrice(), price);
				} else {
					// 总计 = 价格 * 数量
					BigDecimal result = Decimal.multiply(price, quantity);
					result.setScale(total.scale(), Decimal.ROUNDING_MODE_DEFAULT);
					if (Decimal.ONE
							.compareTo(result.subtract(total).abs().multiply(Decimal.ONE.add(Decimal.ONE))) <= 0) {
						total = result;
						context.getOutputValues().put(this.getTotal(), total);
					}
				}
			}
			// 计算税前总计
			if (Decimal.ZERO.compareTo(preTotal) == 0) {
				BigDecimal result = Decimal.ZERO;
				if (Decimal.ZERO.compareTo(taxTotal) != 0) {
					result = total.subtract(taxTotal);
				} else if (Decimal.ZERO.compareTo(prePrice) != 0) {
					result = Decimal.multiply(prePrice, quantity);
				} else if (Decimal.ZERO.compareTo(total) != 0) {
					result = Decimal.divide(total, Decimal.ONE.add(taxRate));
				}
				if (Decimal.ZERO.compareTo(preTotal) == 0) {
					preTotal = result;
					context.getOutputValues().put(this.getPreTotal(), preTotal);
				} else {
					result.setScale(preTotal.scale(), Decimal.ROUNDING_MODE_DEFAULT);
					if (Decimal.ONE
							.compareTo(result.subtract(preTotal).abs().multiply(Decimal.ONE.add(Decimal.ONE))) <= 0) {
						preTotal = result;
						context.getOutputValues().put(this.getPreTotal(), preTotal);
					}
				}
			} else if (preTotal.compareTo(total) > 0) {
				// 税前总计大于总计
				if (Decimal.ZERO.compareTo(taxRate) == 0) {
					preTotal = total;
					context.getOutputValues().put(this.getPreTotal(), preTotal);
				} else {
					preTotal = Decimal.divide(total, Decimal.ONE.add(taxRate));
					context.getOutputValues().put(this.getPreTotal(), preTotal);
				}
			}
			// 计算税
			if (Decimal.ZERO.compareTo(preTotal) == 0) {
				taxTotal = Decimal.ZERO;
				context.getOutputValues().put(this.getTaxTotal(), taxTotal);
			} else if (taxTotal.compareTo(Decimal.ZERO) > 0) {
				BigDecimal result = Decimal.multiply(Decimal.divide(total, Decimal.ONE.add(taxRate)), taxRate);
				if (Decimal.ONE
						.compareTo(result.subtract(taxTotal).abs().multiply(Decimal.ONE.add(Decimal.ONE))) <= 0) {
					taxTotal = result;
					context.getOutputValues().put(this.getTaxTotal(), taxTotal);
				}
				// 确保，总计 = 税前总计 + 税总计
				preTotal = total.subtract(taxTotal);
				context.getOutputValues().put(this.getPreTotal(), preTotal);
			} else {
				taxTotal = Decimal.multiply(preTotal, taxRate);
				context.getOutputValues().put(this.getTaxTotal(), taxTotal);
			}
			// 计算税前价格
			BigDecimal result = Decimal.divide(preTotal, quantity);
			if (Decimal.ZERO.compareTo(prePrice) == 0) {
				prePrice = result;
				context.getOutputValues().put(this.getPrePrice(), prePrice);
			} else {
				result.setScale(prePrice.scale(), Decimal.ROUNDING_MODE_DEFAULT);
				if (Decimal.ONE
						.compareTo(result.subtract(prePrice).abs().multiply(Decimal.ONE.add(Decimal.ONE))) <= 0) {
					prePrice = result;
					context.getOutputValues().put(this.getPrePrice(), prePrice);
				}
			}
		}
	}

}
