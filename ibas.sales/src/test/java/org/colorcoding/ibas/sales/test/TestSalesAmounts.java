package org.colorcoding.ibas.sales.test;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.bo.IBusinessObject;
import org.colorcoding.ibas.bobas.core.IFieldedObject;
import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.rule.BusinessRulesManager;
import org.colorcoding.ibas.bobas.rule.IBusinessRule;
import org.colorcoding.ibas.sales.bo.downpaymentrequest.DownPaymentRequest;
import org.colorcoding.ibas.sales.bo.salescreditnote.SalesCreditNote;
import org.colorcoding.ibas.sales.bo.salesinvoice.SalesInvoice;
import org.colorcoding.ibas.sales.bo.salesorder.ISalesOrderItem;
import org.colorcoding.ibas.sales.bo.salesorder.SalesOrder;
import org.colorcoding.ibas.sales.bo.salesreserveinvoice.SalesReserveInvoice;
import org.colorcoding.ibas.sales.rules.BusinessRuleDeductionDiscount;
import org.colorcoding.ibas.sales.rules.BusinessRuleDeductionPriceTaxTotal;

/** 金额回归：执行实际业务对象注册的业务规则，不使用测试公式代替实现。 */
public class TestSalesAmounts extends AbstractBusinessTestCase {

	private void calculate(IBusinessObject object) throws Exception {
		BusinessRulesManager.create().getRules(object.getClass()).execute(object);
	}

	private void executeRule(IBusinessObject object, Class<? extends IBusinessRule> type) throws Exception {
		for (IBusinessRule rule : BusinessRulesManager.create().getRules(object.getClass())) {
			if (type.isInstance(rule)) {
				rule.execute(object);
				return;
			}
		}
		fail(object.getClass().getSimpleName() + " must register " + type.getSimpleName());
	}

	private void calculatePrice(IBusinessObject object) throws Exception {
		executeRule(object, BusinessRuleDeductionPriceTaxTotal.class);
	}

	public void testSL_A01_TaxInclusivePrice() throws Exception {
		SalesOrder order = new SalesOrder();
		order.setCustomerCode("AMOUNT-PARTNER");
		ISalesOrderItem line = order.getSalesOrderItems().create();
		line.setItemCode("AMOUNT-TEST");
		line.setQuantity(new BigDecimal("3"));
		line.setTaxRate(new BigDecimal("0.13"));
		line.setPrice(new BigDecimal("113"));
		calculate(line);
		calculate(order);
		assertAmount("339", line.getLineTotal());
		assertAmount("300", line.getPreTaxLineTotal());
		assertAmount("39", line.getTaxTotal());
		assertAmount("100", line.getPreTaxPrice());
		assertAmount("339", order.getDocumentTotal());
	}

	public void testSL_A02_TaxExclusivePriceAndQuantityChange() throws Exception {
		SalesOrder order = new SalesOrder();
		order.setCustomerCode("AMOUNT-PARTNER");
		ISalesOrderItem line = order.getSalesOrderItems().create();
		line.setItemCode("AMOUNT-TEST");
		line.setQuantity(new BigDecimal("2"));
		line.setTaxRate(new BigDecimal("0.13"));
		line.setPreTaxPrice(new BigDecimal("100"));
		calculate(line);
		calculate(order);
		assertAmount("226", line.getLineTotal());
		assertAmount("26", line.getTaxTotal());
		// 数量与库存数量均为本次业务输入；只验证已注册的价格规则重算。
		line.setQuantity(new BigDecimal("5"));
		line.setInventoryQuantity(new BigDecimal("5"));
		calculatePrice(line);
		assertAmount("565", line.getLineTotal());
		assertAmount("500", line.getPreTaxLineTotal());
		assertAmount("65", line.getTaxTotal());
	}

