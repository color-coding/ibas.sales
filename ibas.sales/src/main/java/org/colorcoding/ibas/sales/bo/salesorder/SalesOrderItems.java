package org.colorcoding.ibas.sales.bo.salesorder;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售订单-行 集合
 */
@XmlType(name = SalesOrderItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesOrderItem.class })
public class SalesOrderItems extends BusinessObjects<ISalesOrderItem, ISalesOrder> implements ISalesOrderItems {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesOrderItems";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = 8996110285431057929L;

	/**
	 * 构造方法
	 */
	public SalesOrderItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent
	 *            父项对象
	 */
	public SalesOrderItems(ISalesOrder parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesOrderItem.class;
	}

	/**
	 * 创建销售订单-行
	 * 
	 * @return 销售订单-行
	 */
	public ISalesOrderItem create() {
		ISalesOrderItem item = new SalesOrderItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesOrderItem item) {
		super.afterAddItem(item);
		if (item instanceof SalesOrderItem) {
			SalesOrderItem myItem = (SalesOrderItem) item;
			myItem.parent = this.getParent();
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
	}
}
