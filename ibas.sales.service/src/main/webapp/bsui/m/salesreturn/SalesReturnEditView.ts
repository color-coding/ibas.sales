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
            /** 编辑视图-销售退货 */
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
                /** 选择销售退货-行 单位 */
                chooseSalesReturnItemUnitEvent: Function;
                /** 选择销售退货-行 物料序列事件 */
                chooseSalesReturnItemMaterialSerialEvent: Function;
                /** 选择销售退货-行 物料批次事件 */
                chooseSalesReturnItemMaterialBatchEvent: Function;
                /** 选择销售退货-行 物料版本 */
                chooseSalesReturnItemMaterialVersionEvent: Function;
                /** 选择一业务伙伴目录事件 */
                chooseSalesReturnItemMaterialCatalogEvent: Function;
                /** 选择销售退货-行 成本中心事件 */
                chooseSalesReturnItemDistributionRuleEvent: Function;
                /** 选择销售退货项目-销售订单事件 */
                chooseSalesReturnSalesOrderEvent: Function;
                /** 选择销售退货项目-销售交货事件 */
                chooseSalesReturnSalesDeliveryEvent: Function;
                /** 选择客户合同 */
                chooseCustomerAgreementsEvent: Function;
                /** 收款销售退货 */
                receiptSalesReturnEvent: Function;
                /** 编辑地址事件 */
                editShippingAddressesEvent: Function;
                /** 转为销售贷项事件 */
                turnToSalesCreditNoteEvent: Function;
                /** 测量物料事件 */
                measuringMaterialsEvent: Function;
                /** 查看物料历史价格事件 */
                viewHistoricalPricesEvent: Function;
                /** 计算毛利润 */
                calculateGrossProfitEvent: Function;
                /** 选择付款条款事件 */
                choosePaymentTermEvent: Function;
                defaultWarehouse: string;
                defaultTaxGroup: string;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    return this.page = new sap.extension.uxap.DataObjectPageLayout("", {
                        dataInfo: {
                            code: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                        },
                        userFieldsMode: "input",
                        showFooter: sap.ui.getCore().getConfiguration().getVersion().getMajor() >= 1
                            && sap.ui.getCore().getConfiguration().getVersion().getMinor() >= 73 ? false : true,
                        footer: new sap.m.Toolbar("", {
                            content: [
                                new sap.extension.m.MenuButton("", {
                                    autoHide: true,
                                    icon: "sap-icon://tags",
                                    menu: new sap.m.Menu("", {
                                        items: [
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("sales_material_batch"),
                                                press: function (): void {
                                                    that.fireViewEvents(that.chooseSalesReturnItemMaterialBatchEvent);
                                                },
                                                visible: shell.app.privileges.canRun({
                                                    id: materials.app.MaterialBatchReceiptService.APPLICATION_ID,
                                                    name: materials.app.MaterialBatchReceiptService.APPLICATION_NAME,
                                                })
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("sales_material_serial"),
                                                press: function (): void {
                                                    that.fireViewEvents(that.chooseSalesReturnItemMaterialSerialEvent);
                                                },
                                                visible: shell.app.privileges.canRun({
                                                    id: materials.app.MaterialSerialReceiptService.APPLICATION_ID,
                                                    name: materials.app.MaterialSerialReceiptService.APPLICATION_NAME,
                                                })
                                            }),
                                        ]
                                    })
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.ToolbarSpacer(""),
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
                                                },
                                                visible: shell.app.privileges.canRun({
                                                    id: app.SalesOrderChooseApp.APPLICATION_ID,
                                                    name: app.SalesOrderChooseApp.APPLICATION_NAME,
                                                })
                                            }),
                                            new sap.m.MenuItem("", {
                                                text: ibas.i18n.prop("bo_salesdelivery"),
                                                press: function (): void {
                                                    that.fireViewEvents(that.chooseSalesReturnSalesDeliveryEvent);
                                                },
                                                visible: shell.app.privileges.canRun({
                                                    id: app.SalesDeliveryChooseApp.APPLICATION_ID,
                                                    name: app.SalesDeliveryChooseApp.APPLICATION_NAME,
                                                })
                                            }),
                                        ]
                                    })
                                }),
                            ]
                        }),
                        sectionChange(event: sap.ui.base.Event): void {
                            let section: any = event.getParameter("section");
                            if (section instanceof sap.uxap.ObjectPageSection) {
                                if (section.getTitle() === ibas.i18n.prop("bo_salesreturnitem")) {
                                    that.page.setShowFooter(true);
                                } else {
                                    that.page.setShowFooter(false);
                                }
                            }
                        },
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
                                text: ibas.i18n.prop("shell_data_save"),
                                type: sap.m.ButtonType.Transparent,
                                icon: "sap-icon://save",
                                press(): void {
                                    that.fireViewEvents(that.saveDataEvent);
                                }
                            }),
                            actions: [
                                new sap.uxap.ObjectPageHeaderActionButton("", {
                                    text: ibas.i18n.prop("shell_data_clone"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://copy",
                                    hideText: true,
                                    importance: sap.uxap.Importance.Medium,
                                    press: function (): void {
                                        that.fireViewEvents(that.createDataEvent, true);
                                    }
                                }),
                                new sap.uxap.ObjectPageHeaderActionButton("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    hideText: true,
                                    importance: sap.uxap.Importance.Low,
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent);
                                    }
                                }),
                                new sap.uxap.ObjectPageHeaderActionButton("", {
                                    hideText: true,
                                    importance: sap.uxap.Importance.Medium,
                                    type: sap.m.ButtonType.Transparent,
                                    text: ibas.i18n.prop("shell_quick_to"),
                                    icon: "sap-icon://generate-shortcut",
                                    press(event: sap.ui.base.Event): void {
                                        let actionSheet: sap.m.ActionSheet = new sap.m.ActionSheet("", {
                                            placement: sap.m.PlacementType.Bottom,
                                            buttons: [
                                                new sap.m.Button("", {
                                                    type: sap.m.ButtonType.Transparent,
                                                    text: ibas.i18n.prop("bo_salescreditnote"),
                                                    icon: "sap-icon://doc-attachment",
                                                    press(this: sap.m.Button): void {
                                                        that.fireViewEvents(that.turnToSalesCreditNoteEvent);
                                                    },
                                                    visible: shell.app.privileges.canRun({
                                                        id: sales.app.SalesCreditNoteFunc.FUNCTION_ID,
                                                        name: sales.app.SalesCreditNoteFunc.FUNCTION_NAME,
                                                    })
                                                }),
                                            ]
                                        });
                                        actionSheet.openBy(event.getSource());
                                    }
                                }),
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
                                                editable: true,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_customercode") }),
                                                    new sap.extension.m.Input("", {
                                                        showValueHelp: true,
                                                        valueHelpRequest: function (): void {
                                                            that.fireViewEvents(that.chooseSalesReturnCustomerEvent);
                                                        },
                                                        showValueLink: true,
                                                        valueLinkRequest: function (event: sap.ui.base.Event): void {
                                                            ibas.servicesManager.runLinkService({
                                                                boCode: materials.bo.Material.BUSINESS_OBJECT_CODE,
                                                                linkValue: event.getParameter("value")
                                                            });
                                                        },
                                                        editable: {
                                                            parts: [
                                                                {
                                                                    path: "isNew",
                                                                },
                                                                {
                                                                    path: "documentStatus",
                                                                }
                                                            ],
                                                            formatter(isNew: boolean, documentStatus: ibas.emDocumentStatus): boolean {
                                                                return isNew === false && documentStatus > ibas.emDocumentStatus.PLANNED ? false : true;
                                                            }
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
                                                editable: true,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_docnum") }),
                                                    new sap.extension.m.Input("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "docNum",
                                                        type: new sap.extension.data.Alphanumeric({
                                                            maxLength: 20
                                                        })
                                                    }).bindProperty("editable", {
                                                        path: "series",
                                                        formatter(data: any): any {
                                                            return data > 0 ? false : true;
                                                        }
                                                    }),
                                                    new sap.extension.m.SeriesSelect("", {
                                                        objectCode: bo.BO_CODE_SALESRETURN,
                                                    }).bindProperty("bindingValue", {
                                                        path: "series",
                                                        type: new sap.extension.data.Numeric()
                                                    }).bindProperty("editable", {
                                                        path: "isNew",
                                                        formatter(data: any): any {
                                                            return data === false ? false : true;
                                                        }
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentstatus") }),
                                                    new sap.extension.m.EnumSelect("", {
                                                        enumType: ibas.emDocumentStatus
                                                    }).bindProperty("bindingValue", {
                                                        path: "documentStatus",
                                                        type: new sap.extension.data.DocumentStatus()
                                                    }),
                                                    new sap.extension.m.TipsCheckBox("", {
                                                        text: ibas.i18n.prop("bbo_salesreturn_canceled"),
                                                        tipsOnSelection: ibas.i18n.prop(["shell_data_cancel", "shell_data_status"]),
                                                    }).bindProperty("bindingValue", {
                                                        path: "canceled",
                                                        type: new sap.extension.data.YesNo()
                                                    }).bindProperty("editable", {
                                                        path: "approvalStatus",
                                                        type: new sap.extension.data.ApprovalStatus(),
                                                        formatter(data: ibas.emApprovalStatus): boolean {
                                                            if (data === ibas.emApprovalStatus.PROCESSING) {
                                                                return false;
                                                            } return true;
                                                        }
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
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_agreements") }),
                                                    new sap.extension.m.Input("", {
                                                        showValueHelp: true,
                                                        valueHelpOnly: false,
                                                        valueHelpRequest: function (): void {
                                                            that.fireViewEvents(that.chooseCustomerAgreementsEvent);
                                                        },
                                                    }).bindProperty("bindingValue", {
                                                        path: "agreements",
                                                        type: new sap.extension.data.Alphanumeric({
                                                            maxLength: 110
                                                        }),
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
                                                growing: false,
                                                width: "auto",
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
                                                            items: [
                                                                new sap.m.SegmentedButtonItem("", {
                                                                    width: "3rem",
                                                                    icon: "sap-icon://copy",
                                                                    press(oEvent: any): void {
                                                                        that.fireViewEvents(that.addSalesReturnItemEvent, that.listSalesReturnItem.getSelecteds());
                                                                    }
                                                                }),
                                                                new sap.m.SegmentedButtonItem("", {
                                                                    width: "3rem",
                                                                    icon: "sap-icon://delete",
                                                                    press(oEvent: any): void {
                                                                        that.fireViewEvents(that.removeSalesReturnItemEvent, that.listSalesReturnItem.getSelecteds());
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
                                                            that.editSalesReturnItem(this.getBindingContext().getObject());
                                                        },
                                                    })
                                                },
                                            }).addStyleClass("sapUxAPObjectPageSubSectionAlignContent"),
                                            new sap.ui.layout.form.SimpleForm("", {
                                                editable: false,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentlinetotal") }),
                                                    new sap.extension.m.Input("", {
                                                        editable: false,

                                                    }).bindProperty("bindingValue", {
                                                        path: "itemsPreTaxTotal",
                                                        type: new sap.extension.data.Sum()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documentlinediscount") }),
                                                    new sap.extension.m.Input("", {
                                                        editable: true,
                                                    }).bindProperty("bindingValue", {
                                                        path: config.isInverseDiscount() ? "inverseDiscount" : "discount",
                                                        type: new data.Percentage(),
                                                    }),
                                                    new sap.extension.m.Input("", {
                                                        editable: false,

                                                    }).bindProperty("bindingValue", {
                                                        parts: [
                                                            {
                                                                path: "itemsPreTaxTotal",
                                                                type: new sap.extension.data.Sum()
                                                            },
                                                            {
                                                                path: "discount",
                                                                type: new sap.extension.data.Percentage()
                                                            },
                                                        ],
                                                        formatter(preTaxTotal: number, discount: number): number {
                                                            return sap.extension.data.formatValue(sap.extension.data.Sum,
                                                                ibas.numbers.valueOf(discount) === 1 ? 0 :
                                                                    -ibas.numbers.valueOf(preTaxTotal) * (1 - ibas.numbers.valueOf(discount))
                                                                , "string");
                                                        },
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_shippingsexpensetotal") }),
                                                    new sap.extension.m.Input("", {
                                                        editable: false,
                                                    }).bindProperty("bindingValue", {
                                                        parts: [
                                                            {
                                                                path: "shippingsExpenseTotal",
                                                                type: new sap.extension.data.Sum()
                                                            },
                                                            {
                                                                path: "shippingsTaxTotal",
                                                                type: new sap.extension.data.Sum()
                                                            }
                                                        ],
                                                        formatter(total: number, tax: number): number {
                                                            return sap.extension.data.formatValue(sap.extension.data.Sum,
                                                                ibas.numbers.valueOf(total) - ibas.numbers.valueOf(tax)
                                                                , "string");
                                                        },
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documenttaxtotal") }),
                                                    new sap.extension.m.Input("", {
                                                        editable: false,
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
                                                            {
                                                                path: "discount",
                                                                type: new sap.extension.data.Percentage()
                                                            },
                                                        ],
                                                        formatter(lineTax: number, shippingTax: number, discount: number): number {
                                                            return sap.extension.data.formatValue(sap.extension.data.Sum,
                                                                (ibas.numbers.valueOf(lineTax) * ibas.numbers.valueOf(discount)) + ibas.numbers.valueOf(shippingTax)
                                                                , "string");
                                                        },
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_documenttotal") }),
                                                    new sap.m.FlexBox("", {
                                                        width: "100%",
                                                        justifyContent: sap.m.FlexJustifyContent.Start,
                                                        renderType: sap.m.FlexRendertype.Bare,
                                                        alignContent: sap.m.FlexAlignContent.Center,
                                                        alignItems: sap.m.FlexAlignItems.Center,
                                                        items: [
                                                            new sap.extension.m.Input("", {
                                                                width: "70%",
                                                                editable: true,
                                                            }).bindProperty("bindingValue", {
                                                                path: "documentTotal",
                                                                type: new sap.extension.data.Sum()
                                                            }).addStyleClass("sapUiTinyMarginEnd"),
                                                            new sap.extension.m.CurrencyRateSelect("", {
                                                                baseCurrency: accounting.config.currency("LOCAL"),
                                                                currency: {
                                                                    path: "documentCurrency",
                                                                    type: new sap.extension.data.Alphanumeric()
                                                                },
                                                                rate: {
                                                                    path: "documentRate",
                                                                    type: new sap.extension.data.Rate()
                                                                },
                                                                date: {
                                                                    path: "documentDate",
                                                                    type: new sap.extension.data.Date()
                                                                }
                                                            }),
                                                        ]
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_paidtotal") }),
                                                    new sap.extension.m.Input("", {
                                                        editable: false,

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
                                visible: shell.app.privileges.canRun({
                                    id: app.ELEMENT_SHIPPING_ADDRESSES.id,
                                    name: app.ELEMENT_SHIPPING_ADDRESSES.name
                                }),
                                subSections: [
                                    new sap.uxap.ObjectPageSubSection("", {
                                        blocks: [
                                            new sap.ui.layout.form.SimpleForm("", {
                                                editable: true,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress") }),
                                                    new component.ShippingAddressSelect("", {
                                                        editSelected(event: sap.ui.base.Event): void {
                                                            that.fireViewEvents(that.editShippingAddressesEvent);
                                                        }
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
                                                editable: true,
                                                width: "auto",
                                                content: [
                                                    new sap.m.Label("", {
                                                        text: ibas.i18n.prop("bo_salesreturn_branch"),
                                                        visible: accounting.config.isEnableBranch(),
                                                        required: true,
                                                    }),
                                                    new sap.extension.m.DataBranchInput("", {
                                                        showValueHelp: true,
                                                        visible: accounting.config.isEnableBranch(),
                                                    }).bindProperty("bindingValue", {
                                                        path: "branch",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_dataowner") }),
                                                    new sap.extension.m.DataOwnerInput("", {
                                                        showValueHelp: true,
                                                        organization: {
                                                            path: "organization",
                                                            type: new sap.extension.data.Alphanumeric({
                                                                maxLength: 8
                                                            })
                                                        }
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
                                                            new ibas.Condition(
                                                                accounting.bo.Project.PROPERTY_DELETED_NAME, ibas.emConditionOperation.NOT_EQUAL, ibas.emYesNo.YES.toString())
                                                        ]
                                                    }).bindProperty("bindingValue", {
                                                        path: "project",
                                                        type: new sap.extension.data.Alphanumeric({
                                                            maxLength: 20
                                                        })
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_organization") }),
                                                    new sap.extension.m.DataOrganizationInput("", {
                                                        width: "100%",
                                                        showValueHelp: true,
                                                    }).bindProperty("bindingValue", {
                                                        path: "organization",
                                                        type: new sap.extension.data.Alphanumeric({
                                                            maxLength: 8
                                                        })
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturn_remarks") }),
                                                    new sap.extension.m.TextArea("", {
                                                        rows: 3,
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
                    //   sap.extension.pages.changeStatus(this.page);
                }
                /** 显示数据（销售退货-行） */
                showSalesReturnItems(datas: bo.SalesReturnItem[]): void {
                    this.listSalesReturnItem.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                }
                /** 编辑数据（销售退货-行） */
                editSalesReturnItem(data: bo.SalesReturnItem): void {
                    let that: this = this;
                    let editForm: sap.m.Dialog = <any>sap.ui.getCore().byId(this.id + "_editform");
                    if (!(editForm instanceof sap.m.Dialog)) {
                        editForm = new sap.m.Dialog(this.id + "_editform", {
                            title: ibas.strings.format("{0} - {1}", ibas.i18n.prop("bo_salesreturnitem"), data.lineId),
                            type: sap.m.DialogType.Standard,
                            state: sap.ui.core.ValueState.None,
                            stretch: ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM) === ibas.emPlantform.PHONE ? true : false,
                            horizontalScrolling: true,
                            verticalScrolling: true,
                            content: [
                                new sap.extension.layout.DataSimpleForm("", {
                                    editable: true,
                                    userFieldsTitle: "",
                                    userFieldsMode: "input",
                                    dataInfo: {
                                        code: bo.SalesReturn.BUSINESS_OBJECT_CODE,
                                        name: bo.SalesReturnItem.name,
                                    },
                                    content: [
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_lineid") }),
                                        new sap.extension.m.Input("", {
                                            editable: false,

                                        }).bindProperty("bindingValue", {
                                            path: "lineId",
                                            type: new sap.extension.data.Numeric(),
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_linestatus") }),
                                        new sap.extension.m.EnumSelect("", {
                                            enumType: ibas.emDocumentStatus
                                        }).bindProperty("bindingValue", {
                                            path: "lineStatus",
                                            type: new sap.extension.data.DocumentStatus(),
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_itemcode") }),
                                        new sap.extension.m.Input("", {
                                            showValueHelp: true,
                                            valueHelpRequest: function (this: sap.extension.m.Input): void {
                                                let model: any = this.getModel();
                                                if (model instanceof sap.extension.model.JSONModel) {
                                                    let data: any = model.getData();
                                                    if (data) {
                                                        that.fireViewEvents(that.chooseSalesReturnItemMaterialEvent, data);
                                                    }
                                                }
                                            },
                                            showValueLink: true,
                                            valueLinkRequest: function (event: sap.ui.base.Event): void {
                                                ibas.servicesManager.runLinkService({
                                                    boCode: materials.bo.Material.BUSINESS_OBJECT_CODE,
                                                    linkValue: event.getParameter("value")
                                                });
                                            }
                                        }).bindProperty("bindingValue", {
                                            path: "itemCode",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 50
                                            }),
                                        }).bindProperty("editable", {
                                            parts: [
                                                {
                                                    path: "closedQuantity",
                                                },
                                                {
                                                    path: "closedAmount",
                                                },
                                                {
                                                    path: "parentLineSign",
                                                },
                                            ],
                                            formatter(closedQuantity: number, closedAmount: number, parentLineSign: string): boolean {
                                                if (closedQuantity > 0) {
                                                    return false;
                                                } else if (closedAmount > 0) {
                                                    return false;
                                                } else if (!ibas.strings.isEmpty(parentLineSign)) {
                                                    return false;
                                                }
                                                return true;
                                            }
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_itemdescription") }),
                                        new sap.extension.m.Input("", {
                                            editable: false,
                                        }).bindProperty("bindingValue", {
                                            path: "itemDescription",
                                            type: new sap.extension.data.Alphanumeric()
                                        }),
                                        new sap.m.Label("", {
                                            text: ibas.i18n.prop("bo_salesreturnitem_itemversion"),
                                            visible: materials.config.isEnableMaterialVersions(),
                                        }),
                                        new sap.extension.m.Input("", {
                                            showValueHelp: true,
                                            valueHelpRequest: function (): void {
                                                that.fireViewEvents(that.chooseSalesReturnItemMaterialVersionEvent,
                                                    this.getBindingContext().getObject()
                                                );
                                            },
                                            visible: materials.config.isEnableMaterialVersions(),
                                        }).bindProperty("bindingValue", {
                                            path: "itemVersion",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 10
                                            }),
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_warehouse") }),
                                        new sap.extension.m.RepositoryInput("", {
                                            showValueHelp: true,
                                            repository: materials.bo.BORepositoryMaterials,
                                            dataInfo: {
                                                type: materials.bo.Warehouse,
                                                key: materials.bo.Warehouse.PROPERTY_CODE_NAME,
                                                text: materials.bo.Warehouse.PROPERTY_NAME_NAME
                                            },
                                            valueHelpRequest: function (this: sap.extension.m.Input): void {
                                                let model: any = this.getModel();
                                                if (model instanceof sap.extension.model.JSONModel) {
                                                    let data: any = model.getData();
                                                    if (data) {
                                                        that.fireViewEvents(that.chooseSalesReturnItemWarehouseEvent, data);
                                                    }
                                                }
                                            }
                                        }).bindProperty("bindingValue", {
                                            path: "warehouse",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 8
                                            })
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_quantity") }),
                                        new sap.m.FlexBox("", {
                                            width: "100%",
                                            justifyContent: sap.m.FlexJustifyContent.Start,
                                            renderType: sap.m.FlexRendertype.Bare,
                                            items: [
                                                new sap.extension.m.Input("", {

                                                }).bindProperty("bindingValue", {
                                                    path: "quantity",
                                                    type: new sap.extension.data.Quantity(),
                                                }).bindProperty("description", {
                                                    path: "uom",
                                                    type: new sap.extension.data.Alphanumeric({
                                                        maxLength: 8
                                                    }),
                                                }),
                                                new sap.m.Button("", {
                                                    icon: "sap-icon://tags",
                                                    type: sap.m.ButtonType.Transparent,
                                                    visible: {
                                                        path: "serialManagement",
                                                        type: new sap.extension.data.YesNo(),
                                                    },
                                                    press: function (): void {
                                                        that.fireViewEvents(that.chooseSalesReturnItemMaterialSerialEvent);
                                                    },
                                                }).addStyleClass("sapUiTinyMarginBegin"),
                                                new sap.m.Button("", {
                                                    icon: "sap-icon://tags",
                                                    type: sap.m.ButtonType.Transparent,
                                                    visible: {
                                                        path: "batchManagement",
                                                        type: new sap.extension.data.YesNo(),
                                                    },
                                                    press: function (): void {
                                                        that.fireViewEvents(that.chooseSalesReturnItemMaterialBatchEvent);
                                                    },
                                                }).addStyleClass("sapUiTinyMarginBegin"),
                                            ]
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_price") }),
                                        new sap.extension.m.Input("", {

                                        }).bindProperty("bindingValue", {
                                            path: "price",
                                            type: new sap.extension.data.Price(),
                                        }).bindProperty("description", {
                                            path: "currency",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 8
                                            }),
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_linetotal") }),
                                        new sap.extension.m.Input("", {
                                            editable: true,

                                        }).bindProperty("bindingValue", {
                                            path: "lineTotal",
                                            type: new sap.extension.data.Sum(),
                                        }).bindProperty("description", {
                                            path: "currency",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 8
                                            }),
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_tax") }),
                                        new component.TaxGroupSelect("", {
                                        }).bindProperty("bindingValue", {
                                            path: "tax",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 8
                                            })
                                        }).bindProperty("rate", {
                                            path: "taxRate",
                                            type: new sap.extension.data.Rate()
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_reference1") }),
                                        new sap.extension.m.Input("", {
                                        }).bindProperty("bindingValue", {
                                            path: "reference1",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 100
                                            }),
                                        }),
                                        new sap.m.Label("", { text: ibas.i18n.prop("bo_salesreturnitem_reference2") }),
                                        new sap.extension.m.Input("", {
                                        }).bindProperty("bindingValue", {
                                            path: "reference2",
                                            type: new sap.extension.data.Alphanumeric({
                                                maxLength: 200
                                            }),
                                        }),
                                    ],
                                }),
                            ],
                            buttons: [
                                new sap.m.Button("", {
                                    width: "20%",
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
                                    width: "20%",
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
                                    width: "20%",
                                    text: ibas.i18n.prop("shell_data_remove"),
                                    type: sap.m.ButtonType.Transparent,
                                    press: function (): void {
                                        let form: any = editForm.getContent()[0];
                                        if (form instanceof sap.extension.layout.SimpleForm) {
                                            let datas: any = that.listSalesReturnItem.getModel().getData("rows");
                                            if (datas instanceof Array && datas.length > 0) {
                                                that.fireViewEvents(that.removeSalesReturnItemEvent, form.getModel().getData());
                                                if (datas.length === 1) {
                                                    // 无数据，退出
                                                    (<any>editForm.getButtons()[3]).firePress({});
                                                } else {
                                                    // 下一个
                                                    (<any>editForm.getButtons()[1]).firePress({});
                                                }
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
                    }
                    editForm.getContent()[0].setModel(new sap.extension.model.JSONModel(data));
                    editForm.open();
                }
                protected onClosed(): void {
                    super.onClosed();
                    let form: any = sap.ui.getCore().byId(this.id + "_editform");
                    if (form instanceof sap.m.Dialog) {
                        form.destroy();
                    }
                }
            }
        }
    }
}
