/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

// 共享的数据
import {
    strings,
    MODULE_REPOSITORY_NAME_TEMPLATE,
} from "ibas/index";

/** 模块-标识 */
export const CONSOLE_ID: string = "2bd803fd-975c-4f7c-aa41-1ca2991cc126";
/** 模块-名称 */
export const CONSOLE_NAME: string = "BusinessPartner";
/** 模块-版本 */
export const CONSOLE_VERSION: string = "0.1.0";
/** 业务仓库名称 */
export const BO_REPOSITORY_BUSINESSPARTNER: string = strings.format(MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
/** 业务对象编码-业务伙伴余额记录 */
export const BO_CODE_BUSINESSPARTNERBALANCEJOURNAL: string = "${Company}_BP_BALANCEJOURNAL";
/** 业务对象编码-业务伙伴组 */
export const BO_CODE_BUSINESSPARTNERGROUP: string = "${Company}_BP_BPGROUP";
/** 业务对象编码-业务伙伴联系人 */
export const BO_CODE_CONTACTPERSON: string = "${Company}_BP_CONTACTPERSON";
/** 业务对象编码-业务伙伴-客户 */
export const BO_CODE_CUSTOMER: string = "${Company}_BP_CUSTOMER";
/** 业务对象编码-业务伙伴-供应商 */
export const BO_CODE_SUPPLIER: string = "${Company}_BP_SUPPLIER";


/** 业务伙伴性质 */
export enum emBusinessPartnerNature {
    /** 公司 */
    COMPANY,
    /** 私人 */
    PRIVATE,
}
/** 业务伙伴类型 */
export enum emBusinessPartnerType {

    /** 客户 */
    CUSTOMER,
    /** 供应商 */
    SUPPLIER,
}
/** 性别 */
export enum emGender {

    /** 男 */
    MALE,
    /** 女 */
    FEMALE,
}