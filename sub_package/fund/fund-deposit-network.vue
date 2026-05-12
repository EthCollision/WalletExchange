<template>
  <view class="fund-deposit-network">
    <!-- 自定义导航栏 -->
    <custom-navbar 
      title="选择网络" 
      :show-back="true"
      back-path="/sub_package/fund/fund-deposit-coin"
    ></custom-navbar>

    <!-- 网络列表 -->
    <view class="network-list">
      <view 
        class="network-item" 
        v-for="network in networkList" 
        :key="network.code"
        @click="selectNetwork(network)"
      >
        <view class="network-info">
          <view class="network-header">
            <text class="network-code">{{ network.code }}</text>
            <text class="network-name">{{ network.name }}</text>
          </view>
          <text class="network-confirm">{{ network.confirm }}次区块确认</text>
          <text class="network-min">最低充值 >{{ network.minDeposit }} USDT</text>
          <text class="network-time">预计到账时间 ≈ {{ network.estimatedTime }}</text>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="bottom-tip">
      <u-icon name="info-circle" size="32" color="#F59E0B"></u-icon>
      <text class="tip-text">
        当您充值该币种时，请仅限于通过下方币安支持的网络充值。如您通过其他网络充值会造成资金丢失。
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 当前选择的币种
const currentCoin = ref('')

// 网络列表
const networkList = ref([
  {
    code: 'BSC',
    name: 'BNB Smart Chain (BEP20)',
    confirm: 1,
    minDeposit: '0.01',
    estimatedTime: '1分钟'
  },
  {
    code: 'TRX',
    name: 'Tron (TRC20)',
    confirm: 1,
    minDeposit: '0.01',
    estimatedTime: '1分钟'
  },
  {
    code: 'APT',
    name: 'Aptos',
    confirm: 1,
    minDeposit: '0.000001',
    estimatedTime: '1分钟'
  },
  {
    code: 'ETH',
    name: 'Ethereum (ERC20)',
    confirm: 6,
    minDeposit: '0.001',
    estimatedTime: '2分钟'
  },
  {
    code: 'POL',
    name: 'Polygon POS',
    confirm: 1,
    minDeposit: '0.02',
    estimatedTime: '1分钟',
    bundle: true
  },
  {
    code: 'SOL',
    name: 'Solana',
    confirm: 1,
    minDeposit: '0.01',
    estimatedTime: '1分钟'
  },
  {
    code: 'AVAX',
    name: 'Avalanche C-Chain',
    confirm: 1,
    minDeposit: '0.01',
    estimatedTime: '1分钟'
  }
])

// 页面加载
onLoad((options) => {
  if (options.coin) {
    currentCoin.value = options.coin
  }
})

// 选择网络
const selectNetwork = (network) => {
  // 跳转到充值详情页，使用redirectTo替换当前页，这样返回时能回到选择币种页
  uni.redirectTo({
    url: `/sub_package/fund/fund-deposit?coin=${currentCoin.value}&network=${network.code}`
  })
}
</script>

<style scoped lang="scss">
.fund-deposit-network {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.network-list {
  padding: 24rpx 32rpx;
  
  .network-item {
    background-color: #FFFFFF;
    border-radius: 12rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    
    .network-info {
      display: flex;
      flex-direction: column;
      gap: 16rpx;
      
      .network-header {
        display: flex;
        align-items: baseline;
        margin-bottom: 8rpx;
        
        .network-code {
          font-size: 36rpx;
          color: #0B0E11;
          font-weight: 600;
          margin-right: 16rpx;
        }
        
        .network-name {
          font-size: 28rpx;
          color: #707A8A;
        }
      }
      
      .network-confirm,
      .network-min,
      .network-time {
        font-size: 26rpx;
        color: #707A8A;
        line-height: 1.5;
      }
    }
  }
}

.bottom-tip {
  display: flex;
  align-items: flex-start;
  padding: 32rpx;
  background-color: #FFFBEB;
  margin: 24rpx 32rpx;
  border-radius: 12rpx;
  
  .tip-text {
    flex: 1;
    margin-left: 16rpx;
    font-size: 24rpx;
    color: #92400E;
    line-height: 1.6;
  }
}
</style>
