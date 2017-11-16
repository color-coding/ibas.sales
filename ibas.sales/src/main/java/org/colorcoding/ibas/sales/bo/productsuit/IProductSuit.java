package org.colorcoding.ibas.sales.bo.productsuit;

import org.colorcoding.ibas.bobas.bo.IBOSimple;
import org.colorcoding.ibas.bobas.data.DateTime;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.data.emApprovalStatus;
import org.colorcoding.ibas.bobas.data.emYesNo;

/**
* 产品套装 接口
* 
*/
public interface IProductSuit extends IBOSimple {

    /**
    * 获取-产品编码
    * 
    * @return 值
    */
    String getProduct();

    /**
    * 设置-产品编码
    * 
    * @param value 值
    */
    void setProduct(String value);


    /**
    * 获取-产品描述
    * 
    * @return 值
    */
    String getDescription();

    /**
    * 设置-产品描述
    * 
    * @param value 值
    */
    void setDescription(String value);


    /**
    * 获取-版本
    * 
    * @return 值
    */
    String getVersion();

    /**
    * 设置-版本
    * 
    * @param value 值
    */
    void setVersion(String value);


    /**
    * 获取-是否激活
    * 
    * @return 值
    */
    emYesNo getActivated();

    /**
    * 设置-是否激活
    * 
    * @param value 值
    */
    void setActivated(emYesNo value);


    /**
    * 获取-单位数量
    * 
    * @return 值
    */
    Decimal getUnitQuantity();

    /**
    * 设置-单位数量
    * 
    * @param value 值
    */
    void setUnitQuantity(Decimal value);


    /**
    * 设置-单位数量
    * 
    * @param value 值
    */
    void setUnitQuantity(String value);

    /**
    * 设置-单位数量
    * 
    * @param value 值
    */
    void setUnitQuantity(int value);

    /**
    * 设置-单位数量
    * 
    * @param value 值
    */
    void setUnitQuantity(double value);

    /**
    * 获取-计量单位
    * 
    * @return 值
    */
    String getUOM();

    /**
    * 设置-计量单位
    * 
    * @param value 值
    */
    void setUOM(String value);


    /**
    * 获取-生效日期
    * 
    * @return 值
    */
    DateTime getValidDate();

    /**
    * 设置-生效日期
    * 
    * @param value 值
    */
    void setValidDate(DateTime value);


    /**
    * 获取-失效日期
    * 
    * @return 值
    */
    DateTime getInvalidDate();

    /**
    * 设置-失效日期
    * 
    * @param value 值
    */
    void setInvalidDate(DateTime value);


    /**
    * 获取-备注
    * 
    * @return 值
    */
    String getRemarks();

    /**
    * 设置-备注
    * 
    * @param value 值
    */
    void setRemarks(String value);


    /**
    * 获取-对象编号
    * 
    * @return 值
    */
    Integer getObjectKey();

    /**
    * 设置-对象编号
    * 
    * @param value 值
    */
    void setObjectKey(Integer value);


    /**
    * 获取-对象类型
    * 
    * @return 值
    */
    String getObjectCode();

    /**
    * 设置-对象类型
    * 
    * @param value 值
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
    * @param value 值
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
    * @param value 值
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
    * @param value 值
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
    * @param value 值
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
    * @param value 值
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
    * @param value 值
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
    * @param value 值
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
    * @param value 值
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
    * @param value 值
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
    * @param value 值
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
    * @param value 值
    */
    void setUpdateActionId(String value);


    /**
    * 获取-审批状态
    * 
    * @return 值
    */
    emApprovalStatus getApprovalStatus();

    /**
    * 设置-审批状态
    * 
    * @param value 值
    */
    void setApprovalStatus(emApprovalStatus value);



     /**
    * 获取-产品套装-项目集合
    * 
    * @return 值
    */
    IProductSuitItems getProductSuitItems();

    /**
    * 设置-产品套装-项目集合
    * 
    * @param value 值
    */
    void setProductSuitItems(IProductSuitItems value);


}
