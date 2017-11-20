package org.colorcoding.ibas.sales.bo.salesdelivery;

import org.colorcoding.ibas.bobas.bo.IBODocument;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.data.emApprovalStatus;
import org.colorcoding.ibas.bobas.data.emBOStatus;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;

/**
 * 销售交货 接口
 * 
 */
public interface ISalesDelivery extends IBODocument {

	/**
	 * 获取-凭证编号
	 * 
	 * @return 值
	 */
	Integer getDocEntry();

	/**
	 * 设置-凭证编号
	 * 
	 * @param value
	 *            值
	 */
	void setDocEntry(Integer value);

	/**
	 * 获取-期间编号
	 * 
	 * @return 值
	 */
	Integer getDocNum();

	/**
	 * 设置-期间编号
	 * 
	 * @param value
	 *            值
	 */
	void setDocNum(Integer value);

	/**
	 * 获取-期间
	 * 
	 * @return 值
	 */
	Integer getPeriod();

	/**
	 * 设置-期间
	 * 
	 * @param value
	 *            值
	 */
	void setPeriod(Integer value);

	/**
	 * 获取-取消
	 * 
	 * @return 值
	 */
	emYesNo getCanceled();

	/**
	 * 设置-取消
	 * 
	 * @param value
	 *            值
	 */
	void setCanceled(emYesNo value);

	/**
	 * 获取-状态
	 * 
	 * @return 值
	 */
	emBOStatus getStatus();

	/**
	 * 设置-状态
	 * 
	 * @param value
	 *            值
	 */
	void setStatus(emBOStatus value);

	/**
	 * 获取-审批状态
	 * 
	 * @return 值
	 */
	emApprovalStatus getApprovalStatus();

	/**
	 * 设置-审批状态
	 * 
	 * @param value
	 *            值
	 */
	void setApprovalStatus(emApprovalStatus value);

	/**
	 * 获取-单据状态
	 * 
	 * @return 值
	 */
	emDocumentStatus getDocumentStatus();

	/**
	 * 设置-单据状态
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentStatus(emDocumentStatus value);

	/**
	 * 获取-对象类型
	 * 
	 * @return 值
	 */
	String getObjectCode();

	/**
	 * 设置-对象类型
	 * 
	 * @param value
	 *            值
	 */
	void setObjectCode(String value);

	/**
	 * 获取-创建日期
	 * 
	 * @return 值
	 */
	DateTime getCreateDate();

	/**
	 * 设置-创建日期
	 * 
	 * @param value
	 *            值
	 */
	void setCreateDate(DateTime value);

	/**
	 * 获取-创建时间
	 * 
	 * @return 值
	 */
	Short getCreateTime();

	/**
	 * 设置-创建时间
	 * 
	 * @param value
	 *            值
	 */
	void setCreateTime(Short value);

	/**
	 * 获取-修改日期
	 * 
	 * @return 值
	 */
	DateTime getUpdateDate();

	/**
	 * 设置-修改日期
	 * 
	 * @param value
	 *            值
	 */
	void setUpdateDate(DateTime value);

	/**
	 * 获取-修改时间
	 * 
	 * @return 值
	 */
	Short getUpdateTime();

	/**
	 * 设置-修改时间
	 * 
	 * @param value
	 *            值
	 */
	void setUpdateTime(Short value);

	/**
	 * 获取-版本
	 * 
	 * @return 值
	 */
	Integer getLogInst();

	/**
	 * 设置-版本
	 * 
	 * @param value
	 *            值
	 */
	void setLogInst(Integer value);

	/**
	 * 获取-服务系列
	 * 
	 * @return 值
	 */
	Integer getSeries();

	/**
	 * 设置-服务系列
	 * 
	 * @param value
	 *            值
	 */
	void setSeries(Integer value);

	/**
	 * 获取-数据源
	 * 
	 * @return 值
	 */
	String getDataSource();

	/**
	 * 设置-数据源
	 * 
	 * @param value
	 *            值
	 */
	void setDataSource(String value);

	/**
	 * 获取-创建用户
	 * 
	 * @return 值
	 */
	Integer getCreateUserSign();

