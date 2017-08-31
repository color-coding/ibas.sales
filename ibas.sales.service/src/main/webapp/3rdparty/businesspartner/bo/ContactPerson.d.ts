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
    emBusinessPartnerType,
    emGender,
} from "../Datas";

/** 业务伙伴联系人 */
export interface IContactPerson extends IBOSimple {

    /** 业务伙伴 */
    businessPartner: string;

    /** 归属类型 */
    ownerType: emBusinessPartnerType;

    /** 有效的 */
    activated: emYesNo;

    /** 名称 */
    name: string;

    /** 性别 */
    gender: emGender;

    /** 职位 */
    position: string;

    /** 地址 */
    address: string;

    /** 电话 1 */
    telephone1: string;

    /** 电话 2 */
    telephone2: string;

    /** 移动电话 */
    mobilePhone: string;

    /** 传真 */
    fax: string;

    /** 电子邮件 */
    mail: string;

    /** 备注 1 */
    remark1: string;

    /** 备注 2 */
    remark2: string;

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


