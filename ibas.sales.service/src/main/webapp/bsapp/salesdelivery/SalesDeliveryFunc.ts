/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { SalesDeliveryListApp } from "./SalesDeliveryListApp";

export class SalesDeliveryFunc extends ibas.ModuleFunction {

    /** 功能标识 */
    static FUNCTION_ID = "29cf5fda-5319-4475-98ab-63727e254b70";
    /** 功能名称 */
    static FUNCTION_NAME = "sales_func_salesdelivery";
    /** 构造函数 */
    constructor() {
        super();
        this.id = SalesDeliveryFunc.FUNCTION_ID;
        this.name = SalesDeliveryFunc.FUNCTION_NAME;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 默认功能 */
    default(): ibas.IApplication<ibas.IView> {
        let app: SalesDeliveryListApp = new SalesDeliveryListApp();
        app.navigation = this.navigation;
        return app;
    }
}
