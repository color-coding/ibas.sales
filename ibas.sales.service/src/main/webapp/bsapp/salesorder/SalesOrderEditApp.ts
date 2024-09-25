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
        export class SalesOrderEditApp extends ibas.BOEditService<ISalesOrderEditView, bo.SalesOrder> {
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
                this.view.chooseSalesOrderItemMaterialVersionEvent = this.chooseSalesOrderItemMaterialVersion;
                this.view.chooseSalesOrderItemDistributionRuleEvent = this.chooseSalesOrderItemDistributionRule;
                this.view.chooseSalesOrderItemMaterialCatalogEvent = this.chooseSalesOrderItemMaterialCatalog;
                this.view.chooseSalesOrderSalesQuoteEvent = this.chooseSalesOrderSalesQuote;
                this.view.chooseSalesOrderBlanketAgreementEvent = this.chooseSalesOrderBlanketAgreement;
                this.view.chooseSalesOrderItemUnitEvent = this.chooseSalesOrderItemUnit;
                this.view.chooseCustomerAgreementsEvent = this.chooseCustomerAgreements;
                this.view.receiptSalesOrderEvent = this.receiptSalesOrder;
                this.view.editShippingAddressesEvent = this.editShippingAddresses;
                this.view.showSalesOrderItemExtraEvent = this.showSaleOrderItemExtra;
                this.view.turnToSalesDeliveryEvent = this.turnToSalesDelivery;
                this.view.turnToSalesInvoiceEvent = this.turnToSalesInvoice;
                this.view.turnToSalesReserveInvoiceEvent = this.turnToSalesReserveInvoice;
                this.view.turnToSalesReturnEvent = this.turnToSalesReturn;
                this.view.turnToDownPaymentRequestEvent = this.turnToDownPaymentRequest;
                this.view.reserveMaterialsInventoryEvent = this.reserveMaterialsInventory;
                this.view.measuringMaterialsEvent = this.measuringMaterials;
                this.view.calculateGrossProfitEvent = this.calculateGrossProfit;
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
                        boRepository.parse<bo.SalesOrder>({
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
            private customer: businesspartner.bo.ICustomer;
            /** 选择销售订单客户事件 */
            private chooseSalesOrderCustomer(filterConditions?: ibas.ICondition[]): void {
                let items: bo.SalesOrderItem[] = this.editData.salesOrderItems.where(c =>
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
                                this.removeSalesOrderItem(items);
                                this.chooseSalesOrderCustomer(filterConditions);
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
                        if (!ibas.strings.isEmpty(selected.taxGroup)) {
                            that.view.defaultTaxGroup = selected.taxGroup;
                        }
                        that.customer = selected;
                        // 客户改变，清除旧地址
                        that.editData.shippingAddresss.clear();
                        if (selected.shipAddress > 0) {
                            let criteria: ibas.ICriteria = new ibas.Criteria();
                            let condition: ibas.ICondition = criteria.conditions.create();
                            condition.alias = businesspartner.bo.Address.PROPERTY_OBJECTKEY_NAME;
                            condition.value = selected.shipAddress.toString();
                            condition = criteria.conditions.create();
                            condition.alias = businesspartner.bo.Address.PROPERTY_OWNERTYPE_NAME;
                            condition.value = businesspartner.bo.emBusinessPartnerType.CUSTOMER.toString();
                            condition = criteria.conditions.create();
                            condition.alias = businesspartner.bo.Address.PROPERTY_BUSINESSPARTNER_NAME;
                            condition.value = selected.code;
                            condition = criteria.conditions.create();
                            condition.alias = businesspartner.bo.Address.PROPERTY_ACTIVATED_NAME;
                            condition.value = ibas.emYesNo.YES.toString();
                            let boRepository: businesspartner.bo.BORepositoryBusinessPartner = new businesspartner.bo.BORepositoryBusinessPartner();
                            boRepository.fetchAddress({
                                criteria: criteria,
                                onCompleted(opRslt: ibas.IOperationResult<businesspartner.bo.Address>): void {
                                    for (let item of opRslt.resultObjects) {
                                        let shipAddress: bo.ShippingAddress = new bo.ShippingAddress();
                                        shipAddress.baseAddress(item);
                                        that.editData.shippingAddresss.add(shipAddress);
                                    }
                                }
                            });
                        }
                        that.changeSalesOrderItemPrice(that.editData.priceList);
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
                        if (ibas.strings.isEmpty(that.editData.documentCurrency)) {
                            that.editData.documentCurrency = selected.currency;
                        }
                        that.changeSalesOrderItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 更改行价格 */
            private changeSalesOrderItemPrice(priceList: number | ibas.ICriteria, items?: bo.SalesOrderItem[]): void {
                if (ibas.objects.isNull(items)) {
                    items = this.editData.salesOrderItems.filterDeleted();
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
                        this.changeSalesOrderItemPrice(criteria, items);
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
                                    this.changeSalesOrderItemPrice(criteria, items);
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
            /** 选择销售订单物料事件 */
            private chooseSalesOrderItemMaterial(caller: bo.SalesOrderItem, type?: string, filterConditions?: ibas.ICondition[]): void {
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
                // 产品库存时
                if (materials.bo.BO_CODE_PRODUCT_INVENTORY === type) {
                    // 有库存的
                    condition = new ibas.Condition();
                    condition.alias = materials.bo.Product.PROPERTY_ONHAND_NAME;
                    condition.value = "0";
                    condition.operation = ibas.emConditionOperation.GRATER_THAN;
                    conditions.add(condition);
                }
                // 调用选择服务
                ibas.servicesManager.runChooseService<materials.bo.IProduct>({
                    boCode: type ? materials.bo.BO_CODE_PRODUCT_INVENTORY : materials.bo.BO_CODE_PRODUCT,
                    criteria: conditions,
                    onCompleted(selecteds: ibas.IList<materials.bo.IProduct>): void {
                        // 获取触发的对象
                        let index: number = that.editData.salesOrderItems.indexOf(caller);
                        let item: bo.SalesOrderItem = that.editData.salesOrderItems[index];
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
                                                        for (let sItem of bo.baseProductSuit(that.editData.salesOrderItems, pData)) {
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
                                                                    setUnitRate(this: bo.SalesOrderItem, value: number): void {
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
                                }
                                if (ibas.objects.isNull(item)) {
                                    item = that.editData.salesOrderItems.create();
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
                                    setUnitRate(this: bo.SalesOrderItem, value: number): void {
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
                                that.view.showSalesOrderItems(that.editData.salesOrderItems.filterDeleted());
                            }
                        });
                    }
                });
            }
            /** 添加销售订单-行事件 */
            private addSalesOrderItem(items: bo.SalesOrderItem[] | number): void {
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
                        let newItem: bo.SalesOrderItem = item.clone();
                        newItem.lineId = undefined;
                        newItem.visOrder = undefined;
                        // 序列号清除
                        newItem.materialSerials.clear();
                        this.editData.salesOrderItems.add(newItem);
                        if (builder.length > 2) {
                            builder.append(", ");
                        }
                        builder.append(newItem.lineId);
                    }
                    builder.append("] ");
                    if (builder.length > 3) {
                        this.proceeding(ibas.emMessageType.WARNING, builder.toString());
                        this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
                    }
                } else if (typeof items === "number" && items > 0) {
                    for (let i: number = 0; i < items; i++) {
                        this.editData.salesOrderItems.create();
                    }
                    this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
                } else {
                    this.chooseSalesOrderItemMaterial(undefined);
                }
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
                            if (item.referenced === ibas.emYesNo.YES) {
                                this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_referenced", item.toString()));
                            } else {
                                item.delete();
                            }
                        }
                        // 删除子项
                        if (!ibas.strings.isEmpty(item.lineSign) && (item.isNew || item.isDeleted)) {
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
            private chooseSalesOrderItemWarehouse(caller: bo.SalesOrderItem, filterConditions?: ibas.ICondition[]): void {
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
            private chooseSalesOrderItemMaterialSerial(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialSerialContract> = new ibas.ArrayList<materials.app.IMaterialSerialContract>();
                for (let item of this.editData.salesOrderItems) {
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
                condition.alias = bo.SalesQuote.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesQuote.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 仅下达的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesQuote.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emDocumentStatus.RELEASED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = bo.SalesQuote.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = bo.SalesQuote.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(this.editData.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesQuote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesQuote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesQuote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesQuote.PROPERTY_CUSTOMERCODE_NAME;
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
                        condition.alias = bo.SalesQuote.PROPERTY_AGREEMENTS_NAME;
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
                // 潜在客户的
                if (!ibas.objects.isNull(this.customer) && !ibas.strings.isEmpty(this.customer.lead)) {
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesQuote.PROPERTY_CUSTOMERCODE_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.customer.lead;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 未过期的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesQuote.PROPERTY_DELIVERYDATE_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_EQUAL;
                condition.value = ibas.dates.toString(ibas.dates.today());
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.SalesQuote>({
                    boCode: bo.SalesQuote.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.SalesQuote>): void {
                        for (let selected of selecteds) {
                            if (ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                that.editData.baseDocument(selected);
                            } else if (!ibas.objects.isNull(that.customer) && ibas.strings.equals(that.customer.lead, selected.customerCode)) {
                                // 潜在客户的报价，调整下客户编码
                                selected.customerCode = that.editData.customerCode;
                                selected.customerName = that.editData.customerName;
                                that.editData.baseDocument(selected);
                            }
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
                if (amount < 0 || (amount === 0 && this.editData.documentTotal !== 0)) {
                    throw new Error(ibas.i18n.prop("sales_receipted"));
                }
                ibas.servicesManager.runApplicationService<businesspartner.app.IReceiptContract, receiptpayment.bo.Receipt>({
                    proxy: new businesspartner.app.ReceiptServiceProxy({
                        businessPartnerType: businesspartner.bo.emBusinessPartnerType.CUSTOMER,
                        businessPartnerCode: this.editData.customerCode,
                        documentType: this.editData.objectCode,
                        documentEntry: this.editData.docEntry,
                        documentCurrency: this.editData.documentCurrency,
                        branch: this.editData.branch,
                        documentTotal: amount,
                        allowPartial: true
                    }),
                    onCompleted: (receipt) => {
                        this.proceeding(ibas.emMessageType.SUCCESS, ibas.i18n.prop("sales_document_receipted", receipt.docEntry, receipt.documentTotal, receipt.documentCurrency));
                    }
                });
            }
            /** 选择联系人 */
            private chooseSalesOrderContactPerson(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesorder_customercode")
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
                app.run(data, this.editData);
            }
            /** 转为销售交货 */
            protected turnToSalesDelivery(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesOrder({
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
                            this.view.showSalesOrder(this.editData);
                            this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
                            if ((this.editData.approvalStatus !== ibas.emApprovalStatus.APPROVED && this.editData.approvalStatus !== ibas.emApprovalStatus.UNAFFECTED)
                                || this.editData.deleted === ibas.emYesNo.YES
                                || this.editData.canceled === ibas.emYesNo.YES
                                || this.editData.documentStatus === ibas.emDocumentStatus.PLANNED
                            ) {
                                throw new Error(ibas.i18n.prop("sales_invaild_status_not_support_turn_to_operation"));
                            }
                            let target: bo.SalesDelivery = new bo.SalesDelivery();
                            target.customerCode = this.editData.customerCode;
                            target.customerName = this.editData.customerName;
                            target.baseDocument(this.editData);
                            // 使用预留库存
                            materials.app.useReservedMaterialsInventory({
                                targetType: this.editData.objectCode,
                                targetEntries: this.editData.docEntry,
                                onCompleted: (results) => {
                                    if (results instanceof Error) {
                                        // 错误
                                        this.messages(results);
                                    } else if (results.length > 0) {
                                        // 出库数预置为0，包括基于来的批次数量
                                        let qtyMap: Map<any, number> = new Map<any, number>();
                                        for (let item of target.salesDeliveryItems) {
                                            if (this.editData.objectCode === item.baseDocumentType
                                                && this.editData.docEntry === item.baseDocumentEntry) {
                                                // 不激活逻辑计算
                                                qtyMap.set(item, item.quantity);
                                                item.isLoading = true;
                                                item.quantity = 0;
                                                item.materialBatches.forEach(d => d.quantity = 0);
                                            }
                                        }
                                        // 使用预留库存
                                        for (let result of results) {
                                            if (result.status === ibas.emBOStatus.CLOSED) {
                                                continue;
                                            }
                                            if (result.closedQuantity >= result.quantity) {
                                                continue;
                                            }
                                            let wItems: bo.SalesDeliveryItem[] = target.salesDeliveryItems.where(c =>
                                                result.targetDocumentType === c.baseDocumentType
                                                && result.targetDocumentEntry === c.baseDocumentEntry
                                                && result.targetDocumentLineId === c.baseDocumentLineId
                                                && result.itemCode === c.itemCode
                                            );
                                            if (wItems.length === 0) {
                                                continue;
                                            }
                                            let wItem: bo.SalesDeliveryItem = wItems.find(c => c.warehouse === result.warehouse);
                                            if (ibas.objects.isNull(wItem)) {
                                                // 没有同仓库的，则新建行
                                                if (wItems[0].quantity === 0) {
                                                    wItem = wItems[0];
                                                } else {
                                                    wItem = wItems[0].clone();
                                                    target.salesDeliveryItems.add(wItem);
                                                }
                                                wItem.warehouse = result.warehouse;
                                            }
                                            // 应用库存
                                            wItem.quantity = ibas.numbers.round(wItem.quantity + result.quantity - result.closedQuantity);
                                            // 处理明细项
                                            if (!ibas.strings.isEmpty(result.batchCode)) {
                                                // 批次管理
                                                let bItem: materials.bo.IMaterialBatchItem = wItem.materialBatches.find(c => c.batchCode === result.batchCode);
                                                if (ibas.objects.isNull(bItem)) {
                                                    // 没有同批次的，则新建行
                                                    bItem = wItem.materialBatches.create();
                                                    bItem.batchCode = result.batchCode;
                                                    bItem.quantity = 0;
                                                }
                                                bItem.quantity = ibas.numbers.round(bItem.quantity + result.quantity - result.closedQuantity);
                                            } else if (!ibas.strings.isEmpty(result.serialCode)) {
                                                // 序列管理
                                                let sItem: materials.bo.IMaterialSerialItem = wItem.materialSerials.find(c => c.serialCode === result.serialCode);
                                                if (ibas.objects.isNull(sItem)) {
                                                    sItem = wItem.materialSerials.create();
                                                    sItem.serialCode = result.serialCode;
                                                }
                                            }
                                        }
                                        // 数量被修改的行激活逻辑计算
                                        for (let item of target.salesDeliveryItems) {
                                            if (item.isLoading !== true) {
                                                continue;
                                            }
                                            item.isLoading = false;
                                            if (qtyMap.get(item) !== item.quantity) {
                                                (<any>item).firePropertyChanged(bo.SalesDeliveryItem.PROPERTY_QUANTITY_NAME);
                                            }
                                        }
                                        this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("sales_used_reserved_materials_inventory"));
                                    }
                                    let app: SalesDeliveryEditApp = new SalesDeliveryEditApp();
                                    app.navigation = this.navigation;
                                    app.viewShower = this.viewShower;
                                    app.run(target);
                                }
                            });

                        } catch (error) {
                            this.messages(error);
                        }
                    }
                });
            }
            /** 转为销售退货 */
            protected turnToSalesReturn(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesOrder({
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
                            this.view.showSalesOrder(this.editData);
                            this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
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
            /** 转为销售发票 */
            protected turnToSalesInvoice(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesOrder({
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
                            this.view.showSalesOrder(this.editData);
                            this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
                            if ((this.editData.approvalStatus !== ibas.emApprovalStatus.APPROVED && this.editData.approvalStatus !== ibas.emApprovalStatus.UNAFFECTED)
                                || this.editData.deleted === ibas.emYesNo.YES
                                || this.editData.canceled === ibas.emYesNo.YES
                                || this.editData.documentStatus === ibas.emDocumentStatus.PLANNED
                            ) {
                                throw new Error(ibas.i18n.prop("sales_invaild_status_not_support_turn_to_operation"));
                            }
                            let target: bo.SalesInvoice = new bo.SalesInvoice();
                            target.customerCode = this.editData.customerCode;
                            target.customerName = this.editData.customerName;
                            target.baseDocument(this.editData);
                            // 预付款查询
                            let condition: ibas.ICondition;
                            let criteria: ibas.ICriteria = new ibas.Criteria();
                            let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                            cCriteria.propertyPath = receiptpayment.bo.Receipt.PROPERTY_RECEIPTITEMS_NAME;
                            cCriteria.onlyHasChilds = true;
                            for (let item of this.editData.salesOrderItems) {
                                // 基于单据为订单
                                condition = cCriteria.conditions.create();
                                condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_BASEDOCUMENTTYPE_NAME;
                                condition.value = item.objectCode;
                                condition.bracketOpen = 1;
                                if (cCriteria.conditions.length > 2) {
                                    condition.relationship = ibas.emConditionRelationship.OR;
                                }
                                condition = cCriteria.conditions.create();
                                condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_BASEDOCUMENTENTRY_NAME;
                                condition.value = item.docEntry.toString();
                                condition.bracketClose = 1;
                            }
                            // 使用预留库存
                            materials.app.useReservedMaterialsInventory({
                                targetType: this.editData.objectCode,
                                targetEntries: this.editData.docEntry,
                                onCompleted: (results) => {
                                    if (results instanceof Error) {
                                        // 错误
                                        this.messages(results);
                                    } else if (results.length > 0) {
                                        // 出库数预置为0，包括基于来的批次数量
                                        let qtyMap: Map<any, number> = new Map<any, number>();
                                        for (let item of target.salesInvoiceItems) {
                                            if (this.editData.objectCode === item.baseDocumentType
                                                && this.editData.docEntry === item.baseDocumentEntry) {
                                                // 不激活逻辑计算
                                                qtyMap.set(item, item.quantity);
                                                item.isLoading = true;
                                                item.quantity = 0;
                                                item.materialBatches.forEach(d => d.quantity = 0);
                                            }
                                        }
                                        // 使用预留库存
                                        for (let result of results) {
                                            if (result.status === ibas.emBOStatus.CLOSED) {
                                                continue;
                                            }
                                            if (result.closedQuantity >= result.quantity) {
                                                continue;
                                            }
                                            let wItems: bo.SalesInvoiceItem[] = target.salesInvoiceItems.where(c =>
                                                result.targetDocumentType === c.baseDocumentType
                                                && result.targetDocumentEntry === c.baseDocumentEntry
                                                && result.targetDocumentLineId === c.baseDocumentLineId
                                                && result.itemCode === c.itemCode
                                            );
                                            if (wItems.length === 0) {
                                                continue;
                                            }
                                            let wItem: bo.SalesInvoiceItem = wItems.find(c => c.warehouse === result.warehouse);
                                            if (ibas.objects.isNull(wItem)) {
                                                // 没有同仓库的，则新建行
                                                if (wItems[0].quantity === 0) {
                                                    wItem = wItems[0];
                                                } else {
                                                    wItem = wItems[0].clone();
                                                    target.salesInvoiceItems.add(wItem);
                                                }
                                                wItem.warehouse = result.warehouse;
                                            }
                                            // 应用库存
                                            wItem.quantity = ibas.numbers.round(wItem.quantity + result.quantity - result.closedQuantity);
                                            // 处理明细项
                                            if (!ibas.strings.isEmpty(result.batchCode)) {
                                                // 批次管理
                                                let bItem: materials.bo.IMaterialBatchItem = wItem.materialBatches.find(c => c.batchCode === result.batchCode);
                                                if (ibas.objects.isNull(bItem)) {
                                                    // 没有同批次的，则新建行
                                                    bItem = wItem.materialBatches.create();
                                                    bItem.batchCode = result.batchCode;
                                                    bItem.quantity = 0;
                                                }
                                                bItem.quantity = ibas.numbers.round(bItem.quantity + result.quantity - result.closedQuantity);
                                            } else if (!ibas.strings.isEmpty(result.serialCode)) {
                                                // 序列管理
                                                let sItem: materials.bo.IMaterialSerialItem = wItem.materialSerials.find(c => c.serialCode === result.serialCode);
                                                if (ibas.objects.isNull(sItem)) {
                                                    sItem = wItem.materialSerials.create();
                                                    sItem.serialCode = result.serialCode;
                                                }
                                            }
                                        }
                                        // 数量被修改的行激活逻辑计算
                                        for (let item of target.salesInvoiceItems) {
                                            if (item.isLoading !== true) {
                                                continue;
                                            }
                                            item.isLoading = false;
                                            if (qtyMap.get(item) !== item.quantity) {
                                                (<any>item).firePropertyChanged(bo.SalesInvoiceItem.PROPERTY_QUANTITY_NAME);
                                            }
                                        }
                                        this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("sales_used_reserved_materials_inventory"));
                                    }
                                    let app: SalesInvoiceEditApp = new SalesInvoiceEditApp();
                                    app.navigation = this.navigation;
                                    app.viewShower = this.viewShower;
                                    app.run(target);
                                    if (target.isNew) {
                                        app.addSalesInvoiceDownPayment(criteria);
                                    }
                                }
                            });
                        } catch (error) {
                            this.messages(error);
                        }
                    }
                });

            }
            /** 转为销售预留发票 */
            protected turnToSalesReserveInvoice(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesOrder({
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
                            this.view.showSalesOrder(this.editData);
                            this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
                            if ((this.editData.approvalStatus !== ibas.emApprovalStatus.APPROVED && this.editData.approvalStatus !== ibas.emApprovalStatus.UNAFFECTED)
                                || this.editData.deleted === ibas.emYesNo.YES
                                || this.editData.canceled === ibas.emYesNo.YES
                                || this.editData.documentStatus === ibas.emDocumentStatus.PLANNED
                            ) {
                                throw new Error(ibas.i18n.prop("sales_invaild_status_not_support_turn_to_operation"));
                            }
                            let target: bo.SalesReserveInvoice = new bo.SalesReserveInvoice();
                            target.customerCode = this.editData.customerCode;
                            target.customerName = this.editData.customerName;
                            target.baseDocument(this.editData);

                            let app: SalesReserveInvoiceEditApp = new SalesReserveInvoiceEditApp();
                            app.navigation = this.navigation;
                            app.viewShower = this.viewShower;
                            app.run(target);
                        } catch (error) {
                            this.messages(error);
                        }
                    }
                });

            }
            /** 转为预付款申请 */
            protected turnToDownPaymentRequest(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesOrder({
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
                            this.view.showSalesOrder(this.editData);
                            this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
                            if ((this.editData.approvalStatus !== ibas.emApprovalStatus.APPROVED && this.editData.approvalStatus !== ibas.emApprovalStatus.UNAFFECTED)
                                || this.editData.deleted === ibas.emYesNo.YES
                                || this.editData.canceled === ibas.emYesNo.YES
                                || this.editData.documentStatus === ibas.emDocumentStatus.PLANNED
                            ) {
                                throw new Error(ibas.i18n.prop("sales_invaild_status_not_support_turn_to_operation"));
                            }
                            let target: bo.DownPaymentRequest = new bo.DownPaymentRequest();
                            target.customerCode = this.editData.customerCode;
                            target.customerName = this.editData.customerName;
                            target.baseDocument(this.editData);

                            let app: DownPaymentRequestEditApp = new DownPaymentRequestEditApp();
                            app.navigation = this.navigation;
                            app.viewShower = this.viewShower;
                            app.run(target);
                        } catch (error) {
                            this.messages(error);
                        }
                    }
                });

            }
            /** 选择一揽子协议事件 */
            private chooseSalesOrderBlanketAgreement(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesorder_customercode")
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
                // 是否指定分支
                if (!ibas.strings.isEmpty(this.editData.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = bo.BlanketAgreement.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = bo.BlanketAgreement.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.BlanketAgreement.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = bo.BlanketAgreement.PROPERTY_CUSTOMERCODE_NAME;
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
                        condition.alias = bo.BlanketAgreement.PROPERTY_AGREEMENTS_NAME;
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
                                            if (that.editData.salesOrderItems.firstOrDefault(
                                                c => c.baseDocumentType === baItem.objectCode
                                                    && c.baseDocumentEntry === baItem.docEntry
                                                    && c.baseDocumentLineId === baItem.lineId) !== null) {
                                                continue;
                                            }
                                            let item: bo.SalesOrderItem = that.editData.salesOrderItems.create();
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
                                            item.tax = baItem.tax;
                                            item.taxRate = baItem.taxRate;
                                            item.price = baItem.price;
                                            item.currency = baItem.currency;
                                            item.quantity = baItem.quantity - baItem.closedQuantity;
                                            item.reference1 = baItem.reference1;
                                            item.reference2 = baItem.reference2;
                                            beChangeds.add({
                                                caller: item,
                                                sourceUnit: item.uom,
                                                targetUnit: item.inventoryUOM,
                                                material: item.itemCode,
                                                setUnitRate(this: bo.SalesOrderItem, value: number): void {
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
                                    that.view.showSalesOrderItems(that.editData.salesOrderItems.filterDeleted());
                                }
                            });
                        }
                    }
                });
            }
            /** 选择销售订单-行 单位 */
            private chooseSalesOrderItemUnit(caller: bo.SalesOrderItem, criteria?: ibas.ICriteria, filterConditions?: ibas.ICondition[]): void {
                if (ibas.objects.isNull(criteria)) {
                    criteria = new ibas.Criteria();
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = materials.bo.Unit.PROPERTY_ACTIVATED_NAME;
                    condition.value = String(ibas.emYesNo.YES);
                    if (this.editData.priceList > 0
                        && config.get<boolean>(config.CONFIG_ITEM_ONLY_PRICE_LIST_ITEM_UNITS, false) === true) {
                        let pCriteria: ibas.ICriteria = new ibas.Criteria();
                        condition = pCriteria.conditions.create();
                        condition.alias = materials.bo.MaterialPriceList.PROPERTY_OBJECTKEY_NAME;
                        condition.value = String(this.editData.priceList);
                        let cCriteria: ibas.IChildCriteria = pCriteria.childCriterias.create();
                        cCriteria.propertyPath = materials.bo.MaterialPriceList.PROPERTY_MATERIALPRICEITEMS_NAME;
                        cCriteria.onlyHasChilds = true;
                        condition = cCriteria.conditions.create();
                        condition.alias = materials.bo.MaterialPriceItem.PROPERTY_ITEMCODE_NAME;
                        condition.value = caller.itemCode;
                        let boRepository: materials.bo.BORepositoryMaterials = new materials.bo.BORepositoryMaterials();
                        boRepository.fetchMaterialPriceList({
                            criteria: pCriteria,
                            onCompleted: (opRslt) => {
                                let count: number = criteria.conditions.length;
                                for (let item of opRslt.resultObjects) {
                                    for (let sItem of item.materialPriceItems) {
                                        if (ibas.objects.isNull(sItem.uom)) {
                                            continue;
                                        }
                                        condition = criteria.conditions.create();
                                        condition.alias = materials.bo.Unit.PROPERTY_NAME_NAME;
                                        condition.value = sItem.uom;
                                        if (criteria.conditions.length > count + 1) {
                                            condition.relationship = ibas.emConditionRelationship.OR;
                                        }
                                    }
                                }
                                if (criteria.conditions.length > count + 1) {
                                    criteria.conditions[count].bracketOpen += 1;
                                    criteria.conditions[criteria.conditions.length - 1].bracketClose += 1;
                                }
                                this.chooseSalesOrderItemUnit(caller, criteria);
                            }
                        });
                    } else {
                        this.chooseSalesOrderItemUnit(caller, criteria);
                    }
                } else {
                    // 添加输入条件
                    if (filterConditions instanceof Array && filterConditions.length > 0) {
                        if (criteria.conditions.length > 1) {
                            criteria.conditions.firstOrDefault().bracketOpen++;
                            criteria.conditions.lastOrDefault().bracketClose++;
                        }
                        criteria.conditions.add(filterConditions);
                    }
                    let that: this = this;
                    ibas.servicesManager.runChooseService<materials.bo.IUnit>({
                        boCode: materials.bo.BO_CODE_UNIT,
                        chooseType: ibas.emChooseType.SINGLE,
                        criteria: criteria,
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
                            that.changeSalesOrderItemPrice(that.editData.priceList, [caller]);
                        }
                    });
                }
            }
            private chooseSalesOrderItemMaterialVersion(caller: bo.SalesOrderItem): void {
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
            /** 预留物料库存 */
            private reserveMaterialsInventory(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty) {
                    throw new Error(ibas.i18n.prop("shell_data_saved_first"));
                }

                let contract: materials.app.IMaterialInventoryReservationTarget = {
                    targetType: this.editData.objectCode,
                    targetEntry: this.editData.docEntry,
                    businessPartner: ibas.strings.format("{1} ({0})", this.editData.customerCode, this.editData.customerName),
                    items: []
                };
                for (let item of this.editData.salesOrderItems) {
                    contract.items.push({
                        targetLineId: item.lineId,
                        itemCode: item.itemCode,
                        itemDescription: item.itemDescription,
                        itemVersion: item.itemVersion,
                        warehouse: item.warehouse,
                        quantity: ibas.numbers.valueOf(item.quantity) - ibas.numbers.valueOf(item.closedQuantity),
                        uom: item.uom,
                    });
                }
                ibas.servicesManager.runApplicationService<materials.app.IMaterialInventoryReservationTarget | materials.app.IMaterialInventoryReservationTarget[]>({
                    proxy: new materials.app.MaterialInventoryReservationServiceProxy(contract)
                });
            }
            private chooseCustomerAgreements(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesorder_customercode")
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
                    condition.alias = bo.SalesOrder.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
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
            private chooseSalesOrderItemDistributionRule(type: accounting.app.emDimensionType, caller: bo.SalesOrderItem): void {
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
                for (let item of this.editData.salesOrderItems) {
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
            protected chooseSalesOrderItemMaterialCatalog(caller: bo.SalesOrderItem, filterConditions?: ibas.ICondition[]): void {
                if (ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(
                        ibas.emMessageType.WARNING, ibas.i18n.prop("sales_please_choose_supplier_first")
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
                        let count: number = this.editData.salesOrderItems.length;
                        for (let selected of selecteds) {
                            if (ibas.strings.isEmpty(selected.itemCode)) {
                                continue;
                            }
                            if (ibas.objects.isNull(caller)) {
                                caller = this.editData.salesOrderItems.create();
                            }
                            caller.catalogCode = selected.catalogCode;
                            condition = new ibas.Condition();
                            condition.alias = materials.bo.Material.PROPERTY_CODE_NAME;
                            condition.value = selected.itemCode;
                            this.chooseSalesOrderItemMaterial(caller, null, [condition]);
                            caller = null;
                        }
                        if (this.editData.salesOrderItems.length > count) {
                            this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
                        }
                    }
                });
            }
            protected calculateGrossProfit(): void {
                let lines: ibas.ArrayList<materials.app.IMaterialGrossProfitContractLine>
                    = new ibas.ArrayList<materials.app.IMaterialGrossProfitContractLine>();
                for (let item of this.editData.salesOrderItems) {
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
            /** 选择销售订单-行 单位 */
            chooseSalesOrderItemUnitEvent: Function;
            /** 选择销售订单行物料序列事件 */
            chooseSalesOrderItemMaterialSerialEvent: Function;
            /** 选择销售订单行物料批次事件 */
            chooseSalesOrderItemMaterialBatchEvent: Function;
            /** 选择销售订单-行 物料版本 */
            chooseSalesOrderItemMaterialVersionEvent: Function;
            /** 选择销售订单-行 成本中心事件 */
            chooseSalesOrderItemDistributionRuleEvent: Function;
            /** 选择一业务伙伴目录事件 */
            chooseSalesOrderItemMaterialCatalogEvent: Function;
            /** 显示销售订单行额外信息事件 */
            showSalesOrderItemExtraEvent: Function;
            /** 选择销售订单-销售报价事件 */
            chooseSalesOrderSalesQuoteEvent: Function;
            /** 选择销售订单-一揽子协议事件 */
            chooseSalesOrderBlanketAgreementEvent: Function;
            /** 选择客户合同 */
            chooseCustomerAgreementsEvent: Function;
            /** 销售订单收款事件 */
            receiptSalesOrderEvent: Function;
            /** 编辑地址事件 */
            editShippingAddressesEvent: Function;
            /** 转为销售交货事件 */
            turnToSalesDeliveryEvent: Function;
            /** 转为销售退货事件 */
            turnToSalesReturnEvent: Function;
            /** 转为销售发票事件 */
            turnToSalesInvoiceEvent: Function;
            /** 转为销售预留发票事件 */
            turnToSalesReserveInvoiceEvent: Function;
            /** 转为预付款申请事件 */
            turnToDownPaymentRequestEvent: Function;
            /** 预留物料库存 */
            reserveMaterialsInventoryEvent: Function;
            /** 测量物料 */
            measuringMaterialsEvent: Function;
            /** 计算毛利润 */
            calculateGrossProfitEvent: Function;
            /** 默认仓库 */
            defaultWarehouse: string;
            /** 默认税组 */
            defaultTaxGroup: string;
        }
        /** 销售订单编辑服务映射 */
        export class SalesOrderEditServiceMapping extends ibas.BOEditServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesOrderEditApp.APPLICATION_ID;
                this.name = SalesOrderEditApp.APPLICATION_NAME;
                this.boCode = SalesOrderEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOEditServiceCaller<bo.SalesOrder>> {
                return new SalesOrderEditApp();
            }
        }

        export class MaterialOrderedReservationTargetSalesOrderService extends ibas.ServiceApplication<ibas.IView, materials.app.IMaterialOrderedReservationTarget> {
            /** 应用标识 */
            static APPLICATION_ID: string = "39bc5f50-7c11-4dd7-9f00-50464d276899";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_materialorderedreservation_salesorder";
            /** 构造函数 */
            constructor() {
                super();
                this.id = MaterialOrderedReservationTargetSalesOrderService.APPLICATION_ID;
                this.name = MaterialOrderedReservationTargetSalesOrderService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
            }
            protected runService(contract: materials.app.IMaterialOrderedReservationTarget): void {
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
                // 物料
                let cCrteria: ibas.IChildCriteria = criteria.childCriterias.create();
                cCrteria.propertyPath = bo.SalesOrder.PROPERTY_SALESORDERITEMS_NAME;
                cCrteria.onlyHasChilds = true;
                condition = cCrteria.conditions.create();
                condition.alias = bo.SalesOrderItem.PROPERTY_ITEMCODE_NAME;
                condition.value = contract.itemCode;
                condition = cCrteria.conditions.create();
                condition.alias = bo.SalesOrderItem.PROPERTY_ORDEREDQUANTITY_NAME;
                condition.comparedAlias = bo.SalesOrderItem.PROPERTY_QUANTITY_NAME;
                condition.operation = ibas.emConditionOperation.LESS_THAN;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.SalesOrder>({
                    boCode: bo.SalesOrder.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.SalesOrder>): void {
                        for (let selected of selecteds) {
                            for (let item of selected.salesOrderItems) {
                                contract.onReserved(selected.objectCode, selected.docEntry, item.lineId, item.quantity);
                            }
                        }
                        that.destroy();
                    }
                });
            }
            protected viewShowed(): void {
            }

        }
        export class MaterialOrderedReservationTargetSalesOrderServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = MaterialOrderedReservationTargetSalesOrderService.APPLICATION_ID;
                this.name = MaterialOrderedReservationTargetSalesOrderService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = materials.app.MaterialOrderedReservationTargetServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new MaterialOrderedReservationTargetSalesOrderService();
            }
        }
    }
}