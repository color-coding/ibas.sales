/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class SalesReturnRequestFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "1c9b9c81-d004-477e-9eee-406cf7442c8b";
            /** 功能名称 */
            static FUNCTION_NAME = "sales_func_salesreturnrequest";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesReturnRequestFunc.FUNCTION_ID;
                this.name = SalesReturnRequestFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: SalesReturnRequestListApp = new SalesReturnRequestListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}