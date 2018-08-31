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
        export class SalesQuoteEditApp extends ibas.BOEditApplication<ISalesQuoteEditView, bo.SalesQuote> {
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
                this.view.chooseSalesQuotePriceListEvent = this.chooseSalesQuotePriceList;
                this.view.chooseSalesQuoteItemWarehouseEvent = this.chooseSalesQuoteItemWarehouse;
                this.view.showSalesQuoteItemExtraEvent = this.showSalesQuoteItemExtra;
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
            /** 待编辑的数据 */
            protected editData: bo.SalesQuote;
            protected lineEditData: bo.SalesQuoteItem;
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
                    }
                });
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
                    }
                });
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
                        let fill: Function = function (index: number): void {
                            if (index >= selecteds.length) {
                                if (created) {
                                    // 创建了新的行项目
                                    that.view.showSalesQuoteItems(that.editData.salesQuoteItems.filterDeleted());
                                }
                                fill = null;
                                item = null;
                                index = null;
                            } else {
                                let selected: materials.bo.IProduct = selecteds[index];
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
                                            try {
                                                if (opRslt.resultCode !== 0) {
                                                    throw new Error(opRslt.message);
                                                }
                                                if (opRslt.resultObjects.length === 0) {
                                                    throw new Error(
                                                        ibas.i18n.prop("sales_not_found_product_suit_skipped",
                                                            ibas.strings.isEmpty(selected.name) ? selected.code : selected.name));
                                                }
                                                let fillSuit: Function = function (sIndex: number): void {
                                                    if (sIndex >= selecteds.length) {
                                                        fillSuit = null;
                                                        item = null;
                                                        sIndex = null;
                                                        fill(index + 1);
                                                    } else {
                                                        let pItem: bo.IProductSuitEx = opRslt.resultObjects[sIndex];
                                                        that.messages({
                                                            type: ibas.emMessageType.QUESTION,
                                                            message: ibas.i18n.prop("sales_use_product_suit_version",
                                                                ibas.strings.isEmpty(selected.name) ? selected.code : selected.name, pItem.version),
                                                            actions: [
                                                                ibas.emMessageAction.YES,
                                                                ibas.emMessageAction.NO
                                                            ],
                                                            /** 调用完成 */
                                                            onCompleted(action: ibas.emMessageAction): void {
                                                                if (action !== ibas.emMessageAction.YES) {
                                                                    // 不是用继续下一条
                                                                    fillSuit(sIndex + 1);
                                                                    return;
                                                                }
                                                                try {
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
                                                                    if (ibas.objects.isNull(parentItem)) {
                                                                        parentItem = that.editData.salesQuoteItems.create();
                                                                    }
                                                                    // 父项
                                                                    parentItem.lineSign = ibas.uuids.random();
                                                                    parentItem.itemCode = pItem.extend.code;
                                                                    parentItem.itemDescription = pItem.extend.name;
                                                                    parentItem.serialManagement = pItem.extend.serialManagement;
                                                                    parentItem.batchManagement = pItem.extend.batchManagement;
                                                                    parentItem.warehouse = pItem.extend.warehouse;
                                                                    parentItem.quantity = 1;
                                                                    parentItem.uom = pItem.extend.inventoryUOM;
                                                                    parentItem.price = selected.price;
                                                                    parentItem.currency = selected.currency;
                                                                    // 子项
                                                                    for (let sItem of pItem.productSuitItems) {
                                                                        let subItem: bo.SalesQuoteItem = that.editData.salesQuoteItems.create();
                                                                        // 构建父项关系
                                                                        subItem.lineSign = ibas.uuids.random();
                                                                        subItem.parentLineSign = parentItem.lineSign;
                                                                        // 计算单位数量
                                                                        subItem.basisQuantity = sItem.quantity / pItem.unitQuantity;
                                                                        subItem.price = sItem.price;
                                                                        subItem.currency = sItem.currency;
                                                                        // 基本信息赋值
                                                                        subItem.itemCode = sItem.extend.code;
                                                                        subItem.itemDescription = sItem.extend.name;
                                                                        subItem.serialManagement = sItem.extend.serialManagement;
                                                                        subItem.batchManagement = sItem.extend.batchManagement;
                                                                        subItem.warehouse = sItem.extend.warehouse;
                                                                        subItem.quantity = subItem.basisQuantity;
                                                                        subItem.uom = sItem.extend.inventoryUOM;
                                                                    }
                                                                    created = true;
                                                                    // 超出索引，结束询问
                                                                    fillSuit(selecteds.length);
                                                                } catch (error) {
                                                                    that.messages(error);
                                                                    that.view.showSalesQuoteItems(that.editData.salesQuoteItems.filterDeleted());
                                                                }
                                                            }
                                                        });
                                                    }
                                                };
                                                fillSuit(0);
                                            } catch (error) {
                                                that.messages(error);
                                                that.view.showSalesQuoteItems(that.editData.salesQuoteItems.filterDeleted());
                                            }
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
                                        if (!item.isNew) {
                                            item.delete();
                                            item = null;
                                        }
                                    }
                                    if (ibas.objects.isNull(item)) {
                                        item = that.editData.salesQuoteItems.create();
                                        created = true;
                                    }
                                    item.itemCode = selected.code;
                                    item.itemDescription = selected.name;
                                    item.serialManagement = selected.serialManagement;
                                    item.batchManagement = selected.batchManagement;
                                    item.warehouse = selected.warehouse;
                                    item.quantity = 1;
                                    item.uom = selected.inventoryUOM;
                                    item.price = selected.price;
                                    item.currency = selected.currency;
                                    item = null;
                                    fill(index + 1);
                                }
                            }
                        };
                        fill(0);
                    }
                });
            }
            /** 添加销售报价-行事件 */
            private addSalesQuoteItem(): void {
                this.editData.salesQuoteItems.create();
                // 仅显示没有标记删除的
                this.view.showSalesQuoteItems(this.editData.salesQuoteItems.filterDeleted());
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
                app.run(data);
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
            /** 选择销售报价价格清单事件 */
            chooseSalesQuotePriceListEvent: Function;
            /** 选择销售报价行物料事件 */
            chooseSalesQuoteItemMaterialEvent: Function;
            /** 选择销售报价仓库事件 */
            chooseSalesQuoteItemWarehouseEvent: Function;
            /** 显示销售报价额外信息事件 */
            showSalesQuoteItemExtraEvent: Function;
        }
    }
}