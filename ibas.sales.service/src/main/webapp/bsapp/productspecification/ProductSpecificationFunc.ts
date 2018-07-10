/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        export class ProductSpecificationFunc extends ibas.ModuleFunction {

            /** 功能标识 */
            static FUNCTION_ID = "0dc605c9-ad9d-4208-b33e-d0595785a790";
            /** 功能名称 */
            static FUNCTION_NAME = "sales_func_productspecification";
            /** 构造函数 */
            constructor() {
                super();
                this.id = ProductSpecificationFunc.FUNCTION_ID;
                this.name = ProductSpecificationFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: ProductSpecificationListApp = new ProductSpecificationListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}
