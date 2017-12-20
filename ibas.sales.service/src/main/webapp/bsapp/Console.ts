/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { CONSOLE_ID, CONSOLE_NAME, CONSOLE_VERSION } from "../api/index";
import { ProductSuitFunc, ProductSuitChooseServiceMapping, ProductSuitLinkServiceMapping } from "./productsuit/index";
import { SalesDeliveryFunc, SalesDeliveryChooseServiceMapping, SalesDeliveryLinkServiceMapping } from "./salesdelivery/index";
import { SalesOrderFunc, SalesOrderChooseServiceMapping, SalesOrderLinkServiceMapping } from "./salesorder/index";
import { SalesReturnFunc, SalesReturnChooseServiceMapping, SalesReturnLinkServiceMapping } from "./salesreturn/index";

/** 模块控制台 */
export class Console extends ibas.ModuleConsole {
    /** 构造函数 */
    constructor() {
        super();
        this.id = CONSOLE_ID;
        this.name = CONSOLE_NAME;
        this.version = CONSOLE_VERSION;
        this.copyright = ibas.i18n.prop("shell_license");
    }
    private _navigation: ibas.IViewNavigation;
    /** 创建视图导航 */
    navigation(): ibas.IViewNavigation {
        return this._navigation;
    }
    /** 初始化 */
    protected registers(): void {
        // 注册功能
        this.register(new SalesOrderFunc());
        this.register(new SalesDeliveryFunc());
        this.register(new SalesReturnFunc());
        this.register(new ProductSuitFunc());
        // 注册服务应用
        this.register(new ProductSuitChooseServiceMapping());
        this.register(new ProductSuitLinkServiceMapping());
        this.register(new SalesDeliveryChooseServiceMapping());
        this.register(new SalesDeliveryLinkServiceMapping());
        this.register(new SalesOrderChooseServiceMapping());
        this.register(new SalesOrderLinkServiceMapping());
        this.register(new SalesReturnChooseServiceMapping());
        this.register(new SalesReturnLinkServiceMapping());
        // 注册常驻应用

    }
    /** 运行 */
    run(): void {
        // 加载语言-框架默认
        ibas.i18n.load(this.rootUrl + "resources/languages/sales.json");
        ibas.i18n.load(this.rootUrl + "resources/languages/enums.json");
        ibas.i18n.load(this.rootUrl + "resources/languages/bo/productsuit.json");
        ibas.i18n.load(this.rootUrl + "resources/languages/bo/salesdelivery.json");
        ibas.i18n.load(this.rootUrl + "resources/languages/bo/salesorder.json");
        ibas.i18n.load(this.rootUrl + "resources/languages/bo/salesreturn.json");
        // 设置资源属性
        this.description = ibas.i18n.prop(this.name.toLowerCase());
        this.icon = ibas.i18n.prop(this.name.toLowerCase() + "_icon");
        // 先加载ui导航
        let uiModules: string[] = [];
        if (!ibas.config.get(ibas.CONFIG_ITEM_DISABLE_PLATFORM_VIEW, false)
            && this.plantform === ibas.emPlantform.PHONE) {
            // 使用m类型视图
            uiModules.push("../bsui/m/Navigation");
        } else {
            // 使用c类型视图
            uiModules.push("../bsui/c/Navigation");
        }
        let that: this = this;
        require(uiModules, function (ui: any): void {
            // 设置导航
            that._navigation = new ui.default();
            // 调用初始化
            that.initialize();
        });
        // 保留基类方法
        super.run();
    }
}
