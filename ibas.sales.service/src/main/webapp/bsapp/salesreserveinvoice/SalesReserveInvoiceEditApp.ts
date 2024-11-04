/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 编辑应用-销售预留发票 */
        export class SalesReserveInvoiceEditApp extends ibas.BOEditService<ISalesReserveInvoiceEditView, bo.SalesReserveInvoice> {
            /** 应用标识 */
            static APPLICATION_ID: string = "789df8e2-54de-403d-8de0-28406dbbf032";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesreserveinvoice_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesReserveInvoice.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReserveInvoiceEditApp.APPLICATION_ID;
                this.name = SalesReserveInvoiceEditApp.APPLICATION_NAME;
                this.boCode = SalesReserveInvoiceEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addSalesReserveInvoiceItemEvent = this.addSalesReserveInvoiceItem;
                this.view.removeSalesReserveInvoiceItemEvent = this.removeSalesReserveInvoiceItem;
                this.view.chooseSalesReserveInvoiceCustomerEvent = this.chooseSalesReserveInvoiceCustomer;
                this.view.chooseSalesReserveInvoiceContactPersonEvent = this.chooseSalesReserveInvoiceContactPerson;
                this.view.chooseSalesReserveInvoicePriceListEvent = this.chooseSalesReserveInvoicePriceList;
                this.view.chooseSalesReserveInvoiceItemMaterialEvent = this.chooseSalesReserveInvoiceItemMaterial;
                this.view.chooseSalesReserveInvoiceItemMaterialBatchEvent = this.chooseSalesReserveInvoiceLineMaterialBatch;
                this.view.chooseSalesReserveInvoiceItemMaterialSerialEvent = this.chooseSalesReserveInvoiceLineMaterialSerial;
                this.view.chooseSalesReserveInvoiceItemMaterialVersionEvent = this.chooseSalesReserveInvoiceItemMaterialVersion;
                this.view.chooseSalesReserveInvoiceItemDistributionRuleEvent = this.chooseSalesReserveInvoiceItemDistributionRule;
                this.view.chooseSalesReserveInvoiceItemMaterialCatalogEvent = this.chooseSalesReserveInvoiceItemMaterialCatalog;
                this.view.chooseSalesReserveInvoiceItemWarehouseEvent = this.chooseSalesReserveInvoiceItemWarehouse;
                this.view.chooseSalesReserveInvoiceItemUnitEvent = this.chooseSalesReserveInvoiceItemUnit;
                this.view.chooseSalesReserveInvoiceSalesOrderEvent = this.chooseSalesReserveInvoiceSalesOrder;
                this.view.chooseSalesReserveInvoiceBlanketAgreementEvent = this.chooseSalesReserveInvoiceBlanketAgreement;
                this.view.chooseCustomerAgreementsEvent = this.chooseCustomerAgreements;
                this.view.receiptSalesReserveInvoiceEvent = this.receiptSalesReserveInvoice;
                this.view.editShippingAddressesEvent = this.editShippingAddresses;
                this.view.turnToSalesCreditNoteEvent = this.turnToSalesCreditNote;
                this.view.turnToSalesDeliveryEvent = this.turnToSalesDelivery;
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
                    this.editData = new bo.SalesReserveInvoice();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showSalesReserveInvoice(this.editData);
                this.view.showSalesReserveInvoiceItems(this.editData.salesReserveInvoiceItems.filterDeleted());
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
                // 计算到期日
                if (this.editData.isNew === true && !ibas.strings.isEmpty(this.editData.paymentCode)) {
                    let criteria: ibas.ICriteria = new ibas.Criteria();
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = businesspartner.bo.PaymentTerm.PROPERTY_CODE_NAME;
                    condition.value = this.editData.paymentCode;
                    condition = criteria.conditions.create();
                    condition.alias = businesspartner.bo.PaymentTerm.PROPERTY_ACTIVATED_NAME;
                    condition.value = ibas.emYesNo.YES.toString();
                    this.choosePaymentTerm(criteria);
                }
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.SalesReserveInvoice): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.SalesReserveInvoice)) {
                    let data: bo.SalesReserveInvoice = arguments[0];
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
                        boRepository.fetchSalesReserveInvoice({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.SalesReserveInvoice>): void {
                                let data: bo.SalesReserveInvoice;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.SalesReserveInvoice)) {
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
                boRepository.saveSalesReserveInvoice({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesReserveInvoice>): void {
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
                        boRepository.parse<bo.SalesReserveInvoice>({
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
                        that.editData = new bo.SalesReserveInvoice();
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
            /** 选择销售预留发票客户事件 */
            private chooseSalesReserveInvoiceCustomer(filterConditions?: ibas.ICondition[]): void {
                let items: bo.SalesReserveInvoiceItem[] = this.editData.salesReserveInvoiceItems.where(c =>
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
                                this.removeSalesReserveInvoiceItem(items);
                                this.chooseSalesReserveInvoiceCustomer(filterConditions);
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
                        // 计算到期日
                        if (!ibas.strings.isEmpty(that.editData.paymentCode)) {
                            let criteria: ibas.ICriteria = new ibas.Criteria();
                            let condition: ibas.ICondition = criteria.conditions.create();
                            condition.alias = businesspartner.bo.PaymentTerm.PROPERTY_CODE_NAME;
                            condition.value = that.editData.paymentCode;
                            condition = criteria.conditions.create();
                            condition.alias = businesspartner.bo.PaymentTerm.PROPERTY_ACTIVATED_NAME;
                            condition.value = ibas.emYesNo.YES.toString();
                            that.choosePaymentTerm(criteria);
                        }
                        that.customer = selected;
                        // 客户改变，清除旧地址
                        that.editData.shippingAddresss.clear();
                        that.changeSalesReserveInvoiceItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 选择销售预留发票价格清单事件 */
            private chooseSalesReserveInvoicePriceList(): void {
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
                        that.changeSalesReserveInvoiceItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 更改行价格 */
            private changeSalesReserveInvoiceItemPrice(priceList: number | ibas.ICriteria, items?: bo.SalesReserveInvoiceItem[]): void {
                if (ibas.objects.isNull(items)) {
                    items = this.editData.salesReserveInvoiceItems.filterDeleted();
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
                        this.changeSalesReserveInvoiceItemPrice(criteria, items);
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
                                    this.changeSalesReserveInvoiceItemPrice(criteria, items);
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
            /** 选择销售预留发票行物料事件 */
            private chooseSalesReserveInvoiceItemMaterial(caller: bo.SalesReserveInvoiceItem, filterConditions?: ibas.ICondition[]): void {
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
                        let index: number = that.editData.salesReserveInvoiceItems.indexOf(caller);
                        let item: bo.SalesReserveInvoiceItem = that.editData.salesReserveInvoiceItems[index];
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
                                                        let parentItem: bo.SalesReserveInvoiceItem = null;
                                                        // 清理旧数据，bo对象负责清理关联子项
                                                        if (!ibas.objects.isNull(item)) {
                                                            parentItem = item;
                                                            if (!ibas.strings.isEmpty(parentItem.lineSign)) {
                                                                for (let i: number = that.editData.salesReserveInvoiceItems.length - 1; i >= 0; i--) {
                                                                    let tItem: bo.SalesReserveInvoiceItem = that.editData.salesReserveInvoiceItems[i];
                                                                    if (tItem.parentLineSign === parentItem.lineSign) {
                                                                        if (tItem.isNew) {
                                                                            that.editData.salesReserveInvoiceItems.remove(tItem);
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
                                                        for (let sItem of bo.baseProductSuit(that.editData.salesReserveInvoiceItems, pData)) {
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
                                                                    setUnitRate(this: bo.SalesReserveInvoiceItem, value: number): void {
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
                                        for (let i: number = that.editData.salesReserveInvoiceItems.length - 1; i >= 0; i--) {
                                            let tItem: bo.SalesReserveInvoiceItem = that.editData.salesReserveInvoiceItems[i];
                                            if (tItem.parentLineSign === item.lineSign) {
                                                if (tItem.isNew) {
                                                    that.editData.salesReserveInvoiceItems.remove(tItem);
                                                } else {
                                                    tItem.delete();
                                                }
                                            }
                                        }
                                        created = true;
                                    }
                                }
                                if (ibas.objects.isNull(item)) {
                                    item = that.editData.salesReserveInvoiceItems.create();
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
                                    setUnitRate(this: bo.SalesReserveInvoiceItem, value: number): void {
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
                                that.view.showSalesReserveInvoiceItems(that.editData.salesReserveInvoiceItems.filterDeleted());
                            }
                        });
                    }
                });
            }
            /** 选择销售预留发票行仓库事件 */
            private chooseSalesReserveInvoiceItemWarehouse(caller: bo.SalesReserveInvoiceItem, filterConditions?: ibas.ICondition[]): void {
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
                        let index: number = that.editData.salesReserveInvoiceItems.indexOf(caller);
                        let item: bo.SalesReserveInvoiceItem = that.editData.salesReserveInvoiceItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesReserveInvoiceItems.create();
                                created = true;
                            }
                            item.warehouse = selected.code;
                            that.view.defaultWarehouse = item.warehouse;
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showSalesReserveInvoiceItems(that.editData.salesReserveInvoiceItems.filterDeleted());
                        }
                    }
                });
            }
            /** 添加销售预留发票-行事件 */
            private addSalesReserveInvoiceItem(items: bo.SalesReserveInvoiceItem[] | number): void {
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
                        let newItem: bo.SalesReserveInvoiceItem = item.clone();
                        newItem.lineId = undefined;
                        newItem.visOrder = undefined;
                        // 序列号清除
                        newItem.materialSerials.clear();
                        this.editData.salesReserveInvoiceItems.add(newItem);
                        if (builder.length > 2) {
                            builder.append(", ");
                        }
                        builder.append(newItem.lineId);
                    }
                    builder.append("] ");
                    if (builder.length > 3) {
                        this.proceeding(ibas.emMessageType.WARNING, builder.toString());
                        this.view.showSalesReserveInvoiceItems(this.editData.salesReserveInvoiceItems.filterDeleted());
                    }
                } else if (typeof items === "number" && items > 0) {
                    for (let i: number = 0; i < items; i++) {
                        this.editData.salesReserveInvoiceItems.create();
                    }
                    this.view.showSalesReserveInvoiceItems(this.editData.salesReserveInvoiceItems.filterDeleted());
                } else {
                    this.chooseSalesReserveInvoiceItemMaterial(undefined);
                }
            }
            /** 删除销售预留发票-行事件 */
            private removeSalesReserveInvoiceItem(items: bo.SalesReserveInvoiceItem[]): void {
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
                    if (this.editData.salesReserveInvoiceItems.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesReserveInvoiceItems.remove(item);
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
                            for (let i: number = this.editData.salesReserveInvoiceItems.length - 1; i >= 0; i--) {
                                let tItem: bo.SalesReserveInvoiceItem = this.editData.salesReserveInvoiceItems[i];
                                if (tItem.parentLineSign === item.lineSign) {
                                    if (tItem.isNew) {
                                        this.editData.salesReserveInvoiceItems.remove(tItem);
                                    } else {
                                        tItem.delete();
                                    }
                                }
                            }
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showSalesReserveInvoiceItems(this.editData.salesReserveInvoiceItems.filterDeleted());
            }

            /** 选择销售预留发票行批次事件 */
            private chooseSalesReserveInvoiceLineMaterialBatch(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialBatchContract> = new ibas.ArrayList<materials.app.IMaterialBatchContract>();
                for (let item of this.editData.salesReserveInvoiceItems) {
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
            /** 选择销售预留发票序列事件 */
            private chooseSalesReserveInvoiceLineMaterialSerial(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialSerialContract> = new ibas.ArrayList<materials.app.IMaterialSerialContract>();
                for (let item of this.editData.salesReserveInvoiceItems) {
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
            /** 选择销售预留发票-销售订单事件 */
            private chooseSalesReserveInvoiceSalesOrder(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesreserveinvoice_customercode")
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
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesOrder.PROPERTY_CUSTOMERCODE_NAME;
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
                        condition.alias = bo.SalesOrder.PROPERTY_AGREEMENTS_NAME;
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
                cCriteria.propertyPath = bo.SalesOrder.PROPERTY_SALESORDERITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                cCriteria.noChilds = false;
                // 未取消的
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesOrderItem.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 已清金额小于总计
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesOrderItem.PROPERTY_CLOSEDAMOUNT_NAME;
                condition.operation = ibas.emConditionOperation.LESS_THAN;
                condition.comparedAlias = bo.SalesOrderItem.PROPERTY_LINETOTAL_NAME;
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
                            if (!ibas.strings.isEmpty(selected.paymentCode) && that.editData.paymentCode !== selected.paymentCode) {
                                that.messages({
                                    type: ibas.emMessageType.QUESTION,
                                    title: ibas.i18n.prop(that.name),
                                    message: ibas.i18n.prop("sales_change_item_paymentcode_continue"),
                                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                                    onCompleted(action: ibas.emMessageAction): void {
                                        if (action === ibas.emMessageAction.YES) {
                                            that.editData.paymentCode = selected.paymentCode;
                                            let criteria: ibas.ICriteria = new ibas.Criteria();
                                            let condition: ibas.ICondition = criteria.conditions.create();
                                            condition.alias = businesspartner.bo.PaymentTerm.PROPERTY_CODE_NAME;
                                            condition.value = that.editData.paymentCode;
                                            condition = criteria.conditions.create();
                                            condition.alias = businesspartner.bo.PaymentTerm.PROPERTY_ACTIVATED_NAME;
                                            condition.value = ibas.emYesNo.YES.toString();
                                            that.choosePaymentTerm(criteria);
                                        }
                                    }
                                });
                            }
                            that.editData.baseDocument(selected);
                        }
                        that.view.showSalesReserveInvoiceItems(that.editData.salesReserveInvoiceItems.filterDeleted());
                    }
                });
            }
            private receiptSalesReserveInvoice(): void {
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
                        branch: this.editData.branch,
                        documentTotal: amount,
                    })
                });
            }
            /** 选择联系人 */
            private chooseSalesReserveInvoiceContactPerson(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesreserveinvoice_customercode")
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
            protected turnToSalesCreditNote(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesReserveInvoice({
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
                            this.view.showSalesReserveInvoice(this.editData);
                            this.view.showSalesReserveInvoiceItems(this.editData.salesReserveInvoiceItems.filterDeleted());
                            if ((this.editData.approvalStatus !== ibas.emApprovalStatus.APPROVED && this.editData.approvalStatus !== ibas.emApprovalStatus.UNAFFECTED)
                                || this.editData.deleted === ibas.emYesNo.YES
                                || this.editData.canceled === ibas.emYesNo.YES
                                || this.editData.documentStatus === ibas.emDocumentStatus.PLANNED
                            ) {
                                throw new Error(ibas.i18n.prop("sales_invaild_status_not_support_turn_to_operation"));
                            }
                            let target: bo.SalesCreditNote = new bo.SalesCreditNote();
                            target.customerCode = this.editData.customerCode;
                            target.customerName = this.editData.customerName;
                            target.baseDocument(this.editData);

                            let app: SalesCreditNoteEditApp = new SalesCreditNoteEditApp();
                            app.navigation = this.navigation;
                            app.viewShower = this.viewShower;
                            app.run(target);
                        } catch (error) {
                            this.messages(error);
                        }
                    }
                });

            }
            /** 转为销售交货 */
            protected turnToSalesDelivery(): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesReserveInvoice({
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
                            this.view.showSalesReserveInvoice(this.editData);
                            this.view.showSalesReserveInvoiceItems(this.editData.salesReserveInvoiceItems.filterDeleted());
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

                            let app: SalesDeliveryEditApp = new SalesDeliveryEditApp();
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
            private chooseSalesReserveInvoiceBlanketAgreement(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesreserveinvoice_customercode")
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
                                            if (that.editData.salesReserveInvoiceItems.firstOrDefault(
                                                c => c.baseDocumentType === baItem.objectCode
                                                    && c.baseDocumentEntry === baItem.docEntry
                                                    && c.baseDocumentLineId === baItem.lineId) !== null) {
                                                continue;
                                            }
                                            let item: bo.SalesReserveInvoiceItem = that.editData.salesReserveInvoiceItems.create();
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
                                                setUnitRate(this: bo.SalesReserveInvoiceItem, value: number): void {
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
                                    that.view.showSalesReserveInvoiceItems(that.editData.salesReserveInvoiceItems.filterDeleted());
                                }
                            });
                        }
                    }
                });
            }
            private chooseSalesReserveInvoiceItemUnit(caller: bo.SalesReserveInvoiceItem, filterConditions?: ibas.ICondition[]): void {
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
                        that.changeSalesReserveInvoiceItemPrice(that.editData.priceList, [caller]);
                    }
                });
            }
            private chooseSalesReserveInvoiceItemMaterialVersion(caller: bo.SalesReserveInvoiceItem): void {
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
                        ibas.i18n.prop("bo_salesreserveinvoice_customercode")
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
                    condition.alias = bo.SalesReserveInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesReserveInvoice.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesReserveInvoice.PROPERTY_BRANCH_NAME;
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
            private chooseSalesReserveInvoiceItemDistributionRule(type: accounting.app.emDimensionType, caller: bo.SalesReserveInvoiceItem): void {
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
                for (let item of this.editData.salesReserveInvoiceItems) {
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
            protected chooseSalesReserveInvoiceItemMaterialCatalog(caller: bo.SalesReserveInvoiceItem, filterConditions?: ibas.ICondition[]): void {
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
                        let count: number = this.editData.salesReserveInvoiceItems.length;
                        for (let selected of selecteds) {
                            if (ibas.strings.isEmpty(selected.itemCode)) {
                                continue;
                            }
                            if (ibas.objects.isNull(caller)) {
                                caller = this.editData.salesReserveInvoiceItems.create();
                            }
                            caller.catalogCode = selected.catalogCode;
                            condition = new ibas.Condition();
                            condition.alias = materials.bo.Material.PROPERTY_CODE_NAME;
                            condition.value = selected.itemCode;
                            this.chooseSalesReserveInvoiceItemMaterial(caller, [condition]);
                            caller = null;
                        }
                        if (this.editData.salesReserveInvoiceItems.length > count) {
                            this.view.showSalesReserveInvoiceItems(this.editData.salesReserveInvoiceItems.filterDeleted());
                        }
                    }
                });
            }
            protected calculateGrossProfit(): void {
                let lines: ibas.ArrayList<materials.app.IMaterialGrossProfitContractLine>
                    = new ibas.ArrayList<materials.app.IMaterialGrossProfitContractLine>();
                for (let item of this.editData.salesReserveInvoiceItems) {
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
            protected viewHistoricalPrices(caller: bo.SalesReserveInvoiceItem): void {
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
        /** 视图-销售预留发票 */
        export interface ISalesReserveInvoiceEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showSalesReserveInvoice(data: bo.SalesReserveInvoice): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加销售预留发票-行事件 */
            addSalesReserveInvoiceItemEvent: Function;
            /** 删除销售预留发票-行事件 */
            removeSalesReserveInvoiceItemEvent: Function;
            /** 显示数据 */
            showSalesReserveInvoiceItems(datas: bo.SalesReserveInvoiceItem[]): void;
            /** 选择销售预留发票客户事件 */
            chooseSalesReserveInvoiceCustomerEvent: Function;
            /** 选择销售预留发票联系人信息 */
            chooseSalesReserveInvoiceContactPersonEvent: Function;
            /** 选择销售预留发票价格清单事件 */
            chooseSalesReserveInvoicePriceListEvent: Function;
            /** 选择销售预留发票物料事件 */
            chooseSalesReserveInvoiceItemMaterialEvent: Function;
            /** 选择销售预留发票仓库事件 */
            chooseSalesReserveInvoiceItemWarehouseEvent: Function;
            /** 选择销售预留发票单位事件 */
            chooseSalesReserveInvoiceItemUnitEvent: Function;
            /** 选择销售预留发票单行物料批次事件 */
            chooseSalesReserveInvoiceItemMaterialBatchEvent: Function;
            /** 选择销售预留发票行物料序列事件 */
            chooseSalesReserveInvoiceItemMaterialSerialEvent: Function;
            /** 选择销售预留发票-行 物料版本 */
            chooseSalesReserveInvoiceItemMaterialVersionEvent: Function;
            /** 选择一业务伙伴目录事件 */
            chooseSalesReserveInvoiceItemMaterialCatalogEvent: Function;
            /** 选择销售预留发票-销售订单事件 */
            chooseSalesReserveInvoiceSalesOrderEvent: Function;
            /** 选择销售预留发票-一揽子协议事件 */
            chooseSalesReserveInvoiceBlanketAgreementEvent: Function;
            /** 选择销售预留发票-行成本中心事件 */
            chooseSalesReserveInvoiceItemDistributionRuleEvent: Function;
            /** 选择客户合同 */
            chooseCustomerAgreementsEvent: Function;
            /** 销售预留发票收款事件 */
            receiptSalesReserveInvoiceEvent: Function;
            /** 编辑地址事件 */
            editShippingAddressesEvent: Function;
            /** 转为销售交货事件 */
            turnToSalesCreditNoteEvent: Function;
            /** 转为销售交货事件 */
            turnToSalesDeliveryEvent: Function;
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
            /** 默认税组 */
            defaultTaxGroup: string;
        }
        /** 销售预留发票编辑服务映射 */
        export class SalesReserveInvoiceEditServiceMapping extends ibas.BOEditServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReserveInvoiceEditApp.APPLICATION_ID;
                this.name = SalesReserveInvoiceEditApp.APPLICATION_NAME;
                this.boCode = SalesReserveInvoiceEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOEditServiceCaller<bo.SalesReserveInvoice>> {
                return new SalesReserveInvoiceEditApp();
            }
        }
    }
}