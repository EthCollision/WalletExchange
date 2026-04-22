<template>
  <view class="asset-total">
    <!-- 总资产区域 -->
    <view class="asset-header">
      <view class="asset-title-row">
        <text class="asset-label">预估总资产</text>
        <u-icon name="eye" size="24" color="#707A8A" />
        <image src="/static/icon/asset/zd.png" mode="widthFix" style="width: 30rpx; margin-left: auto;" @click="goToHistory" />
      </view>
      <view class="asset-amount-row">
        <text class="asset-amount">2,043.61</text>
        <text class="asset-unit">USDT</text>
      </view>
      <text class="asset-usd">≈ $2,043.61</text>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view class="action-btn primary" @click="showDepositModal">
        <text class="btn-text">添加资金</text>
      </view>
      <view class="action-btn" @click="goToWithdraw">
        <text class="btn-text">转出</text>
      </view>
      <view class="action-btn" @click="goToTransfer">
        <text class="btn-text">划转</text>
      </view>
    </view>

    <!-- 标签页 -->
    <view class="tabs">
      <view class="tab-wrapper">
        <view 
          class="tab-item" 
          v-for="(tab, index) in tabs" 
          :key="index"
          :class="{ active: currentTab === index }"
          @click="onTabChange(index)"
        >
          <text class="tab-text" :class="{ active: currentTab === index }">{{ tab }}</text>
          <view class="tab-underline" v-if="currentTab === index"></view>
        </view>
      </view>
    </view>

    <!-- 币种列表 -->
    <view class="coin-list-container" v-if="currentTab === 0">
      <scroll-view scroll-y class="coin-list-scroll">
        <view class="coin-list">
          <view class="coin-item" v-for="(coin, index) in assetList" :key="index">
            <view class="coin-left">
              <view class="coin-icon">
                <view class="icon-wrapper" :style="{ backgroundColor: coin.color }">
                  <text class="icon-text">{{ coin.symbol.substring(0, 1) }}</text>
                </view>
              </view>
              <view class="coin-details">
                <text class="symbol">{{ coin.symbol }}</text>
                <text class="full-name">{{ coin.fullName }}</text>
              </view>
            </view>
            <view class="coin-right">
              <text class="balance-value">{{ coin.balance }}</text>
              <text class="balance-usd" v-if="coin.balanceUsd">{{ coin.balanceUsd }}</text>
              <view class="coin-actions">
                <view class="action-tag">
                  <text class="action-text">交易</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 账户列表 -->
    <view class="account-list-container" v-if="currentTab === 1">
      <scroll-view scroll-y class="account-list-scroll">
        <view class="account-list">
          <view class="account-item" v-for="(account, index) in accountList" :key="index">
            <text class="account-name">{{ account.name }}</text>
            <view class="account-balance">
              <text class="balance-amount">{{ account.balance }}</text>
              <text class="balance-usd">${{ account.balanceUsd }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 设置弹出层 -->
    <u-popup v-model="showSetting" mode="bottom" border-radius="20">
      <view class="setting-popup">
        <view class="setting-item" @click="toggleHideSmallAssets">
          <view class="checkbox" :class="{ checked: hideSmallAssets }">
            <u-icon v-if="hideSmallAssets" name="checkbox-mark" size="14" color="#ffffff" />
          </view>
          <text class="setting-text">隐藏不足1美元的资产</text>
        </view>
      </view>
    </u-popup>

    <!-- 充值方式弹窗 -->
    <deposit-method-modal v-model="depositModalShow" @select="handleDepositMethodSelect" />

    <!-- 提现方式弹窗 -->
    <withdraw-method-modal v-model="withdrawModalShow" @select="handleWithdrawMethodSelect" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { navigateToTransfer } from '@/utils/utils.js'
import DepositMethodModal from '@/components/deposit-method-modal/deposit-method-modal.vue'
import WithdrawMethodModal from '@/components/withdraw-method-modal/withdraw-method-modal.vue'

// 标签页
const tabs = ref(['币种', '账户'])
const currentTab = ref(0)

// 设置弹出层
const showSetting = ref(false)
const hideSmallAssets = ref(false)

// 充值弹窗
const depositModalShow = ref(false)
const withdrawModalShow = ref(false)

// 资产列表数据
const assetList = ref([
  {
    symbol: 'BNB',
    fullName: 'BNB',
    balance: '1.00970586',
    balanceUsd: '922.10 USDT',
    color: '#F0B90B'
  },
  {
    symbol: 'USDT',
    fullName: 'TetherUS',
    balance: '587.23414956',
    balanceUsd: '',
    color: '#26A17B'
  },
  {
    symbol: 'SOL',
    fullName: 'Solana',
    balance: '3.03759115',
    balanceUsd: '398.16 USDT',
    color: '#9945FF'
  },
  {
    symbol: '币安人生',
    fullName: '币安人生',
    balance: '999.9',
    balanceUsd: '138.13 USDT',
    color: '#F0B90B'
  }
])

// 账户列表数据
const accountList = ref([
  {
    name: '理财',
    balance: '1,380.20 USDT',
    balanceUsd: '1,380.2'
  },
  {
    name: '资金',
    balance: '520.29 USDT',
    balanceUsd: '520.29'
  },
  {
    name: 'Alpha',
    balance: '138.64 USDT',
    balanceUsd: '138.64'
  }
])

// 标签页切换
const onTabChange = (index) => {
  currentTab.value = index
}

// 跳转到历史账单
const goToHistory = () => {
  // uni.navigateTo({
  //   url: '/pages/asset/history'
  // })
}


// 切换隐藏小额资产
const toggleHideSmallAssets = () => {
  hideSmallAssets.value = !hideSmallAssets.value
}

// 跳转到划转页面
const goToTransfer = () => {
  navigateToTransfer()
}

// 跳转到提币页面
const goToWithdraw = () => {
  withdrawModalShow.value = true
}

// 显示充值弹窗
const showDepositModal = () => {
  depositModalShow.value = true
}

// 处理充值方式选择
const handleDepositMethodSelect = (method) => {
  console.log('选择了充值方式:', method)
}

// 处理提现方式选择
const handleWithdrawMethodSelect = (method) => {
  console.log('选择了提现方式:', method)
}
</script>

<style scoped lang="scss">
.asset-total {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
}

/* 总资产区域 */
.asset-header {
  flex-shrink: 0;
  padding: 32rpx 32rpx 0 32rpx;
  background-color: #ffffff;
}

.asset-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.asset-label {
  font-size: 28rpx;
  color: #707A8A;
}

.asset-amount-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.asset-amount {
  font-size: 48rpx;
  font-weight: 700;
  color: #0B0E11;
}

.asset-unit {
  font-size: 32rpx;
  color: #0B0E11;
  font-weight: 500;
}

.asset-usd {
  font-size: 28rpx;
  color: #707A8A;
  margin-bottom: 16rpx;
  display: block;
}

.asset-profit-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.profit-label {
  font-size: 28rpx;
  color: #707A8A;
}

.profit-value {
  font-size: 28rpx;
  font-weight: 500;
}

.profit-value.positive {
  color: #17b26a;
}

.profit-value.negative {
  color: #f6465d;
}

/* 操作按钮 */
.action-buttons {
  flex-shrink: 0;
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 14rpx 0;
  background-color: #ffffff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid #E5E7EB;
}

.action-btn.primary {
  background-color: #F0B90B;
  border-color: #F0B90B;
}

.action-btn.primary .btn-text {
  color: #ffffff;
  font-weight: 600;
}

.btn-text {
  font-size: 28rpx;
  color: #0B0E11;
}

/* 标签页 */
.tabs {
  flex-shrink: 0;
  background-color: #ffffff;
  border-bottom: 1rpx solid #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 32rpx;
}

.tab-wrapper {
  display: flex;
  padding: 0 32rpx;
  gap: 48rpx;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 20rpx 0;
  position: relative;
}

.tab-text {
  font-size: 32rpx;
  color: #707A8A;
  font-weight: 400;
}

.tab-text.active {
  color: #0B0E11;
  font-weight: 600;
}

.tab-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48rpx;
  height: 6rpx;
  background-color: #F0B90B;
  border-radius: 3rpx;
}

