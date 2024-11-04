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

    export namespace config {
        /** 配置项目-价格清单改变是否强制刷新价格 */
        export const CONFIG_ITEM_FORCE_UPDATE_PRICE_FOR_PRICE_LIST_CHANGED: string = "forcedUpdateForPriceListChanged";
        /** 配置项目-允许改变基于单据币种 */
        export const CONFIG_ITEM_ALLOW_CHANGE_BASED_DOCUMENT_CURRENCY: string = "allowChangeBasedDocumentCurrency";
        /** 配置项目-单据行价格类型 */
        export const CONFIG_ITEM_DOCUMENT_LINE_PRICE_TYPE: string = "documentLinePriceType";
        /** 配置项目-仅使用价格清单里的单位 */
        export const CONFIG_ITEM_ONLY_PRICE_LIST_ITEM_UNITS: string = "onlyPriceListItemUnits";
        /** 配置项目-价格计算锚定方式 */
        export const CONFIG_ITEM_PRICE_CALCULATION_ANCHORING_METHOD: string = "priceCalculationAnchoringMethod";
        /** 配置项目-单据行显示库存 */
        export const CONFIG_ITEM_DOCUMENT_LINE_DISPLAY_INVENTORY: string = "documentLineDisplayInventory";
        /** 配置项目-折扣呈现方式 */
        export const CONFIG_ITEM_DISCOUNT_PRESENTATION_METHOD: string = "discountPresentationMethod";
        /**
         * 获取此模块配置
         * @param key 配置项
         * @param defalut 默认值
         */
        export function get<T>(key: string, defalut?: T): T {
            return ibas.config.get(ibas.strings.format("{0}|{1}", CONSOLE_ID, key), defalut);
        }
        let inventoryUnitLinePrice: boolean = undefined;
        export function isInventoryUnitLinePrice(): boolean {
            if (ibas.objects.isNull(inventoryUnitLinePrice)) {
                if (ibas.strings.equalsIgnoreCase("InventoryUnit", get(CONFIG_ITEM_DOCUMENT_LINE_PRICE_TYPE))) {
                    inventoryUnitLinePrice = true;
                } else {
                    inventoryUnitLinePrice = false;
                }
            }
            return inventoryUnitLinePrice;
        }
        let priceAnchoringAfterTax: boolean = undefined;
        export function isPriceAnchoringAfterTax(): boolean {
            if (ibas.objects.isNull(priceAnchoringAfterTax)) {
                if (ibas.strings.equalsIgnoreCase("PreTax", get(CONFIG_ITEM_PRICE_CALCULATION_ANCHORING_METHOD))) {
                    priceAnchoringAfterTax = false;
                } else {
                    priceAnchoringAfterTax = true;
                }
            }
            return priceAnchoringAfterTax;
        }
        let inverseDiscount: boolean = undefined;
        export function isInverseDiscount(): boolean {
            if (ibas.objects.isNull(inverseDiscount)) {
                if (ibas.strings.equalsIgnoreCase("Inverse", get(CONFIG_ITEM_DISCOUNT_PRESENTATION_METHOD))) {
                    inverseDiscount = true;
                } else {
                    inverseDiscount = false;
                }
            }
            return inverseDiscount;
        }
    }
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
        /** 业务对象编码-销售贷项 */
        export const BO_CODE_SALESCREDITNOTE: string = "${Company}_SL_SALESCREDIT";
        /** 业务对象编码-销售发票 */
        export const BO_CODE_SALESINVOICE: string = "${Company}_SL_SALESINVOICE";
        /** 业务对象编码-一揽子协议 */
        export const BO_CODE_BLANKETAGREEMENT: string = "${Company}_SL_BLANKETAGT";
        /** 业务对象编码-预收款申请 */
        export const BO_CODE_DOWNPAYMNETREQUEST: string = "${Company}_SL_PAYREQUEST";
        /** 业务对象编码-销售预留发票 */
        export const BO_CODE_SALESRESERVEINVOICE: string = "${Company}_SL_SALESRSVINVOICE";
        /** 业务对象编码-销售退货请求 */
        export const BO_CODE_SALESRETURNREQUEST: string = "${Company}_SL_SALESRETNREQ";


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
        export enum emAgreementType {
            GENERAL,
            SPECIFIC
        }

        export enum emAgreementMethod {
            ITEM,
            MONETARY
        }
    }

    export namespace app {
    }
}