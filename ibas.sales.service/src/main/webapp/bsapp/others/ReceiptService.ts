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
                // 是否指定分支
                if (!ibas.strings.isEmpty(contract.receipt.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.receipt.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
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
                            for (let item of contract.receipt.receiptItems) {
                                if (item.baseDocumentType === selected.objectCode
                                    && item.baseDocumentEntry === selected.docEntry
                                    && item.baseDocumentLineId === -1) {
                                    selected.paidTotal += item.amount;
                                }
                            }
                            if (selected.paidTotal >= selected.documentTotal) {
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
                // 是否指定分支
                if (!ibas.strings.isEmpty(contract.receipt.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.receipt.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
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
                            for (let item of contract.receipt.receiptItems) {
                                if (item.baseDocumentType === selected.objectCode
                                    && item.baseDocumentEntry === selected.docEntry
                                    && item.baseDocumentLineId === -1) {
                                    selected.paidTotal += item.amount;
                                }
                            }
                            if (selected.paidTotal >= selected.documentTotal) {
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

        /** 单据收款-销售发票 */
        export class SalesInvoiceReceiptService
            extends ibas.ServiceWithResultApplication<ibas.IView, receiptpayment.app.IDocumentReceiptContract, receiptpayment.bo.IPaymentItem[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "69c17140-d3e6-4b95-ba68-a72cbbbd83e8";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_receipt_salesinvoice";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesInvoiceReceiptService.APPLICATION_ID;
                this.name = SalesInvoiceReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(["sales_receipt", "bo_salesinvoice"]);
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
                condition.alias = sales.bo.SalesInvoice.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesInvoice.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未结算的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesInvoice.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.CLOSED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesInvoice.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesInvoice.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(contract.receipt.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.receipt.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesInvoice.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = contract.receipt.businessPartnerCode;
                // 未收全款的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesInvoice.PROPERTY_DOCUMENTTOTAL_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = sales.bo.SalesInvoice.PROPERTY_PAIDTOTAL_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<sales.bo.SalesInvoice>({
                    boCode: sales.bo.BO_CODE_SALESINVOICE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<sales.bo.SalesInvoice>): void {
                        for (let selected of selecteds) {
                            for (let item of contract.receipt.receiptItems) {
                                if (item.baseDocumentType === selected.objectCode
                                    && item.baseDocumentEntry === selected.docEntry
                                    && item.baseDocumentLineId === -1) {
                                    selected.paidTotal += item.amount;
                                }
                            }
                            if (selected.paidTotal >= selected.documentTotal) {
                                continue;
                            }
                            if ((selected.documentTotal - selected.paidTotal - selected.downPaymentTotal) <= 0) {
                                continue;
                            }
                            let item: receiptpayment.bo.ReceiptItem = contract.receipt.receiptItems.create();
                            item.baseDocumentType = selected.objectCode;
                            item.baseDocumentEntry = selected.docEntry;
                            item.baseDocumentLineId = -1;
                            item.consumer = selected.consumer;
                            item.amount = selected.documentTotal - selected.paidTotal - selected.downPaymentTotal;
                            item.currency = selected.documentCurrency;
                        }
                        that.fireCompleted(contract.receipt.receiptItems);
                    }
                });
            }
        }
        /** 单据收款-销售发票 */
        export class SalesInvoiceReceiptServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesInvoiceReceiptService.APPLICATION_ID;
                this.name = SalesInvoiceReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesinvoice");
                this.proxy = receiptpayment.app.DocumentReceiptServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesInvoiceReceiptService();
            }
        }

        /** 单据收款-预收款申请 */
        export class DownPaymentRequestReceiptService
            extends ibas.ServiceWithResultApplication<ibas.IView, receiptpayment.app.IDocumentReceiptContract, receiptpayment.bo.IPaymentItem[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "11e482b7-09a7-47d7-8f8c-c205451f7f73";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_receipt_downpaymentrequest";
            /** 构造函数 */
            constructor() {
                super();
                this.id = DownPaymentRequestReceiptService.APPLICATION_ID;
                this.name = DownPaymentRequestReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(["sales_receipt", "bo_downpaymentrequest_ap"]);
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
                condition.alias = sales.bo.DownPaymentRequest.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.DownPaymentRequest.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未结算的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.DownPaymentRequest.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.CLOSED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = sales.bo.DownPaymentRequest.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = sales.bo.DownPaymentRequest.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(contract.receipt.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.receipt.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.DownPaymentRequest.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = contract.receipt.businessPartnerCode;
                // 未收全款的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.DownPaymentRequest.PROPERTY_DOCUMENTTOTAL_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = sales.bo.DownPaymentRequest.PROPERTY_PAIDTOTAL_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<sales.bo.IDownPaymentRequest>({
                    boCode: sales.bo.BO_CODE_DOWNPAYMNETREQUEST,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<sales.bo.IDownPaymentRequest>): void {
                        for (let selected of selecteds) {
                            for (let item of contract.receipt.receiptItems) {
                                if (item.baseDocumentType === selected.objectCode
                                    && item.baseDocumentEntry === selected.docEntry
                                    && item.baseDocumentLineId === -1) {
                                    selected.paidTotal += item.amount;
                                }
                            }
                            if (selected.paidTotal >= selected.documentTotal) {
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
        /** 单据收款-预收款申请 */
        export class DownPaymentRequestReceiptServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = DownPaymentRequestReceiptService.APPLICATION_ID;
                this.name = DownPaymentRequestReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_downpaymentrequest_ar");
                this.proxy = receiptpayment.app.DocumentReceiptServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new DownPaymentRequestReceiptService();
            }
        }

        /** 单据收款-销售预留发票 */
        export class SalesReserveInvoiceReceiptService
            extends ibas.ServiceWithResultApplication<ibas.IView, receiptpayment.app.IDocumentReceiptContract, receiptpayment.bo.IPaymentItem[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "a4aa7401-35b4-4cfd-b1e8-7c653c9c20c9";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_receipt_salesreserveinvoice";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReserveInvoiceReceiptService.APPLICATION_ID;
                this.name = SalesReserveInvoiceReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(["sales_receipt", "bo_salesreserveinvoice"]);
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
                condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未结算的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.CLOSED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(contract.receipt.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.receipt.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = contract.receipt.businessPartnerCode;
                // 未收全款的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_DOCUMENTTOTAL_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = sales.bo.SalesReserveInvoice.PROPERTY_PAIDTOTAL_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<sales.bo.ISalesReserveInvoice>({
                    boCode: sales.bo.BO_CODE_SALESINVOICE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<sales.bo.ISalesReserveInvoice>): void {
                        for (let selected of selecteds) {
                            for (let item of contract.receipt.receiptItems) {
                                if (item.baseDocumentType === selected.objectCode
                                    && item.baseDocumentEntry === selected.docEntry
                                    && item.baseDocumentLineId === -1) {
                                    selected.paidTotal += item.amount;
                                }
                            }
                            if (selected.paidTotal >= selected.documentTotal) {
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
        /** 单据收款-销售预留发票 */
        export class SalesReserveInvoiceReceiptServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReserveInvoiceReceiptService.APPLICATION_ID;
                this.name = SalesReserveInvoiceReceiptService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesreserveinvoice");
                this.proxy = receiptpayment.app.DocumentReceiptServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesReserveInvoiceReceiptService();
            }
        }
    }
}