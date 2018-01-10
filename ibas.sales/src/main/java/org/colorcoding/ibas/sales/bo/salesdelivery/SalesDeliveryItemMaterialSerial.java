package org.colorcoding.ibas.sales.bo.salesdelivery;

import org.colorcoding.ibas.materials.bo.materialserial.MaterialSerialJournals;

/**
 * @author Fancy
 * @date 2018/1/10
 */
public class SalesDeliveryItemMaterialSerial extends MaterialSerialJournals<ISalesDeliveryItem> implements ISalesDeliveryItemMaterialSerial {
    private static final long serialVersionUID = 1489371402316563463L;

    public SalesDeliveryItemMaterialSerial() {
        super();
    }

    public SalesDeliveryItemMaterialSerial(ISalesDeliveryItem parent) {
        super(parent);
    }
}
