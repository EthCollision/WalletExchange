<template>
  <view class="asset-spot-regular">
    <view class="asset-header">
      <view class="asset-title-row">
        <text class="asset-title">预估总资产</text>
        <view class="icon-group">
          <text class="iconfont icon-visible"></text>
          <text class="iconfont icon-refresh"></text>
        </view>
      </view>
      <view class="asset-amount-row">
        <text class="amount">0.00298329</text>
        <text class="currency">USDT</text>
        <text class="iconfont icon-dropdown"></text>
      </view>
      <text class="fiat-amount">≈ $0.00298329</text>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view class="action-btn primary" @click="showDepositModal">
        <text>添加资金</text>
      </view>
      <view class="action-btn" @click="goToWithdraw">
        <text>转出</text>
      </view>
      <view class="action-btn" @click="goToTransfer">
        <text>划转</text>
      </view>
    </view>
    

    <!-- 资产列表 -->
    <view class="asset-list-header">
      <text class="list-title">资产</text>
      <view class="list-icons">
        <text class="iconfont icon-search"></text>
        <text class="iconfont icon-settings"></text>
      </view>
    </view>
    
    <scroll-view class="asset-list" scroll-y>
      <!-- BNB币种 -->
      <view class="asset-item">
        <view class="asset-item-left">
          <view class="coin-avatar">
            <u-icon name="photo" size="32" color="#999"></u-icon>
          </view>
          <view class="coin-info">
            <view class="coin-name-row">
              <text class="coin-name">BNB</text>
              <text class="iconfont icon-gift"></text>
              <text class="hold-text">持币生息</text>
              <text class="iconfont icon-arrow-right"></text>
            </view>
            <text class="coin-fullname">BNB</text>
            <text class="detail-label">今日盈亏</text>
            <text class="detail-label">平均买入价</text>
          </view>
        </view>
        <view class="asset-item-right">
          <text class="coin-amount">0.00000328</text>
          <text class="coin-value">0.00297788 USDT</text>
          <text class="detail-value negative">-0.00000433 USDT (-0.15%)</text>
          <text class="detail-value">622.72 USDT</text>
        </view>
      </view>
      
      <!-- USDC币种 -->
      <view class="asset-item">
        <view class="asset-item-left">
          <view class="coin-avatar">
            <u-icon name="photo" size="32" color="#999"></u-icon>
          </view>
          <view class="coin-info">
            <view class="coin-name-row">
              <text class="coin-name">USDC</text>
            </view>
            <text class="coin-fullname">USDC</text>
          </view>
        </view>
        <view class="asset-item-right">
          <text class="coin-amount">0.00004046</text>
          <text class="coin-value">0.0000405 USDT</text>
        </view>
      </view>
    </scroll-view>

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

// 现货账户相关逻辑

// 充值弹窗
const depositModalShow = ref(false)
const withdrawModalShow = ref(false)

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
.asset-spot-regular {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
}

/* 资产头部 */
.asset-header {
  background-color: #ffffff;
  padding: 22rpx;
}

.asset-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.asset-title {
  font-size: 28rpx;
  color: #707A8A;
}

.icon-group {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.iconfont {
  font-size: 32rpx;
  color: #707A8A;
}

.asset-amount-row {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.amount {
  font-size: 40rpx;
  color: #0B0E11;
  font-weight: 600;
}

.currency {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.fiat-amount {
  font-size: 24rpx;
  color: #707A8A;
  margin-bottom: 16rpx;
}

.profit-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.profit-text {
  font-size: 24rpx;
  color: #707A8A;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16rpx;
  padding: 0rpx 32rpx 20rpx 32rpx;
  background-color: #ffffff;
}

.action-btn {
  flex: 1;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.action-btn.primary {
  background-color: #F0B90B;
  color: #0B0E11;
}

/* 资产列表头部 */
.asset-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background-color: #ffffff;
}

.list-title {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.list-icons {
  display: flex;
  gap: 24rpx;
}

/* 资产列表 */
.asset-list {
  flex: 1;
  background-color: #ffffff;
}

.asset-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.asset-item-left {
  display: flex;
  gap: 16rpx;
  flex: 1;
}

.coin-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background-color: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.coin-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.coin-name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.coin-name {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 600;
}

.hold-text {
  font-size: 20rpx;
  color: #F0B90B;
}

.coin-fullname {
  font-size: 24rpx;
  color: #707A8A;
  margin-bottom: 4rpx;
}

.detail-label {
  font-size: 24rpx;
  color: #707A8A;
  line-height: 36rpx;
}

.asset-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.coin-amount {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 600;
}

.coin-value {
  font-size: 24rpx;
  color: #707A8A;
  margin-bottom: 4rpx;
}

.detail-value {
  font-size: 24rpx;
  color: #0B0E11;
  text-align: right;
  line-height: 36rpx;
}

.detail-value.negative {
  color: #F6465D;
}
</style>
