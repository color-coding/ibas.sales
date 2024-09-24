/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 编辑应用-销售发票 */
        export class SalesInvoiceEditApp extends ibas.BOEditService<ISalesInvoiceEditView, bo.SalesInvoice> {
            /** 应用标识 */
            static APPLICATION_ID: string = "625c4801-88a1-481a-a0ca-9bd65b689803";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesinvoice_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesInvoice.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesInvoiceEditApp.APPLICATION_ID;
                this.name = SalesInvoiceEditApp.APPLICATION_NAME;
                this.boCode = SalesInvoiceEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addSalesInvoiceItemEvent = this.addSalesInvoiceItem;
                this.view.removeSalesInvoiceItemEvent = this.removeSalesInvoiceItem;
                this.view.chooseSalesInvoiceCustomerEvent = this.chooseSalesInvoiceCustomer;
                this.view.chooseSalesInvoiceContactPersonEvent = this.chooseSalesInvoiceContactPerson;
                this.view.chooseSalesInvoicePriceListEvent = this.chooseSalesInvoicePriceList;
                this.view.chooseSalesInvoiceItemMaterialEvent = this.chooseSalesInvoiceItemMaterial;
                this.view.chooseSalesInvoiceItemMaterialBatchEvent = this.chooseSalesInvoiceLineMaterialBatch;
                this.view.chooseSalesInvoiceItemMaterialSerialEvent = this.chooseSalesInvoiceLineMaterialSerial;
                this.view.chooseSalesInvoiceItemMaterialVersionEvent = this.chooseSalesInvoiceItemMaterialVersion;
                this.view.chooseSalesInvoiceItemDistributionRuleEvent = this.chooseSalesInvoiceItemDistributionRule;
                this.view.chooseSalesInvoiceItemWarehouseEvent = this.chooseSalesInvoiceItemWarehouse;
                this.view.chooseSalesInvoiceItemUnitEvent = this.chooseSalesInvoiceItemUnit;
                this.view.chooseSalesInvoiceSalesOrderEvent = this.chooseSalesInvoiceSalesOrder;
                this.view.chooseSalesInvoiceSalesDeliveryEvent = this.chooseSalesInvoiceSalesDelivery;
                this.view.chooseSalesInvoiceBlanketAgreementEvent = this.chooseSalesInvoiceBlanketAgreement;
                this.view.chooseSalesInvoiceItemMaterialCatalogEvent = this.chooseSalesInvoiceItemMaterialCatalog;
                this.view.chooseCustomerAgreementsEvent = this.chooseCustomerAgreements;
                this.view.receiptSalesInvoiceEvent = this.receiptSalesInvoice;
                this.view.editShippingAddressesEvent = this.editShippingAddresses;
                this.view.turnToSalesCreditNoteEvent = this.turnToSalesCreditNote;
                this.view.addSalesInvoiceDownPaymentEvent = this.addSalesInvoiceDownPayment;
                this.view.removeSalesInvoiceDownPaymentEvent = this.removeSalesInvoiceDownPayment;
                this.view.measuringMaterialsEvent = this.measuringMaterials;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.SalesInvoice();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showSalesInvoice(this.editData);
                this.view.showSalesInvoiceItems(this.editData.salesInvoiceItems.filterDeleted());
                this.view.showSalesInvoiceDownPayments(this.editData.salesInvoiceDownPayments.filterDeleted());
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
            run(data: bo.SalesInvoice): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.SalesInvoice)) {
                    let data: bo.SalesInvoice = arguments[0];
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
                        boRepository.fetchSalesInvoice({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.SalesInvoice>): void {
                                let data: bo.SalesInvoice;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.SalesInvoice)) {
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
                boRepository.saveSalesInvoice({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesInvoice>): void {
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
                        boRepository.parse<bo.SalesInvoice>({
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
                        that.editData = new bo.SalesInvoice();
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
            /** 选择销售发票客户事件 */
            private chooseSalesInvoiceCustomer(filterConditions?: ibas.ICondition[]): void {
                let items: bo.SalesInvoiceItem[] = this.editData.salesInvoiceItems.where(c =>
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
                                this.removeSalesInvoiceItem(items);
                                this.chooseSalesInvoiceCustomer(filterConditions);
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
                        that.changeSalesInvoiceItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 选择销售发票价格清单事件 */
            private chooseSalesInvoicePriceList(): void {
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
                        that.changeSalesInvoiceItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 更改行价格 */
            private changeSalesInvoiceItemPrice(priceList: number | ibas.ICriteria, items?: bo.SalesInvoiceItem[]): void {
                if (ibas.objects.isNull(items)) {
                    items = this.editData.salesInvoiceItems.filterDeleted();
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
                        this.changeSalesInvoiceItemPrice(criteria, items);
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
                                    this.changeSalesInvoiceItemPrice(criteria, items);
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
            /** 选择销售发票行物料事件 */
            private chooseSalesInvoiceItemMaterial(caller: bo.SalesInvoiceItem, type?: string, filterConditions?: ibas.ICondition[]): void {
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
                        let index: number = that.editData.salesInvoiceItems.indexOf(caller);
                        let item: bo.SalesInvoiceItem = that.editData.salesInvoiceItems[index];
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
                                                        let parentItem: bo.SalesInvoiceItem = null;
                                                        // 清理旧数据，bo对象负责清理关联子项
                                                        if (!ibas.objects.isNull(item)) {
                                                            parentItem = item;
                                                            if (!ibas.strings.isEmpty(parentItem.lineSign)) {
                                                                for (let i: number = that.editData.salesInvoiceItems.length - 1; i >= 0; i--) {
                                                                    let tItem: bo.SalesInvoiceItem = that.editData.salesInvoiceItems[i];
                                                                    if (tItem.parentLineSign === parentItem.lineSign) {
                                                                        if (tItem.isNew) {
                                                                            that.editData.salesInvoiceItems.remove(tItem);
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
                                                        for (let sItem of bo.baseProductSuit(that.editData.salesInvoiceItems, pData)) {
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
                                                                    setUnitRate(this: bo.SalesInvoiceItem, value: number): void {
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
                                        for (let i: number = that.editData.salesInvoiceItems.length - 1; i >= 0; i--) {
                                            let tItem: bo.SalesInvoiceItem = that.editData.salesInvoiceItems[i];
                                            if (tItem.parentLineSign === item.lineSign) {
                                                if (tItem.isNew) {
                                                    that.editData.salesInvoiceItems.remove(tItem);
                                                } else {
                                                    tItem.delete();
                                                }
                                            }
                                        }
                                        created = true;
                                    }
                                }
                                if (ibas.objects.isNull(item)) {
                                    item = that.editData.salesInvoiceItems.create();
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
                                    setUnitRate(this: bo.SalesInvoiceItem, value: number): void {
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
                                that.view.showSalesInvoiceItems(that.editData.salesInvoiceItems.filterDeleted());
                            }
                        });
                    }
                });
            }
            /** 选择销售发票行仓库事件 */
            private chooseSalesInvoiceItemWarehouse(caller: bo.SalesInvoiceItem, filterConditions?: ibas.ICondition[]): void {
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
                        let index: number = that.editData.salesInvoiceItems.indexOf(caller);
                        let item: bo.SalesInvoiceItem = that.editData.salesInvoiceItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesInvoiceItems.create();
                                created = true;
                            }
                            item.warehouse = selected.code;
                            that.view.defaultWarehouse = item.warehouse;
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showSalesInvoiceItems(that.editData.salesInvoiceItems.filterDeleted());
                        }
                    }
                });
            }
            /** 添加销售发票-行事件 */
            private addSalesInvoiceItem(items: bo.SalesInvoiceItem[] | number): void {
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
                        let newItem: bo.SalesInvoiceItem = item.clone();
                        newItem.lineId = undefined;
                        newItem.visOrder = undefined;
                        // 序列号清除
                        newItem.materialSerials.clear();
                        this.editData.salesInvoiceItems.add(newItem);
                        if (builder.length > 2) {
                            builder.append(", ");
                        }
                        builder.append(newItem.lineId);
                    }
                    builder.append("] ");
                    if (builder.length > 3) {
                        this.proceeding(ibas.emMessageType.WARNING, builder.toString());
                        this.view.showSalesInvoiceItems(this.editData.salesInvoiceItems.filterDeleted());
                    }
                } else if (typeof items === "number" && items > 0) {
                    for (let i: number = 0; i < items; i++) {
                        this.editData.salesInvoiceItems.create();
                    }
                    this.view.showSalesInvoiceItems(this.editData.salesInvoiceItems.filterDeleted());
                } else {
                    this.chooseSalesInvoiceItemMaterial(undefined);
                }
            }
            /** 删除销售发票-行事件 */
            private removeSalesInvoiceItem(items: bo.SalesInvoiceItem[]): void {
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
                    if (this.editData.salesInvoiceItems.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesInvoiceItems.remove(item);
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
                            for (let i: number = this.editData.salesInvoiceItems.length - 1; i >= 0; i--) {
                                let tItem: bo.SalesInvoiceItem = this.editData.salesInvoiceItems[i];
                                if (tItem.parentLineSign === item.lineSign) {
                                    if (tItem.isNew) {
                                        this.editData.salesInvoiceItems.remove(tItem);
                                    } else {
                                        tItem.delete();
                                    }
                                }
                            }
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showSalesInvoiceItems(this.editData.salesInvoiceItems.filterDeleted());
            }

            /** 选择销售发票行批次事件 */
            private chooseSalesInvoiceLineMaterialBatch(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialBatchContract> = new ibas.ArrayList<materials.app.IMaterialBatchContract>();
                for (let item of this.editData.salesInvoiceItems) {
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
            /** 选择销售发票序列事件 */
            private chooseSalesInvoiceLineMaterialSerial(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialSerialContract> = new ibas.ArrayList<materials.app.IMaterialSerialContract>();
                for (let item of this.editData.salesInvoiceItems) {
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
            /** 选择销售发票-销售订单事件 */
            private chooseSalesInvoiceSalesOrder(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesinvoice_customercode")
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
                // 数量大于已清数量
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesOrderItem.PROPERTY_QUANTITY_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = bo.SalesOrderItem.PROPERTY_CLOSEDQUANTITY_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.SalesOrder>({
                    boCode: bo.SalesOrder.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.SalesOrder>): void {
                        criteria = new ibas.Criteria();
                        let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                        cCriteria.propertyPath = receiptpayment.bo.Receipt.PROPERTY_RECEIPTITEMS_NAME;
                        cCriteria.onlyHasChilds = true;
                        for (let selected of selecteds) {
                            if (!ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                continue;
                            }
                            that.editData.baseDocument(selected);
                            // 预付款查询
                            // 基于单据为订单
                            condition = cCriteria.conditions.create();
                            condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_BASEDOCUMENTTYPE_NAME;
                            condition.value = selected.objectCode;
                            condition.bracketOpen = 1;
                            if (cCriteria.conditions.length > 2) {
                                condition.relationship = ibas.emConditionRelationship.OR;
                            }
                            condition = cCriteria.conditions.create();
                            condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_BASEDOCUMENTENTRY_NAME;
                            condition.value = selected.docEntry.toString();
                            condition.bracketClose = 1;
                            // 原始单据为订单
                            condition = cCriteria.conditions.create();
                            condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_ORIGINALDOCUMENTTYPE_NAME;
                            condition.value = selected.objectCode;
                            condition.bracketOpen = 1;
                            if (cCriteria.conditions.length > 2) {
                                condition.relationship = ibas.emConditionRelationship.OR;
                            }
                            condition = cCriteria.conditions.create();
                            condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_ORIGINALDOCUMENTENTRY_NAME;
                            condition.value = selected.docEntry.toString();
                            condition = cCriteria.conditions.create();
                            condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_BASEDOCUMENTTYPE_NAME;
                            condition.operation = ibas.emConditionOperation.NOT_EQUAL;
                            condition.value = that.editData.objectCode;
                            condition.bracketClose = 1;
                        }
                        if (cCriteria.conditions.length > 0) {
                            that.addSalesInvoiceDownPayment(criteria);
                        }
                        that.view.showSalesInvoiceItems(that.editData.salesInvoiceItems.filterDeleted());
                    }
                });
            }
            /** 选择销售发票-销售交货事件 */
            private chooseSalesInvoiceSalesDelivery(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesinvoice_customercode")
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
                // 仅下达的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesDelivery.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emDocumentStatus.RELEASED.toString();
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
                // 已清金额小于总计
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesDeliveryItem.PROPERTY_CLOSEDAMOUNT_NAME;
                condition.operation = ibas.emConditionOperation.LESS_THAN;
                condition.comparedAlias = bo.SalesDeliveryItem.PROPERTY_LINETOTAL_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.SalesDelivery>({
                    boCode: bo.SalesDelivery.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.SalesDelivery>): void {
                        criteria = new ibas.Criteria();
                        let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                        cCriteria.propertyPath = receiptpayment.bo.Receipt.PROPERTY_RECEIPTITEMS_NAME;
                        cCriteria.onlyHasChilds = true;
                        for (let selected of selecteds) {
                            if (!ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                continue;
                            }
                            that.editData.baseDocument(selected);
                            // 预付款查询
                            condition = cCriteria.conditions.create();
                            condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_BASEDOCUMENTTYPE_NAME;
                            condition.value = selected.objectCode;
                            condition.bracketOpen = 1;
                            if (cCriteria.conditions.length > 2) {
                                condition.relationship = ibas.emConditionRelationship.OR;
                            }
                            condition = cCriteria.conditions.create();
                            condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_BASEDOCUMENTENTRY_NAME;
                            condition.value = selected.docEntry.toString();
                            condition.bracketClose = 1;
                        }
                        if (cCriteria.conditions.length > 0) {
                            that.addSalesInvoiceDownPayment(criteria);
                        }
                        that.view.showSalesInvoiceItems(that.editData.salesInvoiceItems.filterDeleted());
                    }
                });
            }
            private receiptSalesInvoice(): void {
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
            private chooseSalesInvoiceContactPerson(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesinvoice_customercode")
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
                boRepository.fetchSalesInvoice({
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
                            this.view.showSalesInvoice(this.editData);
                            this.view.showSalesInvoiceItems(this.editData.salesInvoiceItems.filterDeleted());
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
            /** 选择一揽子协议事件 */
            private chooseSalesInvoiceBlanketAgreement(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesinvoice_customercode")
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
                                            if (that.editData.salesInvoiceItems.firstOrDefault(
                                                c => c.baseDocumentType === baItem.objectCode
                                                    && c.baseDocumentEntry === baItem.docEntry
                                                    && c.baseDocumentLineId === baItem.lineId) !== null) {
                                                continue;
                                            }
                                            let item: bo.SalesInvoiceItem = that.editData.salesInvoiceItems.create();
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
                                                setUnitRate(this: bo.SalesInvoiceItem, value: number): void {
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
                                    that.view.showSalesInvoiceItems(that.editData.salesInvoiceItems.filterDeleted());
                                }
                            });
                        }
                    }
                });
            }
            private chooseSalesInvoiceItemUnit(caller: bo.SalesInvoiceItem, filterConditions?: ibas.ICondition[]): void {
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
                        that.changeSalesInvoiceItemPrice(that.editData.priceList, [caller]);
                    }
                });
            }
            private chooseSalesInvoiceItemMaterialVersion(caller: bo.SalesInvoiceItem): void {
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
                        ibas.i18n.prop("bo_salesinvoice_customercode")
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
            private chooseSalesInvoiceItemDistributionRule(type: accounting.app.emDimensionType, caller: bo.SalesInvoiceItem): void {
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
            /** 添加销售发票-预收款事件 */
            public addSalesInvoiceDownPayment(criteria?: ibas.ICriteria): void {
                let condition: ibas.ICondition;
                let boRepository: receiptpayment.bo.BORepositoryReceiptPayment;
                if (ibas.objects.isNull(criteria)) {
                    criteria = new ibas.Criteria();
                    let cCriteria: ibas.IChildCriteria = criteria.childCriterias.create();
                    cCriteria.propertyPath = receiptpayment.bo.Receipt.PROPERTY_RECEIPTITEMS_NAME;
                    cCriteria.onlyHasChilds = true;
                    // 不基于单据
                    condition = cCriteria.conditions.create();
                    condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_BASEDOCUMENTTYPE_NAME;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = cCriteria.conditions.create();
                    condition.alias = receiptpayment.bo.ReceiptItem.PROPERTY_BASEDOCUMENTTYPE_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                    let orderType: string = ibas.config.applyVariables(bo.SalesOrder.BUSINESS_OBJECT_CODE);
                    let deliveryType: string = ibas.config.applyVariables(bo.SalesDelivery.BUSINESS_OBJECT_CODE);
                    let requestType: string = ibas.config.applyVariables(bo.DownPaymentRequest.BUSINESS_OBJECT_CODE);
                    for (let item of this.editData.salesInvoiceItems) {
                        if (!(item.baseDocumentEntry > 0)) {
                            continue;
                        }
                        if (ibas.strings.equals(item.baseDocumentType, orderType) || ibas.strings.equals(item.baseDocumentType, deliveryType)) {
                            // 基于订单、交货（零售业务）
                            condition = cCriteria.conditions.create();
                            condition.alias = receiptpayment.bo.PaymentItem.PROPERTY_BASEDOCUMENTTYPE_NAME;
                            condition.value = item.baseDocumentType;
                            condition.bracketOpen = 1;
                            if (cCriteria.conditions.length > 2) {
                                condition.relationship = ibas.emConditionRelationship.OR;
                            }
                            condition = cCriteria.conditions.create();
                            condition.alias = receiptpayment.bo.PaymentItem.PROPERTY_BASEDOCUMENTENTRY_NAME;
                            condition.value = item.baseDocumentEntry.toString();
                            condition.bracketClose = 1;
                        }
                        // 基于预付款申请
                        condition = cCriteria.conditions.create();
                        condition.alias = receiptpayment.bo.PaymentItem.PROPERTY_BASEDOCUMENTTYPE_NAME;
                        condition.value = requestType;
                        condition.bracketOpen = 1;
                        if (cCriteria.conditions.length > 2) {
                            condition.relationship = ibas.emConditionRelationship.OR;
                        }
                        condition = cCriteria.conditions.create();
                        condition.bracketOpen = 2;
                        condition.alias = receiptpayment.bo.PaymentItem.PROPERTY_ORIGINALDOCUMENTTYPE_NAME;
                        condition.value = "";
                        condition = cCriteria.conditions.create();
                        condition.alias = receiptpayment.bo.PaymentItem.PROPERTY_ORIGINALDOCUMENTTYPE_NAME;
                        condition.operation = ibas.emConditionOperation.IS_NULL;
                        condition.relationship = ibas.emConditionRelationship.OR;
                        condition.bracketClose = 1;
                        condition = cCriteria.conditions.create();
                        condition.bracketOpen = 1;
                        condition.alias = receiptpayment.bo.PaymentItem.PROPERTY_ORIGINALDOCUMENTTYPE_NAME;
                        condition.value = item.baseDocumentType;
                        condition.relationship = ibas.emConditionRelationship.OR;
                        condition = cCriteria.conditions.create();
                        condition.alias = receiptpayment.bo.PaymentItem.PROPERTY_ORIGINALDOCUMENTENTRY_NAME;
                        condition.value = item.baseDocumentEntry.toString();
                        condition.bracketClose = 3;
                    }
                } else if (criteria.childCriterias.length > 0) {
                    boRepository = new receiptpayment.bo.BORepositoryReceiptPayment();
                }
                // 未取消的
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 仅下达的
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emDocumentStatus.RELEASED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(this.editData.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = receiptpayment.bo.Receipt.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = receiptpayment.bo.Receipt.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = receiptpayment.bo.Receipt.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_BUSINESSPARTNERTYPE_NAME;
                condition.value = businesspartner.bo.emBusinessPartnerType.CUSTOMER.toString();
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_BUSINESSPARTNERCODE_NAME;
                condition.value = this.editData.customerCode;
                // 存在已清金额
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_DOCUMENTTOTAL_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = receiptpayment.bo.Receipt.PROPERTY_CLOSEDAMOUNT_NAME;
                if (ibas.objects.isNull(boRepository)) {
                    let that: this = this;
                    ibas.servicesManager.runChooseService<receiptpayment.bo.Receipt>({
                        boCode: receiptpayment.bo.Receipt.BUSINESS_OBJECT_CODE,
                        chooseType: ibas.emChooseType.MULTIPLE,
                        criteria: criteria,
                        onCompleted(selecteds: ibas.IList<receiptpayment.bo.Receipt>): void {
                            let amount: number = ibas.numbers.valueOf(that.editData.documentTotal)
                                - ibas.numbers.valueOf(that.editData.paidTotal) - ibas.numbers.valueOf(that.editData.downPaymentTotal);
                            for (let item of selecteds) {
                                for (let sItem of item.receiptItems) {
                                    if (!ibas.objects.isNull(that.editData.salesInvoiceDownPayments.firstOrDefault(
                                        c => c.paymentType === sItem.objectCode && c.paymentEntry === sItem.docEntry && c.paymentLineId === sItem.lineId
                                    ))) {
                                        continue;
                                    }
                                    let item: bo.SalesInvoiceDownPayment = that.editData.salesInvoiceDownPayments.create();
                                    item.baseDocument(sItem);
                                    if (amount > sItem.amount) {
                                        item.drawnTotal = sItem.amount;
                                    } else {
                                        item.drawnTotal = amount;
                                    }
                                    amount -= item.drawnTotal;
                                    if (amount <= 0) {
                                        break;
                                    }
                                }
                                if (amount <= 0) {
                                    that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("sales_documents_no_amount_to_be_paid"));
                                    break;
                                }
                            }
                            that.view.showSalesInvoiceDownPayments(that.editData.salesInvoiceDownPayments.filterDeleted());
                        }
                    });
                } else {
                    boRepository.fetchReceipt({
                        criteria: criteria,
                        onCompleted: (opRslt) => {
                            try {
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                let amount: number = ibas.numbers.valueOf(this.editData.documentTotal)
                                    - ibas.numbers.valueOf(this.editData.paidTotal) - ibas.numbers.valueOf(this.editData.downPaymentTotal);
                                for (let item of opRslt.resultObjects) {
                                    for (let sItem of item.receiptItems) {
                                        if (!ibas.objects.isNull(this.editData.salesInvoiceDownPayments.firstOrDefault(
                                            c => c.paymentType === sItem.objectCode && c.paymentEntry === sItem.docEntry && c.paymentLineId === sItem.lineId
                                        ))) {
                                            continue;
                                        }
                                        let item: bo.SalesInvoiceDownPayment = this.editData.salesInvoiceDownPayments.create();
                                        item.baseDocument(sItem);
                                        if (amount > sItem.amount) {
                                            item.drawnTotal = sItem.amount;
                                        } else {
                                            item.drawnTotal = amount;
                                        }
                                        amount -= item.drawnTotal;
                                    }
                                }
                                this.view.showSalesInvoiceDownPayments(this.editData.salesInvoiceDownPayments.filterDeleted());
                            } catch (error) {
                                this.messages(error);
                            }
                        }
                    });
                }
            }
            /** 删除销售发票-预收款事件 */
            protected removeSalesInvoiceDownPayment(items: bo.SalesInvoiceDownPayment[]): void {
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                // 移除项目
                for (let item of items) {
                    if (this.editData.salesInvoiceDownPayments.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesInvoiceDownPayments.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showSalesInvoiceDownPayments(this.editData.salesInvoiceDownPayments.filterDeleted());
            }
            /** 添加销售发票-预收款事件 */
            protected chooseSalesInvoiceDownPayment(): void {
                let condition: ibas.ICondition;
                let criteria: ibas.Criteria = new ibas.Criteria();
                // 未取消的
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 仅下达的
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emDocumentStatus.RELEASED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(this.editData.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = receiptpayment.bo.Receipt.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = receiptpayment.bo.Receipt.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = receiptpayment.bo.Receipt.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_BUSINESSPARTNERTYPE_NAME;
                condition.value = businesspartner.bo.emBusinessPartnerType.CUSTOMER.toString();
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_BUSINESSPARTNERCODE_NAME;
                condition.value = this.editData.customerCode;
                // 存在已清金额
                condition = criteria.conditions.create();
                condition.alias = receiptpayment.bo.Receipt.PROPERTY_DOCUMENTTOTAL_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.value = "0";

                ibas.servicesManager.runChooseService<receiptpayment.bo.Receipt>({
                    boCode: receiptpayment.bo.Receipt.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted: (selecteds) => {
                        let amount: number = ibas.numbers.valueOf(this.editData.documentTotal)
                            - ibas.numbers.valueOf(this.editData.paidTotal) - ibas.numbers.valueOf(this.editData.downPaymentTotal);
                        for (let selected of selecteds) {
                            for (let sItem of selected.receiptItems) {
                                if (!ibas.objects.isNull(this.editData.salesInvoiceDownPayments.firstOrDefault(
                                    c => c.paymentType === sItem.objectCode && c.paymentEntry === sItem.docEntry && c.paymentLineId === sItem.lineId
                                ))) {
                                    continue;
                                }
                                let item: bo.SalesInvoiceDownPayment = this.editData.salesInvoiceDownPayments.create();
                                item.baseDocument(sItem);
                                if (amount > sItem.amount) {
                                    item.drawnTotal = sItem.amount;
                                } else {
                                    item.drawnTotal = amount;
                                }
                                amount -= item.drawnTotal;
                            }
                            if (amount <= 0) {
                                break;
                            }
                        }
                        this.view.showSalesInvoiceDownPayments(this.editData.salesInvoiceDownPayments.filterDeleted());
                    }
                });
            }
            protected measuringMaterials(): void {
                let lines: ibas.ArrayList<materials.app.IMaterialMeasurementContractLine> = new ibas.ArrayList<materials.app.IMaterialMeasurementContractLine>();
                for (let item of this.editData.salesInvoiceItems) {
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
            protected chooseSalesInvoiceItemMaterialCatalog(caller: bo.SalesInvoiceItem, filterConditions?: ibas.ICondition[]): void {
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
                        let count: number = this.editData.salesInvoiceItems.length;
                        for (let selected of selecteds) {
                            if (ibas.strings.isEmpty(selected.itemCode)) {
                                continue;
                            }
                            if (ibas.objects.isNull(caller)) {
                                caller = this.editData.salesInvoiceItems.create();
                            }
                            caller.catalogCode = selected.catalogCode;
                            condition = new ibas.Condition();
                            condition.alias = materials.bo.Material.PROPERTY_CODE_NAME;
                            condition.value = selected.itemCode;
                            this.chooseSalesInvoiceItemMaterial(caller, null, [condition]);
                            caller = null;
                        }
                        if (this.editData.salesInvoiceItems.length > count) {
                            this.view.showSalesInvoiceItems(this.editData.salesInvoiceItems.filterDeleted());
                        }
                    }
                });
            }
        }
        /** 视图-销售发票 */
        export interface ISalesInvoiceEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showSalesInvoice(data: bo.SalesInvoice): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加销售发票-行事件 */
            addSalesInvoiceItemEvent: Function;
            /** 删除销售发票-行事件 */
            removeSalesInvoiceItemEvent: Function;
            /** 显示数据 */
            showSalesInvoiceItems(datas: bo.SalesInvoiceItem[]): void;
            /** 选择销售发票客户事件 */
            chooseSalesInvoiceCustomerEvent: Function;
            /** 选择销售发票联系人信息 */
            chooseSalesInvoiceContactPersonEvent: Function;
            /** 选择销售发票价格清单事件 */
            chooseSalesInvoicePriceListEvent: Function;
            /** 选择销售发票物料事件 */
            chooseSalesInvoiceItemMaterialEvent: Function;
            /** 选择销售发票仓库事件 */
            chooseSalesInvoiceItemWarehouseEvent: Function;
            /** 选择销售发票单位事件 */
            chooseSalesInvoiceItemUnitEvent: Function;
            /** 选择销售发票单行物料批次事件 */
            chooseSalesInvoiceItemMaterialBatchEvent: Function;
            /** 选择销售发票行物料序列事件 */
            chooseSalesInvoiceItemMaterialSerialEvent: Function;
            /** 选择销售发票-行 物料版本 */
            chooseSalesInvoiceItemMaterialVersionEvent: Function;
            /** 选择销售发票-销售订单事件 */
            chooseSalesInvoiceSalesOrderEvent: Function;
            /** 选择销售发票-销售交货事件 */
            chooseSalesInvoiceSalesDeliveryEvent: Function;
            /** 选择销售发票-一揽子协议事件 */
            chooseSalesInvoiceBlanketAgreementEvent: Function;
            /** 选择销售发票-行成本中心事件 */
            chooseSalesInvoiceItemDistributionRuleEvent: Function;
            /** 选择一业务伙伴目录事件 */
            chooseSalesInvoiceItemMaterialCatalogEvent: Function;
            /** 选择客户合同 */
            chooseCustomerAgreementsEvent: Function;
            /** 销售发票收款事件 */
            receiptSalesInvoiceEvent: Function;
            /** 编辑地址事件 */
            editShippingAddressesEvent: Function;
            /** 转为销售交货事件 */
            turnToSalesCreditNoteEvent: Function;
            /** 添加销售发票-预收款事件 */
            addSalesInvoiceDownPaymentEvent: Function;
            /** 删除销售发票-预收款事件 */
            removeSalesInvoiceDownPaymentEvent: Function;
            /** 显示数据-销售发票-预收款 */
            showSalesInvoiceDownPayments(datas: bo.SalesInvoiceDownPayment[]): void;
            /** 测量物料 */
            measuringMaterialsEvent: Function;
            /** 默认仓库 */
            defaultWarehouse: string;
            /** 默认税组 */
            defaultTaxGroup: string;
        }
        /** 销售发票编辑服务映射 */
        export class SalesInvoiceEditServiceMapping extends ibas.BOEditServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesInvoiceEditApp.APPLICATION_ID;
                this.name = SalesInvoiceEditApp.APPLICATION_NAME;
                this.boCode = SalesInvoiceEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOEditServiceCaller<bo.SalesInvoice>> {
                return new SalesInvoiceEditApp();
            }
        }
    }
}