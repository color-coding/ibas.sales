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
export const CONSOLE_ID: string = "bc24810f-da83-4e99-9252-d22bc28b614c";
/** 模块-名称 */
export const CONSOLE_NAME: string = "Sales";
/** 模块-版本 */
export const CONSOLE_VERSION: string = "0.1.0";
/** 业务仓库名称 */
export const BO_REPOSITORY_SALES: string = strings.format(MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
/** 业务对象编码-产品套装 */
export const BO_CODE_PRODUCTSUIT: string = "${Company}_SL_PDSUIT";
/** 业务对象编码-销售交货 */
export const BO_CODE_SALESDELIVERY: string = "${Company}_SL_SALESDELIVERY";
/** 业务对象编码-销售订单 */
export const BO_CODE_SALESORDER: string = "${Company}_SL_SALESORDER";
/** 业务对象编码-销售退货 */
export const BO_CODE_SALESRETURN: string = "${Company}_SL_SALESRETURN";

/** 产品树类型 */
export enum emProductTreeType {
}