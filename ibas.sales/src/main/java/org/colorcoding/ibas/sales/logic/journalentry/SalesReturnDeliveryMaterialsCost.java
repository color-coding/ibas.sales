package org.colorcoding.ibas.sales.logic.journalentry;

import java.math.BigDecimal;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.Decimals;
import org.colorcoding.ibas.bobas.common.IChildCriteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.data.emDirection;
import org.colorcoding.ibas.bobas.logic.BusinessLogicException;
import org.colorcoding.ibas.materials.bo.materialinventory.IMaterialInventoryJournal;
import org.colorcoding.ibas.materials.bo.materialinventory.MaterialInventoryJournal;
import org.colorcoding.ibas.materials.logic.journalentry.MaterialsInventoryCost;
import org.colorcoding.ibas.materials.repository.BORepositoryMaterials;
import org.colorcoding.ibas.sales.MyConfiguration;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.ISalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDelivery;
import org.colorcoding.ibas.sales.bo.salesdelivery.SalesDeliveryItem;
import org.colorcoding.ibas.sales.bo.salesreturn.ISalesReturnItem;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

public class SalesReturnDeliveryMaterialsCost extends MaterialsInventoryCost {

	public SalesReturnDeliveryMaterialsCost(Object sourceData, BigDecimal quantity) {
		super(sourceData, quantity);
		this.setNegate(true);
	}

	@Override
	protected boolean caculate(String itemCode, String warehouse) {
		String docType, deliveryCode = MyConfiguration.applyVariables(SalesDelivery.BUSINESS_OBJECT_CODE);
		Integer docEntry, docLine;
		if (this.getSourceData() instanceof ISalesReturnItem) {
			ISalesReturnItem item = (ISalesReturnItem) this.getSourceData();
			docType = item.getBaseDocumentType();
			docEntry = item.getBaseDocumentEntry();
			docLine = item.getBaseDocumentLineId();
			if (!deliveryCode.equals(docType)) {
				docType = item.getOriginalDocumentType();
				docEntry = item.getOriginalDocumentEntry();
				docLine = item.getOriginalDocumentLineId();
			}
			if (deliveryCode.equals(docType) && docEntry > 0 && docLine > 0) {
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
					boRepository.setTransaction(this.getService().getTransaction());
					IOperationResult<ISalesDelivery> operationResult = boRepository.fetchSalesDelivery(criteria);
					if (operationResult.getError() != null) {
						throw new BusinessLogicException(operationResult.getError());
					}
					for (ISalesDelivery baseDocument : operationResult.getResultObjects()) {
						if (!docType.equals(baseDocument.getObjectCode())) {
							continue;
						}
						if (docEntry.compareTo(baseDocument.getDocEntry()) != 0) {
							continue;
						}
						for (ISalesDeliveryItem baseLine : baseDocument.getSalesDeliveryItems()) {
							if (docLine.compareTo(baseLine.getLineId()) != 0) {
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
								this.setAmount(Decimals.multiply(item.getInventoryQuantity(), avaPrice));
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
