/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 编辑应用-销售订单 */
        export class SalesOrderEditApp extends ibas.BOEditApplication<ISalesOrderEditView, bo.SalesOrder> {
            /** 应用标识 */
            static APPLICATION_ID: string = "87362150-9238-42de-b227-6e9086c660d6";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesorder_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesOrder.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesOrderEditApp.APPLICATION_ID;
                this.name = SalesOrderEditApp.APPLICATION_NAME;
                this.boCode = SalesOrderEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addSalesOrderItemEvent = this.addSalesOrderItem;
                this.view.removeSalesOrderItemEvent = this.removeSalesOrderItem;
                this.view.chooseSalesOrderItemMaterialEvent = this.chooseSalesOrderItemMaterial;
                this.view.chooseSalesOrderCustomerEvent = this.chooseSalesOrderCustomer;
                this.view.chooseSalesOrderContactPersonEvent = this.chooseSalesOrderContactPerson;
                this.view.chooseSalesOrderPriceListEvent = this.chooseSalesOrderPriceList;
                this.view.chooseSalesOrderItemWarehouseEvent = this.chooseSalesOrderItemWarehouse;
                this.view.chooseSalesOrderItemMaterialBatchEvent = this.chooseSalesOrderItemMaterialBatch;
                this.view.chooseSalesOrderItemMaterialSerialEvent = this.chooseSalesOrderItemMaterialSerial;
                this.view.chooseSalesOrderSalesQuoteEvent = this.chooseSalesOrderSalesQuote;
                this.view.receiptSalesOrderEvent = this.receiptSalesOrder;
                this.view.editShippingAddressesEvent = this.editShippingAddresses;
                this.view.showSalesOrderItemExtraEvent = this.showSaleOrderItemExtra;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.SalesOrder();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showSalesOrder(this.editData);
                this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.SalesOrder): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.SalesOrder)) {
                    let data: bo.SalesOrder = arguments[0];
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
                        boRepository.fetchSalesOrder({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.SalesOrder>): void {
                                let data: bo.SalesOrder;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.SalesOrder)) {
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
            protected editData: bo.SalesOrder;
            protected lineEditData: bo.SalesOrderItem;
            /** 保存数据 */
            protected saveData(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.saveSalesOrder({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesOrder>): void {
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
                        that.editData = new bo.SalesOrder();
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
            /** 选择销售订单客户事件 */
            private chooseSalesOrderCustomer(): void {
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
                        that.view.defaultWarehouse = selected.warehouse;
                        // 复制地址
                        if (!ibas.objects.isNull(selected.shipAddress) && selected.shipAddress > 0) {
                            that.messages({
                                type: ibas.emMessageType.QUESTION,
                                message: ibas.i18n.prop("sales_copy_data_continue", ibas.i18n.prop("bo_shippingaddress")),
                                actions: [
                                    ibas.emMessageAction.YES,
                                    ibas.emMessageAction.NO
                                ],
                                onCompleted(action: ibas.emMessageAction): void {
                                    if (action !== ibas.emMessageAction.YES) {
                                        return;
                                    }
                                    for (let index: number = that.editData.shippingAddresss.length - 1; index >= 0; index--) {
                                        let item: bo.ShippingAddress = that.editData.shippingAddresss[index];
                                        if (item.isNew) {
                                            that.editData.shippingAddresss.remove(item);
                                        }
                                    }
                                    let criteria: ibas.ICriteria = new ibas.Criteria();
                                    criteria.result = 1;
                                    let condition: ibas.ICondition = criteria.conditions.create();
                                    condition.alias = "ObjectKey";
                                    condition.value = selected.shipAddress.toString();
                                    let boRepository: businesspartner.bo.IBORepositoryBusinessPartner = ibas.boFactory.create(businesspartner.bo.BO_REPOSITORY_BUSINESSPARTNER);
                                    boRepository.fetchAddress({
                                        criteria: criteria,
                                        onCompleted(opRslt: ibas.IOperationResult<businesspartner.bo.IAddress>): void {
                                            try {
                                                if (opRslt.resultCode !== 0) {
                                                    throw new Error(opRslt.message);
                                                }
                                                if (opRslt.resultObjects.length === 0) {
                                                    return;
                                                }
                                                that.editData.baseAddress(opRslt.resultObjects.firstOrDefault());
                                                that.view.showSalesOrder(that.editData);
                                            } catch (error) {
                                                that.proceeding(error);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
            /** 选择销售订单价格清单事件 */
            private chooseSalesOrderPriceList(): void {
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
            /** 选择销售订单物料事件 */
            private chooseSalesOrderItemMaterial(caller: bo.SalesOrderItem): void {
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
                        let index: number = that.editData.salesOrderItems.indexOf(caller);
                        let item: bo.SalesOrderItem = that.editData.salesOrderItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        ibas.queues.execute(selecteds, (selected, sNext) => {
                            if (selected.phantomItem === ibas.emYesNo.YES) {
                                // 虚拟物料，需要处理子项
                                let criteria: ibas.Criteria = new ibas.Criteria();
                                let condition: ibas.ICondition = criteria.conditions.create();
                                condition.alias = bo.ProductSuit.PROPERTY_PRODUCT_NAME;
                                condition.value = selected.code;
                                condition = criteria.conditions.create();
                                condition.alias = bo.ProductSuit.PROPERTY_ACTIVATED_NAME;
                                condition.value = ibas.emYesNo.YES.toString();
                                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                                boRepository.fetchProductSuitEx({
                                    criteria: criteria,
                                    onCompleted(opRslt: ibas.IOperationResult<bo.IProductSuitEx>): void {
                                        if (opRslt.resultCode !== 0) {
                                            sNext(new Error(opRslt.message));
                                        } else if (opRslt.resultObjects.length === 0) {
                                            sNext(new Error(ibas.i18n.prop("sales_not_found_product_suit_skipped",
                                                ibas.strings.isEmpty(selected.name) ? selected.code : selected.name)));
                                        }
                                        ibas.queues.execute(opRslt.resultObjects, (pData, pNext) => {
                                            that.messages({
                                                type: ibas.emMessageType.QUESTION,
                                                message: ibas.i18n.prop("sales_use_product_suit_version",
                                                    ibas.strings.isEmpty(selected.name) ? selected.code : selected.name, pData.version),
                                                actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                                                /** 调用完成 */
                                                onCompleted(action: ibas.emMessageAction): void {
                                                    if (action !== ibas.emMessageAction.YES) {
                                                        // 不是用继续下一条
                                                        pNext();
                                                    } else {
                                                        // 选择了一条，处理后退出
                                                        let parentItem: bo.SalesOrderItem = null;
                                                        // 清理旧数据，bo对象负责清理关联子项
                                                        if (!ibas.objects.isNull(item)) {
                                                            parentItem = item;
                                                            if (!ibas.strings.isEmpty(parentItem.lineSign)) {
                                                                for (let i: number = that.editData.salesOrderItems.length - 1; i >= 0; i--) {
                                                                    let tItem: bo.SalesOrderItem = that.editData.salesOrderItems[i];
                                                                    if (tItem.parentLineSign === parentItem.lineSign) {
                                                                        if (tItem.isNew) {
                                                                            that.editData.salesOrderItems.remove(tItem);
                                                                        } else {
                                                                            tItem.delete();
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            if (!parentItem.isNew) {
                                                                parentItem.delete();
                                                                parentItem = null;
                                                            }
                                                            item = null;
                                                        }
                                                        if (ibas.objects.isNull(parentItem)) {
                                                            parentItem = that.editData.salesOrderItems.create();
                                                        }
                                                        // 父项
                                                        parentItem.lineSign = ibas.uuids.random();
                                                        parentItem.itemCode = pData.extend.code;
                                                        parentItem.itemDescription = pData.extend.name;
                                                        parentItem.itemSign = pData.extend.sign;
                                                        parentItem.serialManagement = pData.extend.serialManagement;
                                                        parentItem.batchManagement = pData.extend.batchManagement;
                                                        parentItem.warehouse = pData.extend.warehouse;
                                                        parentItem.quantity = 1;
                                                        parentItem.uom = pData.extend.inventoryUOM;
                                                        parentItem.price = selected.price;
                                                        parentItem.currency = selected.currency;
                                                        if (ibas.strings.isEmpty(parentItem.warehouse) && !ibas.strings.isEmpty(that.view.defaultWarehouse)) {
                                                            parentItem.warehouse = that.view.defaultWarehouse;
                                                        }
                                                        // 子项
                                                        for (let sItem of pData.productSuitItems) {
                                                            let subItem: bo.SalesOrderItem = that.editData.salesOrderItems.create();
                                                            // 构建父项关系
                                                            subItem.lineSign = ibas.uuids.random();
                                                            subItem.parentLineSign = parentItem.lineSign;
                                                            // 计算单位数量
                                                            subItem.basisQuantity = sItem.quantity / pData.unitQuantity;
                                                            subItem.price = sItem.price;
                                                            subItem.currency = sItem.currency;
                                                            // 基本信息赋值
                                                            subItem.itemCode = sItem.extend.code;
                                                            subItem.itemDescription = sItem.extend.name;
                                                            subItem.itemSign = sItem.extend.sign;
                                                            subItem.serialManagement = sItem.extend.serialManagement;
                                                            subItem.batchManagement = sItem.extend.batchManagement;
                                                            subItem.warehouse = sItem.extend.warehouse;
                                                            subItem.quantity = subItem.basisQuantity;
                                                            subItem.uom = sItem.extend.inventoryUOM;
                                                            if (ibas.strings.isEmpty(subItem.warehouse) && !ibas.strings.isEmpty(that.view.defaultWarehouse)) {
                                                                subItem.warehouse = that.view.defaultWarehouse;
                                                            }
                                                        }
                                                        created = true;
                                                        // 数据处理完，上级队列下一条
                                                        sNext();
                                                    }
                                                }
                                            });
                                        }, (pError) => {
                                            sNext(pError);
                                        });
                                    }
                                });
                                that.proceeding(ibas.emMessageType.WARNING,
                                    ibas.i18n.prop("sales_loading_product_suit", ibas.strings.isEmpty(selected.name) ? selected.code : selected.name));
                            } else {
                                // 普通物料
                                if (!ibas.objects.isNull(item)) {
                                    // 清理旧数据，bo对象负责清理关联子项
                                    if (!ibas.strings.isEmpty(item.lineSign)) {
                                        for (let i: number = that.editData.salesOrderItems.length - 1; i >= 0; i--) {
                                            let tItem: bo.SalesOrderItem = that.editData.salesOrderItems[i];
                                            if (tItem.parentLineSign === item.lineSign) {
                                                if (tItem.isNew) {
                                                    that.editData.salesOrderItems.remove(tItem);
                                                } else {
                                                    tItem.delete();
                                                }
                                            }
                                        }
                                        created = true;
                                    }
                                    if (!item.isNew) {
                                        item.delete();
                                        item = null;
                                    }
                                }
                                if (ibas.objects.isNull(item)) {
                                    item = that.editData.salesOrderItems.create();
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
                                item = null;
                                sNext();
                            }
                        }, (error) => {
                            if (error instanceof Error) {
                                that.messages(error);
                            }
                            if (created) {
                                // 创建了新的行项目
                                that.view.showSalesOrderItems(that.editData.salesOrderItems.filterDeleted());
                            }
                        });
                    }
                });
            }
            /** 添加销售订单-行事件 */
            private addSalesOrderItem(): void {
                this.editData.salesOrderItems.create();
                // 仅显示没有标记删除的
                this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
            }
            /** 删除销售订单-行事件 */
            private removeSalesOrderItem(items: bo.SalesOrderItem[]): void {
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                for (let item of items) {
                    if (!ibas.strings.isEmpty(item.parentLineSign)) {
                        this.messages({
                            type: ibas.emMessageType.WARNING,
                            title: ibas.i18n.prop(this.name),
                            message: ibas.i18n.prop("sales_subitems_not_allowed_operation"),
                        });
                        return;
                    }
                }
                // 移除项目
                for (let item of items) {
                    if (this.editData.salesOrderItems.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesOrderItems.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                        // 删除子项
                        if (!ibas.strings.isEmpty(item.lineSign)) {
                            for (let i: number = this.editData.salesOrderItems.length - 1; i >= 0; i--) {
                                let tItem: bo.SalesOrderItem = this.editData.salesOrderItems[i];
                                if (tItem.parentLineSign === item.lineSign) {
                                    if (tItem.isNew) {
                                        this.editData.salesOrderItems.remove(tItem);
                                    } else {
                                        tItem.delete();
                                    }
                                }
                            }
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
            }
            /** 选择销售交货行仓库事件 */
            private chooseSalesOrderItemWarehouse(caller: bo.SalesOrderItem): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IWarehouse>({
                    boCode: materials.bo.BO_CODE_WAREHOUSE,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: materials.app.conditions.warehouse.create(),
                    onCompleted(selecteds: ibas.IList<materials.bo.IWarehouse>): void {
                        let index: number = that.editData.salesOrderItems.indexOf(caller);
                        let item: bo.SalesOrderItem = that.editData.salesOrderItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesOrderItems.create();
                                created = true;
                            }
                            item.warehouse = selected.code;
                            that.view.defaultWarehouse = item.warehouse;
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showSalesOrderItems(that.editData.salesOrderItems.filterDeleted());
                        }
                    }
                });
            }
            /** 选择销售交货行批次事件 */
            private chooseSalesOrderItemMaterialBatch(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialBatchContract> = new ibas.ArrayList<materials.app.IMaterialBatchContract>();
                for (let item of this.editData.salesOrderItems) {
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
                    proxy: new materials.app.MaterialBatchIssueServiceProxy(contracts)
                });
            }
            /** 选择销售交货序列事件 */
            private chooseSalesOrderItemMaterialSerial(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialSerialContract> = new ibas.ArrayList<materials.app.IMaterialSerialContract>();
                for (let item of this.editData.salesOrderItems) {
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
                    proxy: new materials.app.MaterialSerialIssueServiceProxy(contracts)
                });
            }
            /** 选择销售订单-销售报价事件 */
            private chooseSalesOrderSalesQuote(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesorder_customercode")
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
                // 仅下达的
                condition = criteria.conditions.create();
                condition.alias = ibas.BO_PROPERTY_NAME_DOCUMENTSTATUS;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emDocumentStatus.RELEASED.toString();
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesQuote.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = this.editData.customerCode;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.SalesQuote>({
                    boCode: bo.SalesQuote.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.SalesQuote>): void {
                        for (let selected of selecteds) {
                            if (!ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                continue;
                            }
                            that.editData.baseDocument(selected);
                        }
                        that.view.showSalesOrderItems(that.editData.salesOrderItems.filterDeleted());
                    }
                });
            }
            private receiptSalesOrder(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty) {
                    throw new Error(ibas.i18n.prop("shell_data_saved_first"));
                }
                let amount: number = this.editData.documentTotal - this.editData.paidTotal;
                if (amount <= 0) {
                    throw new Error(ibas.i18n.prop("sales_receipted"));
                }
                ibas.servicesManager.runApplicationService<businesspartner.app.IReceiptContract>({
                    proxy: new businesspartner.app.ReceiptServiceProxy({
                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                        businessPartnerCode: this.editData.customerCode,
                        documentType: this.editData.objectCode,
                        documentEntry: this.editData.docEntry,
                        documentCurrency: this.editData.documentCurrency,
                        documentTotal: amount,
                    })
                });
            }
            /** 选择联系人 */
            private chooseSalesOrderContactPerson(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesorder_suppliercode")
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
            private showSaleOrderItemExtra(data: bo.SalesOrderItem): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_view")
                    ));
                    return;
                }
                let app: SalesOrderItemExtraApp = new SalesOrderItemExtraApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(data);
            }
        }
        /** 视图-销售订单 */
        export interface ISalesOrderEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showSalesOrder(data: bo.SalesOrder): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加销售订单-行事件 */
            addSalesOrderItemEvent: Function;
            /** 删除销售订单-行事件 */
            removeSalesOrderItemEvent: Function;
            /** 显示数据 */
            showSalesOrderItems(datas: bo.SalesOrderItem[]): void;
            /** 选择销售订单客户事件 */
            chooseSalesOrderCustomerEvent: Function;
            /** 选择销售订单联系人信息 */
            chooseSalesOrderContactPersonEvent: Function;
            /** 选择销售订单价格清单事件 */
            chooseSalesOrderPriceListEvent: Function;
            /** 选择销售订单行物料事件 */
            chooseSalesOrderItemMaterialEvent: Function;
            /** 选择销售订单仓库事件 */
            chooseSalesOrderItemWarehouseEvent: Function;
            /** 选择销售订单行物料序列事件 */
            chooseSalesOrderItemMaterialSerialEvent: Function;
            /** 选择销售订单行物料批次事件 */
            chooseSalesOrderItemMaterialBatchEvent: Function;
            /** 显示销售订单行额外信息事件 */
            showSalesOrderItemExtraEvent: Function;
            /** 选择销售订单-销售报价事件 */
            chooseSalesOrderSalesQuoteEvent: Function;
            /** 销售订单收款事件 */
            receiptSalesOrderEvent: Function;
            /** 编辑地址事件 */
            editShippingAddressesEvent: Function;
            /** 默认仓库 */
            defaultWarehouse: string;
        }
    }
}