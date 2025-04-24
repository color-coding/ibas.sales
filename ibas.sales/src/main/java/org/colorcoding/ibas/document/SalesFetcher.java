package org.colorcoding.ibas.document;

import org.colorcoding.ibas.bobas.organization.OrganizationFactory;
import org.colorcoding.ibas.bobas.repository.ITransaction;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

public abstract class SalesFetcher<T extends IDocumentOperatingTarget> implements IDocumentFetcher<T> {

	private BORepositorySales repository;

	protected BORepositorySales getRepository() {
		if (this.repository == null) {
			this.repository = new BORepositorySales();
		}
		return this.repository;
	}

	@Override
	public void setTransaction(ITransaction transaction) {
		this.getRepository().setTransaction(transaction);
	}

	protected String userToken() {
		return OrganizationFactory.SYSTEM_USER.getToken();
	}

}
