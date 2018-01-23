/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as mm from "3rdparty/materials/index";
import * as bp from "3rdparty/businesspartner/index";
import * as bo from "../../borep/bo/index";
import { BORepositorySales } from "../../borep/BORepositories";

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
        this.view.chooseSalesReturnPriceListEvent = this.chooseSalesReturnPriceList;
        this.view.chooseSalesReturnItemMaterialEvent = this.chooseSalesReturnItemMaterial;
        this.view.chooseSalesReturnItemWarehouseEvent = this.chooseSalesReturnItemWarehouse;
        this.view.chooseSalesReturnItemMaterialBatchEvent = this.createSalesReturnLineMaterialBatch;
        this.view.chooseSalesReturnItemMaterialSerialEvent = this.createSalesReturnLineMaterialSerial;
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
            let data: bo.SalesReturn = arguments[0];
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
        ibas.servicesManager.runChooseService<bp.ICustomer>({
            boCode: bp.BO_CODE_CUSTOMER,
            chooseType: ibas.emChooseType.SINGLE,
            criteria: bp.conditions.customer.create(),
            onCompleted(selecteds: ibas.List<bp.ICustomer>): void {
                let selected: bp.ICustomer = selecteds.firstOrDefault();
                that.editData.customerCode = selected.code;
                that.editData.customerName = selected.name;
                that.editData.priceList = selected.priceList;
                that.editData.contactPerson = selected.contactPerson;
            }
        });
    }
    /** 选择销售退货价格清单事件 */
    private chooseSalesReturnPriceList(): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<mm.IMaterialPriceList>({
            boCode: mm.BO_CODE_MATERIALPRICELIST,
            chooseType: ibas.emChooseType.SINGLE,
            criteria: mm.conditions.materialpricelist.create(),
            onCompleted(selecteds: ibas.List<mm.IMaterialPriceList>): void {
                let selected: mm.IMaterialPriceList = selecteds.firstOrDefault();
                that.editData.priceList = selected.objectKey;
            }
        });
    }
    /** 选择销售退货物料事件 */
    private chooseSalesReturnItemMaterial(caller: bo.SalesReturnItem): void {
        let that: this = this;
        let condition: ibas.ICondition;
        let conditions: ibas.List<ibas.ICondition> = mm.conditions.product.create();
        // 添加价格清单条件
        if (this.editData.priceList > 0) {
            condition = new ibas.Condition();
            condition.alias = mm.conditions.product.CONDITION_ALIAS_PRICELIST;
            condition.value = this.editData.priceList.toString();
            condition.operation = ibas.emConditionOperation.EQUAL;
            condition.relationship = ibas.emConditionRelationship.AND;
            conditions.add(condition);
        }
        // 添加仓库条件
        if (!ibas.objects.isNull(caller) && !ibas.strings.isEmpty(caller.warehouse)) {
            condition = new ibas.Condition();
            condition.alias = mm.conditions.product.CONDITION_ALIAS_WAREHOUSE;
            condition.value = caller.warehouse;
            condition.operation = ibas.emConditionOperation.EQUAL;
            condition.relationship = ibas.emConditionRelationship.AND;
            conditions.add(condition);
        }
        // 销售物料
        condition = new ibas.Condition();
        condition.alias = mm.conditions.product.CONDITION_ALIAS_SALES_ITEM;
        condition.value = ibas.emYesNo.YES.toString();
        condition.operation = ibas.emConditionOperation.EQUAL;
        condition.relationship = ibas.emConditionRelationship.AND;
        conditions.add(condition);
        // 调用选择服务
        ibas.servicesManager.runChooseService<mm.IProduct>({
            boCode: mm.BO_CODE_PRODUCT,
            criteria: conditions,
            onCompleted(selecteds: ibas.List<mm.IProduct>): void {
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
                    item.itemCode = selected.code;
                    item.itemDescription = selected.name;
                    item.serialManagement = selected.serialManagement;
                    item.batchManagement = selected.batchManagement;
                    item.warehouse = selected.warehouse;
                    item.quantity = 1;
                    item.uom = selected.inventoryUOM;
                    item.price = selected.price;
                    item.currency = selected.currency;
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
        ibas.servicesManager.runChooseService<mm.IWarehouse>({
            boCode: mm.BO_CODE_WAREHOUSE,
            chooseType: ibas.emChooseType.SINGLE,
            criteria: mm.conditions.warehouse.create(),
            onCompleted(selecteds: ibas.List<mm.IWarehouse>): void {
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
    /** 选择物料批次信息 */
    createSalesReturnLineMaterialBatch(): void {
        let contracts: ibas.ArrayList<mm.IMaterialBatchContract> = new ibas.ArrayList<mm.IMaterialBatchContract>();
        for (let item of this.editData.salesReturnItems) {
            contracts.add({
                batchManagement: item.batchManagement,
                itemCode: item.itemCode,
                itemDescription: item.itemDescription,
                warehouse: item.warehouse,
                quantity: item.quantity,
                uom: item.uom,
                materialBatches: item.materialBatches,
            });
        }
        ibas.servicesManager.runApplicationService<mm.IMaterialBatchContract[]>({
            proxy: new mm.MaterialBatchReceiptServiceProxy(contracts)
        });
    }
    /** 选择物料序列信息 */
    createSalesReturnLineMaterialSerial(): void {
        let contracts: ibas.ArrayList<mm.IMaterialSerialContract> = new ibas.ArrayList<mm.IMaterialSerialContract>();
        for (let item of this.editData.salesReturnItems) {
            contracts.add({
                serialManagement: item.serialManagement,
                itemCode: item.itemCode,
                itemDescription: item.itemDescription,
                warehouse: item.warehouse,
                quantity: item.quantity,
                uom: item.uom,
                materialSerials: item.materialSerials
            });
        }
        ibas.servicesManager.runApplicationService<mm.IMaterialSerialContract[]>({
            proxy: new mm.MaterialSerialReceiptServiceProxy(contracts)
        });
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
    /** 选择销售退货价格清单事件 */
    chooseSalesReturnPriceListEvent: Function;
    /** 选择销售退货物料事件 */
    chooseSalesReturnItemMaterialEvent: Function;
    /** 选择销售退货仓库事件 */
    chooseSalesReturnItemWarehouseEvent: Function;
    /** 选择销售退货单行物料批次事件 */
    chooseSalesReturnItemMaterialBatchEvent: Function;
    /** 选择销售退货行物料序列事件 */
    chooseSalesReturnItemMaterialSerialEvent: Function;
}
