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
import { ISalesDeliveryEditView } from "../../../bsapp/salesdelivery/index";

/**
 * 编辑视图-销售交货
 */
export class SalesDeliveryEditView extends ibas.BOEditView implements ISalesDeliveryEditView {

    private page: sap.m.Page;
    private mainLayout: sap.ui.layout.VerticalLayout;
    private tabLowerRemarks: sap.ui.layout.form.SimpleForm;
    private tableLineDetailedTab: sap.ui.table.Table;
    private iconTabBar: sap.m.IconTabBar;
    private tabBasisInformation: sap.ui.layout.form.SimpleForm;
    private tabTimeInformation: sap.ui.layout.form.SimpleForm;
    private tabDistributionInformation: sap.ui.layout.form.SimpleForm;

    /** 删除数据事件 */
    deleteDataEvent: Function;
    /** 新建数据事件，参数1：是否克隆 */
    createDataEvent: Function;
    /** 添加销售交货-行事件 */
    addSalesDeliveryItemEvent: Function;
    /** 删除销售交货-行事件 */
    removeSalesDeliveryItemEvent: Function;
    /** 选择销售交货客户事件 */
    chooseSalesDeliveryCustomerEvent: Function;
    /** 选择销售交货物料事件 */
    chooseSalesDeliveryItemMaterialEvent: Function;
    /** 选择销售交货单行物料批次事件 */
    chooseSalesDeliveryItemMaterialBatchEvent: Function;
    /** 选择销售交货行物料序列号事件 */
    chooseSalesDeliveryItemMaterialSerialEvent: Function;

