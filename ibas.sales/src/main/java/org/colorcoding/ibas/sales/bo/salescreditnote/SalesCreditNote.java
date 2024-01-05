package org.colorcoding.ibas.sales.bo.salescreditnote;

import java.math.BigDecimal;
import java.util.function.Predicate;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.accounting.data.IProjectData;
import org.colorcoding.ibas.accounting.logic.IBranchCheckContract;
import org.colorcoding.ibas.accounting.logic.IJournalEntryCreationContract;
import org.colorcoding.ibas.accounting.logic.JournalEntryContent;
import org.colorcoding.ibas.accounting.logic.JournalEntryContent.Category;
import org.colorcoding.ibas.bobas.approval.IApprovalData;
import org.colorcoding.ibas.bobas.bo.BusinessObject;
import org.colorcoding.ibas.bobas.bo.IBOSeriesKey;
import org.colorcoding.ibas.bobas.bo.IBOTagCanceled;
import org.colorcoding.ibas.bobas.bo.IBOTagDeleted;
import org.colorcoding.ibas.bobas.bo.IBOUserFields;
import org.colorcoding.ibas.bobas.core.IPropertyInfo;
import org.colorcoding.ibas.bobas.data.ArrayList;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.data.List;
import org.colorcoding.ibas.bobas.data.emApprovalStatus;
import org.colorcoding.ibas.bobas.data.emBOStatus;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.bobas.logic.IBusinessLogicContract;
import org.colorcoding.ibas.bobas.logic.IBusinessLogicsHost;
import org.colorcoding.ibas.bobas.mapping.BusinessObjectUnit;
import org.colorcoding.ibas.bobas.mapping.DbField;
import org.colorcoding.ibas.bobas.mapping.DbFieldType;
import org.colorcoding.ibas.bobas.ownership.IDataOwnership;
import org.colorcoding.ibas.bobas.period.IPeriodData;
import org.colorcoding.ibas.bobas.rule.IBusinessRule;
import org.colorcoding.ibas.bobas.rule.common.BusinessRuleDocumentStatus;
import org.colorcoding.ibas.bobas.rule.common.BusinessRuleMinValue;
import org.colorcoding.ibas.bobas.rule.common.BusinessRuleRequired;
import org.colorcoding.ibas.bobas.rule.common.BusinessRuleRequiredElements;
import org.colorcoding.ibas.bobas.rule.common.BusinessRuleSumElements;
import org.colorcoding.ibas.businesspartner.logic.ICustomerCheckContract;
import org.colorcoding.ibas.document.IDocumentPaidTotalOperator;
import org.colorcoding.ibas.materials.data.Ledgers;
import org.colorcoding.ibas.materials.logic.journalentry.JournalEntrySmartContent;
import org.colorcoding.ibas.sales.MyConfiguration;
import org.colorcoding.ibas.sales.bo.salesinvoice.SalesInvoice;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;
import org.colorcoding.ibas.sales.bo.shippingaddress.IShippingAddresss;
import org.colorcoding.ibas.sales.bo.shippingaddress.ShippingAddress;
import org.colorcoding.ibas.sales.bo.shippingaddress.ShippingAddresss;
import org.colorcoding.ibas.sales.logic.journalentry.SalesCreditNoteInvoiceMaterialsCost;
import org.colorcoding.ibas.sales.logic.journalentry.SalesCreditNoteMaterialsCost;
import org.colorcoding.ibas.sales.logic.journalentry.SalesCreditNoteReturnMaterialsCost;
import org.colorcoding.ibas.sales.rules.BusinessRuleDeductionDiscountTotal;
import org.colorcoding.ibas.sales.rules.BusinessRuleDeductionDocumentTotal;

/**
 * 获取-销售贷项
 * 
 */
