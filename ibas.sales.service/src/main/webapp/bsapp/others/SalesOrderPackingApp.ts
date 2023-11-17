/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class SalesOrderPackingService extends ibas.ServiceApplication<ibas.IView, materials.app.IMaterialPackingTarget> {
            /** 应用标识 */
            static APPLICATION_ID: string = "53aa80eb-0b3c-45d4-b377-5f09f0c63127";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesorderpacking";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesOrderPackingService.APPLICATION_ID;
                this.name = SalesOrderPackingService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
            }
            protected runService(contract: materials.app.IMaterialPackingTarget): void {
                if (contract?.toDelivery instanceof Array) {
                    this.toDeliveryOrder(contract.toDelivery, contract.onDelivered);
                } else {
                    let criteria: ibas.ICriteria = new ibas.Criteria();
                    let condition: ibas.ICondition = criteria.conditions.create();
                    // 未取消的
                    condition.alias = bo.SalesOrder.PROPERTY_CANCELED_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = ibas.emYesNo.NO.toString();
                    // 未删除的
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesOrder.PROPERTY_DELETED_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = ibas.emYesNo.NO.toString();
                    // 仅下达的
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesOrder.PROPERTY_DOCUMENTSTATUS_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = ibas.emDocumentStatus.RELEASED.toString();
                    // 审批通过的或未进审批
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesOrder.PROPERTY_APPROVALSTATUS_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = ibas.emApprovalStatus.APPROVED.toString();
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesOrder.PROPERTY_APPROVALSTATUS_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                    if (contract.criteria instanceof Array && contract.criteria.length > 0) {
                        let count: number = criteria.conditions.length;
                        if (count > 2) {
                            criteria.conditions.firstOrDefault().bracketOpen += 1;
                            criteria.conditions.lastOrDefault().bracketClose += 1;
                        }
                        for (let item of contract.criteria) {
                            criteria.conditions.add(item);
                        }
                        if (criteria.conditions.length > count + 1) {
                            criteria.conditions[count].bracketOpen += 1;
                            criteria.conditions.lastOrDefault().bracketClose += 1;
                        }
                    } else if (contract.criteria instanceof ibas.Criteria) {
                        let count: number = criteria.conditions.length;
                        if (count > 2) {
                            criteria.conditions.firstOrDefault().bracketOpen += 1;
                            criteria.conditions.lastOrDefault().bracketClose += 1;
                        }
                        for (let item of contract.criteria.conditions) {
                            criteria.conditions.add(item);
                        }
                        if (criteria.conditions.length > count + 1) {
                            criteria.conditions[count].bracketOpen += 1;
                            criteria.conditions.lastOrDefault().bracketClose += 1;
                        }
                    }
                    // 物料
                    let cCrteria: ibas.IChildCriteria = criteria.childCriterias.create();
                    cCrteria.propertyPath = bo.SalesOrder.PROPERTY_SALESORDERITEMS_NAME;
                    cCrteria.onlyHasChilds = true;
                    condition = cCrteria.conditions.create();
                    condition.alias = bo.SalesOrderItem.PROPERTY_CLOSEDQUANTITY_NAME;
                    condition.comparedAlias = bo.SalesOrderItem.PROPERTY_QUANTITY_NAME;
                    condition.operation = ibas.emConditionOperation.LESS_THAN;
                    if (contract.criteria instanceof ibas.Criteria) {
                        for (let item of contract.criteria.childCriterias) {
                            for (let cItem of item.conditions) {
                                cCrteria.conditions.add(cItem);
                            }
                        }
                    }
                    // 调用选择服务
                    let that: this = this;
                    if (contract.isFetchAll) {
                        let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                        boRepository.fetchSalesOrder({
                            criteria: criteria,
                            onCompleted: (opRslt) => {
                                that.onPicked(opRslt.resultObjects, contract.onPicked);
                                that.destroy();
                            }
                        });
                    } else {
                        ibas.servicesManager.runChooseService<bo.SalesOrder>({
                            boCode: bo.SalesOrder.BUSINESS_OBJECT_CODE,
                            chooseType: ibas.emChooseType.MULTIPLE,
                            criteria: criteria,
                            onCompleted(selecteds: ibas.IList<bo.SalesOrder>): void {
                                that.onPicked(selecteds, contract.onPicked);
                                that.destroy();
                            }
                        });
                    }
                }
            }
            protected viewShowed(): void {
            }
            protected toDeliveryOrder(pickLines: materials.bo.IPickListsLine[], onDelivered?: (targets: materials.bo.IPickListsLine[] | Error) => void): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                for (let item of pickLines) {
                    if (!ibas.strings.equals(item.baseDocumentType, ibas.config.applyVariables(bo.BO_CODE_SALESORDER))) {
                        continue;
                    }
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = bo.SalesOrder.PROPERTY_DOCENTRY_NAME;
                    condition.value = item.baseDocumentEntry.toString();
                    condition.relationship = ibas.emConditionRelationship.OR;
                }
                if (criteria.conditions.length === 0) {
                    if (onDelivered instanceof Function) {
                        onDelivered(new Error(ibas.i18n.prop("materials_no_picklistline_to_be_delivery", ibas.i18n.prop("bo_salesdelivery"))));
                    }
                    return;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesOrder({
                    criteria: criteria,
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let order: bo.SalesOrder;
                            let result: bo.SalesDelivery;
                            let results: ibas.IList<bo.SalesDelivery> = new ibas.ArrayList<bo.SalesDelivery>();
                            for (let pickLine of pickLines) {
                                order = opRslt.resultObjects.firstOrDefault(c =>
                                    c.objectCode === pickLine.baseDocumentType && c.docEntry === pickLine.baseDocumentEntry);
                                if (ibas.objects.isNull(order)) {
                                    // 类型未找到
                                    continue;
                                }
                                result = results.firstOrDefault(c => c.customerCode === order.customerCode);
                                if (ibas.objects.isNull(result)) {
                                    // 按客户合单
                                    result = new bo.SalesDelivery();
                                    result.customerCode = order.customerCode;
                                    result.customerName = order.customerName;
                                    bo.baseDocument(result, order);
                                    results.add(result);
                                }
                                for (let orderLine of order.salesOrderItems) {
                                    if (orderLine.objectCode === pickLine.baseDocumentType
                                        && orderLine.docEntry === pickLine.baseDocumentEntry
                                        && orderLine.lineId === pickLine.baseDocumentLineId) {
                                        let resultLine: bo.SalesDeliveryItem = result.salesDeliveryItems.create();
                                        bo.baseDocumentItem(resultLine, orderLine);
                                        resultLine.quantity = pickLine.pickQuantity;
                                        let uomRate: number = pickLine.uomRate > 0 ? pickLine.uomRate : 1;
                                        resultLine.quantity = ibas.numbers.round(pickLine.pickQuantity / uomRate);
                                        resultLine.inventoryQuantity = pickLine.pickQuantity;
                                        for (const materialBatch of pickLine.materialBatches) {
                                            let itemBatch: materials.bo.IMaterialBatchItem = resultLine.materialBatches.create();
                                            itemBatch.batchCode = materialBatch.batchCode;
                                            itemBatch.quantity = materialBatch.quantity;
                                        }
                                        for (const materialSerial of pickLine.materialSerials) {
                                            let itemSerial: materials.bo.IMaterialSerialItem = resultLine.materialSerials.create();
                                            itemSerial.serialCode = materialSerial.serialCode;
                                        }
                                    }
                                }
                            }
                            if (results.length > 1) {
                                if (onDelivered instanceof Function) {
                                    onDelivered(new Error(ibas.i18n.prop("sales_material_packing_cannot_multiple_customer")));
                                }
                                return;
                            }
                            for (let item of results) {
                                ibas.servicesManager.runEditService<bo.SalesDelivery>({
                                    boCode: bo.SalesDelivery.BUSINESS_OBJECT_CODE,
                                    editData: item,
                                    when: "SAVED",
                                    onCompleted: async (result: bo.SalesDelivery) => {
                                        let closedLines: ibas.ArrayList<materials.bo.IPickListsLine> = new ibas.ArrayList();
                                        if (!ibas.objects.isNull(result)) {
                                            for (const item of result.salesDeliveryItems) {
                                                let line: materials.bo.IPickListsLine = pickLines.find(c => ibas.strings.equals(c.baseDocumentType, item.baseDocumentType)
                                                    && c.baseDocumentEntry === item.baseDocumentEntry && c.baseDocumentLineId === item.baseDocumentLineId
                                                );
                                                if (!ibas.objects.isNull(line)) {
                                                    line.closedQuantity = item.inventoryQuantity;
                                                    closedLines.add(line);
                                                }
                                            }
                                        }
                                        if (onDelivered instanceof Function) {
                                            onDelivered(closedLines);
                                        }
                                    }
                                });
                            }
                        } catch (error) {
                            this.messages(error);
                        }
                    }
                });
            }
            protected onPicked(selecteds: ibas.IList<bo.SalesOrder>, onPicked?: (targets: materials.app.IPickListsTarget[]) => void): void {
                let results: ibas.IList<materials.app.IPickListsTarget> = new ibas.ArrayList<materials.app.IPickListsTarget>();
                for (let selected of selecteds) {
                    for (let item of selected.salesOrderItems) {
                        results.add({
                            /** 业务伙伴编码 */
                            cardCode: selected.customerCode,
                            /** 业务伙伴名称 */
                            cardName: selected.customerName,
                            /** 单据日期 */
                            documentDate: selected.documentDate,
                            /** 交货/到期日期 */
                            deliveryDate: selected.deliveryDate,
                            /** 备注 */
                            remarks: selected.remarks,
                            /** 基于类型 */
                            baseDocumentType: item.objectCode,
                            /** 基于标识 */
                            baseDocumentEntry: item.docEntry,
                            /** 基于行号 */
                            baseDocumentLineId: item.lineId,
                            /** 物料编码 */
                            itemCode: item.itemCode,
                            /** 未清数量 */
                            unclosedQuantity: item.quantity,
                            /** 单位 */
                            uom: item.uom,
                            /** 库存单位 */
                            inventoryUOM: item.inventoryUOM,
                            /** 单位换算率 */
                            uomRate: item.uomRate,
                            /** 库存数量 */
                            inventoryQuantity: item.inventoryQuantity,
                            /** 仓库 */
                            warehouse: item.warehouse,
                            /** 物料/服务描述 */
                            itemDescription: item.itemDescription,
                            /** 物料标识 */
                            itemSign: item.itemSign,
                            /** 序号管理 */
                            serialManagement: item.serialManagement,
                            /** 批号管理 */
                            batchManagement: item.batchManagement,
                        });
                    }
                }
                if (onPicked instanceof Function) {
                    onPicked(results);
                }
            }
        }
        export class SalesOrderPackingServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesOrderPackingService.APPLICATION_ID;
                this.name = SalesOrderPackingService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = materials.app.MaterialPackingTargetServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new SalesOrderPackingService();
            }
        }
    }
}