package org.colorcoding.ibas.sales.bo.shippingaddress;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.bo.BusinessObject;
import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.mapping.BOCode;
import org.colorcoding.ibas.bobas.mapping.DbField;
import org.colorcoding.ibas.bobas.mapping.DbFieldType;
import org.colorcoding.ibas.sales.MyConfiguration;
import org.colorcoding.ibas.sales.data.emShippingStatus;

/**
 * 送货地址
 * 
 */
@XmlAccessorType(XmlAccessType.NONE)
@XmlType(name = ShippingAddress.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlRootElement(name = ShippingAddress.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@BOCode(ShippingAddress.BUSINESS_OBJECT_CODE)
public class ShippingAddress extends BusinessObject<ShippingAddress> implements IShippingAddress {

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -5086004743874250649L;

	/**
	 * 当前类型
	 */
	private static final Class<?> MY_CLASS = ShippingAddress.class;

	/**
	 * 数据库表
	 */
	public static final String DB_TABLE_NAME = "${Company}_SL_OSAD";

	/**
	 * 业务对象编码
	 */
	public static final String BUSINESS_OBJECT_CODE = "${Company}_SL_SHIPADDRESS";

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "ShippingAddress";

	/**
	 * 属性名称-基于类型
	 */
	private static final String PROPERTY_BASEDOCUMENTTYPE_NAME = "BaseDocumentType";

	/**
	 * 基于类型 属性
	 */
	@DbField(name = "BaseType", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_BASEDOCUMENTTYPE = registerProperty(
			PROPERTY_BASEDOCUMENTTYPE_NAME, String.class, MY_CLASS);

	/**
	 * 获取-基于类型
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_BASEDOCUMENTTYPE_NAME)
	public final String getBaseDocumentType() {
		return this.getProperty(PROPERTY_BASEDOCUMENTTYPE);
	}

	/**
	 * 设置-基于类型
	 * 
	 * @param value
	 *            值
	 */
	public final void setBaseDocumentType(String value) {
		this.setProperty(PROPERTY_BASEDOCUMENTTYPE, value);
	}

	/**
	 * 属性名称-基于标识
	 */
	private static final String PROPERTY_BASEDOCUMENTENTRY_NAME = "BaseDocumentEntry";

	/**
	 * 基于标识 属性
	 */
	@DbField(name = "BaseEntry", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_BASEDOCUMENTENTRY = registerProperty(
			PROPERTY_BASEDOCUMENTENTRY_NAME, Integer.class, MY_CLASS);

	/**
	 * 获取-基于标识
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_BASEDOCUMENTENTRY_NAME)
	public final Integer getBaseDocumentEntry() {
		return this.getProperty(PROPERTY_BASEDOCUMENTENTRY);
	}

	/**
	 * 设置-基于标识
	 * 
	 * @param value
	 *            值
	 */
	public final void setBaseDocumentEntry(Integer value) {
		this.setProperty(PROPERTY_BASEDOCUMENTENTRY, value);
	}

	/**
	 * 属性名称-名称
	 */
	private static final String PROPERTY_NAME_NAME = "Name";

	/**
	 * 名称 属性
	 */
	@DbField(name = "Name", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_NAME = registerProperty(PROPERTY_NAME_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-名称
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_NAME_NAME)
	public final String getName() {
		return this.getProperty(PROPERTY_NAME);
	}

	/**
	 * 设置-名称
	 * 
	 * @param value
	 *            值
	 */
	public final void setName(String value) {
		this.setProperty(PROPERTY_NAME, value);
	}

	/**
	 * 属性名称-顺序
	 */
	private static final String PROPERTY_ORDER_NAME = "Order";

	/**
	 * 顺序 属性
	 */
	@DbField(name = "Order", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_ORDER = registerProperty(PROPERTY_ORDER_NAME, Integer.class,
			MY_CLASS);

	/**
	 * 获取-顺序
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_ORDER_NAME)
	public final Integer getOrder() {
		return this.getProperty(PROPERTY_ORDER);
	}

	/**
	 * 设置-顺序
	 * 
	 * @param value
	 *            值
	 */
	public final void setOrder(Integer value) {
		this.setProperty(PROPERTY_ORDER, value);
	}

	/**
	 * 属性名称-送货状态
	 */
	private static final String PROPERTY_SHIPPINGSTATUS_NAME = "ShippingStatus";

	/**
	 * 送货状态 属性
	 */
	@DbField(name = "Status", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<emShippingStatus> PROPERTY_SHIPPINGSTATUS = registerProperty(
			PROPERTY_SHIPPINGSTATUS_NAME, emShippingStatus.class, MY_CLASS);

	/**
	 * 获取-送货状态
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_SHIPPINGSTATUS_NAME)
	public final emShippingStatus getShippingStatus() {
		return this.getProperty(PROPERTY_SHIPPINGSTATUS);
	}

	/**
	 * 设置-送货状态
	 * 
	 * @param value
	 *            值
	 */
	public final void setShippingStatus(emShippingStatus value) {
		this.setProperty(PROPERTY_SHIPPINGSTATUS, value);
	}

	/**
	 * 属性名称-收货人
	 */
	private static final String PROPERTY_CONSIGNEE_NAME = "Consignee";

	/**
	 * 收货人 属性
	 */
	@DbField(name = "Consignee", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_CONSIGNEE = registerProperty(PROPERTY_CONSIGNEE_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-收货人
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CONSIGNEE_NAME)
	public final String getConsignee() {
		return this.getProperty(PROPERTY_CONSIGNEE);
	}

	/**
	 * 设置-收货人
	 * 
	 * @param value
	 *            值
	 */
	public final void setConsignee(String value) {
		this.setProperty(PROPERTY_CONSIGNEE, value);
	}

	/**
	 * 属性名称-街道
	 */
	private static final String PROPERTY_STREET_NAME = "Street";

	/**
	 * 街道 属性
	 */
	@DbField(name = "Street", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_STREET = registerProperty(PROPERTY_STREET_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-街道
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_STREET_NAME)
	public final String getStreet() {
		return this.getProperty(PROPERTY_STREET);
	}

	/**
	 * 设置-街道
	 * 
	 * @param value
	 *            值
	 */
	public final void setStreet(String value) {
		this.setProperty(PROPERTY_STREET, value);
	}

	/**
	 * 属性名称-县/区
	 */
	private static final String PROPERTY_DISTRICT_NAME = "District";

	/**
	 * 县/区 属性
	 */
	@DbField(name = "District", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_DISTRICT = registerProperty(PROPERTY_DISTRICT_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-县/区
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DISTRICT_NAME)
	public final String getDistrict() {
		return this.getProperty(PROPERTY_DISTRICT);
	}

	/**
	 * 设置-县/区
	 * 
	 * @param value
	 *            值
	 */
	public final void setDistrict(String value) {
		this.setProperty(PROPERTY_DISTRICT, value);
	}

	/**
	 * 属性名称-市
	 */
	private static final String PROPERTY_CITY_NAME = "City";

	/**
	 * 市 属性
	 */
	@DbField(name = "City", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_CITY = registerProperty(PROPERTY_CITY_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-市
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CITY_NAME)
	public final String getCity() {
		return this.getProperty(PROPERTY_CITY);
	}

	/**
	 * 设置-市
	 * 
	 * @param value
	 *            值
	 */
	public final void setCity(String value) {
		this.setProperty(PROPERTY_CITY, value);
	}

	/**
	 * 属性名称-省
	 */
	private static final String PROPERTY_PROVINCE_NAME = "Province";

	/**
	 * 省 属性
	 */
	@DbField(name = "Province", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_PROVINCE = registerProperty(PROPERTY_PROVINCE_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-省
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_PROVINCE_NAME)
	public final String getProvince() {
		return this.getProperty(PROPERTY_PROVINCE);
	}

	/**
	 * 设置-省
	 * 
	 * @param value
	 *            值
	 */
	public final void setProvince(String value) {
		this.setProperty(PROPERTY_PROVINCE, value);
	}

	/**
	 * 属性名称-国
	 */
	private static final String PROPERTY_COUNTRY_NAME = "Country";

	/**
	 * 国 属性
	 */
	@DbField(name = "Country", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_COUNTRY = registerProperty(PROPERTY_COUNTRY_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-国
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_COUNTRY_NAME)
	public final String getCountry() {
		return this.getProperty(PROPERTY_COUNTRY);
	}

	/**
	 * 设置-国
	 * 
	 * @param value
	 *            值
	 */
	public final void setCountry(String value) {
		this.setProperty(PROPERTY_COUNTRY, value);
	}

	/**
	 * 属性名称-邮编
	 */
	private static final String PROPERTY_ZIPCODE_NAME = "ZipCode";

	/**
	 * 邮编 属性
	 */
	@DbField(name = "ZipCode", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_ZIPCODE = registerProperty(PROPERTY_ZIPCODE_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-邮编
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_ZIPCODE_NAME)
	public final String getZipCode() {
		return this.getProperty(PROPERTY_ZIPCODE);
	}

	/**
	 * 设置-邮编
	 * 
	 * @param value
	 *            值
	 */
	public final void setZipCode(String value) {
		this.setProperty(PROPERTY_ZIPCODE, value);
	}

	/**
	 * 属性名称-联系电话
	 */
	private static final String PROPERTY_MOBILEPHONE_NAME = "MobilePhone";

	/**
	 * 联系电话 属性
	 */
	@DbField(name = "Phone", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_MOBILEPHONE = registerProperty(PROPERTY_MOBILEPHONE_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-联系电话
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_MOBILEPHONE_NAME)
	public final String getMobilePhone() {
		return this.getProperty(PROPERTY_MOBILEPHONE);
	}

	/**
	 * 设置-联系电话
	 * 
	 * @param value
	 *            值
	 */
	public final void setMobilePhone(String value) {
		this.setProperty(PROPERTY_MOBILEPHONE, value);
	}

	/**
	 * 属性名称-电话
	 */
	private static final String PROPERTY_TELEPHONE_NAME = "Telephone";

	/**
	 * 电话 属性
	 */
	@DbField(name = "Telephone", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_TELEPHONE = registerProperty(PROPERTY_TELEPHONE_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-电话
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_TELEPHONE_NAME)
	public final String getTelephone() {
		return this.getProperty(PROPERTY_TELEPHONE);
	}

	/**
	 * 设置-电话
	 * 
	 * @param value
	 *            值
	 */
	public final void setTelephone(String value) {
		this.setProperty(PROPERTY_TELEPHONE, value);
	}

	/**
	 * 属性名称-备注 1
	 */
	private static final String PROPERTY_REMARK1_NAME = "Remark1";

	/**
	 * 备注 1 属性
	 */
	@DbField(name = "Notes1", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_REMARK1 = registerProperty(PROPERTY_REMARK1_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-备注 1
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_REMARK1_NAME)
	public final String getRemark1() {
		return this.getProperty(PROPERTY_REMARK1);
	}

	/**
	 * 设置-备注 1
	 * 
	 * @param value
	 *            值
	 */
	public final void setRemark1(String value) {
		this.setProperty(PROPERTY_REMARK1, value);
	}

	/**
	 * 属性名称-备注 2
	 */
	private static final String PROPERTY_REMARK2_NAME = "Remark2";

	/**
	 * 备注 2 属性
	 */
	@DbField(name = "Notes2", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_REMARK2 = registerProperty(PROPERTY_REMARK2_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-备注 2
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_REMARK2_NAME)
	public final String getRemark2() {
		return this.getProperty(PROPERTY_REMARK2);
	}

	/**
	 * 设置-备注 2
	 * 
	 * @param value
	 *            值
	 */
	public final void setRemark2(String value) {
		this.setProperty(PROPERTY_REMARK2, value);
	}

	/**
	 * 属性名称-对象编号
	 */
	private static final String PROPERTY_OBJECTKEY_NAME = "ObjectKey";

	/**
	 * 对象编号 属性
	 */
	@DbField(name = "ObjectKey", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = true)
	public static final IPropertyInfo<Integer> PROPERTY_OBJECTKEY = registerProperty(PROPERTY_OBJECTKEY_NAME,
			Integer.class, MY_CLASS);

	/**
	 * 获取-对象编号
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_OBJECTKEY_NAME)
	public final Integer getObjectKey() {
		return this.getProperty(PROPERTY_OBJECTKEY);
	}

	/**
	 * 设置-对象编号
	 * 
	 * @param value
	 *            值
	 */
	public final void setObjectKey(Integer value) {
		this.setProperty(PROPERTY_OBJECTKEY, value);
	}

	/**
	 * 属性名称-对象类型
	 */
	private static final String PROPERTY_OBJECTCODE_NAME = "ObjectCode";

	/**
	 * 对象类型 属性
	 */
	@DbField(name = "ObjectCode", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_OBJECTCODE = registerProperty(PROPERTY_OBJECTCODE_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-对象类型
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_OBJECTCODE_NAME)
	public final String getObjectCode() {
		return this.getProperty(PROPERTY_OBJECTCODE);
	}

	/**
	 * 设置-对象类型
	 * 
	 * @param value
	 *            值
	 */
	public final void setObjectCode(String value) {
		this.setProperty(PROPERTY_OBJECTCODE, value);
	}

	/**
	 * 属性名称-创建日期
	 */
	private static final String PROPERTY_CREATEDATE_NAME = "CreateDate";

	/**
	 * 创建日期 属性
	 */
	@DbField(name = "CreateDate", type = DbFieldType.DATE, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<DateTime> PROPERTY_CREATEDATE = registerProperty(PROPERTY_CREATEDATE_NAME,
			DateTime.class, MY_CLASS);

	/**
	 * 获取-创建日期
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CREATEDATE_NAME)
	public final DateTime getCreateDate() {
		return this.getProperty(PROPERTY_CREATEDATE);
	}

	/**
	 * 设置-创建日期
	 * 
	 * @param value
	 *            值
	 */
	public final void setCreateDate(DateTime value) {
		this.setProperty(PROPERTY_CREATEDATE, value);
	}

	/**
	 * 属性名称-创建时间
	 */
	private static final String PROPERTY_CREATETIME_NAME = "CreateTime";

	/**
	 * 创建时间 属性
	 */
	@DbField(name = "CreateTime", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Short> PROPERTY_CREATETIME = registerProperty(PROPERTY_CREATETIME_NAME,
			Short.class, MY_CLASS);

	/**
	 * 获取-创建时间
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CREATETIME_NAME)
	public final Short getCreateTime() {
		return this.getProperty(PROPERTY_CREATETIME);
	}

	/**
	 * 设置-创建时间
	 * 
	 * @param value
	 *            值
	 */
	public final void setCreateTime(Short value) {
		this.setProperty(PROPERTY_CREATETIME, value);
	}

	/**
	 * 属性名称-修改日期
	 */
	private static final String PROPERTY_UPDATEDATE_NAME = "UpdateDate";

	/**
	 * 修改日期 属性
	 */
	@DbField(name = "UpdateDate", type = DbFieldType.DATE, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<DateTime> PROPERTY_UPDATEDATE = registerProperty(PROPERTY_UPDATEDATE_NAME,
			DateTime.class, MY_CLASS);

	/**
	 * 获取-修改日期
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_UPDATEDATE_NAME)
	public final DateTime getUpdateDate() {
		return this.getProperty(PROPERTY_UPDATEDATE);
	}

	/**
	 * 设置-修改日期
	 * 
	 * @param value
	 *            值
	 */
	public final void setUpdateDate(DateTime value) {
		this.setProperty(PROPERTY_UPDATEDATE, value);
	}

	/**
	 * 属性名称-修改时间
	 */
	private static final String PROPERTY_UPDATETIME_NAME = "UpdateTime";

	/**
	 * 修改时间 属性
	 */
	@DbField(name = "UpdateTime", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Short> PROPERTY_UPDATETIME = registerProperty(PROPERTY_UPDATETIME_NAME,
			Short.class, MY_CLASS);

	/**
	 * 获取-修改时间
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_UPDATETIME_NAME)
	public final Short getUpdateTime() {
		return this.getProperty(PROPERTY_UPDATETIME);
	}

	/**
	 * 设置-修改时间
	 * 
	 * @param value
	 *            值
	 */
	public final void setUpdateTime(Short value) {
		this.setProperty(PROPERTY_UPDATETIME, value);
	}

	/**
	 * 属性名称-实例号（版本）
	 */
	private static final String PROPERTY_LOGINST_NAME = "LogInst";

	/**
	 * 实例号（版本） 属性
	 */
	@DbField(name = "LogInst", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_LOGINST = registerProperty(PROPERTY_LOGINST_NAME, Integer.class,
			MY_CLASS);

	/**
	 * 获取-实例号（版本）
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_LOGINST_NAME)
	public final Integer getLogInst() {
		return this.getProperty(PROPERTY_LOGINST);
	}

	/**
	 * 设置-实例号（版本）
	 * 
	 * @param value
	 *            值
	 */
	public final void setLogInst(Integer value) {
		this.setProperty(PROPERTY_LOGINST, value);
	}

	/**
	 * 属性名称-服务系列
	 */
	private static final String PROPERTY_SERIES_NAME = "Series";

	/**
	 * 服务系列 属性
	 */
	@DbField(name = "Series", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_SERIES = registerProperty(PROPERTY_SERIES_NAME, Integer.class,
			MY_CLASS);

	/**
	 * 获取-服务系列
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_SERIES_NAME)
	public final Integer getSeries() {
		return this.getProperty(PROPERTY_SERIES);
	}

	/**
	 * 设置-服务系列
	 * 
	 * @param value
	 *            值
	 */
	public final void setSeries(Integer value) {
		this.setProperty(PROPERTY_SERIES, value);
	}

	/**
	 * 属性名称-数据源
	 */
	private static final String PROPERTY_DATASOURCE_NAME = "DataSource";

	/**
	 * 数据源 属性
	 */
	@DbField(name = "DataSource", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_DATASOURCE = registerProperty(PROPERTY_DATASOURCE_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-数据源
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DATASOURCE_NAME)
	public final String getDataSource() {
		return this.getProperty(PROPERTY_DATASOURCE);
	}

	/**
	 * 设置-数据源
	 * 
	 * @param value
	 *            值
	 */
	public final void setDataSource(String value) {
		this.setProperty(PROPERTY_DATASOURCE, value);
	}

	/**
	 * 属性名称-创建用户
	 */
	private static final String PROPERTY_CREATEUSERSIGN_NAME = "CreateUserSign";

	/**
	 * 创建用户 属性
	 */
	@DbField(name = "Creator", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_CREATEUSERSIGN = registerProperty(PROPERTY_CREATEUSERSIGN_NAME,
			Integer.class, MY_CLASS);

	/**
	 * 获取-创建用户
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CREATEUSERSIGN_NAME)
	public final Integer getCreateUserSign() {
		return this.getProperty(PROPERTY_CREATEUSERSIGN);
	}

	/**
	 * 设置-创建用户
	 * 
	 * @param value
	 *            值
	 */
	public final void setCreateUserSign(Integer value) {
		this.setProperty(PROPERTY_CREATEUSERSIGN, value);
	}

	/**
	 * 属性名称-修改用户
	 */
	private static final String PROPERTY_UPDATEUSERSIGN_NAME = "UpdateUserSign";

	/**
	 * 修改用户 属性
	 */
	@DbField(name = "Updator", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_UPDATEUSERSIGN = registerProperty(PROPERTY_UPDATEUSERSIGN_NAME,
			Integer.class, MY_CLASS);

	/**
	 * 获取-修改用户
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_UPDATEUSERSIGN_NAME)
	public final Integer getUpdateUserSign() {
		return this.getProperty(PROPERTY_UPDATEUSERSIGN);
	}

	/**
	 * 设置-修改用户
	 * 
	 * @param value
	 *            值
	 */
	public final void setUpdateUserSign(Integer value) {
		this.setProperty(PROPERTY_UPDATEUSERSIGN, value);
	}

	/**
	 * 属性名称-创建动作标识
	 */
	private static final String PROPERTY_CREATEACTIONID_NAME = "CreateActionId";

	/**
	 * 创建动作标识 属性
	 */
	@DbField(name = "CreateActId", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_CREATEACTIONID = registerProperty(PROPERTY_CREATEACTIONID_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-创建动作标识
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CREATEACTIONID_NAME)
	public final String getCreateActionId() {
		return this.getProperty(PROPERTY_CREATEACTIONID);
	}

	/**
	 * 设置-创建动作标识
	 * 
	 * @param value
	 *            值
	 */
	public final void setCreateActionId(String value) {
		this.setProperty(PROPERTY_CREATEACTIONID, value);
	}

	/**
	 * 属性名称-更新动作标识
	 */
	private static final String PROPERTY_UPDATEACTIONID_NAME = "UpdateActionId";

	/**
	 * 更新动作标识 属性
	 */
	@DbField(name = "UpdateActId", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_UPDATEACTIONID = registerProperty(PROPERTY_UPDATEACTIONID_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-更新动作标识
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_UPDATEACTIONID_NAME)
	public final String getUpdateActionId() {
		return this.getProperty(PROPERTY_UPDATEACTIONID);
	}

	/**
	 * 设置-更新动作标识
	 * 
	 * @param value
	 *            值
	 */
	public final void setUpdateActionId(String value) {
		this.setProperty(PROPERTY_UPDATEACTIONID, value);
	}

	/**
	 * 初始化数据
	 */
	@Override
	protected void initialize() {
		super.initialize();// 基类初始化，不可去除
		this.setObjectCode(MyConfiguration.applyVariables(BUSINESS_OBJECT_CODE));
		this.setShippingStatus(emShippingStatus.WAITING);
	}

}
