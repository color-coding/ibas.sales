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
    emDirection,
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
    emBusinessPartnerType,
} from "../Datas";

/** 业务伙伴余额记录 */
export interface IBusinessPartnerBalanceJournal extends IBOSimple {

    /** 业务伙伴类型 */
    businessPartnerType: emBusinessPartnerType;

    /** 业务伙伴编码 */
    businessPartner: string;

    /** 方向 */
    direction: emDirection;

    /** 方式 */
    mode: string;

    /** 金额 */
    amount: number;

    /** 币种 */
    currency: string;

    /** 汇率 */
    rate: number;

    /** 银行编码 */
    bankCode: string;

    /** 卡号 */
    cardNumber: string;

    /** 基于类型 */
    baseDocumentType: string;

    /** 基于标识 */
    baseDocumentEntry: number;

    /** 基于行号 */
    baseDocumentLineId: number;

    /** 原始类型 */
    originalDocumentType: string;

    /** 原始标识 */
    originalDocumentEntry: number;

    /** 原始行号 */
    originalDocumentLineId: number;

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

    /** 实例号（版本） */
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


}


