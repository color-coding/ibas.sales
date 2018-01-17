/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as openui5 from "openui5/index";
import * as bo from "../../../borep/bo/index";
import { ISalesDeliveryViewView } from "../../../bsapp/salesdelivery/index";

export class SalesDeliveryViewView extends ibas.BOViewView implements ISalesDeliveryViewView {

    private page: sap.m.Page;
    private layoutMain: sap.ui.layout.VerticalLayout;
    private viewTopForm: sap.ui.layout.form.SimpleForm;
    private viewBottomForm: sap.ui.layout.form.SimpleForm;
    private tableSalesDeliveryItem: sap.m.List;
    private childViewForm: sap.ui.layout.form.SimpleForm;

    /** 绘制视图 */
    darw(): any {
        let that: this = this;
        this.viewTopForm = new sap.ui.layout.form.SimpleForm("", {
            editable: true,
            content: [
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_title_general") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_customercode") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "customerCode",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_customername") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "customerName",
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_order_status") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documentstatus") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "documentStatus",
                    formatter(data: any): any {
                        return ibas.enums.describe(ibas.emDocumentStatus, data);
                    }
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_canceled") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "canceled",
                    formatter(data: any): any {
                        return ibas.enums.describe(ibas.emYesNo, data);
                    }
                })
            ]
        });
        this.viewBottomForm = new sap.ui.layout.form.SimpleForm("", {
            editable: true,
            content: [
                new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_salesdelivery_remarks") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "/remarks"
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_order_amount") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documenttotal") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "/documentTotal"
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_discounttotal") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "/discountTotal"
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_distribution_information") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_contactperson") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "contactPerson",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_phone") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "phone",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_address") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "address",
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_order_time") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documentdate") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "documentDate",
                    type: new sap.ui.model.type.Date({
                        pattern: "yyyy-MM-dd",
                        strictParsing: true,
                    }),
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_postingdate") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "postingDate",
                    type: new sap.ui.model.type.Date({
                        pattern: "yyyy-MM-dd",
                        strictParsing: true,
                    }),
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_deliverydate") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "deliveryDate",
                    type: new sap.ui.model.type.Date({
                        pattern: "yyyy-MM-dd",
                        strictParsing: true,
                    }),
                }),
            ]
        });
        // 子对象列表
        this.tableSalesDeliveryItem = new sap.m.List("", {
            inset: false,
            growing: true,
            growingThreshold: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 5),
            growingScrollToLoad: true,
            visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
            mode: sap.m.ListMode.None,
            selectionMode: sap.ui.table.SelectionMode.None,
            headerToolbar: new sap.m.Toolbar("", {
                content: [
                    new sap.m.Title("", {
                        text: "单据行",
                        level: "H2"
                    })
                ]
            }),
            itemPress(oEvent: any): void {
                let parentControl: any = oEvent.getSource().getParent().getParent();
                var editBo: bo.SalesDeliveryItem = oEvent.getParameter("listItem");
                that.childViewForm.setModel(new sap.ui.model.json.JSONModel(editBo));
                that.childViewForm.bindObject("/");
                mainSplit.setShowSecondaryContent(false);
                that.tableSalesDeliveryItem.swipeOut(null);
            }
        });
        let list_child_customer: sap.m.ObjectListItem = new sap.m.ObjectListItem("", {
            title: "{itemCode}",
            type: "Active",
            attributes: [
                new sap.m.ObjectAttribute("", {
                    text: "{price} * {quantity}",
                    type: sap.ui.model.type.Integer,
                })
            ]
        });
        list_child_customer.bindProperty("number", {
            parts: [{ path: "lineTotal" }],
            type: sap.ui.model.type.Currency,
            formatOptions: { showMeasure: false }
        });
        that.tableSalesDeliveryItem.bindItems({
            path: "/rows",
            template: list_child_customer,
        });
        this.layoutMain = new sap.ui.layout.VerticalLayout("", {
            height: "100%",
            content: [
                this.viewTopForm,
                this.tableSalesDeliveryItem,
                this.viewBottomForm,
            ]
        });
        let screencontainer: sap.m.ScrollContainer = new sap.m.ScrollContainer("", {
            vertical: true,
            horizontal: false,
            height: "100%",
            content: [
                this.layoutMain
            ]
        });
        // 子对象查看页
        this.childViewForm = new sap.ui.layout.form.SimpleForm("", {
            editable: true,
            content: [
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdeliveryitem_linestatus") }),
                new sap.m.Text("", {
                    width: "100%",
                    items: openui5.utils.createComboBoxItems(ibas.emDocumentStatus)
                }).bindProperty("text", {
                    path: "lineStatus",
                    type: "sap.ui.model.type.Integer"
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdeliveryitem_itemcode") }),
                new sap.m.Text("", {
                    width: "100%"
                }).bindProperty("text", {
                    path: "itemCode"
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdeliveryitem_price") }),
                new sap.m.Text("", {
                    width: "100%",
                    type: sap.m.InputType.Number
                }).bindProperty("text", {
                    path: "price"
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdeliveryitem_quantity") }),
                new sap.m.Text("", {
                    width: "100%"
                }).bindProperty("text", {
                    path: "quantity"
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdeliveryitem_linetotal") }),
                new sap.m.Text("", {
                    width: "100%",
                    type: sap.m.InputType.Number,
                }).bindProperty("text", {
                    path: "lineTotal"
                }),
            ]
        });
        let mainSplit: sap.ui.unified.SplitContainer = new sap.ui.unified.SplitContainer("", {
            showSecondaryContent: true,
            orientation: sap.ui.core.Orientation.Horizontal,
            secondaryContentWidth: "100%",
        });
        mainSplit.addSecondaryContent(screencontainer);
        this.page = new sap.m.Page("", {
            showHeader: false,
            subHeader: new sap.m.Toolbar("", {
                content: []
            }),
            content: [mainSplit]
        });
        this.id = this.page.getId();
        return this.page;
    }

    /** 改变视图状态 */
    private changeViewStatus(data: bo.SalesDelivery): void {
        if (ibas.objects.isNull(data)) {
            return;
        }
        // 新建时：禁用删除，
        if (data.isNew) {
            if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
            }
        }
        // 不可编辑：已批准，
        if (data.approvalStatus === ibas.emApprovalStatus.APPROVED
            || data.documentStatus === ibas.emDocumentStatus.CLOSED
            || data.canceled === ibas.emYesNo.YES) {
            if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                openui5.utils.changeToolbarSavable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
            }
            openui5.utils.changeFormEditable(this.layoutMain, false);
        }
    }
    /** 显示数据 */
    showSalesDelivery(data: bo.SalesDelivery): void {
        this.layoutMain.setModel(new sap.ui.model.json.JSONModel(data));
        this.layoutMain.bindObject("/");
        // 监听属性改变，并更新控件
        openui5.utils.refreshModelChanged(this.layoutMain, data);
        // 改变视图状态
        this.changeViewStatus(data);
    }
    /** 显示数据 */
    showSalesDeliveryItems(datas: bo.SalesDeliveryItem[]): void {
        this.tableSalesDeliveryItem.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
        // 监听属性改变，并更新控件
        openui5.utils.refreshModelChanged(this.tableSalesDeliveryItem, datas);
    }

}