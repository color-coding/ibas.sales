/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../3rdparty/ibas/index.d.ts" />
/// <reference path="../3rdparty/materials/index.ts" />
/// <reference path="../3rdparty/businesspartner/index.ts" />
/// <reference path="../api/index.ts" />
/// <reference path="./bo/ProductSuit.ts" />
/// <reference path="./bo/SalesDelivery.ts" />
/// <reference path="./bo/SalesOrder.ts" />
/// <reference path="./bo/SalesReturn.ts" />
/// <reference path="./bo/ShippingAddress.ts" />
/// <reference path="./DataConverter.ts" />
/// <reference path="./BORepository.ts" />

namespace sales {
    export namespace bo {
        // 注册业务对象仓库到工厂
        ibas.boFactory.register(BO_REPOSITORY_SALES, BORepositorySales);
        // 注册业务对象到工厂
        ibas.boFactory.register(ProductSuit.BUSINESS_OBJECT_CODE, ProductSuit);
        ibas.boFactory.register(SalesDelivery.BUSINESS_OBJECT_CODE, SalesDelivery);
        ibas.boFactory.register(SalesOrder.BUSINESS_OBJECT_CODE, SalesOrder);
        ibas.boFactory.register(SalesReturn.BUSINESS_OBJECT_CODE, SalesReturn);
        ibas.boFactory.register(ShippingAddress.BUSINESS_OBJECT_CODE, ShippingAddress);
    }
}