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

/** 编辑应用-销售订单 */
export class SalesOrderEditApp extends ibas.BOEditApplication<ISalesOrderEditView, bo.SalesOrder> {

    /** 应用标识 */
    static APPLICATION_ID: string = "87362150-9238-42de-b227-6e9086c660d6";
    /** 应用名称 */
    static APPLICATION_NAME: string = "sales_app_salesorder_edit";
    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = bo.SalesOrder.BUSINESS_OBJECT_CODE;
    /** 构造函数 */
    constructor() {
        super();
        this.id = SalesOrderEditApp.APPLICATION_ID;
        this.name = SalesOrderEditApp.APPLICATION_NAME;
        this.boCode = SalesOrderEditApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
        this.view.deleteDataEvent = this.deleteData;
        this.view.createDataEvent = this.createData;
        this.view.addSalesOrderItemEvent = this.addSalesOrderItem;
        this.view.removeSalesOrderItemEvent = this.removeSalesOrderItem;
        this.view.chooseSalesOrderItemMaterialEvent = this.chooseSalesOrderItemMaterial;
        this.view.chooseSalesOrderCustomerEvent = this.chooseSalesOrderCustomer;
        this.view.chooseSalesOrderPriceListEvent = this.chooseSalesOrderPriceList;
        this.view.chooseSalesOrderItemWarehouseEvent = this.chooseSalesOrderItemWarehouse;
        this.view.chooseSalesOrderItemMaterialBatchEvent = this.chooseSalesOrderItemMaterialBatch;
        this.view.chooseSalesOrderItemMaterialSerialEvent = this.chooseSalesOrderItemMaterialSerial;
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
        if (ibas.objects.isNull(this.editData)) {
            // 创建编辑对象实例
            this.editData = new bo.SalesOrder();
            this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
        }
        this.view.showSalesOrder(this.editData);
        this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
    }
    /** 运行,覆盖原方法 */
    run(): void;
    run(data: bo.SalesOrder): void;
    run(): void {
        let that: this = this;
        if (ibas.objects.instanceOf(arguments[0], bo.SalesOrder)) {
            let data: bo.SalesOrder = arguments[0];
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
                boRepository.fetchSalesOrder({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.SalesOrder>): void {
                        let data: bo.SalesOrder;
                        if (opRslt.resultCode === 0) {
                            data = opRslt.resultObjects.firstOrDefault();
                        }
                        if (ibas.objects.instanceOf(data, bo.SalesOrder)) {
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
    protected editData: bo.SalesOrder;
    protected lineEditData: bo.SalesOrderItem;
    /** 保存数据 */
    protected saveData(): void {
        let that: this = this;
        let boRepository: BORepositorySales = new BORepositorySales();
        boRepository.saveSalesOrder({
            beSaved: this.editData,
            onCompleted(opRslt: ibas.IOperationResult<bo.SalesOrder>): void {
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
                that.editData = new bo.SalesOrder();
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
    /** 选择销售订单客户事件 */
    private chooseSalesOrderCustomer(): void {
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
    /** 选择销售订单价格清单事件 */
    private chooseSalesOrderPriceList(): void {
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
    /** 选择销售订单物料事件 */
    private chooseSalesOrderItemMaterial(caller: bo.SalesOrderItem): void {
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
                let index: number = that.editData.salesOrderItems.indexOf(caller);
                let item: bo.SalesOrderItem = that.editData.salesOrderItems[index];
                // 选择返回数量多余触发数量时,自动创建新的项目
                let created: boolean = false;
                for (let selected of selecteds) {
                    if (ibas.objects.isNull(item)) {
                        item = that.editData.salesOrderItems.create();
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
                    that.view.showSalesOrderItems(that.editData.salesOrderItems.filterDeleted());
                }
            }
        });
    }
    /** 添加销售订单-行事件 */
    addSalesOrderItem(): void {
        this.editData.salesOrderItems.create();
        // 仅显示没有标记删除的
        this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
    }
    /** 删除销售订单-行事件 */
    removeSalesOrderItem(items: bo.SalesOrderItem[]): void {
        // 非数组，转为数组
        if (!(items instanceof Array)) {
            items = [items];
        }
        if (items.length === 0) {
            return;
        }
        // 移除项目
        for (let item of items) {
            if (this.editData.salesOrderItems.indexOf(item) >= 0) {
                if (item.isNew) {
                    // 新建的移除集合
                    this.editData.salesOrderItems.remove(item);
                } else {
                    // 非新建标记删除
                    item.delete();
                }
            }
        }
        // 仅显示没有标记删除的
        this.view.showSalesOrderItems(this.editData.salesOrderItems.filterDeleted());
    }
    /** 选择销售交货行仓库事件 */
    private chooseSalesOrderItemWarehouse(caller: bo.SalesOrderItem): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<mm.IWarehouse>({
            boCode: mm.BO_CODE_WAREHOUSE,
            chooseType: ibas.emChooseType.SINGLE,
            criteria: mm.conditions.warehouse.create(),
            onCompleted(selecteds: ibas.List<mm.IWarehouse>): void {
                let index: number = that.editData.salesOrderItems.indexOf(caller);
                let item: bo.SalesOrderItem = that.editData.salesOrderItems[index];
                // 选择返回数量多余触发数量时,自动创建新的项目
                let created: boolean = false;
                for (let selected of selecteds) {
                    if (ibas.objects.isNull(item)) {
                        item = that.editData.salesOrderItems.create();
                        created = true;
                    }
                    item.warehouse = selected.code;
                    item = null;
                }
                if (created) {
                    // 创建了新的行项目
                    that.view.showSalesOrderItems(that.editData.salesOrderItems.filterDeleted());
                }
            }
        });
    }
    /** 选择销售交货行批次事件 */
    chooseSalesOrderItemMaterialBatch(): void {
        let contracts: ibas.ArrayList<mm.IMaterialBatchContract> = new ibas.ArrayList<mm.IMaterialBatchContract>();
        for (let item of this.editData.salesOrderItems) {
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
            proxy: new mm.MaterialBatchIssueServiceProxy(contracts)
        });
    }
    /** 选择销售交货序列事件 */
    chooseSalesOrderItemMaterialSerial(): void {
        let contracts: ibas.ArrayList<mm.IMaterialSerialContract> = new ibas.ArrayList<mm.IMaterialSerialContract>();
        for (let item of this.editData.salesOrderItems) {
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
            proxy: new mm.MaterialSerialIssueServiceProxy(contracts)
        });
    }

}
/** 视图-销售订单 */
export interface ISalesOrderEditView extends ibas.IBOEditView {
    /** 显示数据 */
    showSalesOrder(data: bo.SalesOrder): void;
    /** 删除数据事件 */
    deleteDataEvent: Function;
    /** 新建数据事件，参数1：是否克隆 */
    createDataEvent: Function;
    /** 添加销售订单-行事件 */
    addSalesOrderItemEvent: Function;
    /** 删除销售订单-行事件 */
    removeSalesOrderItemEvent: Function;
    /** 显示数据 */
    showSalesOrderItems(datas: bo.SalesOrderItem[]): void;
    /** 选择销售订单客户事件 */
    chooseSalesOrderCustomerEvent: Function;
    /** 选择销售订单价格清单事件 */
    chooseSalesOrderPriceListEvent: Function;
    /** 选择销售订单行物料事件 */
    chooseSalesOrderItemMaterialEvent: Function;
    /** 选择销售订单仓库事件 */
    chooseSalesOrderItemWarehouseEvent: Function;
    /** 新建销售订单行物料序列事件 */
    chooseSalesOrderItemMaterialSerialEvent: Function;
    /** 新建销售订单行物料批次事件 */
    chooseSalesOrderItemMaterialBatchEvent: Function;
}
