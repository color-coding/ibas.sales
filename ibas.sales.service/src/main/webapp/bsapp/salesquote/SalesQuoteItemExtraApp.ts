/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 列表应用-销售报价项目-额外 */
        export class SalesQuoteItemExtraApp extends ibas.Application<ISalesQuoteItemExtraView> {
            /** 应用标识 */
            static APPLICATION_ID: string = "86cff8c9-4582-41c6-83bf-34cea47c8835";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesquote_extra_list";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesQuoteItemExtraApp.APPLICATION_ID;
                this.name = SalesQuoteItemExtraApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.addSalesQuoteItemExtraEvent = this.addSalesQuoteItemExtra;
                this.view.removeSalesQuoteItemExtraEvent = this.removeSalesQuoteItemExtra;
                this.view.deleteSalesQuoteItemExtraEvent = this.deleteSalesQuoteItemExtra;
                this.view.viewSalesQuoteItemExtraEvent = this.viewSalesQuoteItemExtra;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                this.view.showData(this.editData);
                this.view.showExtraDatas(this.editData.salesQuoteItemExtras.filterDeleted());
            }
            run(): void;
            run(data: bo.SalesQuoteItem, parent?: bo.SalesQuote): void;
            run(): void {
                let data: bo.SalesQuoteItem = arguments[0];
                if (data instanceof bo.SalesQuoteItem) {
                    this.editData = data;
                    if (arguments[1] instanceof bo.SalesQuote) {
                        this.dataParent = arguments[1];
                    }
                    super.run();
                } else {
                    throw new Error(ibas.i18n.prop("sys_unrecognized_data"));
                }
            }
            private editData: bo.SalesQuoteItem;
            private dataParent: bo.SalesQuote;
            /** 添加销售报价-行事件 */
            private addSalesQuoteItemExtra(type: string | FormData): void {
                if (type === materials.bo.MaterialSpecification.BUSINESS_OBJECT_CODE) {
                    let that: this = this;
                    this.messages({
                        type: ibas.emMessageType.QUESTION,
                        message: ibas.i18n.prop("sales_create_continue", ibas.i18n.prop("bo_materialspecification")),
                        actions: [
                            ibas.emMessageAction.YES,
                            ibas.emMessageAction.NO
                        ],
                        /** 调用完成 */
                        onCompleted(action: ibas.emMessageAction): void {
                            if (action === ibas.emMessageAction.YES) {
                                ibas.servicesManager.runApplicationService<materials.app.ISpecificationTreeContract, materials.bo.MaterialSpecification>({
                                    proxy: new materials.app.SpecificationTreeServiceProxy({
                                        target: that.editData.itemCode,
                                        customer: that.dataParent ? that.dataParent.customerCode : undefined,
                                        project: that.dataParent ? that.dataParent.project : undefined,
                                    }),
                                    onCompleted(result: materials.bo.MaterialSpecification): void {
                                        let item: bo.SalesQuoteItemExtra = that.editData.salesQuoteItemExtras.create();
                                        item.extraType = result.objectCode;
                                        item.extraKey = result.objectKey;
                                        item.quantity = that.editData.quantity;
                                        that.view.showExtraDatas(that.editData.salesQuoteItemExtras.filterDeleted());
                                    }
                                });
                            } else {
                                ibas.servicesManager.runChooseService<materials.bo.IMaterialSpecification>({
                                    boCode: materials.bo.BO_CODE_MATERIALSPECIFICATION,
                                    criteria: [
                                        new ibas.Condition(materials.bo.MaterialSpecification.PROPERTY_OBJECTKEY_NAME, ibas.emConditionOperation.GRATER_THAN, "0"),
                                    ],
                                    onCompleted(selecteds: ibas.IList<materials.bo.IMaterialSpecification>): void {
                                        for (let selected of selecteds) {
                                            let item: bo.SalesQuoteItemExtra = that.editData.salesQuoteItemExtras.create();
                                            item.extraType = selected.objectCode;
                                            item.extraKey = selected.objectKey;
                                            item.quantity = that.editData.quantity;
                                        }
                                        that.view.showExtraDatas(that.editData.salesQuoteItemExtras.filterDeleted());
                                    }
                                });

                            }
                        }
                    });
                } else if (type === materials.bo.MaterialVersion.BUSINESS_OBJECT_CODE) {
                    let that: this = this;
                    ibas.servicesManager.runChooseService<materials.bo.MaterialVersion>({
                        boCode: materials.bo.MaterialVersion.BUSINESS_OBJECT_CODE,
                        criteria: [
                            new ibas.Condition(materials.bo.MaterialVersion.PROPERTY_ITEMCODE_NAME, ibas.emConditionOperation.EQUAL, this.editData.itemCode),
                            new ibas.Condition(materials.bo.MaterialVersion.PROPERTY_ACTIVATED_NAME, ibas.emConditionOperation.EQUAL, ibas.emYesNo.YES),
                        ],
                        onCompleted(selecteds: ibas.IList<materials.bo.MaterialVersion>): void {
                            for (let selected of selecteds) {
                                let item: bo.SalesQuoteItemExtra = that.editData.salesQuoteItemExtras.create();
                                item.extraType = selected.objectCode;
                                item.extraKey = selected.objectKey;
                                item.note = selected.name;
                                item.quantity = that.editData.quantity;
                            }
                            that.view.showExtraDatas(that.editData.salesQuoteItemExtras.filterDeleted());
                        }
                    });
                } else if (type instanceof FormData) {
                    let that: this = this;
                    let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                    boRepository.upload({
                        fileData: type,
                        onCompleted(opRslt: ibas.IOperationResult<ibas.FileData>): void {
                            try {
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                that.proceeding(ibas.emMessageType.INFORMATION,
                                    ibas.i18n.prop("shell_upload") + ibas.i18n.prop("shell_sucessful"));
                                let fileData: ibas.FileData = opRslt.resultObjects.firstOrDefault();
                                let item: bo.SalesQuoteItemExtra = that.editData.salesQuoteItemExtras.create();
                                item.extraType = EXTRA_ATTACHMENT;
                                item.extraKey = -1;
                                item.note = fileData.fileName;
                                item.quantity = 1;
                                that.view.showExtraDatas(that.editData.salesQuoteItemExtras.filterDeleted());
                            } catch (error) {
                                that.messages(error);
                            }
                        }
                    });
                } else {
                    this.editData.salesQuoteItemExtras.create();
                    // 仅显示没有标记删除的
                    this.view.showExtraDatas(this.editData.salesQuoteItemExtras.filterDeleted());
                }
            }
            /** 删除销售报价-行事件 */
            private removeSalesQuoteItemExtra(items: bo.SalesQuoteItemExtra[]): void {
                // 非数组，转为数组
                if (!(items instanceof Array)) {
                    items = [items];
                }
                if (items.length === 0) {
                    return;
                }
                // 移除项目
                for (let item of items) {
                    if (this.editData.salesQuoteItemExtras.indexOf(item) >= 0) {
                        if (item.isNew) {
                            // 新建的移除集合
                            this.editData.salesQuoteItemExtras.remove(item);
                        } else {
                            // 非新建标记删除
                            item.delete();
                        }
                    }
                }
                // 仅显示没有标记删除的
                this.view.showExtraDatas(this.editData.salesQuoteItemExtras.filterDeleted());
            }
            private deleteSalesQuoteItemExtra(data: bo.SalesQuoteItemExtra): void {
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_delete")
                    ));
                    return;
                }
                if (!ibas.objects.isNull(data.extraKey)) {
                    if (data.extraType === ibas.config.applyVariables(materials.bo.MaterialSpecification.BUSINESS_OBJECT_CODE)) {
                        this.busy(true);
                        let criteria: ibas.ICriteria = new ibas.Criteria();
                        criteria.result = 1;
                        let condition: ibas.ICondition = criteria.conditions.create();
                        condition.alias = materials.bo.MaterialSpecification.PROPERTY_OBJECTKEY_NAME;
                        condition.value = data.extraKey.toString();
                        let that: this = this;
                        let boRepository: materials.bo.BORepositoryMaterials = new materials.bo.BORepositoryMaterials();
                        boRepository.fetchMaterialSpecification({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<materials.bo.MaterialSpecification>): void {
                                try {
                                    that.busy(false);
                                    if (opRslt.resultCode !== 0) {
                                        throw new Error(opRslt.message);
                                    }
                                    for (let item of opRslt.resultObjects) {
                                        that.messages({
                                            type: ibas.emMessageType.QUESTION,
                                            message: ibas.i18n.prop("sales_delete_continue",
                                                ibas.i18n.prop("bo_materialspecification"), ibas.strings.isEmpty(item.name) ? item.objectKey : item.name),
                                            actions: [
                                                ibas.emMessageAction.YES,
                                                ibas.emMessageAction.NO
                                            ],
                                            /** 调用完成 */
                                            onCompleted(action: ibas.emMessageAction): void {
                                                if (action !== ibas.emMessageAction.YES) {
                                                    return;
                                                }
                                                item.delete();
                                                boRepository.saveMaterialSpecification({
                                                    beSaved: item,
                                                    onCompleted(opRslt: ibas.IOperationResult<materials.bo.MaterialSpecification>): void {
                                                        try {
                                                            that.busy(false);
                                                            if (opRslt.resultCode !== 0) {
                                                                throw new Error(opRslt.message);
                                                            }
                                                        } catch (error) {
                                                            that.proceeding(error);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                } catch (error) {
                                    that.proceeding(error);
                                }
                            }
                        });
                    }
                }
                this.removeSalesQuoteItemExtra([data]);
            }
            private viewSalesQuoteItemExtra(data: bo.SalesQuoteItemExtra): void {
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_view")
                    ));
                    return;
                }
                if (data.extraType === ibas.config.applyVariables(materials.bo.MaterialSpecification.BUSINESS_OBJECT_CODE)) {
                    let done: boolean = ibas.servicesManager.runLinkService({
                        boCode: data.extraType,
                        linkValue: ibas.strings.valueOf(data.extraKey)
                    });
                    if (done) {
                        this.close();
                    }
                } else if (data.extraType === ibas.config.applyVariables(materials.bo.MaterialVersion.BUSINESS_OBJECT_CODE)) {
                    let done: boolean = ibas.servicesManager.runLinkService({
                        boCode: data.extraType,
                        linkValue: ibas.strings.valueOf(data.extraKey)
                    });
                    if (done) {
                        this.close();
                    }
                } else if (data.extraType === EXTRA_ATTACHMENT) {
                    let criteria: ibas.ICriteria = new ibas.Criteria();
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = ibas.CRITERIA_CONDITION_ALIAS_FILE_NAME;
                    condition.value = data.note;
                    let that: this = this;
                    let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                    boRepository.download({
                        criteria: criteria,
                        onCompleted(opRslt: ibas.IOperationResult<Blob>): void {
                            try {
                                that.busy(false);
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                let data: Blob = opRslt.resultObjects.firstOrDefault();
                                if (!ibas.objects.isNull(data)) {
                                    ibas.files.save(data, ibas.strings.format("{0}_{1}_{2}_{3}",
                                        ibas.objects.nameOf(that.editData), that.editData.docEntry, that.editData.lineId, condition.value));
                                }
                            } catch (error) {
                                that.messages(error);
                            }
                        }
                    });
                } else {
                    throw new Error(ibas.i18n.prop("sales_unrecognized_extra_information", data));
                }
            }
        }
        /** 视图-销售报价项目-额外 */
        export interface ISalesQuoteItemExtraView extends ibas.IBOView {
            /** 显示数据 */
            showData(data: bo.SalesQuoteItem): void;
            /** 显示额外数据 */
            showExtraDatas(datas: bo.SalesQuoteItemExtra[]): void;
            /** 添加销售报价-行额外 事件 */
            addSalesQuoteItemExtraEvent: Function;
            /** 移出销售报价-行额外 事件 */
            removeSalesQuoteItemExtraEvent: Function;
            /** 删除销售报价-行额外 事件 */
            deleteSalesQuoteItemExtraEvent: Function;
            /** 查看销售报价-行额外 事件 */
            viewSalesQuoteItemExtraEvent: Function;
        }
        /** 权限元素-销售报价扩展 */
        export const ELEMENT_SALES_QUOTE_EXTRA: ibas.IElement = {
            id: SalesQuoteItemExtraApp.APPLICATION_ID,
            name: SalesQuoteItemExtraApp.APPLICATION_NAME,
        };
    }
}