package org.colorcoding.ibas.sales.bo.salesdelivery;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售交货-行 集合
 */
@XmlType(name = SalesDeliveryItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesDeliveryItem.class })
public class SalesDeliveryItems extends BusinessObjects<ISalesDeliveryItem, ISalesDelivery>
		implements ISalesDeliveryItems {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesDeliveryItems";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -6045560536421612105L;

	/**
	 * 构造方法
	 */
	public SalesDeliveryItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent
	 *            父项对象
	 */
	public SalesDeliveryItems(ISalesDelivery parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesDeliveryItem.class;
	}

	/**
	 * 创建销售交货-行
	 * 
	 * @return 销售交货-行
	 */
	public ISalesDeliveryItem create() {
		ISalesDeliveryItem item = new SalesDeliveryItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesDeliveryItem item) {
		super.afterAddItem(item);
		if (item instanceof SalesDeliveryItem) {
			((SalesDeliveryItem) item).parent = this.getParent();
		}
		// 记录父项的值
		item.setRate(this.getParent().getDocumentRate());
	}

	@Override
	public ICriteria getElementCriteria() {
		ICriteria criteria = super.getElementCriteria();
		return criteria;
	}

	@Override
	public void onParentPropertyChanged(PropertyChangeEvent evt) {
		super.onParentPropertyChanged(evt);
	}
}
