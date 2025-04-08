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
                } else if (boName === bo.SalesReturnRequest.name) {
                    if (property === bo.SalesReturnRequest.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesReturnRequestItem.name) {
                    if (property === bo.SalesReturnRequestItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesReturnRequestItem.PROPERTY_SERIALMANAGEMENT_NAME) {
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
                } else if (boName === bo.SalesReserveInvoice.name) {
                    if (property === bo.SalesReserveInvoice.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesReserveInvoiceItem.name) {
                    if (property === bo.SalesReserveInvoiceItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.SalesReserveInvoiceItem.PROPERTY_SERIALMANAGEMENT_NAME) {
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
                    }
                } else if (boName === bo.DownPaymentRequest.name) {
                    if (property === bo.DownPaymentRequest.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    }
                } else if (boName === bo.DownPaymentRequestItem.name) {
                    if (property === bo.DownPaymentRequestItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
                    } else if (property === bo.DownPaymentRequestItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.toString(ibas.emYesNo, value);
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
                } else if (boName === bo.SalesReturnRequest.name) {
                    if (property === bo.SalesReturnRequest.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesReturnRequestItem.name) {
                    if (property === bo.SalesReturnRequestItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesReturnRequestItem.PROPERTY_SERIALMANAGEMENT_NAME) {
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
                } else if (boName === bo.SalesReserveInvoice.name) {
                    if (property === bo.SalesReserveInvoice.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.SalesReserveInvoiceItem.name) {
                    if (property === bo.SalesReserveInvoiceItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.SalesReserveInvoiceItem.PROPERTY_SERIALMANAGEMENT_NAME) {
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
                    }
                } else if (boName === bo.DownPaymentRequest.name) {
                    if (property === bo.DownPaymentRequest.PROPERTY_ROUNDING_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                } else if (boName === bo.DownPaymentRequestItem.name) {
                    if (property === bo.DownPaymentRequestItem.PROPERTY_BATCHMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    } else if (property === bo.DownPaymentRequestItem.PROPERTY_SERIALMANAGEMENT_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                }
                return super.parsingData(boName, property, value);
            }
        }
        export const CONFIG_ITEM_ONLY_SET_EXISTING_USER_FIELDS_VALUE: string = "onlySetExistingUserFields";
        /**
         * 基于单据
         * @param target 目标
         * @param source 源
         */
        export function baseDocument(
            target: SalesOrder | SalesDelivery | SalesReturn | SalesCreditNote | SalesInvoice | DownPaymentRequest | SalesReserveInvoice | SalesReturnRequest,
            source: ISalesQuote | ISalesOrder | ISalesDelivery | ISalesReturn | ISalesInvoice | ISalesReserveInvoice | SalesReturnRequest
        ): void {
            // 复制头信息
            target.contactPerson = source.contactPerson;
            target.documentDate = ibas.dates.today();
            target.postingDate = ibas.dates.today();
            target.deliveryDate = ibas.dates.today();
            if ((source instanceof SalesQuote && target instanceof SalesOrder)) {
                target.deliveryDate = source.deliveryDate;
            }
            target.reference1 = source.reference1;
            target.reference2 = source.reference2;
            target.remarks = source.remarks;
            target.project = source.project;
            target.consumer = source.consumer;
            target.documentCurrency = source.documentCurrency;
            target.agreements = source.agreements;
            target.branch = source.branch;
            if (!(target instanceof DownPaymentRequest)) {
                target.priceList = source.priceList;
            }
            // 复制自定义字段
            for (let item of source.userFields.forEach()) {
                let myItem: ibas.IUserField = target.userFields.get(item.name);
                if (ibas.objects.isNull(myItem)) {
                    if (ibas.booleans.valueOf(config.get(CONFIG_ITEM_ONLY_SET_EXISTING_USER_FIELDS_VALUE)) === true) {
                        continue;
                    }
                    myItem = target.userFields.register(item.name, item.valueType);
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
            target: SalesOrderItem | SalesDeliveryItem | SalesReturnItem | SalesCreditNoteItem | SalesInvoiceItem | DownPaymentRequestItem | SalesReserveInvoiceItem | SalesReturnRequestItem | SalesCreditNoteItem,
            source: ISalesQuoteItem | ISalesOrderItem | ISalesDeliveryItem | ISalesReserveInvoiceItem | SalesReturnRequestItem
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
            target.agreements = source.agreements;
            target.itemCode = source.itemCode;
            target.itemDescription = source.itemDescription;
            target.itemSign = source.itemSign;
            target.catalogCode = source.catalogCode;
            target.itemVersion = source.itemVersion;
            target.batchManagement = source.batchManagement;
            target.serialManagement = source.serialManagement;
            target.uom = source.uom;
            target.inventoryUOM = source.inventoryUOM;
            target.uomRate = source.uomRate;
            target.rate = source.rate;
            target.tax = source.tax;
            target.taxRate = source.taxRate;
            target.currency = source.currency;
            target.warehouse = source.warehouse;
            target.deliveryDate = source.deliveryDate;
            target.reference1 = source.reference1;
            target.reference2 = source.reference2;
            // 赋值价格
            if (source.closedQuantity > 0 || source.discount !== 1) {
                target.unitPrice = source.unitPrice;
                target.discount = source.discount;
                if (!(target instanceof DownPaymentRequestItem)) {
                    target.inverseDiscount = source.inverseDiscount;
                }
                target.price = source.price;
            }
            // 赋值数量
            target.quantity = source.quantity;
            if (source.inventoryQuantity > 0) {
                target.inventoryQuantity = source.inventoryQuantity;
            }
            // 赋值总计
            if (!(source.closedQuantity > 0)) {
                target.preTaxLineTotal = source.preTaxLineTotal;
                target.taxTotal = source.taxTotal;
                target.lineTotal = source.lineTotal;
                target.preTaxLineTotal = source.preTaxLineTotal;
                target.taxTotal = source.taxTotal;
                // 总计小数位小于价格时，价格赋值
                if (DECIMAL_PLACES_SUM < DECIMAL_PLACES_PRICE) {
                    if (Math.abs(target.unitPrice - source.unitPrice) < Math.pow(0.1, DECIMAL_PLACES_SUM)) {
                        target.unitPrice = source.unitPrice;
                    }
                    if (Math.abs(target.price - source.price) < Math.pow(0.1, DECIMAL_PLACES_SUM)) {
                        target.price = source.price;
                    }
                }
            }
            if (target instanceof SalesReturnItem && source instanceof SalesReturnRequestItem) {
                target.returnCost = source.returnCost;
            }
            // 复制自定义字段
            for (let item of source.userFields.forEach()) {
                let myItem: ibas.IUserField = target.userFields.get(item.name);
                if (ibas.objects.isNull(myItem)) {
                    if (ibas.booleans.valueOf(config.get(CONFIG_ITEM_ONLY_SET_EXISTING_USER_FIELDS_VALUE)) === true) {
                        continue;
                    }
                    myItem = target.userFields.register(item.name, item.valueType);
                }
                if (myItem.valueType !== item.valueType) {
                    continue;
                }
                myItem.value = item.value;
            }
        }
        export function baseProduct(
            target: ISalesQuoteItem | ISalesOrderItem | ISalesDeliveryItem | ISalesReturnItem | ISalesInvoiceItem
                | ISalesCreditNoteItem | IDownPaymentRequestItem | ISalesReserveInvoiceItem | SalesReturnRequestItem,
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
            target.uom = source.salesUOM;
            target.inventoryUOM = source.inventoryUOM;
            if (ibas.strings.isEmpty(target.uom)) {
                target.uom = target.inventoryUOM;
            }
            if (!ibas.strings.isEmpty(source.salesTaxGroup)) {
                target.tax = source.salesTaxGroup;
            }
            if (source.taxed === ibas.emYesNo.NO) {
                target.preTaxPrice = source.price;
            } else {
                target.price = source.price;
            }
            if (!ibas.strings.isEmpty(source.currency)) {
                target.currency = source.currency;
            }
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
                subTargetItem.basisQuantity = source.unitQuantity === 0 ? 0 : ibas.numbers.round(sItem.quantity / source.unitQuantity);
                // 基本信息赋值
                baseProduct(subTargetItem, sItem.extend);
                // 使用组件定义价格
                subTargetItem.price = sItem.price;
                // 计算组件数量
                subTargetItem.quantity = subTargetItem.basisQuantity * targetItem.inventoryQuantity;
                items.add(subTargetItem);
            }
            return items;
        }
        /**
         * 设置单据类型
         *     先判断目标单据是否有相同可选值
         * @param target 目标单据
         * @param source 源单据
         */
        export function baseDocument_OrderType(
            target: SalesOrder | SalesDelivery | SalesReturn | SalesCreditNote | SalesInvoice | DownPaymentRequest | SalesReserveInvoice | SalesReturnRequest,
            source: ISalesQuote | ISalesOrder | ISalesDelivery | ISalesReturn | ISalesInvoice | ISalesReserveInvoice | SalesReturnRequest
        ): void {
            let boReposiorty: shell.bo.IBORepositoryShell = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
            boReposiorty.fetchBizObjectInfo({
                user: ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_CODE),
                boCode: target.objectCode,
                onCompleted: (opRslt) => {
                    for (let item of opRslt.resultObjects) {
                        if (item.code !== target.objectCode) {
                            continue;
                        }
                        if (item.name !== ibas.objects.nameOf(target)) {
                            continue;
                        }
                        for (let ptyItem of item.properties) {
                            if (ptyItem.name !== "OrderType") {
                                continue;
                            }
                            for (let valItem of ptyItem.values) {
                                if (valItem.value === source.orderType) {
                                    target.orderType = source.orderType;
                                    return;
                                }
                            }
                        }
                        break;
                    }
                }
            });
        }

        const DECIMAL_PLACES_SUM: number = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_SUM);
        const DECIMAL_PLACES_PRICE: number = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_PRICE);
        const DECIMAL_PLACES_PERCENTAGE: number = ibas.config.get(ibas.CONFIG_ITEM_DECIMAL_PLACES_PERCENTAGE);
        const TRUNCATE_DECIMALS: boolean = ibas.config.get(ibas.CONFIG_ITEM_TRUNCATE_DECIMALS, false);

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
                    || (!config.isPriceAnchoringAfterTax() && ibas.strings.equalsIgnoreCase(this.taxRate, context.trigger))) {
                    if (taxRate === 0) {
                        context.outputValues.set(this.afterTax, preTax);
                    } else {
                        let result: number = preTax * (1 + taxRate);
                        // 差异小于近似位，则忽略
                        if (ibas.numbers.isApproximated(afterTax, result, DECIMAL_PLACES_SUM)) {
                            return;
                        }
                        context.outputValues.set(this.afterTax, ibas.numbers.round(result, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
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
                        context.outputValues.set(this.preTax, ibas.numbers.round(result, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
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
                        context.outputValues.set(this.tax, ibas.numbers.round(result, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
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
                        // 计算前统一小数位
                        preTotal = ibas.numbers.round(preTotal, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined);
                        total = ibas.numbers.round(total, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined);
                        // 计算折扣
                        let result: number = total / preTotal;
                        // 差异小于近似位，则忽略
                        if (ibas.numbers.isApproximated(discount, result, DECIMAL_PLACES_PERCENTAGE > 4 ? DECIMAL_PLACES_PERCENTAGE : 4, 0)) {
                            return;
                        }
                        context.outputValues.set(this.discount, ibas.numbers.round(result, 9));
                    }
                } else {
                    if (discount === 1 || isNaN(discount)) {
                        context.outputValues.set(this.total, preTotal);
                    } else {
                        let result: number = preTotal * discount;
                        // 差异小于近似位，则忽略
                        if (ibas.numbers.isApproximated(total, result, DECIMAL_PLACES_SUM, 0)) {
                            return;
                        }
                        context.outputValues.set(this.total, ibas.numbers.round(result, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
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
             * @param diffAmount  属性-舍入
             */
            constructor(docTotal: string, disTotal: string, shipTotal?: string, diffAmount?: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_document_total");
                this.docTotal = docTotal;
                this.disTotal = disTotal;
                this.shipTotal = shipTotal;
                this.diffAmount = diffAmount;
                this.inputProperties.add(this.docTotal);
                this.inputProperties.add(this.disTotal);
                this.inputProperties.add(this.shipTotal);
                this.inputProperties.add(this.diffAmount);
                this.affectedProperties.add(this.disTotal);
                this.affectedProperties.add(this.docTotal);
            }
            /** 单据总计 */
            docTotal: string;
            /** 折扣总计 */
            disTotal: string;
            /** 运费总计 */
            shipTotal: string;
            /** 舍入 */
            diffAmount: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let docTotal: number = ibas.numbers.valueOf(context.inputValues.get(this.docTotal));
                let disTotal: number = ibas.numbers.valueOf(context.inputValues.get(this.disTotal));
                let diffAmount: number = ibas.numbers.valueOf(context.inputValues.get(this.diffAmount));
                let shipTotal: number = !ibas.strings.isEmpty(this.shipTotal) ? ibas.numbers.valueOf(context.inputValues.get(this.shipTotal)) : 0;

                if (ibas.strings.equalsIgnoreCase(this.docTotal, context.trigger) && docTotal > 0) {
                    // 单据总计触发
                    let result: number = docTotal - shipTotal - diffAmount;
                    context.outputValues.set(this.disTotal, ibas.numbers.round(result, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                } else {
                    let result: number = disTotal + shipTotal + diffAmount;
                    context.outputValues.set(this.docTotal, ibas.numbers.round(result, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
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
                    // 总计触发，价格 = 总计 / 数量
                    if (quantity <= 0) {
                        return;
                    }
                    let rPrice: number = total / quantity;
                    if (quantity === 1) {
                        // 核心逻辑最优先使用
                        context.outputValues.set(this.price, ibas.numbers.round(rPrice, TRUNCATE_DECIMALS ? DECIMAL_PLACES_PRICE : 9));
                    } else {
                        // 差异小于近似位，则忽略
                        if (!ibas.numbers.isApproximated(rPrice, price,
                            // 总计小数位小于价格小数位，会有舍入问题，估降低精度
                            (DECIMAL_PLACES_PRICE > DECIMAL_PLACES_SUM ? DECIMAL_PLACES_SUM : DECIMAL_PLACES_PRICE))
                        ) {
                            if (TRUNCATE_DECIMALS && price !== 0 && Math.abs(rPrice - price) < 0.4) {
                                // 需要截取小数，且价格小数位大于总计的
                                let pValue: number = ibas.numbers.round(rPrice, DECIMAL_PLACES_PRICE);
                                let sValue: number = ibas.numbers.round(rPrice, DECIMAL_PLACES_SUM);
                                if (DECIMAL_PLACES_PRICE > DECIMAL_PLACES_SUM) {
                                    if ((pValue - sValue) < (4 * Math.pow(0.1, DECIMAL_PLACES_PRICE))) {
                                        // 按价格截取的小数与总计的差异，小于0.0004则使用总计的
                                        context.outputValues.set(this.price, sValue);
                                    } else {
                                        context.outputValues.set(this.price, pValue);
                                    }
                                } else {
                                    context.outputValues.set(this.price, pValue);
                                }
                            } else {
                                context.outputValues.set(this.price, ibas.numbers.round(rPrice, 9));
                            }
                        }
                    }
                } else {
                    let result: number = price * quantity;
                    if (quantity === 1) {
                        context.outputValues.set(this.total, ibas.numbers.round(result));
                    } else {
                        // 差异小于近似位，则忽略
                        if (!ibas.numbers.isApproximated(total, result, DECIMAL_PLACES_SUM, 0)) {
                            context.outputValues.set(this.total, ibas.numbers.round(result, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                        }
                    }
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
                    if (!ibas.numbers.isApproximated(afterDiscount, result, DECIMAL_PLACES_SUM)
                        || discount === 1) {
                        context.outputValues.set(this.afterDiscount, ibas.numbers.round(result));
                    }
                } else if (afterDiscount === 0 && ibas.strings.equalsIgnoreCase(this.afterDiscount, context.trigger)) {
                    context.outputValues.set(this.discount, 1);
                    context.outputValues.set(this.preDiscount, afterDiscount);
                } else if (discount === 1 && ibas.strings.equalsIgnoreCase(this.afterDiscount, context.trigger)) {
                    // 折扣1时，折扣后触发，则使用折扣后，保持折扣1
                    context.outputValues.set(this.preDiscount, afterDiscount);
                } else {
                    if (preDiscount <= 0 || isNaN(preDiscount)) {
                        context.outputValues.set(this.discount, 1);
                        context.outputValues.set(this.preDiscount, afterDiscount);
                    } else {
                        // 非折扣触发，算折扣
                        let result: number = afterDiscount / preDiscount;
                        // 差异小于近似位，则忽略
                        if (!ibas.numbers.isApproximated(discount, result, DECIMAL_PLACES_PERCENTAGE > 4 ? DECIMAL_PLACES_PERCENTAGE : 4, 0)) {
                            context.outputValues.set(this.discount, ibas.numbers.round(result, 9));
                        } else {
                            // 折扣是1，折前折后不等，则使用折前（折后触发）
                            if (discount === 1 && preDiscount !== afterDiscount) {
                                context.outputValues.set(this.afterDiscount, preDiscount);
                            }
                        }
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

                    if (quantity === 1) {
                        // 核心逻辑最优先使用
                        context.outputValues.set(this.price, ibas.numbers.round(rPrice, TRUNCATE_DECIMALS ? DECIMAL_PLACES_PRICE : 9));
                    } else {
                        // 差异小于近似位，则忽略
                        if (!ibas.numbers.isApproximated(rPrice, price,
                            // 总计小数位小于价格小数位，会有舍入问题，估降低精度
                            (DECIMAL_PLACES_PRICE > DECIMAL_PLACES_SUM ? DECIMAL_PLACES_SUM : DECIMAL_PLACES_PRICE))
                        ) {
                            if (TRUNCATE_DECIMALS && price !== 0 && Math.abs(rPrice - price) < 0.4) {
                                // 需要截取小数，且价格小数位大于总计的
                                let pValue: number = ibas.numbers.round(rPrice, DECIMAL_PLACES_PRICE);
                                let sValue: number = ibas.numbers.round(rPrice, DECIMAL_PLACES_SUM);
                                if (DECIMAL_PLACES_PRICE > DECIMAL_PLACES_SUM) {
                                    if ((pValue - sValue) < (4 * Math.pow(0.1, DECIMAL_PLACES_PRICE))) {
                                        // 按价格截取的小数与总计的差异，小于0.0004则使用总计的
                                        context.outputValues.set(this.price, sValue);
                                    } else {
                                        context.outputValues.set(this.price, pValue);
                                    }
                                } else {
                                    context.outputValues.set(this.price, pValue);
                                }
                            } else {
                                context.outputValues.set(this.price, ibas.numbers.round(rPrice, 9));
                            }
                        }
                    }

                    // 总计 = 税前 + 税，等式不成立时才调整（手动调整税前和税）
                    if (total !== (preTotal + taxTotal)) {
                        if (!ibas.numbers.isApproximated(rPreTotal, preTotal, DECIMAL_PLACES_SUM)
                            || quantity === 1) {
                            context.outputValues.set(this.preTotal, ibas.numbers.round(rPreTotal, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                        }
                        if (!ibas.numbers.isApproximated(rTaxTotal, taxTotal, DECIMAL_PLACES_SUM)
                            || quantity === 1) {
                            context.outputValues.set(this.taxTotal, ibas.numbers.round(rTaxTotal, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                        }
                    }
                } else if (ibas.strings.equalsIgnoreCase(this.taxTotal, context.trigger)) {
                    let rTotal: number = preTotal + taxTotal;
                    // 差异小于近似位，则忽略。且差异金额大于0.04
                    if (!ibas.numbers.isApproximated(rTotal, total, DECIMAL_PLACES_SUM, 0)
                        && Math.abs(rTotal - total) > 0.04) {
                        context.outputValues.set(this.total, ibas.numbers.round(rTotal, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                    }
                } else if (ibas.strings.equalsIgnoreCase(this.price, context.trigger)
                    || ibas.strings.equalsIgnoreCase(this.quantity, context.trigger)
                    // 锚定税后价格时，改变税率
                    || (config.isPriceAnchoringAfterTax() && ibas.strings.equalsIgnoreCase(this.taxRate, context.trigger))
                ) {
                    let rTotal: number = price * quantity;
                    let rPreTotal: number = rTotal / (1 + taxRate);
                    let rTaxTotal: number = rTotal - rPreTotal;
                    // 价格 * 数量 = 总计，核心逻辑最优先使用
                    if (quantity === 1) {
                        context.outputValues.set(this.total, ibas.numbers.round(rTotal));
                    } else {
                        if (!ibas.numbers.isApproximated(rTotal, total, DECIMAL_PLACES_SUM, 0)) {
                            context.outputValues.set(this.total, ibas.numbers.round(rTotal, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                        } else if (taxRate === 0) {
                            rPreTotal = total;
                        }
                    }
                    // 差异小于近似位，则忽略
                    if (!ibas.numbers.isApproximated(rPreTotal, preTotal, DECIMAL_PLACES_SUM, 0)) {
                        context.outputValues.set(this.preTotal, ibas.numbers.round(rPreTotal, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                    }
                    if (!ibas.numbers.isApproximated(rTaxTotal, taxTotal, DECIMAL_PLACES_SUM, 0)) {
                        context.outputValues.set(this.taxTotal, ibas.numbers.round(rTaxTotal, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                    }
                } else if (ibas.strings.equalsIgnoreCase(this.taxRate, context.trigger)
                    // 锚定税前价格时，改变税率
                    || (!config.isPriceAnchoringAfterTax() && ibas.strings.equalsIgnoreCase(this.taxRate, context.trigger))
                ) {
                    let rPrice: number = quantity === 0 ? 0 : ((preTotal * (1 + taxRate)) / quantity);
                    if (!ibas.numbers.isApproximated(rPrice, price)) {
                        context.outputValues.set(this.price, ibas.numbers.round(rPrice, TRUNCATE_DECIMALS ? DECIMAL_PLACES_PRICE : undefined));
                    }
                } else if (ibas.strings.equalsIgnoreCase(this.preTotal, context.trigger)) {
                    let rTaxTotal: number = preTotal * taxRate;
                    let rTotal: number = preTotal + rTaxTotal;
                    // 差异小于近似位，则忽略
                    if (!ibas.numbers.isApproximated(rTaxTotal, taxTotal, DECIMAL_PLACES_SUM, 0)) {
                        context.outputValues.set(this.taxTotal, ibas.numbers.round(rTaxTotal, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                    }
                    if (quantity === 1) {
                        context.outputValues.set(this.total, ibas.numbers.round(rTotal));
                    } else {
                        // 差异小于近似位，则忽略。且差异金额大于0.04
                        if (!ibas.numbers.isApproximated(rTotal, total, DECIMAL_PLACES_SUM, 0)
                            && Math.abs(rTotal - total) > 0.04) {
                            context.outputValues.set(this.total, ibas.numbers.round(rTotal, TRUNCATE_DECIMALS ? DECIMAL_PLACES_SUM : undefined));
                        }
                    }
                }
            }
        }
        /** 业务规则-计算库存数量 */
        export class BusinessRuleCalculateInventoryQuantity extends materials.bo.BusinessRuleCalculateInventoryQuantity {

        }
        /** 业务规则-反向折扣（1 - %） */
        export class BusinessRuleNegativeDiscount extends ibas.BusinessRuleCommon {
            /**
             * 构造方法
             * @param discount  属性-折扣
             * @param inverseDiscount  属性-反折扣
             */
            constructor(discount: string, inverseDiscount: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_inverse_discount");
                this.discount = discount;
                this.inverseDiscount = inverseDiscount;
                this.inputProperties.add(this.discount);
                this.inputProperties.add(this.inverseDiscount);
                this.affectedProperties.add(this.discount);
                this.affectedProperties.add(this.inverseDiscount);
            }
            /** 折扣 */
            discount: string;
            /** 折扣前价格 */
            inverseDiscount: string;
            /** 计算规则 */
            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let discount: number = ibas.numbers.valueOf(context.inputValues.get(this.discount));
                let inverseDiscount: number = ibas.numbers.valueOf(context.inputValues.get(this.inverseDiscount));

                if (ibas.strings.equalsIgnoreCase(this.inverseDiscount, context.trigger)) {
                    let result: number = 1 - inverseDiscount;
                    if (!ibas.numbers.isApproximated(result, discount, DECIMAL_PLACES_PERCENTAGE > 4 ? DECIMAL_PLACES_PERCENTAGE : 4, 0)) {
                        context.outputValues.set(this.discount, ibas.numbers.round(result, 9));
                    }
                }
            }
        }
        /**
         * 推导币种金额
         */
        export class BusinessRuleDeductionCurrencyAmount extends ibas.BusinessRuleCommon {
            /**
             * 构造
             * @param amountLC 本币
             * @param amount 交易币
             * @param rate 汇率
             */
            constructor(amountLC: string, amount: string, rate: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_deduction_currency_amount");
                this.amountLC = amountLC;
                this.amount = amount;
                this.rate = rate;
                this.inputProperties.add(this.amountLC);
                this.inputProperties.add(this.amount);
                this.inputProperties.add(this.rate);
                this.affectedProperties.add(this.amountLC);
                this.affectedProperties.add(this.amount);
            }

            amountLC: string;
            amount: string;
            rate: string;

            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let amountLC: number = ibas.numbers.valueOf(context.inputValues.get(this.amountLC));
                let amount: number = ibas.numbers.valueOf(context.inputValues.get(this.amount));
                let rate: number = ibas.numbers.valueOf(context.inputValues.get(this.rate));
                if (rate === 0) {
                    rate = 1;
                }
                if (ibas.strings.equalsIgnoreCase(this.amountLC, context.trigger)
                    || ibas.strings.equalsIgnoreCase(this.rate, context.trigger)) {
                    if (rate !== 1) {
                        let result: number = amountLC * rate;
                        if (!ibas.numbers.isApproximated(result, amount, DECIMAL_PLACES_PRICE, 0)) {
                            context.outputValues.set(this.amount, ibas.numbers.round(result, TRUNCATE_DECIMALS ? DECIMAL_PLACES_PRICE : undefined));
                        }
                    } else {
                        context.outputValues.set(this.amount, amountLC);
                    }
                } else {
                    let pricePlaces: number = amount.toString().split(".")[1]?.length;
                    if (!(pricePlaces > 0) || !(pricePlaces < DECIMAL_PLACES_PRICE)) {
                        pricePlaces = DECIMAL_PLACES_PRICE;
                    }
                    if (rate !== 1) {
                        let result: number = amount / rate;
                        if (!ibas.numbers.isApproximated(result, amountLC, pricePlaces, 0)) {
                            context.outputValues.set(this.amountLC, ibas.numbers.round(result, TRUNCATE_DECIMALS ? pricePlaces : undefined));
                        }
                    } else {
                        context.outputValues.set(this.amountLC, amount);
                    }
                }
            }
        }
        /**
         * 业务规则-舍入差异
         */
        export class BusinessRuleRoundingAmount extends ibas.BusinessRuleCommon {
            /**
             * 构造
             * @param rounding 舍入
             * @param amount 差异金额
             */
            constructor(rounding: string, amount: string) {
                super();
                this.name = ibas.i18n.prop("sales_business_rule_rounding_amount");
                this.rounding = rounding;
                this.amount = amount;
                this.inputProperties.add(this.rounding);
                this.inputProperties.add(this.amount);
                this.affectedProperties.add(this.amount);
            }

            rounding: string;
            amount: string;

            protected compute(context: ibas.BusinessRuleContextCommon): void {
                let rounding: ibas.emYesNo = context.inputValues.get(this.rounding);
                let amount: number = ibas.numbers.valueOf(context.inputValues.get(this.amount));

                if (rounding === ibas.emYesNo.NO) {
                    if (amount !== 0) {
                        context.outputValues.set(this.amount, 0);
                    }
                }
            }
        }
    }
}