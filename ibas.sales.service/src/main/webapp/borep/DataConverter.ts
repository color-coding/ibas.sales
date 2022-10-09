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
                if (boName === bo.SalesQuote.name) {
                    if (property === bo.SalesQuote.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesQuote.PROPERTY_CUSTOMERTYPE_NAME) {
                        return ibas.enums.toString(businesspartner.bo.emBusinessPartnerType, value);
                    }
                } else if (boName === bo.SalesQuoteItem.name) {
                    if (property === bo.SalesQuoteItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesQuoteItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesOrder.name) {
                    if (property === bo.SalesOrder.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesOrderItem.name) {
                    if (property === bo.SalesOrderItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesOrderItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
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
                    }
                } else if (boName === bo.SalesInvoice.name) {
                    if (property === bo.SalesInvoice.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesInvoiceItem.name) {
                    if (property === bo.SalesInvoiceItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesInvoiceItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesCreditNote.name) {
                    if (property === bo.SalesCreditNote.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesCreditNoteItem.name) {
                    if (property === bo.SalesCreditNoteItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesCreditNoteItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.ShippingAddress.name) {
                    if (property === bo.ShippingAddress.PROPERTY_SHIPPINGSTATUS_NAME) {
                        return ibas.enums.toString(emShippingStatus, value);
                    }
                } else if (boName === bo.BlanketAgreement.name) {
                    if (property === bo.BlanketAgreement.PROPERTY_AGREEMENTMETHOD_NAME) {
                        return ibas.enums.toString(emAgreementMethod, value);
                    } else if (property === bo.BlanketAgreement.PROPERTY_AGREEMENTTYPE_NAME) {
                        return ibas.enums.toString(emAgreementType, value);
                    } else if (property === bo.BlanketAgreement.PROPERTY_PRICEMODE_NAME) {
                        return ibas.enums.toString(emPriceMode, value);
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
                if (boName === bo.SalesQuote.name) {
                    if (property === bo.SalesQuote.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesQuote.PROPERTY_CUSTOMERTYPE_NAME) {
                        return ibas.enums.valueOf(businesspartner.bo.emBusinessPartnerType, value);
                    }
                } else if (boName === bo.SalesQuoteItem.name) {
                    if (property === bo.SalesQuoteItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesQuoteItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesOrder.name) {
                    if (property === bo.SalesOrder.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesOrderItem.name) {
                    if (property === bo.SalesOrderItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesOrderItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
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
                    }
                } else if (boName === bo.SalesInvoice.name) {
                    if (property === bo.SalesInvoice.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesInvoiceItem.name) {
                    if (property === bo.SalesInvoiceItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesInvoiceItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesCreditNote.name) {
                    if (property === bo.SalesCreditNote.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesCreditNoteItem.name) {
                    if (property === bo.SalesCreditNoteItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesCreditNoteItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.ShippingAddress.name) {
                    if (property === bo.ShippingAddress.PROPERTY_SHIPPINGSTATUS_NAME) {
                        return ibas.enums.valueOf(emShippingStatus, value);
                    }
                } else if (boName === bo.BlanketAgreement.name) {
                    if (property === bo.BlanketAgreement.PROPERTY_AGREEMENTMETHOD_NAME) {
                        return ibas.enums.valueOf(emAgreementMethod, value);
                    } else if (property === bo.BlanketAgreement.PROPERTY_AGREEMENTTYPE_NAME) {
                        return ibas.enums.valueOf(emAgreementType, value);
                    } else if (property === bo.BlanketAgreement.PROPERTY_PRICEMODE_NAME) {
                        return ibas.enums.valueOf(emPriceMode, value);
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
            target: ISalesOrder | ISalesDelivery | ISalesReturn | ISalesCreditNote | ISalesInvoice,
            source: ISalesQuote | ISalesOrder | ISalesDelivery | ISalesReturn | ISalesInvoice
        ): void {
            // 复制头信息
            target.contactPerson = source.contactPerson;
            target.deliveryDate = source.deliveryDate;
            target.documentDate = ibas.dates.today();
            target.postingDate = ibas.dates.today();
            target.reference1 = source.reference1;
            target.reference2 = source.reference2;
            target.remarks = source.remarks;
            target.project = source.project;
            target.consumer = source.consumer;
            target.priceList = source.priceList;
            target.documentCurrency = source.documentCurrency;
            // 复制自定义字段
            for (let item of source.userFields.forEach()) {
                let myItem: ibas.IUserField = target.userFields.get(item.name);
                if (ibas.objects.isNull(myItem)) {
                    myItem = target.userFields.register(item.name, item.valueType);
                    // continue;
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
            target: ISalesOrderItem | ISalesDeliveryItem | ISalesReturnItem | ISalesCreditNoteItem | ISalesInvoiceItem,
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
            target.unitPrice = source.unitPrice;
            target.discount = source.discount;
            target.tax = source.tax;
            target.taxRate = source.taxRate;
            target.price = source.price;
            target.currency = source.currency;
            target.quantity = source.quantity;
            target.uom = source.uom;
            if (!(source.closedQuantity > 0)) {
                target.preTaxLineTotal = source.preTaxLineTotal;
                target.taxTotal = source.taxTotal;
                target.lineTotal = source.lineTotal;
            }
            target.warehouse = source.warehouse;
            target.deliveryDate = source.deliveryDate;
            target.reference1 = source.reference1;
            target.reference2 = source.reference2;
            // 复制自定义字段
            for (let item of source.userFields.forEach()) {
                let myItem: ibas.IUserField = target.userFields.get(item.name);
                if (ibas.objects.isNull(myItem)) {
                    myItem = target.userFields.register(item.name, item.valueType);
                    // continue;
                }
                if (myItem.valueType !== item.valueType) {
                    continue;
                }
                myItem.value = item.value;
            }
        }
        export function baseProduct(
            target: ISalesQuoteItem | ISalesOrderItem | ISalesDeliveryItem | ISalesReturnItem | ISalesInvoiceItem | ISalesCreditNoteItem,
            source: materials.bo.IProduct
        ): void {
            target.itemCode = source.code;
            target.itemDescription = source.name;
            target.itemSign = source.sign;
            target.serialManagement = source.serialManagement;
            target.batchManagement = source.batchManagement;
            target.warehouse = source.warehouse;
            if (ibas.strings.isEmpty(source.warehouse)) {
                if (!ibas.strings.isEmpty(source.defaultWarehouse)) {
                    target.warehouse = source.defaultWarehouse;
                }
            }
            target.quantity = 1;
            target.uom = source.inventoryUOM;
            if (!ibas.strings.isEmpty(source.salesTaxGroup)) {
                target.tax = source.salesTaxGroup;
            }
            if (source.taxed === ibas.emYesNo.NO) {
                target.preTaxPrice = source.price;
            } else {
                target.price = source.price;
            }
            target.currency = source.currency;
            if (!ibas.strings.isEmpty(target.tax)) {
                accounting.taxrate.assign(target.tax, (rate) => {
                    if (rate >= 0) {
                        target.taxRate = rate;
                        target.unitPrice = 0;
                        if (source.taxed === ibas.emYesNo.NO) {
                            target.preTaxPrice = source.price;
                        } else {
                            target.price = source.price;
                        }
                    }
                });
            }
        }
        export function baseProductSuit(
            target: ISalesQuoteItems | ISalesOrderItems | ISalesDeliveryItems,
            source: bo.IProductSuitEx
        ): ISalesQuoteItem[] | ISalesOrderItem[] | ISalesDeliveryItem[] {
            let items: ibas.IList<any> = new ibas.ArrayList<any>();
            let targetItem: ISalesQuoteItem | ISalesOrderItem | ISalesDeliveryItem = target.create();
            // 父项标记
            targetItem.lineSign = ibas.uuids.random();
            baseProduct(targetItem, source.extend);
            items.add(targetItem);
            for (let sItem of source.productSuitItems) {
                let subTargetItem: ISalesQuoteItem | ISalesOrderItem | ISalesDeliveryItem = target.create();
                // 构建父项关系
                subTargetItem.lineSign = ibas.uuids.random();
                subTargetItem.parentLineSign = targetItem.lineSign;
                // 计算单位数量
                subTargetItem.basisQuantity = ibas.numbers.round(sItem.quantity / source.unitQuantity);
                // 基本信息赋值
                baseProduct(subTargetItem, sItem.extend);
                // 使用组件定义价格
                subTargetItem.price = sItem.price;
                // 计算组件数量
                subTargetItem.quantity = subTargetItem.basisQuantity * targetItem.quantity;
                items.add(subTargetItem);
            }
            return items;
        }

        const DECIMAL_PLACES_SUM: number = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_SUM);
        const DECIMAL_PLACES_PRICE: number = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_PRICE);
        const DECIMAL_PLACES_PERCENTAGE: number = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_PERCENTAGE);

        /** 业务规则-推导税前税后价格 */
        export class BusinessRuleDeductionTaxPrice extends ibas.BusinessRuleCommon {
            /**
             * 构造方法
             * @param taxRate  属性-税率
             * @param preTax   属性-税前
             * @param afterTax 属性-税后
             */
            constructor(taxRate: string, preTax: string, afterTax: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_tax_price");
                this.taxRate = taxRate;
                this.preTax = preTax;
                this.afterTax = afterTax;
                this.inputProperties.add(this.taxRate);
                this.inputProperties.add(this.preTax);
                this.inputProperties.add(this.afterTax);
                this.affectedProperties.add(this.taxRate);
                this.affectedProperties.add(this.preTax);
                this.affectedProperties.add(this.afterTax);
            }
            /** 税率 */
            taxRate: string;
            /** 税前价格 */
            preTax: string;
            /** 税后价格 */
            afterTax: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let taxRate: number = ibas.numbers.valueOf(context.inputValues.get(this.taxRate));
                let preTax: number = ibas.numbers.valueOf(context.inputValues.get(this.preTax));
                let afterTax: number = ibas.numbers.valueOf(context.inputValues.get(this.afterTax));
                if (taxRate < 0) {
                    context.outputValues.set(this.taxRate, 0);
                    context.outputValues.set(this.afterTax, preTax);
                    return;
                }
                if (ibas.strings.equalsIgnoreCase(this.preTax, context.trigger)
                    || ibas.strings.equalsIgnoreCase(this.taxRate, context.trigger)) {
                    if (taxRate === 0) {
                        context.outputValues.set(this.afterTax, preTax);
                    } else {
                        let result: number = preTax * (1 + taxRate);
                        // 差异小于近似位，则忽略
                        if (ibas.numbers.isApproximated(afterTax, result, DECIMAL_PLACES_SUM)) {
                            return;
                        }
                        context.outputValues.set(this.afterTax, ibas.numbers.round(result, DECIMAL_PLACES_SUM));
                    }
                } else {
                    if (taxRate === 0) {
                        context.outputValues.set(this.preTax, afterTax);
                    } else {
                        let result: number = afterTax / (1 + taxRate);
                        // 差异小于近似位，则忽略
                        if (ibas.numbers.isApproximated(preTax, result, DECIMAL_PLACES_SUM)) {
                            return;
                        }
                        context.outputValues.set(this.preTax, ibas.numbers.round(result, DECIMAL_PLACES_SUM));
                    }
                }
            }
        }
        /** 业务规则-推导税总计 */
        export class BusinessRuleDeductionTaxTotal extends ibas.BusinessRuleCommon {
            /**
             * 构造方法
             * @param tax 属性-税总计
             * @param total   属性-税前总计
             * @param taxRate  属性-税率
             */
            constructor(tax: string, total: string, taxRate: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_tax_total");
                this.taxRate = taxRate;
                this.tax = tax;
                this.total = total;
                this.inputProperties.add(this.taxRate);
                this.inputProperties.add(this.tax);
                this.inputProperties.add(this.total);
                this.affectedProperties.add(this.taxRate);
                this.affectedProperties.add(this.tax);
            }
            /** 税总计 */
            tax: string;
            /** 税前总计 */
            total: string;
            /** 税率 */
            taxRate: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let taxRate: number = ibas.numbers.valueOf(context.inputValues.get(this.taxRate));
                let total: number = ibas.numbers.valueOf(context.inputValues.get(this.total));
                let tax: number = ibas.numbers.valueOf(context.inputValues.get(this.tax));
                if (taxRate < 0) {
                    context.outputValues.set(this.taxRate, 0);
                    context.outputValues.set(this.tax, 0);
                    return;
                }
                if (ibas.strings.equalsIgnoreCase(this.total, context.trigger)
                    || ibas.strings.equalsIgnoreCase(this.taxRate, context.trigger)
                    || tax < 0) {
                    if (taxRate === 0 || isNaN(taxRate)) {
                        context.outputValues.set(this.tax, 0);
                    } else {
                        let result: number = total * taxRate;
                        // 差异小于近似位，则忽略
                        if (ibas.numbers.isApproximated(tax, result, DECIMAL_PLACES_SUM)) {
                            return;
                        }
                        context.outputValues.set(this.tax, ibas.numbers.round(result, DECIMAL_PLACES_SUM));
                    }
                }
            }
        }
        /** 业务规则-推导折扣及总计 */
        export class BusinessRuleDeductionDiscountTotal extends ibas.BusinessRuleCommon {
            /**
             * 构造方法
             * @param total 属性-折扣后总计
             * @param preTotal   属性-折扣前总计
             * @param discount  属性-折扣
             */
            constructor(total: string, preTotal: string, discount: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_discount_total");
                this.total = total;
                this.preTotal = preTotal;
                this.discount = discount;
                this.inputProperties.add(this.total);
                this.inputProperties.add(this.preTotal);
                this.inputProperties.add(this.discount);
                this.affectedProperties.add(this.discount);
                this.affectedProperties.add(this.total);
            }
            /** 折扣后总计 */
            total: string;
            /** 折扣前总计 */
            preTotal: string;
            /** 折扣 */
            discount: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let discount: number = ibas.numbers.valueOf(context.inputValues.get(this.discount));
                let total: number = ibas.numbers.valueOf(context.inputValues.get(this.total));
                let preTotal: number = ibas.numbers.valueOf(context.inputValues.get(this.preTotal));
                if (discount < 0) {
                    context.outputValues.set(this.discount, 1);
                    context.outputValues.set(this.total, preTotal);
                    return;
                }
                if (ibas.strings.equalsIgnoreCase(this.total, context.trigger)) {
                    // 折扣后触发，算折扣
                    if (preTotal === 0 || isNaN(preTotal)) {
                        context.outputValues.set(this.discount, 1);
                        context.outputValues.set(this.total, 0);
                    } else {
                        let result: number = total / preTotal;
                        // 差异小于近似位，则忽略
                        if (ibas.numbers.isApproximated(discount, result, DECIMAL_PLACES_PERCENTAGE, 10)) {
                            return;
                        }
                        context.outputValues.set(this.discount, ibas.numbers.round(result, DECIMAL_PLACES_PERCENTAGE + 2));
                    }
                } else {
                    if (discount === 1 || isNaN(discount)) {
                        context.outputValues.set(this.total, preTotal);
                    } else {
                        let result: number = preTotal * discount;
                        // 差异小于近似位，则忽略
                        if (ibas.numbers.isApproximated(total, result, DECIMAL_PLACES_SUM)) {
                            return;
                        }
                        context.outputValues.set(this.total, ibas.numbers.round(result, DECIMAL_PLACES_SUM));
                    }
                }
            }
        }
        /** 业务规则-推导单据总计 */
        export class BusinessRuleDeductionDocumentTotal extends ibas.BusinessRuleCommon {
            /**
             * 构造方法
             * @param docTotal 属性-单据总计
             * @param disTotal   属性-折扣总计
             * @param shipTotal  属性-运费总计
             */
            constructor(docTotal: string, disTotal: string, shipTotal?: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_document_total");
                this.docTotal = docTotal;
                this.disTotal = disTotal;
                this.shipTotal = shipTotal;
                this.inputProperties.add(this.docTotal);
                this.inputProperties.add(this.disTotal);
                this.inputProperties.add(this.shipTotal);
                this.affectedProperties.add(this.disTotal);
                this.affectedProperties.add(this.docTotal);
            }
            /** 单据总计 */
            docTotal: string;
            /** 折扣总计 */
            disTotal: string;
            /** 运费总计 */
            shipTotal: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let docTotal: number = ibas.numbers.valueOf(context.inputValues.get(this.docTotal));
                let disTotal: number = ibas.numbers.valueOf(context.inputValues.get(this.disTotal));
                let shipTotal: number = !ibas.strings.isEmpty(this.shipTotal) ? ibas.numbers.valueOf(context.inputValues.get(this.shipTotal)) : 0;

                if (ibas.strings.equalsIgnoreCase(this.docTotal, context.trigger) && docTotal > 0) {
                    // 单据总计触发
                    context.outputValues.set(this.disTotal, ibas.numbers.round(docTotal - shipTotal, DECIMAL_PLACES_SUM));
                } else {
                    context.outputValues.set(this.docTotal, ibas.numbers.round(disTotal + shipTotal, DECIMAL_PLACES_SUM));
                }
            }
        }
        /** 业务规则-推导 价格 * 数量 = 总计 */
        export class BusinessRuleDeductionPriceQtyTotal extends ibas.BusinessRuleCommon {
            /**
             * 构造方法
             * @param total 属性-总计
             * @param price  属性-价格
             * @param quantity   属性-数量
             */
            constructor(total: string, price: string, quantity: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_price_qty_total");
                this.price = price;
                this.quantity = quantity;
                this.total = total;
                this.inputProperties.add(this.price);
                this.inputProperties.add(this.quantity);
                this.inputProperties.add(this.total);
                this.affectedProperties.add(this.price);
                this.affectedProperties.add(this.total);
            }
            /** 价格 */
            price: string;
            /** 数量 */
            quantity: string;
            /** 总计 */
            total: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let price: number = ibas.numbers.valueOf(context.inputValues.get(this.price));
                let quantity: number = ibas.numbers.valueOf(context.inputValues.get(this.quantity));
                let total: number = ibas.numbers.valueOf(context.inputValues.get(this.total));

                if (ibas.strings.equalsIgnoreCase(this.total, context.trigger)) {
                    if (quantity <= 0) {
                        return;
                    }
                    // 总计触发，价格 = 总计 / 数量
                    let result: number = total / quantity;
                    // 差异小于近似位，则忽略
                    if (ibas.numbers.isApproximated(price, result, DECIMAL_PLACES_PRICE)) {
                        return;
                    }
                    context.outputValues.set(this.price, ibas.numbers.round(result, DECIMAL_PLACES_PRICE + 2));
                } else {
                    let result: number = price * quantity;
                    // 差异小于近似位，则忽略
                    if (ibas.numbers.isApproximated(total, result, DECIMAL_PLACES_SUM)) {
                        return;
                    }
                    context.outputValues.set(this.total, ibas.numbers.round(result, DECIMAL_PLACES_SUM));
                }
            }
        }
        /** 业务规则-推导折扣 */
        export class BusinessRuleDeductionDiscount extends ibas.BusinessRuleCommon {
            /**
             * 构造方法
             * @param discount  属性-折扣
             * @param preDiscount   属性-折扣前
             * @param afterDiscount 属性-折扣后
             */
            constructor(discount: string, preDiscount: string, afterDiscount: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_discount");
                this.discount = discount;
                this.preDiscount = preDiscount;
                this.afterDiscount = afterDiscount;
                this.inputProperties.add(this.discount);
                this.inputProperties.add(this.preDiscount);
                this.inputProperties.add(this.afterDiscount);
                this.affectedProperties.add(this.discount);
                this.affectedProperties.add(this.preDiscount);
                this.affectedProperties.add(this.afterDiscount);
            }
            /** 折扣 */
            discount: string;
            /** 折扣前价格 */
            preDiscount: string;
            /** 折扣后价格 */
            afterDiscount: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let discount: number = ibas.numbers.valueOf(context.inputValues.get(this.discount));
                let preDiscount: number = ibas.numbers.valueOf(context.inputValues.get(this.preDiscount));
                let afterDiscount: number = ibas.numbers.valueOf(context.inputValues.get(this.afterDiscount));

                if (ibas.strings.equalsIgnoreCase(this.discount, context.trigger)
                    || ibas.strings.equalsIgnoreCase(this.preDiscount, context.trigger)) {
                    // 折扣触发，算成交价
                    let result: number = preDiscount * discount;
                    // 差异小于近似位，则忽略
                    if (ibas.numbers.isApproximated(afterDiscount, result, DECIMAL_PLACES_SUM)) {
                        return;
                    }
                    context.outputValues.set(this.afterDiscount, ibas.numbers.round(result, DECIMAL_PLACES_SUM));
                } else {
                    if (preDiscount <= 0 || isNaN(preDiscount)) {
                        context.outputValues.set(this.discount, 1);
                        context.outputValues.set(this.preDiscount, afterDiscount);
                    } else {
                        // 非折扣触发，算折扣
                        let result: number = afterDiscount / preDiscount;
                        // 差异小于近似位，则忽略
                        if (ibas.numbers.isApproximated(discount, result, DECIMAL_PLACES_PERCENTAGE, 10)) {
                            return;
                        }
                        context.outputValues.set(this.discount, ibas.numbers.round(result, DECIMAL_PLACES_PERCENTAGE + 2));
                    }
                }
            }
        }
        /** 业务规则-推导含税价格，税总计及总计 */
        export class BusinessRuleDeductionPriceTaxTotal extends ibas.BusinessRuleCommon {
            /**
             * 构造方法
             * @param total 属性-总计
             * @param price  属性-价格
             * @param quantity   属性-数量
             * @param taxRate   属性-税率
             * @param taxTotal   属性-税总计
             * @param preTotal   属性-税前总计
             */
            constructor(total: string, price: string, quantity: string, taxRate: string, taxTotal: string, preTotal: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_price_tax_total");
                this.price = price;
                this.quantity = quantity;
                this.total = total;
                this.taxRate = taxRate;
                this.taxTotal = taxTotal;
                this.preTotal = preTotal;
                this.inputProperties.add(this.price);
                this.inputProperties.add(this.quantity);
                this.inputProperties.add(this.total);
                this.inputProperties.add(this.taxRate);
                this.inputProperties.add(this.taxTotal);
                this.inputProperties.add(this.preTotal);
                this.affectedProperties.add(this.price);
                this.affectedProperties.add(this.preTotal);
                this.affectedProperties.add(this.taxTotal);
                this.affectedProperties.add(this.total);
            }
            /** 价格 */
            price: string;
            /** 数量 */
            quantity: string;
            /** 总计 */
            total: string;
            /** 税率 */
            taxRate: string;
            /** 税总计 */
            taxTotal: string;
            /** 税前总计 */
            preTotal: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let price: number = ibas.numbers.valueOf(context.inputValues.get(this.price));
                let quantity: number = ibas.numbers.valueOf(context.inputValues.get(this.quantity));
                let total: number = ibas.numbers.valueOf(context.inputValues.get(this.total));
                let taxRate: number = ibas.numbers.valueOf(context.inputValues.get(this.taxRate));
                let taxTotal: number = ibas.numbers.valueOf(context.inputValues.get(this.taxTotal));
                let preTotal: number = ibas.numbers.valueOf(context.inputValues.get(this.preTotal));

                if (ibas.strings.equalsIgnoreCase(this.total, context.trigger)) {
                    if (quantity <= 0) {
                        return;
                    }
                    let rPrice: number = total / quantity;
                    let rPreTotal: number = total / (1 + taxRate);
                    let rTaxTotal: number = total - rPreTotal;
                    // 差异小于近似位，则忽略
                    if (!ibas.numbers.isApproximated(rPrice, price, DECIMAL_PLACES_PRICE)) {
                        context.outputValues.set(this.price, ibas.numbers.round(rPrice, DECIMAL_PLACES_PRICE + 2));
                    }
                    if (!ibas.numbers.isApproximated(rPreTotal, preTotal, DECIMAL_PLACES_SUM)) {
                        context.outputValues.set(this.preTotal, ibas.numbers.round(rPreTotal, DECIMAL_PLACES_SUM));
                    }
                    if (!ibas.numbers.isApproximated(rTaxTotal, taxTotal, DECIMAL_PLACES_SUM, Math.pow(10, DECIMAL_PLACES_SUM))) {
                        // 税精度降低
                        context.outputValues.set(this.taxTotal, ibas.numbers.round(rTaxTotal, DECIMAL_PLACES_SUM));
                    }
                } else if (ibas.strings.equalsIgnoreCase(this.taxTotal, context.trigger)) {
                    let rTotal: number = preTotal + taxTotal;
                    // 差异小于近似位，则忽略
                    if (!ibas.numbers.isApproximated(rTotal, total, DECIMAL_PLACES_SUM)) {
                        context.outputValues.set(this.total, ibas.numbers.round(rTotal, DECIMAL_PLACES_SUM));
                    }
                } else if (ibas.strings.equalsIgnoreCase(this.price, context.trigger) || ibas.strings.equalsIgnoreCase(this.quantity, context.trigger)) {
                    let rTotal: number = price * quantity;
                    let rPreTotal: number = rTotal / (1 + taxRate);
                    let rTaxTotal: number = rTotal - rPreTotal;
                    // 价格 * 数量 = 总计，核心逻辑最优先使用
                    context.outputValues.set(this.total, ibas.numbers.round(rTotal, DECIMAL_PLACES_SUM));
                    // 差异小于近似位，则忽略
                    if (!ibas.numbers.isApproximated(rPreTotal, preTotal, DECIMAL_PLACES_SUM)) {
                        context.outputValues.set(this.preTotal, ibas.numbers.round(rPreTotal, DECIMAL_PLACES_SUM));
                    }
                    if (!ibas.numbers.isApproximated(rTaxTotal, taxTotal, DECIMAL_PLACES_SUM, Math.pow(10, DECIMAL_PLACES_SUM))) {
                        // 税精度降低
                        context.outputValues.set(this.taxTotal, ibas.numbers.round(rTaxTotal, DECIMAL_PLACES_SUM));
                    }
                } else if (ibas.strings.equalsIgnoreCase(this.taxRate, context.trigger)
                    || ibas.strings.equalsIgnoreCase(this.preTotal, context.trigger)) {
                    let rTaxTotal: number = preTotal * taxRate;
                    let rTotal: number = preTotal + rTaxTotal;
                    // 差异小于近似位，则忽略
                    if (!ibas.numbers.isApproximated(rTaxTotal, taxTotal, DECIMAL_PLACES_SUM, Math.pow(10, DECIMAL_PLACES_SUM))) {
                        // 税精度降低
                        context.outputValues.set(this.taxTotal, ibas.numbers.round(rTaxTotal, DECIMAL_PLACES_SUM));
                    }
                    if (!ibas.numbers.isApproximated(rTotal, total, DECIMAL_PLACES_SUM)) {
                        context.outputValues.set(this.total, ibas.numbers.round(rTotal, DECIMAL_PLACES_SUM));
                    }
                }
            }
        }
    }
}