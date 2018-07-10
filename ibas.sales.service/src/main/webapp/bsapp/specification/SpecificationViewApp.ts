/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 查看应用-规格模板 */
        export class SpecificationViewApp extends ibas.BOViewService<ISpecificationViewView, bo.Specification> {

            /** 应用标识 */
            static APPLICATION_ID: string = "9969b8e3-dc26-41a7-9c38-0d9ea7bff68b";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_specification_view";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.Specification.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = SpecificationViewApp.APPLICATION_ID;
                this.name = SpecificationViewApp.APPLICATION_NAME;
                this.boCode = SpecificationViewApp.BUSINESS_OBJECT_CODE;
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
            }
            /** 编辑数据，参数：目标数据 */
            protected editData(): void {
                let app: SpecificationEditApp = new SpecificationEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(this.viewData);
            }
            run(): void;
            run(data: bo.Specification): void;
            /** 运行 */
            run(): void {
                if (ibas.objects.instanceOf(arguments[0], bo.Specification)) {
                    this.viewData = arguments[0];
                    this.show();
                } else {
                    super.run.apply(this, arguments);
                }
            }
            protected viewData: bo.Specification;
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
                boRepository.fetchSpecification({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.Specification>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            that.viewData = opRslt.resultObjects.firstOrDefault();
                            if (!that.isViewShowed()) {
                                // 没显示视图，先显示
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
        /** 视图-规格模板 */
        export interface ISpecificationViewView extends ibas.IBOViewView {

        }
        /** 规格模板连接服务映射 */
        export class SpecificationLinkServiceMapping extends ibas.BOLinkServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = SpecificationViewApp.APPLICATION_ID;
                this.name = SpecificationViewApp.APPLICATION_NAME;
                this.boCode = SpecificationViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IBOLinkService {
                return new SpecificationViewApp();
            }
        }
    }
}
