package org.colorcoding.ibas.sales.bo.salesdelivery;

import org.colorcoding.ibas.bobas.bo.IBODocumentLine;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.data.emBOStatus;
import org.colorcoding.ibas.bobas.data.emDocumentStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.materials.data.emItemType;
import org.colorcoding.ibas.sales.data.emProductTreeType;



/**
 * 销售交货-行 接口
 * 
 */
public interface ISalesDeliveryItem extends IBODocumentLine {

	/**
	 * 获取-编码
	 * 
	 * @return 值
	 */
	Integer getDocEntry();

	/**
	 * 设置-编码
	 * 
	 * @param value
	 *            值
	 */
	void setDocEntry(Integer value);

	/**
	 * 获取-行号
	 * 
	 * @return 值
	 */
	Integer getLineId();

	/**
	 * 设置-行号
	 * 
	 * @param value
	 *            值
	 */
	void setLineId(Integer value);

	/**
	 * 获取-显示顺序
	 * 
	 * @return 值
	 */
	Integer getVisOrder();

	/**
	 * 设置-显示顺序
	 * 
	 * @param value
	 *            值
	 */
	void setVisOrder(Integer value);

	/**
	 * 获取-类型
	 * 
	 * @return 值
	 */
	String getObjectCode();

	/**
	 * 设置-类型
	 * 
	 * @param value
	 *            值
	 */
	void setObjectCode(String value);

	/**
	 * 获取-实例号（版本）
	 * 
	 * @return 值
	 */
	Integer getLogInst();

	/**
	 * 设置-实例号（版本）
	 * 
	 * @param value
	 *            值
	 */
	void setLogInst(Integer value);

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
	 * 获取-单据状态
	 * 
	 * @return 值
	 */
	emDocumentStatus getLineStatus();

	/**
	 * 设置-单据状态
	 * 
	 * @param value
	 *            值
	 */
	void setLineStatus(emDocumentStatus value);

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
	 * 获取-基于类型
	 * 
	 * @return 值
	 */
	String getBaseDocumentType();

	/**
	 * 设置-基于类型
	 * 
	 * @param value
	 *            值
	 */
	void setBaseDocumentType(String value);

	/**
	 * 获取-基于标识
	 * 
	 * @return 值
	 */
	Integer getBaseDocumentEntry();

	/**
	 * 设置-基于标识
	 * 
	 * @param value
	 *            值
	 */
	void setBaseDocumentEntry(Integer value);

	/**
	 * 获取-基于行号
	 * 
	 * @return 值
	 */
	Integer getBaseDocumentLineId();

	/**
	 * 设置-基于行号
	 * 
	 * @param value
	 *            值
	 */
	void setBaseDocumentLineId(Integer value);

	/**
	 * 获取-原始类型
	 * 
	 * @return 值
	 */
	String getOriginalDocumentType();

	/**
	 * 设置-原始类型
	 * 
	 * @param value
	 *            值
	 */
	void setOriginalDocumentType(String value);

	/**
	 * 获取-原始标识
	 * 
	 * @return 值
	 */
	Integer getOriginalDocumentEntry();

	/**
	 * 设置-原始标识
	 * 
	 * @param value
	 *            值
	 */
	void setOriginalDocumentEntry(Integer value);

	/**
	 * 获取-原始行号
	 * 
	 * @return 值
	 */
	Integer getOriginalDocumentLineId();

	/**
	 * 设置-原始行号
	 * 
	 * @param value
	 *            值
	 */
	void setOriginalDocumentLineId(Integer value);

	/**
	 * 获取-产品编号
	 * 
	 * @return 值
	 */
	String getItemCode();

	/**
	 * 设置-产品编号
	 * 
	 * @param value
	 *            值
	 */
	void setItemCode(String value);

	/**
	 * 获取-产品/服务描述
	 * 
	 * @return 值
	 */
	String getItemDescription();

	/**
	 * 设置-产品/服务描述
	 * 
	 * @param value
	 *            值
	 */
	void setItemDescription(String value);

