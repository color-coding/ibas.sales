/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class BlanketAgreementFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "74882acd-e414-44cb-8f8e-0b1d48f0a188";
            /** 功能名称 */
            static FUNCTION_NAME = "sales_func_blanketagreement";
            /** 构造函数 */
            constructor() {
                super();
                this.id = BlanketAgreementFunc.FUNCTION_ID;
                this.name = BlanketAgreementFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: BlanketAgreementListApp = new BlanketAgreementListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}
