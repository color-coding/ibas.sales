package org.colorcoding.ibas.sales.bo.salesreturn;

import java.beans.PropertyChangeEvent;
import javax.xml.bind.annotation.*;
import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.bo.*;
import org.colorcoding.ibas.sales.MyConsts;

/**
* 销售退货-行 集合
*/
@XmlType(name = SalesReturnItems.BUSINESS_OBJECT_NAME, namespace = MyConsts.NAMESPACE_BO)
@XmlSeeAlso({ SalesReturnItem.class })
public class SalesReturnItems extends BusinessObjects<ISalesReturnItem, ISalesReturn> implements ISalesReturnItems {

    /**
    * 业务对象名称
    */
    public static final String BUSINESS_OBJECT_NAME = "SalesReturnItems";

    /**
     * 序列化版本标记
     */
    private static final long serialVersionUID = -1658102673342790176L;

    /**
     * 构造方法
     */
    public SalesReturnItems() {
        super();
    }

    /**
     * 构造方法
     * @param parent 父项对象
     */
    public SalesReturnItems(ISalesReturn parent) {
        super(parent);
    }

    /**
     * 元素类型
     */
    public Class<?> getElementType() {
        return SalesReturnItem.class;
    }

    /**
    * 创建销售退货-行
    * 
    * @return 销售退货-行
    */
    public ISalesReturnItem create() {
        ISalesReturnItem item = new SalesReturnItem();
        if (this.add(item)) {
            return item;
        }
        return null;
    }

    @Override
    protected void afterAddItem(ISalesReturnItem item) {
        super.afterAddItem(item);
        // TODO 设置关联值
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
