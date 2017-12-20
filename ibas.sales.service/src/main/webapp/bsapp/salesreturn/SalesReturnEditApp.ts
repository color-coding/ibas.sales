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
    IProduct,
    IWarehouse,
    IMaterialSerialJournal,
    IMaterialBatchJournal,
    IMaterialReceiptBatchContract,
    IMaterialReceiptBatchLine,
    IMaterialReceiptBatchs,
    IMaterialReceiptSerialContract,
    IMaterialReceiptBatchContractLine,
    IMaterialReceiptSerialContractLine,
    IMaterialReceiptSerials,
    IMaterialReceiptSerialLine,
    MaterialBatchReceiptServiceProxy,
    MaterialSerialReceiptServiceProxy,
    BO_CODE_PRODUCT, IMaterial, BO_CODE_MATERIALBATCHSERVICE,
    BO_CODE_MATERIALSERIALSERVICE, BO_CODE_WAREHOUSE,
} from "3rdparty/materials/index";

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
    run(): void;
    run(data: bo.SalesReturn): void;
    run(): void {
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
        super.run.apply(this, arguments);
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
            boCode: BO_CODE_PRODUCT,
            criteria: [],
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
                        item.materialBatchJournals.clear();
                        item.materialSerialJournals.clear();
                    }
                    item.itemCode = selected.code;
                    item.serialManagement = selected.serialManagement;
                    item.batchManagement = selected.batchManagement;
                    item.price = selected.price;
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
            boCode: BO_CODE_WAREHOUSE,
            criteria: [],
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
                        item.materialBatchJournals.clear();
                        item.materialSerialJournals.clear();
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
        let salesReturnItems: bo.SalesReturnItem[] = that.editData.salesReturnItems.filterBatchLine();
        if (ibas.objects.isNull(salesReturnItems) || salesReturnItems.length === 0) {
            this.messages(ibas.emMessageType.INFORMATION, ibas.i18n.prop("sales_app_no_matched_documentline_to_create_batch"));
            return;
        }
        ibas.servicesManager.runApplicationService<IMaterialReceiptBatchContract>({
            proxy: new MaterialBatchReceiptServiceProxy(that.getBatchContract(salesReturnItems))
        });
    }
    /** 新建物料序列信息 */
    createSalesReturnLineMaterialSerial(): void {
        let that: this = this;
        let goodReceiptLines: bo.SalesReturnItem[] = that.editData.salesReturnItems.filterSerialLine();
        if (ibas.objects.isNull(goodReceiptLines) || goodReceiptLines.length === 0) {
            this.messages(ibas.emMessageType.INFORMATION, ibas.i18n.prop("sales_app_no_matched_documentline_to_create_serial"));
            return;
        }
        ibas.servicesManager.runApplicationService<IMaterialReceiptSerialContract>({
            proxy: new MaterialSerialReceiptServiceProxy(that.getSerialContract(goodReceiptLines))
        });
    }

    /** 获取行-批次服务契约信息 */
    getBatchContract(salesReturnItems: bo.SalesReturnItem[]): IMaterialReceiptBatchContract {
        let contracts: IMaterialReceiptBatchContractLine[] = [];
        for (let item of salesReturnItems) {
            // 定义事件
            let batchInfos: IMaterialReceiptBatchs = {
                materialReceiptLineBatchs: [],
                createBatchJournal(batchData: IMaterialReceiptBatchLine): IMaterialBatchJournal {
                    return item.materialBatchJournals.createBatchJournal(batchData);
                },
                updateBatchJournal(batchData: IMaterialReceiptBatchLine): IMaterialBatchJournal {
                    if (!ibas.objects.isNull(batchData.caller)) {
                        let index: number = item.materialBatchJournals.indexOf(batchData.caller);
                        let batchJournal: IMaterialBatchJournal = item.materialBatchJournals[index];
                        if (!ibas.objects.isNull(batchJournal)) {
                            batchJournal.batchCode = batchData.batchCode;
                            batchJournal.quantity = batchData.quantity;
                        }
                        return batchJournal;
                    }

                },
                deleteBatchJournal(batchData: IMaterialReceiptBatchLine): void {
                    if (!ibas.objects.isNull(batchData.caller)) {
                        let index: number = item.materialBatchJournals.indexOf(batchData.caller);
                        let batchJournal: IMaterialBatchJournal = item.materialBatchJournals[index];
                        if (!ibas.objects.isNull(batchJournal)) {
                            if (item.isNew) {
                                item.materialBatchJournals.remove(batchJournal);
                            } else {
                                batchJournal.markDeleted(true);
                            }

                        }
                    }
                }
            };
            // 遍历行中的批次信息
            for (let line of item.materialBatchJournals.filterDeleted()) {
                let batchInfo: IMaterialReceiptBatchLine = {
                    batchCode: line.batchCode,
                    quantity: line.quantity,
                    direction: ibas.emDirection.IN,
                    caller: line
                };
                batchInfos.materialReceiptLineBatchs.push(batchInfo);
            }
            let batchContractLine: IMaterialReceiptBatchContractLine = {
                itemCode: item.itemCode,
                warehouse: item.warehouse,
                quantity: item.quantity,
                materialReceiptBatchs: batchInfos
            };
            contracts.push(batchContractLine);
        }
        return { materialReceiptBatchContractLines: contracts };
    }

    /** 获取行-序列服务契约信息 */
    getSerialContract(salesReturnItems: bo.SalesReturnItem[]): IMaterialReceiptSerialContract {
        let contracts: IMaterialReceiptSerialContractLine[] = [];
        for (let item of salesReturnItems) {
            // 定义事件
            let serialInfos: IMaterialReceiptSerials = {
                materialReceiptLineSerials: [],
                createSerialJournal(serialData: IMaterialReceiptSerialLine): IMaterialSerialJournal {
                    return item.materialSerialJournals.createSerialJournal(serialData);
                },
                updateSerialJournal(serialData: IMaterialReceiptSerialLine): IMaterialSerialJournal {
                    if (!ibas.objects.isNull(serialData.caller)) {
                        let index: number = item.materialSerialJournals.indexOf(serialData.caller);
                        let serialJournal: IMaterialSerialJournal = item.materialSerialJournals[index];
                        if (!ibas.objects.isNull(serialJournal)) {
                            serialJournal.serialCode = serialData.serialCode;
                            serialJournal.supplierSerial = serialData.supplierSerial;
                        }
                        return serialJournal;
                    }
                },
                deleteSerialJournal(serialData: IMaterialReceiptSerialLine): void {
                    if (!ibas.objects.isNull(serialData.caller)) {
                        let index: number = item.materialSerialJournals.indexOf(serialData.caller);
                        let serialJournal: IMaterialSerialJournal = item.materialSerialJournals[index];
                        if (!ibas.objects.isNull(serialJournal)) {
                            if (serialJournal.isNew) {
                                item.materialSerialJournals.remove(serialJournal);
                            } else {
                                serialJournal.markDeleted(true);
                            }
                        }
                    }
                }
            };
            // 遍历行中的序列信息
            for (let line of item.materialSerialJournals.filterDeleted()) {
                let serialInfo: IMaterialReceiptSerialLine = {
                    serialCode: line.serialCode,
                    supplierSerial: line.supplierSerial,
                    direction: ibas.emDirection.IN,
                    caller: line
                };
                serialInfos.materialReceiptLineSerials.push(serialInfo);
            }
            let serialContractLine: IMaterialReceiptSerialContractLine = {
                itemCode: item.itemCode,
                warehouse: item.warehouse,
                quantity: item.quantity,
                materialLineSerials: serialInfos
            };
            contracts.push(serialContractLine);
        }
        return { materialReceiptSerialContractLines: contracts };
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
