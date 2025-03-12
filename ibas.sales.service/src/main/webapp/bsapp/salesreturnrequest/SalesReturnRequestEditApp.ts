/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 编辑应用-销售退货请求 */
        export class SalesReturnRequestEditApp extends ibas.BOEditService<ISalesReturnRequestEditView, bo.SalesReturnRequest> {
            /** 应用标识 */
            static APPLICATION_ID: string = "edaa1e1b-5e4e-4ea7-8310-ab44ebbf3cd4";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesreturnrequest_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesReturnRequest.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnRequestEditApp.APPLICATION_ID;
                this.name = SalesReturnRequestEditApp.APPLICATION_NAME;
                this.boCode = SalesReturnRequestEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addSalesReturnRequestItemEvent = this.addSalesReturnRequestItem;
                this.view.removeSalesReturnRequestItemEvent = this.removeSalesReturnRequestItem;
                this.view.chooseSalesReturnRequestCustomerEvent = this.chooseSalesReturnRequestCustomer;
                this.view.chooseSalesReturnRequestContactPersonEvent = this.chooseSalesReturnRequestContactPerson;
                this.view.chooseSalesReturnRequestPriceListEvent = this.chooseSalesReturnRequestPriceList;
                this.view.chooseSalesReturnRequestItemMaterialEvent = this.chooseSalesReturnRequestItemMaterial;
                this.view.chooseSalesReturnRequestItemWarehouseEvent = this.chooseSalesReturnRequestItemWarehouse;
                this.view.chooseSalesReturnRequestItemUnitEvent = this.chooseSalesReturnRequestItemUnit;
                this.view.chooseSalesReturnRequestItemMaterialBatchEvent = this.createSalesReturnRequestLineMaterialBatch;
                this.view.chooseSalesReturnRequestItemMaterialSerialEvent = this.createSalesReturnRequestLineMaterialSerial;
                this.view.chooseSalesReturnRequestItemMaterialVersionEvent = this.chooseSalesReturnRequestItemMaterialVersion;
                this.view.chooseSalesReturnRequestItemDistributionRuleEvent = this.chooseSalesReturnRequestItemDistributionRule;
                this.view.chooseSalesReturnRequestItemMaterialCatalogEvent = this.chooseSalesReturnRequestItemMaterialCatalog;
                this.view.chooseSalesReturnRequestSalesDeliveryEvent = this.chooseSalesReturnRequestSalesDelivery;
                this.view.chooseSalesReturnRequestSalesInvoiceEvent = this.chooseSalesReturnRequestSalesInvoice;
                this.view.chooseCustomerAgreementsEvent = this.chooseCustomerAgreements;
                this.view.editShippingAddressesEvent = this.editShippingAddresses;
                this.view.turnToSalesReturnEvent = this.turnToSalesReturn;
                this.view.measuringMaterialsEvent = this.measuringMaterials;
                this.view.viewHistoricalPricesEvent = this.viewHistoricalPrices;
                this.view.calculateGrossProfitEvent = this.calculateGrossProfit;
                this.view.choosePaymentTermEvent = this.choosePaymentTerm;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.SalesReturnRequest();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showSalesReturnRequest(this.editData);
                this.view.showSalesReturnRequestItems(this.editData.salesReturnRequestItems.filterDeleted());
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
                                this.customer = customer;
                                if (!ibas.strings.isEmpty(customer.warehouse)) {
                                    this.view.defaultWarehouse = customer.warehouse;
                                }
                            }
                        }
                    });
                }
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.SalesReturnRequest): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.SalesReturnRequest)) {
                    let data: bo.SalesReturnRequest = arguments[0];
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
                        boRepository.fetchSalesReturnRequest({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.SalesReturnRequest>): void {
                                let data: bo.SalesReturnRequest;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.SalesReturnRequest)) {
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
                boRepository.saveSalesReturnRequest({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesReturnRequest>): void {
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
                                if (that.editData.isDeleted !== true
                                    && that.editData.canceled !== ibas.emYesNo.YES
                                    && that.editData.deleted !== ibas.emYesNo.YES) {
                                    // 保存序列号信息
                                    if (!ibas.objects.isNull(that.serials) && that.serials.save instanceof Function) {
                                        that.serials.save(
                                            (error) => {
                                                if (error instanceof Error) {
                                                    that.messages(error);
                                                }
                                            }
                                        );
                                    }
                                    // 保存批次号信息
                                    if (!ibas.objects.isNull(that.batches) && that.batches.save instanceof Function) {
                                        that.batches.save(
                                            (error) => {
                                                if (error instanceof Error) {
                                                    that.messages(error);
                                                }
                                            }
                                        );
                                    }
                                }
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
                            if (that.editData.referenced === ibas.emYesNo.YES) {
                                that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_referenced", that.editData.toString()));
                            } else {
                                that.editData.delete();
                                that.saveData();
                            }
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
                        boRepository.parse<bo.SalesReturnRequest>({
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
                        that.editData = new bo.SalesReturnRequest();
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
            private customer: businesspartner.bo.ICustomer;
            /** 选择销售退货请求客户事件 */
            private chooseSalesReturnRequestCustomer(filterConditions?: ibas.ICondition[]): void {
                let items: bo.SalesReturnRequestItem[] = this.editData.salesReturnRequestItems.where(c =>
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
                                this.removeSalesReturnRequestItem(items);
                                this.chooseSalesReturnRequestCustomer(filterConditions);
                            }
                        }
                    });
                    return;
                }
                let conditions: ibas.IList<ibas.ICondition> = businesspartner.app.conditions.customer.create();
                // 添加输入条件
                if (filterConditions instanceof Array && filterConditions.length > 0) {
                    if (conditions.length > 1) {
                        conditions.firstOrDefault().bracketOpen++;
                        conditions.lastOrDefault().bracketClose++;
                    }
                    conditions.add(filterConditions);
                }
                let that: this = this;
                ibas.servicesManager.runChooseService<businesspartner.bo.ICustomer>({
                    boCode: businesspartner.bo.BO_CODE_CUSTOMER,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: conditions,
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
                        that.customer = selected;
                        // 客户改变，清除旧地址
                        that.editData.shippingAddresss.clear();
                        that.changeSalesReturnRequestItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 选择销售退货请求价格清单事件 */
            private chooseSalesReturnRequestPriceList(): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IMaterialPriceList>({
                    boCode: materials.bo.BO_CODE_MATERIALPRICELIST,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: materials.app.conditions.materialpricelist.create(),
                    onCompleted(selecteds: ibas.IList<materials.bo.IMaterialPriceList>): void {
                        let selected: materials.bo.IMaterialPriceList = selecteds.firstOrDefault();
                        that.editData.priceList = selected.objectKey;
                        if (ibas.strings.isEmpty(that.editData.documentCurrency)) {
                            that.editData.documentCurrency = selected.currency;
                        }
                        that.changeSalesReturnRequestItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 更改行价格 */
            private changeSalesReturnRequestItemPrice(priceList: number | ibas.ICriteria, items?: bo.SalesReturnRequestItem[]): void {
                if (ibas.objects.isNull(items)) {
                    items = this.editData.salesReturnRequestItems.filterDeleted();
                }
                if (typeof priceList === "number" && ibas.numbers.valueOf(priceList) !== 0) {
                    let criteria: ibas.ICriteria = materials.app.conditions.materialprice.create(this.editData.documentDate);
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = materials.app.conditions.materialprice.CONDITION_ALIAS_PRICELIST;
                    condition.value = priceList.toString();
                    if (!ibas.strings.isEmpty(this.editData.documentCurrency)) {
                        condition = criteria.conditions.create();
                        condition.alias = materials.app.conditions.materialprice.CONDITION_ALIAS_CURRENCY;
                        condition.value = this.editData.documentCurrency;
                    }
                    let count: number = criteria.conditions.length;
                    for (let item of items) {
                        if (!ibas.strings.isEmpty(item.parentLineSign)) {
                            continue;
                        }
                        condition = criteria.conditions.create();
                        condition.alias = materials.app.conditions.materialprice.CONDITION_ALIAS_ITEMCODE;
                        condition.value = item.itemCode;
                        condition.bracketOpen = 1;
                        if (criteria.conditions.length > count + 1) {
                            condition.relationship = ibas.emConditionRelationship.OR;
                        }
                        condition = criteria.conditions.create();
                        condition.alias = materials.app.conditions.materialprice.CONDITION_ALIAS_UOM;
                        condition.value = item.uom;
                        condition.bracketClose = 1;
                    }
                    if (criteria.conditions.length < count + 1) {
                        return;
                    }
                    if (criteria.conditions.length > count + 1) {
                        criteria.conditions[count].bracketOpen += 1;
                        criteria.conditions[criteria.conditions.length - 1].bracketClose += 1;
                    }
                    if (config.get(config.CONFIG_ITEM_FORCE_UPDATE_PRICE_FOR_PRICE_LIST_CHANGED, true) === true) {
                        // 强制刷新价格
                        this.changeSalesReturnRequestItemPrice(criteria, items);
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
                                    this.changeSalesReturnRequestItemPrice(criteria, items);
                                }
                            }
                        });
                    }
                } else if (priceList instanceof ibas.Criteria) {
                    this.busy(true);
                    // 增加业务伙伴条件
                    if (materials.config.isEnableMaterialSpecialPrices() && !ibas.strings.isEmpty(this.editData.customerCode)) {
                        if (priceList.conditions.length > 1) {
                            priceList.conditions.firstOrDefault().bracketOpen += 1;
                            priceList.conditions.lastOrDefault().bracketClose += 1;
                        }
                        let condition: ibas.ICondition = priceList.conditions.create();
                        condition.alias = materials.app.conditions.materialprice.CONDITION_ALIAS_CUSTOMER;
                        condition.value = this.editData.customerCode;
                    }
                    let boRepository: materials.bo.BORepositoryMaterials = new materials.bo.BORepositoryMaterials();
                    boRepository.fetchMaterialPrice({
                        criteria: priceList,
                        onCompleted: (opRslt) => {
                            for (let item of opRslt.resultObjects) {
                                items.forEach((value) => {
                                    if (item.itemCode === value.itemCode
                                        && (ibas.strings.isEmpty(value.uom)
                                            || (config.isInventoryUnitLinePrice() ? item.uom === value.inventoryUOM : item.uom === value.uom))) {
                                        if (item.taxed === ibas.emYesNo.YES) {
                                            value.unitPrice = 0;
                                            value.price = item.price;
                                            value.currency = item.currency;
                                        } else {
                                            value.unitPrice = 0;
                                            value.preTaxPrice = item.price;
                                            value.currency = item.currency;
                                        }
                                    }
                                });
                            }
                            this.busy(false);
                        }
                    });
                }
            }
            /** 选择销售退货请求物料事件 */
            private chooseSalesReturnRequestItemMaterial(caller: bo.SalesReturnRequestItem, filterConditions?: ibas.ICondition[]): void {
                let that: this = this;
                let condition: ibas.ICondition;
                let conditions: ibas.IList<ibas.ICondition> = materials.app.conditions.product.create(this.editData.documentDate);
                // 添加输入条件
                if (filterConditions instanceof Array && filterConditions.length > 0) {
                    if (conditions.length > 1) {
                        conditions.firstOrDefault().bracketOpen++;
                        conditions.lastOrDefault().bracketClose++;
                    }
                    conditions.add(filterConditions);
                }
                // 添加价格清单条件
                if (ibas.numbers.valueOf(this.editData.priceList) !== 0) {
                    condition = new ibas.Condition();
                    condition.alias = materials.app.conditions.product.CONDITION_ALIAS_PRICELIST;
                    condition.value = this.editData.priceList.toString();
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.relationship = ibas.emConditionRelationship.AND;
                    conditions.add(condition);
                    if (!ibas.strings.isEmpty(this.editData.documentCurrency)) {
                        condition = new ibas.Condition();
                        condition.alias = materials.app.conditions.product.CONDITION_ALIAS_CURRENCY;
                        condition.value = this.editData.documentCurrency;
                        condition.operation = ibas.emConditionOperation.EQUAL;
                        conditions.add(condition);
                    }
                    // 增加业务伙伴条件
                    if (materials.config.isEnableMaterialSpecialPrices() && !ibas.strings.isEmpty(this.editData.customerCode)) {
                        condition = new ibas.Condition();
                        condition.alias = materials.app.conditions.materialprice.CONDITION_ALIAS_CUSTOMER;
                        condition.value = this.editData.customerCode;
                        conditions.add(condition);
                    }
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
                        let index: number = that.editData.salesReturnRequestItems.indexOf(caller);
                        let item: bo.SalesReturnRequestItem = that.editData.salesReturnRequestItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        let beChangeds: ibas.IList<materials.app.IBeChangedUOMSource> = new ibas.ArrayList<materials.app.IBeChangedUOMSource>();
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesReturnRequestItems.create();
                                created = true;
                            }
                            item.baseProduct(selected);
                            item.returnCost = selected.price;
                            if (!ibas.strings.isEmpty(that.view.defaultWarehouse)) {
                                item.warehouse = that.view.defaultWarehouse;
                            }
                            beChangeds.add({
                                caller: item,
                                sourceUnit: item.uom,
                                targetUnit: item.inventoryUOM,
                                material: item.itemCode,
                                setUnitRate(this: bo.SalesReturnItem, value: number): void {
                                    this.uomRate = value;
                                }
                            });
                            item = null;
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
                            that.view.showSalesReturnRequestItems(that.editData.salesReturnRequestItems.filterDeleted());
                        }
                    }
                });
            }
            private chooseSalesReturnRequestItemWarehouse(caller: bo.SalesReturnRequestItem, filterConditions?: ibas.ICondition[]): void {
                let conditions: ibas.IList<ibas.ICondition> = materials.app.conditions.warehouse.create(this.editData.branch);
                // 添加输入条件
                if (filterConditions instanceof Array && filterConditions.length > 0) {
                    if (conditions.length > 1) {
                        conditions.firstOrDefault().bracketOpen++;
                        conditions.lastOrDefault().bracketClose++;
                    }
                    conditions.add(filterConditions);
                }
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.Warehouse>({
                    boCode: materials.bo.Warehouse.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: conditions,
                    onCompleted(selecteds: ibas.IList<materials.bo.IWarehouse>): void {
                        // 获取触发的对象
                        let index: number = that.editData.salesReturnRequestItems.indexOf(caller);
                        let item: bo.SalesReturnRequestItem = that.editData.salesReturnRequestItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesReturnRequestItems.create();
                                created = true;
                            }
                            item.warehouse = selected.code;
                            that.view.defaultWarehouse = item.warehouse;
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showSalesReturnRequestItems(that.editData.salesReturnRequestItems.filterDeleted());
                        }
                    }
                });
            }
            /** 添加销售退货请求-行事件 */
            private addSalesReturnRequestItem(items: bo.SalesReturnRequestItem[] | number): void {
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
                        let newItem: bo.SalesReturnRequestItem = item.clone();
                        newItem.lineId = undefined;
                        newItem.visOrder = undefined;
                        // 序列号清除
                        newItem.materialSerials.clear();
                        this.editData.salesReturnRequestItems.add(newItem);
                        if (builder.length > 2) {
                            builder.append(", ");
                        }
                        builder.append(newItem.lineId);
                    }
                    builder.append("] ");
                    if (builder.length > 3) {
                        this.proceeding(ibas.emMessageType.WARNING, builder.toString());
                        this.view.showSalesReturnRequestItems(this.editData.salesReturnRequestItems.filterDeleted());
                    }
                } else if (typeof items === "number" && items > 0) {
                    for (let i: number = 0; i < items; i++) {
                        this.editData.salesReturnRequestItems.create();
                    }
                    this.view.showSalesReturnRequestItems(this.editData.salesReturnRequestItems.filterDeleted());
                } else {
                    this.chooseSalesReturnRequestItemMaterial(undefined);
                }
            }
            /** 删除销售退货请求-行事件 */
            private removeSalesReturnRequestItem(items: bo.SalesReturnRequestItem[]): void {
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                // 移除项目
                for (let item of items) {
                    if (this.editData.salesReturnRequestItems.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesReturnRequestItems.remove(item);
                        } else {
                            // 非新建标记删除
                            if (item.referenced === ibas.emYesNo.YES) {
                                this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_referenced", item.toString()));
                            } else {
                                item.delete();
                            }
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showSalesReturnRequestItems(this.editData.salesReturnRequestItems.filterDeleted());
            }
            private batches: materials.app.IServiceExtraBatches;
            /** 选择物料批次信息 */
            private createSalesReturnRequestLineMaterialBatch(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialBatchContract> = new ibas.ArrayList<materials.app.IMaterialBatchContract>();
                for (let item of this.editData.salesReturnRequestItems) {
                    contracts.add({
                        batchManagement: item.batchManagement,
                        itemCode: item.itemCode,
                        itemDescription: item.itemDescription,
                        itemVersion: item.itemVersion,
                        warehouse: item.warehouse,
                        quantity: item.inventoryQuantity,
                        uom: item.inventoryUOM,
                        materialBatches: item.materialBatches,
                        agreements: item.agreements
                    });
                }
                ibas.servicesManager.runApplicationService<materials.app.IMaterialBatchContract[], materials.app.IServiceExtraBatches>({
                    proxy: new materials.app.MaterialBatchReceiptServiceProxy(contracts),
                    onCompleted: (results) => {
                        this.batches = results;
                    }
                });
            }
            private serials: materials.app.IServiceExtraSerials;
            /** 选择物料序列信息 */
            private createSalesReturnRequestLineMaterialSerial(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialSerialContract> = new ibas.ArrayList<materials.app.IMaterialSerialContract>();
                for (let item of this.editData.salesReturnRequestItems) {
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
                ibas.servicesManager.runApplicationService<materials.app.IMaterialSerialContract[], materials.app.IServiceExtraSerials>({
                    proxy: new materials.app.MaterialSerialReceiptServiceProxy(contracts),
                    onCompleted: (results) => {
                        this.serials = results;
                    }
                });
            }
            /** 选择销售退货请求项目-销售交货事件 */
            private chooseSalesReturnRequestSalesDelivery(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesdelivery_customercode")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = bo.SalesDelivery.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesDelivery.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 非计划的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesDelivery.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.PLANNED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = bo.SalesDelivery.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = bo.SalesDelivery.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(this.editData.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesDelivery.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesDelivery.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesDelivery.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesDelivery.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = this.editData.customerCode;
                // 指定了合同/协议
                if (!ibas.strings.isEmpty(this.editData.agreements)) {
                    let index: number = criteria.conditions.length;
                    for (let item of this.editData.agreements.split(ibas.DATA_SEPARATOR)) {
                        if (ibas.strings.isEmpty(item)) {
                            continue;
                        }
                        condition = criteria.conditions.create();
                        condition.alias = bo.SalesDelivery.PROPERTY_AGREEMENTS_NAME;
                        condition.operation = ibas.emConditionOperation.CONTAIN;
                        condition.value = item;
                        if (criteria.conditions.length > (index + 1)) {
                            condition.relationship = ibas.emConditionRelationship.OR;
                        }
                    }
                    if (criteria.conditions.length > (index + 2)) {
                        criteria.conditions[index].bracketOpen += 1;
                        criteria.conditions[criteria.conditions.length - 1].bracketClose += 1;
                    }
                }
                // 子项查询
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesDelivery.PROPERTY_SALESDELIVERYITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                cCriteria.noChilds = false;
                // 未取消的
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesDeliveryItem.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 数量大于已清数量
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesDeliveryItem.PROPERTY_QUANTITY_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = bo.SalesDeliveryItem.PROPERTY_CLOSEDQUANTITY_NAME;
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
                        that.view.showSalesReturnRequestItems(that.editData.salesReturnRequestItems.filterDeleted());
                    }
                });
            }
            /** 选择销售退货请求项目-销售发票事件 */
            private chooseSalesReturnRequestSalesInvoice(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesdelivery_customercode")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = bo.SalesInvoice.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesInvoice.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 非计划的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesInvoice.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = ibas.emDocumentStatus.PLANNED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = bo.SalesInvoice.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = bo.SalesInvoice.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(this.editData.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesInvoice.PROPERTY_CUSTOMERCODE_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = this.editData.customerCode;
                // 指定了合同/协议
                if (!ibas.strings.isEmpty(this.editData.agreements)) {
                    let index: number = criteria.conditions.length;
                    for (let item of this.editData.agreements.split(ibas.DATA_SEPARATOR)) {
                        if (ibas.strings.isEmpty(item)) {
                            continue;
                        }
                        condition = criteria.conditions.create();
                        condition.alias = bo.SalesInvoice.PROPERTY_AGREEMENTS_NAME;
                        condition.operation = ibas.emConditionOperation.CONTAIN;
                        condition.value = item;
                        if (criteria.conditions.length > (index + 1)) {
                            condition.relationship = ibas.emConditionRelationship.OR;
                        }
                    }
                    if (criteria.conditions.length > (index + 2)) {
                        criteria.conditions[index].bracketOpen += 1;
                        criteria.conditions[criteria.conditions.length - 1].bracketClose += 1;
                    }
                }
                // 子项查询
                let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCriteria.propertyPath = bo.SalesInvoice.PROPERTY_SALESINVOICEITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                cCriteria.noChilds = false;
                // 未取消的
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesInvoiceItem.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 数量大于已清数量
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesInvoiceItem.PROPERTY_QUANTITY_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = bo.SalesInvoiceItem.PROPERTY_CLOSEDQUANTITY_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.SalesInvoice>({
                    boCode: bo.SalesInvoice.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.SalesInvoice>): void {
                        for (let selected of selecteds) {
                            if (!ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                continue;
                            }
                            that.editData.baseDocument(selected);
                        }
                        that.view.showSalesReturnRequestItems(that.editData.salesReturnRequestItems.filterDeleted());
                    }
                });
            }
            /** 选择联系人 */
            private chooseSalesReturnRequestContactPerson(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesreturnrequest_customercode")
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
                if (!ibas.strings.isEmpty(this.customer?.lead)) {
                    // 也可使用潜在客户的
                    criteria.conditions.firstOrDefault().bracketOpen = 2;
                    criteria.conditions.lastOrDefault().bracketClose = 1;
                    condition = criteria.conditions.create();
                    condition.alias = businesspartner.bo.ContactPerson.PROPERTY_OWNERTYPE_NAME;
                    condition.value = businesspartner.bo.emBusinessPartnerType.LEAD.toString();
                    condition.bracketOpen = 1;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition = criteria.conditions.create();
                    condition.alias = businesspartner.bo.ContactPerson.PROPERTY_BUSINESSPARTNER_NAME;
                    condition.value = this.customer.lead;
                    condition.bracketClose = 2;
                }
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
            /** 转为销售贷项事件 */
            protected turnToSalesReturn(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesReturnRequest({
                    criteria: this.editData.criteria(),
                    onCompleted: (opRslt) => {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                throw new Error(ibas.i18n.prop("shell_data_deleted"));
                            }
                            this.editData = opRslt.resultObjects.firstOrDefault();
                            this.view.showSalesReturnRequest(this.editData);
                            this.view.showSalesReturnRequestItems(this.editData.salesReturnRequestItems.filterDeleted());
                            if ((this.editData.approvalStatus !== ibas.emApprovalStatus.APPROVED && this.editData.approvalStatus !== ibas.emApprovalStatus.UNAFFECTED)
                                || this.editData.deleted === ibas.emYesNo.YES
                                || this.editData.canceled === ibas.emYesNo.YES
                                || this.editData.documentStatus === ibas.emDocumentStatus.PLANNED
                            ) {
                                throw new Error(ibas.i18n.prop("sales_invaild_status_not_support_turn_to_operation"));
                            }
                            let target: bo.SalesReturn = new bo.SalesReturn();
                            target.customerCode = this.editData.customerCode;
                            target.customerName = this.editData.customerName;
                            target.baseDocument(this.editData);
                            // 整单基于，则赋折扣、总计
                            if (ibas.numbers.valueOf(target.itemsLineTotal) === this.editData.itemsLineTotal
                                && ibas.numbers.valueOf(target.shippingsExpenseTotal) === this.editData.shippingsExpenseTotal) {
                                target.rounding = this.editData.rounding;
                                target.diffAmount = this.editData.diffAmount;
                                target.discount = this.editData.discount;
                                target.inverseDiscount = this.editData.inverseDiscount;
                                target.documentTotal = this.editData.documentTotal;
                            }
                            // 设置单据类型
                            bo.baseDocument_OrderType(target, this.editData);

                            let app: SalesReturnEditApp = new SalesReturnEditApp();
                            app.navigation = this.navigation;
                            app.viewShower = this.viewShower;
                            app.run(target);

                        } catch (error) {
                            this.messages(error);
                        }
                    }
                });

            }
            private chooseSalesReturnRequestItemUnit(caller: bo.SalesReturnRequestItem, filterConditions?: ibas.ICondition[]): void {
                let conditions: ibas.IList<ibas.ICondition> = ibas.arrays.create(
                    new ibas.Condition(materials.bo.Unit.PROPERTY_ACTIVATED_NAME, ibas.emConditionOperation.EQUAL, ibas.emYesNo.YES)
                );
                // 添加输入条件
                if (filterConditions instanceof Array && filterConditions.length > 0) {
                    if (conditions.length > 1) {
                        conditions.firstOrDefault().bracketOpen++;
                        conditions.lastOrDefault().bracketClose++;
                    }
                    conditions.add(filterConditions);
                }
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IUnit>({
                    boCode: materials.bo.BO_CODE_UNIT,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: conditions,
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
                        that.changeSalesReturnRequestItemPrice(that.editData.priceList, [caller]);
                    }
                });
            }
            private chooseSalesReturnRequestItemMaterialVersion(caller: bo.SalesReturnRequestItem): void {
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
                        ibas.i18n.prop("bo_salesreturnrequest_customercode")
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
                // 是否指定分支
                if (!ibas.strings.isEmpty(this.editData.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesReturnRequest.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesReturnRequest.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesReturnRequest.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
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
            private chooseSalesReturnRequestItemDistributionRule(type: accounting.app.emDimensionType, caller: bo.SalesReturnRequestItem): void {
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
            protected measuringMaterials(): void {
                let lines: ibas.ArrayList<materials.app.IMaterialMeasurementContractLine> = new ibas.ArrayList<materials.app.IMaterialMeasurementContractLine>();
                for (let item of this.editData.salesReturnRequestItems) {
                    lines.add({
                        lineId: item.lineId,
                        itemCode: item.itemCode,
                        itemDescription: item.itemDescription,
                        quantity: item.quantity,
                        uom: item.uom,
                    });
                }
                ibas.servicesManager.runApplicationService<materials.app.IMaterialMeasurementContract>({
                    proxy: new materials.app.MaterialMeasurementServiceProxy({
                        mode: "SALES",
                        documentType: this.editData.objectCode,
                        documentEntry: this.editData.docEntry,
                        lines: lines,
                    })
                });
            }
            protected chooseSalesReturnRequestItemMaterialCatalog(caller: bo.SalesReturnRequestItem, filterConditions?: ibas.ICondition[]): void {
                if (ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(
                        ibas.emMessageType.WARNING, ibas.i18n.prop("sales_please_choose_customer_first")
                    ); return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = materials.bo.BusinessPartnerMaterialCatalog.PROPERTY_BUSINESSPARTNERTYPE_NAME;
                condition.value = businesspartner.bo.emBusinessPartnerType.CUSTOMER.toString();
                condition = criteria.conditions.create();
                condition.alias = materials.bo.BusinessPartnerMaterialCatalog.PROPERTY_BUSINESSPARTNERCODE_NAME;
                condition.value = this.editData.customerCode;
                condition = criteria.conditions.create();
                condition.alias = materials.bo.BusinessPartnerMaterialCatalog.PROPERTY_ITEMCODE_NAME;
                condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                condition.value = "";
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = materials.bo.BusinessPartnerMaterialCatalog.PROPERTY_ITEMCODE_NAME;
                condition.operation = ibas.emConditionOperation.NOT_NULL;
                condition.bracketClose = 1;
                // 添加输入条件
                if (filterConditions instanceof Array && filterConditions.length > 0) {
                    if (criteria.conditions.length > 1) {
                        criteria.conditions.firstOrDefault().bracketOpen++;
                        criteria.conditions.lastOrDefault().bracketClose++;
                    }
                    criteria.conditions.add(filterConditions);
                }
                // 调用选择服务
                ibas.servicesManager.runChooseService<materials.bo.BusinessPartnerMaterialCatalog>({
                    criteria: criteria,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    boCode: materials.bo.BusinessPartnerMaterialCatalog.BUSINESS_OBJECT_CODE,
                    onCompleted: (selecteds) => {
                        let count: number = this.editData.salesReturnRequestItems.length;
                        for (let selected of selecteds) {
                            if (ibas.strings.isEmpty(selected.itemCode)) {
                                continue;
                            }
                            if (ibas.objects.isNull(caller)) {
                                caller = this.editData.salesReturnRequestItems.create();
                            }
                            caller.catalogCode = selected.catalogCode;
                            condition = new ibas.Condition();
                            condition.alias = materials.bo.Material.PROPERTY_CODE_NAME;
                            condition.value = selected.itemCode;
                            this.chooseSalesReturnRequestItemMaterial(caller, [condition]);
                            caller = null;
                        }
                        if (this.editData.salesReturnRequestItems.length > count) {
                            this.view.showSalesReturnRequestItems(this.editData.salesReturnRequestItems.filterDeleted());
                        }
                    }
                });
            }
            protected calculateGrossProfit(): void {
                let lines: ibas.ArrayList<materials.app.IMaterialGrossProfitContractLine>
                    = new ibas.ArrayList<materials.app.IMaterialGrossProfitContractLine>();
                for (let item of this.editData.salesReturnRequestItems) {
                    if (item.isDeleted === true) {
                        continue;
                    }
                    if (!ibas.strings.isEmpty(item.parentLineSign)) {
                        continue;
                    }
                    lines.add({
                        lineId: item.lineId,
                        itemCode: item.itemCode,
                        itemDescription: item.itemDescription,
                        quantity: item.quantity,
                        uom: item.uom,
                        price: item.preTaxPrice,
                        currency: item.currency,
                        getGrossProfitPrice(): number {
                            return item.grossPrice;
                        },
                        setGrossProfitPrice(value: number): void {
                            item.grossPrice = value;
                        },
                        getGrossProfitSource(): number {
                            return item.grossBase;
                        },
                        setGrossProfitSource(value: number): void {
                            item.grossBase = value;
                        }
                    });
                }
                ibas.servicesManager.runApplicationService<materials.app.IMaterialGrossProfitContract>({
                    proxy: new materials.app.MaterialGrossProfitServiceProxy({
                        documentType: this.editData.objectCode,
                        documentEntry: this.editData.docEntry,
                        documentCurrency: this.editData.documentCurrency,
                        documentDate: this.editData.documentDate,
                        getGrossProfitList: () => {
                            return this.editData.grossBase;
                        },
                        setGrossProfitList: (value) => {
                            this.editData.grossBase = value;
                        },
                        getGrossProfit: () => {
                            return this.editData.grossProfit;
                        },
                        setGrossProfit: (value) => {
                            this.editData.grossProfit = value;
                        },
                        lines: lines,
                    })
                });
            }
            protected viewHistoricalPrices(caller: bo.SalesReturnRequestItem): void {
                if (ibas.objects.isNull(caller)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_view")
                    )); return;
                }
                if (ibas.strings.isEmpty(caller.itemCode)) {
                    this.messages(
                        ibas.emMessageType.WARNING, ibas.i18n.prop("sales_please_choose_material_first")
                    ); return;
                }
                if (ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(
                        ibas.emMessageType.WARNING, ibas.i18n.prop("sales_please_choose_customer_first")
                    ); return;
                }
                ibas.servicesManager.runApplicationService<materials.app.IMaterialHistoricalPricesContract>({
                    proxy: new materials.app.MaterialHistoricalPricesServiceProxy({
                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                        businessPartnerCode: this.editData.customerCode,
                        businessPartnerName: this.editData.customerName,
                        documentType: this.editData.objectCode,
                        documentEntry: this.editData.docEntry,
                        documentLineId: caller.lineId,
                        documentDate: this.editData.documentDate,
                        itemCode: caller.itemCode,
                        itemDescription: caller.itemDescription,
                        quantity: caller.quantity,
                        uom: caller.uom,
                        applyPrice: (price, currency) => {
                            caller.preTaxPrice = price;
                            caller.currency = currency;
                        }
                    })
                });
            }
            protected choosePaymentTerm(criteria?: ibas.ICriteria): void {
                if (ibas.objects.isNull(criteria) || criteria.conditions.length === 0) {
                    criteria = new ibas.Criteria();
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = businesspartner.bo.PaymentTerm.PROPERTY_ACTIVATED_NAME;
                    condition.value = ibas.emYesNo.YES.toString();
                    ibas.servicesManager.runChooseService<businesspartner.bo.PaymentTerm>({
                        criteria: criteria,
                        chooseType: ibas.emChooseType.SINGLE,
                        boCode: businesspartner.bo.PaymentTerm.BUSINESS_OBJECT_CODE,
                        onCompleted: (selecteds) => {
                            for (let selected of selecteds) {
                                this.editData.paymentCode = selected.code;
                            }
                        }
                    });
                } else {
                    let boReposiorty: businesspartner.bo.BORepositoryBusinessPartner = new businesspartner.bo.BORepositoryBusinessPartner();
                    boReposiorty.fetchPaymentTerm({
                        criteria: criteria,
                        onCompleted: (opRslt) => {
                            for (let selected of opRslt.resultObjects) {
                                if (selected.dueDateBaseOn === businesspartner.bo.emDueDateBaseOn.DOCUMENT_DATE) {
                                    this.editData.deliveryDate = selected.calculateTermDate(this.editData.documentDate);
                                } else if (selected.dueDateBaseOn === businesspartner.bo.emDueDateBaseOn.POSTING_DATE) {
                                    this.editData.deliveryDate = selected.calculateTermDate(this.editData.postingDate);
                                } else if (selected.dueDateBaseOn === businesspartner.bo.emDueDateBaseOn.SYSTEM_DATE) {
                                    this.editData.deliveryDate = selected.calculateTermDate(ibas.dates.today());
                                }
                            }
                        }
                    });
                }
            }
        }
        /** 视图-销售退货请求 */
        export interface ISalesReturnRequestEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showSalesReturnRequest(data: bo.SalesReturnRequest): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加销售退货请求-行事件 */
            addSalesReturnRequestItemEvent: Function;
            /** 删除销售退货请求-行事件 */
            removeSalesReturnRequestItemEvent: Function;
            /** 显示数据 */
            showSalesReturnRequestItems(datas: bo.SalesReturnRequestItem[]): void;
            /** 选择销售退货请求客户事件 */
            chooseSalesReturnRequestCustomerEvent: Function;
            /** 选择销售退货请求联系人信息 */
            chooseSalesReturnRequestContactPersonEvent: Function;
            /** 选择销售退货请求价格清单事件 */
            chooseSalesReturnRequestPriceListEvent: Function;
            /** 选择销售退货请求物料事件 */
            chooseSalesReturnRequestItemMaterialEvent: Function;
            /** 选择销售退货请求仓库事件 */
            chooseSalesReturnRequestItemWarehouseEvent: Function;
            /** 选择销售退货请求-行 单位 */
            chooseSalesReturnRequestItemUnitEvent: Function;
            /** 选择销售退货请求单行物料批次事件 */
            chooseSalesReturnRequestItemMaterialBatchEvent: Function;
            /** 选择销售退货请求行物料序列事件 */
            chooseSalesReturnRequestItemMaterialSerialEvent: Function;
            /** 选择销售退货请求-行 物料版本 */
            chooseSalesReturnRequestItemMaterialVersionEvent: Function;
            /** 选择一业务伙伴目录事件 */
            chooseSalesReturnRequestItemMaterialCatalogEvent: Function;
            /** 选择销售退货请求-行 成本中心事件 */
            chooseSalesReturnRequestItemDistributionRuleEvent: Function;
            /** 选择销售退货请求项目-销售交货事件 */
            chooseSalesReturnRequestSalesDeliveryEvent: Function;
            /** 选择销售退货请求项目-销售发票事件 */
            chooseSalesReturnRequestSalesInvoiceEvent: Function;
            /** 选择客户合同 */
            chooseCustomerAgreementsEvent: Function;
            /** 编辑地址事件 */
            editShippingAddressesEvent: Function;
            /** 转为销售贷项事件 */
            turnToSalesReturnEvent: Function;
            /** 测量物料事件 */
            measuringMaterialsEvent: Function;
            /** 查看物料历史价格事件 */
            viewHistoricalPricesEvent: Function;
            /** 计算毛利润 */
            calculateGrossProfitEvent: Function;
            /** 选择付款条款事件 */
            choosePaymentTermEvent: Function;
            /** 默认仓库 */
            defaultWarehouse: string;
        }
        /** 销售退货请求编辑服务映射 */
        export class SalesReturnRequestEditServiceMapping extends ibas.BOEditServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnRequestEditApp.APPLICATION_ID;
                this.name = SalesReturnRequestEditApp.APPLICATION_NAME;
                this.boCode = SalesReturnRequestEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOEditServiceCaller<bo.SalesReturnRequest>> {
                return new SalesReturnRequestEditApp();
            }
        }
    }
}