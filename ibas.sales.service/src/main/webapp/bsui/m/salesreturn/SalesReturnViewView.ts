/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace ui {
        export namespace m {
            /** 查看视图-销售退货 */
            export class SalesReturnViewView extends ibas.BOViewView implements app.ISalesReturnViewView {
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    return this.page = new sap.extension.uxap.DataObjectPageLayout("", {
                        dataInfo: {
                            code: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                        },
                        userFieldsMode: "text",
                        showFooter: false,
                        headerTitle: new sap.uxap.ObjectPageHeader("", {
                            objectTitle: {
                                path: "docEntry",
                                type: new sap.extension.data.Numeric(),
                                formatter(data: string): any {
                                    return ibas.strings.format("# {0}", data ? data : "0");
                                }
                            },
                            objectSubtitle: {
                                parts: [
                                    {
                                        path: "customerName",
                                        type: new sap.extension.data.Alphanumeric(),
                                    },
                                    {
                                        path: "customerCode",
                                        type: new sap.extension.data.Alphanumeric(),
                                        formatter(data: string): any {
                                            if (ibas.strings.isEmpty(data)) {
                                                return "";
                                            }
                                            return ibas.strings.format("({0})", data);
                                        }
                                    }
                                ],
                            },
                            sideContentButton: new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_data_edit"),
                                type: sap.m.ButtonType.Transparent,
                                icon: "sap-icon://edit",
                                press(): void {
                                    that.fireViewEvents(that.editDataEvent);
                                }
                            }),
                            actions: [
                                new sap.uxap.ObjectPageHeaderActionButton("", {
                                    hideText: true,
                                    importance: sap.uxap.Importance.Medium,
                                    text: ibas.i18n.prop("shell_data_services"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://action",
                                    press(event: sap.ui.base.Event): void {
                                        ibas.servicesManager.showServices({
                                            proxy: new ibas.BOServiceProxy({
                                                data: that.page.getModel().getData(),
                                                converter: new bo.DataConverter(),
                                            }),
                                            displayServices(services: ibas.IServiceAgent[]): void {
                                                if (ibas.objects.isNull(services) || services.length === 0) {
                                                    return;
                                                }
                                                let actionSheet: sap.m.ActionSheet = new sap.m.ActionSheet("", {
                                                    placement: sap.m.PlacementType.Bottom,
                                                    buttons: {
                                                        path: "/",
                                                        template: new sap.m.Button("", {
                                                            type: sap.m.ButtonType.Transparent,
                                                            text: {
                                                                path: "name",
                                                                type: new sap.extension.data.Alphanumeric(),
                                                                formatter(data: string): string {
                                                                    return data ? ibas.i18n.prop(data) : "";
                                                                }
                                                            },
                                                            icon: {
                                                                path: "icon",
                                                                type: new sap.extension.data.Alphanumeric(),
                                                                formatter(data: string): string {
                                                                    return data ? data : "sap-icon://e-care";
                                                                }
                                                            },
                                                            press(this: sap.m.Button): void {
                                                                let service: ibas.IServiceAgent = this.getBindingContext().getObject();
                                                                if (service) {
                                                                    service.run();
                                                                }
                                                            }
                                                        })
                                                    }
                                                });
                                                actionSheet.setModel(new sap.extension.model.JSONModel(services));
                                                actionSheet.openBy(event.getSource());
                                            }
                                        });
                                    }
                                }),
                            ],
                        }).addStyleClass("sapUiNoContentPadding"),
                        headerContent: [
                            new sap.extension.m.ObjectApprovalStatus("", {
                                title: ibas.i18n.prop("bo_salesreturn_approvalstatus"),
                                enumValue: {
                                    path: "approvalStatus",
                                    type: new sap.extension.data.ApprovalStatus(),
                                },
                                visible: {
                                    path: "approvalStatus",
                                    formatter(data: ibas.emApprovalStatus): boolean {
                                        return ibas.objects.isNull(data) || data === ibas.emApprovalStatus.UNAFFECTED ? false : true;
                                    }
                                }
                            }),
                            new sap.extension.m.ObjectDocumentCanceledStatus("", {
                                title: ibas.i18n.prop("bo_salesreturn_documentstatus"),
                                canceledStatus: {
                                    path: "canceled",
                                    type: new sap.extension.data.YesNo(),
                                },
                                documentStatus: {
                                    path: "documentStatus",
                                    type: new sap.extension.data.DocumentStatus(),
                                },
                            }),
                            new sap.extension.m.ObjectAttribute("", {
                                title: ibas.i18n.prop("bo_salesreturn_documentdate"),
                                bindingValue: {
                                    path: "documentDate",
                                    type: new sap.extension.data.Date(),
                                },
                            }),
                            new sap.extension.m.ObjectAttribute("", {
                                title: ibas.i18n.prop("bo_salesreturn_documenttotal"),
                                bindingValue: {
                                    parts: [
                                        {
                                            path: "documentTotal",
                                            type: new sap.extension.data.Sum(),
                                        },
                                        {
                                            path: "documentCurrency",
                                            type: new sap.extension.data.Alphanumeric()
                                        },
                                    ]
                                }
                            }),
                        ],
                        sections: [
                            new sap.uxap.ObjectPageSection("", {
                                title: ibas.i18n.prop("sales_title_general"),
                                subSections: [
                                    new sap.uxap.ObjectPageSubSection("", {
                                        blocks: [
                                            new sap.ui.layout.form.SimpleForm("", {
                                                editable: false,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_customercode") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "customerCode",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_customername") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "customerName",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_contactperson") }),
                                                    new sap.extension.m.RepositoryText("", {
                                                        repository: businesspartner.bo.BORepositoryBusinessPartner,
                                                        dataInfo: {
                                                            type: businesspartner.bo.ContactPerson,
                                                            key: businesspartner.bo.ContactPerson.PROPERTY_OBJECTKEY_NAME,
                                                            text: businesspartner.bo.ContactPerson.PROPERTY_NAME_NAME
                                                        },
                                                    }).bindProperty("bindingValue", {
                                                        path: "contactPerson",
                                                        type: new sap.extension.data.Numeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_pricelist") }),
                                                    new sap.extension.m.RepositoryText("", {
                                                        repository: materials.bo.BORepositoryMaterials,
                                                        dataInfo: {
                                                            type: materials.bo.MaterialPriceList,
                                                            key: materials.bo.MaterialPriceList.PROPERTY_OBJECTKEY_NAME,
                                                            text: materials.bo.MaterialPriceList.PROPERTY_NAME_NAME
                                                        },
                                                    }).bindProperty("bindingValue", {
                                                        path: "priceList",
                                                        type: new sap.extension.data.Numeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_reference1") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "reference1",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_reference2") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "reference2",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                ]
                                            }).addStyleClass("sapUxAPObjectPageSubSectionAlignContent"),
                                        ]
                                    }),
                                ]
                            }),
                            new sap.uxap.ObjectPageSection("", {
                                title: ibas.i18n.prop("sales_title_status"),
                                subSections: [
                                    new sap.uxap.ObjectPageSubSection("", {
                                        blocks: [
                                            new sap.ui.layout.form.SimpleForm("", {
                                                editable: false,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentstatus") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        parts: [
                                                            {
                                                                path: "documentStatus",
                                                                type: new sap.extension.data.DocumentStatus(true)
                                                            },
                                                            {
                                                                path: "canceled",
                                                                type: new sap.extension.data.YesNo(true),
                                                                formatter(data: ibas.emYesNo): string {
                                                                    return ibas.emYesNo.YES === data ? ibas.i18n.prop("bo_salesreturn_canceled") : "";
                                                                },
                                                            },
                                                        ]
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentdate") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "documentDate",
                                                        type: new sap.extension.data.Date()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_deliverydate") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "deliveryDate",
                                                        type: new sap.extension.data.Date()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_ordertype") }),
                                                    new sap.extension.m.PropertyText("", {
                                                        dataInfo: {
                                                            code: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                                                        },
                                                        propertyName: "orderType",
                                                    }).bindProperty("bindingValue", {
                                                        path: "orderType",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_consumer") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "consumer",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                ]
                                            }).addStyleClass("sapUxAPObjectPageSubSectionAlignContent"),
                                        ]
                                    }),
                                ]
                            }),
                            new sap.uxap.ObjectPageSection("", {
                                title: ibas.i18n.prop("bo_salesreturnitem"),
                                subSections: [
                                    new sap.uxap.ObjectPageSubSection("", {
                                        blocks: [
                                            this.listSalesReturnItem = new sap.extension.m.List("", {
                                                inset: false,
                                                width: "auto",
                                                growing: false,
                                                mode: sap.m.ListMode.None,
                                                swipeDirection: sap.m.SwipeDirection.RightToLeft,
                                                backgroundDesign: sap.m.BackgroundDesign.Transparent,
                                                showNoData: true,
                                                swipeContent: new sap.m.FlexBox("", {
                                                    height: "100%",
                                                    alignItems: sap.m.FlexAlignItems.Start,
                                                    justifyContent: sap.m.FlexJustifyContent.End,
                                                    items: [
                                                        new sap.m.SegmentedButton("", {
                                                            width: "3rem",
                                                            items: [
                                                                new sap.m.SegmentedButtonItem("", {
                                                                    width: "3rem",
                                                                    icon: "sap-icon://sap-box",
                                                                    press(oEvent: any): void {

                                                                    }
                                                                }),
                                                            ]
                                                        }),
                                                    ]
                                                }).addStyleClass("sapUiSmallMarginTop"),
                                                items: {
                                                    path: "/rows",
                                                    template: new sap.extension.m.DataObjectListItem("", {
                                                        dataInfo: {
                                                            code: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                                                            name: bo.SalesReturnItem.name
                                                        },
                                                        title: "# {lineId}",
                                                        number: {
                                                            path: "lineStatus",
                                                            type: new sap.extension.data.DocumentStatus(true),
                                                        },
                                                        attributes: [
                                                            new sap.extension.m.ObjectAttribute("", {
                                                                title: ibas.i18n.prop("bo_material"),
                                                                bindingValue: "{itemDescription} ({itemCode})"
                                                            }),
                                                            new sap.extension.m.RepositoryObjectAttribute("", {
                                                                title: ibas.i18n.prop("bo_warehouse"),
                                                                bindingValue: {
                                                                    path: "warehouse",
                                                                    type: new sap.extension.data.Alphanumeric(),
                                                                },
                                                                repository: materials.bo.BORepositoryMaterials,
                                                                dataInfo: {
                                                                    type: materials.bo.Warehouse,
                                                                    key: materials.bo.Warehouse.PROPERTY_CODE_NAME,
                                                                    text: materials.bo.Warehouse.PROPERTY_NAME_NAME
                                                                },
                                                            }),
                                                            new sap.extension.m.ObjectAttribute("", {
                                                                title: ibas.i18n.prop("bo_salesreturnitem_quantity"),
                                                                bindingValue: {
                                                                    parts: [
                                                                        {
                                                                            path: "quantity",
                                                                            type: new sap.extension.data.Quantity(),
                                                                        },
                                                                        {
                                                                            path: "uom",
                                                                            type: new sap.extension.data.Alphanumeric()
                                                                        },
                                                                    ]
                                                                }
                                                            }),
                                                            new sap.extension.m.ObjectAttribute("", {
                                                                title: ibas.i18n.prop("bo_salesreturnitem_price"),
                                                                bindingValue: {
                                                                    parts: [
                                                                        {
                                                                            path: "price",
                                                                            type: new sap.extension.data.Price(),
                                                                        },
                                                                        {
                                                                            path: "currency",
                                                                            type: new sap.extension.data.Alphanumeric(),
                                                                        },
                                                                    ]
                                                                }
                                                            }),
                                                            new sap.extension.m.ObjectAttribute("", {
                                                                title: ibas.i18n.prop("bo_salesreturnitem_linetotal"),
                                                                bindingValue: {
                                                                    parts: [
                                                                        {
                                                                            path: "lineTotal",
                                                                            type: new sap.extension.data.Sum(),
                                                                        },
                                                                        {
                                                                            path: "currency",
                                                                            type: new sap.extension.data.Alphanumeric(),
                                                                        },
                                                                    ]
                                                                }
                                                            }),
                                                            new sap.extension.m.ObjectAttribute("", {
                                                                title: ibas.i18n.prop("bo_salesreturnitem_reference1"),
                                                                bindingValue: {
                                                                    path: "reference1",
                                                                    type: new sap.extension.data.Alphanumeric(),
                                                                }
                                                            }),
                                                            new sap.extension.m.ObjectAttribute("", {
                                                                title: ibas.i18n.prop("bo_salesreturnitem_reference2"),
                                                                bindingValue: {
                                                                    path: "reference2",
                                                                    type: new sap.extension.data.Alphanumeric(),
                                                                }
                                                            }),
                                                        ],
                                                        type: sap.m.ListType.Active,
                                                        press: function (oEvent: sap.ui.base.Event): void {
                                                            that.viewSalesReturnItem(this.getBindingContext().getObject());
                                                        },
                                                    })
                                                }
                                            }).addStyleClass("sapUxAPObjectPageSubSectionAlignContent"),
                                            new sap.ui.layout.form.SimpleForm("", {
                                                editable: false,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentlinetotal") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        parts: [
                                                            {
                                                                path: "itemsLineTotal",
                                                                type: new sap.extension.data.Sum()
                                                            },
                                                            {
                                                                path: "itemsTaxTotal",
                                                                type: new sap.extension.data.Sum()
                                                            },
                                                        ],
                                                        formatter(lineTotal: number, taxTotal: number): number {
                                                            return sap.extension.data.formatValue(sap.extension.data.Sum,
                                                                ibas.numbers.valueOf(lineTotal) - ibas.numbers.valueOf(taxTotal)
                                                                , "string");
                                                        },
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentlinediscount") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "discount",
                                                        type: new sap.extension.data.Percentage()
                                                    }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        parts: [
                                                            {
                                                                path: "itemsLineTotal",
                                                                type: new sap.extension.data.Sum()
                                                            },
                                                            {
                                                                path: "itemsTaxTotal",
                                                                type: new sap.extension.data.Sum()
                                                            },
                                                            {
                                                                path: "discount",
                                                                type: new sap.extension.data.Percentage()
                                                            },
                                                        ],
                                                        formatter(lineTotal: number, taxTotal: number, discount: number): number {
                                                            return sap.extension.data.formatValue(sap.extension.data.Sum,
                                                                ibas.numbers.valueOf(discount) === 1 ? 0 :
                                                                    -ibas.numbers.valueOf(lineTotal) + (ibas.numbers.valueOf(taxTotal)) * (1 - ibas.numbers.valueOf(discount))
                                                                , "string");
                                                        },
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_shippingsexpensetotal") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "shippingsExpenseTotal",
                                                        type: new sap.extension.data.Sum()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documenttaxtotal") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        parts: [
                                                            {
                                                                path: "itemsTaxTotal",
                                                                type: new sap.extension.data.Sum()
                                                            },
                                                            {
                                                                path: "shippingsTaxTotal",
                                                                type: new sap.extension.data.Sum()
                                                            },
                                                        ],
                                                        formatter(lineTax: number, shippingTax: number): number {
                                                            return sap.extension.data.formatValue(sap.extension.data.Sum,
                                                                ibas.numbers.valueOf(lineTax) + ibas.numbers.valueOf(shippingTax)
                                                                , "string");
                                                        },
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documenttotal") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "documentTotal",
                                                        type: new sap.extension.data.Sum()
                                                    }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "documentCurrency",
                                                        type: new sap.extension.data.Alphanumeric({
                                                            maxLength: 8
                                                        })
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_paidtotal") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "paidTotal",
                                                        type: new sap.extension.data.Sum()
                                                    }),
                                                ]
                                            }).addStyleClass("sapUxAPObjectPageSubSectionAlignContent"),
                                        ]
                                    }),
                                ]
                            }),
                            new sap.uxap.ObjectPageSection("", {
                                title: ibas.i18n.prop("bo_shippingaddress"),
                                subSections: [
                                    new sap.uxap.ObjectPageSubSection("", {
                                        blocks: [
                                            new sap.ui.layout.form.SimpleForm("", {
                                                editable: false,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress") }),
                                                    new component.ShippingAddressSelect("", {
                                                        editable: false,
                                                    }).bindProperty("bindingValue", {
                                                        path: "shippingAddresss",
                                                    }),
                                                ]
                                            }).addStyleClass("sapUxAPObjectPageSubSectionAlignContent"),
                                        ]
                                    }),
                                ]
                            }),
                            new sap.uxap.ObjectPageSection("", {
                                title: ibas.i18n.prop("sales_title_others"),
                                subSections: [
                                    new sap.uxap.ObjectPageSubSection("", {
                                        blocks: [
                                            new sap.ui.layout.form.SimpleForm("", {
                                                editable: false,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_dataowner") }),
                                                    new sap.extension.m.UserText("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "dataOwner",
                                                        type: new sap.extension.data.Numeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_project") }),
                                                    new sap.extension.m.RepositoryText("", {
                                                        repository: accounting.bo.BORepositoryAccounting,
                                                        dataInfo: {
                                                            type: accounting.bo.Project,
                                                            key: accounting.bo.Project.PROPERTY_CODE_NAME,
                                                            text: accounting.bo.Project.PROPERTY_NAME_NAME,
                                                        },
                                                    }).bindProperty("bindingValue", {
                                                        path: "project",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_organization") }),
                                                    new sap.extension.m.OrganizationText("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "organization",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_remarks") }),
                                                    new sap.extension.m.Text("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "remarks",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                ]
                                            }).addStyleClass("sapUxAPObjectPageSubSectionAlignContent"),
                                        ]
                                    }),
                                ]
                            }),
                        ]
                    });
                }

                private page: sap.extension.uxap.ObjectPageLayout;
                private listSalesReturnItem: sap.extension.m.List;

                /** 显示数据 */
                showSalesReturn(data: bo.SalesReturn): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    // 改变页面状态
                    sap.extension.pages.changeStatus(this.page);
                }
                /** 显示数据（销售退货-行） */
                showSalesReturnItems(datas: bo.SalesReturnItem[]): void {
                    this.listSalesReturnItem.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
                /** 编辑数据行（销售退货-行） */
                viewSalesReturnItem(data: bo.SalesReturnItem): void {
                    let that: this = this;
                    let editForm: sap.m.Dialog = new sap.m.Dialog("", {
                        title: ibas.strings.format("{0} - {1}", ibas.i18n.prop("bo_salesreturnitem"), data.lineId),
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretch: ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM) === ibas.emPlantform.PHONE ? true : false,
                        horizontalScrolling: true,
                        verticalScrolling: true,
                        content: [
                            new sap.extension.layout.DataSimpleForm("", {
                                editable: false,
                                userFieldsTitle: "",
                                userFieldsMode: "text",
                                dataInfo: {
                                    code: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                                    name: bo.SalesReturnItem.name,
                                },
                                content: [
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_lineid") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        path: "lineId",
                                        type: new sap.extension.data.Numeric(),
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_linestatus") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        path: "lineStatus",
                                        type: new sap.extension.data.DocumentStatus(true),
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_itemcode") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        path: "itemCode",
                                        type: new sap.extension.data.Alphanumeric(),
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_itemdescription") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        path: "itemDescription",
                                        type: new sap.extension.data.Alphanumeric()
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_warehouse") }),
                                    new sap.extension.m.RepositoryText("", {
                                        repository: materials.bo.BORepositoryMaterials,
                                        dataInfo: {
                                            type: materials.bo.Warehouse,
                                            key: materials.bo.Warehouse.PROPERTY_CODE_NAME,
                                            text: materials.bo.Warehouse.PROPERTY_NAME_NAME
                                        },
                                    }).bindProperty("bindingValue", {
                                        path: "warehouse",
                                        type: new sap.extension.data.Alphanumeric()
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_quantity") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        parts: [
                                            {
                                                path: "quantity",
                                                type: new sap.extension.data.Quantity(),
                                            },
                                            {
                                                path: "uom",
                                                type: new sap.extension.data.Alphanumeric(),
                                            }
                                        ]
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_price") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        parts: [
                                            {
                                                path: "price",
                                                type: new sap.extension.data.Price(),
                                            },
                                            {
                                                path: "currency",
                                                type: new sap.extension.data.Alphanumeric(),
                                            }
                                        ]
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_linetotal") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        parts: [
                                            {
                                                path: "lineTotal",
                                                type: new sap.extension.data.Sum(),
                                            },
                                            {
                                                path: "currency",
                                                type: new sap.extension.data.Alphanumeric(),
                                            }
                                        ]
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_tax") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        parts: [
                                            {
                                                path: "tax",
                                                type: new sap.extension.data.Alphanumeric(),
                                            },
                                            {
                                                path: "taxRate",
                                                type: new sap.extension.data.Rate(),
                                            }
                                        ]
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_reference1") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        path: "reference1",
                                        type: new sap.extension.data.Alphanumeric(),
                                    }),
                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_reference2") }),
                                    new sap.extension.m.Text("", {
                                    }).bindProperty("bindingValue", {
                                        path: "reference2",
                                        type: new sap.extension.data.Alphanumeric(),
                                    }),
                                ],
                            }),
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                icon: "sap-icon://arrow-left",
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    let form: any = editForm.getContent()[0];
                                    if (form instanceof sap.extension.layout.SimpleForm) {
                                        let datas: any = that.listSalesReturnItem.getModel().getData("rows");
                                        if (datas instanceof Array && datas.length > 0) {
                                            let index: number = datas.indexOf(form.getModel().getData());
                                            index = index <= 0 ? datas.length - 1 : index - 1;
                                            form.setModel(new sap.extension.model.JSONModel(datas[index]));
                                            editForm.setTitle(ibas.strings.format("{0} - {1}", ibas.i18n.prop("bo_salesreturnitem"), datas[index].lineId));
                                        } else {
                                            that.application.viewShower.messages({
                                                title: that.title,
                                                type: ibas.emMessageType.WARNING,
                                                message: ibas.i18n.prop(["shell_please", "shell_data_add_line"]),
                                            });
                                        }
                                    }
                                }
                            }),
                            new sap.m.Button("", {
                                icon: "sap-icon://arrow-right",
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    let form: any = editForm.getContent()[0];
                                    if (form instanceof sap.extension.layout.SimpleForm) {
                                        let datas: any = that.listSalesReturnItem.getModel().getData("rows");
                                        if (datas instanceof Array && datas.length > 0) {
                                            let index: number = datas.indexOf(form.getModel().getData());
                                            index = index >= datas.length - 1 ? 0 : index + 1;
                                            form.setModel(new sap.extension.model.JSONModel(datas[index]));
                                            editForm.setTitle(ibas.strings.format("{0} - {1}", ibas.i18n.prop("bo_salesreturnitem"), datas[index].lineId));
                                        } else {
                                            that.application.viewShower.messages({
                                                title: that.title,
                                                type: ibas.emMessageType.WARNING,
                                                message: ibas.i18n.prop(["shell_please", "shell_data_add_line"]),
                                            });
                                        }
                                    }
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                press(this: sap.m.Button): void {
                                    if (this.getParent() instanceof sap.m.Dialog) {
                                        (<sap.m.Dialog>this.getParent()).close();
                                    } else {
                                        editForm.close();
                                    }
                                }
                            }),
                        ]
                    }).addStyleClass("sapUiNoContentPadding");
                    editForm.getContent()[0].setModel(new sap.extension.model.JSONModel(data));
                    editForm.open();
                }
                showShippingAddresses(datas: bo.ShippingAddress[]): void {
                }
            }
        }
    }
}
