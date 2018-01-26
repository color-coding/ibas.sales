/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "../../borep/bo/index";
import { BORepositorySales } from "../../borep/BORepositories";
import { DataConverter4SL } from "../../borep/DataConverters";
import { SalesOrderEditApp } from "./SalesOrderEditApp";

/** 查看应用-销售订单 */
export class SalesOrderViewApp extends ibas.BOViewService<ISalesOrderViewView> {

    /** 应用标识 */
    static APPLICATION_ID: string = "bf2f3626-faee-4948-9e08-c8291ba4c262";
    /** 应用名称 */
    static APPLICATION_NAME: string = "sales_app_salesorder_view";
    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = bo.SalesOrder.BUSINESS_OBJECT_CODE;
    /** 构造函数 */
    constructor() {
        super();
        this.id = SalesOrderViewApp.APPLICATION_ID;
        this.name = SalesOrderViewApp.APPLICATION_NAME;
        this.boCode = SalesOrderViewApp.BUSINESS_OBJECT_CODE;
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
        if (ibas.objects.isNull(this.viewData)) {
            // 创建编辑对象实例
            this.viewData = new bo.SalesOrder();
            this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
        }
        this.view.showSalesOrder(this.viewData);
        this.view.showSalesOrderItems(this.viewData.salesOrderItems.filterDeleted());
    }
    /** 编辑数据，参数：目标数据 */
    protected editData(): void {
        let app: SalesOrderEditApp = new SalesOrderEditApp();
        app.navigation = this.navigation;
        app.viewShower = this.viewShower;
        app.run(this.viewData);
    }
    /** 运行,覆盖原方法 */
    run(): void;
    run(data: bo.SalesOrder): void;
    run(): void {
        let that: this = this;
        if (ibas.objects.instanceOf(arguments[0], bo.SalesOrder)) {
            let data: bo.SalesOrder = arguments[0];
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
                let boRepository: BORepositorySales = new BORepositorySales();
                boRepository.fetchSalesOrder({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesOrder>): void {
                        let data: bo.SalesOrder;
                        if (opRslt.resultCode === 0) {
                            data = opRslt.resultObjects.firstOrDefault();
                        }
                        if (ibas.objects.instanceOf(data, bo.SalesOrder)) {
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
    private viewData: bo.SalesOrder;
    /** 查询数据 */
    protected fetchData(criteria: ibas.ICriteria | string): void {
        this.busy(true);
        let that: this = this;
        if (typeof criteria === "string") {
            criteria = new ibas.Criteria();
            // 添加查询条件
        }
        let boRepository: BORepositorySales = new BORepositorySales();
        boRepository.fetchSalesOrder({
            criteria: criteria,
            onCompleted(opRslt: ibas.IOperationResult<bo.SalesOrder>): void {
                try {
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    that.viewData = opRslt.resultObjects.firstOrDefault();
                    that.viewShowed();
                } catch (error) {
                    that.messages(error);
                }
            }
        });
        this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
    }
    /** 获取服务的契约 */
    protected getServiceProxies(): ibas.IServiceProxy<ibas.IServiceContract>[] {
        return [];
    }
}
/** 视图-销售订单 */
export interface ISalesOrderViewView extends ibas.IBOViewView {
    showSalesOrder(viewData: bo.SalesOrder): void;
    showSalesOrderItems(salesOrderItems: bo.SalesOrderItem[]): void;
}
/** 销售订单连接服务映射 */
export class SalesOrderLinkServiceMapping extends ibas.BOLinkServiceMapping {
    /** 构造函数 */
    constructor() {
        super();
        this.id = SalesOrderViewApp.APPLICATION_ID;
        this.name = SalesOrderViewApp.APPLICATION_NAME;
        this.boCode = SalesOrderViewApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 创建服务实例 */
    create(): ibas.IService<ibas.IBOLinkServiceCaller> {
        return new SalesOrderViewApp();
    }
}