	/**
	 * 获取-产品类型
	 * 
	 * @return 值
	 */
	emItemType getItemType();

	/**
	 * 设置-产品类型
	 * 
	 * @param value
	 *            值
	 */
	void setItemType(emItemType value);

	/**
	 * 获取-序号管理
	 * 
	 * @return 值
	 */
	emYesNo getSerialManagement();

	/**
	 * 设置-序号管理
	 * 
	 * @param value
	 *            值
	 */
	void setSerialManagement(emYesNo value);

	/**
	 * 获取-批号管理
	 * 
	 * @return 值
	 */
	emYesNo getBatchManagement();

	/**
	 * 设置-批号管理
	 * 
	 * @param value
	 *            值
	 */
	void setBatchManagement(emYesNo value);

	/**
	 * 获取-数量
	 * 
	 * @return 值
	 */
	Decimal getQuantity();

	/**
	 * 设置-数量
	 * 
	 * @param value
	 *            值
	 */
	void setQuantity(Decimal value);

	/**
	 * 设置-数量
	 * 
	 * @param value
	 *            值
	 */
	void setQuantity(String value);

	/**
	 * 设置-数量
	 * 
	 * @param value
	 *            值
	 */
	void setQuantity(int value);

	/**
	 * 设置-数量
	 * 
	 * @param value
	 *            值
	 */
	void setQuantity(double value);

	/**
	 * 获取-计量单位
	 * 
	 * @return 值
	 */
	String getUOM();

	/**
	 * 设置-计量单位
	 * 
	 * @param value
	 *            值
	 */
	void setUOM(String value);

	/**
	 * 获取-仓库
	 * 
	 * @return 值
	 */
	String getWarehouse();

	/**
	 * 设置-仓库
	 * 
	 * @param value
	 *            值
	 */
	void setWarehouse(String value);

	/**
	 * 获取-价格
	 * 
	 * @return 值
	 */
	Decimal getPrice();

	/**
	 * 设置-价格
	 * 
	 * @param value
	 *            值
	 */
	void setPrice(Decimal value);

	/**
	 * 设置-价格
	 * 
	 * @param value
	 *            值
	 */
	void setPrice(String value);

	/**
	 * 设置-价格
	 * 
	 * @param value
	 *            值
	 */
	void setPrice(int value);

	/**
	 * 设置-价格
	 * 
	 * @param value
	 *            值
	 */
	void setPrice(double value);

	/**
	 * 获取-货币
	 * 
	 * @return 值
	 */
	String getCurrency();

	/**
	 * 设置-货币
	 * 
	 * @param value
	 *            值
	 */
	void setCurrency(String value);

	/**
	 * 获取-汇率
	 * 
	 * @return 值
	 */
	Decimal getRate();

	/**
	 * 设置-汇率
	 * 
	 * @param value
	 *            值
	 */
	void setRate(Decimal value);

	/**
	 * 设置-汇率
	 * 
	 * @param value
	 *            值
	 */
	void setRate(String value);

	/**
	 * 设置-汇率
	 * 
	 * @param value
	 *            值
	 */
	void setRate(int value);

	/**
	 * 设置-汇率
	 * 
	 * @param value
	 *            值
	 */
	void setRate(double value);

	/**
	 * 获取-行总计
	 * 
	 * @return 值
	 */
	Decimal getLineTotal();

	/**
	 * 设置-行总计
	 * 
	 * @param value
	 *            值
	 */
	void setLineTotal(Decimal value);

	/**
	 * 设置-行总计
	 * 
	 * @param value
	 *            值
	 */
	void setLineTotal(String value);

	/**
	 * 设置-行总计
	 * 
	 * @param value
	 *            值
	 */
	void setLineTotal(int value);

	/**
	 * 设置-行总计
	 * 
	 * @param value
	 *            值
	 */
	void setLineTotal(double value);

	/**
	 * 获取-行交货日期
	 * 
	 * @return 值
	 */
	DateTime getDeliveryDate();

