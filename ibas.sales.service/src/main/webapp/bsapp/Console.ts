/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../borep/index.ts" />
/// <reference path="./productsuit/index.ts" />
/// <reference path="./salesdelivery/index.ts" />
/// <reference path="./salesorder/index.ts" />
/// <reference path="./salesreturn/index.ts" />
/// <reference path="./salesquote/index.ts" />
/// <reference path="./salesinvoice/index.ts" />
/// <reference path="./salescreditnote/index.ts" />
/// <reference path="./shippingaddress/index.ts" />
/// <reference path="./blanketagreement/index.ts" />
/// <reference path="./others/index.ts" />
namespace sales {
    export namespace app {
        /** 属性-导航 */
        const PROPERTY_NAVIGATION: symbol = Symbol("navigation");
        /** 附件信息-文档附件 */
        export const EXTRA_ATTACHMENT: string = "__ATTACHMENT__";
        /** 模块控制台 */
        export class Console extends ibas.ModuleConsole {
            /** 构造函数 */
            constructor() {
                super();
                this.id = CONSOLE_ID;
                this.name = CONSOLE_NAME;
                this.version = CONSOLE_VERSION;
                this.copyright = ibas.i18n.prop("shell_license");
            }
            /** 创建视图导航 */
            navigation(): ibas.IViewNavigation {
                return this[PROPERTY_NAVIGATION];
            }
            /** 初始化 */
            protected registers(): void {
                // 注册功能
                this.register(new BlanketAgreementFunc());
                this.register(new SalesQuoteFunc());
                this.register(new SalesOrderFunc());
                this.register(new SalesDeliveryFunc());
                this.register(new SalesReturnFunc());
                this.register(new SalesInvoiceFunc());
                this.register(new SalesCreditNoteFunc());
                this.register(new ProductSuitFunc());
                // 注册服务应用
                this.register(new ProductSuitChooseServiceMapping());
                this.register(new ProductSuitLinkServiceMapping());
                this.register(new SalesDeliveryChooseServiceMapping());
                this.register(new SalesDeliveryLinkServiceMapping());
                this.register(new SalesDeliveryEditServiceMapping());
                this.register(new SalesOrderChooseServiceMapping());
                this.register(new SalesOrderLinkServiceMapping());
                this.register(new SalesOrderEditServiceMapping());
                this.register(new SalesReturnChooseServiceMapping());
                this.register(new SalesReturnLinkServiceMapping());
                this.register(new SalesReturnEditServiceMapping());
                this.register(new SalesInvoiceChooseServiceMapping());
                this.register(new SalesInvoiceLinkServiceMapping());
                this.register(new SalesInvoiceEditServiceMapping());
                this.register(new SalesCreditNoteChooseServiceMapping());
                this.register(new SalesCreditNoteLinkServiceMapping());
                this.register(new SalesCreditNoteEditServiceMapping());
                this.register(new SalesQuoteChooseServiceMapping());
                this.register(new SalesQuoteLinkServiceMapping());
                this.register(new SalesQuoteEditServiceMapping());
                this.register(new BlanketAgreementChooseServiceMapping());
                this.register(new BlanketAgreementLinkServiceMapping());
                this.register(new MaterialOrderedReservationTargetSalesOrderServiceMapping());
                // 注册常驻应用
                // 收付款服务
                this.register(new SalesReturnPaymentServiceMapping());
                this.register(new SalesDeliveryReceiptServiceMapping());
                this.register(new SalesOrderReceiptServiceMapping());
                // 权限元素
                this.register(ELEMENT_SALES_ORDER_EXTRA);
                this.register(ELEMENT_SALES_QUOTE_EXTRA);
                this.register(ELEMENT_SHIPPING_ADDRESSES);
            }
            /** 运行 */
            run(): void {
                // 加载语言-框架默认
                ibas.i18n.load([
                    this.rootUrl + "resources/languages/sales.json",
                    this.rootUrl + "resources/languages/bos.json"
                ], () => {
                    // 设置资源属性
                    this.description = ibas.i18n.prop(this.name.toLowerCase());
                    this.icon = ibas.i18n.prop(this.name.toLowerCase() + "_icon");
                    // 先加载ui导航
                    let uiModules: string[] = [];
                    if (!ibas.config.get(ibas.CONFIG_ITEM_DISABLE_PLATFORM_VIEW, false)) {
                        if (this.plantform === ibas.emPlantform.PHONE) {
                            // 使用m类型视图
                            uiModules.push("index.ui.m");
                        }
                    }
                    // 默认使用视图
                    if (uiModules.length === 0) {
                        // 使用c类型视图
                        uiModules.push("index.ui.c");
                    }
                    // 加载视图库
                    this.loadUI(uiModules, (ui) => {
                        // 设置导航
                        this[PROPERTY_NAVIGATION] = new ui.Navigation();
                        // 调用初始化
                        this.initialize();
                    });
                    // 保留基类方法
                    super.run();
                });
            }
        }
        /** 模块控制台，手机端 */
        export class ConsolePhone extends Console {
            /** 初始化 */
            protected registers(): void {
                super.registers();
            }
        }
    }
}