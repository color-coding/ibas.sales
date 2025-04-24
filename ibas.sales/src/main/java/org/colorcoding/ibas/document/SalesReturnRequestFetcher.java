package org.colorcoding.ibas.document;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.bo.BusinessObjectUnit;
import org.colorcoding.ibas.sales.bo.salesreturnrequest.SalesReturnRequest;

@BusinessObjectUnit(code = SalesReturnRequest.BUSINESS_OBJECT_CODE)
public class SalesReturnRequestFetcher extends SalesFetcher<SalesReturnRequest> {

	@Override
	public SalesReturnRequest fetch(Integer docEntry) throws Exception {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(SalesReturnRequest.PROPERTY_DOCENTRY.getName());
		condition.setValue(docEntry);
		IOperationResult<SalesReturnRequest> operationResult = this.getRepository().fetchSalesReturnRequest(criteria,
				this.userToken());
		if (operationResult.getError() != null) {
			throw operationResult.getError();
		}
		return operationResult.getResultObjects().firstOrDefault();
	}

}
