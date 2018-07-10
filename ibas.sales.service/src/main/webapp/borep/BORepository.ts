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
             * 查询 产品规格
             * @param fetcher 查询者
             */
            fetchProductSpecification(fetcher: ibas.IFetchCaller<bo.ProductSpecification>): void {
                super.fetch(bo.ProductSpecification.name, fetcher);
            }
            /**
             * 保存 产品规格
             * @param saver 保存者
             */
            saveProductSpecification(saver: ibas.ISaveCaller<bo.ProductSpecification>): void {
                super.save(bo.ProductSpecification.name, saver);
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
             * 查询 规格模板
             * @param fetcher 查询者
             */
            fetchSpecification(fetcher: ibas.IFetchCaller<bo.Specification>): void {
                super.fetch(bo.Specification.name, fetcher);
            }
            /**
             * 保存 规格模板
             * @param saver 保存者
             */
            saveSpecification(saver: ibas.ISaveCaller<bo.Specification>): void {
                super.save(bo.Specification.name, saver);
            }
            /**
             * 查询 规格树
             * @param fetcher 查询者
             */
            fetchSpecificationTree(fetcher: ISpecificationTreeFetcher): void {
                let criteria: ibas.ICriteria = new ibas.Criteria();
                if (!ibas.objects.isNull(fetcher.template)) {
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = "template";
                    condition.value = fetcher.template.toString();
                } else {
                    if (!ibas.objects.isNull(fetcher.material)) {
                        let condition: ibas.ICondition = criteria.conditions.create();
                        condition.alias = "material";
                        condition.value = fetcher.material.toString();
                    } else if (!ibas.objects.isNull(fetcher.materialGroup)) {
                        let condition: ibas.ICondition = criteria.conditions.create();
                        condition.alias = "materialGroup";
                        condition.value = fetcher.materialGroup.toString();
                    }
                }
                let caller: ibas.IFetchCaller<bo.ISpecificationTree> = {
                    criteria: criteria,
                    onCompleted: fetcher.onCompleted
                };
                super.fetch(bo.SpecificationTree.name, caller);
            }
        }
    }
}