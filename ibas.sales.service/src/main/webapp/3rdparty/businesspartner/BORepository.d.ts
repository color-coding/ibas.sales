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
    FileData
} from "ibas/index";
import * as bo from "./bo/index"

/** 业务仓库 */
export interface IBORepositoryBusinessPartner {

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
     * 查询 业务伙伴余额记录
     * @param fetcher 查询者
     */
    fetchBusinessPartnerBalanceJournal(fetcher: FetchCaller<bo.IBusinessPartnerBalanceJournal>);
    /**
     * 保存 业务伙伴余额记录
     * @param saver 保存者
     */
    saveBusinessPartnerBalanceJournal(saver: SaveCaller<bo.IBusinessPartnerBalanceJournal>);
    /**
     * 查询 业务伙伴组
     * @param fetcher 查询者
     */
    fetchBusinessPartnerGroup(fetcher: FetchCaller<bo.IBusinessPartnerGroup>);
    /**
     * 保存 业务伙伴组
     * @param saver 保存者
     */
    saveBusinessPartnerGroup(saver: SaveCaller<bo.IBusinessPartnerGroup>);

    /**
     * 查询 业务伙伴联系人
     * @param fetcher 查询者
     */
    fetchContactPerson(fetcher: FetchCaller<bo.IContactPerson>);
    /**
     * 保存 业务伙伴联系人
     * @param saver 保存者
     */
    saveContactPerson(saver: SaveCaller<bo.IContactPerson>);

    /**
     * 查询 业务伙伴-客户
     * @param fetcher 查询者
     */
    fetchCustomer(fetcher: FetchCaller<bo.ICustomer>);
    /**
     * 保存 业务伙伴-客户
     * @param saver 保存者
     */
    saveCustomer(saver: SaveCaller<bo.ICustomer>);

    /**
     * 查询 业务伙伴-供应商
     * @param fetcher 查询者
     */
    fetchSupplier(fetcher: FetchCaller<bo.ISupplier>);
    /**
     * 保存 业务伙伴-供应商
     * @param saver 保存者
     */
    saveSupplier(saver: SaveCaller<bo.ISupplier>);


}
