/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class SalesReturnFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "367d4759-a8fe-4c58-8436-2d56ba06b99f";
            /** 功能名称 */
            static FUNCTION_NAME = "sales_func_salesreturn";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnFunc.FUNCTION_ID;
                this.name = SalesReturnFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: SalesReturnListApp = new SalesReturnListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}