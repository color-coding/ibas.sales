package org.colorcoding.ibas.sales.logic.journalentry;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.materials.logic.journalentry.BaseDocumentOutboundCost;
import org.colorcoding.ibas.sales.bo.salescreditnote.ISalesCreditNoteItem;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturnItem;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturnItem;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

/**
 * 销售贷项（基于销售退货）库存成本。
 */
public class SalesCreditNoteReturnMaterialsCost extends BaseDocumentOutboundCost {

    public SalesCreditNoteReturnMaterialsCost(Object sourceData, BigDecimal quantity) {
        super(sourceData, quantity, true);
    }

    @Override
    protected Object findBaseLine() throws Exception {
        if (!(this.getSourceData() instanceof ISalesCreditNoteItem)) {
            return null;
        }
        ISalesCreditNoteItem item = (ISalesCreditNoteItem) this.getSourceData();
        if (item.getBaseDocumentType() == null || item.getBaseDocumentEntry() == null
                || item.getBaseDocumentEntry() <= 0 || item.getBaseDocumentLineId() == null
                || item.getBaseDocumentLineId() <= 0) {
            return null;
        }
        Criteria criteria = new Criteria();
        ICondition condition = criteria.getConditions().create();
        condition.setAlias(SalesReturn.PROPERTY_DOCENTRY.getName());
        condition.setValue(item.getBaseDocumentEntry());
        IChildCriteria childCriteria = criteria.getChildCriterias().create();
        childCriteria.setPropertyPath(SalesReturn.PROPERTY_SALESRETURNITEMS.getName());
        childCriteria.setOnlyHasChilds(true);
        condition = childCriteria.getConditions().create();
        condition.setAlias(SalesReturnItem.PROPERTY_LINEID.getName());
        condition.setValue(item.getBaseDocumentLineId());
        BORepositorySales boRepository = new BORepositorySales(); {
            boRepository.setRepository(this.getService().getRepository());
            IOperationResult<ISalesReturn> operationResult = boRepository.fetchSalesReturn(criteria);
            if (operationResult.getError() != null) throw new BusinessLogicException(operationResult.getError());
            for (ISalesReturn baseDocument : operationResult.getResultObjects()) {
                if (!item.getBaseDocumentType().equals(baseDocument.getObjectCode())) continue;
                if (item.getBaseDocumentEntry().compareTo(baseDocument.getDocEntry()) != 0) continue;
                for (ISalesReturnItem baseLine : baseDocument.getSalesReturnItems()) {
                    if (item.getBaseDocumentLineId().compareTo(baseLine.getLineId()) == 0) {
                        return baseLine;
                    }
                }
            }
        }
        return null;
    }
}
