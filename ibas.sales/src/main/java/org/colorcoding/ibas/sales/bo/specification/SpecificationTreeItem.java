package org.colorcoding.ibas.sales.bo.specification;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.data.ArrayList;
import org.colorcoding.ibas.bobas.data.KeyText;
import org.colorcoding.ibas.bobas.data.List;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.serialization.Serializable;

/**
 * 规格项目
 * 
 * @author Niuren.Zhu
 *
 */
@XmlAccessorType(XmlAccessType.NONE)
@XmlType(name = "SpecificationItem")
@XmlRootElement(name = "SpecificationItem")
public class SpecificationTreeItem extends Serializable {

	public static SpecificationTreeItem create(ISpecificationItem specificationItem) {
		SpecificationTreeItem item = new SpecificationTreeItem();
		item.setSign(specificationItem.getSign());
		item.setDescription(specificationItem.getDescription());
		item.setContent(specificationItem.getContent());
		item.setNote(specificationItem.getNote());
		item.setEditable(specificationItem.getEditable() == emYesNo.YES ? true : false);
		for (ISpecificationItemValue value : specificationItem.getSpecificationItemValues()) {
			item.getVaildValues().add(new KeyText(value.getValue(), value.getDescription()));
		}
		return item;
	}

	private static final long serialVersionUID = -7472789448879938099L;

	private String sign;

	public final String getSign() {
		return sign;
	}

	public final void setSign(String sign) {
		this.sign = sign;
	}

	private String description;

	public final String getDescription() {
		return description;
	}

	public final void setDescription(String description) {
		this.description = description;
	}

	private String content;

	public final String getContent() {
		return content;
	}

	public final void setContent(String content) {
		this.content = content;
	}

	private String note;

	public final String getNote() {
		return note;
	}

	public final void setNote(String note) {
		this.note = note;
	}

	private boolean editable;

	public final boolean isEditable() {
		return editable;
	}

	public final void setEditable(boolean editable) {
		this.editable = editable;
	}

	@XmlElementWrapper(name = "VaildValues")
	@XmlElement(name = "VaildValues", type = KeyText.class)
	private ArrayList<KeyText> vaildValues;

	public final List<KeyText> getVaildValues() {
		if (this.vaildValues == null) {
			this.vaildValues = new ArrayList<>();
		}
		return vaildValues;
	}

	@XmlElementWrapper(name = "Items")
	@XmlElement(name = "Items", type = SpecificationTreeItem.class)
	private ArrayList<SpecificationTreeItem> items;

	public final List<SpecificationTreeItem> getItems() {
		if (this.items == null) {
			this.items = new ArrayList<>();
		}
		return items;
	}

	@Override
	public String toString() {
		return String.format("{specificationTreeItem: %s}", this.getDescription());
	}
}
