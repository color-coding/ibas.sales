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
import { ISalesReturnViewView } from "../../../bsapp/salesreturn/index";

/**
 * 查看视图-销售退货
 */
export class SalesReturnViewView extends ibas.BOViewView implements ISalesReturnViewView {

    private page: sap.m.Page;
    private mainLayout: sap.ui.layout.VerticalLayout;
    private viewTopForm: sap.ui.layout.form.SimpleForm;
    private viewBottomForm: sap.ui.layout.form.SimpleForm;
    private tableSalesReturnItem: sap.ui.table.Table;

    /** 绘制视图 */
    darw(): any {
        let that: this = this;
        this.viewTopForm = new sap.ui.layout.form.SimpleForm("", {
            editable: false,
            layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
            singleContainerFullSize: false,
            adjustLabelSpan: false,
            labelSpanL: 2,
            labelSpanM: 2,
            labelSpanS: 12,
            columnsXL: 2,
            columnsL: 2,
            columnsM: 1,
            columnsS: 1,
            content: [
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_basis_information") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_docentry") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "docEntry",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_customercode") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "customerCode"
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_customername") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "customerName"
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_order_status") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentstatus") }),
                new sap.m.Text("", {
                    wrapping: false
                }).bindProperty("text", {
                    path: "documentStatus",
                    formatter(data: any): any {
                        return ibas.enums.describe(ibas.emDocumentStatus, data);
                    }
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_canceled") }),
                new sap.m.Text("", {
                    wrapping: false
                }).bindProperty("text", {
                    path: "canceled",
                    formatter(data: any): any {
                        return ibas.enums.describe(ibas.emYesNo, data);
                    }
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_order_time") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentdate") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "documentDate",
                    type: new sap.ui.model.type.Date({
                        pattern: "yyyy-MM-dd",
                        strictParsing: true,
                    }),
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_postingdate") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "postingDate",
                    type: new sap.ui.model.type.Date({
                        pattern: "yyyy-MM-dd",
                        strictParsing: true,
                    }),
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_deliverydate") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "deliveryDate",
                    type: new sap.ui.model.type.Date({
                        pattern: "yyyy-MM-dd",
                        strictParsing: true,
                    }),
                })
            ]
        });
        this.viewBottomForm = new sap.ui.layout.form.SimpleForm("", {
            editable: false,
            layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
            labelSpanL: 2,
            labelSpanM: 2,
            labelSpanS: 12,
            columnsXL: 2,
            columnsL: 2,
            columnsM: 1,
            columnsS: 1,
            content: [
                new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_salesreturn_remarks") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "remarks"
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_order_amount") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documenttotal") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "documentTotal"
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_discounttotal") }),
                new sap.m.Text("", {
                }).bindProperty("text", {
                    path: "discountTotal"
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_distribution_information") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_consignee") }),
                new sap.m.Text("", {
                    type: sap.m.InputType.Number,
                }).bindProperty("text", {
                    path: "consignee",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_phone") }),
                new sap.m.Text("", {
                    type: sap.m.InputType.Number,
                }).bindProperty("text", {
                    path: "phone",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_address") }),
                new sap.m.Text("", {
                    type: sap.m.InputType.Number,
                }).bindProperty("text", {
                    path: "address",
                })
            ]
        });
        this.tableSalesReturnItem = new sap.ui.table.Table("", {
            enableSelectAll: false,
            selectionBehavior: sap.ui.table.SelectionBehavior.Row,
            selectionMode: sap.ui.table.SelectionMode.None,
            visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 10),
            rows: "{/rows}",
            columns: [
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesreturnitem_lineid"),
                    template: new sap.m.Text("", {
                        width: "100%",
                    }).bindProperty("text", {
                        path: "lineId"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesreturnitem_linestatus"),
                    template: new sap.m.Text("", {
                        wrapping: false
                    }).bindProperty("text", {
                        path: "lineStatus",
                        formatter(data: any): any {
                            return ibas.enums.describe(ibas.emDocumentStatus, data);
                        }
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesreturnitem_itemcode"),
                    template: new sap.m.Text("", {
                    }).bindProperty("text", {
                        path: "itemCode"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesreturnitem_price"),
                    template: new sap.m.Text("", {
                        type: sap.m.InputType.Number
                    }).bindProperty("text", {
                        path: "price"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesreturnitem_quantity"),
                    template: new sap.m.Text("", {
                        type: sap.m.InputType.Number
                    }).bindProperty("text", {
                        path: "quantity"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesreturnitem_discount"),
                    template: new sap.m.Text("", {
                        type: sap.m.InputType.Number
                    }).bindProperty("text", {
                        path: "discount"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesreturnitem_linetotal"),
                    template: new sap.m.Text("", {
                        type: sap.m.InputType.Number,
                    }).bindProperty("text", {
                        path: "lineTotal"
                    })
                })
            ]
        });
        this.mainLayout = new sap.ui.layout.VerticalLayout("", {
            content: [
                this.viewTopForm,
                this.tableSalesReturnItem,
                this.viewBottomForm,
            ]
        });
        this.page = new sap.m.Page("", {
            showHeader: false,
            subHeader: new sap.m.Bar("", {
                contentLeft: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_edit"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://edit",
                        press: function (): void {
                            that.fireViewEvents(that.editDataEvent);
                        }
                    })
                ],
                contentRight: [
                    new sap.m.Button("", {
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://action",
                        press: function (event: any): void {
                            that.fireViewEvents(that.callServicesEvent, {
                                displayServices(services: ibas.IServiceAgent[]): void {
                                    if (ibas.objects.isNull(services) || services.length === 0) {
                                        return;
                                    }
                                    let popover: sap.m.Popover = new sap.m.Popover("", {
                                        showHeader: false,
                                        placement: sap.m.PlacementType.Bottom,
                                    });
                                    for (let service of services) {
                                        popover.addContent(new sap.m.Button({
                                            text: ibas.i18n.prop(service.name),
                                            type: sap.m.ButtonType.Transparent,
                                            icon: service.icon,
                                            press: function (): void {
                                                service.run();
                                                popover.close();
                                            }
                                        }));
                                    }
                                    (<any>popover).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
                                    popover.openBy(event.getSource(), true);
                                }
                            });
                        }
                    })
                ]
            }),
            content: [this.mainLayout]
        });
        this.id = this.page.getId();
        return this.page;
    }
    /** 显示数据 */
    showSalesReturn(data: bo.SalesReturn): void {
        this.mainLayout.setModel(new sap.ui.model.json.JSONModel(data));
        this.mainLayout.bindObject("/");
    }
    /** 显示数据 */
    showSalesReturnItems(datas: bo.SalesReturnItem[]): void {
        this.tableSalesReturnItem.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
    }
}