@XmlAccessorType(XmlAccessType.NONE)
@XmlType(name = SalesCreditNote.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlRootElement(name = SalesCreditNote.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@BusinessObjectUnit(code = SalesCreditNote.BUSINESS_OBJECT_CODE)
public class SalesCreditNote extends BusinessObject<SalesCreditNote>
		implements ISalesCreditNote, IDataOwnership, IApprovalData, IPeriodData, IProjectData, IBOTagDeleted,
		IBOTagCanceled, IBusinessLogicsHost, IBOSeriesKey, IBOUserFields, IDocumentPaidTotalOperator {

	/**
	 * 序列化版本标记
	 */
	private static final long serialVersionUID = -2234041044073472976L;

	/**
	 * 当前类型
	 */
	private static final Class<?> MY_CLASS = SalesCreditNote.class;

	/**
	 * 数据库表
	 */
	public static final String DB_TABLE_NAME = "${Company}_SL_ORIN";

	/**
	 * 业务对象编码
	 */
	public static final String BUSINESS_OBJECT_CODE = "${Company}_SL_SALESCREDIT";

	/**
	 * 业务对象名称
	 */
	public static final String BUSINESS_OBJECT_NAME = "SalesCreditNote";

	/**
	 * 属性名称-凭证编号
	 */
	private static final String PROPERTY_DOCENTRY_NAME = "DocEntry";

	/**
	 * 凭证编号 属性
	 */
	@DbField(name = "DocEntry", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = true)
	public static final IPropertyInfo<Integer> PROPERTY_DOCENTRY = registerProperty(PROPERTY_DOCENTRY_NAME,
			Integer.class, MY_CLASS);

	/**
	 * 获取-凭证编号
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DOCENTRY_NAME)
	public final Integer getDocEntry() {
		return this.getProperty(PROPERTY_DOCENTRY);
	}

	/**
	 * 设置-凭证编号
	 * 
	 * @param value 值
	 */
	public final void setDocEntry(Integer value) {
		this.setProperty(PROPERTY_DOCENTRY, value);
	}

	/**
	 * 属性名称-单据编码
	 */
	private static final String PROPERTY_DOCNUM_NAME = "DocNum";

	/**
	 * 期间编号 属性
	 */
	@DbField(name = "DocNum", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_DOCNUM = registerProperty(PROPERTY_DOCNUM_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-单据编码
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DOCNUM_NAME)
	public final String getDocNum() {
		return this.getProperty(PROPERTY_DOCNUM);
	}

	/**
	 * 设置-单据编码
	 * 
	 * @param value 值
	 */
	public final void setDocNum(String value) {
		this.setProperty(PROPERTY_DOCNUM, value);
	}

	/**
	 * 属性名称-期间
	 */
	private static final String PROPERTY_PERIOD_NAME = "Period";

	/**
	 * 期间 属性
	 */
	@DbField(name = "Period", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_PERIOD = registerProperty(PROPERTY_PERIOD_NAME, Integer.class,
			MY_CLASS);

	/**
	 * 获取-期间
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_PERIOD_NAME)
	public final Integer getPeriod() {
		return this.getProperty(PROPERTY_PERIOD);
	}

	/**
	 * 设置-期间
	 * 
	 * @param value 值
	 */
	public final void setPeriod(Integer value) {
		this.setProperty(PROPERTY_PERIOD, value);
	}

	/**
	 * 属性名称-取消
	 */
	private static final String PROPERTY_CANCELED_NAME = "Canceled";

	/**
	 * 取消 属性
	 */
	@DbField(name = "Canceled", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<emYesNo> PROPERTY_CANCELED = registerProperty(PROPERTY_CANCELED_NAME,
			emYesNo.class, MY_CLASS);

	/**
	 * 获取-取消
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CANCELED_NAME)
	public final emYesNo getCanceled() {
		return this.getProperty(PROPERTY_CANCELED);
	}

	/**
	 * 设置-取消
	 * 
	 * @param value 值
	 */
	public final void setCanceled(emYesNo value) {
		this.setProperty(PROPERTY_CANCELED, value);
	}

	/**
	 * 属性名称-状态
	 */
	private static final String PROPERTY_STATUS_NAME = "Status";

	/**
	 * 状态 属性
	 */
	@DbField(name = "Status", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<emBOStatus> PROPERTY_STATUS = registerProperty(PROPERTY_STATUS_NAME,
			emBOStatus.class, MY_CLASS);

	/**
	 * 获取-状态
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_STATUS_NAME)
	public final emBOStatus getStatus() {
		return this.getProperty(PROPERTY_STATUS);
	}

	/**
	 * 设置-状态
	 * 
	 * @param value 值
	 */
	public final void setStatus(emBOStatus value) {
		this.setProperty(PROPERTY_STATUS, value);
	}

	/**
	 * 属性名称-审批状态
	 */
	private static final String PROPERTY_APPROVALSTATUS_NAME = "ApprovalStatus";

	/**
	 * 审批状态 属性
	 */
	@DbField(name = "ApvlStatus", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<emApprovalStatus> PROPERTY_APPROVALSTATUS = registerProperty(
			PROPERTY_APPROVALSTATUS_NAME, emApprovalStatus.class, MY_CLASS);

	/**
	 * 获取-审批状态
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_APPROVALSTATUS_NAME)
	public final emApprovalStatus getApprovalStatus() {
		return this.getProperty(PROPERTY_APPROVALSTATUS);
	}

	/**
	 * 设置-审批状态
	 * 
	 * @param value 值
	 */
	public final void setApprovalStatus(emApprovalStatus value) {
		this.setProperty(PROPERTY_APPROVALSTATUS, value);
	}

	/**
	 * 属性名称-单据状态
	 */
	private static final String PROPERTY_DOCUMENTSTATUS_NAME = "DocumentStatus";

	/**
	 * 单据状态 属性
	 */
	@DbField(name = "DocStatus", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<emDocumentStatus> PROPERTY_DOCUMENTSTATUS = registerProperty(
			PROPERTY_DOCUMENTSTATUS_NAME, emDocumentStatus.class, MY_CLASS);

	/**
	 * 获取-单据状态
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DOCUMENTSTATUS_NAME)
	public final emDocumentStatus getDocumentStatus() {
		return this.getProperty(PROPERTY_DOCUMENTSTATUS);
	}

	/**
	 * 设置-单据状态
	 * 
	 * @param value 值
	 */
	public final void setDocumentStatus(emDocumentStatus value) {
		this.setProperty(PROPERTY_DOCUMENTSTATUS, value);
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
	 * @param value 值
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
	 * @param value 值
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
	 * @param value 值
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
	 * @param value 值
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
	 * @param value 值
	 */
	public final void setUpdateTime(Short value) {
		this.setProperty(PROPERTY_UPDATETIME, value);
	}

	/**
	 * 属性名称-版本
	 */
	private static final String PROPERTY_LOGINST_NAME = "LogInst";

	/**
	 * 版本 属性
	 */
	@DbField(name = "LogInst", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_LOGINST = registerProperty(PROPERTY_LOGINST_NAME, Integer.class,
			MY_CLASS);

	/**
	 * 获取-版本
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_LOGINST_NAME)
	public final Integer getLogInst() {
		return this.getProperty(PROPERTY_LOGINST);
	}

	/**
	 * 设置-版本
	 * 
	 * @param value 值
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
	 * @param value 值
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
	 * @param value 值
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
	 * @param value 值
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
	 * @param value 值
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
	 * @param value 值
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
	 * @param value 值
	 */
	public final void setUpdateActionId(String value) {
		this.setProperty(PROPERTY_UPDATEACTIONID, value);
	}

	/**
	 * 属性名称-数据所有者
	 */
	private static final String PROPERTY_DATAOWNER_NAME = "DataOwner";

	/**
	 * 数据所有者 属性
	 */
	@DbField(name = "DataOwner", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_DATAOWNER = registerProperty(PROPERTY_DATAOWNER_NAME,
			Integer.class, MY_CLASS);

	/**
	 * 获取-数据所有者
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DATAOWNER_NAME)
	public final Integer getDataOwner() {
		return this.getProperty(PROPERTY_DATAOWNER);
	}

	/**
	 * 设置-数据所有者
	 * 
	 * @param value 值
	 */
	public final void setDataOwner(Integer value) {
		this.setProperty(PROPERTY_DATAOWNER, value);
	}

	/**
	 * 属性名称-团队成员
	 */
	private static final String PROPERTY_TEAMMEMBERS_NAME = "TeamMembers";

	/**
	 * 团队成员 属性
	 */
	@DbField(name = "TeamMembers", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_TEAMMEMBERS = registerProperty(PROPERTY_TEAMMEMBERS_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-团队成员
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_TEAMMEMBERS_NAME)
	public final String getTeamMembers() {
		return this.getProperty(PROPERTY_TEAMMEMBERS);
	}

	/**
	 * 设置-团队成员
	 * 
	 * @param value 值
	 */
	public final void setTeamMembers(String value) {
		this.setProperty(PROPERTY_TEAMMEMBERS, value);
	}

	/**
	 * 属性名称-数据所属组织
	 */
	private static final String PROPERTY_ORGANIZATION_NAME = "Organization";

	/**
	 * 数据所属组织 属性
	 */
	@DbField(name = "OrgCode", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_ORGANIZATION = registerProperty(PROPERTY_ORGANIZATION_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-数据所属组织
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_ORGANIZATION_NAME)
	public final String getOrganization() {
		return this.getProperty(PROPERTY_ORGANIZATION);
	}

	/**
	 * 设置-数据所属组织
	 * 
	 * @param value 值
	 */
	public final void setOrganization(String value) {
		this.setProperty(PROPERTY_ORGANIZATION, value);
	}

	/**
	 * 属性名称-过账日期
	 */
	private static final String PROPERTY_POSTINGDATE_NAME = "PostingDate";

	/**
	 * 过账日期 属性
	 */
	@DbField(name = "DocDate", type = DbFieldType.DATE, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<DateTime> PROPERTY_POSTINGDATE = registerProperty(PROPERTY_POSTINGDATE_NAME,
			DateTime.class, MY_CLASS);

	/**
	 * 获取-过账日期
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_POSTINGDATE_NAME)
	public final DateTime getPostingDate() {
		return this.getProperty(PROPERTY_POSTINGDATE);
	}

	/**
	 * 设置-过账日期
	 * 
	 * @param value 值
	 */
	public final void setPostingDate(DateTime value) {
		this.setProperty(PROPERTY_POSTINGDATE, value);
	}

	/**
	 * 属性名称-到期日
	 */
	private static final String PROPERTY_DELIVERYDATE_NAME = "DeliveryDate";

	/**
	 * 到期日 属性
	 */
	@DbField(name = "DocDueDate", type = DbFieldType.DATE, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<DateTime> PROPERTY_DELIVERYDATE = registerProperty(PROPERTY_DELIVERYDATE_NAME,
			DateTime.class, MY_CLASS);

	/**
	 * 获取-到期日
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DELIVERYDATE_NAME)
	public final DateTime getDeliveryDate() {
		return this.getProperty(PROPERTY_DELIVERYDATE);
	}

	/**
	 * 设置-到期日
	 * 
	 * @param value 值
	 */
	public final void setDeliveryDate(DateTime value) {
		this.setProperty(PROPERTY_DELIVERYDATE, value);
	}

	/**
	 * 属性名称-凭证日期
	 */
	private static final String PROPERTY_DOCUMENTDATE_NAME = "DocumentDate";

	/**
	 * 凭证日期 属性
	 */
	@DbField(name = "TaxDate", type = DbFieldType.DATE, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<DateTime> PROPERTY_DOCUMENTDATE = registerProperty(PROPERTY_DOCUMENTDATE_NAME,
			DateTime.class, MY_CLASS);

	/**
	 * 获取-凭证日期
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DOCUMENTDATE_NAME)
	public final DateTime getDocumentDate() {
		return this.getProperty(PROPERTY_DOCUMENTDATE);
	}

	/**
	 * 设置-凭证日期
	 * 
	 * @param value 值
	 */
	public final void setDocumentDate(DateTime value) {
		this.setProperty(PROPERTY_DOCUMENTDATE, value);
	}

	/**
	 * 属性名称-参考1
	 */
	private static final String PROPERTY_REFERENCE1_NAME = "Reference1";

	/**
	 * 参考1 属性
	 */
	@DbField(name = "Ref1", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_REFERENCE1 = registerProperty(PROPERTY_REFERENCE1_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-参考1
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_REFERENCE1_NAME)
	public final String getReference1() {
		return this.getProperty(PROPERTY_REFERENCE1);
	}

	/**
	 * 设置-参考1
	 * 
	 * @param value 值
	 */
	public final void setReference1(String value) {
		this.setProperty(PROPERTY_REFERENCE1, value);
	}

	/**
	 * 属性名称-参考2
	 */
	private static final String PROPERTY_REFERENCE2_NAME = "Reference2";

	/**
	 * 参考2 属性
	 */
	@DbField(name = "Ref2", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_REFERENCE2 = registerProperty(PROPERTY_REFERENCE2_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-参考2
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_REFERENCE2_NAME)
	public final String getReference2() {
		return this.getProperty(PROPERTY_REFERENCE2);
	}

	/**
	 * 设置-参考2
	 * 
	 * @param value 值
	 */
	public final void setReference2(String value) {
		this.setProperty(PROPERTY_REFERENCE2, value);
	}

	/**
	 * 属性名称-备注
	 */
	private static final String PROPERTY_REMARKS_NAME = "Remarks";

	/**
	 * 备注 属性
	 */
	@DbField(name = "Remarks", type = DbFieldType.MEMO, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_REMARKS = registerProperty(PROPERTY_REMARKS_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-备注
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_REMARKS_NAME)
	public final String getRemarks() {
		return this.getProperty(PROPERTY_REMARKS);
	}

	/**
	 * 设置-备注
	 * 
	 * @param value 值
	 */
	public final void setRemarks(String value) {
		this.setProperty(PROPERTY_REMARKS, value);
	}

	/**
	 * 属性名称-已引用
	 */
	private static final String PROPERTY_REFERENCED_NAME = "Referenced";

	/**
	 * 已引用 属性
	 */
	@DbField(name = "Refed", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<emYesNo> PROPERTY_REFERENCED = registerProperty(PROPERTY_REFERENCED_NAME,
			emYesNo.class, MY_CLASS);

	/**
	 * 获取-已引用
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_REFERENCED_NAME)
	public final emYesNo getReferenced() {
		return this.getProperty(PROPERTY_REFERENCED);
	}

	/**
	 * 设置-已引用
	 * 
	 * @param value 值
	 */
	public final void setReferenced(emYesNo value) {
		this.setProperty(PROPERTY_REFERENCED, value);
	}

	/**
	 * 属性名称-已删除
	 */
	private static final String PROPERTY_DELETED_NAME = "Deleted";

	/**
	 * 已删除 属性
	 */
	@DbField(name = "Deleted", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<emYesNo> PROPERTY_DELETED = registerProperty(PROPERTY_DELETED_NAME, emYesNo.class,
			MY_CLASS);

	/**
	 * 获取-已删除
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DELETED_NAME)
	public final emYesNo getDeleted() {
		return this.getProperty(PROPERTY_DELETED);
	}

	/**
	 * 设置-已删除
	 * 
	 * @param value 值
	 */
	public final void setDeleted(emYesNo value) {
		this.setProperty(PROPERTY_DELETED, value);
	}

	/**
	 * 属性名称-客户代码
	 */
	private static final String PROPERTY_CUSTOMERCODE_NAME = "CustomerCode";

	/**
	 * 客户代码 属性
	 */
	@DbField(name = "CardCode", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_CUSTOMERCODE = registerProperty(PROPERTY_CUSTOMERCODE_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-客户代码
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CUSTOMERCODE_NAME)
	public final String getCustomerCode() {
		return this.getProperty(PROPERTY_CUSTOMERCODE);
	}

	/**
	 * 设置-客户代码
	 * 
	 * @param value 值
	 */
	public final void setCustomerCode(String value) {
		this.setProperty(PROPERTY_CUSTOMERCODE, value);
	}

	/**
	 * 属性名称-客户名称
	 */
	private static final String PROPERTY_CUSTOMERNAME_NAME = "CustomerName";

	/**
	 * 客户名称 属性
	 */
	@DbField(name = "CardName", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_CUSTOMERNAME = registerProperty(PROPERTY_CUSTOMERNAME_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-客户名称
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CUSTOMERNAME_NAME)
	public final String getCustomerName() {
		return this.getProperty(PROPERTY_CUSTOMERNAME);
	}

	/**
	 * 设置-客户名称
	 * 
	 * @param value 值
	 */
	public final void setCustomerName(String value) {
		this.setProperty(PROPERTY_CUSTOMERNAME, value);
	}

	/**
	 * 属性名称-联系人
	 */
	private static final String PROPERTY_CONTACTPERSON_NAME = "ContactPerson";

	/**
	 * 联系人 属性
	 */
	@DbField(name = "CntctCode", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_CONTACTPERSON = registerProperty(PROPERTY_CONTACTPERSON_NAME,
			Integer.class, MY_CLASS);

	/**
	 * 获取-联系人
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CONTACTPERSON_NAME)
	public final Integer getContactPerson() {
		return this.getProperty(PROPERTY_CONTACTPERSON);
	}

	/**
	 * 设置-联系人
	 * 
	 * @param value 值
	 */
	public final void setContactPerson(Integer value) {
		this.setProperty(PROPERTY_CONTACTPERSON, value);
	}

	/**
	 * 属性名称-折扣
	 */
	private static final String PROPERTY_DISCOUNT_NAME = "Discount";

	/**
	 * 折扣 属性
	 */
	@DbField(name = "DiscPrcnt", type = DbFieldType.DECIMAL, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<BigDecimal> PROPERTY_DISCOUNT = registerProperty(PROPERTY_DISCOUNT_NAME,
			BigDecimal.class, MY_CLASS);

	/**
	 * 获取-折扣
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DISCOUNT_NAME)
	public final BigDecimal getDiscount() {
		return this.getProperty(PROPERTY_DISCOUNT);
	}

	/**
	 * 设置-折扣
	 * 
	 * @param value 值
	 */
	public final void setDiscount(BigDecimal value) {
		this.setProperty(PROPERTY_DISCOUNT, value);
	}

	/**
	 * 设置-折扣
	 * 
	 * @param value 值
	 */
	public final void setDiscount(String value) {
		this.setDiscount(Decimal.valueOf(value));
	}

	/**
	 * 设置-折扣
	 * 
	 * @param value 值
	 */
	public final void setDiscount(int value) {
		this.setDiscount(Decimal.valueOf(value));
	}

	/**
	 * 设置-折扣
	 * 
	 * @param value 值
	 */
	public final void setDiscount(double value) {
		this.setDiscount(Decimal.valueOf(value));
	}

	/**
	 * 属性名称-折扣后总计
	 */
	private static final String PROPERTY_DISCOUNTTOTAL_NAME = "DiscountTotal";

	/**
	 * 折扣后总计 属性
	 */
	@DbField(name = "DiscSum", type = DbFieldType.DECIMAL, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<BigDecimal> PROPERTY_DISCOUNTTOTAL = registerProperty(PROPERTY_DISCOUNTTOTAL_NAME,
			BigDecimal.class, MY_CLASS);

	/**
	 * 获取-折扣后总计
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DISCOUNTTOTAL_NAME)
	public final BigDecimal getDiscountTotal() {
		return this.getProperty(PROPERTY_DISCOUNTTOTAL);
	}

	/**
	 * 设置-折扣后总计
	 * 
	 * @param value 值
	 */
	public final void setDiscountTotal(BigDecimal value) {
		this.setProperty(PROPERTY_DISCOUNTTOTAL, value);
	}

	/**
	 * 设置-折扣后总计
	 * 
	 * @param value 值
	 */
	public final void setDiscountTotal(String value) {
		this.setDiscountTotal(Decimal.valueOf(value));
	}

	/**
	 * 设置-折扣后总计
	 * 
	 * @param value 值
	 */
	public final void setDiscountTotal(int value) {
		this.setDiscountTotal(Decimal.valueOf(value));
	}

	/**
	 * 设置-折扣后总计
	 * 
	 * @param value 值
	 */
	public final void setDiscountTotal(double value) {
		this.setDiscountTotal(Decimal.valueOf(value));
	}

	/**
	 * 属性名称-单据货币
	 */
	private static final String PROPERTY_DOCUMENTCURRENCY_NAME = "DocumentCurrency";

	/**
	 * 单据货币 属性
	 */
	@DbField(name = "DocCur", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_DOCUMENTCURRENCY = registerProperty(
			PROPERTY_DOCUMENTCURRENCY_NAME, String.class, MY_CLASS);

	/**
	 * 获取-单据货币
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DOCUMENTCURRENCY_NAME)
	public final String getDocumentCurrency() {
		return this.getProperty(PROPERTY_DOCUMENTCURRENCY);
	}

	/**
	 * 设置-单据货币
	 * 
	 * @param value 值
	 */
	public final void setDocumentCurrency(String value) {
		this.setProperty(PROPERTY_DOCUMENTCURRENCY, value);
	}

	/**
	 * 属性名称-单据汇率
	 */
	private static final String PROPERTY_DOCUMENTRATE_NAME = "DocumentRate";

	/**
	 * 单据汇率 属性
	 */
	@DbField(name = "DocRate", type = DbFieldType.DECIMAL, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<BigDecimal> PROPERTY_DOCUMENTRATE = registerProperty(PROPERTY_DOCUMENTRATE_NAME,
			BigDecimal.class, MY_CLASS);

	/**
	 * 获取-单据汇率
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DOCUMENTRATE_NAME)
	public final BigDecimal getDocumentRate() {
		return this.getProperty(PROPERTY_DOCUMENTRATE);
	}

	/**
	 * 设置-单据汇率
	 * 
	 * @param value 值
	 */
	public final void setDocumentRate(BigDecimal value) {
		this.setProperty(PROPERTY_DOCUMENTRATE, value);
	}

	/**
	 * 设置-单据汇率
	 * 
	 * @param value 值
	 */
	public final void setDocumentRate(String value) {
		this.setDocumentRate(Decimal.valueOf(value));
	}

	/**
	 * 设置-单据汇率
	 * 
	 * @param value 值
	 */
	public final void setDocumentRate(int value) {
		this.setDocumentRate(Decimal.valueOf(value));
	}

	/**
	 * 设置-单据汇率
	 * 
	 * @param value 值
	 */
	public final void setDocumentRate(double value) {
		this.setDocumentRate(Decimal.valueOf(value));
	}

	/**
	 * 属性名称-单据总计
	 */
	private static final String PROPERTY_DOCUMENTTOTAL_NAME = "DocumentTotal";

	/**
	 * 单据总计 属性
	 */
	@DbField(name = "DocTotal", type = DbFieldType.DECIMAL, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<BigDecimal> PROPERTY_DOCUMENTTOTAL = registerProperty(PROPERTY_DOCUMENTTOTAL_NAME,
			BigDecimal.class, MY_CLASS);

	/**
	 * 获取-单据总计
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DOCUMENTTOTAL_NAME)
	public final BigDecimal getDocumentTotal() {
		return this.getProperty(PROPERTY_DOCUMENTTOTAL);
	}

	/**
	 * 设置-单据总计
	 * 
	 * @param value 值
	 */
	public final void setDocumentTotal(BigDecimal value) {
		this.setProperty(PROPERTY_DOCUMENTTOTAL, value);
	}

	/**
	 * 设置-单据总计
	 * 
	 * @param value 值
	 */
	public final void setDocumentTotal(String value) {
		this.setDocumentTotal(Decimal.valueOf(value));
	}

	/**
	 * 设置-单据总计
	 * 
	 * @param value 值
	 */
	public final void setDocumentTotal(int value) {
		this.setDocumentTotal(Decimal.valueOf(value));
	}

	/**
	 * 设置-单据总计
	 * 
	 * @param value 值
	 */
	public final void setDocumentTotal(double value) {
		this.setDocumentTotal(Decimal.valueOf(value));
	}

	/**
	 * 属性名称-已付款总计
	 */
	private static final String PROPERTY_PAIDTOTAL_NAME = "PaidTotal";

	/**
	 * 已付款总计 属性
	 */
	@DbField(name = "PaidTotal", type = DbFieldType.DECIMAL, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<BigDecimal> PROPERTY_PAIDTOTAL = registerProperty(PROPERTY_PAIDTOTAL_NAME,
			BigDecimal.class, MY_CLASS);

	/**
	 * 获取-已付款总计
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_PAIDTOTAL_NAME)
	public final BigDecimal getPaidTotal() {
		return this.getProperty(PROPERTY_PAIDTOTAL);
	}

	/**
	 * 设置-已付款总计
	 * 
	 * @param value 值
	 */
	public final void setPaidTotal(BigDecimal value) {
		this.setProperty(PROPERTY_PAIDTOTAL, value);
	}

	/**
	 * 设置-已付款总计
	 * 
	 * @param value 值
	 */
	public final void setPaidTotal(String value) {
		this.setPaidTotal(Decimal.valueOf(value));
	}

	/**
	 * 设置-已付款总计
	 * 
	 * @param value 值
	 */
	public final void setPaidTotal(int value) {
		this.setPaidTotal(Decimal.valueOf(value));
	}

	/**
	 * 设置-已付款总计
	 * 
	 * @param value 值
	 */
	public final void setPaidTotal(double value) {
		this.setPaidTotal(Decimal.valueOf(value));
	}

	/**
	 * 属性名称-价格清单
	 */
	private static final String PROPERTY_PRICELIST_NAME = "PriceList";

	/**
	 * 价格清单 属性
	 */
	@DbField(name = "PriceList", type = DbFieldType.NUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<Integer> PROPERTY_PRICELIST = registerProperty(PROPERTY_PRICELIST_NAME,
			Integer.class, MY_CLASS);

	/**
	 * 获取-价格清单
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_PRICELIST_NAME)
	public final Integer getPriceList() {
		return this.getProperty(PROPERTY_PRICELIST);
	}

	/**
	 * 设置-价格清单
	 * 
	 * @param value 值
	 */
	public final void setPriceList(Integer value) {
		this.setProperty(PROPERTY_PRICELIST, value);
	}

	/**
	 * 属性名称-付款条款代码
	 */
	private static final String PROPERTY_PAYMENTCODE_NAME = "PaymentCode";

	/**
	 * 付款条款代码 属性
	 */
	@DbField(name = "PaymentCode", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_PAYMENTCODE = registerProperty(PROPERTY_PAYMENTCODE_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-付款条款代码
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_PAYMENTCODE_NAME)
	public final String getPaymentCode() {
		return this.getProperty(PROPERTY_PAYMENTCODE);
	}

	/**
	 * 设置-付款条款代码
	 * 
	 * @param value 值
	 */
	public final void setPaymentCode(String value) {
		this.setProperty(PROPERTY_PAYMENTCODE, value);
	}

	/**
	 * 属性名称-舍入
	 */
	private static final String PROPERTY_ROUNDING_NAME = "Rounding";

	/**
	 * 舍入 属性
	 */
	@DbField(name = "Rounding", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<emYesNo> PROPERTY_ROUNDING = registerProperty(PROPERTY_ROUNDING_NAME,
			emYesNo.class, MY_CLASS);

	/**
	 * 获取-舍入
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_ROUNDING_NAME)
	public final emYesNo getRounding() {
		return this.getProperty(PROPERTY_ROUNDING);
	}

	/**
	 * 设置-舍入
	 * 
	 * @param value 值
	 */
	public final void setRounding(emYesNo value) {
		this.setProperty(PROPERTY_ROUNDING, value);
	}

	/**
	 * 属性名称-舍入差额
	 */
	private static final String PROPERTY_DIFFAMOUNT_NAME = "DiffAmount";

	/**
	 * 舍入差额 属性
	 */
	@DbField(name = "RoundDiff", type = DbFieldType.DECIMAL, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<BigDecimal> PROPERTY_DIFFAMOUNT = registerProperty(PROPERTY_DIFFAMOUNT_NAME,
			BigDecimal.class, MY_CLASS);

	/**
	 * 获取-舍入差额
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_DIFFAMOUNT_NAME)
	public final BigDecimal getDiffAmount() {
		return this.getProperty(PROPERTY_DIFFAMOUNT);
	}

	/**
	 * 设置-舍入差额
	 * 
	 * @param value 值
	 */
	public final void setDiffAmount(BigDecimal value) {
		this.setProperty(PROPERTY_DIFFAMOUNT, value);
	}

	/**
	 * 设置-舍入差额
	 * 
	 * @param value 值
	 */
	public final void setDiffAmount(String value) {
		this.setDiffAmount(Decimal.valueOf(value));
	}

	/**
	 * 设置-舍入差额
	 * 
	 * @param value 值
	 */
	public final void setDiffAmount(int value) {
		this.setDiffAmount(Decimal.valueOf(value));
	}

	/**
	 * 设置-舍入差额
	 * 
	 * @param value 值
	 */
	public final void setDiffAmount(double value) {
		this.setDiffAmount(Decimal.valueOf(value));
	}

	/**
	 * 属性名称-项目代码
	 */
	private static final String PROPERTY_PROJECT_NAME = "Project";

	/**
	 * 项目代码 属性
	 */
	@DbField(name = "Project", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_PROJECT = registerProperty(PROPERTY_PROJECT_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-项目代码
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_PROJECT_NAME)
	public final String getProject() {
		return this.getProperty(PROPERTY_PROJECT);
	}

	/**
	 * 设置-项目代码
	 * 
	 * @param value 值
	 */
	public final void setProject(String value) {
		this.setProperty(PROPERTY_PROJECT, value);
	}

	/**
	 * 属性名称-终端客户
	 */
	private static final String PROPERTY_CONSUMER_NAME = "Consumer";

	/**
	 * 终端客户 属性
	 */
	@DbField(name = "Consumer", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_CONSUMER = registerProperty(PROPERTY_CONSUMER_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-终端客户
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_CONSUMER_NAME)
	public final String getConsumer() {
		return this.getProperty(PROPERTY_CONSUMER);
	}

	/**
	 * 设置-终端客户
	 * 
	 * @param value 值
	 */
	public final void setConsumer(String value) {
		this.setProperty(PROPERTY_CONSUMER, value);
	}

	/**
	 * 属性名称-单据类型
	 */
	private static final String PROPERTY_ORDERTYPE_NAME = "OrderType";

	/**
	 * 单据类型 属性
	 */
	@DbField(name = "OrderType", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME, primaryKey = false)
	public static final IPropertyInfo<String> PROPERTY_ORDERTYPE = registerProperty(PROPERTY_ORDERTYPE_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-单据类型
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_ORDERTYPE_NAME)
	public final String getOrderType() {
		return this.getProperty(PROPERTY_ORDERTYPE);
	}

	/**
	 * 设置-单据类型
	 * 
	 * @param value 值
	 */
	public final void setOrderType(String value) {
		this.setProperty(PROPERTY_ORDERTYPE, value);
	}

	/**
	 * 属性名称-合同/协议
	 */
	private static final String PROPERTY_AGREEMENTS_NAME = "Agreements";

	/**
	 * 合同 属性
	 */
	@DbField(name = "Agreements", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME)
	public static final IPropertyInfo<String> PROPERTY_AGREEMENTS = registerProperty(PROPERTY_AGREEMENTS_NAME,
			String.class, MY_CLASS);

	/**
	 * 获取-合同/协议
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_AGREEMENTS_NAME)
	public final String getAgreements() {
		return this.getProperty(PROPERTY_AGREEMENTS);
	}

	/**
	 * 设置-合同/协议
	 * 
	 * @param value 值
	 */
	public final void setAgreements(String value) {
		this.setProperty(PROPERTY_AGREEMENTS, value);
	}

	/**
	 * 属性名称-分支
	 */
	private static final String PROPERTY_BRANCH_NAME = "Branch";

	/**
	 * 分支 属性
	 */
	@DbField(name = "Branch", type = DbFieldType.ALPHANUMERIC, table = DB_TABLE_NAME)
	public static final IPropertyInfo<String> PROPERTY_BRANCH = registerProperty(PROPERTY_BRANCH_NAME, String.class,
			MY_CLASS);

	/**
	 * 获取-分支
	 * 
	 * @return 值
	 */
	@XmlElement(name = PROPERTY_BRANCH_NAME)
	public final String getBranch() {
		return this.getProperty(PROPERTY_BRANCH);
	}

	/**
	 * 设置-分支
	 * 
	 * @param value 值
	 */
	public final void setBranch(String value) {
		this.setProperty(PROPERTY_BRANCH, value);
	}

	/**
	 * 属性名称-销售贷项-行
	 */
	private static final String PROPERTY_SALESCREDITNOTEITEMS_NAME = "SalesCreditNoteItems";

	/**
	 * 销售贷项-行的集合属性
	 * 
	 */
	public static final IPropertyInfo<ISalesCreditNoteItems> PROPERTY_SALESCREDITNOTEITEMS = registerProperty(
			PROPERTY_SALESCREDITNOTEITEMS_NAME, ISalesCreditNoteItems.class, MY_CLASS);

	/**
	 * 获取-销售贷项-行集合
	 * 
	 * @return 值
	 */
	@XmlElementWrapper(name = PROPERTY_SALESCREDITNOTEITEMS_NAME)
	@XmlElement(name = SalesCreditNoteItem.BUSINESS_OBJECT_NAME, type = SalesCreditNoteItem.class)
	public final ISalesCreditNoteItems getSalesCreditNoteItems() {
		return this.getProperty(PROPERTY_SALESCREDITNOTEITEMS);
	}

	/**
	 * 设置-销售贷项-行集合
	 * 
	 * @param value 值
	 */
	public final void setSalesCreditNoteItems(ISalesCreditNoteItems value) {
		this.setProperty(PROPERTY_SALESCREDITNOTEITEMS, value);
	}

	/**
	 * 属性名称-送货地址
	 */
	private static final String PROPERTY_SHIPPINGADDRESSS_NAME = "ShippingAddresss";

	/**
	 * 送货地址的集合属性
	 * 
	 */
	public static final IPropertyInfo<IShippingAddresss> PROPERTY_SHIPPINGADDRESSS = registerProperty(
			PROPERTY_SHIPPINGADDRESSS_NAME, IShippingAddresss.class, MY_CLASS);

	/**
	 * 获取-送货地址集合
	 * 
	 * @return 值
	 */
	@XmlElementWrapper(name = PROPERTY_SHIPPINGADDRESSS_NAME)
	@XmlElement(name = ShippingAddress.BUSINESS_OBJECT_NAME, type = ShippingAddress.class)
	public final IShippingAddresss getShippingAddresss() {
		return this.getProperty(PROPERTY_SHIPPINGADDRESSS);
	}

	/**
	 * 设置-送货地址集合
	 * 
	 * @param value 值
	 */
	public final void setShippingAddresss(IShippingAddresss value) {
		this.setProperty(PROPERTY_SHIPPINGADDRESSS, value);
	}

	/**
	 * 初始化数据
	 */
	@Override
	protected void initialize() {
		super.initialize();// 基类初始化，不可去除
		this.setSalesCreditNoteItems(new SalesCreditNoteItems(this));
		this.setShippingAddresss(new ShippingAddresss(this));
		this.setObjectCode(MyConfiguration.applyVariables(BUSINESS_OBJECT_CODE));
		this.setPostingDate(DateTime.getToday());
		this.setDocumentDate(DateTime.getToday());
		this.setDeliveryDate(DateTime.getToday());
		this.setDocumentStatus(emDocumentStatus.RELEASED);
		this.setDiscount(Decimal.ONE);

	}

	/**
	 * 属性名称-项目的行总计
	 */
	private static final String PROPERTY_ITEMSLINETOTAL_NAME = "ItemsLineTotal";

	/**
	 * 项目的行总计 属性
	 */
	public static final IPropertyInfo<BigDecimal> PROPERTY_ITEMSLINETOTAL = registerProperty(
			PROPERTY_ITEMSLINETOTAL_NAME, BigDecimal.class, MY_CLASS);

	/**
	 * 获取-项目的行总计
	 * 
	 * @return 值
	 */
	public final BigDecimal getItemsLineTotal() {
		return this.getProperty(PROPERTY_ITEMSLINETOTAL);
	}

	/**
	 * 设置-项目的行总计
	 * 
	 * @param value 值
	 */
	final void setItemsLineTotal(BigDecimal value) {
		this.setProperty(PROPERTY_ITEMSLINETOTAL, value);
	}

	/**
	 * 属性名称-项目的行税总计
	 */
	private static final String PROPERTY_ITEMSTAXTOTAL_NAME = "ItemsTaxTotal";

	/**
	 * 项目的行税总计 属性
	 */
	public static final IPropertyInfo<BigDecimal> PROPERTY_ITEMSTAXTOTAL = registerProperty(PROPERTY_ITEMSTAXTOTAL_NAME,
			BigDecimal.class, MY_CLASS);

	/**
	 * 获取-项目的行税总计
	 * 
	 * @return 值
	 */
	public final BigDecimal getItemsTaxTotal() {
		return this.getProperty(PROPERTY_ITEMSTAXTOTAL);
	}

	/**
	 * 设置-项目的行税总计
	 * 
	 * @param value 值
	 */
	final void setItemsTaxTotal(BigDecimal value) {
		this.setProperty(PROPERTY_ITEMSTAXTOTAL, value);
	}

	/**
	 * 属性名称-运送费用总计
	 */
	private static final String PROPERTY_SHIPPINGSEXPENSETOTAL_NAME = "ShippingsExpenseTotal";

	/**
	 * 运送费用总计 属性
	 */
	public static final IPropertyInfo<BigDecimal> PROPERTY_SHIPPINGSEXPENSETOTAL = registerProperty(
			PROPERTY_SHIPPINGSEXPENSETOTAL_NAME, BigDecimal.class, MY_CLASS);

	/**
	 * 获取-运送费用总计
	 * 
	 * @return 值
	 */
	public final BigDecimal getShippingsExpenseTotal() {
		return this.getProperty(PROPERTY_SHIPPINGSEXPENSETOTAL);
	}

	/**
	 * 设置-运送费用总计
	 * 
	 * @param value 值
	 */
	final void setShippingsExpenseTotal(BigDecimal value) {
		this.setProperty(PROPERTY_SHIPPINGSEXPENSETOTAL, value);
	}

	/**
	 * 属性名称-运送税总计
	 */
	private static final String PROPERTY_SHIPPINGSTAXTOTAL_NAME = "ShippingsTaxTotal";

	/**
	 * 运送税总计 属性
	 */
	public static final IPropertyInfo<BigDecimal> PROPERTY_SHIPPINGSTAXTOTAL = registerProperty(
			PROPERTY_SHIPPINGSTAXTOTAL_NAME, BigDecimal.class, MY_CLASS);

	/**
	 * 获取-运送税总计
	 * 
	 * @return 值
	 */
	public final BigDecimal getShippingsTaxTotal() {
		return this.getProperty(PROPERTY_SHIPPINGSTAXTOTAL);
	}

	/**
	 * 设置-运送税总计
	 * 
	 * @param value 值
	 */
	final void setShippingsTaxTotal(BigDecimal value) {
		this.setProperty(PROPERTY_SHIPPINGSTAXTOTAL, value);
	}

	@Override
	protected IBusinessRule[] registerRules() {
		return new IBusinessRule[] {
				// 注册的业务规则
				new BusinessRuleRequired(PROPERTY_CUSTOMERCODE), // 要求有值
				new BusinessRuleMinValue<BigDecimal>(Decimal.ZERO, PROPERTY_DISCOUNT), // 不能低于0
				new BusinessRuleMinValue<BigDecimal>(Decimal.ZERO, PROPERTY_DOCUMENTRATE), // 不能低于0
				new BusinessRuleMinValue<BigDecimal>(Decimal.ZERO, PROPERTY_PAIDTOTAL), // 不能低于0
				new BusinessRuleRequiredElements(PROPERTY_SALESCREDITNOTEITEMS), // 要求有元素
				new BusinessRuleDocumentStatus(PROPERTY_DOCUMENTSTATUS, PROPERTY_SALESCREDITNOTEITEMS,
						SalesCreditNoteItem.PROPERTY_LINESTATUS), // 使用集合元素状态
				// 计算行-总计（含税）
				new BusinessRuleSumElements(PROPERTY_ITEMSLINETOTAL, PROPERTY_SALESCREDITNOTEITEMS,
						SalesCreditNoteItem.PROPERTY_LINETOTAL, new Predicate<SalesCreditNoteItem>() {
							// 过滤，产品套件子项的价格
							@Override
							public boolean test(SalesCreditNoteItem t) {
								if (t.getParentLineSign() != null && !t.getParentLineSign().isEmpty()) {
									return false;
								}
								return true;
							}
						}),
				// 计算行-税总计
				new BusinessRuleSumElements(PROPERTY_ITEMSTAXTOTAL, PROPERTY_SALESCREDITNOTEITEMS,
						SalesCreditNoteItem.PROPERTY_TAXTOTAL, new Predicate<SalesCreditNoteItem>() {
							// 过滤，产品套件子项的价格
							@Override
							public boolean test(SalesCreditNoteItem t) {
								if (t.getParentLineSign() != null && !t.getParentLineSign().isEmpty()) {
									return false;
								}
								return true;
							}
						}),
				// 计算运输-费用总计（含税）
				new BusinessRuleSumElements(PROPERTY_SHIPPINGSEXPENSETOTAL, PROPERTY_SHIPPINGADDRESSS,
						ShippingAddress.PROPERTY_EXPENSE),
				// 计算运输-税总计
				new BusinessRuleSumElements(PROPERTY_SHIPPINGSTAXTOTAL, PROPERTY_SHIPPINGADDRESSS,
						ShippingAddress.PROPERTY_TAXTOTAL),
				// 折扣后总计 = 项目-行总计 * 折扣
				new BusinessRuleDeductionDiscountTotal(PROPERTY_DISCOUNTTOTAL, PROPERTY_ITEMSLINETOTAL,
						PROPERTY_DISCOUNT),
				// 单据总计 = 折扣后总计（含税）+ 运输-总计（含税）
				new BusinessRuleDeductionDocumentTotal(PROPERTY_DOCUMENTTOTAL, PROPERTY_DISCOUNTTOTAL,
						PROPERTY_SHIPPINGSEXPENSETOTAL),
				new BusinessRuleMinValue<BigDecimal>(Decimal.ZERO, PROPERTY_DISCOUNTTOTAL), // 不能低于0
				new BusinessRuleMinValue<BigDecimal>(Decimal.ZERO, PROPERTY_DOCUMENTTOTAL), // 不能低于0

		};
	}

	@Override
	public void reset() {
		super.reset();
		this.setPaidTotal(Decimal.ZERO);
		this.setDocumentStatus(emDocumentStatus.RELEASED);
		this.getSalesCreditNoteItems().forEach(c -> c.setLineStatus(emDocumentStatus.RELEASED));
	}

	@Override
	public void setSeriesValue(Object value) {
		this.setDocNum(String.valueOf(value));
	}

	@Override
	public IBusinessLogicContract[] getContracts() {
		return new IBusinessLogicContract[] {
				// 检查客户
				new ICustomerCheckContract() {
					@Override
					public String getIdentifiers() {
						return SalesCreditNote.this.getIdentifiers();
					}

					@Override
					public String getCustomerCode() {
						return SalesCreditNote.this.getCustomerCode();
					}
				},
				// 分支检查
				new IBranchCheckContract() {

					@Override
					public String getIdentifiers() {
						return SalesCreditNote.this.toString();
					}

					@Override
					public String getBranch() {
						return SalesCreditNote.this.getBranch();
					}
				},
				// 创建分录
				new IJournalEntryCreationContract() {

					@Override
					public String getIdentifiers() {
						return SalesCreditNote.this.toString();
					}

					@Override
					public String getBranch() {
						return SalesCreditNote.this.getBranch();
					}

					@Override
					public String getBaseDocumentType() {
						return SalesCreditNote.this.getObjectCode();
					}

					@Override
					public Integer getBaseDocumentEntry() {
						return SalesCreditNote.this.getDocEntry();
					}

					@Override
					public DateTime getDocumentDate() {
						return SalesCreditNote.this.getDocumentDate();
					}

					@Override
					public String getReference1() {
						return SalesCreditNote.this.getReference1();
					}

					@Override
					public String getReference2() {
						return SalesCreditNote.this.getReference2();
					}

					@Override
					public JournalEntryContent[] getContents() {
						JournalEntryContent jeContent;
						List<JournalEntryContent> jeContents = new ArrayList<>();
						String SalesReturnCode = MyConfiguration.applyVariables(SalesReturn.BUSINESS_OBJECT_CODE),
								SalesInvoiceCode = MyConfiguration.applyVariables(SalesInvoice.BUSINESS_OBJECT_CODE);
						for (ISalesCreditNoteItem line : SalesCreditNote.this.getSalesCreditNoteItems()) {
							if (SalesReturnCode.equals(line.getBaseDocumentType())) {
								/** 基于退货 **/
								// 销售成本科目
								jeContent = new SalesCreditNoteMaterialsCost(line);
								jeContent.setCategory(Category.Debit);
								jeContent.setLedger(Ledgers.LEDGER_SALES_COST_OF_GOODS_SOLD_ACCOUNT);
								jeContent.setAmount(Decimal.ZERO);// 待计算
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
								// 已装载货物科目
								jeContent = new SalesCreditNoteReturnMaterialsCost(line);
								jeContent.setCategory(Category.Credit);
								jeContent.setLedger(Ledgers.LEDGER_SALES_SHIPPED_GOODS_ACCOUNT);
								jeContent.setAmount(Decimal.ZERO);// 待计算
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
								// 销售贷方科目
								jeContent = new JournalEntrySmartContent(line);
								jeContent.setCategory(Category.Credit);
								jeContent.setLedger(Ledgers.LEDGER_SALES_SALES_CREDIT_ACCOUNT);
								jeContent.setAmount(line.getPreTaxLineTotal().negate());// 税前总计
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
								// 销项税
								jeContent = new JournalEntrySmartContent(line);
								jeContent.setCategory(Category.Credit);
								jeContent.setLedger(Ledgers.LEDGER_COMMON_OUTPUT_TAX_ACCOUNT);
								jeContent.setAmount(line.getTaxTotal().negate());// 税总计
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
							} else if (SalesInvoiceCode.equals(line.getBaseDocumentType())) {
								/** 基于发票 **/
								// 销售成本科目
								jeContent = new SalesCreditNoteInvoiceMaterialsCost(line);
								jeContent.setCategory(Category.Debit);
								jeContent.setLedger(Ledgers.LEDGER_SALES_COST_OF_GOODS_SOLD_ACCOUNT);
								jeContent.setAmount(Decimal.ZERO);// 待计算
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
								// 销售退货科目
								jeContent = new SalesCreditNoteInvoiceMaterialsCost(line);
								jeContent.setCategory(Category.Credit);
								jeContent.setLedger(Ledgers.LEDGER_SALES_SALES_RETURNS_ACCOUNT);
								jeContent.setAmount(Decimal.ZERO);// 待计算
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
								// 销售贷方科目
								jeContent = new JournalEntrySmartContent(line);
								jeContent.setCategory(Category.Credit);
								jeContent.setLedger(Ledgers.LEDGER_SALES_SALES_CREDIT_ACCOUNT);
								jeContent.setAmount(line.getPreTaxLineTotal().negate());// 税前总计
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
								// 销项税
								jeContent = new JournalEntrySmartContent(line);
								jeContent.setCategory(Category.Credit);
								jeContent.setLedger(Ledgers.LEDGER_COMMON_OUTPUT_TAX_ACCOUNT);
								jeContent.setAmount(line.getTaxTotal().negate());// 税总计
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
							} else {
								/** 不基于单据 **/
								// 销售成本科目
								jeContent = new SalesCreditNoteMaterialsCost(line);
								jeContent.setCategory(Category.Debit);
								jeContent.setLedger(Ledgers.LEDGER_SALES_COST_OF_GOODS_SOLD_ACCOUNT);
								jeContent.setAmount(Decimal.ZERO);// 待计算
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
								// 销售退货科目
								jeContent = new SalesCreditNoteMaterialsCost(line);
								jeContent.setCategory(Category.Credit);
								jeContent.setLedger(Ledgers.LEDGER_SALES_SALES_RETURNS_ACCOUNT);
								jeContent.setAmount(Decimal.ZERO);// 待计算
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
								// 销售贷方科目
								jeContent = new JournalEntrySmartContent(line);
								jeContent.setCategory(Category.Credit);
								jeContent.setLedger(Ledgers.LEDGER_SALES_SALES_CREDIT_ACCOUNT);
								jeContent.setAmount(line.getPreTaxLineTotal().negate());// 税前总计
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
								// 销项税
								jeContent = new JournalEntrySmartContent(line);
								jeContent.setCategory(Category.Credit);
								jeContent.setLedger(Ledgers.LEDGER_COMMON_OUTPUT_TAX_ACCOUNT);
								jeContent.setAmount(line.getTaxTotal().negate());// 税总计
								jeContent.setCurrency(line.getCurrency());
								jeContents.add(jeContent);
							}
						}
						// 应收科目
						jeContent = new JournalEntrySmartContent(SalesCreditNote.this);
						jeContent.setCategory(Category.Debit);
						jeContent.setLedger(Ledgers.LEDGER_SALES_DOMESTIC_ACCOUNTS_RECEIVABLE);
						jeContent.setAmount(SalesCreditNote.this.getDocumentTotal().negate());
						jeContent.setCurrency(SalesCreditNote.this.getDocumentCurrency());
						jeContents.add(jeContent);
						return jeContents.toArray(new JournalEntryContent[] {});
					}
				}

		};
	}

}
