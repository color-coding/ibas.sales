/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as productsuitApps from "../../bsapp/productsuit/index";
import * as salesdeliveryApps from "../../bsapp/salesdelivery/index";
import * as salesorderApps from "../../bsapp/salesorder/index";
import * as salesreturnApps from "../../bsapp/salesreturn/index";
import * as productsuitViews from "./productsuit/index";
import * as salesdeliveryViews from "./salesdelivery/index";
import * as salesorderViews from "./salesorder/index";
import * as salesreturnViews from "./salesreturn/index";

/**
 * 视图导航
 */
export default class Navigation extends ibas.ViewNavigation {

    /**
     * 创建实例
     * @param id 应用id
     */
    protected newView(id: string): ibas.IView {
        let view: ibas.IView = null;
        switch (id) {
            case productsuitApps.ProductSuitListApp.APPLICATION_ID:
                view = new productsuitViews.ProductSuitListView();
                break;
            case productsuitApps.ProductSuitChooseApp.APPLICATION_ID:
                view = new productsuitViews.ProductSuitChooseView();
                break;
            case productsuitApps.ProductSuitViewApp.APPLICATION_ID:
                view = new productsuitViews.ProductSuitViewView();
                break;
            case productsuitApps.ProductSuitEditApp.APPLICATION_ID:
                view = new productsuitViews.ProductSuitEditView();
                break;
            case salesdeliveryApps.SalesDeliveryListApp.APPLICATION_ID:
                view = new salesdeliveryViews.SalesDeliveryListView();
                break;
            case salesdeliveryApps.SalesDeliveryChooseApp.APPLICATION_ID:
                view = new salesdeliveryViews.SalesDeliveryChooseView();
                break;
            case salesdeliveryApps.SalesDeliveryViewApp.APPLICATION_ID:
                view = new salesdeliveryViews.SalesDeliveryViewView();
                break;
            case salesdeliveryApps.SalesDeliveryEditApp.APPLICATION_ID:
                view = new salesdeliveryViews.SalesDeliveryEditView();
                break;
            case salesorderApps.SalesOrderListApp.APPLICATION_ID:
                view = new salesorderViews.SalesOrderListView();
                break;
            case salesorderApps.SalesOrderChooseApp.APPLICATION_ID:
                view = new salesorderViews.SalesOrderChooseView();
                break;
            case salesorderApps.SalesOrderViewApp.APPLICATION_ID:
                view = new salesorderViews.SalesOrderViewView();
                break;
            case salesorderApps.SalesOrderEditApp.APPLICATION_ID:
                view = new salesorderViews.SalesOrderEditView();
                break;
            case salesreturnApps.SalesReturnListApp.APPLICATION_ID:
                view = new salesreturnViews.SalesReturnListView();
                break;
            case salesreturnApps.SalesReturnChooseApp.APPLICATION_ID:
                view = new salesreturnViews.SalesReturnChooseView();
                break;
            case salesreturnApps.SalesReturnViewApp.APPLICATION_ID:
                view = new salesreturnViews.SalesReturnViewView();
                break;
            case salesreturnApps.SalesReturnEditApp.APPLICATION_ID:
                view = new salesreturnViews.SalesReturnEditView();
                break;
            default:
                break;
        }
        return view;
    }
}
