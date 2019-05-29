package org.colorcoding.ibas.sales.bo.salesquote;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售报价-行 集合
 */
@XmlType(name = SalesQuoteItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesQuoteItem.class })
public class SalesQuoteItems extends BusinessObjects<ISalesQuoteItem, ISalesQuote> implements ISalesQuoteItems {

	private static final long serialVersionUID = -8526970610242277537L;
	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesQuoteItems";

	/**
	 * 构造方法
	 */
	public SalesQuoteItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public SalesQuoteItems(ISalesQuote parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesQuoteItem.class;
	}

	/**
	 * 创建销售报价-行
	 * 
	 * @return 销售报价-行
	 */
	public ISalesQuoteItem create() {
		ISalesQuoteItem item = new SalesQuoteItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesQuoteItem item) {
		super.afterAddItem(item);
		if (item instanceof SalesQuoteItem) {
			((SalesQuoteItem) item).parent = this.getParent();
		}
		// 记录父项的值
		item.setRate(this.getParent().getDocumentRate());
		item.setCurrency(this.getParent().getDocumentCurrency());
	}

	@Override
	protected void afterRemoveItem(ISalesQuoteItem item) {
		super.afterRemoveItem(item);
		if (item.getLineSign() != null) {
			for (int i = this.size() - 1; i >= 0; i--) {
				ISalesQuoteItem tItem = this.get(i);
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
	public void onParentPropertyChanged(PropertyChangeEvent evt) {
		super.onParentPropertyChanged(evt);
		if (SalesQuote.PROPERTY_DOCUMENTCURRENCY.getName().equals(evt.getPropertyName())) {
			this.forEach(c -> c.setCurrency(this.getParent().getDocumentCurrency()));
		} else if (SalesQuote.PROPERTY_DOCUMENTRATE.getName().equals(evt.getPropertyName())) {
			this.forEach(c -> c.setRate(this.getParent().getDocumentRate()));
		}
	}
}
