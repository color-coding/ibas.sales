package org.colorcoding.ibas.sales.bo.salescreditnote;

import java.beans.PropertyChangeEvent;

import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObjects;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.materials.data.DataConvert;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 销售贷项-行 集合
 */
@XmlType(name = SalesCreditNoteItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesCreditNoteItem.class })
public class SalesCreditNoteItems extends BusinessObjects<ISalesCreditNoteItem, ISalesCreditNote>
		implements ISalesCreditNoteItems {

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -3186939616931561285L;

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesCreditNoteItems";

	/**
	 * 构造方法
	 */
	public SalesCreditNoteItems() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param parent 父项对象
	 */
	public SalesCreditNoteItems(ISalesCreditNote parent) {
		super(parent);
	}

	/**
	 * 元素类型
	 */
	public Class<?> getElementType() {
		return SalesCreditNoteItem.class;
	}

	/**
	 * 创建销售贷项-行
	 * 
	 * @return 销售贷项-行
	 */
	public ISalesCreditNoteItem create() {
		ISalesCreditNoteItem item = new SalesCreditNoteItem();
		if (this.add(item)) {
			return item;
		}
		return null;
	}

	@Override
	protected void afterAddItem(ISalesCreditNoteItem item) {
		super.afterAddItem(item);
		if (item instanceof SalesCreditNoteItem) {
			((SalesCreditNoteItem) item).parent = this.getParent();
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
	protected void afterRemoveItem(ISalesCreditNoteItem item) {
		super.afterRemoveItem(item);
		if (item.getLineSign() != null) {
			for (int i = this.size() - 1; i >= 0; i--) {
				ISalesCreditNoteItem tItem = this.get(i);
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
		if (SalesCreditNote.PROPERTY_DOCUMENTCURRENCY.getName().equals(evt.getPropertyName())) {
			this.where(c -> DataConvert.isNullOrEmpty(c.getBaseDocumentType()))
					.forEach(c -> c.setCurrency(this.getParent().getDocumentCurrency()));
		} else if (SalesCreditNote.PROPERTY_DOCUMENTRATE.getName().equals(evt.getPropertyName())) {
			this.where(c -> DataConvert.isNullOrEmpty(c.getBaseDocumentType()))
					.forEach(c -> c.setRate(this.getParent().getDocumentRate()));
		}
	}
}
