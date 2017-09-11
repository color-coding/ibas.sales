/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { utils } from "openui5/typings/ibas.utils";
import * as bo from "../../../borep/bo/index";
import { ISalesDeliveryEditView } from "../../../bsapp/salesdelivery/index";

/**
 * 编辑视图-销售交货
 */
export class SalesDeliveryEditView extends ibas.BOEditView implements ISalesDeliveryEditView {

    private page: sap.m.Page;
    private mainLayout: sap.ui.layout.VerticalLayout;
    private viewTopForm: sap.ui.layout.form.SimpleForm;
    private viewBottomForm: sap.ui.layout.form.SimpleForm;
    private tableSalesDeliveryItem: sap.ui.table.Table;
    private objPagelayout: sap.uxap.ObjectPageLayout;

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

    /** 绘制视图 */
    darw(): any {
        let that: this = this;
        /* this.viewTopForm = new sap.ui.layout.form.SimpleForm("", {
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
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documentdate") }),
                new sap.m.DatePicker("", {
                    valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                    displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                }).bindProperty("dateValue", {
                    path: "/documentDate"
                }),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_postingdate") }),
                new sap.m.DatePicker("", {
                    valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                    displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                }).bindProperty("dateValue", {
                    path: "postingDate",
                }),
                new sap.ui.core.Title("", {}),
                new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_deliverydate") }),
                new sap.m.DatePicker("", {
                    valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                    displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                }).bindProperty("dateValue", {
                    path: "deliveryDate",
                })
            ],
        }); */
        this.viewBottomForm = new sap.ui.layout.form.SimpleForm("", {
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
        this.tableSalesDeliveryItem = new sap.ui.table.Table("", {
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
                                utils.getTableSelecteds<bo.SalesDeliveryItem>(that.tableSalesDeliveryItem)
                            );
                        }
                    })
                ]
            }),
            enableSelectAll: false,
            visibleRowCount: ibas.config.get(utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 10),
            rows: "{/rows}",
            columns: [
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_salesdeliveryitem_linestatus"),
                    template: new sap.m.Select("", {
                        width: "100%",
                        items: utils.createComboBoxItems(ibas.emDocumentStatus),
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
        /* this.mainLayout = new sap.ui.layout.VerticalLayout("", {
            content: [
                this.viewTopForm,
                this.tableSalesDeliveryItem,
                this.viewBottomForm,
                this.objPagelayout
            ],
        }); */
        this.objPagelayout = new sap.uxap.ObjectPageLayout("", {
            sections: [
                new sap.uxap.ObjectPageSection("", {
                    title: ibas.i18n.prop("sales_basis_information"),
                    subSections: [
                        new sap.uxap.ObjectPageSubSection("", {
                            blocks: [
                                new sap.ui.layout.form.SimpleForm("", {
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
                                        new sap.ui.core.Title("", {}),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_customername") }),
                                        new sap.m.Input("", {
                                            type: sap.m.InputType.Text,
                                            editable: false
                                        }).bindProperty("value", {
                                            path: "customerName",
                                        }),
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                new sap.uxap.ObjectPageSection("", {
                    title: ibas.i18n.prop("bo_salesdelivery_salesdeliveryitems"),
                    subSections: [
                        new sap.uxap.ObjectPageSubSection("", {
                            blocks: [
                                this.tableSalesDeliveryItem,
                                this.viewBottomForm
                            ]
                        })
                    ]
                }),
                new sap.uxap.ObjectPageSection("", {
                    title: ibas.i18n.prop("bo_salesdelivery_documentstatus"),
                    subSections: [
                        new sap.uxap.ObjectPageSubSection("", {
                            blocks: [
                                new sap.ui.layout.form.SimpleForm("", {
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
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documentstatus") }),
                                        new sap.m.Select("", {
                                            showSecondaryValues: false,
                                            items: utils.createComboBoxItems(ibas.emDocumentStatus),
                                        }).bindProperty("selectedKey", {
                                            path: "documentStatus",
                                            type: "sap.ui.model.type.Integer",
                                        }),
                                        new sap.ui.core.Title("", {}),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_canceled") }),
                                        new sap.m.Select("", {
                                            showSecondaryValues: false,
                                            items: utils.createComboBoxItems(ibas.emYesNo),
                                        }).bindProperty("selectedKey", {
                                            path: "canceled",
                                            type: "sap.ui.model.type.Integer",
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                new sap.uxap.ObjectPageSection("", {
                    title: ibas.i18n.prop("sales_distribution_information"),
                    subSections: [
                        new sap.uxap.ObjectPageSubSection("", {
                            blocks: [
                                new sap.ui.layout.form.SimpleForm("", {
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
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_contactperson") }),
                                        new sap.m.Input("", {
                                            type: sap.m.InputType.Number,
                                        }).bindProperty("value", {
                                            path: "contactPerson",
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
                                })
                            ]
                        })
                    ]
                }),
                new sap.uxap.ObjectPageSection("", {
                    title: ibas.i18n.prop("sales_order_time"),
                    subSections: [
                        new sap.uxap.ObjectPageSubSection("", {
                            blocks: [
                                new sap.ui.layout.form.SimpleForm("", {
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
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documentdate") }),
                                        new sap.m.DatePicker("", {
                                            valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                            displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                        }).bindProperty("dateValue", {
                                            path: "/documentDate"
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_postingdate") }),
                                        new sap.m.DatePicker("", {
                                            valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                            displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                        }).bindProperty("dateValue", {
                                            path: "postingDate",
                                        }),
                                        new sap.ui.core.Title("", {}),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_deliverydate") }),
                                        new sap.m.DatePicker("", {
                                            valueFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                            displayFormat: ibas.config.get(ibas.CONFIG_ITEM_FORMAT_DATE),
                                        }).bindProperty("dateValue", {
                                            path: "deliveryDate",
                                        })
                                    ]
                                })
                            ]
                        })
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
            content: [this.objPagelayout],
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
                utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
            }
        }
        // 不可编辑：已批准，
        if (data.approvalStatus === ibas.emApprovalStatus.APPROVED
            || data.documentStatus === ibas.emDocumentStatus.CLOSED
            || data.canceled === ibas.emYesNo.YES) {
            if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                utils.changeToolbarSavable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
            }
            utils.changeFormEditable(this.mainLayout, false);
        }
    }

    /** 显示数据 */
    showSalesDelivery(data: bo.SalesDelivery): void {
        this.objPagelayout.setModel(new sap.ui.model.json.JSONModel(data));
        this.objPagelayout.bindObject("/");
        // 监听属性改变，并更新控件
        utils.refreshModelChanged(this.mainLayout, data);
        // 改变视图状态
        this.changeViewStatus(data);
    }
    /** 显示数据 */
    showSalesDeliveryItems(datas: bo.SalesDeliveryItem[]): void {
        this.objPagelayout.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
        // 监听属性改变，并更新控件
        utils.refreshModelChanged(this.objPagelayout, datas);
    }
}