	/**
	 * 设置-创建用户
	 * 
	 * @param value
	 *            值
	 */
	void setCreateUserSign(Integer value);

	/**
	 * 获取-修改用户
	 * 
	 * @return 值
	 */
	Integer getUpdateUserSign();

	/**
	 * 设置-修改用户
	 * 
	 * @param value
	 *            值
	 */
	void setUpdateUserSign(Integer value);

	/**
	 * 获取-创建动作标识
	 * 
	 * @return 值
	 */
	String getCreateActionId();

	/**
	 * 设置-创建动作标识
	 * 
	 * @param value
	 *            值
	 */
	void setCreateActionId(String value);

	/**
	 * 获取-更新动作标识
	 * 
	 * @return 值
	 */
	String getUpdateActionId();

	/**
	 * 设置-更新动作标识
	 * 
	 * @param value
	 *            值
	 */
	void setUpdateActionId(String value);

	/**
	 * 获取-数据所有者
	 * 
	 * @return 值
	 */
	Integer getDataOwner();

	/**
	 * 设置-数据所有者
	 * 
	 * @param value
	 *            值
	 */
	void setDataOwner(Integer value);

	/**
	 * 获取-团队成员
	 * 
	 * @return 值
	 */
	String getTeamMembers();

	/**
	 * 设置-团队成员
	 * 
	 * @param value
	 *            值
	 */
	void setTeamMembers(String value);

	/**
	 * 获取-数据所属组织
	 * 
	 * @return 值
	 */
	String getOrganization();

	/**
	 * 设置-数据所属组织
	 * 
	 * @param value
	 *            值
	 */
	void setOrganization(String value);

	/**
	 * 获取-过账日期
	 * 
	 * @return 值
	 */
	DateTime getPostingDate();

	/**
	 * 设置-过账日期
	 * 
	 * @param value
	 *            值
	 */
	void setPostingDate(DateTime value);

	/**
	 * 获取-到期日
	 * 
	 * @return 值
	 */
	DateTime getDeliveryDate();

	/**
	 * 设置-到期日
	 * 
	 * @param value
	 *            值
	 */
	void setDeliveryDate(DateTime value);

	/**
	 * 获取-凭证日期
	 * 
	 * @return 值
	 */
	DateTime getDocumentDate();

	/**
	 * 设置-凭证日期
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentDate(DateTime value);

	/**
	 * 获取-参考1
	 * 
	 * @return 值
	 */
	String getReference1();

	/**
	 * 设置-参考1
	 * 
	 * @param value
	 *            值
	 */
	void setReference1(String value);

	/**
	 * 获取-参考2
	 * 
	 * @return 值
	 */
	String getReference2();

	/**
	 * 设置-参考2
	 * 
	 * @param value
	 *            值
	 */
	void setReference2(String value);

	/**
	 * 获取-备注
	 * 
	 * @return 值
	 */
	String getRemarks();

	/**
	 * 设置-备注
	 * 
	 * @param value
	 *            值
	 */
	void setRemarks(String value);

	/**
	 * 获取-已引用
	 * 
	 * @return 值
	 */
	emYesNo getReferenced();

	/**
	 * 设置-已引用
	 * 
	 * @param value
	 *            值
	 */
	void setReferenced(emYesNo value);

	/**
	 * 获取-已删除
	 * 
	 * @return 值
	 */
	emYesNo getDeleted();

	/**
	 * 设置-已删除
	 * 
	 * @param value
	 *            值
	 */
	void setDeleted(emYesNo value);

	/**
	 * 获取-客户代码
	 * 
	 * @return 值
	 */
	String getCustomerCode();

	/**
	 * 设置-客户代码
	 * 
	 * @param value
	 *            值
	 */
	void setCustomerCode(String value);

	/**
	 * 获取-客户名称
	 * 
	 * @return 值
	 */
	String getCustomerName();

	/**
	 * 设置-客户名称
	 * 
	 * @param value
	 *            值
	 */
	void setCustomerName(String value);

	/**
	 * 获取-联系人
	 * 
	 * @return 值
	 */
	Integer getContactPerson();

