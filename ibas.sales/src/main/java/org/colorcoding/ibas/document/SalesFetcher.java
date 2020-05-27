package org.colorcoding.ibas.document;

import org.colorcoding.ibas.bobas.core.IBORepository;
import org.colorcoding.ibas.bobas.organization.OrganizationFactory;
import org.colorcoding.ibas.sales.repository.BORepositorySales;

public abstract class SalesFetcher<T extends IDocumentPaidTotalOperator> implements IDocumentFetcher<T> {

	private BORepositorySales repository;

	protected BORepositorySales getRepository() {
		if (this.repository == null) {
			this.repository = new BORepositorySales();
		}
		return this.repository;
	}

	@Override
	public void setRepository(IBORepository repository) {
		this.getRepository().setRepository(repository);
	}

	protected String userToken() {
		return OrganizationFactory.SYSTEM_USER.getToken();
	}

}
