/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 编辑应用-销售退货 */
        export class SalesReturnEditApp extends ibas.BOEditApplication<ISalesReturnEditView, bo.SalesReturn> {
            /** 应用标识 */
            static APPLICATION_ID: string = "b1b7d93c-ab24-4e3b-af95-810fdf3f2622";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesreturn_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesReturn.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnEditApp.APPLICATION_ID;
                this.name = SalesReturnEditApp.APPLICATION_NAME;
                this.boCode = SalesReturnEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addSalesReturnItemEvent = this.addSalesReturnItem;
                this.view.removeSalesReturnItemEvent = this.removeSalesReturnItem;
                this.view.chooseSalesReturnCustomerEvent = this.chooseSalesReturnCustomer;
                this.view.chooseSalesReturnContactPersonEvent = this.chooseSalesReturnContactPerson;
                this.view.chooseSalesReturnPriceListEvent = this.chooseSalesReturnPriceList;
                this.view.chooseSalesReturnItemMaterialEvent = this.chooseSalesReturnItemMaterial;
                this.view.chooseSalesReturnItemWarehouseEvent = this.chooseSalesReturnItemWarehouse;
                this.view.chooseSalesReturnItemMaterialBatchEvent = this.createSalesReturnLineMaterialBatch;
                this.view.chooseSalesReturnItemMaterialSerialEvent = this.createSalesReturnLineMaterialSerial;
                this.view.chooseSalesReturnSalesOrderEvent = this.chooseSalesReturnSalesOrder;
                this.view.chooseSalesReturnSalesDeliveryEvent = this.chooseSalesReturnSalesDelivery;
                this.view.editShippingAddressesEvent = this.editShippingAddresses;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.SalesReturn();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showSalesReturn(this.editData);
                this.view.showSalesReturnItems(this.editData.salesReturnItems.filterDeleted());
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.SalesReturn): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.SalesReturn)) {
                    let data: bo.SalesReturn = arguments[0];
                    // 新对象直接编辑
                    if (data.isNew) {
                        that.editData = data;
                        that.show();
                        return;
                    }
                    // 尝试重新查询编辑对象
                    let criteria: ibas.ICriteria = data.criteria();
                    if (!ibas.objects.isNull(criteria) && criteria.conditions.length > 0) {
                        // 有效的查询对象查询
                        let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                        boRepository.fetchSalesReturn({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.SalesReturn>): void {
                                let data: bo.SalesReturn;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.SalesReturn)) {
                                    // 查询到了有效数据
                                    that.editData = data;
                                    that.show();
                                } else {
                                    // 数据重新检索无效
                                    that.messages({
                                        type: ibas.emMessageType.WARNING,
                                        message: ibas.i18n.prop("shell_data_deleted_and_created"),
                                        onCompleted(): void {
                                            that.show();
                                        }
                                    });
                                }
                            }
                        });
                        // 开始查询数据
                        return;
                    }
                }
                super.run.apply(this, arguments);
            }
            /** 待编辑的数据 */
            protected editData: bo.SalesReturn;
            protected lineEditData: bo.SalesDeliveryItem;
            /** 保存数据 */
            protected saveData(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.saveSalesReturn({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesReturn>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                // 删除成功，释放当前对象
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                                that.editData = undefined;
                            } else {
                                // 替换编辑对象
                                that.editData = opRslt.resultObjects.firstOrDefault();
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                            }
                            // 刷新当前视图
                            that.viewShowed();
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_saving_data"));
            }
            /** 删除数据 */
            protected deleteData(): void {
                let that: this = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_delete_continue"),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action === ibas.emMessageAction.YES) {
                            that.editData.delete();
                            that.saveData();
                        }
                    }
                });
            }
            /** 新建数据，参数1：是否克隆 */
            protected createData(clone: boolean): void {
                let that: this = this;
                let createData: Function = function (): void {
                    if (clone) {
                        // 克隆对象
                        that.editData = that.editData.clone();
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_cloned_new"));
                        that.viewShowed();
                    } else {
                        // 新建对象
                        that.editData = new bo.SalesReturn();
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                        that.viewShowed();
                    }
                };
                if (that.editData.isDirty) {
                    this.messages({
                        type: ibas.emMessageType.QUESTION,
                        title: ibas.i18n.prop(this.name),
                        message: ibas.i18n.prop("shell_data_not_saved_continue"),
                        actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                        onCompleted(action: ibas.emMessageAction): void {
                            if (action === ibas.emMessageAction.YES) {
                                createData();
                            }
                        }
                    });
                } else {
                    createData();
                }
            }
            /** 选择销售退货客户事件 */
            private chooseSalesReturnCustomer(): void {
                let items: bo.SalesReturnItem[] = this.editData.salesReturnItems.where(c => !ibas.strings.isEmpty(c.baseDocumentType));
                if (items.length > 0) {
                    this.messages({
                        type: ibas.emMessageType.WARNING,
                        message: ibas.i18n.prop("sales_remove_base_items_continue"),
                        actions: [
                            ibas.emMessageAction.YES,
                            ibas.emMessageAction.NO,
                        ],
                        onCompleted: (action) => {
                            if (action === ibas.emMessageAction.YES) {
                                this.removeSalesReturnItem(items);
                                this.chooseSalesReturnCustomer();
                            }
                        }
                    });
                    return;
                }
                let that: this = this;
                ibas.servicesManager.runChooseService<businesspartner.bo.ICustomer>({
                    boCode: businesspartner.bo.BO_CODE_CUSTOMER,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: businesspartner.app.conditions.customer.create(),
                    onCompleted(selecteds: ibas.IList<businesspartner.bo.ICustomer>): void {
                        let selected: businesspartner.bo.ICustomer = selecteds.firstOrDefault();
                        that.editData.customerCode = selected.code;
                        that.editData.customerName = selected.name;
                        that.editData.priceList = selected.priceList;
                        that.editData.contactPerson = selected.contactPerson;
                        that.editData.documentCurrency = selected.currency;
                    }
                });
            }
            /** 选择销售退货价格清单事件 */
            private chooseSalesReturnPriceList(): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IMaterialPriceList>({
                    boCode: materials.bo.BO_CODE_MATERIALPRICELIST,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: materials.app.conditions.materialpricelist.create(),
                    onCompleted(selecteds: ibas.IList<materials.bo.IMaterialPriceList>): void {
                        let selected: materials.bo.IMaterialPriceList = selecteds.firstOrDefault();
                        that.editData.priceList = selected.objectKey;
                        that.editData.documentCurrency = selected.currency;
                    }
                });
            }
            /** 选择销售退货物料事件 */
            private chooseSalesReturnItemMaterial(caller: bo.SalesReturnItem): void {
                let that: this = this;
                let condition: ibas.ICondition;
                let conditions: ibas.IList<ibas.ICondition> = materials.app.conditions.product.create();
                // 添加价格清单条件
                if (this.editData.priceList > 0) {
                    condition = new ibas.Condition();
                    condition.alias = materials.app.conditions.product.CONDITION_ALIAS_PRICELIST;
                    condition.value = this.editData.priceList.toString();
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.relationship = ibas.emConditionRelationship.AND;
                    conditions.add(condition);
                }
                // 添加仓库条件
                if (!ibas.objects.isNull(caller) && !ibas.strings.isEmpty(caller.warehouse)) {
                    condition = new ibas.Condition();
                    condition.alias = materials.app.conditions.product.CONDITION_ALIAS_WAREHOUSE;
                    condition.value = caller.warehouse;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.relationship = ibas.emConditionRelationship.AND;
                    conditions.add(condition);
                } else if (!ibas.strings.isEmpty(this.view.defaultWarehouse)) {
                    condition = new ibas.Condition();
                    condition.alias = materials.app.conditions.product.CONDITION_ALIAS_WAREHOUSE;
                    condition.value = this.view.defaultWarehouse;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.relationship = ibas.emConditionRelationship.AND;
                    conditions.add(condition);
                }
                // 销售物料
                condition = new ibas.Condition();
                condition.alias = materials.app.conditions.product.CONDITION_ALIAS_SALES_ITEM;
                condition.value = ibas.emYesNo.YES.toString();
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.relationship = ibas.emConditionRelationship.AND;
                conditions.add(condition);
                // 调用选择服务
                ibas.servicesManager.runChooseService<materials.bo.IProduct>({
                    boCode: materials.bo.BO_CODE_PRODUCT,
                    criteria: conditions,
                    onCompleted(selecteds: ibas.IList<materials.bo.IProduct>): void {
                        // 获取触发的对象
                        let index: number = that.editData.salesReturnItems.indexOf(caller);
                        let item: bo.SalesReturnItem = that.editData.salesReturnItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesReturnItems.create();
                                created = true;
                            }
                            item.itemCode = selected.code;
                            item.itemDescription = selected.name;
                            item.itemSign = selected.sign;
                            item.serialManagement = selected.serialManagement;
                            item.batchManagement = selected.batchManagement;
                            item.warehouse = selected.warehouse;
                            item.quantity = 1;
                            item.uom = selected.inventoryUOM;
                            item.price = selected.price;
                            item.currency = selected.currency;
                            if (ibas.strings.isEmpty(item.warehouse) && !ibas.strings.isEmpty(that.view.defaultWarehouse)) {
                                item.warehouse = that.view.defaultWarehouse;
                            }
                            if (!ibas.strings.isEmpty(selected.salesTaxGroup)) {
                                item.tax = selected.salesTaxGroup;
                            }
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showSalesReturnItems(that.editData.salesReturnItems.filterDeleted());
                        }
                    }
                });
            }
            private chooseSalesReturnItemWarehouse(caller: bo.SalesReturnItem): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IWarehouse>({
                    boCode: materials.bo.BO_CODE_WAREHOUSE,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: materials.app.conditions.warehouse.create(),
                    onCompleted(selecteds: ibas.IList<materials.bo.IWarehouse>): void {
                        // 获取触发的对象
                        let index: number = that.editData.salesReturnItems.indexOf(caller);
                        let item: bo.SalesReturnItem = that.editData.salesReturnItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesReturnItems.create();
                                created = true;
                            }
                            item.warehouse = selected.code;
                            that.view.defaultWarehouse = item.warehouse;
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showSalesReturnItems(that.editData.salesReturnItems.filterDeleted());
                        }
                    }
                });
            }
            /** 添加销售退货-行事件 */
            private addSalesReturnItem(): void {
                this.editData.salesReturnItems.create();
                // 仅显示没有标记删除的
                this.view.showSalesReturnItems(this.editData.salesReturnItems.filterDeleted());
            }
            /** 删除销售退货-行事件 */
            private removeSalesReturnItem(items: bo.SalesReturnItem[]): void {
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                // 移除项目
                for (let item of items) {
                    if (this.editData.salesReturnItems.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesReturnItems.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showSalesReturnItems(this.editData.salesReturnItems.filterDeleted());
            }
            /** 选择物料批次信息 */
            private createSalesReturnLineMaterialBatch(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialBatchContract> = new ibas.ArrayList<materials.app.IMaterialBatchContract>();
                for (let item of this.editData.salesReturnItems) {
                    contracts.add({
                        batchManagement: item.batchManagement,
                        itemCode: item.itemCode,
                        itemDescription: item.itemDescription,
                        warehouse: item.warehouse,
                        quantity: item.quantity,
                        uom: item.uom,
                        materialBatches: item.materialBatches,
                    });
                }
                ibas.servicesManager.runApplicationService<materials.app.IMaterialBatchContract[]>({
                    proxy: new materials.app.MaterialBatchReceiptServiceProxy(contracts)
                });
            }
            /** 选择物料序列信息 */
            private createSalesReturnLineMaterialSerial(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialSerialContract> = new ibas.ArrayList<materials.app.IMaterialSerialContract>();
                for (let item of this.editData.salesReturnItems) {
                    contracts.add({
                        serialManagement: item.serialManagement,
                        itemCode: item.itemCode,
                        itemDescription: item.itemDescription,
                        warehouse: item.warehouse,
                        quantity: item.quantity,
                        uom: item.uom,
                        materialSerials: item.materialSerials
                    });
                }
                ibas.servicesManager.runApplicationService<materials.app.IMaterialSerialContract[]>({
                    proxy: new materials.app.MaterialSerialReceiptServiceProxy(contracts)
                });
            }
            /** 选择销售退货项目-销售订单事件 */
            private chooseSalesReturnSalesOrder(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesdelivery_customercode")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = ibas.BO_PROPERTY_NAME_CANCELED;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = ibas.BO_PROPERTY_NAME_DELETED;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 非计划的
                condition = criteria.conditions.create();
                condition.alias = ibas.BO_PROPERTY_NAME_DOCUMENTSTATUS;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.PLANNED.toString();
                // 当前供应商的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesOrder.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = this.editData.customerCode;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.SalesOrder>({
                    boCode: bo.SalesOrder.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.SalesOrder>): void {
                        for (let selected of selecteds) {
                            if (!ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                continue;
                            }
                            that.editData.baseDocument(selected);
                        }
                        that.view.showSalesReturnItems(that.editData.salesReturnItems.filterDeleted());
                    }
                });
            }
            /** 选择销售退货项目-销售交货事件 */
            private chooseSalesReturnSalesDelivery(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesdelivery_customercode")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = ibas.BO_PROPERTY_NAME_CANCELED;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = ibas.BO_PROPERTY_NAME_DELETED;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 非计划的
                condition = criteria.conditions.create();
                condition.alias = ibas.BO_PROPERTY_NAME_DOCUMENTSTATUS;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.PLANNED.toString();
                // 当前供应商的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesDelivery.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = this.editData.customerCode;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.SalesDelivery>({
                    boCode: bo.SalesDelivery.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.SalesDelivery>): void {
                        for (let selected of selecteds) {
                            if (!ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                continue;
                            }
                            that.editData.baseDocument(selected);
                        }
                        that.view.showSalesReturnItems(that.editData.salesReturnItems.filterDeleted());
                    }
                });
            }
            /** 选择联系人 */
            private chooseSalesReturnContactPerson(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesreturn_suppliercode")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = businesspartner.bo.ContactPerson.PROPERTY_OWNERTYPE_NAME;
                condition.value = businesspartner.bo.emBusinessPartnerType.CUSTOMER.toString();
                condition = criteria.conditions.create();
                condition.alias = businesspartner.bo.ContactPerson.PROPERTY_BUSINESSPARTNER_NAME;
                condition.value = this.editData.customerCode;
                condition = criteria.conditions.create();
                condition.alias = businesspartner.bo.ContactPerson.PROPERTY_ACTIVATED_NAME;
                condition.value = ibas.emYesNo.YES.toString();
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<businesspartner.bo.IContactPerson>({
                    boCode: businesspartner.bo.BO_CODE_CONTACTPERSON,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<businesspartner.bo.IContactPerson>): void {
                        let selected: businesspartner.bo.IContactPerson = selecteds.firstOrDefault();
                        that.editData.contactPerson = selected.objectKey;
                    }
                });
            }
            private editShippingAddresses(): void {
                let app: ShippingAddressesEditApp = new ShippingAddressesEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(this.editData.shippingAddresss);
            }
        }
        /** 视图-销售退货 */
        export interface ISalesReturnEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showSalesReturn(data: bo.SalesReturn): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加销售退货-行事件 */
            addSalesReturnItemEvent: Function;
            /** 删除销售退货-行事件 */
            removeSalesReturnItemEvent: Function;
            /** 显示数据 */
            showSalesReturnItems(datas: bo.SalesReturnItem[]): void;
            /** 选择销售退货客户事件 */
            chooseSalesReturnCustomerEvent: Function;
            /** 选择销售退货联系人信息 */
            chooseSalesReturnContactPersonEvent: Function;
            /** 选择销售退货价格清单事件 */
            chooseSalesReturnPriceListEvent: Function;
            /** 选择销售退货物料事件 */
            chooseSalesReturnItemMaterialEvent: Function;
            /** 选择销售退货仓库事件 */
            chooseSalesReturnItemWarehouseEvent: Function;
            /** 选择销售退货单行物料批次事件 */
            chooseSalesReturnItemMaterialBatchEvent: Function;
            /** 选择销售退货行物料序列事件 */
            chooseSalesReturnItemMaterialSerialEvent: Function;
            /** 选择销售退货项目-销售订单事件 */
            chooseSalesReturnSalesOrderEvent: Function;
            /** 选择销售退货项目-销售交货事件 */
            chooseSalesReturnSalesDeliveryEvent: Function;
            /** 编辑地址事件 */
            editShippingAddressesEvent: Function;
            /** 默认仓库 */
            defaultWarehouse: string;
        }
    }
}