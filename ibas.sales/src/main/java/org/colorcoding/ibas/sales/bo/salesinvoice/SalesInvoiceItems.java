package org.colorcoding.ibas.sales.bo.salesinvoice;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.Strings;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售发票-行 集合
 */
@XmlType(name = SalesInvoiceItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesInvoiceItem.class })
public class SalesInvoiceItems extends BusinessObjects<ISalesInvoiceItem, ISalesInvoice> implements ISalesInvoiceItems {

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -8910046504715272224L;
	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesInvoiceItems";

	/**
	 * 构造方法
	 */
	public SalesInvoiceItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public SalesInvoiceItems(ISalesInvoice parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesInvoiceItem.class;
	}

	/**
	 * 创建销售发票-行
	 * 
	 * @return 销售发票-行
	 */
	public ISalesInvoiceItem create() {
		ISalesInvoiceItem item = new SalesInvoiceItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesInvoiceItem item) {
		super.afterAddItem(item);
		if (item instanceof SalesInvoiceItem) {
			((SalesInvoiceItem) item).parent = this.getParent();
		}
		// 记录父项的值
		if (!this.getParent().isLoading()) {
			if (item.isNew() && Strings.isNullOrEmpty(item.getBaseDocumentType())) {
				item.setRate(this.getParent().getDocumentRate());
				item.setCurrency(this.getParent().getDocumentCurrency());
				item.setDeliveryDate(this.getParent().getDeliveryDate());
			}
		}
	}

	@Override
	protected void afterRemoveItem(ISalesInvoiceItem item) {
		super.afterRemoveItem(item);
		if (item.getLineSign() != null) {
			for (int i = this.size() - 1; i >= 0; i--) {
				ISalesInvoiceItem tItem = this.get(i);
				if (item.getLineSign().equals(tItem.getParentLineSign())) {
					if (tItem.isNew()) {
						this.remove(i);
					} else {
						tItem.delete();
					}
				}
			}
		}
	}

	@Override
	public ICriteria getElementCriteria() {
		ICriteria criteria = super.getElementCriteria();
		return criteria;
	}

	@Override
	protected void onParentPropertyChanged(PropertyChangeEvent evt) {
		super.onParentPropertyChanged(evt);
		if (SalesInvoice.PROPERTY_DOCUMENTCURRENCY.getName().equals(evt.getPropertyName())) {
			this.where(c -> Strings.isNullOrEmpty(c.getBaseDocumentType()))
					.forEach(c -> c.setCurrency(this.getParent().getDocumentCurrency()));
		} else if (SalesInvoice.PROPERTY_DOCUMENTRATE.getName().equals(evt.getPropertyName())) {
			this.where(c -> Strings.isNullOrEmpty(c.getBaseDocumentType()))
					.forEach(c -> c.setRate(this.getParent().getDocumentRate()));
		}
	}
}
