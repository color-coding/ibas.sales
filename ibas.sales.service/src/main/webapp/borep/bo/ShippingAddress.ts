/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    emYesNo,
    emDocumentStatus,
    emBOStatus,
    emApprovalStatus,
    BusinessObject,
    BusinessObjects,
    BOMasterData,
    BOMasterDataLine,
    BODocument,
    BODocumentLine,
    BOSimple,
    BOSimpleLine,
    config,
    IBODocument,
} from "ibas/index";
import {
    IShippingAddress,
    IShippingAddresss,
    BO_CODE_SHIPPINGADDRESS,
    emShippingStatus,
} from "../../api/index";

/** 送货地址 */
export class ShippingAddress extends BOSimple<ShippingAddress> implements IShippingAddress {

    /** 业务对象编码 */
    static BUSINESS_OBJECT_CODE: string = BO_CODE_SHIPPINGADDRESS;
    /** 构造函数 */
    constructor() {
        super();
    }
    /** 映射的属性名称-基于类型 */
    static PROPERTY_BASEDOCUMENTTYPE_NAME: string = "BaseDocumentType";
    /** 获取-基于类型 */
    get baseDocumentType(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_BASEDOCUMENTTYPE_NAME);
    }
    /** 设置-基于类型 */
    set baseDocumentType(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_BASEDOCUMENTTYPE_NAME, value);
    }

    /** 映射的属性名称-基于标识 */
    static PROPERTY_BASEDOCUMENTENTRY_NAME: string = "BaseDocumentEntry";
    /** 获取-基于标识 */
    get baseDocumentEntry(): number {
        return this.getProperty<number>(ShippingAddress.PROPERTY_BASEDOCUMENTENTRY_NAME);
    }
    /** 设置-基于标识 */
    set baseDocumentEntry(value: number) {
        this.setProperty(ShippingAddress.PROPERTY_BASEDOCUMENTENTRY_NAME, value);
    }

    /** 映射的属性名称-名称 */
    static PROPERTY_NAME_NAME: string = "Name";
    /** 获取-名称 */
    get name(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_NAME_NAME);
    }
    /** 设置-名称 */
    set name(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_NAME_NAME, value);
    }

    /** 映射的属性名称-顺序 */
    static PROPERTY_ORDER_NAME: string = "Order";
    /** 获取-顺序 */
    get order(): number {
        return this.getProperty<number>(ShippingAddress.PROPERTY_ORDER_NAME);
    }
    /** 设置-顺序 */
    set order(value: number) {
        this.setProperty(ShippingAddress.PROPERTY_ORDER_NAME, value);
    }

    /** 映射的属性名称-送货状态 */
    static PROPERTY_SHIPPINGSTATUS_NAME: string = "ShippingStatus";
    /** 获取-送货状态 */
    get shippingStatus(): emShippingStatus {
        return this.getProperty<emShippingStatus>(ShippingAddress.PROPERTY_SHIPPINGSTATUS_NAME);
    }
    /** 设置-送货状态 */
    set shippingStatus(value: emShippingStatus) {
        this.setProperty(ShippingAddress.PROPERTY_SHIPPINGSTATUS_NAME, value);
    }

    /** 映射的属性名称-收货人 */
    static PROPERTY_CONSIGNEE_NAME: string = "Consignee";
    /** 获取-收货人 */
    get consignee(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_CONSIGNEE_NAME);
    }
    /** 设置-收货人 */
    set consignee(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_CONSIGNEE_NAME, value);
    }

    /** 映射的属性名称-街道 */
    static PROPERTY_STREET_NAME: string = "Street";
    /** 获取-街道 */
    get street(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_STREET_NAME);
    }
    /** 设置-街道 */
    set street(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_STREET_NAME, value);
    }

    /** 映射的属性名称-县/区 */
    static PROPERTY_DISTRICT_NAME: string = "District";
    /** 获取-县/区 */
    get district(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_DISTRICT_NAME);
    }
    /** 设置-县/区 */
    set district(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_DISTRICT_NAME, value);
    }

    /** 映射的属性名称-市 */
    static PROPERTY_CITY_NAME: string = "City";
    /** 获取-市 */
    get city(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_CITY_NAME);
    }
    /** 设置-市 */
    set city(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_CITY_NAME, value);
    }

    /** 映射的属性名称-省 */
    static PROPERTY_PROVINCE_NAME: string = "Province";
    /** 获取-省 */
    get province(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_PROVINCE_NAME);
    }
    /** 设置-省 */
    set province(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_PROVINCE_NAME, value);
    }

    /** 映射的属性名称-国 */
    static PROPERTY_COUNTRY_NAME: string = "Country";
    /** 获取-国 */
    get country(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_COUNTRY_NAME);
    }
    /** 设置-国 */
    set country(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_COUNTRY_NAME, value);
    }

    /** 映射的属性名称-邮编 */
    static PROPERTY_ZIPCODE_NAME: string = "ZipCode";
    /** 获取-邮编 */
    get zipCode(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_ZIPCODE_NAME);
    }
    /** 设置-邮编 */
    set zipCode(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_ZIPCODE_NAME, value);
    }

    /** 映射的属性名称-联系电话 */
    static PROPERTY_MOBILEPHONE_NAME: string = "MobilePhone";
    /** 获取-联系电话 */
    get mobilePhone(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_MOBILEPHONE_NAME);
    }
    /** 设置-联系电话 */
    set mobilePhone(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_MOBILEPHONE_NAME, value);
    }

    /** 映射的属性名称-电话  */
    static PROPERTY_TELEPHONE_NAME: string = "Telephone";
    /** 获取-电话  */
    get telephone(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_TELEPHONE_NAME);
    }
    /** 设置-电话  */
    set telephone(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_TELEPHONE_NAME, value);
    }

    /** 映射的属性名称-备注 1 */
    static PROPERTY_REMARK1_NAME: string = "Remark1";
    /** 获取-备注 1 */
    get remark1(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_REMARK1_NAME);
    }
    /** 设置-备注 1 */
    set remark1(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_REMARK1_NAME, value);
    }

    /** 映射的属性名称-备注 2 */
    static PROPERTY_REMARK2_NAME: string = "Remark2";
    /** 获取-备注 2 */
    get remark2(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_REMARK2_NAME);
    }
    /** 设置-备注 2 */
    set remark2(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_REMARK2_NAME, value);
    }

    /** 映射的属性名称-对象编号 */
    static PROPERTY_OBJECTKEY_NAME: string = "ObjectKey";
    /** 获取-对象编号 */
    get objectKey(): number {
        return this.getProperty<number>(ShippingAddress.PROPERTY_OBJECTKEY_NAME);
    }
    /** 设置-对象编号 */
    set objectKey(value: number) {
        this.setProperty(ShippingAddress.PROPERTY_OBJECTKEY_NAME, value);
    }

    /** 映射的属性名称-对象类型 */
    static PROPERTY_OBJECTCODE_NAME: string = "ObjectCode";
    /** 获取-对象类型 */
    get objectCode(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_OBJECTCODE_NAME);
    }
    /** 设置-对象类型 */
    set objectCode(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_OBJECTCODE_NAME, value);
    }

    /** 映射的属性名称-创建日期 */
    static PROPERTY_CREATEDATE_NAME: string = "CreateDate";
    /** 获取-创建日期 */
    get createDate(): Date {
        return this.getProperty<Date>(ShippingAddress.PROPERTY_CREATEDATE_NAME);
    }
    /** 设置-创建日期 */
    set createDate(value: Date) {
        this.setProperty(ShippingAddress.PROPERTY_CREATEDATE_NAME, value);
    }

    /** 映射的属性名称-创建时间 */
    static PROPERTY_CREATETIME_NAME: string = "CreateTime";
    /** 获取-创建时间 */
    get createTime(): number {
        return this.getProperty<number>(ShippingAddress.PROPERTY_CREATETIME_NAME);
    }
    /** 设置-创建时间 */
    set createTime(value: number) {
        this.setProperty(ShippingAddress.PROPERTY_CREATETIME_NAME, value);
    }

    /** 映射的属性名称-修改日期 */
    static PROPERTY_UPDATEDATE_NAME: string = "UpdateDate";
    /** 获取-修改日期 */
    get updateDate(): Date {
        return this.getProperty<Date>(ShippingAddress.PROPERTY_UPDATEDATE_NAME);
    }
    /** 设置-修改日期 */
    set updateDate(value: Date) {
        this.setProperty(ShippingAddress.PROPERTY_UPDATEDATE_NAME, value);
    }

    /** 映射的属性名称-修改时间 */
    static PROPERTY_UPDATETIME_NAME: string = "UpdateTime";
    /** 获取-修改时间 */
    get updateTime(): number {
        return this.getProperty<number>(ShippingAddress.PROPERTY_UPDATETIME_NAME);
    }
    /** 设置-修改时间 */
    set updateTime(value: number) {
        this.setProperty(ShippingAddress.PROPERTY_UPDATETIME_NAME, value);
    }

    /** 映射的属性名称-实例号（版本） */
    static PROPERTY_LOGINST_NAME: string = "LogInst";
    /** 获取-实例号（版本） */
    get logInst(): number {
        return this.getProperty<number>(ShippingAddress.PROPERTY_LOGINST_NAME);
    }
    /** 设置-实例号（版本） */
    set logInst(value: number) {
        this.setProperty(ShippingAddress.PROPERTY_LOGINST_NAME, value);
    }

    /** 映射的属性名称-服务系列 */
    static PROPERTY_SERIES_NAME: string = "Series";
    /** 获取-服务系列 */
    get series(): number {
        return this.getProperty<number>(ShippingAddress.PROPERTY_SERIES_NAME);
    }
    /** 设置-服务系列 */
    set series(value: number) {
        this.setProperty(ShippingAddress.PROPERTY_SERIES_NAME, value);
    }

    /** 映射的属性名称-数据源 */
    static PROPERTY_DATASOURCE_NAME: string = "DataSource";
    /** 获取-数据源 */
    get dataSource(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_DATASOURCE_NAME);
    }
    /** 设置-数据源 */
    set dataSource(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_DATASOURCE_NAME, value);
    }

    /** 映射的属性名称-创建用户 */
    static PROPERTY_CREATEUSERSIGN_NAME: string = "CreateUserSign";
    /** 获取-创建用户 */
    get createUserSign(): number {
        return this.getProperty<number>(ShippingAddress.PROPERTY_CREATEUSERSIGN_NAME);
    }
    /** 设置-创建用户 */
    set createUserSign(value: number) {
        this.setProperty(ShippingAddress.PROPERTY_CREATEUSERSIGN_NAME, value);
    }

    /** 映射的属性名称-修改用户 */
    static PROPERTY_UPDATEUSERSIGN_NAME: string = "UpdateUserSign";
    /** 获取-修改用户 */
    get updateUserSign(): number {
        return this.getProperty<number>(ShippingAddress.PROPERTY_UPDATEUSERSIGN_NAME);
    }
    /** 设置-修改用户 */
    set updateUserSign(value: number) {
        this.setProperty(ShippingAddress.PROPERTY_UPDATEUSERSIGN_NAME, value);
    }

    /** 映射的属性名称-创建动作标识 */
    static PROPERTY_CREATEACTIONID_NAME: string = "CreateActionId";
    /** 获取-创建动作标识 */
    get createActionId(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_CREATEACTIONID_NAME);
    }
    /** 设置-创建动作标识 */
    set createActionId(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_CREATEACTIONID_NAME, value);
    }

    /** 映射的属性名称-更新动作标识 */
    static PROPERTY_UPDATEACTIONID_NAME: string = "UpdateActionId";
    /** 获取-更新动作标识 */
    get updateActionId(): string {
        return this.getProperty<string>(ShippingAddress.PROPERTY_UPDATEACTIONID_NAME);
    }
    /** 设置-更新动作标识 */
    set updateActionId(value: string) {
        this.setProperty(ShippingAddress.PROPERTY_UPDATEACTIONID_NAME, value);
    }



    /** 初始化数据 */
    protected init(): void {
        this.objectCode = config.applyVariables(ShippingAddress.BUSINESS_OBJECT_CODE);
        this.shippingStatus = emShippingStatus.WAITING;
    }
}


/** 送货地址 集合 */
export class ShippingAddresss extends BusinessObjects<ShippingAddress, IBODocument> implements IShippingAddresss {

    /** 创建并添加子项 */
    create(): ShippingAddress {
        let item: ShippingAddress = new ShippingAddress();
        this.add(item);
        return item;
    }

    /** 添加子项后 子项属性赋值 */
    protected afterAdd(item: ShippingAddress): void {
        super.afterAdd(item);
        item.baseDocumentEntry = this.parent.docEntry;
    }

    /** 主表属性发生变化后 子项属性赋值  */
    protected onParentPropertyChanged(name: string): void {
        super.onParentPropertyChanged(name);
    }
}
