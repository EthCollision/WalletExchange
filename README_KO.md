<p align="center">
  <img alt="logo" width=140" src="./img/logo.png">
</p>
<h4 align="center">오픈소스 암호자산 거래소 앱</h4>
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
  <strong>Language:</strong> <a href="./README_EN.md">English</a> | <a href="./README.md">中文</a> | <a href="./README_JA.md">日本語</a> | 한국어
</p>

> **이 프로젝트는 블록체인 디지털 자산 거래소용 프론트엔드 시스템입니다.**  
> 현물/선물 거래, 입출금, 자금 이체, 시세 구독, K라인 차트, 다국어 지원, 멀티플랫폼 배포를 지원합니다.  
> 거래소 빠른 구축과 2차 개발에 적합하며, 요구사항에 맞춰 모듈 확장 및 백엔드 연동이 가능합니다.

### 앱 화면

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

### 관리자 페이지 화면

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
binance_app (프론트엔드 아키텍처)
    ├── pages                                // 메인 탭 페이지
    │       └── index / market / trade / contract / asset
    ├── sub_package                          // 기능별 서브 패키지
    │       └── login / trade / contract / kline / fund
    │       └── transfer / borrow / bill / asset
    │       └── message / notice / search / setting / customer
    ├── components                           // 비즈니스 컴포넌트
    │       └── custom-kline / custom-depth / custom-trade-order
    │       └── custom-contract-order / custom-contract-position
    │       └── custom-contract-lever / custom-contract-stoploss
    ├── config                               // 설정 계층 (api.js, baseConfig.js)
    ├── utils                                // request, websocket, interceptor, coin, storage
    ├── locale                               // 다국어 (zh-Hans / zh-Hant / English)
    └── uni_modules/vk-uview-ui              // UI 컴포넌트 라이브러리
```

``` 
binance_app (핵심 기능)
    ├── 사용자/계정
    │       └── 회원가입 / 로그인 / 비밀번호 찾기
    │       └── KYC / Google 인증 / 자금 비밀번호 / 보안 설정
    ├── 마켓
    │       └── 현물 / USDT-M 선물 / Coin-M 선물 시세
    │       └── 순위, 검색, 관심종목, WebSocket 실시간 푸시
    ├── 거래 (현물 + 마진)
    │       └── 지정가 / 시장가 / TP-SL, 호가창, 체결, K라인
    ├── 선물 (USDT-M + Coin-M)
    │       └── 진입/청산, 레버리지, 격리/교차, 펀딩비, 포지션 관리
    ├── 자산/자금
    │       └── 입금, 출금, 계정 간 이체, 명세, 자산 개요
    ├── 운영/지원
    │       └── 배너, 공지, 메시지 센터, 고객 지원
    └── 플랫폼 역량
            └── 다국어 + 멀티플랫폼 배포 (H5 / iOS / Android)
```

### 문의

소스 라이선스, 커스텀 개발, 배포, 견적 관련 문의는 아래로 연락해 주세요.

<table align="center">
  <tr>
    <td align="center" valign="top">
      <a href="https://t.me/web3_dev_gg" target="_blank">Telegram 비즈니스 문의 (클릭하여 상담)</a><br/>
      <img alt="Telegram" src="./img/tg.png" width="220" style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 2px;" /><br/>
    </td>
  </tr>
</table>

## FAQ

### 1) 2차 개발이 가능한가요?
네. UI, 거래 플로우, 자산 모듈, 운영 영역, API 연동을 요구사항에 맞게 커스터마이징할 수 있습니다.

### 2) 프론트엔드/백엔드 소스코드가 포함되나요?
네. 라이선스 플랜에 따라 프론트엔드와 백엔드 전체 소스코드 제공이 가능합니다.

### 3) 배포 지원이 가능한가요?
네. 스테이징/운영 배포, 도메인 설정, Nginx 리버스 프록시, 기본 연동 테스트를 지원합니다.

### 4) 다국어 및 멀티플랫폼 배포를 지원하나요?
네. 간체중문, 번체중문, 영어를 지원하며 H5 / iOS / Android 배포가 가능합니다.

### 5) 어떻게 연락하면 되나요?
위 Telegram으로 문의해 주세요. 요구사항, 예산 범위, 희망 일정 공유 시 더 빠르게 안내 가능합니다.

## 면책 조항

본 프로젝트는 디지털 자산 거래 시스템의 기술 데모 및 2차 개발 기반입니다. 투자 자문이나 금융 서비스 제공을 의미하지 않습니다.

- 학습, 기술 검토, 데모 목적에 한해 사용됩니다.
- 암호자산 및 레버리지 거래는 고위험이며, 운영 및 규제 준수 책임은 사용자에게 있습니다.
- 본 프로젝트는 "있는 그대로" 제공되며 가용성, 안정성, 보안성, 수익성을 보장하지 않습니다.
- 사용자 데이터를 수집/처리하는 경우, 사용자는 관련 법률 및 개인정보 규정을 준수해야 합니다.
- 본 프로젝트는 주요 거래소 UX를 참고한 구현이며 Binance 공식 제품이 아니고 제휴/승인 관계가 없습니다.
