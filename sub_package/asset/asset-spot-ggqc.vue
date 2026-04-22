<template>
  <view class="asset-spot-cross">
    <view class="asset-header">
      <view class="asset-title-row">
        <text class="asset-title">总资产余额</text>
        <view class="icon-group">
          <text class="leverage-tag">3X</text>
          <text class="iconfont icon-calculator"></text>
          <text class="iconfont icon-visible"></text>
          <text class="iconfont icon-refresh"></text>
        </view>
      </view>
      <view class="asset-amount-row">
        <text class="amount">0.00</text>
        <text class="currency">USDT</text>
        <text class="iconfont icon-dropdown"></text>
      </view>
      <text class="fiat-amount">≈ $0.00</text>
    </view>
    
    <!-- 资产详情卡片 -->
    <view class="detail-cards-container">
      <view class="detail-cards-row">
        <view class="detail-card">
          <text class="card-label">抵押物价值 (USDT)</text>
          <text class="card-value">0</text>
        </view>
        <view class="detail-card">
          <text class="card-label">质押风险率</text>
          <text class="card-value">999</text>
        </view>
      </view>
      
      <view class="detail-cards-row">
        <view class="detail-card">
          <text class="card-label">总负债 (USDT)</text>
          <text class="card-value">0.00</text>
          <text class="card-fiat">≈ $0.00</text>
        </view>
        <view class="detail-card">
          <text class="card-label">账户权益 (USDT)</text>
          <text class="card-value">0.00</text>
          <text class="card-fiat">≈ $0.00</text>
        </view>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view class="action-btn primary">
        <text>借款</text>
      </view>
      <view class="action-btn">
        <text>还款</text>
      </view>
      <view class="action-btn" @click="goToTransfer">
        <text>划转</text>
      </view>
    </view>
  
    
    <!-- 全仓列表 -->
    <view class="margin-header">
      <text class="margin-title">全仓</text>
      <view class="risk-indicator">
        <text class="iconfont icon-risk"></text>
        <text class="risk-text">风险率 999.00</text>
      </view>
      <text class="iconfont icon-settings"></text>
    </view>
    
    <scroll-view class="margin-list" scroll-y>
      <view class="margin-item">
        <view class="margin-item-header">
          <view class="coin-info">
            <view class="coin-avatar">
              <u-icon name="photo" size="32" color="#C0C4CC"></u-icon>
            </view>
            <text class="coin-symbol">OG</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <text class="margin-amount">0.00</text>
        </view>
        <view class="margin-detail-container">
          <view class="margin-detail-item">
            <text class="detail-label">可用</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="margin-detail-item">
            <text class="detail-label">净资产</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="margin-detail-item">
            <text class="detail-label">已借</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="margin-detail-item">
            <text class="detail-label">利息</text>
            <text class="detail-value">0.00</text>
          </view>
        </view>
      </view>
      
      <view class="margin-item">
        <view class="margin-item-header">
          <view class="coin-info">
            <view class="coin-avatar">
              <image class="coin-icon" src="/static/cat.png" mode="aspectFit"></image>
            </view>
            <text class="coin-symbol">1000CAT</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <text class="margin-amount">0.00</text>
        </view>
        <view class="margin-detail-container">
          <view class="margin-detail-item">
            <text class="detail-label">可用</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="margin-detail-item">
            <text class="detail-label">净资产</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="margin-detail-item">
            <text class="detail-label">已借</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="margin-detail-item">
            <text class="detail-label">利息</text>
            <text class="detail-value">0.00</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { navigateToTransfer } from '@/utils/utils.js'

// 全仓杠杆账户相关逻辑

// 跳转到划转页面
const goToTransfer = () => {
  navigateToTransfer()
}
</script>

<style scoped lang="scss">
.asset-spot-cross {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
}

/* 资产头部 */
.asset-header {
  background-color: #ffffff;
  padding: 24rpx 32rpx;
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

.leverage-tag {
  background: linear-gradient(135deg, #F0B90B 0%, #F8D33A 100%);
  color: #0B0E11;
  font-size: 24rpx;
  font-weight: 600;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
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

/* 详情卡片容器 */
.detail-cards-container {
  background-color: #ffffff;
  padding: 20rpx 32rpx;
}

.detail-cards-row {
  display: flex;
  gap: 32rpx;
  margin-bottom: 10rpx;
}

.detail-cards-row:last-child {
  margin-bottom: 0;
}

.detail-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-label {
  font-size: 24rpx;
  color: #707A8A;
}

.card-value {
  font-size: 32rpx;
  color: #0B0E11;
  font-weight: 600;
}

.card-fiat {
  font-size: 20rpx;
  color: #707A8A;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 32rpx;
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



/* 全仓列表 */
.margin-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  background-color: #ffffff;
}

.margin-title {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.risk-indicator {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.risk-text {
  font-size: 24rpx;
  color: #0ECB81;
}

.margin-list {
  flex: 1;
  background-color: #ffffff;
}

.margin-item {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.margin-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.coin-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
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

.coin-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}

.coin-symbol {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 600;
}

.margin-amount {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 600;
}

.margin-detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx 32rpx;
}

.margin-detail-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.detail-label {
  font-size: 24rpx;
  color: #707A8A;
}

.detail-value {
  font-size: 24rpx;
  color: #0B0E11;
}
</style>
