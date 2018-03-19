/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace businesspartner {
    export namespace bo {

        /** 业务伙伴地址 */
        export interface IAddress extends ibas.IBOSimple {

            /** 业务伙伴 */
            businessPartner: string;

            /** 归属类型 */
            ownerType: emBusinessPartnerType;

            /** 有效的 */
            activated: ibas.emYesNo;

            /** 名称 */
            name: string;

            /** 街道 */
            street: string;

            /** 县/区 */
            district: string;

            /** 市 */
            city: string;

            /** 省 */
            province: string;

            /** 国 */
            country: string;

            /** 邮编 */
            zipCode: string;

            /** 联系电话 */
            mobilePhone: string;

            /** 电话 1 */
            telephone1: string;

            /** 电话 2 */
            telephone2: string;

            /** 备注 1 */
            remark1: string;

            /** 备注 2 */
            remark2: string;

            /** 联系人 */
            contacts: string;

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
    }
}


