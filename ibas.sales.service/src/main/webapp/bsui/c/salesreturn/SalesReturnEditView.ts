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
             * 编辑视图-销售退货
             */
            export class SalesReturnEditView extends ibas.BOEditView implements app.ISalesReturnEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 添加销售退货-行事件 */
                addSalesReturnItemEvent: Function;
                /** 删除销售退货-行事件 */
                removeSalesReturnItemEvent: Function;
                /** 选择销售退货客户信息 */
                chooseSalesReturnCustomerEvent: Function;
                /** 选择销售退货联系人信息 */
                chooseSalesReturnContactPersonEvent: Function;
                /** 选择销售退货价格清单信息 */
                chooseSalesReturnPriceListEvent: Function;
                /** 选择销售退货-行物料主数据 */
                chooseSalesReturnItemMaterialEvent: Function;
                /** 选择销售退货-行 仓库 */
                chooseSalesReturnItemWarehouseEvent: Function;
                /** 选择销售退货-行 物料序列事件 */
                chooseSalesReturnItemMaterialSerialEvent: Function;
                /** 选择销售退货-行 物料批次事件 */
                chooseSalesReturnItemMaterialBatchEvent: Function;
                /** 选择销售退货项目-销售订单事件 */
                chooseSalesReturnSalesOrderEvent: Function;
                /** 选择销售退货项目-销售交货事件 */
                chooseSalesReturnSalesDeliveryEvent: Function;
                /** 收款销售退货 */
                receiptSalesReturnEvent: Function;
                /** 编辑地址事件 */
                editShippingAddressesEvent: Function;

                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_customercode") }),
                            new sap.extension.m.Input("", {
                                showValueHelp: true,
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseSalesReturnCustomerEvent);
                                }
                            }).bindProperty("bindingValue", {
                                path: "customerCode",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 20
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_customername") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "customerName",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_contactperson") }),
                            new sap.extension.m.RepositoryInput("", {
                                showValueHelp: true,
                                repository: businesspartner.bo.BORepositoryBusinessPartner,
                                dataInfo: {
                                    type: businesspartner.bo.ContactPerson,
                                    key: businesspartner.bo.ContactPerson.PROPERTY_OBJECTKEY_NAME,
                                    text: businesspartner.bo.ContactPerson.PROPERTY_NAME_NAME
                                },
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseSalesReturnContactPersonEvent);
                                },
                            }).bindProperty("bindingValue", {
                                path: "contactPerson",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_pricelist") }),
                            new sap.extension.m.RepositoryInput("", {
                                showValueHelp: true,
                                repository: materials.bo.BORepositoryMaterials,
                                dataInfo: {
                                    type: materials.bo.MaterialPriceList,
                                    key: materials.bo.MaterialPriceList.PROPERTY_OBJECTKEY_NAME,
                                    text: materials.bo.MaterialPriceList.PROPERTY_NAME_NAME
                                },
                                valueHelpRequest: function (): void {
                                    that.fireViewEvents(that.chooseSalesReturnPriceListEvent);
                                },
                            }).bindProperty("bindingValue", {
                                path: "priceList",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_ordertype") }),
                            new sap.extension.m.PropertySelect("", {
                                dataInfo: {
                                    code: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                                },
                                propertyName: "orderType",
                            }).bindProperty("bindingValue", {
                                path: "orderType",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 8
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_reference1") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "reference1",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_reference2") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "reference2",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 200
                                })
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_title_status") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_docentry") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "docEntry",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentstatus") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: ibas.emDocumentStatus
                            }).bindProperty("bindingValue", {
                                path: "documentStatus",
                                type: new sap.extension.data.DocumentStatus()
                            }),
                            new sap.extension.m.TipsCheckBox("", {
                                text: ibas.i18n.prop("bo_receipt_canceled"),
                                tipsOnSelection: ibas.i18n.prop(["shell_data_cancel", "shell_data_status"]),
                            }).bindProperty("bindingValue", {
                                path: "canceled",
                                type: new sap.extension.data.YesNo()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentdate") }),
                            new sap.extension.m.DatePicker("", {
                            }).bindProperty("bindingValue", {
                                path: "documentDate",
                                type: new sap.extension.data.Date()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_deliverydate") }),
                            new sap.extension.m.DatePicker("", {
                            }).bindProperty("bindingValue", {
                                path: "deliveryDate",
                                type: new sap.extension.data.Date()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_consumer") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "consumer",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                        ]
                    });
                    let formSalesReturnItem: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_salesreturnitem") }),
                            this.tableSalesReturnItem = new sap.extension.table.DataTable("", {
                                enableSelectAll: false,
                                visibleRowCount: sap.extension.table.visibleRowCount(8),
                                dataInfo: {
                                    code: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                                    name: bo.SalesReturnItem.name
                                },
                                toolbar: new sap.m.Toolbar("", {
                                    content: [
                                        new sap.m.MenuButton("", {
                                            type: sap.m.ButtonType.Transparent,
                                            icon: "sap-icon://add",
                                            text: ibas.i18n.prop("shell_data_add"),
                                            menu: new sap.m.Menu("", {
                                                items: [
                                                    new sap.m.MenuItem("", {
                                                        text: ibas.i18n.prop("shell_data_add_line"),
                                                        press: function (): void {
                                                            that.fireViewEvents(that.addSalesReturnItemEvent);
                                                        }
                                                    }),
                                                    new sap.m.MenuItem("", {
                                                        text: ibas.i18n.prop("bo_salesorder"),
                                                        press: function (): void {
                                                            that.fireViewEvents(that.chooseSalesReturnSalesOrderEvent);
                                                        }
                                                    }),
                                                    new sap.m.MenuItem("", {
                                                        text: ibas.i18n.prop("bo_salesdelivery"),
                                                        press: function (): void {
                                                            that.fireViewEvents(that.chooseSalesReturnSalesDeliveryEvent);
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
                                                that.fireViewEvents(that.removeSalesReturnItemEvent, that.tableSalesReturnItem.getSelecteds());
                                            }
                                        }),
                                        new sap.m.ToolbarSeparator(""),
                                        new sap.m.MenuButton("", {
                                            icon: "sap-icon://tags",
                                            text: ibas.strings.format("{0}/{1}",
                                                ibas.i18n.prop("sales_material_batch"), ibas.i18n.prop("sales_material_serial")),
                                            menu: new sap.m.Menu("", {
                                                items: [
                                                    new sap.m.MenuItem("", {
                                                        text: ibas.i18n.prop("sales_material_batch"),
                                                        press: function (): void {
                                                            that.fireViewEvents(that.chooseSalesReturnItemMaterialBatchEvent);
                                                        }
                                                    }),
                                                    new sap.m.MenuItem("", {
                                                        text: ibas.i18n.prop("sales_material_serial"),
                                                        press: function (): void {
                                                            that.fireViewEvents(that.chooseSalesReturnItemMaterialSerialEvent);
                                                        }
                                                    }),
                                                ]
                                            })
                                        }),
                                        new sap.m.ToolbarSpacer(""),
                                        new sap.m.Label("", {
                                            wrapping: false,
                                            text: ibas.i18n.prop("bo_warehouse")
                                        }),
                                        this.selectWarehouse = new component.WarehouseSelect("", {
                                            width: "auto"
                                        })
                                    ]
                                }),
                                rows: "{/rows}",
                                columns: [
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_lineid"),
                                        template: new sap.extension.m.Text("", {
                                        }).bindProperty("bindingValue", {
                                            path: "lineId",
                                            type: new sap.extension.data.Numeric()
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_linestatus"),
                                        template: new sap.extension.m.EnumSelect("", {
                                            enumType: ibas.emDocumentStatus
                                        }).bindProperty("bindingValue", {
                                            path: "lineStatus",
                                            type: new sap.extension.data.DocumentStatus()
                                        }).bindProperty("editable", {
                                            path: "parentLineSign",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data);
                                            }
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_itemcode"),
                                        template: new sap.extension.m.Input("", {
                                            showValueHelp: true,
                                            valueHelpRequest: function (): void {
                                                that.fireViewEvents(that.chooseSalesReturnItemMaterialEvent,
                                                    // 获取当前对象
                                                    this.getBindingContext().getObject()
                                                );
                                            }
                                        }).bindProperty("bindingValue", {
                                            path: "itemCode",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 20
                                            })
                                        }).bindProperty("editable", {
                                            path: "parentLineSign",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data);
                                            }
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_itemdescription"),
                                        width: "16rem",
                                        template: new sap.extension.m.Text("", {
                                        }).bindProperty("bindingValue", {
                                            parts: [
                                                {
                                                    path: "itemDescription",
                                                    type: new sap.extension.data.Alphanumeric()
                                                },
                                                {
                                                    path: "itemSign",
                                                    type: new sap.extension.data.Alphanumeric(),
                                                    formatter(data: string): string {
                                                        return ibas.strings.isEmpty(data) ? "" : ibas.strings.format(" ({0})", data);
                                                    }
                                                },
                                            ]
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_warehouse"),
                                        template: new sap.extension.m.RepositoryInput("", {
                                            showValueHelp: true,
                                            repository: materials.bo.BORepositoryMaterials,
                                            dataInfo: {
                                                type: materials.bo.Warehouse,
                                                key: materials.bo.Warehouse.PROPERTY_CODE_NAME,
                                                text: materials.bo.Warehouse.PROPERTY_NAME_NAME
                                            },
                                            valueHelpRequest: function (): void {
                                                that.fireViewEvents(that.chooseSalesReturnItemWarehouseEvent,
                                                    // 获取当前对象
                                                    this.getBindingContext().getObject()
                                                );
                                            }
                                        }).bindProperty("bindingValue", {
                                            path: "warehouse",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 8
                                            })
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_quantity"),
                                        template: new sap.extension.m.Input("", {
                                            type: sap.m.InputType.Number
                                        }).bindProperty("bindingValue", {
                                            path: "quantity",
                                            type: new sap.extension.data.Quantity()
                                        }).bindProperty("editable", {
                                            path: "parentLineSign",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data);
                                            }
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_uom"),
                                        template: new sap.extension.m.Text("", {
                                        }).bindProperty("bindingValue", {
                                            path: "uom",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 8
                                            })
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_price"),
                                        template: new sap.extension.m.Input("", {
                                            type: sap.m.InputType.Number
                                        }).bindProperty("bindingValue", {
                                            path: "price",
                                            type: new sap.extension.data.Price()
                                        }).bindProperty("editable", {
                                            path: "parentLineSign",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data);
                                            }
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_linetotal"),
                                        template: new sap.extension.m.Text("", {
                                        }).bindProperty("bindingValue", {
                                            path: "lineTotal",
                                            type: new sap.extension.data.Sum()
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_reference1"),
                                        template: new sap.extension.m.Input("", {
                                        }).bindProperty("bindingValue", {
                                            path: "reference1",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 100
                                            })
                                        }),
                                    }),
                                    new sap.extension.table.DataColumn("", {
                                        label: ibas.i18n.prop("bo_salesreturnitem_reference2"),
                                        template: new sap.extension.m.Input("", {
                                        }).bindProperty("bindingValue", {
                                            path: "reference2",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 200
                                            })
                                        }),
                                    }),
                                ]
                            })
                        ]
                    });
                    let formBottom: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_dataowner") }),
                            new sap.extension.m.DataOwnerInput("", {
                                showValueHelp: true,
                            }).bindProperty("bindingValue", {
                                path: "dataOwner",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_project") }),
                            new sap.extension.m.SelectionInput("", {
                                showValueHelp: true,
                                repository: accounting.bo.BORepositoryAccounting,
                                dataInfo: {
                                    type: accounting.bo.Project,
                                    key: accounting.bo.Project.PROPERTY_CODE_NAME,
                                    text: accounting.bo.Project.PROPERTY_NAME_NAME,
                                },
                                criteria: [
                                    new ibas.Condition(accounting.bo.Project.PROPERTY_ACTIVATED_NAME, ibas.emConditionOperation.EQUAL, ibas.emYesNo.YES.toString())
                                ]
                            }).bindProperty("bindingValue", {
                                path: "project",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 8
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_organization") }),
                            new sap.extension.m.DataOrganizationInput("", {
                                showValueHelp: true,
                            }).bindProperty("bindingValue", {
                                path: "organization",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 8
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress") }),
                            new component.ShippingAddressSelect("", {
                                editSelected(event: sap.ui.base.Event): void {
                                    that.fireViewEvents(that.editShippingAddressesEvent);
                                }
                            }).bindProperty("bindingValue", {
                                path: "shippingAddresss",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_remarks") }),
                            new sap.extension.m.TextArea("", {
                                rows: 3,
                            }).bindProperty("bindingValue", {
                                path: "remarks",
                                type: new sap.extension.data.Alphanumeric()
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_title_total") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_discounttotal") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Number
                            }).bindProperty("bindingValue", {
                                path: "discountTotal",
                                type: new sap.extension.data.Sum()
                            }),
                            new sap.extension.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("bindingValue", {
                                path: "discount",
                                type: new sap.extension.data.Percentage()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_shippingsexpensetotal") + ibas.i18n.prop("sales_inclusion") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Number
                            }).bindProperty("bindingValue", {
                                path: "shippingsExpenseTotal",
                                type: new sap.extension.data.Sum()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesdelivery_documenttaxtotal") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Number
                            }).bindProperty("bindingValue", {
                                path: "documentTaxTotal",
                                type: new sap.extension.data.Sum()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documenttotal") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Number
                            }).bindProperty("bindingValue", {
                                path: "documentTotal",
                                type: new sap.extension.data.Sum()
                            }),
                            new sap.extension.m.Input("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "documentCurrency",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 8
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_paidtotal") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                                type: sap.m.InputType.Number
                            }).bindProperty("bindingValue", {
                                path: "paidTotal",
                                type: new sap.extension.data.Sum()
                            }),
                        ]
                    });
                    return this.page = new sap.extension.m.DataPage("", {
                        showHeader: false,
                        dataInfo: {
                            code: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                        },
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_save"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://save",
                                    press: function (): void {
                                        that.fireViewEvents(that.saveDataEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent);
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.MenuButton("", {
                                    text: ibas.strings.format("{0}/{1}",
                                        ibas.i18n.prop("shell_data_new"), ibas.i18n.prop("shell_data_clone")),
                                    icon: "sap-icon://create",
                                    type: sap.m.ButtonType.Transparent,
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_new"),
                                                icon: "sap-icon://create",
                                                press: function (): void {
                                                    // 创建新的对象
                                                    that.fireViewEvents(that.createDataEvent, false);
                                                }
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("shell_data_clone"),
                                                icon: "sap-icon://copy",
                                                press: function (): void {
                                                    // 复制当前对象
                                                    that.fireViewEvents(that.createDataEvent, true);
                                                }
                                            }),
                                        ],
                                    })
                                }),
                            ]
                        }),
                        content: [
                            formTop,
                            formSalesReturnItem,
                            formBottom,
                        ]
                    });
                }

                private page: sap.extension.m.Page;
                private tableSalesReturnItem: sap.extension.table.Table;
                private selectWarehouse: component.WarehouseSelect;
                get defaultWarehouse(): string {
                    return this.selectWarehouse.getSelectedKey();
                }
                set defaultWarehouse(value: string) {
                    this.selectWarehouse.setSelectedKey(value);
                }
                /** 显示数据 */
                showSalesReturn(data: bo.SalesReturn): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    // 改变页面状态
                    sap.extension.pages.changeStatus(this.page);
                }
                /** 显示数据-销售交货-行 */
                showSalesReturnItems(datas: bo.SalesReturnItem[]): void {
                    this.tableSalesReturnItem.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
            }
        }
    }
}