	/**
	 * 设置-联系人
	 * 
	 * @param value
	 *            值
	 */
	void setContactPerson(Integer value);

	/**
	 * 获取-税率
	 * 
	 * @return 值
	 */
	Decimal getTaxRate();

	/**
	 * 设置-税率
	 * 
	 * @param value
	 *            值
	 */
	void setTaxRate(Decimal value);

	/**
	 * 设置-税率
	 * 
	 * @param value
	 *            值
	 */
	void setTaxRate(String value);

	/**
	 * 设置-税率
	 * 
	 * @param value
	 *            值
	 */
	void setTaxRate(int value);

	/**
	 * 设置-税率
	 * 
	 * @param value
	 *            值
	 */
	void setTaxRate(double value);

	/**
	 * 获取-税总额
	 * 
	 * @return 值
	 */
	Decimal getTaxTotal();

	/**
	 * 设置-税总额
	 * 
	 * @param value
	 *            值
	 */
	void setTaxTotal(Decimal value);

	/**
	 * 设置-税总额
	 * 
	 * @param value
	 *            值
	 */
	void setTaxTotal(String value);

	/**
	 * 设置-税总额
	 * 
	 * @param value
	 *            值
	 */
	void setTaxTotal(int value);

	/**
	 * 设置-税总额
	 * 
	 * @param value
	 *            值
	 */
	void setTaxTotal(double value);

	/**
	 * 获取-折扣
	 * 
	 * @return 值
	 */
	Decimal getDiscount();

	/**
	 * 设置-折扣
	 * 
	 * @param value
	 *            值
	 */
	void setDiscount(Decimal value);

	/**
	 * 设置-折扣
	 * 
	 * @param value
	 *            值
	 */
	void setDiscount(String value);

	/**
	 * 设置-折扣
	 * 
	 * @param value
	 *            值
	 */
	void setDiscount(int value);

	/**
	 * 设置-折扣
	 * 
	 * @param value
	 *            值
	 */
	void setDiscount(double value);

	/**
	 * 获取-折扣总计
	 * 
	 * @return 值
	 */
	Decimal getDiscountTotal();

	/**
	 * 设置-折扣总计
	 * 
	 * @param value
	 *            值
	 */
	void setDiscountTotal(Decimal value);

	/**
	 * 设置-折扣总计
	 * 
	 * @param value
	 *            值
	 */
	void setDiscountTotal(String value);

	/**
	 * 设置-折扣总计
	 * 
	 * @param value
	 *            值
	 */
	void setDiscountTotal(int value);

	/**
	 * 设置-折扣总计
	 * 
	 * @param value
	 *            值
	 */
	void setDiscountTotal(double value);

	/**
	 * 获取-单据货币
	 * 
	 * @return 值
	 */
	String getDocumentCurrency();

	/**
	 * 设置-单据货币
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentCurrency(String value);

	/**
	 * 获取-单据交换率
	 * 
	 * @return 值
	 */
	Decimal getDocumentRate();

	/**
	 * 设置-单据交换率
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentRate(Decimal value);

	/**
	 * 设置-单据交换率
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentRate(String value);

	/**
	 * 设置-单据交换率
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentRate(int value);

	/**
	 * 设置-单据交换率
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentRate(double value);

	/**
	 * 获取-单据总计
	 * 
	 * @return 值
	 */
	Decimal getDocumentTotal();

	/**
	 * 设置-单据总计
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentTotal(Decimal value);

	/**
	 * 设置-单据总计
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentTotal(String value);

	/**
	 * 设置-单据总计
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentTotal(int value);

	/**
	 * 设置-单据总计
	 * 
	 * @param value
	 *            值
	 */
	void setDocumentTotal(double value);

	/**
	 * 获取-已付款总计
	 * 
	 * @return 值
	 */
	Decimal getPaidTotal();

	/**
	 * 设置-已付款总计
	 * 
	 * @param value
	 *            值
	 */
	void setPaidTotal(Decimal value);

	/**
	 * 设置-已付款总计
	 * 
	 * @param value
	 *            值
	 */
	void setPaidTotal(String value);

	/**
	 * 设置-已付款总计
	 * 
	 * @param value
	 *            值
	 */
	void setPaidTotal(int value);

