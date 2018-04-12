/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class SalesQuoteFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "15e7b90d-12ad-4bbb-8578-a49ab512453a";
            /** 功能名称 */
            static FUNCTION_NAME = "sales_func_salesquote";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesQuoteFunc.FUNCTION_ID;
                this.name = SalesQuoteFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: SalesQuoteListApp = new SalesQuoteListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}
