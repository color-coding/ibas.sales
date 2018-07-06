/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace businesspartner {
    export namespace bo {
        /** 业务伙伴资产 */
        export interface IBusinessPartnerAsset extends ibas.IBOMasterData, ibas.IBOUserFields {
            /** 编号 */
            code: string;
            /** 名称 */
            name: string;
            /** 对象编号 */
            docEntry: number;
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
            approvalStatus: ibas.emApprovalStatus;
            /** 数据所有者 */
            dataOwner: number;
            /** 数据所属组织 */
            organization: string;
            /** 已引用 */
            referenced: ibas.emYesNo;
            /** 已删除 */
            deleted: ibas.emYesNo;
            /** 业务伙伴类型 */
            businessPartnerType: emBusinessPartnerType;
            /** 业务伙伴编码 */
            businessPartnerCode: string;
            /** 资产项目 */
            assetCode: string;
            /** 激活 */
            activated: ibas.emYesNo;
            /** 获得日期 */
            acquiredDate: Date;
            /** 生效日期 */
            validDate: Date;
            /** 失效日期 */
            invalidDate: Date;
            /** 剩余价值 */
            amount: number;
            /** 剩余次数 */
            times: number;
            /** 基于类型 */
            baseDocumentType: string;
            /** 基于标识 */
            baseDocumentEntry: number;
            /** 基于行号 */
            baseDocumentLineId: number;
            /** 交易金额 */
            tradingAmount: number;
            /** 交易货币 */
            tradingCurrency: string;
            /** 备注 1 */
            remark1: string;
            /** 备注 2 */
            remark2: string;

        }

        /** 客户资产 */
        export class ICustomerAsset {
            /** 资产编码 */
            code: string;
            /** 资产名称 */
            name: string;
            /** 图片 */
            picture: string;
            /** 生效日期 */
            validDate: Date;
            /** 失效日期 */
            invalidDate: Date;
            /** 可用值 */
            amount: number;
            /** 值单位 */
            unit: string;
            /** 可用次数 */
            times: number;
            /** 折扣 */
            discount: number;
            /** 客户 */
            customer: string;
        }
    }
}
