/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../api/index.ts" />
/// <reference path="./bo/ProductSuit.ts" />
/// <reference path="./bo/SalesDelivery.ts" />
/// <reference path="./bo/SalesOrder.ts" />
/// <reference path="./bo/SalesQuote.ts" />
/// <reference path="./bo/SalesReturn.ts" />
/// <reference path="./bo/SalesCreditNote.ts" />
/// <reference path="./bo/SalesInvoice.ts" />
/// <reference path="./bo/ShippingAddress.ts" />
/// <reference path="./bo/BlanketAgreement.ts" />
/// <reference path="./bo/DownPaymentRequest.ts" />
/// <reference path="./DataConverter.ts" />
/// <reference path="./BORepository.ts" />

namespace sales {
    export namespace bo {
        // 注册业务对象仓库到工厂
        boFactory.register(BO_REPOSITORY_SALES, BORepositorySales);
        // 注册业务对象到工厂
        boFactory.register(ProductSuit.BUSINESS_OBJECT_CODE, ProductSuit);
        boFactory.register(SalesDelivery.BUSINESS_OBJECT_CODE, SalesDelivery);
        boFactory.register(SalesOrder.BUSINESS_OBJECT_CODE, SalesOrder);
        boFactory.register(SalesReturn.BUSINESS_OBJECT_CODE, SalesReturn);
        boFactory.register(SalesQuote.BUSINESS_OBJECT_CODE, SalesQuote);
        boFactory.register(SalesCreditNote.BUSINESS_OBJECT_CODE, SalesCreditNote);
        boFactory.register(SalesInvoice.BUSINESS_OBJECT_CODE, SalesInvoice);
        boFactory.register(ShippingAddress.BUSINESS_OBJECT_CODE, ShippingAddress);
        boFactory.register(BlanketAgreement.BUSINESS_OBJECT_CODE, BlanketAgreement);
        boFactory.register(DownPaymentRequest.BUSINESS_OBJECT_CODE, DownPaymentRequest);
    }
}