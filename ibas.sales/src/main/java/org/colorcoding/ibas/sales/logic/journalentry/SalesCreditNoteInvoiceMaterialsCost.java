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
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoice;
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoiceItem;
import org.colorcoding.ibas.sales.bo.salesinvoice.SalesInvoice;
import org.colorcoding.ibas.sales.bo.salesinvoice.SalesInvoiceItem;
import org.colorcoding.ibas.sales.data.DataConvert;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

public class SalesCreditNoteInvoiceMaterialsCost extends MaterialsCost {

	public SalesCreditNoteInvoiceMaterialsCost(Object sourceData) {
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
				condition.setAlias(SalesInvoice.PROPERTY_DOCENTRY.getName());
				condition.setValue(item.getBaseDocumentEntry());
				IChildCriteria childCriteria = criteria.getChildCriterias().create();
				childCriteria.setPropertyPath(SalesInvoice.PROPERTY_SALESINVOICEITEMS.getName());
				childCriteria.setOnlyHasChilds(true);
				condition = childCriteria.getConditions().create();
				condition.setAlias(SalesInvoiceItem.PROPERTY_LINEID.getName());
				condition.setValue(item.getBaseDocumentLineId());
				BORepositorySales boRepository = new BORepositorySales();
				boRepository.setRepository(this.getService().getRepository());
				IOperationResult<ISalesInvoice> operationResult = boRepository.fetchSalesInvoice(criteria);
				if (operationResult.getError() != null) {
					throw new BusinessLogicException(operationResult.getError());
				}
				for (ISalesInvoice baseDocument : operationResult.getResultObjects()) {
					if (!item.getBaseDocumentType().equals(baseDocument.getObjectCode())) {
						continue;
					}
					if (item.getBaseDocumentEntry().compareTo(baseDocument.getDocEntry()) != 0) {
						continue;
					}
					for (ISalesInvoiceItem baseLine : baseDocument.getSalesInvoiceItems()) {
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
