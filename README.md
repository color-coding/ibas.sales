<div align="center">

# IBAS Sales

**销售管理模块**

IBAS 系统的销售管理模块，提供销售报价、销售订单、销售交货、销售发票、退货、预付款请求、预留发票、产品套装等全流程销售业务管理。

Sales management module for the IBAS system — sales quotes, orders, deliveries, invoices, returns, down payment requests, reserve invoices, and product suits with full sales cycle support.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-1.8+-orange.svg)](https://www.oracle.com/java/)
[![Maven](https://img.shields.io/badge/Maven-3.x-red.svg)](https://maven.apache.org/)
[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](pom.xml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-贡献--contributing)

</div>

---

## 📖 目录 | Table of Contents

- [✨ 特性 | Features](#-特性--features)
- [📦 模块结构 | Modules](#-模块结构--modules)
- [🚀 快速开始 | Quick Start](#-快速开始--quick-start)
- [📋 业务对象 | Business Objects](#-业务对象--business-objects)
- [📚 相关项目 | Related Projects](#-相关项目--related-projects)
- [🤝 贡献 | Contributing](#-贡献--contributing)
- [📄 许可证 | License](#-许可证--license)

---

## ✨ 特性 | Features

- **📋 销售报价** — 销售报价单（Sales Quote），支持额外明细行
- **📦 销售订单** — 销售订单（Sales Order）管理
- **🚚 销售交货** — 销售交货单（Sales Delivery）管理
- **🧾 销售发票** — 销售发票（Sales Invoice）管理
- **↩️ 退货管理** — 销售退货（Sales Return）与退货申请（Sales Return Request）
- **💰 预付款** — 预付款请求（Down Payment Request）管理
- **📄 预留发票** — 预留发票（Sales Reserve Invoice）管理
- **📝 贷项通知单** — 销售贷项通知单（Sales Credit Note）管理
- **📦 产品套装** — 产品套装（Product Suit）与套装明细管理
- **_blanket** — 空白协议（Blanket Agreement）管理
- **📍 收货地址** — 收货地址（Shipping Address）管理

---

## 📦 模块结构 | Modules

| 模块 | 类型 | 说明 |
|------|------|------|
| `ibas.sales` | JAR | **核心模块** — 业务对象定义、仓储层、业务逻辑 |
| `ibas.sales.service` | WAR | **REST 服务** — Jersey 端点（DataService、FileService） |

---

## 🚀 快速开始 | Quick Start

### 环境要求 | Prerequisites

- **JDK** 1.8+
- **Maven** 3.x
- [ibas-framework](https://github.com/color-coding/ibas-framework)（BOBAS 框架）

### 构建 | Build

```bash
# 克隆仓库
git clone https://github.com/color-coding/ibas.sales.git
cd ibas.sales

# 编译全部模块
./compile_packages.sh            # Linux / macOS
compile_packages.bat             # Windows

# 编译单个模块
mvn clean package install -Dmaven.test.skip=true -f ibas.sales/pom.xml

# 运行测试
mvn test -f ibas.sales/pom.xml

# 部署
./deploy_packages.sh
```

### Maven 依赖

```xml
<dependency>
    <groupId>org.colorcoding.apps</groupId>
    <artifactId>ibas.sales</artifactId>
    <version>0.2.0</version>
</dependency>
```

---

## 📋 业务对象 | Business Objects

| 业务对象 | 说明 |
|----------|------|
| `SalesQuote` / `SalesQuoteItem` / `SalesQuoteItemExtra` | 销售报价单 |
| `SalesOrder` / `SalesOrderItem` | 销售订单 |
| `SalesDelivery` | 销售交货 |
| `SalesInvoice` | 销售发票 |
| `SalesReturn` / `SalesReturnRequest` | 销售退货与退货申请 |
| `DownPaymentRequest` / `DownPaymentRequestItem` | 预付款请求 |
| `SalesReserveInvoice` / `SalesReserveInvoiceItem` | 预留发票 |
| `SalesCreditNote` / `SalesCreditNoteItem` | 销售贷项通知单 |
| `ProductSuit` / `ProductSuitItem` | 产品套装 |
| `BlanketAgreement` | 空白协议 |
| `ShippingAddress` | 收货地址 |

---

## 📚 相关项目 | Related Projects

| 项目 | 说明 |
|------|------|
| [ibas-framework](https://github.com/color-coding/ibas-framework) | BOBAS 业务对象框架 |
| [ibas.businesspartner](https://github.com/color-coding/ibas.businesspartner) | 业务伙伴模块 |
| [ibas.materials](https://github.com/color-coding/ibas.materials) | 物料与库存模块 |
| [ibas.receiptpayment](https://github.com/color-coding/ibas.receiptpayment) | 收付款模块 |

---

## 🤝 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 发起 Pull Request

---

## 📄 许可证 | License

本项目基于 [Apache License 2.0](LICENSE) 开源。
---

## 🙏 鸣谢 | Thanks

<div align="center">

**[Color-Coding Studio](http://colorcoding.org/)** · 咔啦工作室

</div>
