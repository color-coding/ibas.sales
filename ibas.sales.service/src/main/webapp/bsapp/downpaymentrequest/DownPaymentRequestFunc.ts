/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class DownPaymentRequestFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "ca21bc4d-90f8-45fe-8ca0-3b17b2cd8041";
            /** 功能名称 */
            static FUNCTION_NAME = "sales_func_downpaymentrequest";
            /** 构造函数 */
            constructor() {
                super();
                this.id = DownPaymentRequestFunc.FUNCTION_ID;
                this.name = DownPaymentRequestFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: DownPaymentRequestListApp = new DownPaymentRequestListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}