	/**
	 * 设置-已付款总计
	 * 
	 * @param value
	 *            值
	 */
	void setPaidTotal(double value);

	/**
	 * 获取-毛利
	 * 
	 * @return 值
	 */
	Decimal getGrossProfit();

	/**
	 * 设置-毛利
	 * 
	 * @param value
	 *            值
	 */
	void setGrossProfit(Decimal value);

	/**
	 * 设置-毛利
	 * 
	 * @param value
	 *            值
	 */
	void setGrossProfit(String value);

	/**
	 * 设置-毛利
	 * 
	 * @param value
	 *            值
	 */
	void setGrossProfit(int value);

	/**
	 * 设置-毛利
	 * 
	 * @param value
	 *            值
	 */
	void setGrossProfit(double value);

	/**
	 * 获取-毛利价格清单
	 * 
	 * @return 值
	 */
	Integer getGrossProfitPriceList();

	/**
	 * 设置-毛利价格清单
	 * 
	 * @param value
	 *            值
	 */
	void setGrossProfitPriceList(Integer value);

	/**
	 * 获取-付款条款代码
	 * 
	 * @return 值
	 */
	String getPaymentCode();

	/**
	 * 设置-付款条款代码
	 * 
	 * @param value
	 *            值
	 */
	void setPaymentCode(String value);

	/**
	 * 获取-舍入
	 * 
	 * @return 值
	 */
	emYesNo getRounding();

	/**
	 * 设置-舍入
	 * 
	 * @param value
	 *            值
	 */
	void setRounding(emYesNo value);

	/**
	 * 获取-舍入差额
	 * 
	 * @return 值
	 */
	Decimal getDiffAmount();

	/**
	 * 设置-舍入差额
	 * 
	 * @param value
	 *            值
	 */
	void setDiffAmount(Decimal value);

	/**
	 * 设置-舍入差额
	 * 
	 * @param value
	 *            值
	 */
	void setDiffAmount(String value);

	/**
	 * 设置-舍入差额
	 * 
	 * @param value
	 *            值
	 */
	void setDiffAmount(int value);

	/**
	 * 设置-舍入差额
	 * 
	 * @param value
	 *            值
	 */
	void setDiffAmount(double value);

	/**
	 * 获取-项目代码
	 * 
	 * @return 值
	 */
	String getProject();

	/**
	 * 设置-项目代码
	 * 
	 * @param value
	 *            值
	 */
	void setProject(String value);

	/**
	 * 获取-收货人
	 * 
	 * @return 值
	 */
	String getConsignee();

	/**
	 * 设置-收货人
	 * 
	 * @param value
	 *            值
	 */
	void setConsignee(String value);

	/**
	 * 获取-联系电话
	 * 
	 * @return 值
	 */
	String getPhone();

	/**
	 * 设置-联系电话
	 * 
	 * @param value
	 *            值
	 */
	void setPhone(String value);

	/**
	 * 获取-省
	 * 
	 * @return 值
	 */
	String getProvince();

	/**
	 * 设置-省
	 * 
	 * @param value
	 *            值
	 */
	void setProvince(String value);

	/**
	 * 获取-市
	 * 
	 * @return 值
	 */
	String getCity();

	/**
	 * 设置-市
	 * 
	 * @param value
	 *            值
	 */
	void setCity(String value);

	/**
	 * 获取-县/区
	 * 
	 * @return 值
	 */
	String getCounty();

	/**
	 * 设置-县/区
	 * 
	 * @param value
	 *            值
	 */
	void setCounty(String value);

	/**
	 * 获取-地址
	 * 
	 * @return 值
	 */
	String getAddress();

	/**
	 * 设置-地址
	 * 
	 * @param value
	 *            值
	 */
	void setAddress(String value);

	/**
	 * 获取-销售交货-行集合
	 * 
	 * @return 值
	 */
	ISalesDeliveryItems getSalesDeliveryItems();

	/**
	 * 设置-销售交货-行集合
	 * 
	 * @param value
	 *            值
	 */
	void setSalesDeliveryItems(ISalesDeliveryItems value);

}
