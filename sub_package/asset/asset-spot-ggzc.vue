<template>
  <view class="asset-spot-isolated">
    <view class="asset-header">
      <view class="asset-title-row">
        <text class="asset-title">总资产余额</text>
        <view class="icon-group">
          <text class="usage-tag">启用:0/15</text>
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
    </view>
    
    <!-- 逐仓列表标题 -->
    <view class="isolated-header">
      <text class="isolated-title">逐仓</text>
      <text class="iconfont icon-settings"></text>
    </view>
    
    <!-- 逐仓交易对列表 -->
    <scroll-view class="isolated-list" scroll-y>
      <view class="isolated-item">
        <view class="isolated-item-header">
          <view class="pair-info">
            <text class="pair-name">OG/USDC</text>
            <text class="leverage-badge">5x</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <view class="risk-info">
            <text class="iconfont icon-risk"></text>
            <text class="risk-value">风险率 999.00</text>
          </view>
        </view>
        
        <view class="isolated-detail-grid">
          <view class="isolated-detail-item">
            <text class="detail-label">OG 资产</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="isolated-detail-item">
            <text class="detail-label">OG 已借</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="isolated-detail-item">
            <text class="detail-label">OG 净资产</text>
            <text class="detail-value">0.00</text>
          </view>
        </view>
        
        <view class="isolated-detail-grid">
          <view class="isolated-detail-item">
            <text class="detail-label">USDC 资产</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="isolated-detail-item">
            <text class="detail-label">USDC 已借</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="isolated-detail-item">
            <text class="detail-label">USDC 净资产</text>
            <text class="detail-value">0.00</text>
          </view>
        </view>
      </view>
      
      <view class="isolated-item">
        <view class="isolated-item-header">
          <view class="pair-info">
            <text class="pair-name">OG/USDT</text>
            <text class="leverage-badge">5x</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <view class="risk-info">
            <text class="iconfont icon-risk"></text>
            <text class="risk-value">风险率 999.00</text>
          </view>
        </view>
        
        <view class="isolated-detail-grid">
          <view class="isolated-detail-item">
            <text class="detail-label">OG 资产</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="isolated-detail-item">
            <text class="detail-label">OG 已借</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="isolated-detail-item">
            <text class="detail-label">OG 净资产</text>
            <text class="detail-value">0.00</text>
          </view>
        </view>
        
        <view class="isolated-detail-grid">
          <view class="isolated-detail-item">
            <text class="detail-label">USDT 资产</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="isolated-detail-item">
            <text class="detail-label">USDT 已借</text>
            <text class="detail-value">0.00</text>
          </view>
          <view class="isolated-detail-item">
            <text class="detail-label">USDT 净资产</text>
            <text class="detail-value">0.00</text>
          </view>
        </view>
      </view>
      
      <view class="isolated-item">
        <view class="isolated-item-header">
          <view class="pair-info">
            <text class="pair-name">1000CAT/USDC</text>
            <text class="leverage-badge">5x</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <view class="risk-info">
            <text class="iconfont icon-risk"></text>
            <text class="risk-value">风险率 999.00</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { navigateToTransfer } from '@/utils/utils.js'

// 逐仓杠杆账户相关逻辑

// 跳转到划转页面
const goToTransfer = () => {
  navigateToTransfer()
}
</script>

<style scoped lang="scss">
.asset-spot-isolated {
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

.usage-tag {
  background-color: #FFF8E1;
  color: #F0B90B;
  font-size: 24rpx;
  font-weight: 500;
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
  margin-bottom: 20rpx;
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

/* 逐仓列表 */
.isolated-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background-color: #ffffff;
}

.isolated-title {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.isolated-list {
  flex: 1;
  background-color: #ffffff;
}

.isolated-item {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.isolated-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.pair-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.pair-name {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 600;
}

.leverage-badge {
  background-color: #F5F5F5;
  color: #707A8A;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
}

.risk-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.risk-value {
  font-size: 24rpx;
  color: #0ECB81;
}

.isolated-detail-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.isolated-detail-item {
  flex: 1;
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
