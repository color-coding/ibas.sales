/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    emYesNo,
    emDocumentStatus,
    emBOStatus,
    emApprovalStatus,
    IBusinessObject,
    IBusinessObjects,
    IBOMasterData,
    IBOMasterDataLine,
    IBODocument,
    IBODocumentLine,
    IBOSimple,
    IBOSimpleLine
} from "ibas/index";
import {
    emItemType
} from "3rdparty/materials/index";
import {
    emProductTreeType
} from "../Datas";

/** 产品套装 */
export interface IProductSuit extends IBOSimple {

    /** 产品编码 */
    product: string;

    /** 产品描述 */
    description: string;

    /** 版本 */
    version: string;

    /** 是否激活 */
    activated: emYesNo;

    /** 单位数量 */
    unitQuantity: number;

    /** 计量单位 */
    uom: string;

    /** 生效日期 */
    validDate: Date;

    /** 失效日期 */
    invalidDate: Date;

    /** 总计 */
    total: number;

    /** 币种 */
    currency: string;

    /** 备注 */
    remarks: string;

    /** 对象编号 */
    objectKey: number;

    /** 对象类型 */
    objectCode: string;

    /** 创建日期 */
    createDate: Date;

    /** 创建时间 */
    createTime: number;

    /** 修改日期 */
    updateDate: Date;

    /** 修改时间 */
    updateTime: number;

    /** 版本 */
    logInst: number;

    /** 服务系列 */
    series: number;

    /** 数据源 */
    dataSource: string;

    /** 创建用户 */
    createUserSign: number;

    /** 修改用户 */
    updateUserSign: number;

    /** 创建动作标识 */
    createActionId: string;

    /** 更新动作标识 */
    updateActionId: string;

    /** 审批状态 */
    approvalStatus: emApprovalStatus;

    /** 数据所有者 */
    dataOwner: number;

    /** 团队成员 */
    teamMembers: string;

    /** 数据所属组织 */
    organization: string;


    /** 产品套装-项目集合 */
    productSuitItems: IProductSuitItems;


}

/** 产品套装-项目 集合 */
export interface IProductSuitItems extends IBusinessObjects<IProductSuitItem, IProductSuit> {

    /** 创建并添加子项 */
    create(): IProductSuitItem;
}

/** 产品套装-项目 */
export interface IProductSuitItem extends IBOSimpleLine {

    /** 对象编号 */
    objectKey: number;

    /** 对象行号 */
    lineId: number;

    /** 对象类型 */
    objectCode: string;

    /** 实例号 */
    logInst: number;

    /** 数据源 */
    dataSource: string;

    /** 创建日期 */
    createDate: Date;

    /** 创建时间 */
    createTime: number;

    /** 更新日期 */
    updateDate: Date;

    /** 更新时间 */
    updateTime: number;

    /** 创建用户 */
    createUserSign: number;

    /** 更新用户 */
    updateUserSign: number;

    /** 创建动作标识 */
    createActionId: string;

    /** 更新动作标识 */
    updateActionId: string;

    /** 组件编码 */
    itemCode: string;

    /** 组件名称 */
    itemDescription: string;

    /** 数量 */
    quantity: number;

    /** 计量单位 */
    uom: string;

    /** 价格 */
    price: number;

    /** 币种 */
    currency: string;

    /** 总计 */
    lineTotal: number;


}


