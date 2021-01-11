/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../index.d.ts" />
/// <reference path="../Component.d.ts" />
/// <reference path="../Component.ts" />
/// <reference path="./salesorder/index.ts" />
/// <reference path="./salesquote/index.ts" />
/// <reference path="./shippingaddress/index.ts" />
namespace sales {
    export namespace ui {
        /**
         * 视图导航
         */
        export class Navigation extends ibas.ViewNavigation {
            /**
             * 创建实例
             * @param id 应用id
             */
            protected newView(id: string): ibas.IView {
                let view: ibas.IView = null;
                switch (id) {
                    case app.SalesOrderListApp.APPLICATION_ID:
                        view = new m.SalesOrderListView();
                        break;
                    case app.SalesOrderChooseApp.APPLICATION_ID:
                        view = new m.SalesOrderChooseView();
                        break;
                    case app.SalesOrderEditApp.APPLICATION_ID:
                        view = new m.SalesOrderEditView();
                        break;
                    case app.SalesOrderViewApp.APPLICATION_ID:
                        view = new m.SalesOrderViewView();
                        break;
                    case app.SalesOrderItemExtraApp.APPLICATION_ID:
                        view = new m.SalesOrderItemExtraView();
                        break;
                    case app.SalesQuoteListApp.APPLICATION_ID:
                        view = new m.SalesQuoteListView();
                        break;
                    case app.SalesQuoteChooseApp.APPLICATION_ID:
                        view = new m.SalesQuoteChooseView();
                        break;
                    case app.SalesQuoteEditApp.APPLICATION_ID:
                        view = new m.SalesQuoteEditView();
                        break;
                    case app.SalesQuoteViewApp.APPLICATION_ID:
                        view = new m.SalesQuoteViewView();
                        break;
                    case app.SalesQuoteItemExtraApp.APPLICATION_ID:
                        view = new m.SalesQuoteItemExtraView();
                        break;
                    case app.ShippingAddressesEditApp.APPLICATION_ID:
                        view = new m.ShippingAddressesEditView();
                        break;
                    default:
                        break;
                }
                return view;
            }
        }
    }
}