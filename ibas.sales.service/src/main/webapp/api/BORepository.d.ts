/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    FetchCaller,
    SaveCaller,
    UploadFileCaller,
    DownloadFileCaller,
    FileData,
    IBORepositoryApplication
} from "ibas/index";
import * as bo from "./bo/index"

/** 业务仓库 */
export interface IBORepositorySales extends IBORepositoryApplication {

    /**
     * 上传文件
     * @param caller 调用者
     */
    upload(caller: UploadFileCaller<FileData>);
    /**
     * 下载文件
     * @param caller 调用者
     */
    download(caller: DownloadFileCaller<Blob>);
    /**
     * 查询 产品套装
     * @param fetcher 查询者
     */
    fetchProductSuit(fetcher: FetchCaller<bo.IProductSuit>);
    /**
     * 保存 产品套装
     * @param saver 保存者
     */
    saveProductSuit(saver: SaveCaller<bo.IProductSuit>);

    /**
     * 查询 销售交货
     * @param fetcher 查询者
     */
    fetchSalesDelivery(fetcher: FetchCaller<bo.ISalesDelivery>);
    /**
     * 保存 销售交货
     * @param saver 保存者
     */
    saveSalesDelivery(saver: SaveCaller<bo.ISalesDelivery>);

    /**
     * 查询 销售订单
     * @param fetcher 查询者
     */
    fetchSalesOrder(fetcher: FetchCaller<bo.ISalesOrder>);
    /**
     * 保存 销售订单
     * @param saver 保存者
     */
    saveSalesOrder(saver: SaveCaller<bo.ISalesOrder>);

    /**
     * 查询 销售退货
     * @param fetcher 查询者
     */
    fetchSalesReturn(fetcher: FetchCaller<bo.ISalesReturn>);
    /**
     * 保存 销售退货
     * @param saver 保存者
     */
    saveSalesReturn(saver: SaveCaller<bo.ISalesReturn>);


}
