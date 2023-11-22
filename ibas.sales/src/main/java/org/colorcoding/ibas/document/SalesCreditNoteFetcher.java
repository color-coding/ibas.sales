package org.colorcoding.ibas.document;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.mapping.BusinessObjectUnit;
import org.colorcoding.ibas.sales.bo.salescreditnote.SalesCreditNote;

@BusinessObjectUnit(code = SalesCreditNote.BUSINESS_OBJECT_CODE)
public class SalesCreditNoteFetcher extends SalesFetcher<SalesCreditNote> {

	@Override
	public SalesCreditNote fetch(Integer docEntry) throws Exception {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(SalesCreditNote.PROPERTY_DOCENTRY.getName());
		condition.setValue(docEntry);
		IOperationResult<SalesCreditNote> operationResult = this.getRepository().fetchSalesCreditNote(criteria,
				this.userToken());
		if (operationResult.getError() != null) {
			throw operationResult.getError();
		}
		return operationResult.getResultObjects().firstOrDefault();
	}

}
