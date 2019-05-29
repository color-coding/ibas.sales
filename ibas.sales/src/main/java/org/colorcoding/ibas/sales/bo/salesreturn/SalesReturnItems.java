package org.colorcoding.ibas.sales.bo.salesreturn;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售退货-行 集合
 */
@XmlType(name = SalesReturnItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesReturnItem.class })
public class SalesReturnItems extends BusinessObjects<ISalesReturnItem, ISalesReturn> implements ISalesReturnItems {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesReturnItems";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -1658102673342790176L;

	/**
	 * 构造方法
	 */
	public SalesReturnItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public SalesReturnItems(ISalesReturn parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesReturnItem.class;
	}

	/**
	 * 创建销售退货-行
	 * 
	 * @return 销售退货-行
	 */
	public ISalesReturnItem create() {
		ISalesReturnItem item = new SalesReturnItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesReturnItem item) {
		super.afterAddItem(item);
		if (item instanceof SalesReturnItem) {
			((SalesReturnItem) item).parent = this.getParent();
		}
		// 记录父项的值
		item.setRate(this.getParent().getDocumentRate());
		item.setCurrency(this.getParent().getDocumentCurrency());
	}

	@Override
	protected void afterRemoveItem(ISalesReturnItem item) {
		super.afterRemoveItem(item);
		if (item.getLineSign() != null) {
			for (int i = this.size() - 1; i >= 0; i--) {
				ISalesReturnItem tItem = this.get(i);
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
		if (SalesReturn.PROPERTY_DOCUMENTCURRENCY.getName().equals(evt.getPropertyName())) {
			this.forEach(c -> c.setCurrency(this.getParent().getDocumentCurrency()));
		} else if (SalesReturn.PROPERTY_DOCUMENTRATE.getName().equals(evt.getPropertyName())) {
			this.forEach(c -> c.setRate(this.getParent().getDocumentRate()));
		}
	}
}
