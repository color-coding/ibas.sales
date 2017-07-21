/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "./bo/index";
import { IBORepositorySales, BO_REPOSITORY_SALES } from "../api/index";
import { DataConverter4sl } from "./DataConverters";

/** 业务对象仓库 */
export class BORepositorySales extends ibas.BORepositoryApplication implements IBORepositorySales {

    /** 创建此模块的后端与前端数据的转换者 */
    protected createConverter(): ibas.IDataConverter {
        return new DataConverter4sl;
    }

    /**
     * 查询 产品套装
     * @param fetcher 查询者
     */
    fetchProductSuit(fetcher: ibas.FetchCaller<bo.ProductSuit>): void {
        super.fetch(bo.ProductSuit.name, fetcher);
    }
    /**
     * 保存 产品套装
     * @param saver 保存者
     */
    saveProductSuit(saver: ibas.SaveCaller<bo.ProductSuit>): void {
        super.save(bo.ProductSuit.name, saver);
    }

    /**
     * 查询 销售交货
     * @param fetcher 查询者
     */
    fetchSalesDelivery(fetcher: ibas.FetchCaller<bo.SalesDelivery>): void {
        super.fetch(bo.SalesDelivery.name, fetcher);
    }
    /**
     * 保存 销售交货
     * @param saver 保存者
     */
    saveSalesDelivery(saver: ibas.SaveCaller<bo.SalesDelivery>): void {
        super.save(bo.SalesDelivery.name, saver);
    }

    /**
     * 查询 销售订单
     * @param fetcher 查询者
     */
    fetchSalesOrder(fetcher: ibas.FetchCaller<bo.SalesOrder>): void {
        super.fetch(bo.SalesOrder.name, fetcher);
    }
    /**
     * 保存 销售订单
     * @param saver 保存者
     */
    saveSalesOrder(saver: ibas.SaveCaller<bo.SalesOrder>): void {
        super.save(bo.SalesOrder.name, saver);
    }

    /**
     * 查询 销售退货
     * @param fetcher 查询者
     */
    fetchSalesReturn(fetcher: ibas.FetchCaller<bo.SalesReturn>): void {
        super.fetch(bo.SalesReturn.name, fetcher);
    }
    /**
     * 保存 销售退货
     * @param saver 保存者
     */
    saveSalesReturn(saver: ibas.SaveCaller<bo.SalesReturn>): void {
        super.save(bo.SalesReturn.name, saver);
    }

}
// 注册业务对象仓库到工厂
ibas.boFactory.register(BO_REPOSITORY_SALES, BORepositorySales);
