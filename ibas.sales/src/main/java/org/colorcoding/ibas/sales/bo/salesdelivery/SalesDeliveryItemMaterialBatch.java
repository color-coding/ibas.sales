package org.colorcoding.ibas.sales.bo.salesdelivery;

import org.colorcoding.ibas.materials.bo.materialbatch.MaterialBatchJournals;

/**
 * @author Fancy
 * @date 2018/1/10
 */
public class SalesDeliveryItemMaterialBatch extends MaterialBatchJournals<ISalesDeliveryItem> implements ISalesDeliveryItemMaterialBatch {
    private static final long serialVersionUID = -7832397830173231436L;

    public SalesDeliveryItemMaterialBatch() {
        super();
    }

    public SalesDeliveryItemMaterialBatch(ISalesDeliveryItem parent) {
        super(parent);
    }
}
