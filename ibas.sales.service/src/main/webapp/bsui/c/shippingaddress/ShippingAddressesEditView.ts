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
            /** 编辑视图-送货地址 */
            export class ShippingAddressesEditView extends ibas.BODialogView implements app.IShippingAddressesEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 编辑数据事件 */
                editDataEvent: Function;

                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.selectAddresses = new sap.m.Select("", {
                        width: "100%",
                        change(oControlEvent: sap.ui.base.Event): void {
                            let item: sap.ui.core.Item = oControlEvent.getParameters().selectedItem;
                            let data: bo.ShippingAddress = (<any>item.getModel()).getData();
                            if (!ibas.objects.isNull(data)) {
                                that.fireViewEvents(that.editDataEvent, data);
                            }
                        }
                    });
                    this.layoutMain = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress") }),
                            this.selectAddresses,
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_name") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text,
                            }).bindProperty("value", {
                                path: "name"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_shippingstatus") }),
                            new sap.m.Select("", {
                                items: openui5.utils.createComboBoxItems(bo.emShippingStatus)
                            }).bindProperty("selectedKey", {
                                path: "shippingstatus",
                                type: "sap.ui.model.type.Integer"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_consignee") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "consignee",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_mobilephone") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "mobilePhone"
                            }),
                            new sap.m.Label("", {
                                text: ibas.i18n.prop("bo_shippingaddress_country") +
                                    "/" + ibas.i18n.prop("bo_shippingaddress_province") +
                                    "/" + ibas.i18n.prop("bo_shippingaddress_city") +
                                    "/" + ibas.i18n.prop("bo_shippingaddress_district")
                            }),
                            new sap.m.ex.ProvincesCityDistrict("", {
                                width: "100%",
                                direction: sap.m.FlexDirection.Column,
                                country: { path: "country" },
                                province: { path: "province" },
                                city: { path: "city" },
                                district: { path: "district" },
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_street") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "street"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_zipcode") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "zipCode"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_trackingnumber") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "trackingNumber"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_expense") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Number
                            }).bindProperty("value", {
                                path: "expense",
                                type: new openui5.datatype.Sum(),
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_currency") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "currency",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_remark1") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "remark1"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_shippingaddress_remark2") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "remark2"
                            }),
                        ]
                    });
                    return new sap.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretchOnPhone: true,
                        horizontalScrolling: true,
                        verticalScrolling: true,
                        content: [this.layoutMain],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_data_new"),
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    that.fireViewEvents(that.createDataEvent);
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_data_delete"),
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    that.fireViewEvents(that.deleteDataEvent, (<any>that.layoutMain.getModel()).getData());
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    that.fireViewEvents(that.closeEvent);
                                }
                            }),
                        ]
                    });
                }

                private layoutMain: sap.ui.layout.form.SimpleForm;
                private selectAddresses: sap.m.Select;

                /** 显示数据 */
                showShippingAddresses(datas: bo.ShippingAddress[]): void {
                    for (let item of this.layoutMain.getContent()) {
                        if (item instanceof sap.m.Input) {
                            item.setEditable(false);
                        } else if (item instanceof sap.m.Select) {
                            item.setEnabled(false);
                        }
                    }
                    this.selectAddresses.destroyItems();
                    for (let item of datas) {
                        let sItem: sap.ui.core.ListItem = new sap.ui.core.ListItem("", {
                            key: {
                                path: "/objectKey"
                            },
                            text: {
                                path: "/name"
                            }
                        });
                        sItem.setModel(new sap.ui.model.json.JSONModel(item));
                        this.selectAddresses.addItem(sItem);
                    }
                }
                /** 显示数据 */
                showShippingAddress(data: bo.ShippingAddress): void {
                    if (!ibas.objects.isNull(data)) {
                        for (let item of this.layoutMain.getContent()) {
                            if (item instanceof sap.m.Input) {
                                item.setEditable(true);
                            } else if (item instanceof sap.m.Select) {
                                item.setEnabled(true);
                            }
                        }
                    }
                    this.layoutMain.setModel(new sap.ui.model.json.JSONModel(data));
                    this.layoutMain.bindObject("/");
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.layoutMain, data);
                }
            }
        }
    }
}
