/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 单据价格-销售订单 */
        export class SalesOrderMaterialPriceService
            extends ibas.ServiceWithResultApplication<ibas.IView, materials.app.IDocumentMaterialPriceContract, materials.app.IDocumentMaterialPriceData[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "18773411-2eb0-428b-8f99-cb1abd05dbf0";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_materialprice_salesorder";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesOrderMaterialPriceService.APPLICATION_ID;
                this.name = SalesOrderMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("sales_material_price", ibas.i18n.prop("bo_salesorder"));
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
            protected runService(contract: materials.app.IDocumentMaterialPriceContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.result = contract.resultCount;
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
                if (!ibas.strings.isEmpty(contract.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.branch;
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
                // 单据日期
                if (contract.documentDate instanceof Date) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_DOCUMENTDATE_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_EQUAL;
                    condition.value = ibas.dates.toString(contract.documentDate, "yyyy-MM-dd");
                }
                // 当前客户的
                if (!ibas.strings.isEmpty(contract.businessPartnerCode)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesOrder.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.businessPartnerCode;
                }
                // 查询物料
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesOrder.PROPERTY_SALESORDERITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesOrderItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesOrderItem.PROPERTY_DELETED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesOrderItem.PROPERTY_CANCELED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                // 日期排序
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.SalesOrder.PROPERTY_DOCUMENTDATE_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                sort = criteria.sorts.create();
                sort.alias = bo.SalesOrder.PROPERTY_DOCENTRY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 查询数据
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesOrder({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let results: ibas.IList<materials.app.IDocumentMaterialPriceData>
                                = new ibas.ArrayList<materials.app.IDocumentMaterialPriceData>();
                            for (let item of opRslt.resultObjects) {
                                for (let sItem of item.salesOrderItems) {
                                    results.add({
                                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                                        businessPartnerCode: item.customerCode,
                                        businessPartnerName: item.customerName,
                                        documentType: item.objectCode,
                                        documentEntry: item.docEntry,
                                        documentDate: item.documentDate,
                                        documentLineId: sItem.lineId,
                                        itemCode: sItem.itemCode,
                                        itemDescription: sItem.itemDescription,
                                        quantity: sItem.quantity,
                                        uom: sItem.uom,
                                        price: sItem.price,
                                        currency: sItem.currency,
                                        preTaxPrice: sItem.preTaxPrice,
                                        discount: config.isInverseDiscount() ? sItem.inverseDiscount : sItem.discount,
                                        unitPrice: sItem.unitPrice
                                    });
                                }
                            }
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(results);
                            }
                        } catch (error) {
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(error);
                            }
                        }
                    }
                });
            }
        }
        /** 单据价格-销售订单 */
        export class SalesOrderMaterialPriceServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesOrderMaterialPriceService.APPLICATION_ID;
                this.name = SalesOrderMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesorder");
                this.proxy = materials.app.DocumentMaterialPriceServiceProxy;
                this.category = ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, businesspartner.bo.emBusinessPartnerType.CUSTOMER);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesOrderMaterialPriceService();
            }
        }

        /** 单据价格-预收款申请 */
        export class DownPaymentRequestMaterialPriceService
            extends ibas.ServiceWithResultApplication<ibas.IView, materials.app.IDocumentMaterialPriceContract, materials.app.IDocumentMaterialPriceData[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "74b7cfdf-434d-4dfd-b34a-9224c9ac8fa0";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_materialprice_downpaymentrequest";
            /** 构造函数 */
            constructor() {
                super();
                this.id = DownPaymentRequestMaterialPriceService.APPLICATION_ID;
                this.name = DownPaymentRequestMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("sales_material_price", ibas.i18n.prop("bo_downpaymentrequest"));
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
            protected runService(contract: materials.app.IDocumentMaterialPriceContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.result = contract.resultCount;
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
                if (!ibas.strings.isEmpty(contract.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.DownPaymentRequest.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.DownPaymentRequest.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.DownPaymentRequest.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 单据日期
                if (contract.documentDate instanceof Date) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.DownPaymentRequest.PROPERTY_DOCUMENTDATE_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_EQUAL;
                    condition.value = ibas.dates.toString(contract.documentDate, "yyyy-MM-dd");
                }
                // 当前客户的
                if (!ibas.strings.isEmpty(contract.businessPartnerCode)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.DownPaymentRequest.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.businessPartnerCode;
                }
                // 查询物料
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.DownPaymentRequest.PROPERTY_DOWNPAYMNETREQUESTITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                condition = cCriteria.conditions.create();
                condition.alias = bo.DownPaymentRequestItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCriteria.conditions.create();
                condition.alias = bo.DownPaymentRequestItem.PROPERTY_DELETED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                condition = cCriteria.conditions.create();
                condition.alias = bo.DownPaymentRequestItem.PROPERTY_CANCELED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                // 日期排序
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.DownPaymentRequest.PROPERTY_DOCUMENTDATE_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                sort = criteria.sorts.create();
                sort.alias = bo.DownPaymentRequest.PROPERTY_DOCENTRY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 查询数据
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchDownPaymentRequest({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let results: ibas.IList<materials.app.IDocumentMaterialPriceData>
                                = new ibas.ArrayList<materials.app.IDocumentMaterialPriceData>();
                            for (let item of opRslt.resultObjects) {
                                for (let sItem of item.downPaymentRequestItems) {
                                    results.add({
                                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                                        businessPartnerCode: item.customerCode,
                                        businessPartnerName: item.customerName,
                                        documentType: item.objectCode,
                                        documentEntry: item.docEntry,
                                        documentDate: item.documentDate,
                                        documentLineId: sItem.lineId,
                                        itemCode: sItem.itemCode,
                                        itemDescription: sItem.itemDescription,
                                        quantity: sItem.quantity,
                                        uom: sItem.uom,
                                        price: sItem.price,
                                        currency: sItem.currency,
                                        preTaxPrice: sItem.preTaxPrice,
                                        discount: sItem.discount,
                                        unitPrice: sItem.unitPrice
                                    });
                                }
                            }
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(results);
                            }
                        } catch (error) {
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(error);
                            }
                        }
                    }
                });
            }
        }
        /** 单据价格-预收款申请 */
        export class DownPaymentRequestMaterialPriceServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = DownPaymentRequestMaterialPriceService.APPLICATION_ID;
                this.name = DownPaymentRequestMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_downpaymentrequest_ar");
                this.proxy = materials.app.DocumentMaterialPriceServiceProxy;
                this.category = ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, businesspartner.bo.emBusinessPartnerType.CUSTOMER);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new DownPaymentRequestMaterialPriceService();
            }
        }


        /** 单据价格-销售贷项 */
        export class SalesCreditNoteMaterialPriceService
            extends ibas.ServiceWithResultApplication<ibas.IView, materials.app.IDocumentMaterialPriceContract, materials.app.IDocumentMaterialPriceData[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "d331ee5b-a652-4773-b577-d7576e89754b";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_materialprice_salescreditnote";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesCreditNoteMaterialPriceService.APPLICATION_ID;
                this.name = SalesCreditNoteMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("sales_material_price", ibas.i18n.prop("bo_salescreditnote"));
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
            protected runService(contract: materials.app.IDocumentMaterialPriceContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.result = contract.resultCount;
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
                if (!ibas.strings.isEmpty(contract.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesCreditNote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.branch;
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
                // 单据日期
                if (contract.documentDate instanceof Date) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesCreditNote.PROPERTY_DOCUMENTDATE_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_EQUAL;
                    condition.value = ibas.dates.toString(contract.documentDate, "yyyy-MM-dd");
                }
                // 当前客户的
                if (!ibas.strings.isEmpty(contract.businessPartnerCode)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesCreditNote.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.businessPartnerCode;
                }
                // 查询物料
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesCreditNote.PROPERTY_SALESCREDITNOTEITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesCreditNoteItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesCreditNoteItem.PROPERTY_DELETED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesCreditNoteItem.PROPERTY_CANCELED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                // 日期排序
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.SalesCreditNote.PROPERTY_DOCUMENTDATE_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                sort = criteria.sorts.create();
                sort.alias = bo.SalesCreditNote.PROPERTY_DOCENTRY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 查询数据
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesCreditNote({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let results: ibas.IList<materials.app.IDocumentMaterialPriceData>
                                = new ibas.ArrayList<materials.app.IDocumentMaterialPriceData>();
                            for (let item of opRslt.resultObjects) {
                                for (let sItem of item.salesCreditNoteItems) {
                                    results.add({
                                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                                        businessPartnerCode: item.customerCode,
                                        businessPartnerName: item.customerName,
                                        documentType: item.objectCode,
                                        documentEntry: item.docEntry,
                                        documentDate: item.documentDate,
                                        documentLineId: sItem.lineId,
                                        itemCode: sItem.itemCode,
                                        itemDescription: sItem.itemDescription,
                                        quantity: sItem.quantity,
                                        uom: sItem.uom,
                                        price: sItem.price,
                                        currency: sItem.currency,
                                        preTaxPrice: sItem.preTaxPrice,
                                        discount: config.isInverseDiscount() ? sItem.inverseDiscount : sItem.discount,
                                        unitPrice: sItem.unitPrice
                                    });
                                }
                            }
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(results);
                            }
                        } catch (error) {
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(error);
                            }
                        }
                    }
                });
            }
        }
        /** 单据价格-销售退货请求 */
        export class SalesCreditNoteMaterialPriceServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesCreditNoteMaterialPriceService.APPLICATION_ID;
                this.name = SalesCreditNoteMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salescreditnote");
                this.proxy = materials.app.DocumentMaterialPriceServiceProxy;
                this.category = ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, businesspartner.bo.emBusinessPartnerType.CUSTOMER);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesCreditNoteMaterialPriceService();
            }
        }

        /** 单据价格-销售交货 */
        export class SalesDeliveryMaterialPriceService
            extends ibas.ServiceWithResultApplication<ibas.IView, materials.app.IDocumentMaterialPriceContract, materials.app.IDocumentMaterialPriceData[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "2cc07d43-4f53-4ba6-aeef-ef53c6d05ac2";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_materialprice_salesdelivery";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesDeliveryMaterialPriceService.APPLICATION_ID;
                this.name = SalesDeliveryMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("sales_material_price", ibas.i18n.prop("bo_salesdelivery"));
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
            protected runService(contract: materials.app.IDocumentMaterialPriceContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.result = contract.resultCount;
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
                if (!ibas.strings.isEmpty(contract.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesDelivery.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesDelivery.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesDelivery.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 单据日期
                if (contract.documentDate instanceof Date) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesDelivery.PROPERTY_DOCUMENTDATE_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_EQUAL;
                    condition.value = ibas.dates.toString(contract.documentDate, "yyyy-MM-dd");
                }
                // 当前客户的
                if (!ibas.strings.isEmpty(contract.businessPartnerCode)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesDelivery.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.businessPartnerCode;
                }
                // 查询物料
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesDelivery.PROPERTY_SALESDELIVERYITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesDeliveryItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesDeliveryItem.PROPERTY_DELETED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesDeliveryItem.PROPERTY_CANCELED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                // 日期排序
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.SalesDelivery.PROPERTY_DOCUMENTDATE_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                sort = criteria.sorts.create();
                sort.alias = bo.SalesDelivery.PROPERTY_DOCENTRY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 查询数据
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesDelivery({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let results: ibas.IList<materials.app.IDocumentMaterialPriceData>
                                = new ibas.ArrayList<materials.app.IDocumentMaterialPriceData>();
                            for (let item of opRslt.resultObjects) {
                                for (let sItem of item.salesDeliveryItems) {
                                    results.add({
                                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                                        businessPartnerCode: item.customerCode,
                                        businessPartnerName: item.customerName,
                                        documentType: item.objectCode,
                                        documentEntry: item.docEntry,
                                        documentDate: item.documentDate,
                                        documentLineId: sItem.lineId,
                                        itemCode: sItem.itemCode,
                                        itemDescription: sItem.itemDescription,
                                        quantity: sItem.quantity,
                                        uom: sItem.uom,
                                        price: sItem.price,
                                        currency: sItem.currency,
                                        preTaxPrice: sItem.preTaxPrice,
                                        discount: config.isInverseDiscount() ? sItem.inverseDiscount : sItem.discount,
                                        unitPrice: sItem.unitPrice
                                    });
                                }
                            }
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(results);
                            }
                        } catch (error) {
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(error);
                            }
                        }
                    }
                });
            }
        }
        /** 单据价格-销售交货 */
        export class SalesDeliveryMaterialPriceServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesDeliveryMaterialPriceService.APPLICATION_ID;
                this.name = SalesDeliveryMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesdelivery");
                this.proxy = materials.app.DocumentMaterialPriceServiceProxy;
                this.category = ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, businesspartner.bo.emBusinessPartnerType.CUSTOMER);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesDeliveryMaterialPriceService();
            }
        }


        /** 单据价格-销售发票 */
        export class SalesInvoiceMaterialPriceService
            extends ibas.ServiceWithResultApplication<ibas.IView, materials.app.IDocumentMaterialPriceContract, materials.app.IDocumentMaterialPriceData[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "3c51ac70-5772-455c-b335-74a12cf4c9b4";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_materialprice_salesinvoice";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesInvoiceMaterialPriceService.APPLICATION_ID;
                this.name = SalesInvoiceMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("sales_material_price", ibas.i18n.prop("bo_salesinvoice"));
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
            protected runService(contract: materials.app.IDocumentMaterialPriceContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.result = contract.resultCount;
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
                if (!ibas.strings.isEmpty(contract.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 单据日期
                if (contract.documentDate instanceof Date) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesInvoice.PROPERTY_DOCUMENTDATE_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_EQUAL;
                    condition.value = ibas.dates.toString(contract.documentDate, "yyyy-MM-dd");
                }
                // 当前客户的
                if (!ibas.strings.isEmpty(contract.businessPartnerCode)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesInvoice.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.businessPartnerCode;
                }
                // 查询物料
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesInvoice.PROPERTY_SALESINVOICEITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesInvoiceItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesInvoiceItem.PROPERTY_DELETED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesInvoiceItem.PROPERTY_CANCELED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                // 日期排序
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.SalesInvoice.PROPERTY_DOCUMENTDATE_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                sort = criteria.sorts.create();
                sort.alias = bo.SalesInvoice.PROPERTY_DOCENTRY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 查询数据
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesInvoice({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let results: ibas.IList<materials.app.IDocumentMaterialPriceData>
                                = new ibas.ArrayList<materials.app.IDocumentMaterialPriceData>();
                            for (let item of opRslt.resultObjects) {
                                for (let sItem of item.salesInvoiceItems) {
                                    results.add({
                                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                                        businessPartnerCode: item.customerCode,
                                        businessPartnerName: item.customerName,
                                        documentType: item.objectCode,
                                        documentEntry: item.docEntry,
                                        documentDate: item.documentDate,
                                        documentLineId: sItem.lineId,
                                        itemCode: sItem.itemCode,
                                        itemDescription: sItem.itemDescription,
                                        quantity: sItem.quantity,
                                        uom: sItem.uom,
                                        price: sItem.price,
                                        currency: sItem.currency,
                                        preTaxPrice: sItem.preTaxPrice,
                                        discount: config.isInverseDiscount() ? sItem.inverseDiscount : sItem.discount,
                                        unitPrice: sItem.unitPrice
                                    });
                                }
                            }
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(results);
                            }
                        } catch (error) {
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(error);
                            }
                        }
                    }
                });
            }
        }
        /** 单据价格-销售发票 */
        export class SalesInvoiceMaterialPriceServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesInvoiceMaterialPriceService.APPLICATION_ID;
                this.name = SalesInvoiceMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesinvoice");
                this.proxy = materials.app.DocumentMaterialPriceServiceProxy;
                this.category = ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, businesspartner.bo.emBusinessPartnerType.CUSTOMER);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesInvoiceMaterialPriceService();
            }
        }

        /** 单据价格-销售报价 */
        export class SalesQuoteMaterialPriceService
            extends ibas.ServiceWithResultApplication<ibas.IView, materials.app.IDocumentMaterialPriceContract, materials.app.IDocumentMaterialPriceData[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "6dac2996-c188-40db-b744-b0b571eeb0fd";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_materialprice_salesquote";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesQuoteMaterialPriceService.APPLICATION_ID;
                this.name = SalesQuoteMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("sales_material_price", ibas.i18n.prop("bo_salesquote"));
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
            protected runService(contract: materials.app.IDocumentMaterialPriceContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.result = contract.resultCount;
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = sales.bo.SalesQuote.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesQuote.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesQuote.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesQuote.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(contract.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesQuote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesQuote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesQuote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 单据日期
                if (contract.documentDate instanceof Date) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesQuote.PROPERTY_DOCUMENTDATE_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_EQUAL;
                    condition.value = ibas.dates.toString(contract.documentDate, "yyyy-MM-dd");
                }
                // 当前客户的
                if (!ibas.strings.isEmpty(contract.businessPartnerCode)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesQuote.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.businessPartnerCode;
                }
                // 查询物料
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesQuote.PROPERTY_SALESQUOTEITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesQuoteItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesQuoteItem.PROPERTY_DELETED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesQuoteItem.PROPERTY_CANCELED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                // 日期排序
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.SalesQuote.PROPERTY_DOCUMENTDATE_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                sort = criteria.sorts.create();
                sort.alias = bo.SalesQuote.PROPERTY_DOCENTRY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 查询数据
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesQuote({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let results: ibas.IList<materials.app.IDocumentMaterialPriceData>
                                = new ibas.ArrayList<materials.app.IDocumentMaterialPriceData>();
                            for (let item of opRslt.resultObjects) {
                                for (let sItem of item.salesQuoteItems) {
                                    results.add({
                                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                                        businessPartnerCode: item.customerCode,
                                        businessPartnerName: item.customerName,
                                        documentType: item.objectCode,
                                        documentEntry: item.docEntry,
                                        documentDate: item.documentDate,
                                        documentLineId: sItem.lineId,
                                        itemCode: sItem.itemCode,
                                        itemDescription: sItem.itemDescription,
                                        quantity: sItem.quantity,
                                        uom: sItem.uom,
                                        price: sItem.price,
                                        currency: sItem.currency,
                                        preTaxPrice: sItem.preTaxPrice,
                                        discount: config.isInverseDiscount() ? sItem.inverseDiscount : sItem.discount,
                                        unitPrice: sItem.unitPrice
                                    });
                                }
                            }
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(results);
                            }
                        } catch (error) {
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(error);
                            }
                        }
                    }
                });
            }
        }
        /** 单据价格-销售报价 */
        export class SalesQuoteMaterialPriceServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesQuoteMaterialPriceService.APPLICATION_ID;
                this.name = SalesQuoteMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesquote");
                this.proxy = materials.app.DocumentMaterialPriceServiceProxy;
                this.category = ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, businesspartner.bo.emBusinessPartnerType.CUSTOMER);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesQuoteMaterialPriceService();
            }
        }

        /** 单据价格-销售预留发票 */
        export class SalesReserveInvoiceMaterialPriceService
            extends ibas.ServiceWithResultApplication<ibas.IView, materials.app.IDocumentMaterialPriceContract, materials.app.IDocumentMaterialPriceData[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "892f97d1-68f8-4094-b80c-4d2bd760bae9";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_materialprice_salesreserveinvoice";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReserveInvoiceMaterialPriceService.APPLICATION_ID;
                this.name = SalesReserveInvoiceMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("sales_material_price", ibas.i18n.prop("bo_salesreserveinvoice"));
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
            protected runService(contract: materials.app.IDocumentMaterialPriceContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.result = contract.resultCount;
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
                if (!ibas.strings.isEmpty(contract.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 单据日期
                if (contract.documentDate instanceof Date) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_DOCUMENTDATE_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_EQUAL;
                    condition.value = ibas.dates.toString(contract.documentDate, "yyyy-MM-dd");
                }
                // 当前客户的
                if (!ibas.strings.isEmpty(contract.businessPartnerCode)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReserveInvoice.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.businessPartnerCode;
                }
                // 查询物料
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesReserveInvoice.PROPERTY_SALESRESERVEINVOICEITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReserveInvoiceItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReserveInvoiceItem.PROPERTY_DELETED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReserveInvoiceItem.PROPERTY_CANCELED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                // 日期排序
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.SalesReserveInvoice.PROPERTY_DOCUMENTDATE_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                sort = criteria.sorts.create();
                sort.alias = bo.SalesReserveInvoice.PROPERTY_DOCENTRY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 查询数据
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesReserveInvoice({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let results: ibas.IList<materials.app.IDocumentMaterialPriceData>
                                = new ibas.ArrayList<materials.app.IDocumentMaterialPriceData>();
                            for (let item of opRslt.resultObjects) {
                                for (let sItem of item.salesReserveInvoiceItems) {
                                    results.add({
                                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                                        businessPartnerCode: item.customerCode,
                                        businessPartnerName: item.customerName,
                                        documentType: item.objectCode,
                                        documentEntry: item.docEntry,
                                        documentDate: item.documentDate,
                                        documentLineId: sItem.lineId,
                                        itemCode: sItem.itemCode,
                                        itemDescription: sItem.itemDescription,
                                        quantity: sItem.quantity,
                                        uom: sItem.uom,
                                        price: sItem.price,
                                        currency: sItem.currency,
                                        preTaxPrice: sItem.preTaxPrice,
                                        discount: config.isInverseDiscount() ? sItem.inverseDiscount : sItem.discount,
                                        unitPrice: sItem.unitPrice
                                    });
                                }
                            }
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(results);
                            }
                        } catch (error) {
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(error);
                            }
                        }
                    }
                });
            }
        }
        /** 单据价格-销售预留发票 */
        export class SalesReserveInvoiceMaterialPriceServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReserveInvoiceMaterialPriceService.APPLICATION_ID;
                this.name = SalesReserveInvoiceMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesreserveinvoice");
                this.proxy = materials.app.DocumentMaterialPriceServiceProxy;
                this.category = ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, businesspartner.bo.emBusinessPartnerType.CUSTOMER);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesReserveInvoiceMaterialPriceService();
            }
        }

        /** 单据价格-销售退货 */
        export class SalesReturnMaterialPriceService
            extends ibas.ServiceWithResultApplication<ibas.IView, materials.app.IDocumentMaterialPriceContract, materials.app.IDocumentMaterialPriceData[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "1ca2f39d-4ef7-4324-9dea-214fafacaebd";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_materialprice_salesreturn";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnMaterialPriceService.APPLICATION_ID;
                this.name = SalesReturnMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("sales_material_price", ibas.i18n.prop("bo_salesreturn"));
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
            protected runService(contract: materials.app.IDocumentMaterialPriceContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.result = contract.resultCount;
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
                if (!ibas.strings.isEmpty(contract.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturn.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.branch;
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
                // 单据日期
                if (contract.documentDate instanceof Date) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturn.PROPERTY_DOCUMENTDATE_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_EQUAL;
                    condition.value = ibas.dates.toString(contract.documentDate, "yyyy-MM-dd");
                }
                // 当前客户的
                if (!ibas.strings.isEmpty(contract.businessPartnerCode)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturn.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.businessPartnerCode;
                }
                // 查询物料
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesReturn.PROPERTY_SALESRETURNITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReturnItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReturnItem.PROPERTY_DELETED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReturnItem.PROPERTY_CANCELED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                // 日期排序
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.SalesReturn.PROPERTY_DOCUMENTDATE_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                sort = criteria.sorts.create();
                sort.alias = bo.SalesReturn.PROPERTY_DOCENTRY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 查询数据
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesReturn({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let results: ibas.IList<materials.app.IDocumentMaterialPriceData>
                                = new ibas.ArrayList<materials.app.IDocumentMaterialPriceData>();
                            for (let item of opRslt.resultObjects) {
                                for (let sItem of item.salesReturnItems) {
                                    results.add({
                                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                                        businessPartnerCode: item.customerCode,
                                        businessPartnerName: item.customerName,
                                        documentType: item.objectCode,
                                        documentEntry: item.docEntry,
                                        documentDate: item.documentDate,
                                        documentLineId: sItem.lineId,
                                        itemCode: sItem.itemCode,
                                        itemDescription: sItem.itemDescription,
                                        quantity: sItem.quantity,
                                        uom: sItem.uom,
                                        price: sItem.price,
                                        currency: sItem.currency,
                                        preTaxPrice: sItem.preTaxPrice,
                                        discount: config.isInverseDiscount() ? sItem.inverseDiscount : sItem.discount,
                                        unitPrice: sItem.unitPrice
                                    });
                                }
                            }
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(results);
                            }
                        } catch (error) {
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(error);
                            }
                        }
                    }
                });
            }
        }
        /** 单据价格-销售退货 */
        export class SalesReturnMaterialPriceServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnMaterialPriceService.APPLICATION_ID;
                this.name = SalesReturnMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesreturn");
                this.proxy = materials.app.DocumentMaterialPriceServiceProxy;
                this.category = ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, businesspartner.bo.emBusinessPartnerType.CUSTOMER);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesReturnMaterialPriceService();
            }
        }


        /** 单据价格-销售退货请求 */
        export class SalesReturnRequestMaterialPriceService
            extends ibas.ServiceWithResultApplication<ibas.IView, materials.app.IDocumentMaterialPriceContract, materials.app.IDocumentMaterialPriceData[]> {
            /** 应用标识 */
            static APPLICATION_ID: string = "b2fc40c4-252e-4a00-9efa-2510a93eccf9";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_materialprice_salesreturnrequest";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnRequestMaterialPriceService.APPLICATION_ID;
                this.name = SalesReturnRequestMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("sales_material_price", ibas.i18n.prop("bo_salesreturnrequest"));
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
            protected runService(contract: materials.app.IDocumentMaterialPriceContract): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                criteria.result = contract.resultCount;
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = sales.bo.SalesReturnRequest.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturnRequest.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturnRequest.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = sales.bo.SalesReturnRequest.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(contract.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturnRequest.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturnRequest.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturnRequest.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 单据日期
                if (contract.documentDate instanceof Date) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturnRequest.PROPERTY_DOCUMENTDATE_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_EQUAL;
                    condition.value = ibas.dates.toString(contract.documentDate, "yyyy-MM-dd");
                }
                // 当前客户的
                if (!ibas.strings.isEmpty(contract.businessPartnerCode)) {
                    condition = criteria.conditions.create();
                    condition.alias = sales.bo.SalesReturnRequest.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = contract.businessPartnerCode;
                }
                // 查询物料
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesReturnRequest.PROPERTY_SALESRETURNREQUESTITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReturnRequestItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReturnRequestItem.PROPERTY_DELETED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReturnRequestItem.PROPERTY_CANCELED_NAME;
                condition.value = ibas.emYesNo.NO.toString();
                // 日期排序
                let sort: ibas.ISort = criteria.sorts.create();
                sort.alias = bo.SalesReturnRequest.PROPERTY_DOCUMENTDATE_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                sort = criteria.sorts.create();
                sort.alias = bo.SalesReturnRequest.PROPERTY_DOCENTRY_NAME;
                sort.sortType = ibas.emSortType.DESCENDING;
                // 查询数据
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesReturnRequest({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let results: ibas.IList<materials.app.IDocumentMaterialPriceData>
                                = new ibas.ArrayList<materials.app.IDocumentMaterialPriceData>();
                            for (let item of opRslt.resultObjects) {
                                for (let sItem of item.salesReturnRequestItems) {
                                    results.add({
                                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                                        businessPartnerCode: item.customerCode,
                                        businessPartnerName: item.customerName,
                                        documentType: item.objectCode,
                                        documentEntry: item.docEntry,
                                        documentDate: item.documentDate,
                                        documentLineId: sItem.lineId,
                                        itemCode: sItem.itemCode,
                                        itemDescription: sItem.itemDescription,
                                        quantity: sItem.quantity,
                                        uom: sItem.uom,
                                        price: sItem.price,
                                        currency: sItem.currency,
                                        preTaxPrice: sItem.preTaxPrice,
                                        discount: config.isInverseDiscount() ? sItem.inverseDiscount : sItem.discount,
                                        unitPrice: sItem.unitPrice
                                    });
                                }
                            }
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(results);
                            }
                        } catch (error) {
                            if (contract.onCompleted instanceof Function) {
                                contract.onCompleted(error);
                            }
                        }
                    }
                });
            }
        }
        /** 单据价格-销售退货请求 */
        export class SalesReturnRequestMaterialPriceServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnRequestMaterialPriceService.APPLICATION_ID;
                this.name = SalesReturnRequestMaterialPriceService.APPLICATION_NAME;
                this.description = ibas.i18n.prop("bo_salesreturnrequest");
                this.proxy = materials.app.DocumentMaterialPriceServiceProxy;
                this.category = ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, businesspartner.bo.emBusinessPartnerType.CUSTOMER);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesReturnRequestMaterialPriceService();
            }
        }

    }
}