	public void testSL_A03_LineAndDocumentDiscountShippingAndRounding() throws Exception {
		SalesOrder order = new SalesOrder();
		order.setCustomerCode("AMOUNT-PARTNER");
		ISalesOrderItem line = order.getSalesOrderItems().create();
		line.setItemCode("AMOUNT-TEST");
		line.setQuantity(new BigDecimal("2"));
		line.setUnitPrice(new BigDecimal("100"));
		line.setUnitLineTotal(new BigDecimal("200"));
		line.setDiscount(new BigDecimal("0.8"));
		executeRule(line, BusinessRuleDeductionDiscount.class);
		calculate(line);
		calculate(order);
		assertAmount("160", line.getPreTaxLineTotal());
		order.setDiscount(new BigDecimal("0.9"));
		order.setDiscountTotal(BigDecimal.ZERO);
		order.setDocumentTotal(BigDecimal.ZERO);
		order.getShippingAddresss().create().setExpense(new BigDecimal("10"));
		order.setDiffAmount(new BigDecimal("-0.01"));
		calculate(line);
		calculate(order);
		assertAmount("144", order.getDiscountTotal());
		assertAmount("153.99", order.getDocumentTotal());
	}

	public void testSL_A04_CurrencyConversionAndRateChange() throws Exception {
		SalesOrder order = new SalesOrder();
		order.setCustomerCode("AMOUNT-PARTNER");
		ISalesOrderItem line = order.getSalesOrderItems().create();
		line.setItemCode("AMOUNT-TEST");
		line.setQuantity(BigDecimal.ONE);
		line.setRate(new BigDecimal("0.2"));
		line.setPrice(new BigDecimal("20"));
		calculate(line);
		calculate(order);
		assertAmount("100", line.getPriceLC());
		line.setRate(new BigDecimal("0.25"));
		calculate(line);
		calculate(order);
		assertAmount("80", line.getPriceLC());
	}

	public void testSL_A05_ZeroQuantityClearsAmounts() throws Exception {
		SalesOrder order = new SalesOrder();
		order.setCustomerCode("AMOUNT-PARTNER");
		ISalesOrderItem line = order.getSalesOrderItems().create();
		line.setItemCode("AMOUNT-TEST");
		line.setQuantity(new BigDecimal("2"));
		line.setTaxRate(new BigDecimal("0.13"));
		line.setPrice(new BigDecimal("113"));
		calculate(line);
		calculate(order);
		line.setQuantity(BigDecimal.ZERO);
		line.setInventoryQuantity(BigDecimal.ZERO);
		calculatePrice(line);
		assertAmount("0", line.getLineTotal());
		assertAmount("0", line.getPreTaxLineTotal());
		assertAmount("0", line.getTaxTotal());
	}

	public void testSL_A06_OtherDocumentAmountRules() throws Exception {
		SalesInvoice invoice = new SalesInvoice();
		invoice.setCustomerCode("AMOUNT-PARTNER");
		assertDocumentAmounts(invoice, invoice.getSalesInvoiceItems().create());
		SalesCreditNote creditNote = new SalesCreditNote();
		creditNote.setCustomerCode("AMOUNT-PARTNER");
		assertDocumentAmounts(creditNote, creditNote.getSalesCreditNoteItems().create());
		SalesReserveInvoice reserveInvoice = new SalesReserveInvoice();
		reserveInvoice.setCustomerCode("AMOUNT-PARTNER");
		assertDocumentAmounts(reserveInvoice, reserveInvoice.getSalesReserveInvoiceItems().create());
		DownPaymentRequest downPayment = new DownPaymentRequest();
		downPayment.setCustomerCode("AMOUNT-PARTNER");
		assertDocumentAmounts(downPayment, downPayment.getDownPaymentRequestItems().create());
	}

	private void assertDocumentAmounts(IBusinessObject document, IBusinessObject line) throws Exception {
		set(line, "ItemCode", "AMOUNT-TEST");
		set(line, "Quantity", new BigDecimal("2"));
		set(line, "TaxRate", new BigDecimal("0.13"));
		set(line, "Price", new BigDecimal("113"));
		calculate(line);
		calculate(document);
		assertAmount("226", ((IFieldedObject) line).getProperty(property(line, "LineTotal")));
		assertAmount("26", ((IFieldedObject) line).getProperty(property(line, "TaxTotal")));
		assertAmount("226", ((IFieldedObject) document).getProperty(property(document, "DocumentTotal")));
	}

	private IPropertyInfo<?> property(IBusinessObject object, String name) {
		for (IPropertyInfo<?> property : ((IFieldedObject) object).properties()) {
			if (property.getName().equals(name)) {
				return property;
			}
		}
		throw new AssertionError(object.getClass().getSimpleName() + " must register property " + name);
	}

	private void set(IBusinessObject object, String name, Object value) {
		((IFieldedObject) object).setProperty(property(object, name), value);
	}

}
