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
/// <reference path="./salesdelivery/index.ts" />
/// <reference path="./salesorder/index.ts" />
/// <reference path="./salesreturn/index.ts" />
/// <reference path="./salesquote/index.ts" />
/// <reference path="./salesinvoice/index.ts" />
/// <reference path="./salescreditnote/index.ts" />
/// <reference path="./shippingaddress/index.ts" />
/// <reference path="./blanketagreement/index.ts" />
/// <reference path="./downpaymentrequest/index.ts" />
/// <reference path="./salesreserveinvoice/index.ts" />
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
                    case app.SalesDeliveryListApp.APPLICATION_ID:
                        view = new m.SalesDeliveryListView();
                        break;
                    case app.SalesDeliveryChooseApp.APPLICATION_ID:
                        view = new m.SalesDeliveryChooseView();
                        break;
                    case app.SalesDeliveryViewApp.APPLICATION_ID:
                        view = new m.SalesDeliveryViewView();
                        break;
                    case app.SalesDeliveryEditApp.APPLICATION_ID:
                        view = new m.SalesDeliveryEditView();
                        break;
                    case app.SalesOrderListApp.APPLICATION_ID:
                        view = new m.SalesOrderListView();
                        break;
                    case app.SalesOrderChooseApp.APPLICATION_ID:
                        view = new m.SalesOrderChooseView();
                        break;
                    case app.SalesOrderViewApp.APPLICATION_ID:
                        view = new m.SalesOrderViewView();
                        break;
                    case app.SalesOrderEditApp.APPLICATION_ID:
                        view = new m.SalesOrderEditView();
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
                    case app.SalesQuoteViewApp.APPLICATION_ID:
                        view = new m.SalesQuoteViewView();
                        break;
                    case app.SalesQuoteEditApp.APPLICATION_ID:
                        view = new m.SalesQuoteEditView();
                        break;
                    case app.SalesQuoteItemExtraApp.APPLICATION_ID:
                        view = new m.SalesQuoteItemExtraView();
                        break;
                    case app.SalesReturnListApp.APPLICATION_ID:
                        view = new m.SalesReturnListView();
                        break;
                    case app.SalesReturnChooseApp.APPLICATION_ID:
                        view = new m.SalesReturnChooseView();
                        break;
                    case app.SalesReturnViewApp.APPLICATION_ID:
                        view = new m.SalesReturnViewView();
                        break;
                    case app.SalesReturnEditApp.APPLICATION_ID:
                        view = new m.SalesReturnEditView();
                        break;
                    case app.SalesInvoiceListApp.APPLICATION_ID:
                        view = new m.SalesInvoiceListView();
                        break;
                    case app.SalesInvoiceChooseApp.APPLICATION_ID:
                        view = new m.SalesInvoiceChooseView();
                        break;
                    case app.SalesInvoiceViewApp.APPLICATION_ID:
                        view = new m.SalesInvoiceViewView();
                        break;
                    case app.SalesInvoiceEditApp.APPLICATION_ID:
                        view = new m.SalesInvoiceEditView();
                        break;
                    case app.SalesCreditNoteListApp.APPLICATION_ID:
                        view = new m.SalesCreditNoteListView();
                        break;
                    case app.SalesCreditNoteChooseApp.APPLICATION_ID:
                        view = new m.SalesCreditNoteChooseView();
                        break;
                    case app.SalesCreditNoteViewApp.APPLICATION_ID:
                        view = new m.SalesCreditNoteViewView();
                        break;
                    case app.SalesCreditNoteEditApp.APPLICATION_ID:
                        view = new m.SalesCreditNoteEditView();
                        break;
                    case app.ShippingAddressesEditApp.APPLICATION_ID:
                        view = new m.ShippingAddressesEditView();
                        break;
                    case app.BlanketAgreementListApp.APPLICATION_ID:
                        view = new m.BlanketAgreementListView();
                        break;
                    case app.BlanketAgreementChooseApp.APPLICATION_ID:
                        view = new m.BlanketAgreementChooseView();
                        break;
                    case app.BlanketAgreementViewApp.APPLICATION_ID:
                        view = new m.BlanketAgreementViewView();
                        break;
                    case app.BlanketAgreementEditApp.APPLICATION_ID:
                        view = new m.BlanketAgreementEditView();
                        break;
                    case app.DownPaymentRequestListApp.APPLICATION_ID:
                        view = new m.DownPaymentRequestListView();
                        break;
                    case app.DownPaymentRequestChooseApp.APPLICATION_ID:
                        view = new m.DownPaymentRequestChooseView();
                        break;
                    case app.DownPaymentRequestEditApp.APPLICATION_ID:
                        view = new m.DownPaymentRequestEditView();
                        break;
                    case app.DownPaymentRequestEditApp.APPLICATION_ID:
                        view = new m.DownPaymentRequestEditView();
                        break;
                    case app.SalesReserveInvoiceListApp.APPLICATION_ID:
                        view = new m.SalesReserveInvoiceListView();
                        break;
                    case app.SalesReserveInvoiceChooseApp.APPLICATION_ID:
                        view = new m.SalesReserveInvoiceChooseView();
                        break;
                    case app.SalesReserveInvoiceEditApp.APPLICATION_ID:
                        view = new m.SalesReserveInvoiceEditView();
                        break;
                    default:
                        break;
                }
                return view;
            }
        }
    }
}