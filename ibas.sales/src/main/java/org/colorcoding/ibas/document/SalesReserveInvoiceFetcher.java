package org.colorcoding.ibas.document;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.bo.BusinessObjectUnit;
import org.colorcoding.ibas.sales.bo.salesreserveinvoice.SalesReserveInvoice;

@BusinessObjectUnit(code = SalesReserveInvoice.BUSINESS_OBJECT_CODE)
public class SalesReserveInvoiceFetcher extends SalesFetcher<SalesReserveInvoice> {

	@Override
	public SalesReserveInvoice fetch(Integer docEntry) throws Exception {
		ICriteria criteria = new Criteria();
		ICondition condition = criteria.getConditions().create();
		condition.setAlias(SalesReserveInvoice.PROPERTY_DOCENTRY.getName());
		condition.setValue(docEntry);
		IOperationResult<SalesReserveInvoice> operationResult = this.getRepository().fetchSalesReserveInvoice(criteria,
				this.userToken());
		if (operationResult.getError() != null) {
			throw operationResult.getError();
		}
		return operationResult.getResultObjects().firstOrDefault();
	}

}
