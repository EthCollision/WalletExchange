<template>
  <view class="fund-withdraw-network">
    <!-- 自定义导航栏 -->
    <custom-navbar 
      title="选择网络" 
      :show-back="true"
      back-path="/sub_package/fund/fund-withdraw-coin"
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
          <view class="network-detail">
            <text class="detail-item">手续费 {{ network.fee }} USDT (≈ ${{ network.feeUsd }})</text>
            <text class="detail-item">最小提现金额{{ network.minWithdraw }} USDT</text>
            <text class="detail-item">到账时间 ≈ {{ network.estimatedTime }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="bottom-tip">
      <u-icon name="info-circle" size="32" color="#F59E0B"></u-icon>
      <text class="tip-text">
        确保您选择的充币网络与您在币安提币平台使用的网络一致,否则资产可能会丢失。
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 当前选择的币种
const currentCoin = ref('')
const currentAmount = ref('')

// 网络列表
const networkList = ref([
  {
    code: 'BSC',
    name: 'BNB Smart Chain (BEP20)',
    fee: '0.01',
    feeUsd: '0.009999',
    minWithdraw: '10',
    estimatedTime: '1分钟'
  },
  {
    code: 'OPBNB',
    name: 'opBNB',
    fee: '0.015',
    feeUsd: '0.014999',
    minWithdraw: '10',
    estimatedTime: '3分钟'
  },
  {
    code: 'TRX',
    name: 'Tron (TRC20)',
    fee: '1.00',
    feeUsd: '0.999999',
    minWithdraw: '10',
    estimatedTime: '1分钟'
  },
  {
    code: 'APT',
    name: 'Aptos',
    fee: '0.02',
    feeUsd: '0.019999',
    minWithdraw: '10',
    estimatedTime: '1分钟'
  },
  {
    code: 'ETH',
    name: 'Ethereum (ERC20)',
    fee: '1.00',
    feeUsd: '0.999999',
    minWithdraw: '10',
    estimatedTime: '2分钟'
  }
])

// 页面加载
onLoad((options) => {
  if (options.coin) {
    currentCoin.value = options.coin
  }
  if (options.amount) {
    currentAmount.value = options.amount
  }
})

// 选择网络
const selectNetwork = (network) => {
  // 跳转到提币详情页，使用redirectTo替换当前页，这样返回时能回到选择币种页
  uni.redirectTo({
    url: `/sub_package/fund/fund-withdraw?coin=${currentCoin.value}&network=${network.code}&amount=${currentAmount.value}&fee=${network.fee}`
  })
}
</script>

<style scoped lang="scss">
.fund-withdraw-network {
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
      
      .network-detail {
        display: flex;
        flex-direction: column;
        gap: 12rpx;
        
        .detail-item {
          font-size: 26rpx;
          color: #707A8A;
          line-height: 1.5;
        }
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
