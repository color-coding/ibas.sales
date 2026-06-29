package org.colorcoding.ibas.sales.logic.journalentry;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.materials.logic.journalentry.BaseDocumentOutboundCost;
import org.colorcoding.ibas.sales.MyConfiguration;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturnItem;

import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 销售退货（基于销售交货）库存入库成本（反向）。
 */
public class SalesReturnDeliveryMaterialsCost extends BaseDocumentOutboundCost {

    public SalesReturnDeliveryMaterialsCost(Object sourceData, BigDecimal quantity) {
        super(sourceData, quantity, true);  // 退货：取反
    }

    @Override
    protected Object findBaseLine() throws Exception {
        if (!(this.getSourceData() instanceof ISalesReturnItem)) {
            return null;
        }
        ISalesReturnItem item = (ISalesReturnItem) this.getSourceData();
        String deliveryCode = MyConfiguration.applyVariables(SalesDelivery.BUSINESS_OBJECT_CODE);
        String docType = item.getBaseDocumentType();
        Integer docEntry = item.getBaseDocumentEntry();
        Integer docLine = item.getBaseDocumentLineId();
        if (!deliveryCode.equals(docType)) {
            docType = item.getOriginalDocumentType();
            docEntry = item.getOriginalDocumentEntry();
            docLine = item.getOriginalDocumentLineId();
        }
        if (!deliveryCode.equals(docType) || docEntry == null || docEntry <= 0
                || docLine == null || docLine <= 0) {
            return null;
        }
        Criteria criteria = new Criteria();
        ICondition condition = criteria.getConditions().create();
        condition.setAlias(SalesDelivery.PROPERTY_DOCENTRY.getName());
        condition.setValue(docEntry);
        IChildCriteria childCriteria = criteria.getChildCriterias().create();
        childCriteria.setPropertyPath(SalesDelivery.PROPERTY_SALESDELIVERYITEMS.getName());
        childCriteria.setOnlyHasChilds(true);
        condition = childCriteria.getConditions().create();
        condition.setAlias(SalesDeliveryItem.PROPERTY_LINEID.getName());
        condition.setValue(docLine);
        try (BORepositorySales boRepository = new BORepositorySales()) {
            boRepository.setTransaction(this.getTransaction());
            IOperationResult<ISalesDelivery> operationResult = boRepository.fetchSalesDelivery(criteria);
            if (operationResult.getError() != null) throw new BusinessLogicException(operationResult.getError());
            for (ISalesDelivery baseDocument : operationResult.getResultObjects()) {
                if (!docType.equals(baseDocument.getObjectCode())) continue;
                if (docEntry.compareTo(baseDocument.getDocEntry()) != 0) continue;
                for (ISalesDeliveryItem baseLine : baseDocument.getSalesDeliveryItems()) {
                    if (docLine.compareTo(baseLine.getLineId()) == 0) {
                        return baseLine;
                    }
                }
            }
        }
        return null;
    }
}
