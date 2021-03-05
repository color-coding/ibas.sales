/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 查看应用-销售贷项 */
        export class SalesCreditNoteViewApp extends ibas.BOViewService<ISalesCreditNoteViewView, bo.SalesCreditNote> {

            /** 应用标识 */
            static APPLICATION_ID: string = "d7c57be2-6cef-4851-995b-8b0cbb4be6a8";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_salescreditnote_view";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.SalesCreditNote.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesCreditNoteViewApp.APPLICATION_ID;
                this.name = SalesCreditNoteViewApp.APPLICATION_NAME;
                this.boCode = SalesCreditNoteViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.editDataEvent = this.editData;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.viewData)) {
                    // 创建编辑对象实例
                    this.viewData = new bo.SalesCreditNote();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showSalesCreditNote(this.viewData);
                this.view.showSalesCreditNoteItems(this.viewData.salesCreditNoteItems.filterDeleted());
                this.view.showShippingAddresses(this.viewData.shippingAddresss.filterDeleted());
            }
            /** 编辑数据，参数：目标数据 */
            protected editData(): void {
                let app: SalesCreditNoteEditApp = new SalesCreditNoteEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(this.viewData);
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
                        that.viewData = data;
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
                                    that.viewData = data;
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
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria | string): void {
                this.busy(true);
                let that: this = this;
                if (typeof criteria === "string") {
                    let value: string = criteria;
                    criteria = new ibas.Criteria();
                    criteria.result = 1;
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = bo.SalesCreditNote.PROPERTY_DOCENTRY_NAME;
                    condition.value = value;
                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchSalesCreditNote({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesCreditNote>): void {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            that.viewData = opRslt.resultObjects.firstOrDefault();
                            if (!that.isViewShowed()) {
                                that.show();
                            } else {
                                that.viewShowed();
                            }
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
        }
        /** 视图-销售贷项 */
        export interface ISalesCreditNoteViewView extends ibas.IBOViewView {
            showSalesCreditNote(viewData: bo.SalesCreditNote): void;
            showSalesCreditNoteItems(salesCreditNoteItem: bo.SalesCreditNoteItem[]): void;
            showShippingAddresses(datas: bo.ShippingAddress[]): void;
        }
        /** 销售贷项连接服务映射 */
        export class SalesCreditNoteLinkServiceMapping extends ibas.BOLinkServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesCreditNoteViewApp.APPLICATION_ID;
                this.name = SalesCreditNoteViewApp.APPLICATION_NAME;
                this.boCode = SalesCreditNoteViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOLinkServiceCaller> {
                return new SalesCreditNoteViewApp();
            }
        }
    }
}