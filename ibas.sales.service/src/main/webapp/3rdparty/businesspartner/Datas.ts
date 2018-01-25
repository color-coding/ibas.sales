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
    dates,
    MODULE_REPOSITORY_NAME_TEMPLATE,
    Condition,
    ArrayList,
    List,
    IServiceContract,
    ServiceProxy,
    ICondition,
    emConditionOperation,
    emConditionRelationship,
    emYesNo,
} from "ibas/index";

/** 模块-标识 */
export const CONSOLE_ID: string = "2bd803fd-975c-4f7c-aa41-1ca2991cc126";
/** 模块-名称 */
export const CONSOLE_NAME: string = "BusinessPartner";
/** 模块-版本 */
export const CONSOLE_VERSION: string = "0.1.0";
/** 业务仓库名称 */
export const BO_REPOSITORY_BUSINESSPARTNER: string = strings.format(MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
/** 业务对象编码-业务伙伴地址 */
export const BO_CODE_ADDRESS: string = "${Company}_BP_ADDRESS";
/** 业务对象编码-业务伙伴组 */
export const BO_CODE_BUSINESSPARTNERGROUP: string = "${Company}_BP_BPGROUP";
/** 业务对象编码-业务伙伴联系人 */
export const BO_CODE_CONTACTPERSON: string = "${Company}_BP_CONTACTPERSON";
/** 业务对象编码-客户 */
export const BO_CODE_CUSTOMER: string = "${Company}_BP_CUSTOMER";
/** 业务对象编码-供应商 */
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
/** 单据收款服务契约 */
export interface IReceiptContract extends IServiceContract {
    /** 业务伙伴类型 */
    businessPartnerType: emBusinessPartnerType;
    /** 业务伙伴代码 */
    businessPartnerCode: string;
    /** 总计 */
    total: number;
    /** 货币 */
    currency: string;
    /** 单据类型 */
    documentType?: string;
    /** 单据标识 */
    documentEntry?: number;
    /** 单据行号 */
    documentLineId?: number;
}
/** 单据收款服务服务代理 */
export class ReceiptServiceProxy extends ServiceProxy<IReceiptContract[]> {

}
/** 单据付款服务契约 */
export interface IPaymentContract extends IServiceContract {
    /** 业务伙伴类型 */
    businessPartnerType: emBusinessPartnerType;
    /** 业务伙伴代码 */
    businessPartnerCode: string;
    /** 总计 */
    total: number;
    /** 货币 */
    currency: string;
    /** 单据类型 */
    documentType?: string;
    /** 单据标识 */
    documentEntry?: number;
    /** 单据行号 */
    documentLineId?: number;
}
/** 单据付款服务服务代理 */
export class PaymentServiceProxy extends ServiceProxy<IPaymentContract[]> {

}
/** 查询条件 */
export namespace conditions {
    export namespace customer {
        /** 默认查询条件 */
        export function create(): List<ICondition> {
            let today: string = dates.toString(dates.today(), "yyyy-MM-dd");
            let condition: ICondition;
            let conditions: List<ICondition> = new ArrayList<ICondition>();
            // 激活的
            condition = new Condition();
            condition.bracketOpen = 1;
            condition.alias = "activated";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = emYesNo.YES.toString();
            conditions.add(condition);
            // 有效日期
            condition = new Condition();
            condition.bracketOpen = 1;
            condition.alias = "validDate";
            condition.operation = emConditionOperation.IS_NULL;
            conditions.add(condition);
            condition = new Condition();
            condition.relationship = emConditionRelationship.OR;
            condition.bracketOpen = 1;
            condition.alias = "validDate";
            condition.operation = emConditionOperation.NOT_NULL;
            conditions.add(condition);
            condition = new Condition();
            condition.bracketClose = 2;
            condition.alias = "validDate";
            condition.operation = emConditionOperation.LESS_EQUAL;
            condition.value = today;
            conditions.add(condition);
            // 失效日期
            condition = new Condition();
            condition.bracketOpen = 1;
            condition.alias = "invalidDate";
            condition.operation = emConditionOperation.IS_NULL;
            conditions.add(condition);
            condition = new Condition();
            condition.relationship = emConditionRelationship.OR;
            condition.bracketOpen = 1;
            condition.alias = "invalidDate";
            condition.operation = emConditionOperation.NOT_NULL;
            conditions.add(condition);
            condition = new Condition();
            condition.bracketClose = 2;
            condition.alias = "invalidDate";
            condition.operation = emConditionOperation.GRATER_EQUAL;
            condition.value = today;
            conditions.add(condition);
            // 没删除
            condition = new Condition();
            condition.bracketClose = 1;
            condition.alias = "deleted";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = emYesNo.NO.toString();
            conditions.add(condition);
            return conditions;
        }
    }
    export namespace supplier {
        /** 默认查询条件 */
        export function create(): List<ICondition> {
            let today: string = dates.toString(dates.today(), "yyyy-MM-dd");
            let condition: ICondition;
            let conditions: List<ICondition> = new ArrayList<ICondition>();
            // 激活的
            condition = new Condition();
            condition.bracketOpen = 1;
            condition.alias = "activated";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = emYesNo.YES.toString();
            conditions.add(condition);
            // 有效日期
            condition = new Condition();
            condition.bracketOpen = 1;
            condition.alias = "validDate";
            condition.operation = emConditionOperation.IS_NULL;
            conditions.add(condition);
            condition = new Condition();
            condition.relationship = emConditionRelationship.OR;
            condition.bracketOpen = 1;
            condition.alias = "validDate";
            condition.operation = emConditionOperation.NOT_NULL;
            conditions.add(condition);
            condition = new Condition();
            condition.bracketClose = 2;
            condition.alias = "validDate";
            condition.operation = emConditionOperation.LESS_EQUAL;
            condition.value = today;
            conditions.add(condition);
            // 失效日期
            condition = new Condition();
            condition.bracketOpen = 1;
            condition.alias = "invalidDate";
            condition.operation = emConditionOperation.IS_NULL;
            conditions.add(condition);
            condition = new Condition();
            condition.relationship = emConditionRelationship.OR;
            condition.bracketOpen = 1;
            condition.alias = "invalidDate";
            condition.operation = emConditionOperation.NOT_NULL;
            conditions.add(condition);
            condition = new Condition();
            condition.bracketClose = 2;
            condition.alias = "invalidDate";
            condition.operation = emConditionOperation.GRATER_EQUAL;
            condition.value = today;
            conditions.add(condition);
            // 没删除
            condition = new Condition();
            condition.bracketClose = 1;
            condition.alias = "deleted";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = emYesNo.NO.toString();
            conditions.add(condition);
            return conditions;
        }
    }
    export namespace contactperson {
        export function create(type: emBusinessPartnerType, bpCode: string): List<ICondition> {
            let condition: ICondition;
            let conditions: List<ICondition> = new ArrayList<ICondition>();
            // 类型
            condition = new Condition();
            condition.bracketOpen = 1;
            condition.alias = "ownerType";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = type.toString();
            conditions.add(condition);
            // 激活的
            condition = new Condition();
            condition.alias = "activated";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = emYesNo.YES.toString();
            conditions.add(condition);
            // 业务伙伴编码
            condition = new Condition();
            condition.bracketClose = 1;
            condition.alias = "businessPartner";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = bpCode;
            conditions.add(condition);
            return conditions;
        }
    }
    export namespace address {
        export function create(type: emBusinessPartnerType, bpCode: string): List<ICondition> {
            let condition: ICondition;
            let conditions: List<ICondition> = new ArrayList<ICondition>();
            // 类型
            condition = new Condition();
            condition.bracketOpen = 1;
            condition.alias = "ownerType";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = type.toString();
            conditions.add(condition);
            // 激活的
            condition = new Condition();
            condition.alias = "activated";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = emYesNo.YES.toString();
            conditions.add(condition);
            // 业务伙伴编码
            condition = new Condition();
            condition.bracketClose = 1;
            condition.alias = "businessPartner";
            condition.operation = emConditionOperation.EQUAL;
            condition.value = bpCode;
            conditions.add(condition);
            return conditions;
        }
    }
}