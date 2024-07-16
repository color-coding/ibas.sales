/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 单据付款-销售退货 */
        export class SalesReturnPaymentService
            extends ibas.ServiceWithResultApplication<ibas.IView, receiptpayment.app.IDocumentPaymentContract, receiptpayment.bo.IPaymentItem[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "429b3e03-7f38-4543-bb57-616aee73861d";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_payment_salesreturn";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnPaymentService.APPLICATION_ID;
                this.name = SalesReturnPaymentService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(["sales_payment", "bo_salesreturn"]);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
            }
            protected runService(contract: receiptpayment.app.IDocumentPaymentContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                // 不查子项（需要记录原始类型）
                // criteria.noChilds = true;
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = sales.bo.SalesReturn.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturn.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未结算的，非计划的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturn.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.CLOSED.toString();
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturn.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.PLANNED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturn.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturn.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(contract.payment.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturn.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.payment.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturn.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturn.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturn.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = contract.payment.businessPartnerCode;
                // 未收全款的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturn.PROPERTY_DOCUMENTTOTAL_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = sales.bo.SalesReturn.PROPERTY_PAIDTOTAL_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<sales.bo.ISalesReturn>({
                    boCode: sales.bo.BO_CODE_SALESRETURN,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<sales.bo.ISalesReturn>): void {
                        for (let selected of selecteds) {
                            // 记录原始单据信息（不一致则忽略）
                            let originalType: string = null;
                            let originalEntry: number = 0;
                            for (let item of selected.salesReturnItems) {
                                if (originalType === null) {
                                    originalType = item.baseDocumentType;
                                } else {
                                    if (originalType !== item.baseDocumentType) {
                                        originalType = null;
                                        break;
                                    }
                                }
                                if (originalEntry === 0) {
                                    originalEntry = item.baseDocumentEntry;
                                } else {
                                    if (originalEntry !== item.baseDocumentEntry) {
                                        originalEntry = 0;
                                        break;
                                    }
                                }
                            }
                            for (let item of contract.payment.paymentItems) {
                                if (item.baseDocumentType === selected.objectCode
                                    && item.baseDocumentEntry === selected.docEntry
                                    && item.baseDocumentLineId === -1) {
                                    selected.paidTotal += item.amount;
                                }
                            }
                            if (selected.paidTotal >= selected.documentTotal) {
                                continue;
                            }
                            let item: receiptpayment.bo.PaymentItem = contract.payment.paymentItems.create();
                            item.baseDocumentType = selected.objectCode;
                            item.baseDocumentEntry = selected.docEntry;
                            item.baseDocumentLineId = -1;
                            item.consumer = selected.consumer;
                            item.amount = selected.documentTotal - selected.paidTotal;
                            item.currency = selected.documentCurrency;
                            if (originalType !== null && originalEntry > 0) {
                                item.originalDocumentType = originalType;
                                item.originalDocumentEntry = originalEntry;
                                item.originalDocumentLineId = -1;
                            }
                        }
                        that.fireCompleted(contract.payment.paymentItems);
                    }
                });
            }
        }
        /** 单据付款-销售退货 */
        export class SalesReturnPaymentServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnPaymentService.APPLICATION_ID;
                this.name = SalesReturnPaymentService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesreturn");
                this.proxy = receiptpayment.app.DocumentPaymentServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesReturnPaymentService();
            }
        }

        /** 单据付款-销售贷项 */
        export class SalesCreditNotePaymentService
            extends ibas.ServiceWithResultApplication<ibas.IView, receiptpayment.app.IDocumentPaymentContract, receiptpayment.bo.IPaymentItem[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "f1a208b2-fc86-4f5d-9538-d0cb751a88ea";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_payment_salescreditnote";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesCreditNotePaymentService.APPLICATION_ID;
                this.name = SalesCreditNotePaymentService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(["sales_payment", "bo_salescreditnote"]);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
            }
            protected runService(contract: receiptpayment.app.IDocumentPaymentContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                // 不查子项（需要记录原始类型）
                // criteria.noChilds = true;
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = sales.bo.SalesCreditNote.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesCreditNote.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未结算的，非计划的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesCreditNote.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.CLOSED.toString();
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesCreditNote.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.PLANNED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesCreditNote.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesCreditNote.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(contract.payment.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesCreditNote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.payment.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesCreditNote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesCreditNote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesCreditNote.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = contract.payment.businessPartnerCode;
                // 未收全款的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesCreditNote.PROPERTY_DOCUMENTTOTAL_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = sales.bo.SalesCreditNote.PROPERTY_PAIDTOTAL_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<sales.bo.ISalesCreditNote>({
                    boCode: sales.bo.BO_CODE_SALESCREDITNOTE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<sales.bo.ISalesCreditNote>): void {
                        for (let selected of selecteds) {
                            // 记录原始单据信息（不一致则忽略）
                            let originalType: string = null;
                            let originalEntry: number = 0;
                            for (let item of selected.salesCreditNoteItems) {
                                if (originalType === null) {
                                    originalType = item.baseDocumentType;
                                } else {
                                    if (originalType !== item.baseDocumentType) {
                                        originalType = null;
                                        break;
                                    }
                                }
                                if (originalEntry === 0) {
                                    originalEntry = item.baseDocumentEntry;
                                } else {
                                    if (originalEntry !== item.baseDocumentEntry) {
                                        originalEntry = 0;
                                        break;
                                    }
                                }
                            }
                            for (let item of contract.payment.paymentItems) {
                                if (item.baseDocumentType === selected.objectCode
                                    && item.baseDocumentEntry === selected.docEntry
                                    && item.baseDocumentLineId === -1) {
                                    selected.paidTotal += item.amount;
                                }
                            }
                            if (selected.paidTotal >= selected.documentTotal) {
                                continue;
                            }
                            let item: receiptpayment.bo.PaymentItem = contract.payment.paymentItems.create();
                            item.baseDocumentType = selected.objectCode;
                            item.baseDocumentEntry = selected.docEntry;
                            item.baseDocumentLineId = -1;
                            item.consumer = selected.consumer;
                            item.amount = selected.documentTotal - selected.paidTotal;
                            item.currency = selected.documentCurrency;
                            if (originalType !== null && originalEntry > 0) {
                                item.originalDocumentType = originalType;
                                item.originalDocumentEntry = originalEntry;
                                item.originalDocumentLineId = -1;
                            }
                        }
                        that.fireCompleted(contract.payment.paymentItems);
                    }
                });
            }
        }
        /** 单据付款-销售贷项 */
        export class SalesCreditNotePaymentServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesCreditNotePaymentService.APPLICATION_ID;
                this.name = SalesCreditNotePaymentService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salescreditnote");
                this.proxy = receiptpayment.app.DocumentPaymentServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesCreditNotePaymentService();
            }
        }
    }
}