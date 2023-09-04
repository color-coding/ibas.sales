package org.colorcoding.ibas.sales.logic;

import java.util.ArrayList;
import java.util.Iterator;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;

import org.colorcoding.ibas.bobas.bo.BusinessObject;
import org.colorcoding.ibas.bobas.bo.IBODocument;
import org.colorcoding.ibas.bobas.bo.IBODocumentLine;
import org.colorcoding.ibas.bobas.bo.IBusinessObject;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.emBOStatus;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.bobas.logic.IBusinessObjectGroup;
import org.colorcoding.ibas.bobas.mapping.DbField;
import org.colorcoding.ibas.bobas.mapping.DbFieldType;
import org.colorcoding.ibas.bobas.mapping.LogicContract;
import org.colorcoding.ibas.materials.bo.materialinventory.IMaterialInventoryReservation;
import org.colorcoding.ibas.materials.bo.materialinventory.IMaterialInventoryReservations;
import org.colorcoding.ibas.materials.bo.materialinventory.MaterialInventoryReservation;
import org.colorcoding.ibas.materials.bo.materialinventory.MaterialInventoryReservations;
import org.colorcoding.ibas.materials.logic.MaterialInventoryBusinessLogic;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;

@LogicContract(IMaterialInventoryReservationStatusContract.class)
public class MaterialInventoryReservationStatusService extends
		MaterialInventoryBusinessLogic<IMaterialInventoryReservationStatusContract, IMaterialInventoryReservationGroup> {

	@Override
	protected boolean checkDataStatus(Object data) {
		if (data instanceof IBODocument) {
			if (((IBODocument) data).getDocumentStatus() == emDocumentStatus.PLANNED) {
				return true;
			}
		} else if (data instanceof IBODocumentLine) {
			if (((IBODocumentLine) data).getLineStatus() == emDocumentStatus.PLANNED) {
				return true;
			}
		}
		return super.checkDataStatus(data);
	}

	@Override
	protected IMaterialInventoryReservationGroup fetchBeAffected(IMaterialInventoryReservationStatusContract contract) {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(MaterialInventoryReservation.PROPERTY_TARGETDOCUMENTTYPE.getName());
		condition.setValue(contract.getTargetDocumentType());
		condition = criteria.getConditions().create();
		condition.setAlias(MaterialInventoryReservation.PROPERTY_TARGETDOCUMENTENTRY.getName());
		condition.setValue(contract.getTargetDocumentEntry());
		condition = criteria.getConditions().create();
		condition.setAlias(MaterialInventoryReservation.PROPERTY_TARGETDOCUMENTLINEID.getName());
		condition.setValue(contract.getTargetDocumentLineId());
		IMaterialInventoryReservationGroup reservationGroup = this.fetchBeAffected(criteria,
				IMaterialInventoryReservationGroup.class);
		if (reservationGroup == null) {
			BORepositoryMaterials boRepository = new BORepositoryMaterials();
			boRepository.setRepository(super.getRepository());
			IOperationResult<IMaterialInventoryReservation> opRsltInventory = boRepository
					.fetchMaterialInventoryReservation(criteria);
			if (opRsltInventory.getError() != null) {
				throw new BusinessLogicException(opRsltInventory.getError());
			}
			IMaterialInventoryReservation reservation;
			reservationGroup = new MaterialInventoryReservationGroup();
			for (IMaterialInventoryReservation item : opRsltInventory.getResultObjects()) {
				// 判断内存中是否已有
				reservation = this.fetchBeAffected(item.getCriteria(), IMaterialInventoryReservation.class);
				if (reservation == null) {
					// 使用数据库的
					reservationGroup.getItems().add(item);
				} else {
					// 使用内存的
					reservationGroup.getItems().add(reservation);
				}
			}
		}
		return reservationGroup;
	}

	@Override
	protected void impact(IMaterialInventoryReservationStatusContract contract) {
		for (IMaterialInventoryReservation item : this.getBeAffected().getItems()) {
			if (contract.getTargetDocumentStatus() == emDocumentStatus.PLANNED
					|| contract.getTargetDocumentStatus() == emDocumentStatus.RELEASED) {
				if (item.getQuantity().compareTo(item.getClosedQuantity()) > 0) {
					item.setStatus(emBOStatus.OPEN);
				}
			} else {
				item.setStatus(emBOStatus.CLOSED);
			}
		}
	}

	@Override
	protected void revoke(IMaterialInventoryReservationStatusContract contract) {
		for (IMaterialInventoryReservation item : this.getBeAffected().getItems()) {
			item.setStatus(emBOStatus.CLOSED);
		}
	}

}

interface IMaterialInventoryReservationGroup extends IBusinessObject {

	/**
	 * 获取-目标单据类型
	 * 
	 * @return 值
	 */
	String getTargetDocumentType();

	/**
	 * 设置-目标单据类型
	 * 
	 * @param value 值
	 */
	void setTargetDocumentType(String value);

	/**
	 * 获取-目标单据编号
	 * 
	 * @return 值
	 */
	Integer getTargetDocumentEntry();

	/**
	 * 设置-目标单据编号
	 * 
	 * @param value 值
	 */
	void setTargetDocumentEntry(Integer value);

	/**
	 * 获取-目标单据行号
	 * 
	 * @return 值
	 */
	Integer getTargetDocumentLineId();

