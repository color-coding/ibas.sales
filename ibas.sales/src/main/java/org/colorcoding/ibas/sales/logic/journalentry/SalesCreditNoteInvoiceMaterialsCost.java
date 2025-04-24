package org.colorcoding.ibas.sales.logic.journalentry;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.Strings;
import org.colorcoding.ibas.bobas.data.emDirection;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.materials.bo.materialinventory.IMaterialInventoryJournal;
import org.colorcoding.ibas.materials.bo.materialinventory.MaterialInventoryJournal;
import org.colorcoding.ibas.materials.logic.journalentry.MaterialsInventoryCost;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;
import org.colorcoding.ibas.sales.bo.salescreditnote.ISalesCreditNoteItem;
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoice;
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoiceItem;
import org.colorcoding.ibas.sales.bo.salesinvoice.SalesInvoice;
import org.colorcoding.ibas.sales.bo.salesinvoice.SalesInvoiceItem;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

public class SalesCreditNoteInvoiceMaterialsCost extends MaterialsInventoryCost {

	public SalesCreditNoteInvoiceMaterialsCost(Object sourceData, BigDecimal quantity) {
		super(sourceData, quantity);
		this.setNegate(true);
	}

	@Override
	protected boolean caculate(String itemCode, String warehouse) {
		if (this.getSourceData() instanceof ISalesCreditNoteItem) {
			ISalesCreditNoteItem item = (ISalesCreditNoteItem) this.getSourceData();
			if (!Strings.isNullOrEmpty(item.getBaseDocumentType()) && item.getBaseDocumentEntry() > 0
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
				try (BORepositorySales boRepository = new BORepositorySales()) {
					boRepository.setTransaction(this.getService().getTransaction());
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
								criteria = new Criteria();
								condition = criteria.getConditions().create();
								condition.setAlias(MaterialInventoryJournal.PROPERTY_DIRECTION.getName());
								condition.setValue(emDirection.OUT);
								condition = criteria.getConditions().create();
								condition.setAlias(MaterialInventoryJournal.PROPERTY_BASEDOCUMENTTYPE.getName());
								condition.setValue(item.getObjectCode());
								condition = criteria.getConditions().create();
								condition.setAlias(MaterialInventoryJournal.PROPERTY_BASEDOCUMENTTYPE.getName());
								condition.setValue(item.getDocEntry());
								condition = criteria.getConditions().create();
								condition.setAlias(MaterialInventoryJournal.PROPERTY_BASEDOCUMENTLINEID.getName());
								condition.setValue(item.getLineId());
								try (BORepositoryMaterials boRepositoryMM = new BORepositoryMaterials()) {
									boRepositoryMM.setTransaction(this.getService().getTransaction());
									for (IMaterialInventoryJournal journal : boRepositoryMM
											.fetchMaterialInventoryJournal(criteria).getResultObjects()) {
										if (!journal.getItemCode().equals(itemCode)) {
											continue;
										}
										if (!journal.getWarehouse().equals(warehouse)) {
											continue;
										}
										avaPrice = journal.getCalculatedPrice();
									}
									if (avaPrice == null) {
										// 库存记录没有
										avaPrice = this.getAvgPrice(item.getItemCode(), item.getWarehouse());
									}
								}
							}
							if (avaPrice != null) {
								this.setAmount(Decimals.multiply(this.getQuantity(), avaPrice));
								// 设置未本币（物料成本均为本币）
								this.setCurrency(org.colorcoding.ibas.accounting.MyConfiguration.getConfigValue(
										org.colorcoding.ibas.accounting.MyConfiguration.CONFIG_ITEM_LOCAL_CURRENCY));
								this.setRate(Decimals.VALUE_ONE);
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	}

}
