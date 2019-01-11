/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace ui {
        export namespace c {
            /**
             * 列表视图-销售订单-行额外
             */
            export class SalesOrderItemExtraView extends ibas.DialogView implements app.ISalesOrderItemExtraView {
                /** 添加销售订单-行额外 事件 */
                addSalesOrderItemExtraEvent: Function;
                /** 移出销售订单-行额外 事件 */
                removeSalesOrderItemExtraEvent: Function;
                /** 删除销售订单-行额外 事件 */
                deleteSalesOrderItemExtraEvent: Function;
                /** 查看销售订单-行额外 事件 */
                viewSalesOrderItemExtraEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.uploader = new sap.ui.unified.FileUploader("", {
                        buttonOnly: true,
                        iconOnly: true,
                        multiple: false,
                        uploadOnChange: false,
                        width: "auto",
                        style: "Transparent",
                        change: function (oEvent: sap.ui.base.Event): void {
                            let files: File[] = oEvent.getParameter("files");
                            if (ibas.objects.isNull(files) || files.length === 0) {
                                return;
                            }
                            let fileData: FormData = new FormData();
                            fileData.append("file", files[0]);
                            that.fireViewEvents(that.addSalesOrderItemExtraEvent, fileData);
                        },
                    });
                    this.table = new sap.ui.table.Table("", {
                        toolbar: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.MenuButton("", {
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://add",
                                    text: ibas.i18n.prop("shell_data_add"),
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("bo_productspecification"),
                                                press: function (): void {
                                                    that.fireViewEvents(that.addSalesOrderItemExtraEvent, bo.ProductSpecification.BUSINESS_OBJECT_CODE);
                                                }
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("sales_extra_attachment"),
                                                press: function (): void {
                                                    document.getElementById(that.uploader.getId() + "-fu").click();
                                                }
                                            }),
                                        ]
                                    })
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_remove"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://less",
                                    press: function (): void {
                                        that.fireViewEvents(that.removeSalesOrderItemExtraEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.SalesOrderItem>(that.table)
                                        );
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteSalesOrderItemExtraEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.SalesOrderItem>(that.table).firstOrDefault()
                                        );
                                    }
                                }),
                                new sap.m.ToolbarSpacer(""),
                                this.uploader,
                            ]
                        }),
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        selectionMode: openui5.utils.toSelectionMode(ibas.emChooseType.SINGLE),
                        visibleRowCount: 6,
                        rowActionCount: 1,
                        rowActionTemplate: new sap.ui.table.RowAction({
                            items: [
                                new sap.ui.table.RowActionItem({
                                    icon: "sap-icon://display",
                                    press: function (oEvent: any): void {
                                        that.fireViewEvents(that.viewSalesOrderItemExtraEvent,
                                            // 获取当前对象
                                            this.getBindingContext().getObject()
                                        );
                                    },
                                }),
                            ]
                        }),
                        rows: "{/rows}",
                        columns: [
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesorderitemextra_extratype"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "extraType",
                                    formatter(data: any): any {
                                        if (data === app.EXTRA_ATTACHMENT) {
                                            return ibas.i18n.prop("sales_extra_attachment");
                                        }
                                        return ibas.businessobjects.describe(data);
                                    }
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesorderitemextra_extrakey"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "extraKey",
                                    formatter(data: any): any {
                                        if (ibas.objects.isNull(this.getBindingContext())) {
                                            return data;
                                        }
                                        let bindingdata: bo.SalesOrderItemExtra = this.getBindingContext().getObject();
                                        if (ibas.objects.isNull(bindingdata)) {
                                            return data;
                                        }
                                        if (bindingdata.extraType === app.EXTRA_ATTACHMENT) {
                                            return bindingdata.note;
                                        }
                                        return data;
                                    }
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesorderitemextra_quantity"),
                                template: new sap.m.Input("", {
                                    width: "100%",
                                    type: sap.m.InputType.Number
                                }).bindProperty("value", {
                                    path: "quantity",
                                    type: new openui5.datatype.Quantity(),
                                })
                            }),
                        ]
                    });
                    openui5.utils.changeSelectionStyle(this.table, ibas.emChooseType.SINGLE);
                    this.input = new sap.m.Input("", {
                        editable: false,
                    });
                    return new sap.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretchOnPhone: true,
                        horizontalScrolling: true,
                        verticalScrolling: true,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.ToolbarSpacer("", { width: "5px" }),
                                new sap.m.Label("", {
                                    text: ibas.i18n.prop("sales_summary"),
                                }),
                                this.input,
                                new sap.m.ToolbarSpacer("", { width: "5px" }),
                            ]
                        }),
                        content: [
                            this.table
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                // icon: "sap-icon://inspect-down",
                                press: function (): void {
                                    that.fireViewEvents(that.closeEvent);
                                }
                            }),
                        ]
                    });
                }
                private input: sap.m.Input;
                private table: sap.ui.table.Table;
                private uploader: sap.ui.unified.FileUploader;
                /** 显示数据 */
                showData(data: bo.SalesOrderItem): void {
                    let builder: ibas.StringBuilder = new ibas.StringBuilder();
                    builder.map(null, "");
                    builder.map(undefined, "");
                    builder.append("#");
                    builder.append(data.lineId);
                    builder.append(", ");
                    builder.append(data.itemCode);
                    builder.append("-");
                    builder.append(data.itemDescription);
                    builder.append(" * ");
                    builder.append(data.quantity ? data.quantity : 0);
                    builder.append(data.uom);
                    this.input.setValue(builder.toString());
                }
                /** 显示额外数据 */
                showExtraDatas(datas: bo.SalesOrderItemExtra[]): void {
                    this.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.table, datas);
                }
            }
        }
    }
}