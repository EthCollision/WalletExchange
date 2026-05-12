<template>
  <view class="asset-contract-bbw">
    <view class="asset-header">
      <view class="asset-title-row">
        <text class="asset-title">保证金余额</text>
        <view class="icon-group">
          <text class="iconfont icon-camera"></text>
          <text class="iconfont icon-transfer"></text>
          <text class="iconfont icon-visible"></text>
        </view>
      </view>
      <view class="asset-amount-row">
        <text class="amount">411.93</text>
        <text class="currency">USDT</text>
        <text class="iconfont icon-dropdown"></text>
      </view>
      <text class="fiat-amount">≈ $411.61</text>
    </view>
    
    <!-- 资产详情卡片 -->
    <view class="detail-cards-container">
      <view class="detail-cards-row">
        <view class="detail-card">
          <text class="card-label">钱包余额 (USDT)</text>
          <text class="card-value">411.92</text>
          <text class="card-fiat">≈ $411.61</text>
        </view>
        <view class="detail-card">
          <text class="card-label">未实现盈亏 (USDT)</text>
          <text class="card-value">0</text>
          <text class="card-fiat">≈ $0.003693</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-btn primary">
          <text>交易</text>
        </view>
        <view class="action-btn">
          <text>兑换</text>
        </view>
        <view class="action-btn" @click="goToTransfer">
          <text>划转</text>
        </view>
      </view>
    </view>
    
    <!-- 持仓列表区域 -->
    <view class="position-section">
      <view class="position-tabs">
        <view 
          class="position-tab" 
          v-for="(tab, index) in positionTabs" 
          :key="index"
          :class="{ active: currentPositionTab === index }"
          @click="onPositionTabChange(index)"
        >
          <text class="position-tab-text" :class="{ active: currentPositionTab === index }">{{ tab }}</text>
        </view>
      </view>
      
      <!-- 持仓列表 -->
      <scroll-view class="position-list" scroll-y v-if="currentPositionTab === 0">
        <view class="position-item" v-for="(position, index) in positions" :key="index">
          <view class="position-header">
            <view class="position-title">
              <text class="position-badge" :class="position.type">{{ position.type === 'buy' ? '买' : '卖' }}</text>
              <text class="position-pair">{{ position.pair }}</text>
              <text class="position-type">永续</text>
              <text class="position-leverage">{{ position.marginType }} {{ position.leverage }}</text>
              <text class="iconfont icon-menu"></text>
            </view>
            <text class="iconfont icon-share"></text>
          </view>
          
          <view class="position-detail-row-2">
            <view class="position-detail-item">
              <text class="detail-label">未实现盈亏 ({{ position.pnlCoin }})</text>
              <text class="detail-value" :class="{ profit: position.pnl.startsWith('+'), loss: position.pnl.startsWith('-') }">{{ position.pnl }}</text>
            </view>
            <view class="position-detail-item">
              <text class="detail-label">投资回报率</text>
              <text class="detail-value" :class="{ profit: position.roi.startsWith('+'), loss: position.roi.startsWith('-') }">{{ position.roi }}</text>
            </view>
          </view>
          
          <view class="position-detail-row-3">
            <view class="position-detail-item">
              <text class="detail-label">数量 ({{ position.amountCoin }})</text>
              <text class="detail-value">{{ position.amount }}</text>
            </view>
            <view class="position-detail-item">
              <text class="detail-label">保证金 ({{ position.marginCoin }})</text>
              <text class="detail-value">{{ position.margin }}</text>
            </view>
            <view class="position-detail-item">
              <text class="detail-label">保证金比率</text>
              <text class="detail-value" :class="{ profit: parseFloat(position.marginRatio) > 0 }">{{ position.marginRatio }}</text>
            </view>
          </view>
          
          <view class="position-detail-row-3">
            <view class="position-detail-item">
              <text class="detail-label">开仓价格 (USD)</text>
              <text class="detail-value">{{ position.entryPrice }}</text>
            </view>
            <view class="position-detail-item">
              <text class="detail-label">标记价格 (USD)</text>
              <text class="detail-value">{{ position.markPrice }}</text>
            </view>
            <view class="position-detail-item">
              <text class="detail-label">强平价格 (USD)</text>
              <text class="detail-value">{{ position.liqPrice }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
      
      <!-- 全部资产列表 -->
      <scroll-view class="all-assets-list" scroll-y v-if="currentPositionTab === 1">
        <view class="asset-item" v-for="(asset, index) in allAssets" :key="index">
          <view class="asset-coin-header">
            <view class="asset-coin">
              <view class="coin-icon-wrapper">
                <text class="coin-icon-text">{{ asset.icon }}</text>
              </view>
              <text class="coin-name">{{ asset.coin }}</text>
            </view>
          </view>
          
          <view class="asset-detail-grid">
            <view class="asset-detail-item">
              <text class="asset-label">钱包余额</text>
              <text class="asset-value">{{ asset.walletBalance }}</text>
            </view>
            <view class="asset-detail-item">
              <text class="asset-label">未实现盈亏</text>
              <text class="asset-value">{{ asset.unrealizedPnl }}</text>
            </view>
          </view>
          
          <view class="asset-detail-grid">
            <view class="asset-detail-item">
              <text class="asset-label">保证金余额</text>
              <text class="asset-value">{{ asset.marginBalance }}</text>
            </view>
            <view class="asset-detail-item">
              <text class="asset-label">可转</text>
              <text class="asset-value">{{ asset.transferable }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { navigateToTransfer } from '@/utils/utils.js'

// 持仓Tab
const positionTabs = ref(['持有仓位', '全部资产'])
const currentPositionTab = ref(0)

// 持仓数据
const positions = ref([
  {
    pair: 'SOLUSD CM',
    type: 'buy',
    leverage: '20X',
    marginType: '全仓',
    pnl: '+0.0000',
    pnlCoin: 'SOL',
    roi: '+0.74%',
    amount: '1',
    amountCoin: '张',
    margin: '0.0037',
    marginCoin: 'SOL',
    marginRatio: '0.02%',
    entryPrice: '135.41',
    markPrice: '135.460',
    liqPrice: '3.246'
  }
])

// 全部资产数据
const allAssets = ref([
  {
    coin: 'SOL',
    icon: '◎',
    walletBalance: '3.03762976',
    unrealizedPnl: '0.00002725',
    marginBalance: '3.03765701',
    transferable: '3.03396589'
  },
  {
    coin: 'AAVE',
    icon: 'Ⓐ',
    walletBalance: '0.00000000',
    unrealizedPnl: '0.00000000',
    marginBalance: '0.00000000',
    transferable: '0.00000000'
  },
  {
    coin: 'ADA',
    icon: '₳',
    walletBalance: '0.00000000',
    unrealizedPnl: '0.00000000',
    marginBalance: '0.00000000',
    transferable: '0.00000000'
  }
])

// 持仓Tab切换
const onPositionTabChange = (index) => {
  currentPositionTab.value = index
  console.log('切换持仓Tab:', positionTabs.value[index])
}

// 跳转到划转页面
const goToTransfer = () => {
  navigateToTransfer()
}
</script>

<style scoped lang="scss">
.asset-contract-bbw {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
}

/* 资产头部 */
.asset-header {
  background-color: #ffffff;
  padding: 24rpx 32rpx 10rpx;
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

/* 空状态 */
.position-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
}

.position-tabs {
  display: flex;
  border-bottom: 1rpx solid #F5F5F5;
  padding: 0 32rpx;
  flex-shrink: 0;
}

.position-tab {
  padding: 24rpx 0;
  margin-right: 48rpx;
  position: relative;
}

.position-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background-color: #F0B90B;
}

.position-tab-text {
  font-size: 28rpx;
  color: #707A8A;
  font-weight: 400;
}

.position-tab-text.active {
  color: #0B0E11;
  font-weight: 600;
}

.position-list {
  flex: 1;
  overflow-y: auto;
}

.position-item {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.position-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.position-badge {
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  font-size: 20rpx;
  font-weight: 600;
}

.position-badge.buy {
  background-color: #0ECB81;
  color: #ffffff;
}

.position-badge.sell {
  background-color: #F6465D;
  color: #ffffff;
}

.position-pair {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 600;
}

.position-type {
  font-size: 24rpx;
  color: #707A8A;
}

.position-leverage {
  padding: 4rpx 8rpx;
  background-color: #FFF8E1;
  color: #F0B90B;
  font-size: 20rpx;
  border-radius: 4rpx;
}

.position-detail-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32rpx;
  margin-bottom: 12rpx;
}

.position-detail-row-2 .position-detail-item:first-child {
  align-items: flex-start;
}

.position-detail-row-2 .position-detail-item:last-child {
  align-items: flex-end;
}

.position-detail-row-2 .position-detail-item:last-child .detail-label,
.position-detail-row-2 .position-detail-item:last-child .detail-value {
  text-align: right;
}

.position-detail-row-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.position-detail-row-3 .position-detail-item:nth-child(1),
.position-detail-row-3 .position-detail-item:nth-child(2) {
  align-items: flex-start;
}

.position-detail-row-3 .position-detail-item:nth-child(3) {
  align-items: flex-end;
}

.position-detail-row-3 .position-detail-item:nth-child(3) .detail-label,
.position-detail-row-3 .position-detail-item:nth-child(3) .detail-value {
  text-align: right;
}

.position-detail-row-3:last-child {
  margin-bottom: 0;
}

.position-detail-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.position-detail-item .detail-label {
  font-size: 24rpx;
  color: #707A8A;
}

.position-detail-item .detail-value {
  font-size: 24rpx;
  color: #0B0E11;
}

.position-detail-item .detail-value.profit {
  color: #0ECB81;
}

.position-detail-item .detail-value.loss {
  color: #F6465D;
}

.all-assets-list {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
}

.asset-item {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.asset-coin-header {
  margin-bottom: 16rpx;
}

.asset-coin {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.coin-icon-wrapper {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #F7931A 0%, #F2A900 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin-icon-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 600;
}

.coin-name {
  font-size: 32rpx;
  color: #0B0E11;
  font-weight: 600;
}

.asset-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32rpx;
  margin-bottom: 12rpx;
}

.asset-detail-grid:last-child {
  margin-bottom: 0;
}

.asset-detail-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.asset-label {
  font-size: 24rpx;
  color: #707A8A;
}

.asset-value {
  font-size: 24rpx;
  color: #0B0E11;
  font-weight: 500;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #707A8A;
}
</style>
