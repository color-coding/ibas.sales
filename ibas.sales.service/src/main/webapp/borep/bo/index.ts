/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

// 模块索引文件，此文件集中导出类
export * from "./ProductSuit";
export * from "./SalesDelivery";
export * from "./SalesOrder";
export * from "./SalesReturn";

// 注册业务对象到工厂
import * as ibas from "ibas/index";
import { ProductSuit } from "./ProductSuit";
ibas.boFactory.register(ProductSuit.BUSINESS_OBJECT_CODE, ProductSuit);
import { SalesDelivery } from "./SalesDelivery";
ibas.boFactory.register(SalesDelivery.BUSINESS_OBJECT_CODE, SalesDelivery);
import { SalesOrder } from "./SalesOrder";
ibas.boFactory.register(SalesOrder.BUSINESS_OBJECT_CODE, SalesOrder);
import { SalesReturn } from "./SalesReturn";
ibas.boFactory.register(SalesReturn.BUSINESS_OBJECT_CODE, SalesReturn);