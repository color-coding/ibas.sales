/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace sales {
    export namespace bo {
        /** 销售交货 */
        export class SalesDelivery extends ibas.BODocument<SalesDelivery> implements ISalesDelivery {

            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = BO_CODE_SALESDELIVERY;
            /** 构造函数 */
            constructor() {
                super();
            }
            /** 映射的属性名称-凭证编号 */
            static PROPERTY_DOCENTRY_NAME: string = "DocEntry";
            /** 获取-凭证编号 */
            get docEntry(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_DOCENTRY_NAME);
            }
            /** 设置-凭证编号 */
            set docEntry(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_DOCENTRY_NAME, value);
            }

            /** 映射的属性名称-期间编号 */
            static PROPERTY_DOCNUM_NAME: string = "DocNum";
            /** 获取-期间编号 */
            get docNum(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_DOCNUM_NAME);
            }
            /** 设置-期间编号 */
            set docNum(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_DOCNUM_NAME, value);
            }

            /** 映射的属性名称-期间 */
            static PROPERTY_PERIOD_NAME: string = "Period";
            /** 获取-期间 */
            get period(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_PERIOD_NAME);
            }
            /** 设置-期间 */
            set period(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_PERIOD_NAME, value);
            }

            /** 映射的属性名称-取消 */
            static PROPERTY_CANCELED_NAME: string = "Canceled";
            /** 获取-取消 */
            get canceled(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(SalesDelivery.PROPERTY_CANCELED_NAME);
            }
            /** 设置-取消 */
            set canceled(value: ibas.emYesNo) {
                this.setProperty(SalesDelivery.PROPERTY_CANCELED_NAME, value);
            }

            /** 映射的属性名称-状态 */
            static PROPERTY_STATUS_NAME: string = "Status";
            /** 获取-状态 */
            get status(): ibas.emBOStatus {
                return this.getProperty<ibas.emBOStatus>(SalesDelivery.PROPERTY_STATUS_NAME);
            }
            /** 设置-状态 */
            set status(value: ibas.emBOStatus) {
                this.setProperty(SalesDelivery.PROPERTY_STATUS_NAME, value);
            }

            /** 映射的属性名称-审批状态 */
            static PROPERTY_APPROVALSTATUS_NAME: string = "ApprovalStatus";
            /** 获取-审批状态 */
            get approvalStatus(): ibas.emApprovalStatus {
                return this.getProperty<ibas.emApprovalStatus>(SalesDelivery.PROPERTY_APPROVALSTATUS_NAME);
            }
            /** 设置-审批状态 */
            set approvalStatus(value: ibas.emApprovalStatus) {
                this.setProperty(SalesDelivery.PROPERTY_APPROVALSTATUS_NAME, value);
            }

            /** 映射的属性名称-单据状态 */
            static PROPERTY_DOCUMENTSTATUS_NAME: string = "DocumentStatus";
            /** 获取-单据状态 */
            get documentStatus(): ibas.emDocumentStatus {
                return this.getProperty<ibas.emDocumentStatus>(SalesDelivery.PROPERTY_DOCUMENTSTATUS_NAME);
            }
            /** 设置-单据状态 */
            set documentStatus(value: ibas.emDocumentStatus) {
                this.setProperty(SalesDelivery.PROPERTY_DOCUMENTSTATUS_NAME, value);
            }

            /** 映射的属性名称-对象类型 */
            static PROPERTY_OBJECTCODE_NAME: string = "ObjectCode";
            /** 获取-对象类型 */
            get objectCode(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_OBJECTCODE_NAME);
            }
            /** 设置-对象类型 */
            set objectCode(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_OBJECTCODE_NAME, value);
            }

            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string = "CreateDate";
            /** 获取-创建日期 */
            get createDate(): Date {
                return this.getProperty<Date>(SalesDelivery.PROPERTY_CREATEDATE_NAME);
            }
            /** 设置-创建日期 */
            set createDate(value: Date) {
                this.setProperty(SalesDelivery.PROPERTY_CREATEDATE_NAME, value);
            }

            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string = "CreateTime";
            /** 获取-创建时间 */
            get createTime(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_CREATETIME_NAME);
            }
            /** 设置-创建时间 */
            set createTime(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_CREATETIME_NAME, value);
            }

            /** 映射的属性名称-修改日期 */
            static PROPERTY_UPDATEDATE_NAME: string = "UpdateDate";
            /** 获取-修改日期 */
            get updateDate(): Date {
                return this.getProperty<Date>(SalesDelivery.PROPERTY_UPDATEDATE_NAME);
            }
            /** 设置-修改日期 */
            set updateDate(value: Date) {
                this.setProperty(SalesDelivery.PROPERTY_UPDATEDATE_NAME, value);
            }

            /** 映射的属性名称-修改时间 */
            static PROPERTY_UPDATETIME_NAME: string = "UpdateTime";
            /** 获取-修改时间 */
            get updateTime(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_UPDATETIME_NAME);
            }
            /** 设置-修改时间 */
            set updateTime(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_UPDATETIME_NAME, value);
            }

            /** 映射的属性名称-版本 */
            static PROPERTY_LOGINST_NAME: string = "LogInst";
            /** 获取-版本 */
            get logInst(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_LOGINST_NAME);
            }
            /** 设置-版本 */
            set logInst(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_LOGINST_NAME, value);
            }

            /** 映射的属性名称-服务系列 */
            static PROPERTY_SERIES_NAME: string = "Series";
            /** 获取-服务系列 */
            get series(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_SERIES_NAME);
            }
            /** 设置-服务系列 */
            set series(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_SERIES_NAME, value);
            }

            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string = "DataSource";
            /** 获取-数据源 */
            get dataSource(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_DATASOURCE_NAME);
            }
            /** 设置-数据源 */
            set dataSource(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_DATASOURCE_NAME, value);
            }

            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string = "CreateUserSign";
            /** 获取-创建用户 */
            get createUserSign(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_CREATEUSERSIGN_NAME);
            }
            /** 设置-创建用户 */
            set createUserSign(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_CREATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-修改用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string = "UpdateUserSign";
            /** 获取-修改用户 */
            get updateUserSign(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_UPDATEUSERSIGN_NAME);
            }
            /** 设置-修改用户 */
            set updateUserSign(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_UPDATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string = "CreateActionId";
            /** 获取-创建动作标识 */
            get createActionId(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_CREATEACTIONID_NAME);
            }
            /** 设置-创建动作标识 */
            set createActionId(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_CREATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string = "UpdateActionId";
            /** 获取-更新动作标识 */
            get updateActionId(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_UPDATEACTIONID_NAME);
            }
            /** 设置-更新动作标识 */
            set updateActionId(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_UPDATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-数据所有者 */
            static PROPERTY_DATAOWNER_NAME: string = "DataOwner";
            /** 获取-数据所有者 */
            get dataOwner(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_DATAOWNER_NAME);
            }
            /** 设置-数据所有者 */
            set dataOwner(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_DATAOWNER_NAME, value);
            }

            /** 映射的属性名称-团队成员 */
            static PROPERTY_TEAMMEMBERS_NAME: string = "TeamMembers";
            /** 获取-团队成员 */
            get teamMembers(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_TEAMMEMBERS_NAME);
            }
            /** 设置-团队成员 */
            set teamMembers(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_TEAMMEMBERS_NAME, value);
            }

            /** 映射的属性名称-数据所属组织 */
            static PROPERTY_ORGANIZATION_NAME: string = "Organization";
            /** 获取-数据所属组织 */
            get organization(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_ORGANIZATION_NAME);
            }
            /** 设置-数据所属组织 */
            set organization(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_ORGANIZATION_NAME, value);
            }

            /** 映射的属性名称-过账日期 */
            static PROPERTY_POSTINGDATE_NAME: string = "PostingDate";
            /** 获取-过账日期 */
            get postingDate(): Date {
                return this.getProperty<Date>(SalesDelivery.PROPERTY_POSTINGDATE_NAME);
            }
            /** 设置-过账日期 */
            set postingDate(value: Date) {
                this.setProperty(SalesDelivery.PROPERTY_POSTINGDATE_NAME, value);
            }

            /** 映射的属性名称-到期日 */
            static PROPERTY_DELIVERYDATE_NAME: string = "DeliveryDate";
            /** 获取-到期日 */
            get deliveryDate(): Date {
                return this.getProperty<Date>(SalesDelivery.PROPERTY_DELIVERYDATE_NAME);
            }
            /** 设置-到期日 */
            set deliveryDate(value: Date) {
                this.setProperty(SalesDelivery.PROPERTY_DELIVERYDATE_NAME, value);
            }

            /** 映射的属性名称-凭证日期 */
            static PROPERTY_DOCUMENTDATE_NAME: string = "DocumentDate";
            /** 获取-凭证日期 */
            get documentDate(): Date {
                return this.getProperty<Date>(SalesDelivery.PROPERTY_DOCUMENTDATE_NAME);
            }
            /** 设置-凭证日期 */
            set documentDate(value: Date) {
                this.setProperty(SalesDelivery.PROPERTY_DOCUMENTDATE_NAME, value);
            }

            /** 映射的属性名称-参考1 */
            static PROPERTY_REFERENCE1_NAME: string = "Reference1";
            /** 获取-参考1 */
            get reference1(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_REFERENCE1_NAME);
            }
            /** 设置-参考1 */
            set reference1(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_REFERENCE1_NAME, value);
            }

            /** 映射的属性名称-参考2 */
            static PROPERTY_REFERENCE2_NAME: string = "Reference2";
            /** 获取-参考2 */
            get reference2(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_REFERENCE2_NAME);
            }
            /** 设置-参考2 */
            set reference2(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_REFERENCE2_NAME, value);
            }

            /** 映射的属性名称-备注 */
            static PROPERTY_REMARKS_NAME: string = "Remarks";
            /** 获取-备注 */
            get remarks(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_REMARKS_NAME);
            }
            /** 设置-备注 */
            set remarks(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_REMARKS_NAME, value);
            }

            /** 映射的属性名称-已引用 */
            static PROPERTY_REFERENCED_NAME: string = "Referenced";
            /** 获取-已引用 */
            get referenced(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(SalesDelivery.PROPERTY_REFERENCED_NAME);
            }
            /** 设置-已引用 */
            set referenced(value: ibas.emYesNo) {
                this.setProperty(SalesDelivery.PROPERTY_REFERENCED_NAME, value);
            }

            /** 映射的属性名称-已删除 */
            static PROPERTY_DELETED_NAME: string = "Deleted";
            /** 获取-已删除 */
            get deleted(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(SalesDelivery.PROPERTY_DELETED_NAME);
            }
            /** 设置-已删除 */
            set deleted(value: ibas.emYesNo) {
                this.setProperty(SalesDelivery.PROPERTY_DELETED_NAME, value);
            }

            /** 映射的属性名称-客户代码 */
            static PROPERTY_CUSTOMERCODE_NAME: string = "CustomerCode";
            /** 获取-客户代码 */
            get customerCode(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_CUSTOMERCODE_NAME);
            }
            /** 设置-客户代码 */
            set customerCode(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_CUSTOMERCODE_NAME, value);
            }

            /** 映射的属性名称-客户名称 */
            static PROPERTY_CUSTOMERNAME_NAME: string = "CustomerName";
            /** 获取-客户名称 */
            get customerName(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_CUSTOMERNAME_NAME);
            }
            /** 设置-客户名称 */
            set customerName(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_CUSTOMERNAME_NAME, value);
            }

            /** 映射的属性名称-联系人 */
            static PROPERTY_CONTACTPERSON_NAME: string = "ContactPerson";
            /** 获取-联系人 */
            get contactPerson(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_CONTACTPERSON_NAME);
            }
            /** 设置-联系人 */
            set contactPerson(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_CONTACTPERSON_NAME, value);
            }

            /** 映射的属性名称-折扣 */
            static PROPERTY_DISCOUNT_NAME: string = "Discount";
            /** 获取-折扣 */
            get discount(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_DISCOUNT_NAME);
            }
            /** 设置-折扣 */
            set discount(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_DISCOUNT_NAME, value);
            }

            /** 映射的属性名称-折扣后总计 */
            static PROPERTY_DISCOUNTTOTAL_NAME: string = "DiscountTotal";
            /** 获取-折扣后总计 */
            get discountTotal(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_DISCOUNTTOTAL_NAME);
            }
            /** 设置-折扣后总计 */
            set discountTotal(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_DISCOUNTTOTAL_NAME, value);
            }

            /** 映射的属性名称-单据货币 */
            static PROPERTY_DOCUMENTCURRENCY_NAME: string = "DocumentCurrency";
            /** 获取-单据货币 */
            get documentCurrency(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_DOCUMENTCURRENCY_NAME);
            }
            /** 设置-单据货币 */
            set documentCurrency(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_DOCUMENTCURRENCY_NAME, value);
            }

            /** 映射的属性名称-单据汇率 */
            static PROPERTY_DOCUMENTRATE_NAME: string = "DocumentRate";
            /** 获取-单据汇率 */
            get documentRate(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_DOCUMENTRATE_NAME);
            }
            /** 设置-单据汇率 */
            set documentRate(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_DOCUMENTRATE_NAME, value);
            }

            /** 映射的属性名称-单据总计 */
            static PROPERTY_DOCUMENTTOTAL_NAME: string = "DocumentTotal";
            /** 获取-单据总计 */
            get documentTotal(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_DOCUMENTTOTAL_NAME);
            }
            /** 设置-单据总计 */
            set documentTotal(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_DOCUMENTTOTAL_NAME, value);
            }

            /** 映射的属性名称-已付款总计 */
            static PROPERTY_PAIDTOTAL_NAME: string = "PaidTotal";
            /** 获取-已付款总计 */
            get paidTotal(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_PAIDTOTAL_NAME);
            }
            /** 设置-已付款总计 */
            set paidTotal(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_PAIDTOTAL_NAME, value);
            }

            /** 映射的属性名称-毛利 */
            static PROPERTY_GROSSPROFIT_NAME: string = "GrossProfit";
            /** 获取-毛利 */
            get grossProfit(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_GROSSPROFIT_NAME);
            }
            /** 设置-毛利 */
            set grossProfit(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_GROSSPROFIT_NAME, value);
            }

            /** 映射的属性名称-价格清单 */
            static PROPERTY_PRICELIST_NAME: string = "PriceList";
            /** 获取-价格清单 */
            get priceList(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_PRICELIST_NAME);
            }
            /** 设置-价格清单 */
            set priceList(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_PRICELIST_NAME, value);
            }

            /** 映射的属性名称-付款条款代码 */
            static PROPERTY_PAYMENTCODE_NAME: string = "PaymentCode";
            /** 获取-付款条款代码 */
            get paymentCode(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_PAYMENTCODE_NAME);
            }
            /** 设置-付款条款代码 */
            set paymentCode(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_PAYMENTCODE_NAME, value);
            }

            /** 映射的属性名称-舍入 */
            static PROPERTY_ROUNDING_NAME: string = "Rounding";
            /** 获取-舍入 */
            get rounding(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(SalesDelivery.PROPERTY_ROUNDING_NAME);
            }
            /** 设置-舍入 */
            set rounding(value: ibas.emYesNo) {
                this.setProperty(SalesDelivery.PROPERTY_ROUNDING_NAME, value);
            }

            /** 映射的属性名称-舍入差额 */
            static PROPERTY_DIFFAMOUNT_NAME: string = "DiffAmount";
            /** 获取-舍入差额 */
            get diffAmount(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_DIFFAMOUNT_NAME);
            }
            /** 设置-舍入差额 */
            set diffAmount(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_DIFFAMOUNT_NAME, value);
            }

            /** 映射的属性名称-项目代码 */
            static PROPERTY_PROJECT_NAME: string = "Project";
            /** 获取-项目代码 */
            get project(): string {
                return this.getProperty<string>(SalesDelivery.PROPERTY_PROJECT_NAME);
            }
            /** 设置-项目代码 */
            set project(value: string) {
                this.setProperty(SalesDelivery.PROPERTY_PROJECT_NAME, value);
            }

            /** 映射的属性名称-销售交货-行集合 */
            static PROPERTY_SALESDELIVERYITEMS_NAME: string = "SalesDeliveryItems";
            /** 获取-销售交货-行集合 */
            get salesDeliveryItems(): SalesDeliveryItems {
                return this.getProperty<SalesDeliveryItems>(SalesDelivery.PROPERTY_SALESDELIVERYITEMS_NAME);
            }
            /** 设置-销售交货-行集合 */
            set salesDeliveryItems(value: SalesDeliveryItems) {
                this.setProperty(SalesDelivery.PROPERTY_SALESDELIVERYITEMS_NAME, value);
            }

            /** 映射的属性名称-送货地址集合 */
            static PROPERTY_SHIPPINGADDRESSS_NAME: string = "ShippingAddresss";
            /** 获取-送货地址集合 */
            get shippingAddresss(): ShippingAddresss {
                return this.getProperty<ShippingAddresss>(SalesDelivery.PROPERTY_SHIPPINGADDRESSS_NAME);
            }
            /** 设置-送货地址集合 */
            set shippingAddresss(value: ShippingAddresss) {
                this.setProperty(SalesDelivery.PROPERTY_SHIPPINGADDRESSS_NAME, value);
            }

            /** 初始化数据 */
            protected init(): void {
                this.salesDeliveryItems = new SalesDeliveryItems(this);
                this.shippingAddresss = new ShippingAddresss(this);
                this.objectCode = ibas.config.applyVariables(SalesDelivery.BUSINESS_OBJECT_CODE);
                this.documentStatus = ibas.emDocumentStatus.RELEASED;
                this.documentCurrency = ibas.config.get(ibas.CONFIG_ITEM_DEFAULT_CURRENCY);
            }
            /** 映射的属性名称-项目的税总计 */
            static PROPERTY_ITEMSTAXTOTAL_NAME: string = "ItemsTaxTotal";
            /** 获取-项目的税总计 */
            get itemsTaxTotal(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_ITEMSTAXTOTAL_NAME);
            }
            /** 设置-项目的税总计 */
            set itemsTaxTotal(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_ITEMSTAXTOTAL_NAME, value);
            }

            /** 映射的属性名称-项目的行总计 */
            static PROPERTY_ITEMSLINETOTAL_NAME: string = "ItemsLineTotal";
            /** 获取-项目的行总计 */
            get itemsLineTotal(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_ITEMSLINETOTAL_NAME);
            }
            /** 设置-项目的行总计 */
            set itemsLineTotal(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_ITEMSLINETOTAL_NAME, value);
            }

            /** 映射的属性名称-运送费用总计 */
            static PROPERTY_SHIPPINGSEXPENSETOTAL_NAME: string = "ShippingsExpenseTotal";
            /** 获取-运送费用总计 */
            get shippingsExpenseTotal(): number {
                return this.getProperty<number>(SalesDelivery.PROPERTY_SHIPPINGSEXPENSETOTAL_NAME);
            }
            /** 设置-运送费用总计 */
            set shippingsExpenseTotal(value: number) {
                this.setProperty(SalesDelivery.PROPERTY_SHIPPINGSEXPENSETOTAL_NAME, value);
            }
            protected registerRules(): ibas.IBusinessRule[] {
                return [
                    // 计算项目-行总计
                    new ibas.BusinessRuleSumElements(
                        SalesDelivery.PROPERTY_ITEMSLINETOTAL_NAME, SalesDelivery.PROPERTY_SALESDELIVERYITEMS_NAME, SalesDeliveryItem.PROPERTY_LINETOTAL_NAME),
                    // 计算项目-税总计
                    new ibas.BusinessRuleSumElements(
                        SalesDelivery.PROPERTY_ITEMSTAXTOTAL_NAME, SalesDelivery.PROPERTY_SALESDELIVERYITEMS_NAME, SalesDeliveryItem.PROPERTY_TAXTOTAL_NAME),
                    // 计算运输-费用总计
                    new ibas.BusinessRuleSumElements(
                        SalesDelivery.PROPERTY_SHIPPINGSEXPENSETOTAL_NAME, SalesDelivery.PROPERTY_SHIPPINGADDRESSS_NAME, ShippingAddress.PROPERTY_EXPENSE_NAME),
                    // 折扣后总计 = 项目-行总计 * 折扣
                    new ibas.BusinessRuleMultiplication(
                        SalesDelivery.PROPERTY_DISCOUNTTOTAL_NAME, SalesDelivery.PROPERTY_ITEMSLINETOTAL_NAME, SalesDelivery.PROPERTY_DISCOUNT_NAME),
                    // 单据总计 = 折扣后总计 + 运输费用 + 税总额
                    new ibas.BusinessRuleSummation(
                        SalesDelivery.PROPERTY_DOCUMENTTOTAL_NAME, SalesDelivery.PROPERTY_DISCOUNTTOTAL_NAME,
                        SalesDelivery.PROPERTY_ITEMSTAXTOTAL_NAME, SalesDelivery.PROPERTY_SHIPPINGSEXPENSETOTAL_NAME),
                ];
            }
            /** 基于销售订单 */
            baseDocument(document: ISalesOrder): void {
                if (ibas.objects.instanceOf(document, SalesOrder)) {
                    if (!ibas.strings.equals(this.customerCode, document.customerCode)) {
                        return;
                    }
                    // 复制行项目
                    for (let item of document.salesOrderItems) {
                        let myItem: SalesDeliveryItem = this.salesDeliveryItems.create();
                        myItem.baseDocumentType = item.objectCode;
                        myItem.baseDocumentEntry = item.docEntry;
                        myItem.baseDocumentLineId = item.lineId;
                        myItem.originalDocumentType = item.baseDocumentType;
                        myItem.originalDocumentEntry = item.baseDocumentEntry;
                        myItem.originalDocumentLineId = item.baseDocumentLineId;
                        myItem.distributionRule1 = item.distributionRule1;
                        myItem.distributionRule2 = item.distributionRule2;
                        myItem.distributionRule3 = item.distributionRule3;
                        myItem.distributionRule4 = item.distributionRule4;
                        myItem.distributionRule5 = item.distributionRule5;
                        myItem.project = item.project;
                        myItem.itemCode = item.itemCode;
                        myItem.itemDescription = item.itemDescription;
                        myItem.batchManagement = item.batchManagement;
                        myItem.serialManagement = item.serialManagement;
                        myItem.price = item.price;
                        myItem.quantity = item.quantity;
                        myItem.uom = item.uom;
                        myItem.warehouse = item.warehouse;
                        myItem.reference1 = item.reference1;
                        myItem.reference2 = item.reference2;
                        // 复制批次
                        for (let batch of item.materialBatches) {
                            let myBatch: materials.bo.IMaterialBatchItem = myItem.materialBatches.create();
                            myBatch.batchCode = batch.batchCode;
                            myBatch.quantity = batch.quantity;
                        }
                        // 复制序列
                        for (let serial of item.materialSerials) {
                            let mySerial: materials.bo.IMaterialSerialItem = myItem.materialSerials.create();
                            mySerial.serialCode = serial.serialCode;
                        }
                    }
                    // 复制地址
                    for (let address of document.shippingAddresss) {
                        let myAddress: IShippingAddress = ibas.objects.clone(address);
                        this.shippingAddresss.add(<ShippingAddress>myAddress);
                    }
                }
            }
        }

        /** 销售交货-行 集合 */
        export class SalesDeliveryItems extends ibas.BusinessObjects<SalesDeliveryItem, SalesDelivery> implements ISalesDeliveryItems {

            /** 创建并添加子项 */
            create(): SalesDeliveryItem {
                let item: SalesDeliveryItem = new SalesDeliveryItem();
                this.add(item);
                item.lineStatus = this.parent.documentStatus;
                return item;
            }
        }


        /** 销售交货-行 */
        export class SalesDeliveryItem extends ibas.BODocumentLine<SalesDeliveryItem> implements ISalesDeliveryItem {

            /** 构造函数 */
            constructor() {
                super();
            }

            /** 映射的属性名称-编码 */
            static PROPERTY_DOCENTRY_NAME: string = "DocEntry";
            /** 获取-编码 */
            get docEntry(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_DOCENTRY_NAME);
            }
            /** 设置-编码 */
            set docEntry(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DOCENTRY_NAME, value);
            }

            /** 映射的属性名称-行号 */
            static PROPERTY_LINEID_NAME: string = "LineId";
            /** 获取-行号 */
            get lineId(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_LINEID_NAME);
            }
            /** 设置-行号 */
            set lineId(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_LINEID_NAME, value);
            }

            /** 映射的属性名称-显示顺序 */
            static PROPERTY_VISORDER_NAME: string = "VisOrder";
            /** 获取-显示顺序 */
            get visOrder(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_VISORDER_NAME);
            }
            /** 设置-显示顺序 */
            set visOrder(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_VISORDER_NAME, value);
            }

            /** 映射的属性名称-类型 */
            static PROPERTY_OBJECTCODE_NAME: string = "ObjectCode";
            /** 获取-类型 */
            get objectCode(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_OBJECTCODE_NAME);
            }
            /** 设置-类型 */
            set objectCode(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_OBJECTCODE_NAME, value);
            }

            /** 映射的属性名称-实例号（版本） */
            static PROPERTY_LOGINST_NAME: string = "LogInst";
            /** 获取-实例号（版本） */
            get logInst(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_LOGINST_NAME);
            }
            /** 设置-实例号（版本） */
            set logInst(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_LOGINST_NAME, value);
            }

            /** 映射的属性名称-数据源 */
            static PROPERTY_DATASOURCE_NAME: string = "DataSource";
            /** 获取-数据源 */
            get dataSource(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_DATASOURCE_NAME);
            }
            /** 设置-数据源 */
            set dataSource(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DATASOURCE_NAME, value);
            }

            /** 映射的属性名称-取消 */
            static PROPERTY_CANCELED_NAME: string = "Canceled";
            /** 获取-取消 */
            get canceled(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(SalesDeliveryItem.PROPERTY_CANCELED_NAME);
            }
            /** 设置-取消 */
            set canceled(value: ibas.emYesNo) {
                this.setProperty(SalesDeliveryItem.PROPERTY_CANCELED_NAME, value);
            }

            /** 映射的属性名称-状态 */
            static PROPERTY_STATUS_NAME: string = "Status";
            /** 获取-状态 */
            get status(): ibas.emBOStatus {
                return this.getProperty<ibas.emBOStatus>(SalesDeliveryItem.PROPERTY_STATUS_NAME);
            }
            /** 设置-状态 */
            set status(value: ibas.emBOStatus) {
                this.setProperty(SalesDeliveryItem.PROPERTY_STATUS_NAME, value);
            }

            /** 映射的属性名称-单据状态 */
            static PROPERTY_LINESTATUS_NAME: string = "LineStatus";
            /** 获取-单据状态 */
            get lineStatus(): ibas.emDocumentStatus {
                return this.getProperty<ibas.emDocumentStatus>(SalesDeliveryItem.PROPERTY_LINESTATUS_NAME);
            }
            /** 设置-单据状态 */
            set lineStatus(value: ibas.emDocumentStatus) {
                this.setProperty(SalesDeliveryItem.PROPERTY_LINESTATUS_NAME, value);
            }

            /** 映射的属性名称-创建日期 */
            static PROPERTY_CREATEDATE_NAME: string = "CreateDate";
            /** 获取-创建日期 */
            get createDate(): Date {
                return this.getProperty<Date>(SalesDeliveryItem.PROPERTY_CREATEDATE_NAME);
            }
            /** 设置-创建日期 */
            set createDate(value: Date) {
                this.setProperty(SalesDeliveryItem.PROPERTY_CREATEDATE_NAME, value);
            }

            /** 映射的属性名称-创建时间 */
            static PROPERTY_CREATETIME_NAME: string = "CreateTime";
            /** 获取-创建时间 */
            get createTime(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_CREATETIME_NAME);
            }
            /** 设置-创建时间 */
            set createTime(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_CREATETIME_NAME, value);
            }

            /** 映射的属性名称-修改日期 */
            static PROPERTY_UPDATEDATE_NAME: string = "UpdateDate";
            /** 获取-修改日期 */
            get updateDate(): Date {
                return this.getProperty<Date>(SalesDeliveryItem.PROPERTY_UPDATEDATE_NAME);
            }
            /** 设置-修改日期 */
            set updateDate(value: Date) {
                this.setProperty(SalesDeliveryItem.PROPERTY_UPDATEDATE_NAME, value);
            }

            /** 映射的属性名称-修改时间 */
            static PROPERTY_UPDATETIME_NAME: string = "UpdateTime";
            /** 获取-修改时间 */
            get updateTime(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_UPDATETIME_NAME);
            }
            /** 设置-修改时间 */
            set updateTime(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_UPDATETIME_NAME, value);
            }

            /** 映射的属性名称-创建用户 */
            static PROPERTY_CREATEUSERSIGN_NAME: string = "CreateUserSign";
            /** 获取-创建用户 */
            get createUserSign(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_CREATEUSERSIGN_NAME);
            }
            /** 设置-创建用户 */
            set createUserSign(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_CREATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-修改用户 */
            static PROPERTY_UPDATEUSERSIGN_NAME: string = "UpdateUserSign";
            /** 获取-修改用户 */
            get updateUserSign(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_UPDATEUSERSIGN_NAME);
            }
            /** 设置-修改用户 */
            set updateUserSign(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_UPDATEUSERSIGN_NAME, value);
            }

            /** 映射的属性名称-创建动作标识 */
            static PROPERTY_CREATEACTIONID_NAME: string = "CreateActionId";
            /** 获取-创建动作标识 */
            get createActionId(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_CREATEACTIONID_NAME);
            }
            /** 设置-创建动作标识 */
            set createActionId(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_CREATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-更新动作标识 */
            static PROPERTY_UPDATEACTIONID_NAME: string = "UpdateActionId";
            /** 获取-更新动作标识 */
            get updateActionId(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_UPDATEACTIONID_NAME);
            }
            /** 设置-更新动作标识 */
            set updateActionId(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_UPDATEACTIONID_NAME, value);
            }

            /** 映射的属性名称-参考1 */
            static PROPERTY_REFERENCE1_NAME: string = "Reference1";
            /** 获取-参考1 */
            get reference1(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_REFERENCE1_NAME);
            }
            /** 设置-参考1 */
            set reference1(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_REFERENCE1_NAME, value);
            }

            /** 映射的属性名称-参考2 */
            static PROPERTY_REFERENCE2_NAME: string = "Reference2";
            /** 获取-参考2 */
            get reference2(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_REFERENCE2_NAME);
            }
            /** 设置-参考2 */
            set reference2(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_REFERENCE2_NAME, value);
            }

            /** 映射的属性名称-已引用 */
            static PROPERTY_REFERENCED_NAME: string = "Referenced";
            /** 获取-已引用 */
            get referenced(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(SalesDeliveryItem.PROPERTY_REFERENCED_NAME);
            }
            /** 设置-已引用 */
            set referenced(value: ibas.emYesNo) {
                this.setProperty(SalesDeliveryItem.PROPERTY_REFERENCED_NAME, value);
            }

            /** 映射的属性名称-已删除 */
            static PROPERTY_DELETED_NAME: string = "Deleted";
            /** 获取-已删除 */
            get deleted(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(SalesDeliveryItem.PROPERTY_DELETED_NAME);
            }
            /** 设置-已删除 */
            set deleted(value: ibas.emYesNo) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DELETED_NAME, value);
            }

            /** 映射的属性名称-基于类型 */
            static PROPERTY_BASEDOCUMENTTYPE_NAME: string = "BaseDocumentType";
            /** 获取-基于类型 */
            get baseDocumentType(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_BASEDOCUMENTTYPE_NAME);
            }
            /** 设置-基于类型 */
            set baseDocumentType(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_BASEDOCUMENTTYPE_NAME, value);
            }

            /** 映射的属性名称-基于标识 */
            static PROPERTY_BASEDOCUMENTENTRY_NAME: string = "BaseDocumentEntry";
            /** 获取-基于标识 */
            get baseDocumentEntry(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_BASEDOCUMENTENTRY_NAME);
            }
            /** 设置-基于标识 */
            set baseDocumentEntry(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_BASEDOCUMENTENTRY_NAME, value);
            }

            /** 映射的属性名称-基于行号 */
            static PROPERTY_BASEDOCUMENTLINEID_NAME: string = "BaseDocumentLineId";
            /** 获取-基于行号 */
            get baseDocumentLineId(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_BASEDOCUMENTLINEID_NAME);
            }
            /** 设置-基于行号 */
            set baseDocumentLineId(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_BASEDOCUMENTLINEID_NAME, value);
            }

            /** 映射的属性名称-原始类型 */
            static PROPERTY_ORIGINALDOCUMENTTYPE_NAME: string = "OriginalDocumentType";
            /** 获取-原始类型 */
            get originalDocumentType(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_ORIGINALDOCUMENTTYPE_NAME);
            }
            /** 设置-原始类型 */
            set originalDocumentType(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_ORIGINALDOCUMENTTYPE_NAME, value);
            }

            /** 映射的属性名称-原始标识 */
            static PROPERTY_ORIGINALDOCUMENTENTRY_NAME: string = "OriginalDocumentEntry";
            /** 获取-原始标识 */
            get originalDocumentEntry(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_ORIGINALDOCUMENTENTRY_NAME);
            }
            /** 设置-原始标识 */
            set originalDocumentEntry(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_ORIGINALDOCUMENTENTRY_NAME, value);
            }

            /** 映射的属性名称-原始行号 */
            static PROPERTY_ORIGINALDOCUMENTLINEID_NAME: string = "OriginalDocumentLineId";
            /** 获取-原始行号 */
            get originalDocumentLineId(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_ORIGINALDOCUMENTLINEID_NAME);
            }
            /** 设置-原始行号 */
            set originalDocumentLineId(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_ORIGINALDOCUMENTLINEID_NAME, value);
            }

            /** 映射的属性名称-产品编号 */
            static PROPERTY_ITEMCODE_NAME: string = "ItemCode";
            /** 获取-产品编号 */
            get itemCode(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_ITEMCODE_NAME);
            }
            /** 设置-产品编号 */
            set itemCode(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_ITEMCODE_NAME, value);
            }

            /** 映射的属性名称-产品/服务描述 */
            static PROPERTY_ITEMDESCRIPTION_NAME: string = "ItemDescription";
            /** 获取-产品/服务描述 */
            get itemDescription(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_ITEMDESCRIPTION_NAME);
            }
            /** 设置-产品/服务描述 */
            set itemDescription(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_ITEMDESCRIPTION_NAME, value);
            }

            /** 映射的属性名称-序号管理 */
            static PROPERTY_SERIALMANAGEMENT_NAME: string = "SerialManagement";
            /** 获取-序号管理 */
            get serialManagement(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(SalesDeliveryItem.PROPERTY_SERIALMANAGEMENT_NAME);
            }
            /** 设置-序号管理 */
            set serialManagement(value: ibas.emYesNo) {
                this.setProperty(SalesDeliveryItem.PROPERTY_SERIALMANAGEMENT_NAME, value);
            }

            /** 映射的属性名称-批号管理 */
            static PROPERTY_BATCHMANAGEMENT_NAME: string = "BatchManagement";
            /** 获取-批号管理 */
            get batchManagement(): ibas.emYesNo {
                return this.getProperty<ibas.emYesNo>(SalesDeliveryItem.PROPERTY_BATCHMANAGEMENT_NAME);
            }
            /** 设置-批号管理 */
            set batchManagement(value: ibas.emYesNo) {
                this.setProperty(SalesDeliveryItem.PROPERTY_BATCHMANAGEMENT_NAME, value);
            }

            /** 映射的属性名称-数量 */
            static PROPERTY_QUANTITY_NAME: string = "Quantity";
            /** 获取-数量 */
            get quantity(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_QUANTITY_NAME);
            }
            /** 设置-数量 */
            set quantity(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_QUANTITY_NAME, value);
            }

            /** 映射的属性名称-计量单位 */
            static PROPERTY_UOM_NAME: string = "UOM";
            /** 获取-计量单位 */
            get uom(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_UOM_NAME);
            }
            /** 设置-计量单位 */
            set uom(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_UOM_NAME, value);
            }

            /** 映射的属性名称-仓库 */
            static PROPERTY_WAREHOUSE_NAME: string = "Warehouse";
            /** 获取-仓库 */
            get warehouse(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_WAREHOUSE_NAME);
            }
            /** 设置-仓库 */
            set warehouse(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_WAREHOUSE_NAME, value);
            }

            /** 映射的属性名称-价格 */
            static PROPERTY_PRICE_NAME: string = "Price";
            /** 获取-价格 */
            get price(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_PRICE_NAME);
            }
            /** 设置-价格 */
            set price(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_PRICE_NAME, value);
            }

            /** 映射的属性名称-货币 */
            static PROPERTY_CURRENCY_NAME: string = "Currency";
            /** 获取-货币 */
            get currency(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_CURRENCY_NAME);
            }
            /** 设置-货币 */
            set currency(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_CURRENCY_NAME, value);
            }

            /** 映射的属性名称-汇率 */
            static PROPERTY_RATE_NAME: string = "Rate";
            /** 获取-汇率 */
            get rate(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_RATE_NAME);
            }
            /** 设置-汇率 */
            set rate(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_RATE_NAME, value);
            }

            /** 映射的属性名称-行总计 */
            static PROPERTY_LINETOTAL_NAME: string = "LineTotal";
            /** 获取-行总计 */
            get lineTotal(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_LINETOTAL_NAME);
            }
            /** 设置-行总计 */
            set lineTotal(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_LINETOTAL_NAME, value);
            }

            /** 映射的属性名称-行交货日期 */
            static PROPERTY_DELIVERYDATE_NAME: string = "DeliveryDate";
            /** 获取-行交货日期 */
            get deliveryDate(): Date {
                return this.getProperty<Date>(SalesDeliveryItem.PROPERTY_DELIVERYDATE_NAME);
            }
            /** 设置-行交货日期 */
            set deliveryDate(value: Date) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DELIVERYDATE_NAME, value);
            }

            /** 映射的属性名称-已清数量 */
            static PROPERTY_CLOSEDQUANTITY_NAME: string = "ClosedQuantity";
            /** 获取-已清数量 */
            get closedQuantity(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_CLOSEDQUANTITY_NAME);
            }
            /** 设置-已清数量 */
            set closedQuantity(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_CLOSEDQUANTITY_NAME, value);
            }

            /** 映射的属性名称-行折扣 */
            static PROPERTY_DISCOUNT_NAME: string = "Discount";
            /** 获取-行折扣 */
            get discount(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_DISCOUNT_NAME);
            }
            /** 设置-行折扣 */
            set discount(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DISCOUNT_NAME, value);
            }

            /** 映射的属性名称-已清金额 */
            static PROPERTY_CLOSEDAMOUNT_NAME: string = "ClosedAmount";
            /** 获取-已清金额 */
            get closedAmount(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_CLOSEDAMOUNT_NAME);
            }
            /** 设置-已清金额 */
            set closedAmount(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_CLOSEDAMOUNT_NAME, value);
            }

            /** 映射的属性名称-产品类型 */
            static PROPERTY_TREETYPE_NAME: string = "TreeType";
            /** 获取-产品类型 */
            get treeType(): emProductTreeType {
                return this.getProperty<emProductTreeType>(SalesDeliveryItem.PROPERTY_TREETYPE_NAME);
            }
            /** 设置-产品类型 */
            set treeType(value: emProductTreeType) {
                this.setProperty(SalesDeliveryItem.PROPERTY_TREETYPE_NAME, value);
            }

            /** 映射的属性名称-基础数量 */
            static PROPERTY_BASISQUANTITY_NAME: string = "BasisQuantity";
            /** 获取-基础数量 */
            get basisQuantity(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_BASISQUANTITY_NAME);
            }
            /** 设置-基础数量 */
            set basisQuantity(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_BASISQUANTITY_NAME, value);
            }

            /** 映射的属性名称-行标志号 */
            static PROPERTY_LINESIGN_NAME: string = "LineSign";
            /** 获取-行标志号 */
            get lineSign(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_LINESIGN_NAME);
            }
            /** 设置-行标志号 */
            set lineSign(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_LINESIGN_NAME, value);
            }

            /** 映射的属性名称-父项行标志号 */
            static PROPERTY_PARENTLINESIGN_NAME: string = "ParentLineSign";
            /** 获取-父项行标志号 */
            get parentLineSign(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_PARENTLINESIGN_NAME);
            }
            /** 设置-父项行标志号 */
            set parentLineSign(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_PARENTLINESIGN_NAME, value);
            }

            /** 映射的属性名称-科目代码 */
            static PROPERTY_ACCOUNTCODE_NAME: string = "AccountCode";
            /** 获取-科目代码 */
            get accountCode(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_ACCOUNTCODE_NAME);
            }
            /** 设置-科目代码 */
            set accountCode(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_ACCOUNTCODE_NAME, value);
            }

            /** 映射的属性名称-折扣前价格 */
            static PROPERTY_UNITPRICE_NAME: string = "UnitPrice";
            /** 获取-折扣前价格 */
            get unitPrice(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_UNITPRICE_NAME);
            }
            /** 设置-折扣前价格 */
            set unitPrice(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_UNITPRICE_NAME, value);
            }

            /** 映射的属性名称-税定义 */
            static PROPERTY_TAX_NAME: string = "Tax";
            /** 获取-税定义 */
            get tax(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_TAX_NAME);
            }
            /** 设置-税定义 */
            set tax(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_TAX_NAME, value);
            }

            /** 映射的属性名称-税率 */
            static PROPERTY_TAXRATE_NAME: string = "TaxRate";
            /** 获取-税率 */
            get taxRate(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_TAXRATE_NAME);
            }
            /** 设置-税率 */
            set taxRate(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_TAXRATE_NAME, value);
            }

            /** 映射的属性名称-税总额 */
            static PROPERTY_TAXTOTAL_NAME: string = "TaxTotal";
            /** 获取-税总额 */
            get taxTotal(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_TAXTOTAL_NAME);
            }
            /** 设置-税总额 */
            set taxTotal(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_TAXTOTAL_NAME, value);
            }

            /** 映射的属性名称-毛价 */
            static PROPERTY_GROSSPRICE_NAME: string = "GrossPrice";
            /** 获取-毛价 */
            get grossPrice(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_GROSSPRICE_NAME);
            }
            /** 设置-毛价 */
            set grossPrice(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_GROSSPRICE_NAME, value);
            }

            /** 映射的属性名称-毛总额 */
            static PROPERTY_GROSSTOTAL_NAME: string = "GrossTotal";
            /** 获取-毛总额 */
            get grossTotal(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_GROSSTOTAL_NAME);
            }
            /** 设置-毛总额 */
            set grossTotal(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_GROSSTOTAL_NAME, value);
            }

            /** 映射的属性名称-毛利 */
            static PROPERTY_GROSSPROFIT_NAME: string = "GrossProfit";
            /** 获取-毛利 */
            get grossProfit(): number {
                return this.getProperty<number>(SalesDeliveryItem.PROPERTY_GROSSPROFIT_NAME);
            }
            /** 设置-毛利 */
            set grossProfit(value: number) {
                this.setProperty(SalesDeliveryItem.PROPERTY_GROSSPROFIT_NAME, value);
            }

            /** 映射的属性名称-项目代码 */
            static PROPERTY_PROJECT_NAME: string = "Project";
            /** 获取-项目代码 */
            get project(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_PROJECT_NAME);
            }
            /** 设置-项目代码 */
            set project(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_PROJECT_NAME, value);
            }

            /** 映射的属性名称-分配规则1 */
            static PROPERTY_DISTRIBUTIONRULE1_NAME: string = "DistributionRule1";
            /** 获取-分配规则1 */
            get distributionRule1(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE1_NAME);
            }
            /** 设置-分配规则1 */
            set distributionRule1(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE1_NAME, value);
            }

            /** 映射的属性名称-分配规则2 */
            static PROPERTY_DISTRIBUTIONRULE2_NAME: string = "DistributionRule2";
            /** 获取-分配规则2 */
            get distributionRule2(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE2_NAME);
            }
            /** 设置-分配规则2 */
            set distributionRule2(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE2_NAME, value);
            }

            /** 映射的属性名称-分配规则3 */
            static PROPERTY_DISTRIBUTIONRULE3_NAME: string = "DistributionRule3";
            /** 获取-分配规则3 */
            get distributionRule3(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE3_NAME);
            }
            /** 设置-分配规则3 */
            set distributionRule3(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE3_NAME, value);
            }

            /** 映射的属性名称-分配规则4 */
            static PROPERTY_DISTRIBUTIONRULE4_NAME: string = "DistributionRule4";
            /** 获取-分配规则4 */
            get distributionRule4(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE4_NAME);
            }
            /** 设置-分配规则4 */
            set distributionRule4(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE4_NAME, value);
            }

            /** 映射的属性名称-分配规则5 */
            static PROPERTY_DISTRIBUTIONRULE5_NAME: string = "DistributionRule5";
            /** 获取-分配规则5 */
            get distributionRule5(): string {
                return this.getProperty<string>(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE5_NAME);
            }
            /** 设置-分配规则5 */
            set distributionRule5(value: string) {
                this.setProperty(SalesDeliveryItem.PROPERTY_DISTRIBUTIONRULE5_NAME, value);
            }

            /** 映射的属性名称-物料批次集合 */
            static PROPERTY_MATERIALBATCHES_NAME: string = "MaterialBatches";
            /** 获取-物料批次集合 */
            get materialBatches(): materials.bo.MaterialBatchItems {
                return this.getProperty<materials.bo.MaterialBatchItems>(SalesDeliveryItem.PROPERTY_MATERIALBATCHES_NAME);
            }
            /** 设置-物料批次集合 */
            set materialBatches(value: materials.bo.MaterialBatchItems) {
                this.setProperty(SalesDeliveryItem.PROPERTY_MATERIALBATCHES_NAME, value);
            }

            /** 映射的属性名称-物料序列集合 */
            static PROPERTY_MATERIALSERIALS_NAME: string = "MaterialSerials";
            /** 获取-物料序列集合 */
            get materialSerials(): materials.bo.MaterialSerialItems {
                return this.getProperty<materials.bo.MaterialSerialItems>(SalesDeliveryItem.PROPERTY_MATERIALSERIALS_NAME);
            }
            /** 设置-物料序列集合 */
            set materialSerials(value: materials.bo.MaterialSerialItems) {
                this.setProperty(SalesDeliveryItem.PROPERTY_MATERIALSERIALS_NAME, value);
            }

            /** 初始化数据 */
            protected init(): void {
                this.materialBatches = new materials.bo.MaterialBatchItems(this);
                this.materialSerials = new materials.bo.MaterialSerialItems(this);
                this.currency = ibas.config.get(ibas.CONFIG_ITEM_DEFAULT_CURRENCY);
            }

            protected registerRules(): ibas.IBusinessRule[] {
                return [
                    // 推导 价格 = 折扣前价格 * 折扣
                    new ibas.BusinessRuleMultiplicativeDeduction(
                        SalesDeliveryItem.PROPERTY_DISCOUNT_NAME, SalesDeliveryItem.PROPERTY_UNITPRICE_NAME, SalesDeliveryItem.PROPERTY_PRICE_NAME),
                    // 计算价格 = 折扣前价格 * 折扣
                    new ibas.BusinessRuleMultiplication(
                        SalesDeliveryItem.PROPERTY_PRICE_NAME, SalesDeliveryItem.PROPERTY_UNITPRICE_NAME, SalesDeliveryItem.PROPERTY_DISCOUNT_NAME),
                    // 计算总计 = 数量 * 价格
                    new ibas.BusinessRuleMultiplication(
                        SalesDeliveryItem.PROPERTY_LINETOTAL_NAME, SalesDeliveryItem.PROPERTY_QUANTITY_NAME, SalesDeliveryItem.PROPERTY_PRICE_NAME),
                    // 计算毛价 = 价格 * 税率
                    new ibas.BusinessRuleMultiplication(
                        SalesDeliveryItem.PROPERTY_GROSSPRICE_NAME, SalesDeliveryItem.PROPERTY_PRICE_NAME, SalesDeliveryItem.PROPERTY_TAXRATE_NAME),
                    // 计算毛总额 = 数量 * 毛价
                    new ibas.BusinessRuleMultiplication(
                        SalesDeliveryItem.PROPERTY_GROSSTOTAL_NAME, SalesDeliveryItem.PROPERTY_QUANTITY_NAME, SalesDeliveryItem.PROPERTY_GROSSPRICE_NAME),
                    // 计算税总额 = 毛总额 - 总计
                    new ibas.BusinessRuleSubtraction(
                        SalesDeliveryItem.PROPERTY_TAXTOTAL_NAME, SalesDeliveryItem.PROPERTY_GROSSTOTAL_NAME, SalesDeliveryItem.PROPERTY_LINETOTAL_NAME),
                ];
            }
        }
    }
}
