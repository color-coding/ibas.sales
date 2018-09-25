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
             * 查看视图-销售报价
             */
            export class SalesQuoteViewView extends ibas.BOViewView implements app.ISalesQuoteViewView {
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.textAddress = new sap.m.TextArea("", {
                        rows: 3,
                        editable: false,
                    });
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: false,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_customercode") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "customerCode"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_customername") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "customerName"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_contactperson") }),
                            new sap.m.ex.BOText("", {
                                boText: "name",
                                boKey: "objectKey",
                                boCode: ibas.config.applyVariables(businesspartner.bo.BO_CODE_CONTACTPERSON),
                                repositoryName: businesspartner.bo.BO_REPOSITORY_BUSINESSPARTNER,
                                criteria: businesspartner.app.conditions.contactperson.create(businesspartner.bo.emBusinessPartnerType.CUSTOMER, "{customerCode}"),
                                bindingValue: {
                                    path: "contactPerson"
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_pricelist") }),
                            new sap.m.ex.BOText("", {
                                boText: "name",
                                boKey: "objectKey",
                                boCode: ibas.config.applyVariables(materials.bo.BO_CODE_MATERIALPRICELIST),
                                repositoryName: materials.bo.BO_REPOSITORY_MATERIALS,
                                bindingValue: {
                                    path: "priceList"
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_ordertype") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "orderType"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_reference1") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "reference1"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_reference2") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "reference2"
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_title_status") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_docentry") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "docEntry"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_documentstatus") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "documentStatus",
                                formatter(data: any): any {
                                    return ibas.enums.describe(ibas.emDocumentStatus, data);
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_canceled") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "canceled",
                                formatter(data: any): any {
                                    return ibas.enums.describe(ibas.emYesNo, data);
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_documentdate") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "documentDate",
                                type: new sap.ui.model.type.Date({
                                    pattern: "yyyy-MM-dd",
                                    strictParsing: true,
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_deliverydate") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "deliveryDate",
                                type: new sap.ui.model.type.Date({
                                    pattern: "yyyy-MM-dd",
                                    strictParsing: true,
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_consumer") }),
                            new sap.m.Text("", {
                                wrapping: false
                            }).bindProperty("text", {
                                path: "consumer"
                            }),
                        ]
                    });
                    this.tableSalesQuoteItem = new sap.ui.table.Table("", {
                        toolbar: new sap.m.Toolbar("", {
                            content: [
                            ]
                        }),
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 8),
                        rows: "{/rows}",
                        columns: [
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesquoteitem_lineid"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "lineId",
                                }),
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesquoteitem_itemcode"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "itemCode"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesquoteitem_itemdescription"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "itemDescription"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesquoteitem_warehouse"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "warehouse"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesquoteitem_quantity"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "quantity",
                                    type: new openui5.datatype.Quantity(),
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesquoteitem_uom"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "uom"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesquoteitem_price"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "price",
                                    type: new openui5.datatype.Price(),
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_salesquoteitem_linetotal"),
                                template: new sap.m.Text("", {
                                    wrapping: false,
                                }).bindProperty("text", {
                                    path: "lineTotal",
                                    type: new openui5.datatype.Sum(),
                                })
                            }),
                        ]
                    });
                    let formMiddle: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("bo_salesquoteitem") }),
                            this.tableSalesQuoteItem,
                        ]
                    });
                    let formBottom: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_dataowner") }),
                            new sap.m.Text("", {
                                bindingValue: {
                                    path: "dataOwner"
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress") }),
                            new sap.m.HBox("", {
                                width: "100%",
                                items: [
                                    new sap.m.Select("", {
                                        width: "100%",
                                        layoutData: new sap.m.FlexItemData("", {
                                            growFactor: 12
                                        }),
                                        change(oControlEvent: sap.ui.base.Event): void {
                                            let item: sap.ui.core.Item = oControlEvent.getParameters().selectedItem;
                                            let index: number = (<any>oControlEvent.getSource()).indexOfItem(item);
                                            let data: bo.ShippingAddress = (<any>item.getModel()).getData().shippingAddresss[index];
                                            if (!ibas.objects.isNull(data)) {
                                                // 显示摘要
                                                let builder: ibas.StringBuilder = new ibas.StringBuilder();
                                                builder.map(undefined, "");
                                                builder.map(null, "");
                                                builder.append(ibas.i18n.prop("bo_shippingaddress_consignee") + ": ");
                                                builder.append(data.consignee);
                                                builder.append(" ");
                                                builder.append(data.mobilePhone);
                                                builder.append("\n");
                                                builder.append(ibas.i18n.prop("bo_shippingaddress") + ": ");
                                                builder.append(data.country);
                                                builder.append(data.province);
                                                builder.append(data.city);
                                                builder.append(data.district);
                                                builder.append(data.street);
                                                builder.append("\n");
                                                builder.append(ibas.i18n.prop("bo_shippingaddress_trackingnumber") + ": ");
                                                builder.append(data.trackingNumber);
                                                builder.append(" ");
                                                builder.append(ibas.i18n.prop("bo_shippingaddress_expense") + ": ");
                                                builder.append(data.expense);
                                                builder.append(" ");
                                                builder.append(data.currency);
                                                that.textAddress.setValue(builder.toString());
                                            } else {
                                                that.textAddress.setValue(null);
                                            }
                                        }
                                    }).bindItems({
                                        path: "shippingAddresss",
                                        template: new sap.ui.core.ListItem("", {
                                            key: {
                                                path: "objectKey"
                                            },
                                            text: {
                                                path: "name"
                                            }
                                        })
                                    }),
                                ]
                            }),
                            new sap.m.Label("", {}),
                            this.textAddress,
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_remarks") }),
                            new sap.m.Text("", {
                                rows: 3,
                            }).bindProperty("text", {
                                path: "remarks",
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("sales_title_total") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_discount") }),
                            new sap.m.Text("", {
                                wrapping: false,
                            }).bindProperty("text", {
                                path: "discount",
                                type: new openui5.datatype.Percentage(),
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_discounttotal") }),
                            new sap.m.Text("", {
                                wrapping: false,
                            }).bindProperty("text", {
                                path: "discountTotal",
                                type: new openui5.datatype.Sum(),
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_shippingsexpensetotal") }),
                            new sap.m.Text("", {
                                wrapping: false,
                            }).bindProperty("text", {
                                path: "shippingsExpenseTotal",
                                type: new openui5.datatype.Sum(),
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_salesquote_documenttotal") }),
                            new sap.m.Text("", {
                                wrapping: false,
                            }).bindProperty("text", {
                                path: "documentTotal",
                                type: new openui5.datatype.Sum(),
                            }),
                            new sap.m.Text("", {
                                wrapping: false,
                            }).bindProperty("text", {
                                path: "documentCurrency"
                            }),
                        ]
                    });
                    this.layoutMain = new sap.ui.layout.VerticalLayout("", {
                        content: [
                            formTop,
                            formMiddle,
                            formBottom,
                        ]
                    });
                    this.page = new sap.m.Page("", {
                        showHeader: false,
                        subHeader: new sap.m.Bar("", {
                            contentLeft: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_edit"),
                                    visible: this.mode === ibas.emViewMode.VIEW ? false : true,
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
                                        ibas.servicesManager.showServices({
                                            proxy: new ibas.BOServiceProxy({
                                                data: (<any>that.layoutMain.getModel()).getData(),
                                                converter: new bo.DataConverter(),
                                            }),
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
                        content: [this.layoutMain]
                    });
                    return this.page;
                }
                private page: sap.m.Page;
                private layoutMain: sap.ui.layout.VerticalLayout;
                private tableSalesQuoteItem: sap.ui.table.Table;
                private textAddress: sap.m.TextArea;

                /** 显示数据 */
                showSalesQuote(data: bo.SalesQuote): void {
                    this.layoutMain.setModel(new sap.ui.model.json.JSONModel(data));
                    this.layoutMain.bindObject("/");
                }
                /** 显示数据 */
                showSalesQuoteItems(datas: bo.SalesQuoteItem[]): void {
                    this.tableSalesQuoteItem.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                }
            }
        }
    }
}