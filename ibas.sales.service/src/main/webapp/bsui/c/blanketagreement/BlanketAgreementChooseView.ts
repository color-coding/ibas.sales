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
            /** 选择视图-一揽子协议 */
            export class BlanketAgreementChooseView extends ibas.BOQueryDialogViewWithPanel implements app.IBlanketAgreementChooseView {
                /** 返回查询的对象 */
                get queryTarget(): any {
                    return bo.BlanketAgreement;
                }
                chooseType: ibas.emChooseType;
                mode: ibas.emViewMode;
                chooseDataEvent: Function;
                newDataEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.table = new sap.extension.table.DataTable("", {
                        chooseType: this.chooseType,
                        visibleRowCount: sap.extension.table.visibleRowCount(15),
                        dataInfo: this.queryTarget,
                        rows: "{/rows}",
                        columns: [
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_docentry"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "docEntry",
                                    type: new sap.extension.data.Numeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_approvalstatus"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "approvalStatus",
                                    type: new sap.extension.data.ApprovalStatus(true)
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_canceled"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "canceled",
                                    type: new sap.extension.data.YesNo(true)
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_documentstatus"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "documentStatus",
                                    type: new sap.extension.data.DocumentStatus(true)
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_customercode"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "customerCode",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_customername"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "customerName",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_startdate"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "startDate",
                                    type: new sap.extension.data.Date()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_enddate"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "endDate",
                                    type: new sap.extension.data.Date()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_description"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "description",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "14rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_settlementprobability"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "settlementProbability",
                                    type: new sap.extension.data.Percentage()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_ordertype"),
                                template: new sap.extension.m.PropertyText("", {
                                    dataInfo: {
                                        code: bo.BlanketAgreement.BUSINESS_OBJECT_CODE,
                                    },
                                    propertyName: "orderType",
                                }).bindProperty("bindingValue", {
                                    path: "orderType",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_dataowner"),
                                template: new sap.extension.m.UserText("", {
                                }).bindProperty("bindingValue", {
                                    path: "dataOwner",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_reference1"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "reference1",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_blanketagreement_reference2"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "reference2",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                            }),
                        ],
                        nextDataSet(event: sap.ui.base.Event): void {
                            // 查询下一个数据集
                            let data: any = event.getParameter("data");
                            if (ibas.objects.isNull(data)) {
                                return;
                            }
                            if (ibas.objects.isNull(that.lastCriteria)) {
                                return;
                            }
                            let criteria: ibas.ICriteria = that.lastCriteria.next(data);
                            if (ibas.objects.isNull(criteria)) {
                                return;
                            }
                            ibas.logger.log(ibas.emMessageLevel.DEBUG, "result: {0}", criteria.toString());
                            that.fireViewEvents(that.fetchDataEvent, criteria);
                        }
                    });
                    this.itemTable = new sap.extension.m.DataTable("", {
                        autoPopinMode: true,
                        chooseType: ibas.emChooseType.MULTIPLE,
                        dataInfo: {
                            code: bo.BlanketAgreement.BUSINESS_OBJECT_CODE,
                            name: bo.BlanketAgreementItem.name
                        },
                        columns: [
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_lineid"),
                                width: "6rem",
                            }),
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_itemcode"),
                                width: "10rem",
                            }),
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_itemdescription"),
                                width: "14rem",
                            }),
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_quantity"),
                                width: "8rem",
                            }),
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_price"),
                                width: "8rem",
                            }),
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_linetotal"),
                                width: "8rem",
                            }),
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_openquantity"),
                            }),
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_openamount"),
                            }),
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_reference1"),
                            }),
                            new sap.extension.m.Column("", {
                                header: ibas.i18n.prop("bo_blanketagreementitem_reference2"),
                            }),
                        ],
                        items: {
                            path: "/",
                            template: new sap.m.ColumnListItem("", {
                                cells: [
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            parts: [
                                                {
                                                    path: "docEntry",
                                                    type: new sap.extension.data.Numeric()
                                                },
                                                {
                                                    path: "lineId",
                                                    type: new sap.extension.data.Numeric()

                                                }
                                            ],
                                            formatter(docEntry: number, lineId: number): string {
                                                return ibas.strings.format("{0} - {1}", docEntry, lineId);
                                            }
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            path: "itemCode",
                                            type: new sap.extension.data.Alphanumeric()
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            path: "itemDescription",
                                            type: new sap.extension.data.Alphanumeric()
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            parts: [
                                                {
                                                    path: "quantity",
                                                    type: new sap.extension.data.Quantity()
                                                }, {
                                                    path: "uom",
                                                    type: new sap.extension.data.Alphanumeric()
                                                }
                                            ]
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            parts: [
                                                {
                                                    path: "price",
                                                    type: new sap.extension.data.Price()
                                                }, {
                                                    path: "currency",
                                                    type: new sap.extension.data.Alphanumeric()
                                                }
                                            ]
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            parts: [
                                                {
                                                    path: "lineTotal",
                                                    type: new sap.extension.data.Sum()
                                                }, {
                                                    path: "currency",
                                                    type: new sap.extension.data.Alphanumeric()
                                                }
                                            ]
                                        },
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            parts: [
                                                {
                                                    path: "quantity",
                                                    type: new sap.extension.data.Quantity(),
                                                },
                                                {
                                                    path: "closedQuantity",
                                                    type: new sap.extension.data.Quantity(),

                                                }
                                            ],
                                            formatter(quantity: number, closedQuantity: number): string {
                                                return sap.extension.data.formatValue(sap.extension.data.Quantity, quantity - closedQuantity, "string");
                                            }
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            parts: [
                                                {
                                                    path: "lineTotal",
                                                    type: new sap.extension.data.Sum(),
                                                },
                                                {
                                                    path: "closedAmount",
                                                    type: new sap.extension.data.Sum(),

                                                }
                                            ],
                                            formatter(lineTotal: number, closedAmount: number): string {
                                                return sap.extension.data.formatValue(sap.extension.data.Sum, lineTotal - closedAmount, "string");
                                            }
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            path: "reference1",
                                            type: new sap.extension.data.Alphanumeric()
                                        },
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        bindingValue: {
                                            path: "reference2",
                                            type: new sap.extension.data.Alphanumeric()
                                        },
                                    }),
                                ]
                            }),
                        }
                    });
                    return new sap.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        contentWidth: "90%",
                        contentHeight: ibas.strings.format("{0}rem", (sap.extension.table.visibleRowCount(15) + 4) * 2 + 1),
                        content: [
                            this.container = new sap.m.NavContainer("", {
                                autoFocus: false,
                                defaultTransitionName: "baseSlide",
                                pages: [
                                    new sap.m.Page("", {
                                        showHeader: false,
                                        enableScrolling: false,
                                        content: [
                                            this.table
                                        ],
                                        footer: new sap.m.Toolbar("", {
                                            content: [
                                                new sap.m.ToolbarSpacer(),
                                                new sap.m.Button("", {
                                                    text: ibas.i18n.prop("shell_data_new"),
                                                    type: sap.m.ButtonType.Default,
                                                    visible: this.mode === ibas.emViewMode.VIEW ? false : true,
                                                    press: function (): void {
                                                        that.fireViewEvents(that.newDataEvent);
                                                    }
                                                }),
                                                new sap.m.MenuButton("", {
                                                    text: ibas.i18n.prop("shell_data_choose"),
                                                    type: sap.m.ButtonType.Default,
                                                    menuPosition: sap.ui.core.Popup.Dock.EndTop,
                                                    buttonMode: sap.m.MenuButtonMode.Split,
                                                    useDefaultActionOnly: true,
                                                    defaultAction(): void {
                                                        that.fireViewEvents(that.chooseDataEvent, that.table.getSelecteds());
                                                    },
                                                    menu: new sap.m.Menu("", {
                                                        items: [
                                                            this.customMenuItem = new sap.m.MenuItem("", {
                                                                icon: "sap-icon://multi-select",
                                                                text: ibas.i18n.prop("shell_data_customized"),
                                                                visible: this.usingCriteria?.noChilds === true ? false : true,
                                                                press: function (): void {
                                                                    let selecteds: ibas.IList<bo.BlanketAgreement> = that.table.getSelecteds();
                                                                    if (selecteds.length === 0) {
                                                                        that.application.viewShower.messages({
                                                                            title: that.title,
                                                                            type: ibas.emMessageType.WARNING,
                                                                            message: ibas.i18n.prop("shell_please_chooose_data", ibas.i18n.prop("shell_data_customized")),
                                                                        });
                                                                    } else {
                                                                        that.showDataItems(selecteds);
                                                                    }
                                                                },
                                                            }),
                                                            new sap.m.MenuItem("", {
                                                                icon: "sap-icon://multiselect-all",
                                                                text: ibas.i18n.prop("shell_all"),
                                                                press: function (): void {
                                                                    that.fireViewEvents(that.chooseDataEvent, that.table.getSelecteds());
                                                                },
                                                            }),
                                                        ],
                                                    })
                                                }),
                                                new sap.m.Button("", {
                                                    text: ibas.i18n.prop("shell_exit"),
                                                    type: sap.m.ButtonType.Default,
                                                    press: function (): void {
                                                        that.fireViewEvents(that.closeEvent);
                                                    }
                                                }),
                                            ]
                                        })
                                    }),
                                    new sap.m.Page("", {
                                        showHeader: false,
                                        enableScrolling: false,
                                        content: [
                                            this.itemTable,
                                        ],
                                        subHeader: new sap.m.Toolbar("", {
                                            style: sap.m.ToolbarStyle.Clear,
                                            design: sap.m.ToolbarDesign.Transparent,
                                            content: [
                                                new sap.m.SearchField("", {
                                                    search(event: sap.ui.base.Event): void {
                                                        let source: any = event.getSource();
                                                        if (source instanceof sap.m.SearchField) {
                                                            that.itemTable.setBusy(true);
                                                            let search: string = source.getValue();
                                                            if (!ibas.strings.isEmpty(search)) {
                                                                search = search.trim().toLowerCase();
                                                            }
                                                            for (let item of that.itemTable.getItems()) {
                                                                if (item instanceof sap.m.ColumnListItem) {
                                                                    item.setVisible(true);
                                                                    if (ibas.strings.isEmpty(search)) {
                                                                        continue;
                                                                    }
                                                                    let done: boolean = false;
                                                                    for (let cell of item.getCells()) {
                                                                        if (cell instanceof sap.m.ObjectAttribute) {
                                                                            let text: string = cell.getText();
                                                                            if (text && text.toLowerCase().indexOf(search) >= 0) {
                                                                                done = true;
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                    if (!done) {
                                                                        item.setVisible(false);
                                                                    }
                                                                }
                                                            }
                                                            that.itemTable.setBusy(false);
                                                        }
                                                    }
                                                }),
                                            ]
                                        }),
                                        footer: new sap.m.Toolbar("", {
                                            content: [
                                                new sap.m.ToolbarSpacer(),
                                                new sap.m.Button("", {
                                                    text: ibas.i18n.prop("shell_back"),
                                                    type: sap.m.ButtonType.Default,
                                                    press: function (): void {
                                                        that.container.back(that.table.getParent().getId());
                                                    }
                                                }),
                                                new sap.m.Button("", {
                                                    text: ibas.i18n.prop("shell_data_choose"),
                                                    type: sap.m.ButtonType.Default,
                                                    press: function (): void {
                                                        let selectItems: bo.BlanketAgreementItem[] = that.itemTable.getSelecteds();
                                                        if (selectItems.length > 0) {
                                                            let selects: bo.BlanketAgreement[] = that.table.getSelecteds();
                                                            for (let select of selects) {
                                                                for (let i: number = 0; i < select.blanketAgreementItems.length; i++) {
                                                                    let item: any = select.blanketAgreementItems[i];
                                                                    if (selectItems.find(c => c === item)) {
                                                                        continue;
                                                                    }
                                                                    select.blanketAgreementItems.removeAt(i);
                                                                }
                                                            }
                                                            that.fireViewEvents(that.chooseDataEvent, selects);
                                                        }
                                                    }
                                                }),
                                                new sap.m.Button("", {
                                                    text: ibas.i18n.prop("shell_exit"),
                                                    type: sap.m.ButtonType.Default,
                                                    press: function (): void {
                                                        that.fireViewEvents(that.closeEvent);
                                                    }
                                                }),
                                            ]
                                        })
                                    }),
                                ]
                            }),
                        ],
                        buttons: [
                        ],
                    }).addStyleClass("sapUiNoContentPadding");
                }
                private container: sap.m.NavContainer;
                private table: sap.extension.table.Table;
                private itemTable: sap.extension.m.Table;
                private customMenuItem: sap.m.MenuItem;

                embedded(view: any): void {
                    let page: any = this.table.getParent();
                    if (page instanceof sap.m.Page) {
                        if (view instanceof sap.m.Toolbar) {
                            view.setStyle(sap.m.ToolbarStyle.Clear);
                            view.setDesign(sap.m.ToolbarDesign.Transparent);
                            for (let item of view.getContent()) {
                                if (item instanceof sap.m.Button) {
                                    // 隐藏配置钮
                                    if (item.getIcon() === "sap-icon://filter") {
                                        item.setVisible(false);
                                    }
                                }
                            }
                        }
                        page.setSubHeader(view);
                    }
                }
                showDataItems(datas: bo.BlanketAgreement[]): void {
                    this.container.to(this.itemTable.getParent().getId());
                    let dataItems: ibas.IList<bo.BlanketAgreementItem> = new ibas.ArrayList<bo.BlanketAgreementItem>();
                    for (let item of datas) {
                        dataItems.add(item.blanketAgreementItems);
                    }
                    this.itemTable.setModel(new sap.extension.model.JSONModel(dataItems));
                }
                /** 显示数据 */
                showData(datas: bo.BlanketAgreement[]): void {
                    let model: sap.ui.model.Model = this.table.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        // 已绑定过数据
                        model.addData(datas);
                    } else {
                        // 未绑定过数据
                        this.table.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                    }
                    this.table.setBusy(false);
                }
                /** 记录上次查询条件，表格滚动时自动触发 */
                query(criteria: ibas.ICriteria): void {
                    super.query(criteria);
                    // 清除历史数据
                    if (this.isDisplayed) {
                        this.table.setBusy(true);
                        this.table.setFirstVisibleRow(0);
                        this.table.setModel(null);
                        // 不查子项，则不显示定制钮
                        if (criteria?.noChilds === true) {
                            this.customMenuItem?.setVisible(false);
                        } else {
                            this.customMenuItem?.setVisible(true);
                        }
                    }
                }
            }
        }
    }
}
