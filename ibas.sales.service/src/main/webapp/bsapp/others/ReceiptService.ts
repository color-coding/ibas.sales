/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 单据收款-销售订单 */
        export class SalesOrderReceiptService
            extends ibas.ServiceWithResultApplication<ibas.IView, receiptpayment.app.IDocumentReceiptContract, receiptpayment.bo.IPaymentItem[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "fe44081a-122a-4020-9900-5e11c2f408ba";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_receipt_salesorder";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesOrderReceiptService.APPLICATION_ID;
                this.name = SalesOrderReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(["sales_receipt", "bo_salesorder"]);
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
            protected runService(contract: receiptpayment.app.IDocumentReceiptContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                // 不查子项
                criteria.noChilds = true;
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = sales.bo.SalesOrder.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesOrder.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未结算的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesOrder.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.CLOSED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesOrder.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesOrder.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 当前供应商的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesOrder.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = contract.receipt.businessPartnerCode;
                // 未收全款的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesOrder.PROPERTY_DOCUMENTTOTAL_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = sales.bo.SalesOrder.PROPERTY_PAIDTOTAL_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<sales.bo.ISalesOrder>({
                    boCode: sales.bo.BO_CODE_SALESORDER,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<sales.bo.ISalesOrder>): void {
                        for (let selected of selecteds) {
                            if (contract.receipt.receiptItems.firstOrDefault(
                                c => c.baseDocumentType === selected.objectCode
                                    && c.baseDocumentEntry === selected.docEntry
                                    && c.baseDocumentLineId === -1) !== null) {
                                continue;
                            }
                            let item: receiptpayment.bo.ReceiptItem = contract.receipt.receiptItems.create();
                            item.baseDocumentType = selected.objectCode;
                            item.baseDocumentEntry = selected.docEntry;
                            item.baseDocumentLineId = -1;
                            item.consumer = selected.consumer;
                            item.amount = selected.documentTotal - selected.paidTotal;
                            item.currency = selected.documentCurrency;
                        }
                        that.fireCompleted(contract.receipt.receiptItems);
                    }
                });
            }
        }
        /** 单据收款-销售订单 */
        export class SalesOrderReceiptServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesOrderReceiptService.APPLICATION_ID;
                this.name = SalesOrderReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesorder");
                this.proxy = receiptpayment.app.DocumentReceiptServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesOrderReceiptService();
            }
        }
        /** 单据收款-销售收货 */
        export class SalesDeliveryReceiptService
            extends ibas.ServiceWithResultApplication<ibas.IView, receiptpayment.app.IDocumentReceiptContract, receiptpayment.bo.IPaymentItem[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "db381300-7e7e-45d0-9055-d6414a37bcad";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_receipt_salesdelivery";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesDeliveryReceiptService.APPLICATION_ID;
                this.name = SalesDeliveryReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(["sales_receipt", "bo_salesdelivery"]);
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
            protected runService(contract: receiptpayment.app.IDocumentReceiptContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                // 不查子项
                criteria.noChilds = true;
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = sales.bo.SalesDelivery.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesDelivery.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未结算的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesDelivery.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.CLOSED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesDelivery.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesDelivery.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 当前供应商的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesDelivery.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = contract.receipt.businessPartnerCode;
                // 未收全款的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesDelivery.PROPERTY_DOCUMENTTOTAL_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = sales.bo.SalesDelivery.PROPERTY_PAIDTOTAL_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<sales.bo.ISalesDelivery>({
                    boCode: sales.bo.BO_CODE_SALESDELIVERY,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<sales.bo.ISalesDelivery>): void {
                        for (let selected of selecteds) {
                            if (contract.receipt.receiptItems.firstOrDefault(
                                c => c.baseDocumentType === selected.objectCode
                                    && c.baseDocumentEntry === selected.docEntry
                                    && c.baseDocumentLineId === -1) !== null) {
                                continue;
                            }
                            let item: receiptpayment.bo.ReceiptItem = contract.receipt.receiptItems.create();
                            item.baseDocumentType = selected.objectCode;
                            item.baseDocumentEntry = selected.docEntry;
                            item.baseDocumentLineId = -1;
                            item.consumer = selected.consumer;
                            item.amount = selected.documentTotal - selected.paidTotal;
                            item.currency = selected.documentCurrency;
                        }
                        that.fireCompleted(contract.receipt.receiptItems);
                    }
                });
            }
        }
        /** 单据收款-销售收货 */
        export class SalesDeliveryReceiptServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesDeliveryReceiptService.APPLICATION_ID;
                this.name = SalesDeliveryReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesdelivery");
                this.proxy = receiptpayment.app.DocumentReceiptServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesDeliveryReceiptService();
            }
        }
    }
}