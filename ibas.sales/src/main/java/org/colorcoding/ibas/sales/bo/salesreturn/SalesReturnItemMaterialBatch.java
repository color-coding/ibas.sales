package org.colorcoding.ibas.sales.bo.salesreturn;

import org.colorcoding.ibas.materials.bo.materialbatch.MaterialBatchJournals;

/**
 * @author Fancy
 * @date 2018/1/10
 */
public class SalesReturnItemMaterialBatch extends MaterialBatchJournals<ISalesReturnItem> implements ISalesReturnItemMaterialBatch {
    private static final long serialVersionUID = 2065095809182813698L;

    public SalesReturnItemMaterialBatch() {
        super();
    }

    public SalesReturnItemMaterialBatch(ISalesReturnItem parent) {
        super(parent);
    }
}
