package org.colorcoding.ibas.sales.bo.salesorder;

import java.beans.PropertyChangeEvent;
import javax.xml.bind.annotation.*;
import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.bo.*;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
* 销售订单-行 集合
*/
@XmlType(name = SalesOrderItems.BUSINESS_OBJECT_NAME, namespace = MyConfiguration.NAMESPACE_BO)
@XmlSeeAlso({ SalesOrderItem.class })
public class SalesOrderItems extends BusinessObjects<ISalesOrderItem, ISalesOrder> implements ISalesOrderItems {

    /**
    * 业务对象名称
    */
    public static final String BUSINESS_OBJECT_NAME = "SalesOrderItems";

    /**
     * 序列化版本标记
     */
    private static final long serialVersionUID = 8996110285431057929L;

    /**
     * 构造方法
     */
    public SalesOrderItems() {
        super();
    }

    /**
     * 构造方法
     * @param parent 父项对象
     */
    public SalesOrderItems(ISalesOrder parent) {
        super(parent);
    }

    /**
     * 元素类型
     */
    public Class<?> getElementType() {
        return SalesOrderItem.class;
    }

    /**
    * 创建销售订单-行
    * 
    * @return 销售订单-行
    */
    public ISalesOrderItem create() {
        ISalesOrderItem item = new SalesOrderItem();
        if (this.add(item)) {
            return item;
        }
        return null;
    }

    @Override
    protected void afterAddItem(ISalesOrderItem item) {
        super.afterAddItem(item);
        // TODO 设置关联值
        SalesOrderItem myItem=(SalesOrderItem)item;
        if(myItem!=null){
            myItem.setMyParent(this.getParent());
        }
    }

    @Override
    public ICriteria getElementCriteria() {
        ICriteria criteria = super.getElementCriteria();
        // TODO 添加关联查询条件
        return criteria;
    }

    @Override
    public void onParentPropertyChanged(PropertyChangeEvent evt) {
        super.onParentPropertyChanged(evt);
        // TODO 设置关联值
    }
}
