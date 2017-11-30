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
import { BO_CODE_CUSTOMER, ICustomer } from "../../3rdparty/businesspartner/index";
import {
    IProduct,
    IWarehouse,
    IMaterialSerialJournal,
    IMaterialBatchJournal,
    IMaterialBatchService,
    IMaterialSerialService,
    IMaterialBatchServiceJournals,
    IMaterialSerialServiceJournals,
    BO_CODE_PRODUCT, BO_CODE_RECEIPT_MATERIALSERIAL,
    BO_CODE_RECEIPT_MATERIALBATCH, IMaterial, BO_CODE_MATERIALBATCHSERVICE,
    BO_CODE_MATERIALSERIALSERVICE, BO_CODE_WAREHOUSE,
} from "../../3rdparty/materials/index";

/** 编辑应用-销售退货 */
export class SalesReturnEditApp extends ibas.BOEditApplication<ISalesReturnEditView, bo.SalesReturn> {

    /** 应用标识 */
    static APPLICATION_ID: string = "b1b7d93c-ab24-4e3b-af95-810fdf3f2622";
    /** 应用名称 */
    static APPLICATION_NAME: string = "sales_app_salesreturn_edit";
    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = bo.SalesReturn.BUSINESS_OBJECT_CODE;
    /** 构造函数 */
    constructor() {
        super();
        this.id = SalesReturnEditApp.APPLICATION_ID;
        this.name = SalesReturnEditApp.APPLICATION_NAME;
        this.boCode = SalesReturnEditApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
        this.view.deleteDataEvent = this.deleteData;
        this.view.createDataEvent = this.createData;
        this.view.addSalesReturnItemEvent = this.addSalesReturnItem;
        this.view.removeSalesReturnItemEvent = this.removeSalesReturnItem;
        this.view.chooseSalesReturnCustomerEvent = this.chooseSalesReturnCustomer;
        this.view.chooseSalesReturnItemMaterialEvent = this.chooseSalesReturnItemMaterial;
        this.view.chooseSalesReturnItemWarehouseEvent = this.chooseSalesReturnItemWarehouse;
        this.view.createSalesReturnItemMaterialBatchEvent = this.createSalesReturnLineMaterialBatch;
        this.view.createSalesReturnItemMaterialSerialEvent = this.createSalesReturnLineMaterialSerial;
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
        if (ibas.objects.isNull(this.editData)) {
            // 创建编辑对象实例
            this.editData = new bo.SalesReturn();
            this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
        }
        this.view.showSalesReturn(this.editData);
        this.view.showSalesReturnItems(this.editData.salesReturnItems.filterDeleted());
    }
    /** 运行,覆盖原方法 */
    run(...args: any[]): void {
        let that: this = this;
        if (ibas.objects.instanceOf(arguments[0], bo.SalesReturn)) {
            // 尝试重新查询编辑对象
            let criteria: ibas.ICriteria = arguments[0].criteria();
            if (!ibas.objects.isNull(criteria) && criteria.conditions.length > 0) {
                // 有效的查询对象查询
                let boRepository: BORepositorySales = new BORepositorySales();
                boRepository.fetchSalesReturn({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesReturn>): void {
                        let data: bo.SalesReturn;
                        if (opRslt.resultCode === 0) {
                            data = opRslt.resultObjects.firstOrDefault();
                        }
                        if (ibas.objects.instanceOf(data, bo.SalesReturn)) {
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
        super.run.apply(this, args);
    }
    /** 待编辑的数据 */
    protected editData: bo.SalesReturn;
    protected lineEditData: bo.SalesDeliveryItem;
    /** 保存数据 */
    protected saveData(): void {
        let that: this = this;
        let boRepository: BORepositorySales = new BORepositorySales();
        boRepository.saveSalesReturn({
            beSaved: this.editData,
            onCompleted(opRslt: ibas.IOperationResult<bo.SalesReturn>): void {
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
                that.editData = new bo.SalesReturn();
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
    /** 选择销售退货客户事件 */
    private chooseSalesReturnCustomer(): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<ICustomer>({
            boCode: BO_CODE_CUSTOMER,
            criteria: [
                new ibas.Condition(BO_CODE_CUSTOMER,
                    ibas.emConditionOperation.NOT_EQUAL, ibas.strings.valueOf(this.editData.customerCode)),
            ],
            onCompleted(selecteds: ibas.List<ICustomer>): void {
                that.editData.customerCode = selecteds.firstOrDefault().code;
                that.editData.customerName = selecteds.firstOrDefault().name;
            }
        });
    }
    /** 选择销售退货物料事件 */
    private chooseSalesReturnItemMaterial(caller: bo.SalesReturnItem): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<IProduct>({
            caller: caller,
            boCode: BO_CODE_PRODUCT,
            criteria: [
            ],
            onCompleted(selecteds: ibas.List<IProduct>): void {
                // 获取触发的对象
                let index: number = that.editData.salesReturnItems.indexOf(caller);
                let item: bo.SalesReturnItem = that.editData.salesReturnItems[index];
                // 选择返回数量多余触发数量时,自动创建新的项目
                let created: boolean = false;
                for (let selected of selecteds) {
                    if (ibas.objects.isNull(item)) {
                        item = that.editData.salesReturnItems.create();
                        created = true;
                    }
                    if (item.itemCode !== selected.code) {
                        item.salesReturnMaterialBatchJournals.clear();
                        item.salesReturnMaterialSerialJournals.clear();
                    }
                    item.itemCode = selected.code;
                    item.quantity = 1;
                    item = null;
                }
                if (created) {
                    // 创建了新的行项目
                    that.view.showSalesReturnItems(that.editData.salesReturnItems.filterDeleted());
                }
            }
        });
    }
    private chooseSalesReturnItemWarehouse(caller: bo.SalesReturnItem): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<IWarehouse>({
            caller: caller,
            boCode: BO_CODE_WAREHOUSE,
            criteria: [
            ],
            onCompleted(selecteds: ibas.List<IWarehouse>): void {
                // 获取触发的对象
                let index: number = that.editData.salesReturnItems.indexOf(caller);
                let item: bo.SalesReturnItem = that.editData.salesReturnItems[index];
                // 选择返回数量多余触发数量时,自动创建新的项目
                let created: boolean = false;
                for (let selected of selecteds) {
                    if (ibas.objects.isNull(item)) {
                        item = that.editData.salesReturnItems.create();
                        created = true;
                    }
                    if (item.warehouse !== selected.code) {
                        item.salesReturnMaterialBatchJournals.deleteAll();
                        item.salesReturnMaterialSerialJournals.deleteAll();
                    }
                    item.warehouse = selected.code;
                    item = null;
                }
                if (created) {
                    // 创建了新的行项目
                    that.view.showSalesReturnItems(that.editData.salesReturnItems.filterDeleted());
                }
            }
        });
    }
    /** 添加销售退货-行事件 */
    addSalesReturnItem(): void {
        this.editData.salesReturnItems.create();
        // 仅显示没有标记删除的
        this.view.showSalesReturnItems(this.editData.salesReturnItems.filterDeleted());
    }
    /** 删除销售退货-行事件 */
    removeSalesReturnItem(items: bo.SalesReturnItem[]): void {
        // 非数组，转为数组
        if (!(items instanceof Array)) {
            items = [items];
        }
        if (items.length === 0) {
            return;
        }
        // 移除项目
        for (let item of items) {
            if (this.editData.salesReturnItems.indexOf(item) >= 0) {
                if (item.isNew) {
                    // 新建的移除集合
                    this.editData.salesReturnItems.remove(item);
                } else {
                    // 非新建标记删除
                    item.delete();
                }
            }
        }
        // 仅显示没有标记删除的
        this.view.showSalesReturnItems(this.editData.salesReturnItems.filterDeleted());
    }
    /** 新建物料批次信息 */
    createSalesReturnLineMaterialBatch(): void {
        let that: this = this;
        let caller: IMaterialBatchService[] = that.getBatchData();
        if (ibas.objects.isNull(caller) || caller.length === 0) {
            this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("materials_app_no_batchmanaged"));
            return;
        }
        ibas.servicesManager.runChooseService<IMaterialBatchService>({
            caller: caller,
            boCode: BO_CODE_RECEIPT_MATERIALBATCH,
            criteria: [
            ],
            onCompleted(callbackData: ibas.List<IMaterialBatchService>): void {
                // 获取触发的对象
                for (let line of callbackData) {
                    let item: bo.SalesReturnItem = that.editData.salesReturnItems[line.index];
                    for (let batchLine of item.salesReturnMaterialBatchJournals) {
                        batchLine.markDeleted(true);
                    }
                    for (let batchJournal of line.materialBatchServiceJournals.filterDeleted()) {
                        // 如果批次号为空 不处理
                        if (ibas.objects.isNull(batchJournal.batchCode)) {
                            continue;
                        }
                        let batchLine: IMaterialBatchJournal = item.salesReturnMaterialBatchJournals.createJournal(batchJournal);
                    }
                }
            }
        });
    }
    /** 新建物料序列信息 */
    createSalesReturnLineMaterialSerial(): void {
        let that: this = this;
        let caller: IMaterialSerialService[] = that.getSerialData();
        if (ibas.objects.isNull(caller) || caller.length === 0) {
            this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("materials_app_no_serialmanaged"));
            return;
        }
        ibas.servicesManager.runChooseService<IMaterialSerialService>({
            caller: caller,
            boCode: BO_CODE_RECEIPT_MATERIALSERIAL,
            criteria: [
            ],
            onCompleted(callbackData: ibas.List<IMaterialSerialService>): void {
                // 获取触发的对象
                for (let line of callbackData) {
                    let item: bo.SalesReturnItem = that.editData.salesReturnItems[line.index];
                    for (let serialLine of item.salesReturnMaterialSerialJournals) {
                        serialLine.markDeleted(true);
                    }
                    for (let serialJournal of line.materialSerialServiceJournals.filterDeleted()) {
                        // 如果序列号为空 不处理
                        if (ibas.objects.isNull(serialJournal.serialCode)) {
                            continue;
                        }
                        let serialLine: IMaterialSerialJournal = item.salesReturnMaterialSerialJournals.createJournal(serialJournal);
                    }
                }
            }
        });
    }

    /** 获取行-批次信息 */
    getBatchData(): IMaterialBatchService[] {
        // 获取行数据
        let goodReceiptLines: bo.SalesReturnItem[] = this.editData.salesReturnItems.filterDeleted();
        let inputData: IMaterialBatchService[] = new Array<IMaterialBatchService>();
        for (let line of goodReceiptLines) {
            if (!ibas.objects.isNull(line.batchManagement) &&
                line.batchManagement.toString() === ibas.enums.toString(ibas.emYesNo, ibas.emYesNo.NO)) {
                continue;
            }
            let input: IMaterialBatchService = ibas.boFactory.create(BO_CODE_MATERIALBATCHSERVICE);
            input.index = goodReceiptLines.indexOf(line);
            input.itemCode = line.itemCode;
            input.quantity = line.quantity;
            input.warehouse = line.warehouse;
            input.direction = ibas.emDirection.IN;
            if (line.salesReturnMaterialBatchJournals.filterDeleted().length === 0) {
                input.needBatchQuantity = line.quantity;
                input.selectedBatchQuantity = 0;
            } else {
                for (let item of line.salesReturnMaterialBatchJournals.filterDeleted()) {
                    let batchLine: IMaterialBatchJournal = input.materialBatchServiceJournals.create();
                    batchLine.batchCode = item.batchCode;
                    batchLine.itemCode = item.itemCode;
                    batchLine.warehouse = item.warehouse;
                    batchLine.quantity = item.quantity;
                    batchLine.expirationDate = item.expirationDate;
                    batchLine.admissionDate = item.admissionDate;
                    batchLine.manufacturingDate = item.manufacturingDate;
                    batchLine.direction = ibas.emDirection.IN;
                }
            }
            inputData.push(input);
        }
        return inputData;
    }
    /** 获取行-序列信息 */
    getSerialData(): IMaterialSerialService[] {
        // 获取行数据
        let goodReceiptLines: bo.SalesReturnItem[] = this.editData.salesReturnItems.filterDeleted();
        let inputData: IMaterialSerialService[] = new Array<IMaterialSerialService>();
        for (let line of goodReceiptLines) {
            if (!ibas.objects.isNull(line.serialManagement) &&
                line.serialManagement.toString() === ibas.enums.toString(ibas.emYesNo, ibas.emYesNo.NO)) {
                continue;
            }
            let input: IMaterialSerialService = ibas.boFactory.create(BO_CODE_MATERIALSERIALSERVICE);
            input.index = goodReceiptLines.indexOf(line);
            input.itemCode = line.itemCode;
            input.quantity = line.quantity;
            input.warehouse = line.warehouse;
            input.direction = ibas.emDirection.IN;
            if (line.salesReturnMaterialSerialJournals.filterDeleted().length === 0) {
                input.needSerialQuantity = line.quantity;
                input.selectedSerialQuantity = 0;
            } else {
                for (let item of line.salesReturnMaterialSerialJournals.filterDeleted()) {
                    let serialLine: IMaterialSerialJournal = input.materialSerialServiceJournals.create();
                    serialLine.supplierSerial = item.supplierSerial;
                    serialLine.batchSerial = item.batchSerial;
                    serialLine.expirationDate = item.expirationDate;
                    serialLine.warrantyStartDate = item.warrantyStartDate;
                    serialLine.warrantyEndDate = item.warrantyEndDate;
                    serialLine.expirationDate = item.expirationDate;
                    serialLine.admissionDate = item.admissionDate;
                    serialLine.manufacturingDate = item.manufacturingDate;
                    serialLine.serialCode = item.serialCode;
                    serialLine.itemCode = item.itemCode;
                    serialLine.warehouse = item.warehouse;
                    serialLine.direction = ibas.emDirection.IN;
                }
            }
            inputData.push(input);
        }
        return inputData;
    }
}
/** 视图-销售退货 */
export interface ISalesReturnEditView extends ibas.IBOEditView {
    /** 显示数据 */
    showSalesReturn(data: bo.SalesReturn): void;
    /** 删除数据事件 */
    deleteDataEvent: Function;
    /** 新建数据事件，参数1：是否克隆 */
    createDataEvent: Function;
    /** 添加销售退货-行事件 */
    addSalesReturnItemEvent: Function;
    /** 删除销售退货-行事件 */
    removeSalesReturnItemEvent: Function;
    /** 显示数据 */
    showSalesReturnItems(datas: bo.SalesReturnItem[]): void;
    /** 选择销售退货客户事件 */
    chooseSalesReturnCustomerEvent: Function;
    /** 选择销售退货物料事件 */
    chooseSalesReturnItemMaterialEvent: Function;
    /** 选择销售退货仓库事件 */
    chooseSalesReturnItemWarehouseEvent: Function;
    /** 创建销售退货单行物料批次事件 */
    createSalesReturnItemMaterialBatchEvent: Function;
    /** 创建销售退货行物料序列号事件 */
    createSalesReturnItemMaterialSerialEvent: Function;
}
