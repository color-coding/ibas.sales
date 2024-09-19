/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 编辑应用-销售贷项 */
        export class SalesCreditNoteEditApp extends ibas.BOEditService<ISalesCreditNoteEditView, bo.SalesCreditNote> {
            /** 应用标识 */
            static APPLICATION_ID: string = "8e71f9d6-6aa2-44e7-b913-d43abc7f3b4e";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salescreditnote_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesCreditNote.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesCreditNoteEditApp.APPLICATION_ID;
                this.name = SalesCreditNoteEditApp.APPLICATION_NAME;
                this.boCode = SalesCreditNoteEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addSalesCreditNoteItemEvent = this.addSalesCreditNoteItem;
                this.view.removeSalesCreditNoteItemEvent = this.removeSalesCreditNoteItem;
                this.view.chooseSalesCreditNoteCustomerEvent = this.chooseSalesCreditNoteCustomer;
                this.view.chooseSalesCreditNoteContactPersonEvent = this.chooseSalesCreditNoteContactPerson;
                this.view.chooseSalesCreditNotePriceListEvent = this.chooseSalesCreditNotePriceList;
                this.view.chooseSalesCreditNoteItemMaterialEvent = this.chooseSalesCreditNoteItemMaterial;
                this.view.chooseSalesCreditNoteItemMaterialBatchEvent = this.chooseSalesCreditNoteLineMaterialBatch;
                this.view.chooseSalesCreditNoteItemMaterialSerialEvent = this.chooseSalesCreditNoteLineMaterialSerial;
                this.view.chooseSalesCreditNoteItemMaterialVersionEvent = this.chooseSalesCreditNoteItemMaterialVersion;
                this.view.chooseSalesCreditNoteItemDistributionRuleEvent = this.chooseSalesCreditNoteItemDistributionRule;
                this.view.chooseSalesCreditNoteItemWarehouseEvent = this.chooseSalesCreditNoteItemWarehouse;
                this.view.chooseSalesCreditNoteItemUnitEvent = this.chooseSalesCreditNoteItemUnit;
                this.view.chooseSalesCreditNoteSalesReturnEvent = this.chooseSalesCreditNoteSalesReturn;
                this.view.chooseSalesCreditNoteSalesInvoiceEvent = this.chooseSalesCreditNoteSalesInvoice;
                this.view.chooseCustomerAgreementsEvent = this.chooseCustomerAgreements;
                this.view.editShippingAddressesEvent = this.editShippingAddresses;
                this.view.measuringMaterialsEvent = this.measuringMaterials;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.SalesCreditNote();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showSalesCreditNote(this.editData);
                this.view.showSalesCreditNoteItems(this.editData.salesCreditNoteItems.filterDeleted());
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
            run(data: bo.SalesCreditNote): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.SalesCreditNote)) {
                    let data: bo.SalesCreditNote = arguments[0];
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
                        boRepository.fetchSalesCreditNote({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.SalesCreditNote>): void {
                                let data: bo.SalesCreditNote;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.SalesCreditNote)) {
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
                boRepository.saveSalesCreditNote({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesCreditNote>): void {
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
                        boRepository.parse<bo.SalesCreditNote>({
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
                        that.editData = new bo.SalesCreditNote();
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
            /** 选择销售贷项客户事件 */
            private chooseSalesCreditNoteCustomer(filterConditions?: ibas.ICondition[]): void {
                let items: bo.SalesCreditNoteItem[] = this.editData.salesCreditNoteItems.where(c =>
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
                                this.removeSalesCreditNoteItem(items);
                                this.chooseSalesCreditNoteCustomer(filterConditions);
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
                        that.changeSalesCreditNoteItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 选择销售贷项价格清单事件 */
            private chooseSalesCreditNotePriceList(): void {
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
                        that.changeSalesCreditNoteItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 更改行价格 */
            private changeSalesCreditNoteItemPrice(priceList: number | ibas.ICriteria, items?: bo.SalesCreditNoteItem[]): void {
                if (ibas.objects.isNull(items)) {
                    items = this.editData.salesCreditNoteItems.filterDeleted();
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
                        this.changeSalesCreditNoteItemPrice(criteria, items);
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
                                    this.changeSalesCreditNoteItemPrice(criteria, items);
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
            /** 选择销售贷项行物料事件 */
            private chooseSalesCreditNoteItemMaterial(caller: bo.SalesCreditNoteItem, filterConditions?: ibas.ICondition[]): void {
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
                        let index: number = that.editData.salesCreditNoteItems.indexOf(caller);
                        let item: bo.SalesCreditNoteItem = that.editData.salesCreditNoteItems[index];
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
                                                        let parentItem: bo.SalesCreditNoteItem = null;
                                                        // 清理旧数据，bo对象负责清理关联子项
                                                        if (!ibas.objects.isNull(item)) {
                                                            parentItem = item;
                                                            if (!ibas.strings.isEmpty(parentItem.lineSign)) {
                                                                for (let i: number = that.editData.salesCreditNoteItems.length - 1; i >= 0; i--) {
                                                                    let tItem: bo.SalesCreditNoteItem = that.editData.salesCreditNoteItems[i];
                                                                    if (tItem.parentLineSign === parentItem.lineSign) {
                                                                        if (tItem.isNew) {
                                                                            that.editData.salesCreditNoteItems.remove(tItem);
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
                                                        for (let sItem of bo.baseProductSuit(that.editData.salesCreditNoteItems, pData)) {
                                                            if (!ibas.strings.isEmpty(that.view.defaultWarehouse)) {
                                                                sItem.warehouse = that.view.defaultWarehouse;
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
                                                                    setUnitRate(this: bo.SalesCreditNoteItem, value: number): void {
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
                                        for (let i: number = that.editData.salesCreditNoteItems.length - 1; i >= 0; i--) {
                                            let tItem: bo.SalesCreditNoteItem = that.editData.salesCreditNoteItems[i];
                                            if (tItem.parentLineSign === item.lineSign) {
                                                if (tItem.isNew) {
                                                    that.editData.salesCreditNoteItems.remove(tItem);
                                                } else {
                                                    tItem.delete();
                                                }
                                            }
                                        }
                                        created = true;
                                    }
                                }
                                if (ibas.objects.isNull(item)) {
                                    item = that.editData.salesCreditNoteItems.create();
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
                                    setUnitRate(this: bo.SalesCreditNoteItem, value: number): void {
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
                                that.view.showSalesCreditNoteItems(that.editData.salesCreditNoteItems.filterDeleted());
                            }
                        });
                    }
                });
            }
            /** 选择销售贷项行仓库事件 */
            private chooseSalesCreditNoteItemWarehouse(caller: bo.SalesCreditNoteItem, filterConditions?: ibas.ICondition[]): void {
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
                        let index: number = that.editData.salesCreditNoteItems.indexOf(caller);
                        let item: bo.SalesCreditNoteItem = that.editData.salesCreditNoteItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesCreditNoteItems.create();
                                created = true;
                            }
                            item.warehouse = selected.code;
                            that.view.defaultWarehouse = item.warehouse;
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showSalesCreditNoteItems(that.editData.salesCreditNoteItems.filterDeleted());
                        }
                    }
                });
            }
            /** 添加销售贷项-行事件 */
            private addSalesCreditNoteItem(items: bo.SalesCreditNoteItem[] | number): void {
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
                        let newItem: bo.SalesCreditNoteItem = item.clone();
                        newItem.lineId = undefined;
                        newItem.visOrder = undefined;
                        // 序列号清除
                        newItem.materialSerials.clear();
                        this.editData.salesCreditNoteItems.add(newItem);
                        if (builder.length > 2) {
                            builder.append(", ");
                        }
                        builder.append(newItem.lineId);
                    }
                    builder.append("] ");
                    if (builder.length > 3) {
                        this.proceeding(ibas.emMessageType.WARNING, builder.toString());
                        this.view.showSalesCreditNoteItems(this.editData.salesCreditNoteItems.filterDeleted());
                    }
                } else if (typeof items === "number" && items > 0) {
                    for (let i: number = 0; i < items; i++) {
                        this.editData.salesCreditNoteItems.create();
                    }
                    this.view.showSalesCreditNoteItems(this.editData.salesCreditNoteItems.filterDeleted());
                } else {
                    this.chooseSalesCreditNoteItemMaterial(undefined);
                }
            }
            /** 删除销售贷项-行事件 */
            private removeSalesCreditNoteItem(items: bo.SalesCreditNoteItem[]): void {
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
                    if (this.editData.salesCreditNoteItems.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesCreditNoteItems.remove(item);
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
                            for (let i: number = this.editData.salesCreditNoteItems.length - 1; i >= 0; i--) {
                                let tItem: bo.SalesCreditNoteItem = this.editData.salesCreditNoteItems[i];
                                if (tItem.parentLineSign === item.lineSign) {
                                    if (tItem.isNew) {
                                        this.editData.salesCreditNoteItems.remove(tItem);
                                    } else {
                                        tItem.delete();
                                    }
                                }
                            }
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showSalesCreditNoteItems(this.editData.salesCreditNoteItems.filterDeleted());
            }

            /** 选择销售贷项行批次事件 */
            private chooseSalesCreditNoteLineMaterialBatch(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialBatchContract> = new ibas.ArrayList<materials.app.IMaterialBatchContract>();
                for (let item of this.editData.salesCreditNoteItems) {
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
                ibas.servicesManager.runApplicationService<materials.app.IMaterialBatchContract[]>({
                    proxy: new materials.app.MaterialBatchReceiptServiceProxy(contracts)
                });
            }
            /** 选择销售贷项序列事件 */
            private chooseSalesCreditNoteLineMaterialSerial(): void {
                let contracts: ibas.ArrayList<materials.app.IMaterialSerialContract> = new ibas.ArrayList<materials.app.IMaterialSerialContract>();
                for (let item of this.editData.salesCreditNoteItems) {
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
                    proxy: new materials.app.MaterialSerialReceiptServiceProxy(contracts)
                });
            }
            /** 选择销售贷项-销售退货事件 */
            private chooseSalesCreditNoteSalesReturn(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salescreditnote_customercode")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                // 未取消的
                condition.alias = bo.SalesReturn.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 未删除的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesReturn.PROPERTY_DELETED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 仅下达的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesReturn.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emDocumentStatus.RELEASED.toString();
                // 审批通过的或未进审批
                condition = criteria.conditions.create();
                condition.alias = bo.SalesReturn.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.APPROVED.toString();
                condition.bracketOpen = 1;
                condition = criteria.conditions.create();
                condition.alias = bo.SalesReturn.PROPERTY_APPROVALSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emApprovalStatus.UNAFFECTED.toString();
                condition.relationship = ibas.emConditionRelationship.OR;
                condition.bracketClose = 1;
                // 是否指定分支
                if (!ibas.strings.isEmpty(this.editData.branch)) {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesReturn.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesReturn.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesReturn.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.IS_NULL;
                    condition.relationship = ibas.emConditionRelationship.OR;
                    condition.bracketClose = 1;
                }
                // 当前客户的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesReturn.PROPERTY_CUSTOMERCODE_NAME;
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
                        condition.alias = bo.SalesReturn.PROPERTY_AGREEMENTS_NAME;
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
                cCriteria.propertyPath = bo.SalesReturn.PROPERTY_SALESRETURNITEMS_NAME;
                cCriteria.onlyHasChilds = true;
                cCriteria.noChilds = false;
                // 未取消的
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReturnItem.PROPERTY_CANCELED_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emYesNo.NO.toString();
                // 数量大于已清数量
                condition = cCriteria.conditions.create();
                condition.alias = bo.SalesReturnItem.PROPERTY_QUANTITY_NAME;
                condition.operation = ibas.emConditionOperation.GRATER_THAN;
                condition.comparedAlias = bo.SalesReturnItem.PROPERTY_CLOSEDQUANTITY_NAME;
                // 调用选择服务
                let that: this = this;
                ibas.servicesManager.runChooseService<bo.SalesReturn>({
                    boCode: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                    chooseType: ibas.emChooseType.MULTIPLE,
                    criteria: criteria,
                    onCompleted(selecteds: ibas.IList<bo.SalesReturn>): void {
                        for (let selected of selecteds) {
                            if (!ibas.strings.equals(that.editData.customerCode, selected.customerCode)) {
                                continue;
                            }
                            that.editData.baseDocument(selected);
                        }
                        that.view.showSalesCreditNoteItems(that.editData.salesCreditNoteItems.filterDeleted());
                    }
                });
            }
            /** 选择销售贷项-销售发票事件 */
            private chooseSalesCreditNoteSalesInvoice(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salescreditnote_customercode")
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
                // 仅下达的
                condition = criteria.conditions.create();
                condition.alias = bo.SalesInvoice.PROPERTY_DOCUMENTSTATUS_NAME;
                condition.operation = ibas.emConditionOperation.EQUAL;
                condition.value = ibas.emDocumentStatus.RELEASED.toString();
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
                        that.view.showSalesCreditNoteItems(that.editData.salesCreditNoteItems.filterDeleted());
                    }
                });
            }
            /** 选择联系人 */
            private chooseSalesCreditNoteContactPerson(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salescreditnote_customercode")
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
            private chooseSalesCreditNoteItemUnit(caller: bo.SalesCreditNoteItem, filterConditions?: ibas.ICondition[]): void {
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
                        that.changeSalesCreditNoteItemPrice(that.editData.priceList, [caller]);
                    }
                });
            }
            private chooseSalesCreditNoteItemMaterialVersion(caller: bo.SalesCreditNoteItem): void {
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
                        ibas.i18n.prop("bo_salescreditnote_customercode")
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
                    condition.alias = bo.SalesCreditNote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = this.editData.branch;
                } else {
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesCreditNote.PROPERTY_BRANCH_NAME;
                    condition.operation = ibas.emConditionOperation.EQUAL;
                    condition.value = "";
                    condition.bracketOpen = 1;
                    condition = criteria.conditions.create();
                    condition.alias = bo.SalesCreditNote.PROPERTY_BRANCH_NAME;
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
            private chooseSalesCreditNoteItemDistributionRule(type: accounting.app.emDimensionType, caller: bo.SalesCreditNoteItem): void {
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
                for (let item of this.editData.salesCreditNoteItems) {
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
        }
        /** 视图-销售贷项 */
        export interface ISalesCreditNoteEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showSalesCreditNote(data: bo.SalesCreditNote): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加销售贷项-行事件 */
            addSalesCreditNoteItemEvent: Function;
            /** 删除销售贷项-行事件 */
            removeSalesCreditNoteItemEvent: Function;
            /** 显示数据 */
            showSalesCreditNoteItems(datas: bo.SalesCreditNoteItem[]): void;
            /** 选择销售贷项客户事件 */
            chooseSalesCreditNoteCustomerEvent: Function;
            /** 选择销售贷项联系人信息 */
            chooseSalesCreditNoteContactPersonEvent: Function;
            /** 选择销售贷项价格清单事件 */
            chooseSalesCreditNotePriceListEvent: Function;
            /** 选择销售贷项物料事件 */
            chooseSalesCreditNoteItemMaterialEvent: Function;
            /** 选择销售贷项仓库事件 */
            chooseSalesCreditNoteItemWarehouseEvent: Function;
            /** 选择销售贷项-行 单位 */
            chooseSalesCreditNoteItemUnitEvent: Function;
            /** 选择销售贷项单行物料批次事件 */
            chooseSalesCreditNoteItemMaterialBatchEvent: Function;
            /** 选择销售贷项行物料序列事件 */
            chooseSalesCreditNoteItemMaterialSerialEvent: Function;
            /** 选择销售贷项-行 物料版本 */
            chooseSalesCreditNoteItemMaterialVersionEvent: Function;
            /** 选择销售贷项-销售退货事件 */
            chooseSalesCreditNoteSalesReturnEvent: Function;
            /** 选择销售贷项-销售发票事件 */
            chooseSalesCreditNoteSalesInvoiceEvent: Function;
            /** 选择销售贷项-行 成本中心事件 */
            chooseSalesCreditNoteItemDistributionRuleEvent: Function;
            /** 选择客户合同 */
            chooseCustomerAgreementsEvent: Function;
            /** 编辑地址事件 */
            editShippingAddressesEvent: Function;
            /** 测量物料 */
            measuringMaterialsEvent: Function;
            /** 默认仓库 */
            defaultWarehouse: string;
        }
        /** 销售贷项编辑服务映射 */
        export class SalesCreditNoteEditServiceMapping extends ibas.BOEditServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesCreditNoteEditApp.APPLICATION_ID;
                this.name = SalesCreditNoteEditApp.APPLICATION_NAME;
                this.boCode = SalesCreditNoteEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOEditServiceCaller<bo.SalesCreditNote>> {
                return new SalesCreditNoteEditApp();
            }
        }
    }
}