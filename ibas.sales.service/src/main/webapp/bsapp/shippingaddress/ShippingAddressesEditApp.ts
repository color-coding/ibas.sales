/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace app {
        /** 编辑应用-送货地址 */
        export class ShippingAddressesEditApp extends ibas.BOApplication<IShippingAddressesEditView> {
            /** 应用标识 */
            static APPLICATION_ID: string = "1705e5ee-53b6-4422-8b36-5406e13ab0a9";
            /** 应用名称 */
            static APPLICATION_NAME: string = "sales_app_shippingaddresses_edit";
            /** 构造函数 */
            constructor() {
                super();
                this.id = ShippingAddressesEditApp.APPLICATION_ID;
                this.name = ShippingAddressesEditApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.createDataEvent = this.createData;
                this.view.editDataEvent = this.editData;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                let datas: bo.ShippingAddress[] = this.editAddresses.filterDeleted();
                this.view.showShippingAddresses(datas);
                if (datas.length > 0) {
                    this.view.showShippingAddress(datas[0]);
                } else {
                    this.view.showShippingAddress(null);
                }
            }
            run(): void;
            run(datas: bo.ShippingAddresss): void;
            run(): void {
                if (ibas.objects.instanceOf(arguments[0], bo.ShippingAddresss)) {
                    this.editAddresses = arguments[0];
                    this.show();
                } else {
                    super.run.apply(this, arguments);
                }
            }
            /** 待编辑的数据 */
            protected editAddresses: bo.ShippingAddresss;
            /** 删除数据 */
            protected deleteData(data: bo.ShippingAddress): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_delete")
                    ));
                    return;
                }
                if (data.isNew) {
                    this.editAddresses.remove(data);
                } else {
                    data.delete();
                }
                this.view.showShippingAddresses(this.editAddresses.filterDeleted());
                this.view.showShippingAddress(null);
            }
            /** 新建数据 */
            protected createData(): void {
                let data: bo.ShippingAddress = this.editAddresses.create();
                this.editData(data);
            }
            /** 待编辑的数据 */
            protected editAddress: bo.ShippingAddress;
            /** 编辑数据 */
            protected editData(data: bo.ShippingAddress): void {
                this.view.showShippingAddress(data);
            }
            /** 关闭视图 */
            close(): void {
                super.close();
                if (this.onClosed instanceof Function) {
                    this.onClosed();
                }
            }
            onClosed: Function;
        }
        /** 视图-送货地址 */
        export interface IShippingAddressesEditView extends ibas.IBOView {
            /** 显示数据 */
            showShippingAddresses(datas: bo.ShippingAddress[]): void;
            /** 编辑数据事件 */
            editDataEvent: Function;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 新建数据事件 */
            createDataEvent: Function;
            /** 显示数据 */
            showShippingAddress(data: bo.ShippingAddress): void;
        }
    }
}
