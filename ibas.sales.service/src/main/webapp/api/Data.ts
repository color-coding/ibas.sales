/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    /** 模块-标识 */
    export const CONSOLE_ID: string = "bc24810f-da83-4e99-9252-d22bc28b614c";
    /** 模块-名称 */
    export const CONSOLE_NAME: string = "Sales";
    /** 模块-版本 */
    export const CONSOLE_VERSION: string = "0.1.0";

    export namespace bo {
        /** 业务仓库名称 */
        export const BO_REPOSITORY_SALES: string = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
        /** 业务对象编码-产品套装 */
        export const BO_CODE_PRODUCTSUIT: string = "${Company}_SL_PDSUIT";
        /** 业务对象编码-销售交货 */
        export const BO_CODE_SALESDELIVERY: string = "${Company}_SL_SALESDELIVERY";
        /** 业务对象编码-销售订单 */
        export const BO_CODE_SALESORDER: string = "${Company}_SL_SALESORDER";
        /** 业务对象编码-销售退货 */
        export const BO_CODE_SALESRETURN: string = "${Company}_SL_SALESRETURN";
        /** 业务对象编码-销售报价 */
        export const BO_CODE_SALESQUOTE: string = "${Company}_SL_SALESQUOTE";
        /** 业务对象编码-送货地址 */
        export const BO_CODE_SHIPPINGADDRESS: string = "${Company}_SL_SHIPADDRESS";
        /** 业务对象编码-产品规格 */
        export const BO_CODE_PRODUCTSPECIFICATION: string = "${Company}_SL_PDSPEC";
        /** 业务对象编码-规格模板 */
        export const BO_CODE_SPECIFICATION: string = "${Company}_SL_SPEC";

        /** 产品树类型 */
        export enum emProductTreeType {
            /** 捆绑 */
            BUNDLED,
        }
        /** 运输状态 */
        export enum emShippingStatus {
            /**
             * 等待
             */
            WAITING,
            /**
             * 运输中
             */
            SHIPPING,
            /**
             * 已送达
             */
            SHIPPED,
        }
        export enum emSpecificationTarget {
            /**
             * 物料
             */
            MATERIAL,
            /**
             * 物料组
             */
            MATERIAL_GROUP,
        }
    }

    export namespace app {
        /** 规格服务契约 */
        export interface ISpecificationTreeContract extends ibas.IServiceContract {
            /** 目标（物料编号或产品规格） */
            target: string | bo.IProductSpecification;
            /** 备注 */
            remarks?: string;
        }
        /** 规格服务代理 */
        export class SpecificationTreeServiceProxy extends ibas.ServiceProxy<ISpecificationTreeContract> {

        }
    }
}