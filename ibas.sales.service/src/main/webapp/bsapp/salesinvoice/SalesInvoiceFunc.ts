/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class SalesInvoiceFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "372982ed-87cc-406f-9619-11aae31878aa";
            /** 功能名称 */
            static FUNCTION_NAME = "sales_func_salesinvoice";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesInvoiceFunc.FUNCTION_ID;
                this.name = SalesInvoiceFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: SalesInvoiceListApp = new SalesInvoiceListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}