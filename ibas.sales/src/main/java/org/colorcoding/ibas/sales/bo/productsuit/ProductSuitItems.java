package org.colorcoding.ibas.sales.bo.productsuit;

import java.beans.PropertyChangeEvent;
import javax.xml.bind.annotation.*;
import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.bo.*;
import org.colorcoding.ibas.sales.MyConsts;

/**
* 产品套装-项目 集合
*/
@XmlType(name = ProductSuitItems.BUSINESS_OBJECT_NAME, namespace = MyConsts.NAMESPACE_BO)
@XmlSeeAlso({ ProductSuitItem.class })
public class ProductSuitItems extends BusinessObjects<IProductSuitItem, IProductSuit> implements IProductSuitItems {

    /**
    * 业务对象名称
    */
    public static final String BUSINESS_OBJECT_NAME = "ProductSuitItems";

    /**
     * 序列化版本标记
     */
    private static final long serialVersionUID = -1143359664263045784L;

    /**
     * 构造方法
     */
    public ProductSuitItems() {
        super();
    }

    /**
     * 构造方法
     * @param parent 父项对象
     */
    public ProductSuitItems(IProductSuit parent) {
        super(parent);
    }

    /**
     * 元素类型
     */
    public Class<?> getElementType() {
        return ProductSuitItem.class;
    }

    /**
    * 创建产品套装-项目
    * 
    * @return 产品套装-项目
    */
    public IProductSuitItem create() {
        IProductSuitItem item = new ProductSuitItem();
        if (this.add(item)) {
            return item;
        }
        return null;
    }

    @Override
    protected void afterAddItem(IProductSuitItem item) {
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
