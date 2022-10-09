/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 编辑应用-销售报价 */
        export class SalesQuoteEditApp extends ibas.BOEditService<ISalesQuoteEditView, bo.SalesQuote> {
            /** 应用标识 */
            static APPLICATION_ID: string = "4d08905a-76de-4b64-be11-334305e76dfa";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesquote_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesQuote.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesQuoteEditApp.APPLICATION_ID;
                this.name = SalesQuoteEditApp.APPLICATION_NAME;
                this.boCode = SalesQuoteEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.addSalesQuoteItemEvent = this.addSalesQuoteItem;
                this.view.removeSalesQuoteItemEvent = this.removeSalesQuoteItem;
                this.view.chooseSalesQuoteItemMaterialEvent = this.chooseSalesQuoteItemMaterial;
                this.view.chooseSalesQuoteCustomerEvent = this.chooseSalesQuoteCustomer;
                this.view.chooseSalesQuoteContactPersonEvent = this.chooseSalesQuoteContactPerson;
                this.view.chooseSalesQuotePriceListEvent = this.chooseSalesQuotePriceList;
                this.view.chooseSalesQuoteItemWarehouseEvent = this.chooseSalesQuoteItemWarehouse;
                this.view.chooseSalesQuoteBlanketAgreementEvent = this.chooseSalesQuoteBlanketAgreement;
                this.view.showSalesQuoteItemExtraEvent = this.showSalesQuoteItemExtra;
                this.view.turnToSalesOrderEvent = this.turnToSalesOrder;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.SalesQuote();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showSalesQuote(this.editData);
                this.view.showSalesQuoteItems(this.editData.salesQuoteItems.filterDeleted());
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
            run(data: bo.SalesQuote): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.SalesQuote)) {
                    let data: bo.SalesQuote = arguments[0];
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
                        boRepository.fetchSalesQuote({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.SalesQuote>): void {
                                let data: bo.SalesQuote;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.SalesQuote)) {
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
                boRepository.saveSalesQuote({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesQuote>): void {
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
                        boRepository.parse<bo.SalesQuote>({
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
                        that.editData = new bo.SalesQuote();
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
            /** 选择销售报价客户事件 */
            private chooseSalesQuoteCustomer(): void {
                let that: this = this;
                if (this.editData.customerType === businesspartner.bo.emBusinessPartnerType.LEAD) {
                    ibas.servicesManager.runChooseService<businesspartner.bo.ILead>({
                        boCode: businesspartner.bo.BO_CODE_LEAD,
                        chooseType: ibas.emChooseType.SINGLE,
                        criteria: businesspartner.app.conditions.customer.create(),
                        onCompleted(selecteds: ibas.IList<businesspartner.bo.ILead>): void {
                            let selected: businesspartner.bo.ILead = selecteds.firstOrDefault();
                            that.editData.customerType = businesspartner.bo.emBusinessPartnerType.LEAD;
                            that.editData.customerCode = selected.code;
                            that.editData.customerName = selected.name;
                            that.editData.priceList = selected.priceList;
                            that.editData.contactPerson = selected.contactPerson;
                            that.editData.documentCurrency = selected.currency;
                            that.view.defaultTaxGroup = selected.taxGroup;
                            that.changeSalesQuoteItemPrice(that.editData.priceList);
                        }
                    });
                } else {
                    ibas.servicesManager.runChooseService<businesspartner.bo.ICustomer>({
                        boCode: businesspartner.bo.BO_CODE_CUSTOMER,
                        chooseType: ibas.emChooseType.SINGLE,
                        criteria: businesspartner.app.conditions.customer.create(),
                        onCompleted(selecteds: ibas.IList<businesspartner.bo.ICustomer>): void {
                            let selected: businesspartner.bo.ICustomer = selecteds.firstOrDefault();
                            that.editData.customerType = businesspartner.bo.emBusinessPartnerType.CUSTOMER;
                            that.editData.customerCode = selected.code;
                            that.editData.customerName = selected.name;
                            that.editData.priceList = selected.priceList;
                            that.editData.contactPerson = selected.contactPerson;
                            that.editData.documentCurrency = selected.currency;
                            that.view.defaultTaxGroup = selected.taxGroup;
                            that.changeSalesQuoteItemPrice(that.editData.priceList);
                        }
                    });
                }
            }
            /** 选择销售报价价格清单事件 */
            private chooseSalesQuotePriceList(): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IMaterialPriceList>({
                    boCode: materials.bo.BO_CODE_MATERIALPRICELIST,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: materials.app.conditions.materialpricelist.create(),
                    onCompleted(selecteds: ibas.IList<materials.bo.IMaterialPriceList>): void {
                        let selected: materials.bo.IMaterialPriceList = selecteds.firstOrDefault();
                        that.editData.priceList = selected.objectKey;
                        that.editData.documentCurrency = selected.currency;
                        that.changeSalesQuoteItemPrice(that.editData.priceList);
                    }
                });
            }
            /** 更改行价格 */
            private changeSalesQuoteItemPrice(priceList: number | ibas.Criteria): void {
                if (typeof priceList === "number" && priceList > 0) {
                    let criteria: ibas.Criteria = new ibas.Criteria();
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = materials.app.conditions.materialprice.CONDITION_ALIAS_PRICELIST;
                    condition.value = priceList.toString();
                    for (let item of this.editData.salesQuoteItems) {
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
                        this.changeSalesQuoteItemPrice(criteria);
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
                                    this.changeSalesQuoteItemPrice(criteria);
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
                                this.editData.salesQuoteItems.forEach((value) => {
                                    if (item.taxed === ibas.emYesNo.YES) {
                                        // 含税价格
                                        value.isLoading = true;
                                        value.discount = 1;
                                        value.unitPrice = 0;
                                        value.preTaxPrice = 0;
                                        value.price = 0;
                                        value.isLoading = false;
                                        // 税后价格
                                        value.price = item.price;
                                        value.currency = item.currency;
                                    } else {
                                        // 不含税价格
                                        value.isLoading = true;
                                        value.discount = 1;
                                        value.unitPrice = 0;
                                        value.preTaxPrice = 0;
                                        value.price = 0;
                                        value.isLoading = false;
                                        // 税前价格
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
            /** 选择销售报价物料事件 */
            private chooseSalesQuoteItemMaterial(caller: bo.SalesQuoteItem): void {
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
                        let index: number = that.editData.salesQuoteItems.indexOf(caller);
                        let item: bo.SalesQuoteItem = that.editData.salesQuoteItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
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
                                                        let parentItem: bo.SalesQuoteItem = null;
                                                        // 清理旧数据，bo对象负责清理关联子项
                                                        if (!ibas.objects.isNull(item)) {
                                                            parentItem = item;
                                                            if (!ibas.strings.isEmpty(parentItem.lineSign)) {
                                                                for (let i: number = that.editData.salesQuoteItems.length - 1; i >= 0; i--) {
                                                                    let tItem: bo.SalesQuoteItem = that.editData.salesQuoteItems[i];
                                                                    if (tItem.parentLineSign === parentItem.lineSign) {
                                                                        if (tItem.isNew) {
                                                                            that.editData.salesQuoteItems.remove(tItem);
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
                                                        for (let sItem of bo.baseProductSuit(that.editData.salesQuoteItems, pData)) {
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
                                        for (let i: number = that.editData.salesQuoteItems.length - 1; i >= 0; i--) {
                                            let tItem: bo.SalesQuoteItem = that.editData.salesQuoteItems[i];
                                            if (tItem.parentLineSign === item.lineSign) {
                                                if (tItem.isNew) {
                                                    that.editData.salesQuoteItems.remove(tItem);
                                                } else {
                                                    tItem.delete();
                                                }
                                            }
                                        }
                                        created = true;
                                    }
                                }
                                if (ibas.objects.isNull(item)) {
                                    item = that.editData.salesQuoteItems.create();
                                    created = true;
                                }
                                item.baseProduct(selected);
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
                                item = null;
                                sNext();
                            }
                        }, (error) => {
                            if (error instanceof Error) {
                                that.messages(error);
                            }
                            if (created) {
                                // 创建了新的行项目
                                that.view.showSalesQuoteItems(that.editData.salesQuoteItems.filterDeleted());
                            }
                        });
                    }
                });
            }
            /** 添加销售报价-行事件 */
            private addSalesQuoteItem(items: bo.SalesQuoteItem[]): void {
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
                        let newItem: bo.SalesQuoteItem = item.clone();
                        newItem.lineId = undefined;
                        newItem.visOrder = undefined;
                        this.editData.salesQuoteItems.add(newItem);
                        if (builder.length > 2) {
                            builder.append(", ");
                        }
                        builder.append(newItem.lineId);
                    }
                    builder.append("] ");
                    if (builder.length > 3) {
                        this.proceeding(ibas.emMessageType.WARNING, builder.toString());
                        this.view.showSalesQuoteItems(this.editData.salesQuoteItems.filterDeleted());
                    }
                } else {
                    this.chooseSalesQuoteItemMaterial(undefined);
                }
            }
            /** 删除销售报价-行事件 */
            private removeSalesQuoteItem(items: bo.SalesQuoteItem[]): void {
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
                    if (this.editData.salesQuoteItems.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesQuoteItems.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                        // 删除子项
                        if (!ibas.strings.isEmpty(item.lineSign)) {
                            for (let i: number = this.editData.salesQuoteItems.length - 1; i >= 0; i--) {
                                let tItem: bo.SalesQuoteItem = this.editData.salesQuoteItems[i];
                                if (tItem.parentLineSign === item.lineSign) {
                                    if (tItem.isNew) {
                                        this.editData.salesQuoteItems.remove(tItem);
                                    } else {
                                        tItem.delete();
                                    }
                                }
                            }
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showSalesQuoteItems(this.editData.salesQuoteItems.filterDeleted());
            }
            /** 选择销售交货行仓库事件 */
            private chooseSalesQuoteItemWarehouse(caller: bo.SalesQuoteItem): void {
                let that: this = this;
                ibas.servicesManager.runChooseService<materials.bo.IWarehouse>({
                    boCode: materials.bo.BO_CODE_WAREHOUSE,
                    chooseType: ibas.emChooseType.SINGLE,
                    criteria: materials.app.conditions.warehouse.create(),
                    onCompleted(selecteds: ibas.IList<materials.bo.IWarehouse>): void {
                        let index: number = that.editData.salesQuoteItems.indexOf(caller);
                        let item: bo.SalesQuoteItem = that.editData.salesQuoteItems[index];
                        // 选择返回数量多余触发数量时,自动创建新的项目
                        let created: boolean = false;
                        for (let selected of selecteds) {
                            if (ibas.objects.isNull(item)) {
                                item = that.editData.salesQuoteItems.create();
                                created = true;
                            }
                            item.warehouse = selected.code;
                            item = null;
                        }
                        if (created) {
                            // 创建了新的行项目
                            that.view.showSalesQuoteItems(that.editData.salesQuoteItems.filterDeleted());
                        }
                    }
                });
            }
            /** 选择联系人 */
            private chooseSalesQuoteContactPerson(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesquote_customercode")
                    ));
                    return;
                }
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = businesspartner.bo.ContactPerson.PROPERTY_OWNERTYPE_NAME;
                condition.value = this.editData.customerType.toString();
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
            private showSalesQuoteItemExtra(data: bo.SalesQuoteItem): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_view")
                    ));
                    return;
                }
                let app: SalesQuoteItemExtraApp = new SalesQuoteItemExtraApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(data, this.editData);
            }

            /** 转为销售订单 */
            protected turnToSalesOrder(salesOrder?: bo.SalesOrder): void {
                if (ibas.objects.isNull(this.editData) || this.editData.isDirty === true) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_saved_first"));
                    return;
                }
                if (ibas.dates.compare(ibas.dates.today(), this.editData.deliveryDate) < 0) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("sales_salesquote_expired_date"));
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
                if (salesOrder instanceof bo.SalesOrder) {
                    let app: SalesOrderEditApp = new SalesOrderEditApp();
                    app.navigation = this.navigation;
                    app.viewShower = this.viewShower;
                    app.run(salesOrder);
                } else {
                    if (this.editData.customerType === businesspartner.bo.emBusinessPartnerType.LEAD) {
                        let that: this = this;
                        this.messages({
                            type: ibas.emMessageType.QUESTION,
                            title: ibas.i18n.prop(this.name),
                            message: ibas.i18n.prop("sales_change_lead_to_customer_continue"),
                            actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                            onCompleted(action: ibas.emMessageAction): void {
                                if (action === ibas.emMessageAction.YES) {
                                    let criteria: ibas.ICriteria = new ibas.Criteria();
                                    let condition: ibas.ICondition = criteria.conditions.create();
                                    condition.alias = businesspartner.bo.Customer.PROPERTY_LEAD_NAME;
                                    condition.value = that.editData.customerCode;
                                    let boRepository: businesspartner.bo.BORepositoryBusinessPartner = new businesspartner.bo.BORepositoryBusinessPartner();
                                    boRepository.fetchCustomer({
                                        criteria: criteria,
                                        onCompleted: (opRslt) => {
                                            try {
                                                if (opRslt.resultCode !== 0) {
                                                    throw new Error(opRslt.message);
                                                }
                                                if (opRslt.resultObjects.length === 0) {
                                                    throw new Error(ibas.i18n.prop("sales_not_found_lead's_customer", that.editData.customerCode, that.editData.customerName));
                                                }
                                                let customer: businesspartner.bo.ICustomer = opRslt.resultObjects.firstOrDefault();
                                                let target: bo.SalesOrder = new bo.SalesOrder();
                                                target.customerCode = that.editData.customerCode;
                                                target.customerName = that.editData.customerName;
                                                target.baseDocument(that.editData);
                                                target.customerCode = customer.code;
                                                target.customerName = customer.name;
                                                that.turnToSalesOrder(target);
                                            } catch (error) {
                                                that.messages(error);
                                            }
                                        }
                                    });
                                } else {
                                    let target: bo.SalesOrder = new bo.SalesOrder();
                                    target.customerCode = that.editData.customerCode;
                                    target.customerName = that.editData.customerName;
                                    target.baseDocument(that.editData);
                                    that.turnToSalesOrder(target);
                                }
                            }
                        });
                    } else {
                        let target: bo.SalesOrder = new bo.SalesOrder();
                        target.customerCode = this.editData.customerCode;
                        target.customerName = this.editData.customerName;
                        target.baseDocument(this.editData);
                        this.turnToSalesOrder(target);
                    }

                }
            }
            /** 选择一揽子协议事件 */
            private chooseSalesQuoteBlanketAgreement(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.customerCode)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("bo_salesquote_customercode")
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
                                            if (that.editData.salesQuoteItems.firstOrDefault(
                                                c => c.baseDocumentType === baItem.objectCode
                                                    && c.baseDocumentEntry === baItem.docEntry
                                                    && c.baseDocumentLineId === baItem.lineId) !== null) {
                                                continue;
                                            }
                                            let item: bo.SalesQuoteItem = that.editData.salesQuoteItems.create();
                                            item.itemCode = baItem.itemCode;
                                            item.itemDescription = baItem.itemDescription;
                                            item.itemSign = baItem.itemSign;
                                            item.baseDocumentType = baItem.objectCode;
                                            item.baseDocumentEntry = baItem.docEntry;
                                            item.baseDocumentLineId = baItem.lineId;
                                            item.uom = baItem.uom;
                                            for (let mmItem of opRsltPRD.resultObjects.where(c => ibas.strings.equalsIgnoreCase(c.code, item.itemCode))) {
                                                item.baseProduct(mmItem);
                                            }
                                            item.quantity = baItem.quantity - baItem.closedQuantity;
                                            if (selected.priceMode === bo.emPriceMode.NET) {
                                                item.unitPrice = baItem.price;
                                            } else if (selected.priceMode === bo.emPriceMode.GROSS) {
                                                item.price = baItem.price;
                                            }
                                            item.reference1 = baItem.reference1;
                                            item.reference2 = baItem.reference2;
                                        }
                                    }
                                    that.view.showSalesQuoteItems(that.editData.salesQuoteItems.filterDeleted());
                                }
                            });
                        }
                    }
                });
            }
        }
        /** 视图-销售报价 */
        export interface ISalesQuoteEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showSalesQuote(data: bo.SalesQuote): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件，参数1：是否克隆 */
            createDataEvent: Function;
            /** 添加销售报价-行事件 */
            addSalesQuoteItemEvent: Function;
            /** 删除销售报价-行事件 */
            removeSalesQuoteItemEvent: Function;
            /** 显示数据 */
            showSalesQuoteItems(datas: bo.SalesQuoteItem[]): void;
            /** 选择销售报价客户事件 */
            chooseSalesQuoteCustomerEvent: Function;
            /** 选择销售报价联系人信息 */
            chooseSalesQuoteContactPersonEvent: Function;
            /** 选择销售报价价格清单事件 */
            chooseSalesQuotePriceListEvent: Function;
            /** 选择销售报价行物料事件 */
            chooseSalesQuoteItemMaterialEvent: Function;
            /** 选择销售报价一揽子协议事件 */
            chooseSalesQuoteBlanketAgreementEvent: Function;
            /** 选择销售报价仓库事件 */
            chooseSalesQuoteItemWarehouseEvent: Function;
            /** 显示销售报价额外信息事件 */
            showSalesQuoteItemExtraEvent: Function;
            /** 转为销售订单事件 */
            turnToSalesOrderEvent: Function;
            /** 默认税组 */
            defaultTaxGroup: string;
        }
        /** 销售报价编辑服务映射 */
        export class SalesQuoteEditServiceMapping extends ibas.BOEditServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesQuoteEditApp.APPLICATION_ID;
                this.name = SalesQuoteEditApp.APPLICATION_NAME;
                this.boCode = SalesQuoteEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOEditServiceCaller<bo.SalesQuote>> {
                return new SalesQuoteEditApp();
            }
        }
    }
}