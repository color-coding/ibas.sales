/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace bo {
        /** 数据转换者 */
        export class DataConverter extends ibas.DataConverter4j {

            /** 创建业务对象转换者 */
            protected createConverter(): ibas.BOConverter {
                return new BOConverter;
            }
        }
        /** 模块业务对象工厂 */
        export const boFactory: ibas.BOFactory = new ibas.BOFactory();
        /** 业务对象转换者 */
        class BOConverter extends ibas.BOConverter {
            /** 模块对象工厂 */
            protected factory(): ibas.BOFactory {
                return boFactory;
            }

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
                if (boName === bo.SalesOrder.name) {
                    if (property === bo.SalesOrder.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesQuote.name) {
                    if (property === bo.SalesQuote.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesOrderItem.name) {
                    if (property === bo.SalesOrderItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesOrderItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesOrderItem.PROPERTY_TREETYPE_NAME) {
                        return ibas.enums.toString(emProductTreeType, value);
                    }
                } else if (boName === bo.SalesDelivery.name) {
                    if (property === bo.SalesDelivery.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesDeliveryItem.name) {
                    if (property === bo.SalesDeliveryItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesDeliveryItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesDeliveryItem.PROPERTY_TREETYPE_NAME) {
                        return ibas.enums.toString(emProductTreeType, value);
                    }
                } else if (boName === bo.SalesReturn.name) {
                    if (property === bo.SalesReturn.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesReturnItem.name) {
                    if (property === bo.SalesReturnItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesReturnItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesReturnItem.PROPERTY_TREETYPE_NAME) {
                        return ibas.enums.toString(emProductTreeType, value);
                    }
                } else if (boName === bo.ShippingAddress.name) {
                    if (property === bo.ShippingAddress.PROPERTY_SHIPPINGSTATUS_NAME) {
                        return ibas.enums.toString(emShippingStatus, value);
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
                if (boName === bo.SalesOrder.name) {
                    if (property === bo.SalesOrder.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesQuote.name) {
                    if (property === bo.SalesQuote.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesOrderItem.name) {
                    if (property === bo.SalesOrderItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesOrderItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesOrderItem.PROPERTY_TREETYPE_NAME) {
                        return ibas.enums.valueOf(emProductTreeType, value);
                    }
                } else if (boName === bo.SalesDelivery.name) {
                    if (property === bo.SalesDelivery.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesDeliveryItem.name) {
                    if (property === bo.SalesDeliveryItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesDeliveryItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesDeliveryItem.PROPERTY_TREETYPE_NAME) {
                        return ibas.enums.valueOf(emProductTreeType, value);
                    }
                } else if (boName === bo.SalesReturn.name) {
                    if (property === bo.SalesReturn.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesReturnItem.name) {
                    if (property === bo.SalesReturnItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesReturnItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesReturnItem.PROPERTY_TREETYPE_NAME) {
                        return ibas.enums.valueOf(emProductTreeType, value);
                    }
                } else if (boName === bo.ShippingAddress.name) {
                    if (property === bo.ShippingAddress.PROPERTY_SHIPPINGSTATUS_NAME) {
                        return ibas.enums.valueOf(emShippingStatus, value);
                    }
                }
                return super.parsingData(boName, property, value);
            }
        }
        /**
         * 基于单据
         * @param target 目标
         * @param source 源
         */
        export function baseDocument(
            target: ISalesOrder | ISalesDelivery | ISalesReturn,
            source: ISalesQuote | ISalesOrder | ISalesDelivery
        ): void {
            // 复制头信息
            target.contactPerson = source.contactPerson;
            target.deliveryDate = source.deliveryDate;
            target.documentDate = source.documentDate;
            target.postingDate = source.postingDate;
            target.reference1 = source.reference1;
            target.reference2 = source.reference2;
            target.remarks = source.remarks;
            target.project = source.project;
            target.consumer = source.consumer;
            // 复制自定义字段
            for (let item of source.userFields.forEach()) {
                let myItem: ibas.IUserField = target.userFields.get(item.name);
                if (ibas.objects.isNull(myItem)) {
                    continue;
                }
                if (myItem.valueType !== item.valueType) {
                    continue;
                }
                myItem.value = item.value;
            }
        }
        /**
         * 基于单据
         * @param target 目标
         * @param source 源
         */
        export function baseDocumentItem(
            target: ISalesOrderItem | ISalesDeliveryItem | ISalesReturnItem,
            source: ISalesQuoteItem | ISalesOrderItem | ISalesDeliveryItem
        ): void {
            target.baseDocumentType = source.objectCode;
            target.baseDocumentEntry = source.docEntry;
            target.baseDocumentLineId = source.lineId;
            target.originalDocumentType = source.baseDocumentType;
            target.originalDocumentEntry = source.baseDocumentEntry;
            target.originalDocumentLineId = source.baseDocumentLineId;
            target.distributionRule1 = source.distributionRule1;
            target.distributionRule2 = source.distributionRule2;
            target.distributionRule3 = source.distributionRule3;
            target.distributionRule4 = source.distributionRule4;
            target.distributionRule5 = source.distributionRule5;
            target.itemCode = source.itemCode;
            target.itemDescription = source.itemDescription;
            target.itemSign = source.itemSign;
            target.batchManagement = source.batchManagement;
            target.serialManagement = source.serialManagement;
            target.price = source.price;
            target.currency = source.currency;
            target.quantity = source.quantity;
            target.uom = source.uom;
            target.warehouse = source.warehouse;
            target.deliveryDate = source.deliveryDate;
            target.reference1 = source.reference1;
            target.reference2 = source.reference2;
            target.tax = source.tax;
            target.taxRate = source.taxRate;
            // 复制自定义字段
            for (let item of source.userFields.forEach()) {
                let myItem: ibas.IUserField = target.userFields.get(item.name);
                if (ibas.objects.isNull(myItem)) {
                    continue;
                }
                if (myItem.valueType !== item.valueType) {
                    continue;
                }
                myItem.value = item.value;
            }
        }

        /** 业务规则-计算毛价 */
        export class BusinessRuleCalculateGrossPrice extends ibas.BusinessRuleCommon {
            /**
             *
             * @param result 属性-结果
             * @param original 属性-原价
             * @param taxRate 属性-税率
             */
            constructor(result: string, original: string, taxRate: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_calculate_gross_price");
                this.result = result;
                this.original = original;
                this.taxRate = taxRate;
                this.inputProperties.add(this.original);
                this.inputProperties.add(this.taxRate);
                this.affectedProperties.add(this.result);
            }
            /** 结果 */
            result: string;
            /** 原价 */
            original: string;
            /** 税率 */
            taxRate: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let original: number = ibas.numbers.valueOf(context.inputValues.get(this.original));
                let taxRate: number = ibas.numbers.valueOf(context.inputValues.get(this.taxRate));
                let result: number = original * (1 + taxRate);
                context.outputValues.set(this.result, ibas.numbers.round(result));
            }
        }
    }
}