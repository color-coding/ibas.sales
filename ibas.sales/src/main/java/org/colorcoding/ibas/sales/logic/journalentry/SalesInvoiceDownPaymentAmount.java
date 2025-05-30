package org.colorcoding.ibas.sales.logic.journalentry;

import org.colorcoding.ibas.accounting.bo.journalentry.IJournalEntry;
import org.colorcoding.ibas.accounting.bo.journalentry.IJournalEntryLine;
import org.colorcoding.ibas.accounting.bo.journalentry.JournalEntry;
import org.colorcoding.ibas.accounting.logic.JournalEntryService;
import org.colorcoding.ibas.accounting.repository.BORepositoryAccounting;
import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.Strings;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.materials.logic.journalentry.JournalEntrySmartContent;
import org.colorcoding.ibas.sales.bo.salesinvoice.ISalesInvoiceDownPayment;

public class SalesInvoiceDownPaymentAmount extends JournalEntrySmartContent {

	public SalesInvoiceDownPaymentAmount(Object sourceData) {
		super(sourceData);
	}

	@Override
	public void caculate() throws Exception {
		if (this.getSourceData() instanceof ISalesInvoiceDownPayment) {
			ISalesInvoiceDownPayment item = (ISalesInvoiceDownPayment) this.getSourceData();
			if (!Strings.isNullOrEmpty(item.getPaymentType()) && item.getPaymentEntry() > 0) {
				Criteria criteria = new Criteria();
				criteria.setResultCount(1);
				ICondition condition = criteria.getConditions().create();
				condition.setAlias(JournalEntry.PROPERTY_BASEDOCUMENTTYPE.getName());
				condition.setValue(item.getPaymentType());
				condition = criteria.getConditions().create();
				condition.setAlias(JournalEntry.PROPERTY_BASEDOCUMENTENTRY.getName());
				condition.setValue(item.getPaymentEntry());
				condition = criteria.getConditions().create();
				condition.setAlias(JournalEntry.PROPERTY_DATASOURCE.getName());
				condition.setValue(JournalEntryService.DATASOURCE_SIGN_REGULAR_ENTRY);

				try (BORepositoryAccounting boRepository = new BORepositoryAccounting()) {
					boRepository.setTransaction(this.getService().getTransaction());
					IOperationResult<IJournalEntry> operationResult = boRepository.fetchJournalEntry(criteria);
					if (operationResult.getError() != null) {
						throw operationResult.getError();
					}
					for (IJournalEntry journalEntry : operationResult.getResultObjects()) {
						for (IJournalEntryLine line : journalEntry.getJournalEntryLines()) {
							if (Strings.isNullOrEmpty(line.getShortName())) {
								continue;
							}
							if (line.getShortName().equalsIgnoreCase(this.getShortName())) {
								this.setAccount(line.getAccount());
								return;
							}
						}
					}
				}
			}
			throw new Exception(I18N.prop("msg_ac_not_found_doucument_journalentry", String.format(
					"{[%s].[DocEntry = %s]%s}", item.getPaymentType(), item.getPaymentEntry(),
					item.getPaymentLineId() > 0 ? String.format("&&[LineId = %s]", item.getPaymentLineId()) : "")));
		}
		throw new Exception(I18N.prop("msg_bobas_not_support_the_compute"));
	}
}
