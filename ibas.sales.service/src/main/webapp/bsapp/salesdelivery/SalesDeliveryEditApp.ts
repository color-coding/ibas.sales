/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "../../borep/bo/index";
import { BORepositorySales } from "../../borep/BORepositories";
import { BO_CODE_CUSTOMER, ICustomer } from "3rdparty/businesspartner/index";
import {
    IWarehouse,
    IProduct,
    IMaterialSerialJournal,
    IMaterialBatchJournal,
    MaterialIssueBatchServiceProxy,
    IMaterialBatchContract,
    IMaterialSerialContract,
    BO_CODE_PRODUCT,
    BO_CODE_MATERIAL,
    MaterialIssueSerialServiceProxy,
    IMaterial,
    BO_CODE_WAREHOUSE,
} from "3rdparty/materials/index";


/** 编辑应用-销售交货 */
export class SalesDeliveryEditApp extends ibas.BOEditApplication<ISalesDeliveryEditView, bo.SalesDelivery> {

    /** 应用标识 */
    static APPLICATION_ID: string = "2b7fcb17-6aed-4b4f-abf3-32de889949d1";
    /** 应用名称 */
    static APPLICATION_NAME: string = "sales_app_salesdelivery_edit";
    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = bo.SalesDelivery.BUSINESS_OBJECT_CODE;
    /** 构造函数 */
    constructor() {
        super();
        this.id = SalesDeliveryEditApp.APPLICATION_ID;
        this.name = SalesDeliveryEditApp.APPLICATION_NAME;
        this.boCode = SalesDeliveryEditApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
        this.view.deleteDataEvent = this.deleteData;
        this.view.createDataEvent = this.createData;
        this.view.addSalesDeliveryItemEvent = this.addSalesDeliveryItem;
        this.view.removeSalesDeliveryItemEvent = this.removeSalesDeliveryItem;
        this.view.chooseSalesDeliveryCustomerEvent = this.chooseSalesDeliveryCustomer;
        this.view.chooseSalesDeliveryItemMaterialEvent = this.chooseSalesDeliveryItemMaterial;
        this.view.chooseSalesDeliveryItemMaterialBatchEvent = this.chooseSalesDeliveryLineMaterialBatch;
        this.view.chooseSalesDeliveryItemMaterialSerialEvent = this.chooseSalesDeliveryLineMaterialSerial;
        this.view.chooseSalesDeliveryItemWarehouseEvent = this.chooseSalesDeliveryItemWarehouse;
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
        if (ibas.objects.isNull(this.editData)) {
            // 创建编辑对象实例
            this.editData = new bo.SalesDelivery();
            this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
        }
        this.view.showSalesDelivery(this.editData);
        this.view.showSalesDeliveryItems(this.editData.salesDeliveryItems.filterDeleted());
    }
    /** 运行,覆盖原方法 */
    run(): void;
    run(data: bo.SalesDelivery): void;
    run(): void {
        let that: this = this;
        if (ibas.objects.instanceOf(arguments[0], bo.SalesDelivery)) {
            let data: bo.SalesDelivery = arguments[0];
            // 新对象直接编辑
            if (data.isNew) {
                that.editData = data;
                that.show();
                return;
            }
            // 尝试重新查询编辑对象
            let criteria: ibas.ICriteria = data.criteria();
            if (!ibas.objects.isNull(criteria) && criteria.conditions.length > 0) {
                // 有效的查询对象查询
                let boRepository: BORepositorySales = new BORepositorySales();
                boRepository.fetchSalesDelivery({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesDelivery>): void {
                        let data: bo.SalesDelivery;
                        if (opRslt.resultCode === 0) {
                            data = opRslt.resultObjects.firstOrDefault();
                        }
                        if (ibas.objects.instanceOf(data, bo.SalesDelivery)) {
                            // 查询到了有效数据
                            that.editData = data;
                            that.show();
                        } else {
                            // 数据重新检索无效
                            that.messages({
                                type: ibas.emMessageType.WARNING,
                                message: ibas.i18n.prop("shell_data_deleted_and_created"),
                                onCompleted(): void {
                                    that.show();
                                }
                            });
                        }
                    }
                });
                // 开始查询数据
                return;
            }
        }
        super.run.apply(this, arguments);
    }
    /** 待编辑的数据 */
    protected editData: bo.SalesDelivery;
    protected lineEditData: bo.SalesDeliveryItem;
    /** 保存数据 */
    protected saveData(): void {
        let that: this = this;
        let boRepository: BORepositorySales = new BORepositorySales();
        // 物料数量与批次数量不相等
        if (!this.editData.salesDeliveryItems.checkBatchQuantity()) {
            this.messages(ibas.emMessageType.ERROR, ibas.i18n.prop("sales_app_material_quantity_not_equal_batch_quantity"));
            return;
        }
        if (!this.editData.salesDeliveryItems.checkSerialQuantity()) {
            this.messages(ibas.emMessageType.ERROR, ibas.i18n.prop("sales_app_material_quantity_not_equal_serial_quantity"));
            return;
        }
        boRepository.saveSalesDelivery({
            beSaved: this.editData,
            onCompleted(opRslt: ibas.IOperationResult<bo.SalesDelivery>): void {
                try {
                    that.busy(false);
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    if (opRslt.resultObjects.length === 0) {
                        // 删除成功，释放当前对象
                        that.messages(ibas.emMessageType.SUCCESS,
                            ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                        that.editData = undefined;
                    } else {
                        // 替换编辑对象
                        that.editData = opRslt.resultObjects.firstOrDefault();
                        that.messages(ibas.emMessageType.SUCCESS,
                            ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                    }
                    // 刷新当前视图
                    that.viewShowed();
                } catch (error) {
                    that.messages(error);
                }
            }
        });
        this.busy(true);
        this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_saving_data"));
    }
    /** 删除数据 */
    protected deleteData(): void {
        let that: this = this;
        this.messages({
            type: ibas.emMessageType.QUESTION,
            title: ibas.i18n.prop(this.name),
            message: ibas.i18n.prop("sys_whether_to_delete"),
            actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
            onCompleted(action: ibas.emMessageAction): void {
                if (action === ibas.emMessageAction.YES) {
                    that.editData.delete();
                    that.saveData();
                }
            }
        });
    }
    /** 新建数据，参数1：是否克隆 */
    protected createData(clone: boolean): void {
        let that: this = this;
        let createData: Function = function (): void {
            if (clone) {
                // 克隆对象
                that.editData = that.editData.clone();
                that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_cloned_new"));
                that.viewShowed();
            } else {
                // 新建对象
                that.editData = new bo.SalesDelivery();
                that.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                that.viewShowed();
            }
        };
        if (that.editData.isDirty) {
            this.messages({
                type: ibas.emMessageType.QUESTION,
                title: ibas.i18n.prop(this.name),
                message: ibas.i18n.prop("sys_data_not_saved_whether_to_continue"),
                actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                onCompleted(action: ibas.emMessageAction): void {
                    if (action === ibas.emMessageAction.YES) {
                        createData();
                    }
                }
            });
        } else {
            createData();
        }
    }
    /** 选择销售交货客户事件 */
    private chooseSalesDeliveryCustomer(): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<ICustomer>({
            boCode: BO_CODE_CUSTOMER,
            criteria: [
            ],
            onCompleted(selecteds: ibas.List<ICustomer>): void {
                that.editData.customerCode = selecteds.firstOrDefault().code;
                that.editData.customerName = selecteds.firstOrDefault().name;
            }
        });
    }
    /** 选择销售交货行物料事件 */
    private chooseSalesDeliveryItemMaterial(caller: bo.SalesDeliveryItem): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<IProduct>({
            boCode: BO_CODE_PRODUCT,
            criteria: [],
            onCompleted(selecteds: ibas.List<IProduct>): void {
                let index: number = that.editData.salesDeliveryItems.indexOf(caller);
                let item: bo.SalesDeliveryItem = that.editData.salesDeliveryItems[index];
                // 选择返回数量多余触发数量时,自动创建新的项目
                let created: boolean = false;
                for (let selected of selecteds) {
                    if (ibas.objects.isNull(item)) {
                        item = that.editData.salesDeliveryItems.create();
                        created = true;
                    }
                    if (item.itemCode !== selected.code) {
                        item.materialBatchs.deleteAll();
                        item.materialSerials.deleteAll();
                    }
                    item.itemCode = selected.code;
                    item.itemDescription = selected.name;
                    item.serialManagement = selected.serialManagement;
                    item.batchManagement = selected.batchManagement;
                    // item.price = selected.price;
                    item.quantity = 1;
                    item = null;
                }
                if (created) {
                    // 创建了新的行项目
                    that.view.showSalesDeliveryItems(that.editData.salesDeliveryItems.filterDeleted());
                }
            }
        });
    }
    /** 选择销售交货行仓库事件 */
    private chooseSalesDeliveryItemWarehouse(caller: bo.SalesDeliveryItem): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<IWarehouse>({
            boCode: BO_CODE_WAREHOUSE,
            criteria: [],
            onCompleted(selecteds: ibas.List<IWarehouse>): void {
                let index: number = that.editData.salesDeliveryItems.indexOf(caller);
                let item: bo.SalesDeliveryItem = that.editData.salesDeliveryItems[index];
                // 选择返回数量多余触发数量时,自动创建新的项目
                let created: boolean = false;
                for (let selected of selecteds) {
                    if (ibas.objects.isNull(item)) {
                        item = that.editData.salesDeliveryItems.create();
                        created = true;
                    }
                    if (item.itemCode !== selected.code) {
                        item.materialBatchs.deleteAll();
                        item.materialSerials.deleteAll();
                    }
                    item.warehouse = selected.code;
                    item = null;
                }
                if (created) {
                    // 创建了新的行项目
                    that.view.showSalesDeliveryItems(that.editData.salesDeliveryItems.filterDeleted());
                }
            }
        });
    }
    /** 添加销售交货-行事件 */
    addSalesDeliveryItem(): void {
        this.editData.salesDeliveryItems.create();
        // 仅显示没有标记删除的
        this.view.showSalesDeliveryItems(this.editData.salesDeliveryItems.filterDeleted());
    }
    /** 删除销售交货-行事件 */
    removeSalesDeliveryItem(items: bo.SalesDeliveryItem[]): void {
        // 非数组，转为数组
        if (!(items instanceof Array)) {
            items = [items];
        }
        if (items.length === 0) {
            return;
        }
        // 移除项目
        for (let item of items) {
            if (this.editData.salesDeliveryItems.indexOf(item) >= 0) {
                if (item.isNew) {
                    // 新建的移除集合
                    this.editData.salesDeliveryItems.remove(item);
                } else {
                    // 非新建标记删除
                    item.delete();
                }
            }
        }
        // 仅显示没有标记删除的
        this.view.showSalesDeliveryItems(this.editData.salesDeliveryItems.filterDeleted());
    }

    /** 选择销售交货行批次事件 */
    chooseSalesDeliveryLineMaterialBatch(): void {
        let that: this = this;
        let salesDeliveryLines: bo.SalesDeliveryItem[] = this.editData.salesDeliveryItems.filter(
            c => c.isDeleted === false
                && !ibas.objects.isNull(c.lineStatus)
                && c.batchManagement !== undefined
                && c.batchManagement === ibas.emYesNo.YES
                && !ibas.strings.isEmpty(c.itemCode)
                && !ibas.strings.isEmpty(c.warehouse)
        );
        if (ibas.objects.isNull(salesDeliveryLines) || salesDeliveryLines.length === 0) {
            this.messages(ibas.emMessageType.INFORMATION, ibas.i18n.prop("sales_app_no_matched_documentline_to_choose_batch"));
            return;
        }
        // 调用批次选择服务
        // 调用批次选择服务
        ibas.servicesManager.runApplicationService<IMaterialBatchContract[]>({
            proxy: new MaterialIssueBatchServiceProxy(that.getBatchContract(salesDeliveryLines))
        });
    }
    /** 选择销售交货序列事件 */
    chooseSalesDeliveryLineMaterialSerial(): void {
        let that: this = this;
        let salesDeliveryLines: bo.SalesDeliveryItem[] = this.editData.salesDeliveryItems
            .filter(c => c.isDeleted === false
                && !ibas.objects.isNull(c.lineStatus)
                && c.serialManagement !== undefined
                && c.serialManagement === ibas.emYesNo.YES
                && !ibas.strings.isEmpty(c.itemCode)
                && !ibas.strings.isEmpty(c.warehouse));
        if (ibas.objects.isNull(salesDeliveryLines) || salesDeliveryLines.length === 0) {
            this.messages(ibas.emMessageType.INFORMATION, ibas.i18n.prop("sales_app_no_matched_documentline_to_choose_serial"));
            return;
        }
        // 调用序列选择服务
        ibas.servicesManager.runApplicationService<IMaterialSerialContract[]>({
            proxy: new MaterialIssueSerialServiceProxy(that.getSerialContract(salesDeliveryLines))
        });
    }
    /** 获取行-批次服务契约信息 */
    getBatchContract(salesDeliveryLines: bo.SalesDeliveryItem[]): IMaterialBatchContract[] {
        let contracts: IMaterialBatchContract[] = new ibas.ArrayList<IMaterialBatchContract>();
        for (let item of salesDeliveryLines) {
            contracts.push({
                itemCode: item.itemCode,
                warehouse: item.warehouse,
                quantity: item.quantity,
                materialBatchs: item.materialBatchs,
            });
        }
        return contracts;
    }

    /** 获取行-批次服务契约信息 */
    getSerialContract(salesDeliveryLines: bo.SalesDeliveryItem[]): IMaterialSerialContract[] {
        let contracts: IMaterialSerialContract[] = new ibas.ArrayList<IMaterialSerialContract>();
        for (let item of salesDeliveryLines) {
            contracts.push({
                itemCode: item.itemCode,
                warehouse: item.warehouse,
                quantity: item.quantity,
                materialSerials: item.materialSerials,
            });
        }
        return contracts;
    }
}
/** 视图-销售交货 */
export interface ISalesDeliveryEditView extends ibas.IBOEditView {
    /** 显示数据 */
    showSalesDelivery(data: bo.SalesDelivery): void;
    /** 删除数据事件 */
    deleteDataEvent: Function;
    /** 新建数据事件，参数1：是否克隆 */
    createDataEvent: Function;
    /** 添加销售交货-行事件 */
    addSalesDeliveryItemEvent: Function;
    /** 删除销售交货-行事件 */
    removeSalesDeliveryItemEvent: Function;
    /** 显示数据 */
    showSalesDeliveryItems(datas: bo.SalesDeliveryItem[]): void;
    /** 选择销售交货客户事件 */
    chooseSalesDeliveryCustomerEvent: Function;
    /** 选择销售交货物料事件 */
    chooseSalesDeliveryItemMaterialEvent: Function;
    /** 选择销售交货仓库事件 */
    chooseSalesDeliveryItemWarehouseEvent: Function;
    /** 选择销售交货单行物料批次事件 */
    chooseSalesDeliveryItemMaterialBatchEvent: Function;
    /** 选择销售交货行物料序列号事件 */
    chooseSalesDeliveryItemMaterialSerialEvent: Function;

}
