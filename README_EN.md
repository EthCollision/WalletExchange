<p align="center">
  <img alt="logo" width=140" src="./img/logo.png">
</p>
<h4 align="center">Open-Source Crypto Exchange App</h4>
<p align="center">
 <img src="https://img.shields.io/badge/-Blockchain%20Exchange-red.svg" alt="badge">
 <img src="https://img.shields.io/badge/-DEX%20Style-5c6bc0.svg" alt="badge">
 <img src="https://img.shields.io/badge/-Binance%20Inspired-purple.svg" alt="badge">
 <img src="https://img.shields.io/badge/-Spot%20Trading-orange.svg" alt="badge">
 <img src="https://img.shields.io/badge/-Futures%20Trading-yellow.svg" alt="badge">
 <img src="https://img.shields.io/badge/-On-chain%20Deposit%2FWithdraw-blue.svg" alt="badge">
 <img src="https://img.shields.io/badge/-Multi-chain%20Assets-09b3af.svg" alt="badge">
 <img src="https://img.shields.io/badge/-Matching%20Engine-3fb27f.svg" alt="badge">
</p>
<p align="center">
  <strong>Language:</strong> English | <a href="./README.md">中文</a> | <a href="./README_JA.md">日本語</a> | <a href="./README_KO.md">한국어</a>
</p>

> **This project is a blockchain digital-asset exchange frontend system**, covering core scenarios such as user-side trading, asset management, and account center.  
> It supports spot/futures trading, deposit & withdrawal, fund transfer, market subscription, K-line charts, multilingual support, and multi-platform release.  
> Suitable for fast exchange setup and secondary development, with flexible module extension and backend integration.

### App Screenshots

<table align="center">
  <tr>
    <td align="center"><img src="./img/en1.png" width="180" alt="en1" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/en2.png" width="180" alt="en2" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/en3.png" width="180" alt="en3" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/en4.png" width="180" alt="en4" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
  </tr>
  <tr>
    <td align="center"><img src="./img/en5.png" width="180" alt="en5" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/en6.png" width="180" alt="en6" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/en7.png" width="180" alt="en7" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/en8.png" width="180" alt="en8" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
  </tr>
</table>

### Admin Panel Screenshots

<table align="center">
  <tr>
    <td align="center"><img src="./img/web1.png" width="300" alt="web1" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/web2.png" width="300" alt="web2" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/web3.png" width="300" alt="web3" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/web7.png" width="300" alt="web7" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
  </tr>
  <tr>
    <td align="center"><img src="./img/web4.png" width="300" alt="web4" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/web5.png" width="300" alt="web5" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/web6.png" width="300" alt="web6" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
    <td align="center"><img src="./img/web8.png" width="300" alt="web8" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /></td>
  </tr>
</table>

``` 
binance_app (Frontend Architecture)
    ├── pages                                // Main package (tab pages)
    │       └── index                        // Home: assets, announcements, operations
    │       └── market                       // Market: pairs, rankings, search entry
    │       └── trade                        // Trading: spot/margin entry
    │       └── contract                     // Futures: USDT-margined / coin-margined
    │       └── asset                        // Asset overview
    ├── sub_package                          // Feature sub-packages
    │       └── login / trade / contract / kline / fund
    │       └── transfer / borrow / bill / asset
    │       └── message / notice / search / setting / customer
    ├── components                           // Business components
    │       └── custom-kline / custom-depth / custom-trade-order
    │       └── custom-contract-order / custom-contract-position
    │       └── custom-contract-lever / custom-contract-stoploss
    │       └── custom-contract-addmargin / custom-home-navbar
    ├── config                               // Config layer (api.js, baseConfig.js)
    ├── utils                                // request, websocket, interceptor, coin, storage
    ├── locale                               // i18n (zh-Hans / zh-Hant / English)
    └── uni_modules/vk-uview-ui              // UI component library
```

``` 
binance_app (Core Features)
    ├── User & Account
    │       └── Register / Login / Password recovery
    │       └── KYC / Google Auth / Fund password / Security settings
    ├── Market
    │       └── Spot / USDT-M futures / Coin-M futures quotes
    │       └── Rankings, search, favorites, realtime websocket push
    ├── Trading (Spot + Margin)
    │       └── Limit / Market / TP-SL orders, orderbook, trades, K-line
    ├── Futures (USDT-M + Coin-M)
    │       └── Open/close, leverage, isolated/cross, funding, positions
    ├── Asset & Funds
    │       └── Deposit, withdrawal, transfer, statements, account overview
    ├── Operations & Support
    │       └── Banners, announcements, message center, customer support
    └── Platform Capabilities
            └── i18n + multi-platform release (H5 / iOS / Android)
```

### Contact

For source licensing, custom development, deployment, and quotation, please contact:

<table align="center">
  <tr>
    <td align="center" valign="top">
      <a href="https://t.me/web3_dev_gg" target="_blank">Telegram Business Contact (Click to Chat)</a><br/>
      <img alt="Telegram" src="./img/tg.png" width="220" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /><br/>
    </td>
  </tr>
</table>

## FAQ

### 1) Do you support secondary development?
Yes. UI, trading flows, asset modules, operation sections, and API integrations can be customized based on your requirements.

### 2) Is full source code included?
Yes, frontend and backend source code can be delivered under a licensing plan, with private deployment support.

### 3) Can you assist with deployment?
Yes. We can help with staging/production deployment, domain setup, Nginx reverse proxy, and integration testing.

### 4) Do you support multi-language and multi-platform release?
Yes. Currently supports Simplified Chinese, Traditional Chinese, and English; release targets include H5, iOS, and Android.

### 5) How can we contact you?
Please use the Telegram contact above. Sharing your requirement scope, budget range, and expected timeline will speed up evaluation.

## Disclaimer

This project is a technical demonstration and secondary-development base for digital asset exchange systems. It does not constitute investment advice or any financial service commitment.

- For learning, technical evaluation, and demonstration purposes only.
- Crypto and leveraged trading involve high risk; all compliance and operational liabilities are borne by the operator.
- Provided "as is" without express or implied warranties of availability, stability, security, or profitability.
- If user data is collected/processed, the operator must comply with applicable local laws and privacy regulations.
- This project is inspired by mainstream exchange UX patterns and is not an official Binance product, nor affiliated/authorized by Binance.