.tab-setting-icon {
  flex-shrink: 0;
}

/* 账户列表容器 */
.account-list-container {
  flex: 1;
  overflow: hidden;
}

.account-list-scroll {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
}

.account-list {
  padding: 0 32rpx;
}

.account-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.account-name {
  font-size: 32rpx;
  font-weight: 400;
  color: #0B0E11;
}

.account-balance {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.balance-amount {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

/* 币种列表容器 */
.coin-list-container {
  flex: 1;
  overflow: hidden;
}

.coin-list-scroll {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
}

.coin-list {
  padding: 0 32rpx;
}

.coin-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 32rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.coin-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}

.coin-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.symbol {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.full-name {
  font-size: 24rpx;
  color: #707A8A;
}

.coin-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.balance-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.balance-usd {
  font-size: 24rpx;
  color: #707A8A;
  margin-bottom: 8rpx;
}

.coin-actions {
  display: flex;
  gap: 16rpx;
}

.action-tag {
  padding: 0rpx 16rpx;
  background-color: #F5F5F5;
  border-radius: 4rpx;
}

.action-text {
  font-size: 24rpx;
  color: #707A8A;
}

/* 设置弹出层 */
.setting-popup {
  padding: 40rpx 32rpx;
  background-color: #ffffff;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 0;
  cursor: pointer;
  user-select: none;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #D1D5DB;
  border-radius: 4rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.checkbox.checked {
  background-color: #0B0E11;
  border-color: #0B0E11;
}

.setting-text {
  font-size: 28rpx;
  color: #0B0E11;
  line-height: 1;
}
</style>
