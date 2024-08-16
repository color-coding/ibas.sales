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
/// <reference path="./salesinvoice/index.ts" />
/// <reference path="./salescreditnote/index.ts" />
/// <reference path="./shippingaddress/index.ts" />
/// <reference path="./blanketagreement/index.ts" />
/// <reference path="./downpaymentrequest/index.ts" />
/// <reference path="./salesreserveinvoice/index.ts" />
/// <reference path="./salesreturnrequest/index.ts" />
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
                    case app.SalesInvoiceListApp.APPLICATION_ID:
                        view = new c.SalesInvoiceListView();
                        break;
                    case app.SalesInvoiceChooseApp.APPLICATION_ID:
                        view = new c.SalesInvoiceChooseView();
                        break;
                    case app.SalesInvoiceViewApp.APPLICATION_ID:
                        view = new c.SalesInvoiceViewView();
                        break;
                    case app.SalesInvoiceEditApp.APPLICATION_ID:
                        view = new c.SalesInvoiceEditView();
                        break;
                    case app.SalesCreditNoteListApp.APPLICATION_ID:
                        view = new c.SalesCreditNoteListView();
                        break;
                    case app.SalesCreditNoteChooseApp.APPLICATION_ID:
                        view = new c.SalesCreditNoteChooseView();
                        break;
                    case app.SalesCreditNoteViewApp.APPLICATION_ID:
                        view = new c.SalesCreditNoteViewView();
                        break;
                    case app.SalesCreditNoteEditApp.APPLICATION_ID:
                        view = new c.SalesCreditNoteEditView();
                        break;
                    case app.ShippingAddressesEditApp.APPLICATION_ID:
                        view = new c.ShippingAddressesEditView();
                        break;
                    case app.BlanketAgreementListApp.APPLICATION_ID:
                        view = new c.BlanketAgreementListView();
                        break;
                    case app.BlanketAgreementChooseApp.APPLICATION_ID:
                        view = new c.BlanketAgreementChooseView();
                        break;
                    case app.BlanketAgreementViewApp.APPLICATION_ID:
                        view = new c.BlanketAgreementViewView();
                        break;
                    case app.BlanketAgreementEditApp.APPLICATION_ID:
                        view = new c.BlanketAgreementEditView();
                        break;
                    case app.DownPaymentRequestListApp.APPLICATION_ID:
                        view = new c.DownPaymentRequestListView();
                        break;
                    case app.DownPaymentRequestChooseApp.APPLICATION_ID:
                        view = new c.DownPaymentRequestChooseView();
                        break;
                    case app.DownPaymentRequestViewApp.APPLICATION_ID:
                        view = new c.DownPaymentRequestViewView();
                        break;
                    case app.DownPaymentRequestEditApp.APPLICATION_ID:
                        view = new c.DownPaymentRequestEditView();
                        break;
                    case app.SalesReserveInvoiceListApp.APPLICATION_ID:
                        view = new c.SalesReserveInvoiceListView();
                        break;
                    case app.SalesReserveInvoiceChooseApp.APPLICATION_ID:
                        view = new c.SalesReserveInvoiceChooseView();
                        break;
                    case app.SalesReserveInvoiceViewApp.APPLICATION_ID:
                        view = new c.SalesReserveInvoiceViewView();
                        break;
                    case app.SalesReserveInvoiceEditApp.APPLICATION_ID:
                        view = new c.SalesReserveInvoiceEditView();
                        break;
                    case app.SalesReturnRequestListApp.APPLICATION_ID:
                        view = new c.SalesReturnRequestListView();
                        break;
                    case app.SalesReturnRequestChooseApp.APPLICATION_ID:
                        view = new c.SalesReturnRequestChooseView();
                        break;
                    case app.SalesReturnRequestViewApp.APPLICATION_ID:
                        view = new c.SalesReturnRequestViewView();
                        break;
                    case app.SalesReturnRequestEditApp.APPLICATION_ID:
                        view = new c.SalesReturnRequestEditView();
                        break;
                    default:
                        break;
                }
                return view;
            }
        }
    }
}