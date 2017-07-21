/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { ProductSuitListApp } from "./ProductSuitListApp";

export class ProductSuitFunc extends ibas.ModuleFunction {

    /** 功能标识 */
    static FUNCTION_ID = "0879f2e7-b06d-421e-9bcc-c68026a8fd3c";
    /** 功能名称 */
    static FUNCTION_NAME = "sales_func_productsuit";
    /** 构造函数 */
    constructor() {
        super();
        this.id = ProductSuitFunc.FUNCTION_ID;
        this.name = ProductSuitFunc.FUNCTION_NAME;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 默认功能 */
    default(): ibas.IApplication<ibas.IView> {
        let app: ProductSuitListApp = new ProductSuitListApp();
        app.navigation = this.navigation;
        return app;
    }
}
