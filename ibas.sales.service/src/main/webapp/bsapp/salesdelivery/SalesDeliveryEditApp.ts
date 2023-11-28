/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 编辑应用-销售交货 */
        export class SalesDeliveryEditApp extends ibas.BOEditService<ISalesDeliveryEditView, bo.SalesDelivery> {
            /** 应用标识 */
            static APPLICATION_ID: string = "2b7fcb17-6aed-4b4f-abf3-32de889949d1";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesdelivery_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesDelivery.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesDeliveryEditApp.APPLICATION_ID;
                this.name = SalesDeliveryEditApp.APPLICATION_NAME;
                this.boCode = SalesDeliveryEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addSalesDeliveryItemEvent = this.addSalesDeliveryItem;
                this.view.removeSalesDeliveryItemEvent = this.removeSalesDeliveryItem;
                this.view.chooseSalesDeliveryCustomerEvent = this.chooseSalesDeliveryCustomer;
                this.view.chooseSalesDeliveryContactPersonEvent = this.chooseSalesDeliveryContactPerson;
                this.view.chooseSalesDeliveryPriceListEvent = this.chooseSalesDeliveryPriceList;
                this.view.chooseSalesDeliveryItemMaterialEvent = this.chooseSalesDeliveryItemMaterial;
                this.view.chooseSalesDeliveryItemMaterialBatchEvent = this.chooseSalesDeliveryLineMaterialBatch;
                this.view.chooseSalesDeliveryItemMaterialSerialEvent = this.chooseSalesDeliveryLineMaterialSerial;
                this.view.chooseSalesDeliveryItemMaterialVersionEvent = this.chooseSalesDeliveryItemMaterialVersion;
                this.view.chooseSalesDeliveryItemDistributionRuleEvent = this.chooseSalesDeliveryItemDistributionRule;
                this.view.chooseSalesDeliveryItemWarehouseEvent = this.chooseSalesDeliveryItemWarehouse;
                this.view.chooseSalesDeliveryItemUnitEvent = this.chooseSalesDeliveryItemUnit;
                this.view.chooseSalesDeliverySalesOrderEvent = this.chooseSalesDeliverySalesOrder;
                this.view.chooseSalesDeliveryBlanketAgreementEvent = this.chooseSalesDeliveryBlanketAgreement;
                this.view.chooseCustomerAgreementsEvent = this.chooseCustomerAgreements;
                this.view.receiptSalesDeliveryEvent = this.receiptSalesDelivery;
                this.view.editShippingAddressesEvent = this.editShippingAddresses;
                this.view.turnToSalesInvoiceEvent = this.turnToSalesInvoice;
                this.view.turnToSalesReturnEvent = this.turnToSalesReturn;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.SalesDelivery();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showSalesDelivery(this.editData);
                this.view.showSalesDeliveryItems(this.editData.salesDeliveryItems.filterDeleted());
                // 查询额外信息
                if (!ibas.strings.isEmpty(this.editData.customerCode)) {
                    let boRepository: businesspartner.bo.BORepositoryBusinessPartner = new businesspartner.bo.BORepositoryBusinessPartner();
                    boRepository.fetchCustomer({
                        criteria: [
                            new ibas.Condition(businesspartner.bo.Customer.PROPERTY_CODE_NAME, ibas.emConditionOperation.EQUAL, this.editData.customerCode)
                        ],
                        onCompleted: (opRslt) => {
                            let customer: businesspartner.bo.Customer = opRslt.resultObjects.firstOrDefault();
                            if (!ibas.objects.isNull(customer)) {
                                if (!ibas.strings.isEmpty(customer.warehouse)) {
                                    this.view.defaultWarehouse = customer.warehouse;
                                }
                                if (!ibas.strings.isEmpty(customer.taxGroup)) {
                                    this.view.defaultTaxGroup = customer.taxGroup;
                                }
                            }
                        }
                    });
                }
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.SalesDelivery): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.SalesDelivery)) {
                    let data: bo.SalesDelivery = arguments[0];
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
                        boRepository.fetchSalesDelivery({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.SalesDelivery>): void {
                                let data: bo.SalesDelivery;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.SalesDelivery)) {
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
            /** 保存数据 */
            protected saveData(): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.saveSalesDelivery({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesDelivery>): void {
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
            /** 新建数据，参数1：是否克隆 or 导入文件 */
            protected createData(clone: boolean | Blob): void {
                let that: this = this;
                let createData: Function = function (): void {
                    if (clone instanceof Blob) {
                        let formData: FormData = new FormData();
                        formData.append("file", clone);
                        let boRepository: importexport.bo.BORepositoryImportExport = new importexport.bo.BORepositoryImportExport();
                        boRepository.parse<bo.SalesDelivery>({
                            converter: new bo.DataConverter(),
                            fileData: formData,
                            onCompleted: (opRslt) => {
                                try {
                                    if (opRslt.resultCode !== 0) {
                                        throw new Error(opRslt.message);
                                    }
                                    if (opRslt.resultObjects.length === 0) {
                                        throw new Error(ibas.i18n.prop("sys_unrecognized_data"));
                                    }
                                    that.editData = opRslt.resultObjects.firstOrDefault();
                                    that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_read_new"));
                                    that.viewShowed();
                                } catch (error) {
                                    that.messages(error);
                                }
                            }
                        });
                    } else if (typeof clone === "boolean" && clone === true) {
                        // 克隆对象
                        that.editData = that.editData.clone();
                        that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_cloned_new"));
                        that.viewShowed();
                    } else {
                        // 新建对象
                        that.editData = new bo.SalesDelivery();
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
            /** 选择销售交货客户事件 */
            private chooseSalesDeliveryCustomer(): void {
                let items: bo.SalesDeliveryItem[] = this.editData.salesDeliveryItems.where(c =>
                    !ibas.strings.isEmpty(c.baseDocumentType) && c.isDeleted !== true
                );
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
                                this.removeSalesDeliveryItem(items);
                                this.chooseSalesDeliveryCustomer();
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
                        that.editData.paymentCode = selected.paymentCode;
                        if (!ibas.strings.isEmpty(selected.warehouse)) {
                            that.view.defaultWarehouse = selected.warehouse;
                        }
                        if (!ibas.strings.isEmpty(selected.taxGroup)) {
                            that.view.defaultTaxGroup = selected.taxGroup;
                        }
                        // 客户改变，清除旧地址
                        that.editData.shippingAddresss.clear();
                        that.changeSalesDeliveryItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 选择销售交货价格清单事件 */
            private chooseSalesDeliveryPriceList(): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IMaterialPriceList>({
                    boCode: materials.bo.BO_CODE_MATERIALPRICELIST,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: materials.app.conditions.materialpricelist.create(),
                    onCompleted(selecteds: ibas.IList<materials.bo.IMaterialPriceList>): void {
                        let selected: materials.bo.IMaterialPriceList = selecteds.firstOrDefault();
                        that.editData.priceList = selected.objectKey;
                        that.editData.documentCurrency = selected.currency;
                        that.changeSalesDeliveryItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 更改行价格 */
            private changeSalesDeliveryItemPrice(priceList: number | ibas.Criteria): void {
                if (typeof priceList === "number" && priceList > 0) {
                    let criteria: ibas.Criteria = new ibas.Criteria();
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = materials.app.conditions.materialprice.CONDITION_ALIAS_PRICELIST;
                    condition.value = priceList.toString();
                    for (let item of this.editData.salesDeliveryItems) {
                        if (!ibas.strings.isEmpty(item.parentLineSign)) {
                            continue;
                        }
                        condition = criteria.conditions.create();
                        condition.alias = materials.app.conditions.materialprice.CONDITION_ALIAS_ITEMCODE;
                        condition.value = item.itemCode;
                        if (criteria.conditions.length > 2) {
                            condition.relationship = ibas.emConditionRelationship.OR;
                        }
                    }
                    if (criteria.conditions.length < 2) {
                        return;
                    }
                    if (criteria.conditions.length > 2) {
                        criteria.conditions[2].bracketOpen += 1;
                        criteria.conditions[criteria.conditions.length - 1].bracketClose += 1;
                    }
                    if (config.get(config.CONFIG_ITEM_FORCE_UPDATE_PRICE_FOR_PRICE_LIST_CHANGED, true) === true) {
                        // 强制刷新价格
                        this.changeSalesDeliveryItemPrice(criteria);
                    } else {
                        this.messages({
                            type: ibas.emMessageType.QUESTION,
                            message: ibas.i18n.prop("sales_change_item_price_continue"),
                            actions: [
                                ibas.emMessageAction.YES,
                                ibas.emMessageAction.NO,
                            ],
                            onCompleted: (result) => {
                                if (result === ibas.emMessageAction.YES) {
                                    this.changeSalesDeliveryItemPrice(criteria);
                                }
                            }
                        });
                    }
                } else if (priceList instanceof ibas.Criteria) {
                    this.busy(true);
                    let boRepository: materials.bo.BORepositoryMaterials = new materials.bo.BORepositoryMaterials();
                    boRepository.fetchMaterialPrice({
                        criteria: priceList,
                        onCompleted: (opRslt) => {
                            for (let item of opRslt.resultObjects) {
                                this.editData.salesDeliveryItems.forEach((value) => {
                                    if (item.taxed === ibas.emYesNo.YES) {
                                        value.unitPrice = 0;
                                        value.price = item.price;
                                        value.currency = item.currency;
                                    } else {
                                        value.unitPrice = 0;
                                        value.preTaxPrice = item.price;
                                        value.currency = item.currency;
                                    }
                                });
                            }
                            this.busy(false);
                        }
                    });
                }
            }
            /** 选择销售交货行物料事件 */
            private chooseSalesDeliveryItemMaterial(caller: bo.SalesDeliveryItem): void {
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
                        let index: number = that.editData.salesDeliveryItems.indexOf(caller);
                        let item: bo.SalesDeliveryItem = that.editData.salesDeliveryItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        let beChangeds: ibas.IList<materials.app.IBeChangedUOMSource> = new ibas.ArrayList<materials.app.IBeChangedUOMSource>();
                        ibas.queues.execute(selecteds, (selected, sNext) => {
                            if (selected.phantomItem === ibas.emYesNo.YES
                                && selected.itemType === materials.bo.emItemType.ITEM) {
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
                                                        let parentItem: bo.SalesDeliveryItem = null;
                                                        // 清理旧数据，bo对象负责清理关联子项
                                                        if (!ibas.objects.isNull(item)) {
                                                            parentItem = item;
                                                            if (!ibas.strings.isEmpty(parentItem.lineSign)) {
                                                                for (let i: number = that.editData.salesDeliveryItems.length - 1; i >= 0; i--) {
                                                                    let tItem: bo.SalesDeliveryItem = that.editData.salesDeliveryItems[i];
                                                                    if (tItem.parentLineSign === parentItem.lineSign) {
                                                                        if (tItem.isNew) {
                                                                            that.editData.salesDeliveryItems.remove(tItem);
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
                                                        for (let sItem of bo.baseProductSuit(that.editData.salesDeliveryItems, pData)) {
                                                            if (!ibas.strings.isEmpty(that.view.defaultWarehouse)) {
                                                                sItem.warehouse = that.view.defaultWarehouse;
                                                            }
                                                            if (!ibas.strings.isEmpty(that.view.defaultTaxGroup)) {
                                                                sItem.tax = that.view.defaultTaxGroup;
                                                            }
                                                            if (ibas.strings.isEmpty(sItem.parentLineSign)) {
                                                                // 父项赋值价格，子项价格使用组件定义
                                                                if (selected.taxed === ibas.emYesNo.NO) {
                                                                    sItem.preTaxPrice = selected.price;
                                                                } else {
                                                                    sItem.price = selected.price;
                                                                }
                                                                // 仅父项处理单位换算
                                                                beChangeds.add({
                                                                    caller: sItem,
                                                                    sourceUnit: sItem.uom,
                                                                    targetUnit: sItem.inventoryUOM,
                                                                    material: sItem.itemCode,
                                                                    setUnitRate(this: bo.SalesDeliveryItem, value: number): void {
                                                                        this.uomRate = value;
                                                                    }
                                                                });
                                                            }
                                                            if (!ibas.strings.isEmpty(sItem.tax)) {
                                                                accounting.taxrate.assign(sItem.tax, (rate) => {
                                                                    if (rate >= 0) {
                                                                        sItem.taxRate = rate;
                                                                        sItem.unitPrice = 0;
                                                                        if (ibas.strings.isEmpty(sItem.parentLineSign)) {
                                                                            // 父项赋值价格，子项价格使用组件定义
                                                                            if (selected.taxed === ibas.emYesNo.NO) {
                                                                                sItem.preTaxPrice = selected.price;
                                                                            } else {
                                                                                sItem.price = selected.price;
                                                                            }
                                                                        }
                                                                    }
                                                                });
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
                                        for (let i: number = that.editData.salesDeliveryItems.length - 1; i >= 0; i--) {
                                            let tItem: bo.SalesDeliveryItem = that.editData.salesDeliveryItems[i];
                                            if (tItem.parentLineSign === item.lineSign) {
                                                if (tItem.isNew) {
                                                    that.editData.salesDeliveryItems.remove(tItem);
                                                } else {
                                                    tItem.delete();
                                                }
                                            }
                                        }
                                        created = true;
                                    }
                                }
                                if (ibas.objects.isNull(item)) {
                                    item = that.editData.salesDeliveryItems.create();
                                    created = true;
                                }
                                item.baseProduct(selected);
                                if (!ibas.strings.isEmpty(that.view.defaultWarehouse)) {
                                    item.warehouse = that.view.defaultWarehouse;
                                }
                                if (!ibas.strings.isEmpty(that.view.defaultTaxGroup)) {
                                    item.tax = that.view.defaultTaxGroup;
                                    if (!ibas.strings.isEmpty(item.tax)) {
                                        accounting.taxrate.assign(item.tax, (rate) => {
                                            if (rate >= 0) {
                                                item.taxRate = rate;
                                                item.unitPrice = 0;
                                                if (selected.taxed === ibas.emYesNo.NO) {
                                                    item.preTaxPrice = selected.price;
                                                } else {
                                                    item.price = selected.price;
                                                }
                                            }
                                        });
                                    }
                                }
                                beChangeds.add({
                                    caller: item,
                                    sourceUnit: item.uom,
                                    targetUnit: item.inventoryUOM,
                                    material: item.itemCode,
                                    setUnitRate(this: bo.SalesDeliveryItem, value: number): void {
                                        this.uomRate = value;
                                    }
                                });
                                item = null;
                                sNext();
                            }
                        }, (error) => {
                            if (error instanceof Error) {
                                that.messages(error);
                            }
                            if (beChangeds.length > 0) {
                                // 设置单位换算率
                                materials.app.changeMaterialsUnitRate({
                                    data: beChangeds,
                                    onCompleted: (error) => {
                                        if (error instanceof Error) {
                                            that.messages(error);
                                        }
                                    }
                                });
                            }
                            if (created) {
                                // 创建了新的行项目
                                that.view.showSalesDeliveryItems(that.editData.salesDeliveryItems.filterDeleted());
                            }
                        });
                    }
                });
            }
            /** 选择销售交货行仓库事件 */
            private chooseSalesDeliveryItemWarehouse(caller: bo.SalesDeliveryItem): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IWarehouse>({
                    boCode: materials.bo.BO_CODE_WAREHOUSE,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: materials.app.conditions.warehouse.create(this.editData.branch),
                    onCompleted(selecteds: ibas.IList<materials.bo.IWarehouse>): void {
                        let index: number = that.editData.salesDeliveryItems.indexOf(caller);
                        let item: bo.SalesDeliveryItem = that.editData.salesDeliveryItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesDeliveryItems.create();
                                created = true;
                            }
                            item.warehouse = selected.code;
                            that.view.defaultWarehouse = item.warehouse;
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showSalesDeliveryItems(that.editData.salesDeliveryItems.filterDeleted());
                        }
                    }
                });
            }
            /** 添加销售交货-行事件 */
            private addSalesDeliveryItem(items: bo.SalesDeliveryItem[]): void {
                if (items instanceof Array && items.length > 0) {
                    // 检查项目是否允许复制
                    for (let item of items) {
                        if (!ibas.strings.isEmpty(item.parentLineSign)) {
                            throw new Error(ibas.i18n.prop("sales_subitems_not_allowed_operation"));
                        }
                    }
                    let builder: ibas.StringBuilder = new ibas.StringBuilder();
                    builder.append(ibas.i18n.prop("shell_data_new_line"));
                    builder.append(" [");
                    for (let item of items) {
                        let newItem: bo.SalesDeliveryItem = item.clone();
                        newItem.lineId = undefined;
                        newItem.visOrder = undefined;
                        // 序列号清除
                        newItem.materialSerials.clear();
                        this.editData.salesDeliveryItems.add(newItem);
                        if (builder.length > 2) {
                            builder.append(", ");
                        }
                        builder.append(newItem.lineId);
                    }
                    builder.append("] ");
                    if (builder.length > 3) {
                        this.proceeding(ibas.emMessageType.WARNING, builder.toString());
                        this.view.showSalesDeliveryItems(this.editData.salesDeliveryItems.filterDeleted());
                    }
                } else {
                    this.chooseSalesDeliveryItemMaterial(undefined);
                }
            }
            /** 删除销售交货-行事件 */
            private removeSalesDeliveryItem(items: bo.SalesDeliveryItem[]): void {
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
                    if (this.editData.salesDeliveryItems.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesDeliveryItems.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                        // 删除子项
                        if (!ibas.strings.isEmpty(item.lineSign)) {
                            for (let i: number = this.editData.salesDeliveryItems.length - 1; i >= 0; i--) {
                                let tItem: bo.SalesDeliveryItem = this.editData.salesDeliveryItems[i];
                                if (tItem.parentLineSign === item.lineSign) {
                                    if (tItem.isNew) {
                                        this.editData.salesDeliveryItems.remove(tItem);
                                    } else {
                                        tItem.delete();
                                    }
                                }
                            }
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showSalesDeliveryItems(this.editData.salesDeliveryItems.filterDeleted());
            }

            /** 选择销售交货行批次事件 */
            private chooseSalesDeliveryLineMaterialBatch(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialBatchContract> = new ibas.ArrayList<materials.app.IMaterialBatchContract>();
                for (let item of this.editData.salesDeliveryItems) {
                    contracts.add({
                        batchManagement: item.batchManagement,
                        itemCode: item.itemCode,
                        itemDescription: item.itemDescription,
                        itemVersion: item.itemVersion,
                        warehouse: item.warehouse,
                        quantity: item.inventoryQuantity,
                        uom: item.inventoryUOM,
                        materialBatches: item.materialBatches,
                    });
                }
                ibas.servicesManager.runApplicationService<materials.app.IMaterialBatchContract[]>({
                    proxy: new materials.app.MaterialBatchIssueServiceProxy(contracts)
                });
            }
            /** 选择销售交货序列事件 */
            private chooseSalesDeliveryLineMaterialSerial(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialSerialContract> = new ibas.ArrayList<materials.app.IMaterialSerialContract>();
                for (let item of this.editData.salesDeliveryItems) {
                    contracts.add({
                        serialManagement: item.serialManagement,
                        itemCode: item.itemCode,
                        itemDescription: item.itemDescription,
                        itemVersion: item.itemVersion,
                        warehouse: item.warehouse,
                        quantity: item.inventoryQuantity,
                        uom: item.inventoryUOM,
                        materialSerials: item.materialSerials
                    });
                }
                ibas.servicesManager.runApplicationService<materials.app.IMaterialSerialContract[]>({
                    proxy: new materials.app.MaterialSerialIssueServiceProxy(contracts)
                });
            }
            /** 选择销售交货-销售订单事件 */
            private chooseSalesDeliverySalesOrder(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesdelivery_customercode")
                    ));
                    return;
                }
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
                // 未指定的分支
                condition = criteria.conditions.create();
                condition.alias = bo.SalesOrder.PROPERTY_BRANCH_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = "";
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = bo.SalesOrder.PROPERTY_BRANCH_NAME;
                condition.operation = ibas.emConditionOperation.IS_NULL;
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                if (!ibas.strings.isEmpty(this.editData.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                }
                // 当前客户的
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
                        that.view.showSalesDeliveryItems(that.editData.salesDeliveryItems.filterDeleted());
                    }
                });
            }
            private receiptSalesDelivery(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty) {
                    throw new Error(ibas.i18n.prop("shell_data_saved_first"));
                }
                let amount: number = this.editData.documentTotal - this.editData.paidTotal;
                if (amount < 0 || (amount === 0 && this.editData.documentTotal !== 0)) {
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
            private chooseSalesDeliveryContactPerson(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesdelivery_customercode")
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
                if (this.editData.shippingAddresss.where(c => c.isDeleted === false).length === 0 && !ibas.strings.isEmpty(this.editData.customerCode)) {
                    // 初始化地址
                    let that: this = this;
                    this.messages({
                        type: ibas.emMessageType.QUESTION,
                        message: ibas.i18n.prop("sales_copy_data_continue", ibas.i18n.prop("bo_shippingaddress")),
                        actions: [
                            ibas.emMessageAction.YES,
                            ibas.emMessageAction.NO
                        ],
                        onCompleted(action: ibas.emMessageAction): void {
                            if (action === ibas.emMessageAction.YES) {
                                ibas.servicesManager.runChooseService<businesspartner.bo.IAddress>({
                                    boCode: businesspartner.bo.BO_CODE_ADDRESS,
                                    chooseType: ibas.emChooseType.SINGLE,
                                    criteria: [
                                        new ibas.Condition("businessPartner", ibas.emConditionOperation.EQUAL, that.editData.customerCode),
                                        new ibas.Condition("ownerType", ibas.emConditionOperation.EQUAL, businesspartner.bo.emBusinessPartnerType.CUSTOMER),
                                        new ibas.Condition("activated", ibas.emConditionOperation.EQUAL, ibas.emYesNo.YES)
                                    ],
                                    onCompleted(selecteds: ibas.IList<businesspartner.bo.IAddress>): void {
                                        let selected: businesspartner.bo.IAddress = selecteds.firstOrDefault();
                                        that.editData.baseAddress(selected);
                                        app.run(that.editData.shippingAddresss);
                                    }
                                });
                            } else {
                                app.run(that.editData.shippingAddresss);
                            }
                        }
                    });
                } else {
                    app.run(this.editData.shippingAddresss);
                }
            }

            /** 转为销售退货 */
            protected turnToSalesReturn(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                if ((this.editData.approvalStatus !== ibas.emApprovalStatus.APPROVED && this.editData.approvalStatus !== ibas.emApprovalStatus.UNAFFECTED)
                    || this.editData.deleted === ibas.emYesNo.YES
                    || this.editData.canceled === ibas.emYesNo.YES
                    || this.editData.documentStatus === ibas.emDocumentStatus.PLANNED
                ) {
                    this.messages(ibas.emMessageType.ERROR, ibas.i18n.prop("sales_invaild_status_not_support_turn_to_operation"));
                    return;
                }
                let target: bo.SalesReturn = new bo.SalesReturn();
                target.customerCode = this.editData.customerCode;
                target.customerName = this.editData.customerName;
                target.baseDocument(this.editData);

                let app: SalesReturnEditApp = new SalesReturnEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(target);
            }
            /** 转为销售发票 */
            protected turnToSalesInvoice(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                if ((this.editData.approvalStatus !== ibas.emApprovalStatus.APPROVED && this.editData.approvalStatus !== ibas.emApprovalStatus.UNAFFECTED)
                    || this.editData.deleted === ibas.emYesNo.YES
                    || this.editData.canceled === ibas.emYesNo.YES
                    || this.editData.documentStatus === ibas.emDocumentStatus.PLANNED
                ) {
                    this.messages(ibas.emMessageType.ERROR, ibas.i18n.prop("sales_invaild_status_not_support_turn_to_operation"));
                    return;
                }
                let target: bo.SalesInvoice = new bo.SalesInvoice();
                target.customerCode = this.editData.customerCode;
                target.customerName = this.editData.customerName;
                target.baseDocument(this.editData);

                let app: SalesInvoiceEditApp = new SalesInvoiceEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(target);

            }
            /** 选择一揽子协议事件 */
            private chooseSalesDeliveryBlanketAgreement(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesdelivery_customercode")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = bo.BlanketAgreement.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = bo.BlanketAgreement.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 仅下达的
                condition = criteria.conditions.create();
                condition.alias = bo.BlanketAgreement.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emDocumentStatus.RELEASED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = bo.BlanketAgreement.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = bo.BlanketAgreement.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = bo.BlanketAgreement.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = this.editData.customerCode;
                // 未过期的
                condition = criteria.conditions.create();
                condition.bracketOpen = 1;
                condition.alias = bo.BlanketAgreement.PROPERTY_ENDDATE_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_EQUAL;
                condition.value = ibas.dates.toString(ibas.dates.today());
                condition = criteria.conditions.create();
                condition.bracketClose = 1;
                condition.alias = bo.BlanketAgreement.PROPERTY_ENDDATE_NAME;
                condition.operation = ibas.emConditionOperation.IS_NULL;
                condition.relationship = ibas.emConditionRelationship.OR;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.BlanketAgreement>({
                    boCode: bo.BlanketAgreement.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.BlanketAgreement>): void {
                        criteria = new ibas.Criteria();
                        for (let selected of selecteds) {
                            if (!ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                continue;
                            }
                            that.editData.paymentCode = selected.paymentCode;
                            for (let item of selected.blanketAgreementItems) {
                                condition = criteria.conditions.create();
                                condition.alias = materials.bo.Material.PROPERTY_CODE_NAME;
                                condition.value = item.itemCode;
                                if (criteria.conditions.length > 0) {
                                    condition.relationship = ibas.emConditionRelationship.OR;
                                }
                            }
                        }
                        if (criteria.conditions.length > 0) {
                            let boRepository: materials.bo.BORepositoryMaterials = new materials.bo.BORepositoryMaterials();
                            boRepository.fetchProduct({
                                criteria: criteria,
                                onCompleted: (opRsltPRD) => {
                                    let beChangeds: ibas.IList<materials.app.IBeChangedUOMSource> = new ibas.ArrayList<materials.app.IBeChangedUOMSource>();
                                    for (let selected of selecteds) {
                                        if (!ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                            continue;
                                        }
                                        for (let baItem of selected.blanketAgreementItems) {
                                            if (baItem.canceled === ibas.emYesNo.YES) {
                                                continue;
                                            }
                                            if (baItem.lineStatus !== ibas.emDocumentStatus.RELEASED) {
                                                continue;
                                            }
                                            if (that.editData.salesDeliveryItems.firstOrDefault(
                                                c => c.baseDocumentType === baItem.objectCode
                                                    && c.baseDocumentEntry === baItem.docEntry
                                                    && c.baseDocumentLineId === baItem.lineId) !== null) {
                                                continue;
                                            }
                                            let item: bo.SalesDeliveryItem = that.editData.salesDeliveryItems.create();
                                            item.itemCode = baItem.itemCode;
                                            item.itemDescription = baItem.itemDescription;
                                            item.itemSign = baItem.itemSign;
                                            item.baseDocumentType = baItem.objectCode;
                                            item.baseDocumentEntry = baItem.docEntry;
                                            item.baseDocumentLineId = baItem.lineId;
                                            for (let mmItem of opRsltPRD.resultObjects.where(c => ibas.strings.equalsIgnoreCase(c.code, item.itemCode))) {
                                                item.baseProduct(mmItem);
                                            }
                                            if (!ibas.strings.isEmpty(baItem.uom)) {
                                                item.uom = baItem.uom;
                                            }
                                            item.quantity = baItem.quantity - baItem.closedQuantity;
                                            if (selected.priceMode === bo.emPriceMode.NET) {
                                                item.unitPrice = baItem.price;
                                            } else if (selected.priceMode === bo.emPriceMode.GROSS) {
                                                item.price = baItem.price;
                                            }
                                            item.reference1 = baItem.reference1;
                                            item.reference2 = baItem.reference2;
                                            beChangeds.add({
                                                caller: item,
                                                sourceUnit: item.uom,
                                                targetUnit: item.inventoryUOM,
                                                material: item.itemCode,
                                                setUnitRate(this: bo.SalesDeliveryItem, value: number): void {
                                                    this.uomRate = value;
                                                }
                                            });
                                        }
                                    }
                                    if (beChangeds.length > 0) {
                                        // 设置单位换算率
                                        materials.app.changeMaterialsUnitRate({
                                            data: beChangeds,
                                            onCompleted: (error) => {
                                                if (error instanceof Error) {
                                                    that.messages(error);
                                                }
                                            }
                                        });
                                    }
                                    that.view.showSalesDeliveryItems(that.editData.salesDeliveryItems.filterDeleted());
                                }
                            });
                        }
                    }
                });
            }
            private chooseSalesDeliveryItemUnit(caller: bo.SalesDeliveryItem): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IUnit>({
                    boCode: materials.bo.BO_CODE_UNIT,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: [
                        new ibas.Condition(materials.bo.Unit.PROPERTY_ACTIVATED_NAME, ibas.emConditionOperation.EQUAL, ibas.emYesNo.YES)
                    ],
                    onCompleted(selecteds: ibas.IList<materials.bo.IUnit>): void {
                        for (let selected of selecteds) {
                            caller.uom = selected.name;
                        }
                        materials.app.changeMaterialsUnitRate({
                            data: {
                                get sourceUnit(): string {
                                    return caller.uom;
                                },
                                get targetUnit(): string {
                                    return caller.inventoryUOM;
                                },
                                get material(): string {
                                    return caller.itemCode;
                                },
                                setUnitRate(rate: number): void {
                                    caller.uomRate = rate;
                                }
                            },
                            onCompleted: (error) => {
                                if (error instanceof Error) {
                                    that.messages(error);
                                }
                            }
                        });
                    }
                });
            }
            private chooseSalesDeliveryItemMaterialVersion(caller: bo.SalesDeliveryItem): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = materials.bo.MaterialVersion.PROPERTY_ITEMCODE_NAME;
                condition.value = caller.itemCode;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition = criteria.conditions.create();
                condition.alias = materials.bo.MaterialVersion.PROPERTY_ACTIVATED_NAME;
                condition.value = ibas.emYesNo.YES.toString();
                condition.operation = ibas.emConditionOperation.EQUAL;
                // 调用选择服务
                ibas.servicesManager.runChooseService<materials.bo.MaterialVersion>({
                    criteria: criteria,
                    chooseType: ibas.emChooseType.SINGLE,
                    boCode: materials.bo.MaterialVersion.BUSINESS_OBJECT_CODE,
                    onCompleted: (selecteds) => {
                        for (let selected of selecteds) {
                            caller.itemVersion = selected.name;
                        }
                    }
                });
            }
            private chooseCustomerAgreements(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesdelivery_customercode")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = businesspartner.bo.Agreement.PROPERTY_ACTIVATED_NAME;
                condition.value = ibas.emYesNo.YES.toString();
                condition = criteria.conditions.create();
                condition.alias = businesspartner.bo.Agreement.PROPERTY_BUSINESSPARTNERTYPE_NAME;
                condition.value = businesspartner.bo.emBusinessPartnerType.CUSTOMER.toString();
                condition.bracketOpen = 2;
                condition = criteria.conditions.create();
                condition.alias = businesspartner.bo.Agreement.PROPERTY_BUSINESSPARTNERCODE_NAME;
                condition.value = this.editData.customerCode;
                condition.bracketClose = 1;
                condition = criteria.conditions.create();
                condition.alias = businesspartner.bo.Agreement.PROPERTY_BUSINESSPARTNERCODE_NAME;
                condition.value = "";
                condition.relationship = ibas.emConditionRelationship.OR;
                condition = criteria.conditions.create();
                condition.alias = businesspartner.bo.Agreement.PROPERTY_BUSINESSPARTNERCODE_NAME;
                condition.operation = ibas.emConditionOperation.IS_NULL;
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                ibas.servicesManager.runChooseService<businesspartner.bo.Agreement>({
                    boCode: businesspartner.bo.Agreement.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted: (selecteds) => {
                        let builder: ibas.StringBuilder = new ibas.StringBuilder();
                        for (let selected of selecteds) {
                            if (builder.length > 0) {
                                builder.append(ibas.DATA_SEPARATOR);
                                builder.append(" ");
                            }
                            builder.append(selected.code);
                        }
                        this.editData.agreements = builder.toString();
                    }
                });
            }
            private chooseSalesDeliveryItemDistributionRule(type: accounting.app.emDimensionType, caller: bo.SalesDeliveryItem): void {
                if (ibas.objects.isNull(type)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("accounting_dimension_invaild", ""));
                    return;
                }
                ibas.servicesManager.runApplicationService<accounting.app.IDimensionDataServiceContract, String>({
                    proxy: new accounting.app.DimensionDataServiceProxy({
                        type: type,
                    }),
                    onCompleted(result: string): void {
                        if (type === accounting.app.emDimensionType.DIMENSION_1) {
                            caller.distributionRule1 = result;
                        } else if (type === accounting.app.emDimensionType.DIMENSION_2) {
                            caller.distributionRule2 = result;
                        } else if (type === accounting.app.emDimensionType.DIMENSION_3) {
                            caller.distributionRule3 = result;
                        } else if (type === accounting.app.emDimensionType.DIMENSION_4) {
                            caller.distributionRule4 = result;
                        } else if (type === accounting.app.emDimensionType.DIMENSION_5) {
                            caller.distributionRule5 = result;
                        }
                    }
                });
            }
        }
        /** 视图-销售交货 */
        export interface ISalesDeliveryEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showSalesDelivery(data: bo.SalesDelivery): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加销售交货-行事件 */
            addSalesDeliveryItemEvent: Function;
            /** 删除销售交货-行事件 */
            removeSalesDeliveryItemEvent: Function;
            /** 显示数据 */
            showSalesDeliveryItems(datas: bo.SalesDeliveryItem[]): void;
            /** 选择销售交货客户事件 */
            chooseSalesDeliveryCustomerEvent: Function;
            /** 选择销售交货联系人信息 */
            chooseSalesDeliveryContactPersonEvent: Function;
            /** 选择销售交货价格清单事件 */
            chooseSalesDeliveryPriceListEvent: Function;
            /** 选择销售交货物料事件 */
            chooseSalesDeliveryItemMaterialEvent: Function;
            /** 选择销售交货仓库事件 */
            chooseSalesDeliveryItemWarehouseEvent: Function;
            /** 选择销售交货单位事件 */
            chooseSalesDeliveryItemUnitEvent: Function;
            /** 选择销售交货单行物料批次事件 */
            chooseSalesDeliveryItemMaterialBatchEvent: Function;
            /** 选择销售交货行物料序列事件 */
            chooseSalesDeliveryItemMaterialSerialEvent: Function;
            /** 选择销售交货-行 物料版本 */
            chooseSalesDeliveryItemMaterialVersionEvent: Function;
            /** 选择销售交货-销售订单事件 */
            chooseSalesDeliverySalesOrderEvent: Function;
            /** 选择销售交货-一揽子协议事件 */
            chooseSalesDeliveryBlanketAgreementEvent: Function;
            /** 选择销售交货-行 分配中心事件 */
            chooseSalesDeliveryItemDistributionRuleEvent: Function;
            /** 选择客户合同 */
            chooseCustomerAgreementsEvent: Function;
            /** 销售交货收款事件 */
            receiptSalesDeliveryEvent: Function;
            /** 编辑地址事件 */
            editShippingAddressesEvent: Function;
            /** 转为销售退货事件 */
            turnToSalesReturnEvent: Function;
            /** 转为销售发票事件 */
            turnToSalesInvoiceEvent: Function;
            /** 默认仓库 */
            defaultWarehouse: string;
            /** 默认税组 */
            defaultTaxGroup: string;
        }
        /** 销售交货编辑服务映射 */
        export class SalesDeliveryEditServiceMapping extends ibas.BOEditServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesDeliveryEditApp.APPLICATION_ID;
                this.name = SalesDeliveryEditApp.APPLICATION_NAME;
                this.boCode = SalesDeliveryEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOEditServiceCaller<bo.SalesDelivery>> {
                return new SalesDeliveryEditApp();
            }
        }
    }
}