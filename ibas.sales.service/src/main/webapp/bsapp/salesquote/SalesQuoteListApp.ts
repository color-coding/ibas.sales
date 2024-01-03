/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 列表应用-销售报价 */
        export class SalesQuoteListApp extends ibas.BOListApplication<ISalesQuoteListView, bo.SalesQuote> {
            /** 应用标识 */
            static APPLICATION_ID: string = "18f1655d-a3a8-4f6b-b6bb-7db91e6167ce";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salesquote_list";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesQuote.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesQuoteListApp.APPLICATION_ID;
                this.name = SalesQuoteListApp.APPLICATION_NAME;
                this.boCode = SalesQuoteListApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.editDataEvent = this.editData;
                this.view.deleteDataEvent = this.deleteData;
                this.view.reserveMaterialsInventoryEvent = this.reserveMaterialsInventory;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
            }
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void {
                this.busy(true);
                if (!ibas.objects.isNull(criteria)) {
                    criteria.noChilds = true;
                }
                let that: this = this;
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesQuote({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesQuote>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_fetched_none"));
                            }
                            that.view.showData(opRslt.resultObjects);
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
            /** 新建数据 */
            protected newData(): void {
                let app: SalesQuoteEditApp = new SalesQuoteEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run();
            }
            /** 查看数据，参数：目标数据 */
            protected viewData(data: bo.SalesQuote): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_view")
                    ));
                    return;
                }
                let app: SalesQuoteViewApp = new SalesQuoteViewApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(data);

            }
            /** 编辑数据，参数：目标数据 */
            protected editData(data: bo.SalesQuote): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_edit")
                    ));
                    return;
                }
                let app: SalesQuoteEditApp = new SalesQuoteEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(data);
            }
            /** 删除数据，参数：目标数据集合 */
            protected deleteData(data: bo.SalesQuote | bo.SalesQuote[]): void {
                let beDeleteds: ibas.IList<bo.SalesQuote> = ibas.arrays.create(data);
                // 没有选择删除的对象
                if (beDeleteds.length === 0) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_delete")
                    ));
                    return;
                }
                // 标记删除对象
                beDeleteds.forEach((value) => {
                    value.delete();
                });
                let that: this = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_multiple_data_delete_continue", beDeleteds.length),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action !== ibas.emMessageAction.YES) {
                            return;
                        }
                        let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                        ibas.queues.execute(beDeleteds, (data, next) => {
                            // 处理数据
                            boRepository.saveSalesQuote({
                                beSaved: data,
                                onCompleted(opRslt: ibas.IOperationResult<bo.SalesQuote>): void {
                                    if (opRslt.resultCode !== 0) {
                                        next(new Error(ibas.i18n.prop("shell_data_delete_error", data, opRslt.message)));
                                    } else {
                                        next();
                                    }
                                }
                            });
                            that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_deleting", data));
                        }, (error) => {
                            // 处理完成
                            if (error instanceof Error) {
                                that.messages(ibas.emMessageType.ERROR, error.message);
                            } else {
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                            }
                            that.busy(false);
                        });
                        that.busy(true);
                    }
                });
            }
            /** 预留物料库存 */
            private reserveMaterialsInventory(datas: bo.SalesQuote[]): void {
                let criteria: ibas.Criteria = new ibas.Criteria();
                for (let data of datas) {
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = bo.SalesQuote.PROPERTY_DOCENTRY_NAME;
                    condition.value = data.docEntry.toString();
                    condition.relationship = ibas.emConditionRelationship.OR;
                }
                if (criteria.conditions.length > 0) {
                    let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                    boRepository.fetchSalesQuote({
                        criteria: criteria,
                        onCompleted: (opRslt) => {
                            try {
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                let contracts: ibas.IList<materials.app.IMaterialInventoryReservationTarget> = new ibas.ArrayList<materials.app.IMaterialInventoryReservationTarget>();
                                for (let data of opRslt.resultObjects) {
                                    let contract: materials.app.IMaterialInventoryReservationTarget = {
                                        targetType: data.objectCode,
                                        targetEntry: data.docEntry,
                                        businessPartner: ibas.strings.format("{1} ({0})", data.customerCode, data.customerName),
                                        items: []
                                    };
                                    for (let item of data.salesQuoteItems) {
                                        contract.items.push({
                                            targetLineId: item.lineId,
                                            itemCode: item.itemCode,
                                            itemDescription: item.itemDescription,
                                            itemVersion: item.itemVersion,
                                            warehouse: item.warehouse,
                                            quantity: item.quantity,
                                            uom: item.uom
                                        });
                                    }
                                    contracts.add(contract);
                                }
                                if (contracts.length > 0) {
                                    ibas.servicesManager.runApplicationService<materials.app.IMaterialInventoryReservationTarget | materials.app.IMaterialInventoryReservationTarget[]>({
                                        proxy: new materials.app.MaterialInventoryReservationServiceProxy(contracts)
                                    });
                                } else {
                                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_fetched_none"));
                                }
                            } catch (error) {
                                this.messages(error);
                            }
                        }
                    });
                } else {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_fetched_none"));
                }
            }
        }
        /** 视图-销售报价 */
        export interface ISalesQuoteListView extends ibas.IBOListView {
            /** 编辑数据事件，参数：编辑对象 */
            editDataEvent: Function;
            /** 删除数据事件，参数：删除对象集合 */
            deleteDataEvent: Function;
            /** 显示数据 */
            showData(datas: bo.SalesQuote[]): void;
            /** 预留物料库存 */
            reserveMaterialsInventoryEvent: Function;
        }
    }
}