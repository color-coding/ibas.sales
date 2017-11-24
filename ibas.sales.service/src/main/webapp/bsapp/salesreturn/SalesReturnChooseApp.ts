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
import { SalesReturnEditApp } from "./SalesReturnEditApp";

/** 选择应用-销售退货 */
export class SalesReturnChooseApp extends ibas.BOChooseService<ISalesReturnChooseView, bo.SalesReturn> {

    /** 应用标识 */
    static APPLICATION_ID: string = "ddecb910-4a70-43c8-a874-71e5a2f697ea";
    /** 应用名称 */
    static APPLICATION_NAME: string = "sales_app_salesreturn_choose";
    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = bo.SalesReturn.BUSINESS_OBJECT_CODE;
    /** 构造函数 */
    constructor() {
        super();
        this.id = SalesReturnChooseApp.APPLICATION_ID;
        this.name = SalesReturnChooseApp.APPLICATION_NAME;
        this.boCode = SalesReturnChooseApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
    }
    /** 查询数据 */
    protected fetchData(criteria: ibas.ICriteria): void {
        this.busy(true);
        let that: this = this;
        let boRepository: BORepositorySales = new BORepositorySales();
        boRepository.fetchSalesReturn({
            criteria: criteria,
            onCompleted(opRslt: ibas.IOperationResult<bo.SalesReturn>): void {
                try {
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    if (opRslt.resultObjects.length === 1
                        && ibas.config.get(ibas.CONFIG_ITEM_AUTO_CHOOSE_DATA, true)) {
                        // 仅一条数据，直接选择
                        that.chooseData(opRslt.resultObjects);
                    } else {
                        if (!that.isViewShowed()) {
                            // 没显示视图，先显示
                            that.show();
                        }
                        that.view.showData(opRslt.resultObjects);
                        that.busy(false);
                    }
                } catch (error) {
                    that.messages(error);
                }
            }
        });
        this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
    }
    /** 新建数据 */
    protected newData(): void {
        // 关闭自身
        this.destroy();
        // 调用编辑应用
        let app: SalesReturnEditApp = new SalesReturnEditApp();
        app.navigation = this.navigation;
        app.viewShower = this.viewShower;
        app.run();
    }
}
/** 视图-销售退货 */
export interface ISalesReturnChooseView extends ibas.IBOChooseView {
    /** 显示数据 */
    showData(datas: bo.SalesReturn[]): void;
}
/** 销售退货选择服务映射 */
export class SalesReturnChooseServiceMapping extends ibas.BOChooseServiceMapping {
    /** 构造函数 */
    constructor() {
        super();
        this.id = SalesReturnChooseApp.APPLICATION_ID;
        this.name = SalesReturnChooseApp.APPLICATION_NAME;
        this.boCode = SalesReturnChooseApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 创建服务并运行 */
    create(): ibas.IService<ibas.IServiceContract> {
        return new SalesReturnChooseApp();
    }
}
