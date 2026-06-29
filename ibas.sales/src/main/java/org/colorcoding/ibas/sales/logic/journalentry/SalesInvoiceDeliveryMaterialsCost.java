package org.colorcoding.ibas.sales.logic.journalentry;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.materials.logic.journalentry.BaseDocumentOutboundCost;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoiceItem;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 销售发票（基于销售交货）的库存出库成本。
 *
 * <p>仅做基础单据存在性 guard，库存成本算法由父类统一实现；
 * 非库存/服务物料由 {@link org.colorcoding.ibas.materials.logic.journalentry.MaterialsCost} 模板处理。</p>
 */
public class SalesInvoiceDeliveryMaterialsCost extends BaseDocumentOutboundCost {

    public SalesInvoiceDeliveryMaterialsCost(Object sourceData, BigDecimal quantity) {
        super(sourceData, quantity, false);
    }

    @Override
    protected Object findBaseLine() throws Exception {
        if (!(this.getSourceData() instanceof ISalesInvoiceItem)) {
            return null;
        }
        ISalesInvoiceItem item = (ISalesInvoiceItem) this.getSourceData();
        if (item.getBaseDocumentType() == null || item.getBaseDocumentEntry() == null
                || item.getBaseDocumentEntry() <= 0 || item.getBaseDocumentLineId() == null
                || item.getBaseDocumentLineId() <= 0) {
            return null;
        }
        Criteria criteria = new Criteria();
        ICondition condition = criteria.getConditions().create();
        condition.setAlias(SalesDelivery.PROPERTY_DOCENTRY.getName());
        condition.setValue(item.getBaseDocumentEntry());
        IChildCriteria childCriteria = criteria.getChildCriterias().create();
        childCriteria.setPropertyPath(SalesDelivery.PROPERTY_SALESDELIVERYITEMS.getName());
        childCriteria.setOnlyHasChilds(true);
        condition = childCriteria.getConditions().create();
        condition.setAlias(SalesDeliveryItem.PROPERTY_LINEID.getName());
        condition.setValue(item.getBaseDocumentLineId());
        try (BORepositorySales boRepository = new BORepositorySales()) {
            boRepository.setTransaction(this.getTransaction());
            IOperationResult<ISalesDelivery> operationResult = boRepository.fetchSalesDelivery(criteria);
            if (operationResult.getError() != null) throw new BusinessLogicException(operationResult.getError());
            for (ISalesDelivery baseDocument : operationResult.getResultObjects()) {
                if (!item.getBaseDocumentType().equals(baseDocument.getObjectCode())) continue;
                if (item.getBaseDocumentEntry().compareTo(baseDocument.getDocEntry()) != 0) continue;
                for (ISalesDeliveryItem baseLine : baseDocument.getSalesDeliveryItems()) {
                    if (item.getBaseDocumentLineId().compareTo(baseLine.getLineId()) == 0) {
                        return baseLine;
                    }
                }
            }
        }
        return null;
    }
}
