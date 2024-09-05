package org.colorcoding.ibas.sales.bo.salesreturnrequest;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.materials.data.DataConvert;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售退货请求-行 集合
 */
@XmlType(name = SalesReturnRequestItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesReturnRequestItem.class })
public class SalesReturnRequestItems extends BusinessObjects<ISalesReturnRequestItem, ISalesReturnRequest>
		implements ISalesReturnRequestItems {

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesReturnRequestItems";

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -1658102673342790176L;

	/**
	 * 构造方法
	 */
	public SalesReturnRequestItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public SalesReturnRequestItems(ISalesReturnRequest parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesReturnRequestItem.class;
	}

	/**
	 * 创建销售退货请求-行
	 * 
	 * @return 销售退货请求-行
	 */
	public ISalesReturnRequestItem create() {
		ISalesReturnRequestItem item = new SalesReturnRequestItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesReturnRequestItem item) {
		super.afterAddItem(item);
		if (item instanceof SalesReturnRequestItem) {
			((SalesReturnRequestItem) item).parent = this.getParent();
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
	protected void afterRemoveItem(ISalesReturnRequestItem item) {
		super.afterRemoveItem(item);
		if (item.getLineSign() != null) {
			for (int i = this.size() - 1; i >= 0; i--) {
				ISalesReturnRequestItem tItem = this.get(i);
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
		if (SalesReturnRequest.PROPERTY_DOCUMENTCURRENCY.getName().equals(evt.getPropertyName())) {
			this.where(c -> DataConvert.isNullOrEmpty(c.getBaseDocumentType()))
					.forEach(c -> c.setCurrency(this.getParent().getDocumentCurrency()));
		} else if (SalesReturnRequest.PROPERTY_DOCUMENTRATE.getName().equals(evt.getPropertyName())) {
			this.where(c -> DataConvert.isNullOrEmpty(c.getBaseDocumentType()))
					.forEach(c -> c.setRate(this.getParent().getDocumentRate()));
		}
	}
}
