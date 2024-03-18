package org.colorcoding.ibas.document;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.mapping.BusinessObjectUnit;
import org.colorcoding.ibas.sales.bo.salesquote.SalesQuote;

@BusinessObjectUnit(code = SalesQuote.BUSINESS_OBJECT_CODE)
public class SalesQuoteFetcher extends SalesFetcher<SalesQuote> {

	@Override
	public SalesQuote fetch(Integer docEntry) throws Exception {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(SalesQuote.PROPERTY_DOCENTRY.getName());
		condition.setValue(docEntry);
		IOperationResult<SalesQuote> operationResult = this.getRepository().fetchSalesQuote(criteria, this.userToken());
		if (operationResult.getError() != null) {
			throw operationResult.getError();
		}
		return operationResult.getResultObjects().firstOrDefault();
	}

}
