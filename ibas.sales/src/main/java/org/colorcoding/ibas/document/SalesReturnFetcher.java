package org.colorcoding.ibas.document;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.bo.BusinessObjectUnit;
import org.colorcoding.ibas.sales.bo.salesreturn.SalesReturn;

@BusinessObjectUnit(code = SalesReturn.BUSINESS_OBJECT_CODE)
public class SalesReturnFetcher extends SalesFetcher<SalesReturn> {

	@Override
	public SalesReturn fetch(Integer docEntry) throws Exception {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(SalesReturn.PROPERTY_DOCENTRY.getName());
		condition.setValue(docEntry);
		IOperationResult<SalesReturn> operationResult = this.getRepository().fetchSalesReturn(criteria,
				this.userToken());
		if (operationResult.getError() != null) {
			throw operationResult.getError();
		}
		return operationResult.getResultObjects().firstOrDefault();
	}

}
