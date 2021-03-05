/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class SalesCreditNoteFunc extends ibas.ModuleFunction {
            /** 功能标识 */
            static FUNCTION_ID = "14485722-e0d0-43ac-9804-a33475a77fdc";
            /** 功能名称 */
            static FUNCTION_NAME = "sales_func_salescreditnote";
            /** 构造函数 */
            constructor() {
                super();
                this.id = SalesCreditNoteFunc.FUNCTION_ID;
                this.name = SalesCreditNoteFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: SalesCreditNoteListApp = new SalesCreditNoteListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}