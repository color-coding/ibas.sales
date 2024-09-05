package org.colorcoding.ibas.sales.bo.salesreserveinvoice;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.materials.data.DataConvert;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售预留发票-行 集合
 */
@XmlType(name = SalesReserveInvoiceItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesReserveInvoiceItem.class })
public class SalesReserveInvoiceItems extends BusinessObjects<ISalesReserveInvoiceItem, ISalesReserveInvoice>
		implements ISalesReserveInvoiceItems {

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -8910046504715272224L;
	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesReserveInvoiceItems";

	/**
	 * 构造方法
	 */
	public SalesReserveInvoiceItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public SalesReserveInvoiceItems(ISalesReserveInvoice parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesReserveInvoiceItem.class;
	}

	/**
	 * 创建销售预留发票-行
	 * 
	 * @return 销售预留发票-行
	 */
	public ISalesReserveInvoiceItem create() {
		ISalesReserveInvoiceItem item = new SalesReserveInvoiceItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesReserveInvoiceItem item) {
		super.afterAddItem(item);
		if (item instanceof SalesReserveInvoiceItem) {
			((SalesReserveInvoiceItem) item).parent = this.getParent();
		}
		// 记录父项的值
		if (!this.getParent().isLoading()) {
			if (item.isNew() && DataConvert.isNullOrEmpty(item.getBaseDocumentType())) {
				item.setRate(this.getParent().getDocumentRate());
				item.setCurrency(this.getParent().getDocumentCurrency());
				item.setDeliveryDate(this.getParent().getDeliveryDate());
			}
		}
	}

	@Override
	protected void afterRemoveItem(ISalesReserveInvoiceItem item) {
		super.afterRemoveItem(item);
		if (item.getLineSign() != null) {
			for (int i = this.size() - 1; i >= 0; i--) {
				ISalesReserveInvoiceItem tItem = this.get(i);
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
		if (SalesReserveInvoice.PROPERTY_DOCUMENTCURRENCY.getName().equals(evt.getPropertyName())) {
			this.where(c -> DataConvert.isNullOrEmpty(c.getBaseDocumentType()))
					.forEach(c -> c.setCurrency(this.getParent().getDocumentCurrency()));
		} else if (SalesReserveInvoice.PROPERTY_DOCUMENTRATE.getName().equals(evt.getPropertyName())) {
			this.where(c -> DataConvert.isNullOrEmpty(c.getBaseDocumentType()))
					.forEach(c -> c.setRate(this.getParent().getDocumentRate()));
		}
	}
}