	/**
	 * 设置-行交货日期
	 * 
	 * @param value
	 *            值
	 */
	void setDeliveryDate(DateTime value);

	/**
	 * 获取-剩余未清数量
	 * 
	 * @return 值
	 */
	Decimal getOpenQuantity();

	/**
	 * 设置-剩余未清数量
	 * 
	 * @param value
	 *            值
	 */
	void setOpenQuantity(Decimal value);

	/**
	 * 设置-剩余未清数量
	 * 
	 * @param value
	 *            值
	 */
	void setOpenQuantity(String value);

	/**
	 * 设置-剩余未清数量
	 * 
	 * @param value
	 *            值
	 */
	void setOpenQuantity(int value);

	/**
	 * 设置-剩余未清数量
	 * 
	 * @param value
	 *            值
	 */
	void setOpenQuantity(double value);

	/**
	 * 获取-行折扣
	 * 
	 * @return 值
	 */
	Decimal getDiscount();

	/**
	 * 设置-行折扣
	 * 
	 * @param value
	 *            值
	 */
	void setDiscount(Decimal value);

	/**
	 * 设置-行折扣
	 * 
	 * @param value
	 *            值
	 */
	void setDiscount(String value);

	/**
	 * 设置-行折扣
	 * 
	 * @param value
	 *            值
	 */
	void setDiscount(int value);

	/**
	 * 设置-行折扣
	 * 
	 * @param value
	 *            值
	 */
	void setDiscount(double value);

	/**
	 * 获取-未清金额
	 * 
	 * @return 值
	 */
	Decimal getOpenAmount();

	/**
	 * 设置-未清金额
	 * 
	 * @param value
	 *            值
	 */
	void setOpenAmount(Decimal value);

	/**
	 * 设置-未清金额
	 * 
	 * @param value
	 *            值
	 */
	void setOpenAmount(String value);

	/**
	 * 设置-未清金额
	 * 
	 * @param value
	 *            值
	 */
	void setOpenAmount(int value);

	/**
	 * 设置-未清金额
	 * 
	 * @param value
	 *            值
	 */
	void setOpenAmount(double value);

	/**
	 * 获取-产品类型
	 * 
	 * @return 值
	 */
	emProductTreeType getTreeType();

	/**
	 * 设置-产品类型
	 * 
	 * @param value
	 *            值
	 */
	void setTreeType(emProductTreeType value);

	/**
	 * 获取-基础数量
	 * 
	 * @return 值
	 */
	Decimal getBasisQuantity();

	/**
	 * 设置-基础数量
	 * 
	 * @param value
	 *            值
	 */
	void setBasisQuantity(Decimal value);

	/**
	 * 设置-基础数量
	 * 
	 * @param value
	 *            值
	 */
	void setBasisQuantity(String value);

	/**
	 * 设置-基础数量
	 * 
	 * @param value
	 *            值
	 */
	void setBasisQuantity(int value);

	/**
	 * 设置-基础数量
	 * 
	 * @param value
	 *            值
	 */
	void setBasisQuantity(double value);

	/**
	 * 获取-行标志号
	 * 
	 * @return 值
	 */
	String getLineSign();

	/**
	 * 设置-行标志号
	 * 
	 * @param value
	 *            值
	 */
	void setLineSign(String value);

	/**
	 * 获取-父项行标志号
	 * 
	 * @return 值
	 */
	String getParentLineSign();

	/**
	 * 设置-父项行标志号
	 * 
	 * @param value
	 *            值
	 */
	void setParentLineSign(String value);

	/**
	 * 获取-科目代码
	 * 
	 * @return 值
	 */
	String getAccountCode();

	/**
	 * 设置-科目代码
	 * 
	 * @param value
	 *            值
	 */
	void setAccountCode(String value);

	/**
	 * 获取-折扣前价格
	 * 
	 * @return 值
	 */
	Decimal getUnitPrice();

	/**
	 * 设置-折扣前价格
	 * 
	 * @param value
	 *            值
	 */
	void setUnitPrice(Decimal value);

