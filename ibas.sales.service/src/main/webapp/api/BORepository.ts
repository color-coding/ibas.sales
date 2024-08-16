/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace bo {

        /** 业务仓库 */
        export interface IBORepositorySales extends ibas.IBORepositoryApplication {

            /**
             * 上传文件
             * @param caller 调用者
             */
            upload(caller: ibas.IUploadFileCaller<ibas.FileData>): void;
            /**
             * 下载文件
             * @param caller 调用者
             */
            download(caller: ibas.IDownloadFileCaller<Blob>): void;
            /**
             * 查询 产品套装
             * @param fetcher 查询者
             */
            fetchProductSuit(fetcher: ibas.IFetchCaller<bo.IProductSuit>): void;
            /**
             * 保存 产品套装
             * @param saver 保存者
             */
            saveProductSuit(saver: ibas.ISaveCaller<bo.IProductSuit>): void;

            /**
             * 查询 销售交货
             * @param fetcher 查询者
             */
            fetchSalesDelivery(fetcher: ibas.IFetchCaller<bo.ISalesDelivery>): void;
            /**
             * 保存 销售交货
             * @param saver 保存者
             */
            saveSalesDelivery(saver: ibas.ISaveCaller<bo.ISalesDelivery>): void;

            /**
             * 查询 销售订单
             * @param fetcher 查询者
             */
            fetchSalesOrder(fetcher: ibas.IFetchCaller<bo.ISalesOrder>): void;
            /**
             * 保存 销售订单
             * @param saver 保存者
             */
            saveSalesOrder(saver: ibas.ISaveCaller<bo.ISalesOrder>): void;

            /**
             * 查询 销售退货
             * @param fetcher 查询者
             */
            fetchSalesReturn(fetcher: ibas.IFetchCaller<bo.ISalesReturn>): void;
            /**
             * 保存 销售退货
             * @param saver 保存者
             */
            saveSalesReturn(saver: ibas.ISaveCaller<bo.ISalesReturn>): void;

            /**
             * 查询 销售报价
             * @param fetcher 查询者
             */
            fetchSalesQuote(fetcher: ibas.IFetchCaller<bo.ISalesQuote>): void;
            /**
             * 保存 销售报价
             * @param saver 保存者
             */
            saveSalesQuote(saver: ibas.ISaveCaller<bo.ISalesQuote>): void;
            /**
             * 查询 产品套装并扩展产品数据
             * @param fetcher 查询者
             */
            fetchProductSuitEx(fetcher: ibas.IFetchCaller<bo.IProductSuitEx>): void;
            /**
             * 查询 销售贷项
             * @param fetcher 查询者
             */
            fetchSalesCreditNote(fetcher: ibas.IFetchCaller<bo.ISalesCreditNote>): void;
            /**
             * 保存 销售贷项
             * @param saver 保存者
             */
            saveSalesCreditNote(saver: ibas.ISaveCaller<bo.ISalesCreditNote>): void;
            /**
             * 查询 销售发票
             * @param fetcher 查询者
             */
            fetchSalesInvoice(fetcher: ibas.IFetchCaller<bo.ISalesInvoice>): void;
            /**
             * 保存 销售发票
             * @param saver 保存者
             */
            saveSalesInvoice(saver: ibas.ISaveCaller<bo.ISalesInvoice>): void;
            /**
             * 查询 一揽子协议
             * @param fetcher 查询者
             */
            fetchBlanketAgreement(fetcher: ibas.IFetchCaller<bo.IBlanketAgreement>): void;
            /**
             * 保存 一揽子协议
             * @param saver 保存者
             */
            saveBlanketAgreement(saver: ibas.ISaveCaller<bo.IBlanketAgreement>): void;
            /**
             * 查询 预付款申请
             * @param fetcher 查询者
             */
            fetchDownPaymentRequest(fetcher: ibas.IFetchCaller<bo.IDownPaymentRequest>): void;
            /**
             * 保存 预付款申请
             * @param saver 保存者
             */
            saveDownPaymentRequest(saver: ibas.ISaveCaller<bo.IDownPaymentRequest>): void;
            /**
             * 查询 销售预留发票
             * @param fetcher 查询者
             */
            fetchSalesReserveInvoice(fetcher: ibas.IFetchCaller<bo.ISalesReserveInvoice>): void;
            /**
             * 保存 销售预留发票
             * @param saver 保存者
             */
            saveSalesReserveInvoice(saver: ibas.ISaveCaller<bo.ISalesReserveInvoice>): void;
            /**
             * 查询 销售退货请求
             * @param fetcher 查询者
             */
            fetchSalesReturnRequest(fetcher: ibas.IFetchCaller<bo.ISalesReturnRequest>): void;
            /**
             * 保存 销售退货请求
             * @param saver 保存者
             */
            saveSalesReturnRequest(saver: ibas.ISaveCaller<bo.ISalesReturnRequest>): void;

        }
    }

}
