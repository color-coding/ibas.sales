/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 查看应用-产品套装 */
        export class ProductSuitViewApp extends ibas.BOViewService<IProductSuitViewView, bo.ProductSuit> {

            /** 应用标识 */
            static APPLICATION_ID: string = "56b4e476-f122-44e4-bc74-976b40965f0e";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_productsuit_view";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.ProductSuit.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = ProductSuitViewApp.APPLICATION_ID;
                this.name = ProductSuitViewApp.APPLICATION_NAME;
                this.boCode = ProductSuitViewApp.BUSINESS_OBJECT_CODE;
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
            }
            /** 编辑数据，参数：目标数据 */
            protected editData(): void {
                let app: ProductSuitEditApp = new ProductSuitEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(this.viewData);
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.ProductSuit): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.ProductSuit)) {
                    let data: bo.ProductSuit = arguments[0];
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
                        boRepository.fetchProductSuit({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.ProductSuit>): void {
                                let data: bo.ProductSuit;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.ProductSuit)) {
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
                    // 添加查询条件

                }
                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                boRepository.fetchProductSuit({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.ProductSuit>): void {
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
        /** 视图-产品套装 */
        export interface IProductSuitViewView extends ibas.IBOViewView {

        }
        /** 产品套装连接服务映射 */
        export class ProductSuitLinkServiceMapping extends ibas.BOLinkServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = ProductSuitViewApp.APPLICATION_ID;
                this.name = ProductSuitViewApp.APPLICATION_NAME;
                this.boCode = ProductSuitViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOLinkServiceCaller> {
                return new ProductSuitViewApp();
            }
        }
    }
}