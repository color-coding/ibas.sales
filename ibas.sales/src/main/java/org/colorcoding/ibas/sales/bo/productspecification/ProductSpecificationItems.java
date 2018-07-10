package org.colorcoding.ibas.sales.bo.productspecification;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 产品规格-项目 集合
 */
@XmlType(name = ProductSpecificationItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ ProductSpecificationItem.class })
public class ProductSpecificationItems extends BusinessObjects<IProductSpecificationItem, IProductSpecification>
		implements IProductSpecificationItems {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "ProductSpecificationItems";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = 5046687842997952602L;

	/**
	 * 构造方法
	 */
	public ProductSpecificationItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent
	 *            父项对象
	 */
	public ProductSpecificationItems(IProductSpecification parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return ProductSpecificationItem.class;
	}

	/**
	 * 创建产品规格-项目
	 * 
	 * @return 产品规格-项目
	 */
	public IProductSpecificationItem create() {
		IProductSpecificationItem item = new ProductSpecificationItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(IProductSpecificationItem item) {
		super.afterAddItem(item);
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
