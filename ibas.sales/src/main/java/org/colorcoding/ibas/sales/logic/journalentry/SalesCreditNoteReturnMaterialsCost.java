package org.colorcoding.ibas.sales.logic.journalentry;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.materials.logic.journalentry.MaterialsCost;
import org.colorcoding.ibas.sales.bo.salescreditnote.ISalesCreditNoteItem;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturnItem;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturnItem;
import org.colorcoding.ibas.sales.data.DataConvert;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

public class SalesCreditNoteReturnMaterialsCost extends MaterialsCost {

	public SalesCreditNoteReturnMaterialsCost(Object sourceData) {
		super(sourceData);
	}

	@Override
	public void caculate() {
		if (this.getSourceData() instanceof ISalesCreditNoteItem) {
			ISalesCreditNoteItem item = (ISalesCreditNoteItem) this.getSourceData();
			if (!DataConvert.isNullOrEmpty(item.getBaseDocumentType()) && item.getBaseDocumentEntry() > 0
					&& item.getBaseDocumentLineId() > 0) {
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
				BORepositorySales boRepository = new BORepositorySales();
				boRepository.setRepository(this.getService().getRepository());
				IOperationResult<ISalesReturn> operationResult = boRepository.fetchSalesReturn(criteria);
				if (operationResult.getError() != null) {
					throw new BusinessLogicException(operationResult.getError());
				}
				for (ISalesReturn baseDocument : operationResult.getResultObjects()) {
					if (!item.getBaseDocumentType().equals(baseDocument.getObjectCode())) {
						continue;
					}
					if (item.getBaseDocumentEntry().compareTo(baseDocument.getDocEntry()) != 0) {
						continue;
					}
					for (ISalesReturnItem baseLine : baseDocument.getSalesReturnItems()) {
						if (item.getBaseDocumentLineId().compareTo(baseLine.getLineId()) != 0) {
							continue;
						}
						BigDecimal avaPrice = null;
						if (item.isNew()) {
							// 新建的取物料上的
							avaPrice = this.getAvgPrice(item.getItemCode(), item.getWarehouse());
						} else {
							avaPrice = this.getAvgPrice(item.getObjectCode(), item.getDocEntry(), item.getLineId(),
									item.getItemCode(), item.getWarehouse());
							if (avaPrice == null) {
								// 库存记录没有
								avaPrice = this.getAvgPrice(item.getItemCode(), item.getWarehouse());
							}
						}
						if (avaPrice != null) {
							this.setAmount(Decimal.multiply(item.getQuantity(), avaPrice).negate());
							return;
						}
						break;
					}
					break;
				}
			}
		}
		throw new RuntimeException("no result.");
	}

}
