/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace bo {
        /** 业务对象仓库 */
        export class BORepositorySales extends ibas.BORepositoryApplication implements IBORepositorySales {

            /** 创建此模块的后端与前端数据的转换者 */
            protected createConverter(): ibas.IDataConverter {
                return new DataConverter;
            }

            /**
             * 上传文件
             * @param caller 调用者
             */
            upload(caller: ibas.IUploadFileCaller<ibas.FileData>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryUploadAjax = new ibas.FileRepositoryUploadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.upload("upload", caller);
            }
            /**
             * 下载文件
             * @param caller 调用者
             */
            download(caller: ibas.IDownloadFileCaller<Blob>): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryDownloadAjax = new ibas.FileRepositoryDownloadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.download("download", caller);
            }
            /**
             * 查询 产品套装
             * @param fetcher 查询者
             */
            fetchProductSuit(fetcher: ibas.IFetchCaller<bo.ProductSuit>): void {
                super.fetch(bo.ProductSuit.name, fetcher);
            }
            /**
             * 保存 产品套装
             * @param saver 保存者
             */
            saveProductSuit(saver: ibas.ISaveCaller<bo.ProductSuit>): void {
                super.save(bo.ProductSuit.name, saver);
            }

            /**
             * 查询 销售交货
             * @param fetcher 查询者
             */
            fetchSalesDelivery(fetcher: ibas.IFetchCaller<bo.SalesDelivery>): void {
                super.fetch(bo.SalesDelivery.name, fetcher);
            }
            /**
             * 保存 销售交货
             * @param saver 保存者
             */
            saveSalesDelivery(saver: ibas.ISaveCaller<bo.SalesDelivery>): void {
                super.save(bo.SalesDelivery.name, saver);
            }

            /**
             * 查询 销售订单
             * @param fetcher 查询者
             */
            fetchSalesOrder(fetcher: ibas.IFetchCaller<bo.SalesOrder>): void {
                super.fetch(bo.SalesOrder.name, fetcher);
            }
            /**
             * 保存 销售订单
             * @param saver 保存者
             */
            saveSalesOrder(saver: ibas.ISaveCaller<bo.SalesOrder>): void {
                super.save(bo.SalesOrder.name, saver);
            }

            /**
             * 查询 销售退货
             * @param fetcher 查询者
             */
            fetchSalesReturn(fetcher: ibas.IFetchCaller<bo.SalesReturn>): void {
                super.fetch(bo.SalesReturn.name, fetcher);
            }
            /**
             * 保存 销售退货
             * @param saver 保存者
             */
            saveSalesReturn(saver: ibas.ISaveCaller<bo.SalesReturn>): void {
                super.save(bo.SalesReturn.name, saver);
            }

            /**
             * 查询 销售报价
             * @param fetcher 查询者
             */
            fetchSalesQuote(fetcher: ibas.IFetchCaller<bo.SalesQuote>): void {
                super.fetch(bo.SalesQuote.name, fetcher);
            }
            /**
             * 保存 销售报价
             * @param saver 保存者
             */
            saveSalesQuote(saver: ibas.ISaveCaller<bo.SalesQuote>): void {
                super.save(bo.SalesQuote.name, saver);
            }
            /**
             * 查询 产品套装并扩展产品数据
             * @param fetcher 查询者
             */
            fetchProductSuitEx(fetcher: ibas.IFetchCaller<bo.IProductSuitEx>): void {
                this.fetchProductSuit({
                    criteria: fetcher.criteria,
                    onCompleted(psRslt: ibas.IOperationResult<bo.IProductSuit>): void {
                        try {
                            if (psRslt.resultCode !== 0) {
                                throw new Error(psRslt.message);
                            }
                            if (psRslt.resultObjects.length > 0) {
                                let criteria: ibas.ICriteria = new ibas.Criteria();
                                for (let item of psRslt.resultObjects) {
                                    let condition: ibas.ICondition = criteria.conditions.create();
                                    condition.alias = materials.bo.Product.PROPERTY_CODE_NAME;
                                    condition.value = item.product;
                                    if (criteria.conditions.length > 0) {
                                        condition.relationship = ibas.emConditionRelationship.OR;
                                    }
                                    for (let sItem of item.productSuitItems) {
                                        condition = criteria.conditions.create();
                                        condition.alias = materials.bo.Product.PROPERTY_CODE_NAME;
                                        condition.value = sItem.itemCode;
                                        condition.relationship = ibas.emConditionRelationship.OR;
                                    }
                                }
                                let boRepository: materials.bo.IBORepositoryMaterials = ibas.boFactory.create(materials.bo.BO_REPOSITORY_MATERIALS);
                                boRepository.fetchProduct({
                                    criteria: criteria,
                                    onCompleted(mmRslt: ibas.IOperationResult<materials.bo.IProduct>): void {
                                        for (let item of psRslt.resultObjects) {
                                            let pItem: materials.bo.IProduct = mmRslt.resultObjects.firstOrDefault(c => c.code === item.product);
                                            if (pItem !== null) {
                                                (<bo.IProductSuitEx>item).extend = pItem;
                                            }
                                            for (let sItem of item.productSuitItems) {
                                                let pItem: materials.bo.IProduct = mmRslt.resultObjects.firstOrDefault(c => c.code === sItem.itemCode);
                                                if (pItem !== null) {
                                                    (<bo.IProductSuitItemEx>sItem).extend = pItem;
                                                }
                                            }
                                        }
                                        fetcher.onCompleted(<ibas.IOperationResult<bo.IProductSuitEx>>psRslt);
                                    }
                                });
                            } else {
                                fetcher.onCompleted(<ibas.IOperationResult<bo.IProductSuitEx>>psRslt);
                            }
                        } catch (error) {
                            fetcher.onCompleted(new ibas.OperationResult(error));
                        }
                    }
                });
            }
            /**
             * 查询 销售贷项
             * @param fetcher 查询者
             */
            fetchSalesCreditNote(fetcher: ibas.IFetchCaller<bo.SalesCreditNote>): void {
                super.fetch(bo.SalesCreditNote.name, fetcher);
            }
            /**
             * 保存 销售贷项
             * @param saver 保存者
             */
            saveSalesCreditNote(saver: ibas.ISaveCaller<bo.SalesCreditNote>): void {
                super.save(bo.SalesCreditNote.name, saver);
            }

            /**
             * 查询 销售发票
             * @param fetcher 查询者
             */
            fetchSalesInvoice(fetcher: ibas.IFetchCaller<bo.SalesInvoice>): void {
                super.fetch(bo.SalesInvoice.name, fetcher);
            }
            /**
             * 保存 销售发票
             * @param saver 保存者
             */
            saveSalesInvoice(saver: ibas.ISaveCaller<bo.SalesInvoice>): void {
                super.save(bo.SalesInvoice.name, saver);
            }
            /**
             * 查询 一揽子协议
             * @param fetcher 查询者
             */
            fetchBlanketAgreement(fetcher: ibas.IFetchCaller<bo.BlanketAgreement>): void {
                super.fetch(bo.BlanketAgreement.name, fetcher);
            }
            /**
             * 保存 一揽子协议
             * @param saver 保存者
             */
            saveBlanketAgreement(saver: ibas.ISaveCaller<bo.BlanketAgreement>): void {
                super.save(bo.BlanketAgreement.name, saver);
            }
            /**
             * 查询 预付款申请
             * @param fetcher 查询者
             */
            fetchDownPaymentRequest(fetcher: ibas.IFetchCaller<bo.DownPaymentRequest>): void {
                super.fetch(bo.DownPaymentRequest.name, fetcher);
            }
            /**
             * 保存 预付款申请
             * @param saver 保存者
             */
            saveDownPaymentRequest(saver: ibas.ISaveCaller<bo.DownPaymentRequest>): void {
                super.save(bo.DownPaymentRequest.name, saver);
            }
            /**
             * 查询 销售预留发票
             * @param fetcher 查询者
             */
            fetchSalesReserveInvoice(fetcher: ibas.IFetchCaller<bo.SalesReserveInvoice>): void {
                super.fetch(bo.SalesReserveInvoice.name, fetcher);
            }
            /**
             * 保存 销售预留发票
             * @param saver 保存者
             */
            saveSalesReserveInvoice(saver: ibas.ISaveCaller<bo.SalesReserveInvoice>): void {
                super.save(bo.SalesReserveInvoice.name, saver);
            }
            /**
             * 查询 销售退货请求
             * @param fetcher 查询者
             */
            fetchSalesReturnRequest(fetcher: ibas.IFetchCaller<bo.SalesReturnRequest>): void {
                super.fetch(bo.SalesReturnRequest.name, fetcher);
            }
            /**
             * 保存 销售退货请求
             * @param saver 保存者
             */
            saveSalesReturnRequest(saver: ibas.ISaveCaller<bo.SalesReturnRequest>): void {
                super.save(bo.SalesReturnRequest.name, saver);
            }

        }
    }
}