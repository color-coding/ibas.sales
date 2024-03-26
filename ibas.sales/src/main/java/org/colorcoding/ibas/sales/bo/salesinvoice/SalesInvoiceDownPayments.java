package org.colorcoding.ibas.sales.bo.salesinvoice;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售发票-预收款 集合
 */
@XmlType(name = SalesInvoiceDownPayments.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesInvoiceDownPayment.class })
public class SalesInvoiceDownPayments extends BusinessObjects<ISalesInvoiceDownPayment, ISalesInvoice>
		implements ISalesInvoiceDownPayments {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesInvoiceDownPayments";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -7762023741260198478L;

	/**
	 * 构造方法
	 */
	public SalesInvoiceDownPayments() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public SalesInvoiceDownPayments(ISalesInvoice parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesInvoiceDownPayment.class;
	}

	/**
	 * 创建销售发票-预收款
	 * 
	 * @return 销售发票-预收款
	 */
	public ISalesInvoiceDownPayment create() {
		ISalesInvoiceDownPayment item = new SalesInvoiceDownPayment();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesInvoiceDownPayment item) {
		super.afterAddItem(item);
	}

	@Override
	public ICriteria getElementCriteria() {
		ICriteria criteria = super.getElementCriteria();
		return criteria;
	}

	@Override
	protected void onParentPropertyChanged(PropertyChangeEvent evt) {
		super.onParentPropertyChanged(evt);
	}
}
