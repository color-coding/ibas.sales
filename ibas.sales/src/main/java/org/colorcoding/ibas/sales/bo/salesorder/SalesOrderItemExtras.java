package org.colorcoding.ibas.sales.bo.salesorder;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售订单-行-额外信息 集合
 */
@XmlType(name = SalesOrderItemExtras.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesOrderItemExtra.class })
public class SalesOrderItemExtras extends BusinessObjects<ISalesOrderItemExtra, ISalesOrderItem>
		implements ISalesOrderItemExtras {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesOrderItemExtras";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -687357748516506969L;

	/**
	 * 构造方法
	 */
	public SalesOrderItemExtras() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent
	 *            父项对象
	 */
	public SalesOrderItemExtras(ISalesOrderItem parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesOrderItemExtra.class;
	}

	/**
	 * 创建销售订单-行-额外信息
	 * 
	 * @return 销售订单-行-额外信息
	 */
	public ISalesOrderItemExtra create() {
		ISalesOrderItemExtra item = new SalesOrderItemExtra();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesOrderItemExtra item) {
		super.afterAddItem(item);
		item.setItemId(this.getParent().getLineId());
	}

	@Override
	public ICriteria getElementCriteria() {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(SalesOrderItemExtra.PROPERTY_DOCENTRY.getName());
		condition.setValue(this.getParent().getDocEntry());
		condition = criteria.getConditions().create();
		condition.setAlias(SalesOrderItemExtra.PROPERTY_ITEMID.getName());
		condition.setValue(this.getParent().getLineId());
		return criteria;
	}

	@Override
	public void onParentPropertyChanged(PropertyChangeEvent evt) {
		super.onParentPropertyChanged(evt);
		if (evt.getPropertyName().equals(SalesOrderItem.PROPERTY_LINEID.getName())) {
			for (ISalesOrderItemExtra item : this) {
				item.setItemId(this.getParent().getLineId());
			}
		} else if (evt.getPropertyName().equals(SalesOrderItem.PROPERTY_DOCENTRY.getName())) {
			for (ISalesOrderItemExtra item : this) {
				item.setDocEntry(this.getParent().getDocEntry());
			}
		}
	}
}