	/**
	 * 设置-折扣前价格
	 * 
	 * @param value
	 *            值
	 */
	void setUnitPrice(String value);

	/**
	 * 设置-折扣前价格
	 * 
	 * @param value
	 *            值
	 */
	void setUnitPrice(int value);

	/**
	 * 设置-折扣前价格
	 * 
	 * @param value
	 *            值
	 */
	void setUnitPrice(double value);

	/**
	 * 获取-税定义
	 * 
	 * @return 值
	 */
	String getTax();

	/**
	 * 设置-税定义
	 * 
	 * @param value
	 *            值
	 */
	void setTax(String value);

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
	 * 获取-毛价
	 * 
	 * @return 值
	 */
	Decimal getGrossPrice();

	/**
	 * 设置-毛价
	 * 
	 * @param value
	 *            值
	 */
	void setGrossPrice(Decimal value);

	/**
	 * 设置-毛价
	 * 
	 * @param value
	 *            值
	 */
	void setGrossPrice(String value);

	/**
	 * 设置-毛价
	 * 
	 * @param value
	 *            值
	 */
	void setGrossPrice(int value);

	/**
	 * 设置-毛价
	 * 
	 * @param value
	 *            值
	 */
	void setGrossPrice(double value);

	/**
	 * 获取-毛总额
	 * 
	 * @return 值
	 */
	Decimal getGrossTotal();

	/**
	 * 设置-毛总额
	 * 
	 * @param value
	 *            值
	 */
	void setGrossTotal(Decimal value);

	/**
	 * 设置-毛总额
	 * 
	 * @param value
	 *            值
	 */
	void setGrossTotal(String value);

	/**
	 * 设置-毛总额
	 * 
	 * @param value
	 *            值
	 */
	void setGrossTotal(int value);

	/**
	 * 设置-毛总额
	 * 
	 * @param value
	 *            值
	 */
	void setGrossTotal(double value);

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
	 * 获取-分配规则1
	 * 
	 * @return 值
	 */
	String getDistributionRule1();

	/**
	 * 设置-分配规则1
	 * 
	 * @param value
	 *            值
	 */
	void setDistributionRule1(String value);

	/**
	 * 获取-分配规则2
	 * 
	 * @return 值
	 */
	String getDistributionRule2();

	/**
	 * 设置-分配规则2
	 * 
	 * @param value
	 *            值
	 */
	void setDistributionRule2(String value);

	/**
	 * 获取-分配规则3
	 * 
	 * @return 值
	 */
	String getDistributionRule3();

	/**
	 * 设置-分配规则3
	 * 
	 * @param value
	 *            值
	 */
	void setDistributionRule3(String value);

	/**
	 * 获取-分配规则4
	 * 
	 * @return 值
	 */
	String getDistributionRule4();

	/**
	 * 设置-分配规则4
	 * 
	 * @param value
	 *            值
	 */
	void setDistributionRule4(String value);

	/**
	 * 获取-分配规则5
	 * 
	 * @return 值
	 */
	String getDistributionRule5();

	/**
	 * 设置-分配规则5
	 * 
	 * @param value
	 *            值
	 */
	void setDistributionRule5(String value);

	/**
	 * 获取-销售交货-物料批次集合
	 *
	 * @return 值
	 */
	ISalesDeliveryMaterialBatchJournals getSalesDeliveryMaterialBatchJournals();

	/**
	 * 设置-销售交货-物料批次集合
	 *
	 * @param value 值
	 */
	void setSalesDeliveryMaterialBatchJournals(ISalesDeliveryMaterialBatchJournals value);

	/**
	 * 获取-销售交货-物料序列集合
	 *
	 * @return 值
	 */
	ISalesDeliveryMaterialSerialJournals getSalesDeliveryMaterialSerialJournals();

	/**
	 * 设置-销售交货-物料序列集合
	 *
	 * @param value 值
	 */
	void setSalesDeliveryMaterialSerialJournals(ISalesDeliveryMaterialSerialJournals value);
}
