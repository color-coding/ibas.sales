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
            /**
             * 解析业务对象数据
             * @param data 目标类型
             * @param sign 特殊标记
             * @returns 本地类型
             */
            parsing(data: any, sign: string): any {
                if (data.type === bo.SpecificationTree.name) {
                    let remote: bo4j.ISpecificationTree = data;
                    let newData: bo.SpecificationTree = new bo.SpecificationTree();
                    newData.name = remote.Name;
                    newData.remarks = remote.Remarks;
                    newData.template = remote.Template;
                    for (let item of remote.Items) {
                        newData.items.add(this.parsing(item, sign));
                    }
                    return newData;
                } else if (data.type === bo.SpecificationTreeItem.name) {
                    let remote: bo4j.ISpecificationTreeItem = data;
                    let newData: bo.SpecificationTreeItem = new bo.SpecificationTreeItem();
                    newData.sign = remote.Sign;
                    newData.description = remote.Description;
                    newData.content = remote.Content;
                    newData.note = remote.Note;
                    newData.editable = remote.Editable;
                    for (let item of remote.VaildValues) {
                        newData.vaildValues.add(this.parsing(item, sign));
                    }
                    for (let item of remote.Items) {
                        newData.items.add(this.parsing(item, sign));
                    }
                    return newData;
                } else {
                    return super.parsing(data, sign);
                }
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
                } else if (boName === bo.Specification.name) {
                    if (property === bo.Specification.PROPERTY_TARGETTYPE_NAME) {
                        return ibas.enums.toString(emSpecificationTarget, value);
                    }
                } else if (boName === bo.SpecificationItem.name) {
                    if (property === bo.SpecificationItem.PROPERTY_EDITABLE_NAME) {
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
                if (boName === bo.SalesOrder.name) {
                    if (property === bo.SalesOrder.PROPERTY_ROUNDING_NAME) {
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
                } else if (boName === bo.Specification.name) {
                    if (property === bo.Specification.PROPERTY_TARGETTYPE_NAME) {
                        return ibas.enums.valueOf(emSpecificationTarget, value);
                    }
                } else if (boName === bo.SpecificationItem.name) {
                    if (property === bo.SpecificationItem.PROPERTY_EDITABLE_NAME) {
                        return ibas.enums.valueOf(ibas.emYesNo, value);
                    }
                }
                return super.parsingData(boName, property, value);
            }
        }
    }
    export namespace bo4j {
        /** 规格树 */
        export interface ISpecificationTree {
            /** 模板 */
            Template: number;
            /** 名称 */
            Name: string;
            /** 备注 */
            Remarks: string;
            /** 规格模板-项目集合 */
            Items: ISpecificationTreeItem[];
        }
        /** 规格模板-项目 */
        export interface ISpecificationTreeItem {
            /** 标记 */
            Sign: string;
            /** 描述 */
            Description: string;
            /** 内容 */
            Content: string;
            /** 备注 */
            Note: string;
            /** 可编辑 */
            Editable: boolean;
            /** 可选值 */
            VaildValues: ibas.KeyText[];
            /** 规格模板-项目集合 */
            Items: ISpecificationTreeItem[];
        }
    }
}