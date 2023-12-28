/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class SalesReserveInvoiceFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "8d150c63-dfed-44f6-94b1-cd8873913714";
            /** 功能名称 */
            static FUNCTION_NAME = "sales_func_salesreserveinvoice";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReserveInvoiceFunc.FUNCTION_ID;
                this.name = SalesReserveInvoiceFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: SalesReserveInvoiceListApp = new SalesReserveInvoiceListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}