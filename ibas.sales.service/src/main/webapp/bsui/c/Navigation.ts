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
/// <reference path="./productsuit/index.ts" />
/// <reference path="./salesdelivery/index.ts" />
/// <reference path="./salesorder/index.ts" />
/// <reference path="./salesreturn/index.ts" />
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
                    case app.ProductSuitListApp.APPLICATION_ID:
                        view = new c.ProductSuitListView();
                        break;
                    case app.ProductSuitChooseApp.APPLICATION_ID:
                        view = new c.ProductSuitChooseView();
                        break;
                    case app.ProductSuitEditApp.APPLICATION_ID:
                        view = new c.ProductSuitEditView();
                        break;
                    case app.SalesDeliveryListApp.APPLICATION_ID:
                        view = new c.SalesDeliveryListView();
                        break;
                    case app.SalesDeliveryChooseApp.APPLICATION_ID:
                        view = new c.SalesDeliveryChooseView();
                        break;
                    case app.SalesDeliveryViewApp.APPLICATION_ID:
                        view = new c.SalesDeliveryViewView();
                        break;
                    case app.SalesDeliveryEditApp.APPLICATION_ID:
                        view = new c.SalesDeliveryEditView();
                        break;
                    case app.SalesOrderListApp.APPLICATION_ID:
                        view = new c.SalesOrderListView();
                        break;
                    case app.SalesOrderChooseApp.APPLICATION_ID:
                        view = new c.SalesOrderChooseView();
                        break;
                    case app.SalesOrderViewApp.APPLICATION_ID:
                        view = new c.SalesOrderViewView();
                        break;
                    case app.SalesOrderEditApp.APPLICATION_ID:
                        view = new c.SalesOrderEditView();
                        break;
                    case app.SalesOrderItemExtraApp.APPLICATION_ID:
                        view = new c.SalesOrderItemExtraView();
                        break;
                    case app.SalesQuoteListApp.APPLICATION_ID:
                        view = new c.SalesQuoteListView();
                        break;
                    case app.SalesQuoteChooseApp.APPLICATION_ID:
                        view = new c.SalesQuoteChooseView();
                        break;
                    case app.SalesQuoteViewApp.APPLICATION_ID:
                        view = new c.SalesQuoteViewView();
                        break;
                    case app.SalesQuoteEditApp.APPLICATION_ID:
                        view = new c.SalesQuoteEditView();
                        break;
                    case app.SalesQuoteItemExtraApp.APPLICATION_ID:
                        view = new c.SalesQuoteItemExtraView();
                        break;
                    case app.SalesReturnListApp.APPLICATION_ID:
                        view = new c.SalesReturnListView();
                        break;
                    case app.SalesReturnChooseApp.APPLICATION_ID:
                        view = new c.SalesReturnChooseView();
                        break;
                    case app.SalesReturnViewApp.APPLICATION_ID:
                        view = new c.SalesReturnViewView();
                        break;
                    case app.SalesReturnEditApp.APPLICATION_ID:
                        view = new c.SalesReturnEditView();
                        break;
                    case app.ShippingAddressesEditApp.APPLICATION_ID:
                        view = new c.ShippingAddressesEditView();
                        break;
                    default:
                        break;
                }
                return view;
            }
        }
    }
}