    /** 绘制视图 */
    darw(): any {
        let that: this = this;
        this.tabBasisInformation = new sap.ui.layout.form.SimpleForm("", {
            editable: true,
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
                new sap.ui.core.Title("", {}),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_customercode") }),
                new sap.m.Input("", {
                    placeholder: ibas.i18n.prop("bo_salesdelivery_customercode"),
                    tooltip: ibas.i18n.prop("bo_salesdelivery_customercode"),
                    showValueHelp: true,
                    valueHelpRequest: function (): void {
                        that.fireViewEvents(that.chooseSalesDeliveryCustomerEvent);
                    }
                }).bindProperty("value", {
                    path: "customerCode",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_customername") }),
                new sap.m.Input("", {
                    type: sap.m.InputType.Text,
                    editable: false
                }).bindProperty("value", {
                    path: "customerName"
                }),
                new sap.ui.core.Title("", {}),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documentstatus") }),
                new sap.m.Select("", {
                    showSecondaryValues: false,
                    items: openui5.utils.createComboBoxItems(ibas.emDocumentStatus),
                }).bindProperty("selectedKey", {
                    path: "documentStatus",
                    type: "sap.ui.model.type.Integer",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_canceled") }),
                new sap.m.Select("", {
                    showSecondaryValues: false,
                    items: openui5.utils.createComboBoxItems(ibas.emYesNo),
                }).bindProperty("selectedKey", {
                    path: "canceled",
                    type: "sap.ui.model.type.Integer",
                })
            ],
        });
        this.tabLowerRemarks = new sap.ui.layout.form.SimpleForm("", {
            editable: true,
            layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
            labelSpanL: 2,
            labelSpanM: 2,
            labelSpanS: 12,
            columnsXL: 2,
            columnsL: 2,
            columnsM: 1,
            columnsS: 1,
            content: [
                new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_salesdelivery_remarks") }),
                new sap.m.TextArea("", {
                    rows: 5,
                }).bindProperty("value", {
                    path: "/remarks",
                }),
                new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_order_amount") }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documenttotal") }),
                new sap.m.Input("", {
                    width: "100px",
                    type: sap.m.InputType.Number,
                }).bindProperty("value", {
                    path: "/DocumentTotal",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_discounttotal") }),
                new sap.m.Input("", {
                    width: "100px",
                    type: sap.m.InputType.Number,
                    description: "RMB"
                }).bindProperty("value", {
                    path: "/DiscountTotal",
                })
            ],
        });
        this.tableLineDetailedTab = new sap.ui.table.Table("", {
            extension: new sap.m.Toolbar("", {
                content: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("sys_shell_data_add"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://add",
                        press: function (): void {
                            that.fireViewEvents(that.addSalesDeliveryItemEvent);
                        }
                    }),
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("sys_shell_data_remove"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://less",
                        press: function (): void {
                            that.fireViewEvents(that.removeSalesDeliveryItemEvent,
                                // 获取表格选中的对象
                                openui5.utils.getTableSelecteds<bo.SalesDeliveryItem>(that.tableLineDetailedTab)
                            );
                        }
                    }),
                    new sap.m.MenuButton("",{
                        text: ibas.i18n.prop("materials_data_batch_serial"),
                        menu:[
                            new sap.m.Menu("",{
                                items: [
                                    new sap.m.MenuItem("",{
                                        text: ibas.i18n.prop("materials_app_materialbatchreceipt"),
                                        press: function(): void {
                                            that.fireViewEvents(that.chooseSalesDeliveryItemMaterialBatchEvent);
                                        }
                                    }),
                                    new sap.m.MenuItem("", {
                                        text: ibas.i18n.prop("materials_app_materialserialhissue"),
                                        press: function (): void {
                                            that.fireViewEvents(that.chooseSalesDeliveryItemMaterialSerialEvent);
                                        }
                                    }),
                                ]
                            })
                        ]
                    })
                ]
            }),
            enableSelectAll: false,
            visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 10),
            rows: "{/rows}",
            columns: [
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesdeliveryitem_linestatus"),
                    template: new sap.m.Select("", {
                        width: "100%",
                        items: openui5.utils.createComboBoxItems(ibas.emDocumentStatus),
                    }).bindProperty("selectedKey", {
                        path: "lineStatus",
                        type: "sap.ui.model.type.Integer",
                    }),
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesdeliveryitem_itemcode"),
                    template: new sap.m.Input("", {
                        width: "100%",
                        showValueHelp: true,
                        valueHelpRequest: function (): void {
                            that.fireViewEvents(that.chooseSalesDeliveryItemMaterialEvent,
                                // 获取当前对象
                                this.getBindingContext().getObject()
                            );
                        }
                    }).bindProperty("value", {
                        path: "itemCode",
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesdeliveryitem_price"),
                    template: new sap.m.Input("", {
                        width: "100%",
                        type: sap.m.InputType.Number,
                    }).bindProperty("value", {
                        path: "price",
                    }),
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesdeliveryitem_quantity"),
                    template: new sap.m.Input("", {
                        width: "100%",
                        type: sap.m.InputType.Number,
                    }).bindProperty("value", {
                        path: "quantity",
                    }),
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesdeliveryitem_discount"),
                    template: new sap.m.Input("", {
                        width: "100%",
                        type: sap.m.InputType.Number,
                    }).bindProperty("value", {
                        path: "discount",
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesdeliveryitem_linetotal"),
                    template: new sap.m.Input("", {
                        width: "100%",
                        type: sap.m.InputType.Number,
                    }).bindProperty("value", {
                        path: "lineTotal",
                    })
                })
            ]
        });
        this.tabTimeInformation = new sap.ui.layout.form.SimpleForm("", {
            editable: true,
            layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
            labelSpanL: 2,
            labelSpanM: 2,
            labelSpanS: 12,
            columnsXL: 2,
            columnsL: 2,
            columnsM: 1,
            columnsS: 1,
            content: [
                new sap.ui.core.Title("", {}),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documentdate") }),
                new sap.m.DatePicker("", {
                    valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                    displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                }).bindProperty("dateValue", {
                    path: "documentDate",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_postingdate") }),
                new sap.m.DatePicker("", {
                    valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                    displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                }).bindProperty("dateValue", {
                    path: "postingDate",
                }),
                new sap.ui.core.Title("", {}),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_deliverydate") }),
                new sap.m.DatePicker("", {
                    valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                    displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                }).bindProperty("dateValue", {
                    path: "deliveryDate",
                })
            ]
        });
        this.tabDistributionInformation = new sap.ui.layout.form.SimpleForm("", {
            editable: true,
            layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
            labelSpanL: 2,
            labelSpanM: 2,
            labelSpanS: 12,
            columnsXL: 2,
            columnsL: 2,
            columnsM: 1,
            columnsS: 1,
            content: [
                new sap.ui.core.Title("", {}),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_consignee") }),
                new sap.m.Input("", {
                }).bindProperty("value", {
                    path: "consignee",
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_phone") }),
                new sap.m.Input("", {
                    type: sap.m.InputType.Number,
                }).bindProperty("value", {
                    path: "phone",
                }),
                new sap.ui.core.Title("", {}),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_address") }),
                new sap.m.Input("", {
                }).bindProperty("value", {
                    path: "address",
                })
            ]
        });
        this.iconTabBar = new sap.m.IconTabBar("", {
            showOverflowSelectList: true,
            items: [
                new sap.m.IconTabFilter("", {
                    text: ibas.i18n.prop("sales_basis_information"),
                    content: [
                        this.tabBasisInformation
                    ]
                }),
                new sap.m.IconTabFilter("", {
                    text: ibas.i18n.prop("bo_salesdelivery_salesdeliveryitems"),
                    content: [
                        this.tableLineDetailedTab,
                        this.tabLowerRemarks
                    ]
                }),
                new sap.m.IconTabFilter("", {
                    text: ibas.i18n.prop("sales_order_time"),
                    content: [
                        this.tabTimeInformation
                    ]
                }),
                new sap.m.IconTabFilter("", {
                    text: ibas.i18n.prop("sales_distribution_information"),
                    content: [
                        this.tabDistributionInformation
                    ]
                })
            ]
        });
        this.page = new sap.m.Page("", {
            showHeader: false,
            subHeader: new sap.m.Toolbar("", {
                content: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("sys_shell_data_save"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://save",
                        press: function (): void {
                            that.fireViewEvents(that.saveDataEvent);
                        }
                    }),
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("sys_shell_data_delete"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://delete",
                        press: function (): void {
                            that.fireViewEvents(that.deleteDataEvent);
                        }
                    }),
                    new sap.m.ToolbarSeparator(""),
                    new sap.m.MenuButton("", {
                        text: ibas.i18n.prop("sys_shell_data_new"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://create",
                        buttonMode: sap.m.MenuButtonMode.Split,
                        defaultAction: function (): void {
                            // 触发新建对象
                            that.fireViewEvents(that.createDataEvent, false);
                        },
                        menu: new sap.m.Menu("", {
                            items: [
                                new sap.m.MenuItem("", {
                                    text: ibas.i18n.prop("sys_shell_data_new"),
                                    icon: "sap-icon://create",
                                }),
                                new sap.m.MenuItem("", {
                                    text: ibas.i18n.prop("sys_shell_data_clone"),
                                    icon: "sap-icon://copy",
                                }),
                            ],
                            itemSelected: function (event: any): void {
                                let item: any = event.getParameter("item");
                                if (item instanceof sap.m.MenuItem) {
                                    if (item.getIcon() === "sap-icon://copy") {
                                        // 触发克隆对象
                                        that.fireViewEvents(that.createDataEvent, true);
                                    } else {
                                        // 触发新建对象
                                        that.fireViewEvents(that.createDataEvent, false);
                                    }
                                }
                            }
                        }),
                    }),
                ],
            }),
            content: [this.iconTabBar],
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
            openui5.utils.changeFormEditable(this.mainLayout, false);
        }
    }

    /** 显示数据 */
    showSalesDelivery(data: bo.SalesDelivery): void {
        this.iconTabBar.setModel(new sap.ui.model.json.JSONModel(data));
        this.iconTabBar.bindObject("/");
        // 监听属性改变，并更新控件
        openui5.utils.refreshModelChanged(this.iconTabBar, data);
        // 改变视图状态
        this.changeViewStatus(data);
    }
    /** 显示数据 */
    showSalesDeliveryItems(datas: bo.SalesDeliveryItem[]): void {
        this.tableLineDetailedTab.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
        // 监听属性改变，并更新控件
        openui5.utils.refreshModelChanged(this.iconTabBar, datas);
    }
}
