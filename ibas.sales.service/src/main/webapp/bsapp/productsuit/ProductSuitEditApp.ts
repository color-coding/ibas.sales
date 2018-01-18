/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "../../borep/bo/index";
import * as mm from "3rdparty/materials/index";
import { BORepositorySales } from "../../borep/BORepositories";

/** 编辑应用-产品套装 */
export class ProductSuitEditApp extends ibas.BOEditApplication<IProductSuitEditView, bo.ProductSuit> {

    /** 应用标识 */
    static APPLICATION_ID: string = "5b3a46ec-dbb5-4030-b021-28640d1a9e9e";
    /** 应用名称 */
    static APPLICATION_NAME: string = "sales_app_productsuit_edit";
    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = bo.ProductSuit.BUSINESS_OBJECT_CODE;
    /** 构造函数 */
    constructor() {
        super();
        this.id = ProductSuitEditApp.APPLICATION_ID;
        this.name = ProductSuitEditApp.APPLICATION_NAME;
        this.boCode = ProductSuitEditApp.BUSINESS_OBJECT_CODE;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        // 其他事件
        this.view.deleteDataEvent = this.deleteData;
        this.view.createDataEvent = this.createData;
        this.view.addProductSuitItemEvent = this.addProductSuitItem;
        this.view.removeProductSuitItemEvent = this.removeProductSuitItem;
        this.view.chooseProductSuitItemMaterialEvent = this.chooseProductSuitItemMaterial;
        this.view.chooseProductSuitMaterialEvent = this.chooseProductSuitMaterial;
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
        if (ibas.objects.isNull(this.editData)) {
            // 创建编辑对象实例
            this.editData = new bo.ProductSuit();
            this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
        }
        this.view.showProductSuit(this.editData);
        this.view.showProductSuitItems(this.editData.productSuitItems.filterDeleted());
    }
    /** 运行,覆盖原方法 */
    run(): void;
    run(data: bo.ProductSuit): void;
    run(): void {
        let that: this = this;
        if (ibas.objects.instanceOf(arguments[0], bo.ProductSuit)) {
            let data: bo.ProductSuit = arguments[0];
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
                boRepository.fetchProductSuit({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.ProductSuit>): void {
                        let data: bo.ProductSuit;
                        if (opRslt.resultCode === 0) {
                            data = opRslt.resultObjects.firstOrDefault();
                        }
                        if (ibas.objects.instanceOf(data, bo.ProductSuit)) {
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
    protected editData: bo.ProductSuit;
    /** 保存数据 */
    protected saveData(): void {
        let that: this = this;
        let boRepository: BORepositorySales = new BORepositorySales();
        boRepository.saveProductSuit({
            beSaved: this.editData,
            onCompleted(opRslt: ibas.IOperationResult<bo.ProductSuit>): void {
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
                that.editData = new bo.ProductSuit();
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
    /** 添加产品套装-项目事件 */
    addProductSuitItem(): void {
        this.editData.productSuitItems.create();
        // 仅显示没有标记删除的
        this.view.showProductSuitItems(this.editData.productSuitItems.filterDeleted());
    }
    /** 删除产品套装-项目事件 */
    removeProductSuitItem(items: bo.ProductSuitItem[]): void {
        // 非数组，转为数组
        if (!(items instanceof Array)) {
            items = [items];
        }
        if (items.length === 0) {
            return;
        }
        // 移除项目
        for (let item of items) {
            if (this.editData.productSuitItems.indexOf(item) >= 0) {
                if (item.isNew) {
                    // 新建的移除集合
                    this.editData.productSuitItems.remove(item);
                } else {
                    // 非新建标记删除
                    item.delete();
                }
            }
        }
        // 仅显示没有标记删除的
        this.view.showProductSuitItems(this.editData.productSuitItems.filterDeleted());
    }

    private chooseProductSuitItemMaterial(caller: bo.ProductSuitItem): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<mm.IMaterial>({
            boCode: mm.BO_CODE_MATERIAL,
            criteria: mm.conditions.material.create(),
            onCompleted(selecteds: ibas.List<mm.IMaterial>): void {
                let index: number = that.editData.productSuitItems.indexOf(caller);
                let item: bo.ProductSuitItem = that.editData.productSuitItems[index];
                // 选择返回数量多余触发数量时,自动创建新的项目
                let created: boolean = false;
                for (let selected of selecteds) {
                    if (ibas.objects.isNull(item)) {
                        item = that.editData.productSuitItems.create();
                        created = true;
                    }
                    item.itemCode = selected.code;
                    item.itemDescription = selected.name;
                    item.quantity = 1;
                    item.uom = selected.inventoryUOM;
                    item = null;
                }
                if (created) {
                    // 创建了新的行项目
                    that.view.showProductSuitItems(that.editData.productSuitItems.filterDeleted());
                }
            }
        });
    }
    private chooseProductSuitMaterial(caller: bo.ProductSuitItem): void {
        let that: this = this;
        ibas.servicesManager.runChooseService<mm.IMaterial>({
            boCode: mm.BO_CODE_MATERIAL,
            chooseType: ibas.emChooseType.SINGLE,
            criteria: mm.conditions.material.create(),
            onCompleted(selecteds: ibas.List<mm.IMaterial>): void {
                let selected: mm.IMaterial = selecteds.firstOrDefault();
                that.editData.product = selected.code;
                that.editData.description = selected.name;
                that.editData.unitQuantity = 1;
                that.editData.uom = selected.inventoryUOM;
            }
        });
    }

}
/** 视图-产品套装 */
export interface IProductSuitEditView extends ibas.IBOEditView {
    /** 显示数据 */
    showProductSuit(data: bo.ProductSuit): void;
    /** 删除数据事件 */
    deleteDataEvent: Function;
    /** 新建数据事件，参数1：是否克隆 */
    createDataEvent: Function;
    /** 添加产品套装-项目事件 */
    addProductSuitItemEvent: Function;
    /** 删除产品套装-项目事件 */
    removeProductSuitItemEvent: Function;
    /** 显示数据 */
    showProductSuitItems(datas: bo.ProductSuitItem[]): void;
    /** 选择物料主数据事件 */
    chooseProductSuitMaterialEvent: Function;
    /** 选择物料主数据事件 */
    chooseProductSuitItemMaterialEvent: Function;
}
