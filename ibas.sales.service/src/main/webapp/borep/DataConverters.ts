/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "./bo/index";
import {
    emProductTreeType
} from "../api/index";
import { emYesNo, boFactory } from "ibas/index";
import { emItemType, BO_CODE_MATERIALBATCHJOURNAL, BO_CODE_MATERIALSERIALJOURNAL } from "../3rdparty/materials/Datas";

/** 数据转换者 */
export class DataConverter4sl extends ibas.DataConverter4j {

    /** 创建业务对象转换者 */
    protected createConverter(): ibas.BOConverter {
        return new BOConverter4sl;
    }
}

/** 业务对象转换者 */
class BOConverter4sl extends ibas.BOConverter {

    /**
     * 自定义解析
     * @param data 远程数据
     * @returns 本地数据
     */
    protected customParsing(data: any): ibas.IBusinessObject {
        return data;
    }

    /**
     * 转换数据
     * @param boName 对象名称
     * @param property 属性名称
     * @param value 值
     * @returns 转换的值
     */
    protected convertData(boName: string, property: string, value: any): any {
        if (boName === boFactory.classOf(BO_CODE_MATERIALBATCHJOURNAL).name) {
            if (property === "Direction") {
                return ibas.enums.toString(ibas.emDirection, value);
            }
        } else if (boName === boFactory.classOf(BO_CODE_MATERIALSERIALJOURNAL).name) {
            if (property === "Direction") {
                return ibas.enums.toString(ibas.emDirection, value);
            } else if (property === "InStock") {
                return ibas.enums.toString(ibas.emYesNo, value);
            }
        } else if (boName === bo.SalesOrder.name) {
            if (property === bo.SalesOrder.PROPERTY_ROUNDING_NAME) {
                return ibas.enums.toString(emYesNo, value);
            }
        } else if (boName === bo.SalesOrderItem.name) {
            if (property === bo.SalesOrderItem.PROPERTY_ITEMTYPE_NAME) {
                return ibas.enums.toString(emItemType, value);
            }
            if (property === bo.SalesOrderItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                return ibas.enums.toString(emYesNo, value);
            }
            if (property === bo.SalesOrderItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                return ibas.enums.toString(emYesNo, value);
            }
            if (property === bo.SalesOrderItem.PROPERTY_TREETYPE_NAME) {
                return ibas.enums.toString(emProductTreeType, value);
            }
        } else if (boName === bo.SalesDelivery.name) {
            if (property === bo.SalesDelivery.PROPERTY_ROUNDING_NAME) {
                return ibas.enums.toString(emYesNo, value);
            }
        } else if (boName === bo.SalesDeliveryItem.name) {
            if (property === bo.SalesDeliveryItem.PROPERTY_ITEMTYPE_NAME) {
                return ibas.enums.toString(emItemType, value);
            }
            if (property === bo.SalesDeliveryItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                return ibas.enums.toString(emYesNo, value);
            }
            if (property === bo.SalesDeliveryItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                return ibas.enums.toString(emYesNo, value);
            }
            if (property === bo.SalesDeliveryItem.PROPERTY_TREETYPE_NAME) {
                return ibas.enums.toString(emProductTreeType, value);
            }
        } else if (boName === bo.SalesReturn.name) {
            if (property === bo.SalesReturn.PROPERTY_ROUNDING_NAME) {
                return ibas.enums.toString(emYesNo, value);
            }
        } else if (boName === bo.SalesReturnItem.name) {
            if (property === bo.SalesReturnItem.PROPERTY_ITEMTYPE_NAME) {
                return ibas.enums.toString(emItemType, value);
            }
            if (property === bo.SalesReturnItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                return ibas.enums.toString(emYesNo, value);
            }
            if (property === bo.SalesReturnItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                return ibas.enums.toString(emYesNo, value);
            }
            if (property === bo.SalesReturnItem.PROPERTY_TREETYPE_NAME) {
                return ibas.enums.toString(emProductTreeType, value);
            }
        }
        return super.convertData(boName, property, value);
    }

    /**
     * 解析数据
     * @param boName 对象名称
     * @param property 属性名称
     * @param value 值
     * @returns 解析的值
     */
    protected parsingData(boName: string, property: string, value: any): any {
        if (boName === boFactory.classOf(BO_CODE_MATERIALBATCHJOURNAL).name) {
            if (property === "Direction") {
                return ibas.enums.valueOf(ibas.emDirection, value);
            }
        } else if (boName === boFactory.classOf(BO_CODE_MATERIALSERIALJOURNAL).name) {
            if (property === "Direction") {
                return ibas.enums.valueOf(ibas.emDirection, value);
            } else if (property === "InStock") {
                return ibas.enums.valueOf(ibas.emYesNo, value);
            }
        } else if (boName === bo.SalesOrder.name) {
            if (property === bo.SalesOrder.PROPERTY_ROUNDING_NAME) {
                return ibas.enums.valueOf(emYesNo, value);
            }
        } else if (boName === bo.SalesOrderItem.name) {
            if (property === bo.SalesOrderItem.PROPERTY_ITEMTYPE_NAME) {
                return ibas.enums.valueOf(emItemType, value);
            }
            if (property === bo.SalesOrderItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                return ibas.enums.valueOf(emYesNo, value);
            }
            if (property === bo.SalesOrderItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                return ibas.enums.valueOf(emYesNo, value);
            }
            if (property === bo.SalesOrderItem.PROPERTY_TREETYPE_NAME) {
                return ibas.enums.valueOf(emProductTreeType, value);
            }
        } else if (boName === bo.SalesDelivery.name) {
            if (property === bo.SalesDelivery.PROPERTY_ROUNDING_NAME) {
                return ibas.enums.valueOf(emYesNo, value);
            }
        } else if (boName === bo.SalesDeliveryItem.name) {
            if (property === bo.SalesDeliveryItem.PROPERTY_ITEMTYPE_NAME) {
                return ibas.enums.valueOf(emItemType, value);
            }
            if (property === bo.SalesDeliveryItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                return ibas.enums.valueOf(emYesNo, value);
            }
            if (property === bo.SalesDeliveryItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                return ibas.enums.valueOf(emYesNo, value);
            }
            if (property === bo.SalesDeliveryItem.PROPERTY_TREETYPE_NAME) {
                return ibas.enums.valueOf(emProductTreeType, value);
            }
        } else if (boName === bo.SalesReturn.name) {
            if (property === bo.SalesReturn.PROPERTY_ROUNDING_NAME) {
                return ibas.enums.valueOf(emYesNo, value);
            }
        } else if (boName === bo.SalesReturnItem.name) {
            if (property === bo.SalesReturnItem.PROPERTY_ITEMTYPE_NAME) {
                return ibas.enums.valueOf(emItemType, value);
            }
            if (property === bo.SalesReturnItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                return ibas.enums.valueOf(emYesNo, value);
            }
            if (property === bo.SalesReturnItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                return ibas.enums.valueOf(emYesNo, value);
            }
            if (property === bo.SalesReturnItem.PROPERTY_TREETYPE_NAME) {
                return ibas.enums.valueOf(emProductTreeType, value);
            }
        }
        return super.parsingData(boName, property, value);
    }
}
