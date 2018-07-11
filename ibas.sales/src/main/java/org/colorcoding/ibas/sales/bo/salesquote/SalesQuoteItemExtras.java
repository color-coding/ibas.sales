package org.colorcoding.ibas.sales.bo.salesquote;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售报价-行-额外信息 集合
 */
@XmlType(name = SalesQuoteItemExtras.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesQuoteItemExtra.class })
public class SalesQuoteItemExtras extends BusinessObjects<ISalesQuoteItemExtra, ISalesQuoteItem>
		implements ISalesQuoteItemExtras {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesQuoteItemExtras";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = 2453438492084731040L;

	/**
	 * 构造方法
	 */
	public SalesQuoteItemExtras() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent
	 *            父项对象
	 */
	public SalesQuoteItemExtras(ISalesQuoteItem parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesQuoteItemExtra.class;
	}

	/**
	 * 创建销售报价-行-额外信息
	 * 
	 * @return 销售报价-行-额外信息
	 */
	public ISalesQuoteItemExtra create() {
		ISalesQuoteItemExtra item = new SalesQuoteItemExtra();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesQuoteItemExtra item) {
		super.afterAddItem(item);
		item.setItemId(this.getParent().getLineId());
	}

	@Override
	public ICriteria getElementCriteria() {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(SalesQuoteItemExtra.PROPERTY_DOCENTRY.getName());
		condition.setValue(this.getParent().getDocEntry());
		condition = criteria.getConditions().create();
		condition.setAlias(SalesQuoteItemExtra.PROPERTY_ITEMID.getName());
		condition.setValue(this.getParent().getLineId());
		return criteria;
	}

	@Override
	public void onParentPropertyChanged(PropertyChangeEvent evt) {
		super.onParentPropertyChanged(evt);
		if (evt.getPropertyName().equals(SalesQuoteItem.PROPERTY_LINEID.getName())) {
			for (ISalesQuoteItemExtra item : this) {
				item.setItemId(this.getParent().getLineId());
			}
		} else if (evt.getPropertyName().equals(SalesQuoteItem.PROPERTY_DOCENTRY.getName())) {
			for (ISalesQuoteItemExtra item : this) {
				item.setDocEntry(this.getParent().getDocEntry());
			}
		}
	}
}
