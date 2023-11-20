package org.colorcoding.ibas.sales.logic.journalentry;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.data.Decimal;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.materials.logic.journalentry.MaterialsCost;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoiceItem;
import org.colorcoding.ibas.sales.data.DataConvert;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

public class SalesInvoiceDeliveryMaterialsCost extends MaterialsCost {

	public SalesInvoiceDeliveryMaterialsCost(Object sourceData) {
		super(sourceData);
	}

	@Override
	public void caculate() {
		if (this.getSourceData() instanceof ISalesInvoiceItem) {
			ISalesInvoiceItem item = (ISalesInvoiceItem) this.getSourceData();
			if (!DataConvert.isNullOrEmpty(item.getBaseDocumentType()) && item.getBaseDocumentEntry() > 0
					&& item.getBaseDocumentLineId() > 0) {
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
				BORepositorySales boRepository = new BORepositorySales();
				boRepository.setRepository(this.getService().getRepository());
				IOperationResult<ISalesDelivery> operationResult = boRepository.fetchSalesDelivery(criteria);
				if (operationResult.getError() != null) {
					throw new BusinessLogicException(operationResult.getError());
				}
				for (ISalesDelivery baseDocument : operationResult.getResultObjects()) {
					if (!item.getBaseDocumentType().equals(baseDocument.getObjectCode())) {
						continue;
					}
					if (item.getBaseDocumentEntry().compareTo(baseDocument.getDocEntry()) != 0) {
						continue;
					}
					for (ISalesDeliveryItem baseLine : baseDocument.getSalesDeliveryItems()) {
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
							this.setAmount(Decimal.multiply(item.getQuantity(), avaPrice));
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
