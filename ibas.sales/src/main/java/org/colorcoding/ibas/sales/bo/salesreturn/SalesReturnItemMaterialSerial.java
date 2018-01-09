package org.colorcoding.ibas.sales.bo.salesreturn;

import org.colorcoding.ibas.materials.bo.materialserial.MaterialSerialJournals;

/**
 * @author Fancy
 * @date 2018/1/10
 */
public class SalesReturnItemMaterialSerial extends MaterialSerialJournals<ISalesReturnItem> implements ISalesReturnItemMaterialSerial {
    private static final long serialVersionUID = 1759648558567469771L;

    public SalesReturnItemMaterialSerial() {
        super();
    }

    public SalesReturnItemMaterialSerial(ISalesReturnItem parent) {
        super(parent);
    }
}