	/**
	 * 设置-目标单据行号
	 * 
	 * @param value 值
	 */
	void setTargetDocumentLineId(Integer value);

	/**
	 * 获取-行集合
	 * 
	 * @return 值
	 */
	IMaterialInventoryReservations getItems();

	/**
	 * 设置-行集合
	 * 
	 * @param value 值
	 */
	void setItems(IMaterialInventoryReservations value);
}

/**
 * 物料订购预留 接口
 * 
 */
class MaterialInventoryReservationGroup extends BusinessObject<IMaterialInventoryReservationGroup>
		implements IMaterialInventoryReservationGroup, IBusinessObjectGroup {

	private static final long serialVersionUID = -1505933970685831778L;

	/**
	 * 当前类型
	 */
	private static final Class<?> MY_CLASS = MaterialInventoryReservationGroup.class;

	public MaterialInventoryReservationGroup() {
		this.setSavable(false);
	}

	/**
	 * 属性名称-目标单据类型
	 */
	private static final String PROPERTY_TARGETDOCUMENTTYPE_NAME = "TargetDocumentType";

	/**
	 * 目标单据类型 属性
	 */
	@DbField(name = "TargetType", type = DbFieldType.ALPHANUMERIC)
	public static final IPropertyInfo<String> PROPERTY_TARGETDOCUMENTTYPE = registerProperty(
			PROPERTY_TARGETDOCUMENTTYPE_NAME, String.class, MY_CLASS);

	/**
	 * 获取-目标单据类型
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_TARGETDOCUMENTTYPE_NAME)
	public final String getTargetDocumentType() {
		return this.getProperty(PROPERTY_TARGETDOCUMENTTYPE);
	}

	/**
	 * 设置-目标单据类型
	 * 
	 * @param value 值
	 */
	public final void setTargetDocumentType(String value) {
		this.setProperty(PROPERTY_TARGETDOCUMENTTYPE, value);
	}

	/**
	 * 属性名称-目标单据编号
	 */
	private static final String PROPERTY_TARGETDOCUMENTENTRY_NAME = "TargetDocumentEntry";

	/**
	 * 目标单据编号 属性
	 */
	@DbField(name = "TargetEntry", type = DbFieldType.NUMERIC)
	public static final IPropertyInfo<Integer> PROPERTY_TARGETDOCUMENTENTRY = registerProperty(
			PROPERTY_TARGETDOCUMENTENTRY_NAME, Integer.class, MY_CLASS);

	/**
	 * 获取-目标单据编号
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_TARGETDOCUMENTENTRY_NAME)
	public final Integer getTargetDocumentEntry() {
		return this.getProperty(PROPERTY_TARGETDOCUMENTENTRY);
	}

	/**
	 * 设置-目标单据编号
	 * 
	 * @param value 值
	 */
	public final void setTargetDocumentEntry(Integer value) {
		this.setProperty(PROPERTY_TARGETDOCUMENTENTRY, value);
	}

	/**
	 * 属性名称-目标单据行号
	 */
	private static final String PROPERTY_TARGETDOCUMENTLINEID_NAME = "TargetDocumentLineId";

	/**
	 * 目标单据行号 属性
	 */
	@DbField(name = "TargetLine", type = DbFieldType.NUMERIC)
	public static final IPropertyInfo<Integer> PROPERTY_TARGETDOCUMENTLINEID = registerProperty(
			PROPERTY_TARGETDOCUMENTLINEID_NAME, Integer.class, MY_CLASS);

	/**
	 * 获取-目标单据行号
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_TARGETDOCUMENTLINEID_NAME)
	public final Integer getTargetDocumentLineId() {
		return this.getProperty(PROPERTY_TARGETDOCUMENTLINEID);
	}

	/**
	 * 设置-目标单据行号
	 * 
	 * @param value 值
	 */
	public final void setTargetDocumentLineId(Integer value) {
		this.setProperty(PROPERTY_TARGETDOCUMENTLINEID, value);
	}

	/**
	 * 属性名称-项目集合
	 */
	private static final String PROPERTY_ITEMS_NAME = "Items";

	/**
	 * 库存收货-行的集合属性
	 * 
	 */
	public static final IPropertyInfo<IMaterialInventoryReservations> PROPERTY_ITEMS = registerProperty(
			PROPERTY_ITEMS_NAME, IMaterialInventoryReservations.class, MY_CLASS);

	/**
	 * 获取-项目集合
	 * 
	 * @return 值
	 */
	@XmlElementWrapper(name = PROPERTY_ITEMS_NAME)
	@XmlElement(name = MaterialInventoryReservation.BUSINESS_OBJECT_NAME, type = MaterialInventoryReservation.class)
	public final IMaterialInventoryReservations getItems() {
		return this.getProperty(PROPERTY_ITEMS);
	}

	/**
	 * 设置-项目集合
	 * 
	 * @param value 值
	 */
	public final void setItems(IMaterialInventoryReservations value) {
		this.setProperty(PROPERTY_ITEMS, value);
	}

	/**
	 * 初始化数据
	 */
	@Override
	protected void initialize() {
		super.initialize();// 基类初始化，不可去除
		this.setItems(new MaterialInventoryReservations(this));
	}

	@Override
	public Iterator<IBusinessObject> iterator() {
		ArrayList<IBusinessObject> list = new ArrayList<>();
		list.addAll(this.getItems());
		return list.iterator();
	}
}
