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
            /** 列表视图-销售订单 */
            export class SalesOrderListView extends ibas.BOListView implements app.ISalesOrderListView {
                /** 返回查询的对象 */
                get queryTarget(): any {
                    return bo.SalesOrder;
                }
                /** 编辑数据，参数：目标数据 */
                editDataEvent: Function;
                /** 删除数据事件，参数：删除对象集合 */
                deleteDataEvent: Function;
                /** 预留物料库存 */
                reserveMaterialsInventoryEvent: Function;
                /** 改变订单状态 */
                changeDocumentStatusEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.list = new sap.extension.m.List("", {
                        mode: sap.m.ListMode.None,
                        swipeDirection: sap.m.SwipeDirection.RightToLeft,
                        swipeContent: new sap.m.FlexBox("", {
                            height: "100%",
                            alignItems: sap.m.FlexAlignItems.Start,
                            justifyContent: sap.m.FlexJustifyContent.End,
                            items: [
                                new sap.m.SegmentedButton("", {
                                    items: [
                                        new sap.m.SegmentedButtonItem("", {
                                            width: "3rem",
                                            icon: "sap-icon://action",
                                            press: function (event: sap.ui.base.Event): void {
                                                // 列表查的不完全，重新获取实例
                                                let source: any = event.getSource();
                                                let criteria: ibas.Criteria = new ibas.Criteria();
                                                criteria.result = 0;
                                                let condition: ibas.ICondition;
                                                for (let item of that.list.getSelecteds<bo.SalesOrder>()) {
                                                    criteria.result++;
                                                    condition = criteria.conditions.create();
                                                    if (criteria.conditions.length > 1) {
                                                        condition.relationship = ibas.emConditionRelationship.OR;
                                                    }
                                                    condition.alias = bo.SalesOrder.PROPERTY_DOCENTRY_NAME;
                                                    condition.value = String(item.docEntry);
                                                }
                                                let boRepository: bo.BORepositorySales = new bo.BORepositorySales();
                                                boRepository.fetchSalesOrder({
                                                    criteria: criteria,
                                                    onCompleted: (opRslt) => {
                                                        ibas.servicesManager.showServices({
                                                            proxy: new ibas.BOServiceProxy({
                                                                data: opRslt.resultObjects,
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
                                                                actionSheet.openBy(source);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }),
                                        new sap.m.SegmentedButtonItem("", {
                                            width: "3rem",
                                            icon: "sap-icon://delete",
                                            press(oEvent: any): void {
                                                that.fireViewEvents(that.deleteDataEvent, that.list.getSelecteds());
                                            }
                                        }),
                                        new sap.m.SegmentedButtonItem("", {
                                            width: "3rem",
                                            icon: "sap-icon://edit",
                                            press(oEvent: any): void {
                                                that.fireViewEvents(that.editDataEvent, that.list.getSelecteds().firstOrDefault());
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
                                    code: bo.SalesOrder.BUSINESS_OBJECT_CODE,
                                },
                                title: "# {docEntry}",
                                number: {
                                    path: "documentTotal",
                                    type: new sap.extension.data.Sum(),
                                },
                                numberUnit: {
                                    path: "documentCurrency",
                                    type: new sap.extension.data.Alphanumeric(),
                                },
                                numberState: {
                                    path: "paidTotal",
                                    formatter(data: number): sap.ui.core.ValueState {
                                        if (ibas.numbers.valueOf(data) > 0) {
                                            return sap.ui.core.ValueState.Success;
                                        } else {
                                            return sap.ui.core.ValueState.None;
                                        }
                                    }
                                },
                                firstStatus: new sap.extension.m.ObjectDocumentCanceledStatus("", {
                                    canceledStatus: {
                                        path: "canceled",
                                        type: new sap.extension.data.YesNo(),
                                    },
                                    documentStatus: {
                                        path: "documentStatus",
                                        type: new sap.extension.data.DocumentStatus(),
                                    },
                                }),
                                secondStatus: new sap.extension.m.ObjectApprovalStatus("", {
                                    enumValue: {
                                        path: "approvalStatus",
                                        type: new sap.extension.data.ApprovalStatus(),
                                    },
                                    visible: {
                                        path: "approvalStatus",
                                        formatter(data: ibas.emApprovalStatus): boolean {
                                            return data === ibas.emApprovalStatus.UNAFFECTED ? false : true;
                                        }
                                    }
                                }),
                                attributes: [
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_salesorder_documentdate"),
                                        bindingValue: {
                                            path: "documentDate",
                                            type: new sap.extension.data.Date(),
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_salesorder_customercode"),
                                        bindingValue: {
                                            path: "customerCode",
                                            type: new sap.extension.data.Alphanumeric(),
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_salesorder_customername"),
                                        bindingValue: {
                                            path: "customerName",
                                            type: new sap.extension.data.Alphanumeric(),
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_salesorder_consumer"),
                                        bindingValue: {
                                            path: "consumer",
                                            type: new sap.extension.data.Alphanumeric(),
                                        },
                                        visible: {
                                            path: "consumer",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data) ? false : true;
                                            }
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_salesorder_deliverydate"),
                                        bindingValue: {
                                            path: "deliveryDate",
                                            type: new sap.extension.data.Date(),
                                        }
                                    }),
                                    new sap.extension.m.PropertyObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_salesorder_ordertype"),
                                        bindingValue: {
                                            path: "orderType",
                                            type: new sap.extension.data.Alphanumeric(),
                                        },
                                        dataInfo: {
                                            code: bo.SalesOrder.BUSINESS_OBJECT_CODE,
                                        },
                                        propertyName: "orderType",
                                        visible: {
                                            path: "orderType",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data) ? false : true;
                                            }
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_salesorder_reference1"),
                                        bindingValue: {
                                            path: "reference1",
                                            type: new sap.extension.data.Alphanumeric(),
                                        },
                                        visible: {
                                            path: "reference1",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data) ? false : true;
                                            }
                                        }
                                    }),
                                    new sap.extension.m.ObjectAttribute("", {
                                        title: ibas.i18n.prop("bo_salesorder_reference2"),
                                        bindingValue: {
                                            path: "reference2",
                                            type: new sap.extension.data.Alphanumeric(),
                                        },
                                        visible: {
                                            path: "reference2",
                                            formatter(data: string): boolean {
                                                return ibas.strings.isEmpty(data) ? false : true;
                                            }
                                        }
                                    }),
                                ],
                                type: sap.m.ListType.Active,
                                press: function (oEvent: sap.ui.base.Event): void {
                                    that.fireViewEvents(that.editDataEvent, this.getBindingContext().getObject());
                                },
                            })
                        },
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
                    return this.page = new sap.m.Page("", {
                        showHeader: false,
                        showSubHeader: false,
                        floatingFooter: ibas.config.get(openui5.CONFIG_ITEM_LIST_VIEW_FLOATING_FOOTER, true),
                        content: [
                            this.list
                        ],
                        footer: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    width: "100%",
                                    text: ibas.i18n.prop("shell_data_new"),
                                    press: function (): void {
                                        that.fireViewEvents(that.newDataEvent);
                                    }
                                })
                            ]
                        })
                    });
                }
                private page: sap.m.Page;
                private list: sap.extension.m.List;
                private pullToRefresh: sap.m.PullToRefresh;
                /** 嵌入下拉条 */
                embeddedPuller(view: any): void {
                    if (view instanceof sap.m.PullToRefresh) {
                        if (!ibas.objects.isNull(this.page)) {
                            this.page.insertContent(view, 0);
                            this.pullToRefresh = view;
                        }
                    }
                }
                /** 显示数据 */
                showData(datas: bo.SalesOrder[]): void {
                    if (!ibas.objects.isNull(this.pullToRefresh)) {
                        this.pullToRefresh.hide();
                    }
                    let model: sap.ui.model.Model = this.list.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        // 已绑定过数据
                        model.addData(datas);
                    } else {
                        // 未绑定过数据
                        this.list.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                    }
                    this.list.setBusy(false);
                }
                /** 记录上次查询条件，表格滚动时自动触发 */
                query(criteria: ibas.ICriteria): void {
                    super.query(criteria);
                    // 清除历史数据
                    if (this.isDisplayed) {
                        this.list.setBusy(true);
                        this.list.setModel(null);
                    }
                }
                /** 手指触控滑动 */
                protected onTouchMove(direction: ibas.emTouchMoveDirection, event: TouchEvent): void {
                    if (direction === ibas.emTouchMoveDirection.UP) {
                        this.page.setShowFooter(false);
                    } else if (direction === ibas.emTouchMoveDirection.DOWN) {
                        this.page.setShowFooter(true);
                    }
                }
            }
        }
    }
}
