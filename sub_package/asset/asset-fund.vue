<template>
  <view class="asset-fund">
    <!-- 预估总资产 -->
    <view class="total-asset">
      <view class="asset-header">
        <view class="asset-title">
          <text class="title-text">预估总资产</text>
          <u-icon name="eye" size="32" color="#707A8A" style="margin-left: 16rpx;"></u-icon>
        </view>
        <view class="history-icon">
          <image src="/static/icon/asset/zd.png" mode="widthFix" style="width: 30rpx; margin-left: auto;"  />
        </view>
      </view>
      
      <view class="asset-amount">
        <view class="amount-main">
          <text class="amount-value">520.29</text>
          <view class="currency-selector">
            <text class="currency-text">USDT</text>
            <u-icon name="arrow-down" size="24" color="#0B0E11"></u-icon>
          </view>
        </view>
        <text class="amount-usd">≈ $520.29</text>
      </view>
    
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view class="action-btn primary" @click="showDepositModal">
        <text class="btn-text">添加资金</text>
      </view>
      <view class="action-btn" @click="withdraw">
        <text class="btn-text">转出</text>
      </view>
      <view class="action-btn" @click="transfer">
        <text class="btn-text">划转</text>
      </view>
    </view>

    <!-- 选择充值方式弹窗 -->
    <deposit-method-modal v-model="depositModalShow" @select="handleDepositMethodSelect" />

    <!-- 币种列表 -->
    <view class="coin-list">
      <view class="list-header">
        <text class="header-title">资产</text>
        <view class="header-icons">
          <u-icon name="search" size="40" color="#707A8A" style="margin-right: 24rpx;"></u-icon>
          <u-icon name="scan" size="40" color="#707A8A"></u-icon>
        </view>
      </view>

      <view class="coin-item" v-for="coin in coinList" :key="coin.symbol" @click="goToCoinDetail(coin)">
        <view class="coin-left">
          <view class="coin-icon">
            <u-icon name="photo" size="64" color="#E5E7EB"></u-icon>
          </view>
          <view class="coin-info">
            <text class="coin-symbol">{{ coin.symbol }}</text>
            <text class="coin-name">{{ coin.name }}</text>
          </view>
        </view>
        <view class="coin-right">
          <view class="amount-info">
            <text class="coin-amount">{{ coin.amount }}</text>
            <text class="coin-usd-value">{{ coin.usdValue }}</text>
          </view>
          <view v-if="coin.todayProfit" class="coin-profit">
            <text class="profit-label">今日盈亏</text>
            <text class="profit-value" :class="coin.todayProfit > 0 ? 'profit-up' : 'profit-down'">
              {{ coin.todayProfit > 0 ? '+' : '' }}{{ coin.todayProfit }} USDT ({{ coin.todayProfitRate }}%)
            </text>
          </view>
        </view>
      </view>
    </view>

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

// 弹窗显示状态
const depositModalShow = ref(false)
const withdrawModalShow = ref(false)

// 币种列表数据
const coinList = ref([
  {
    symbol: 'USDT',
    name: 'TetherUS',
    icon: '/static/coins/usdt.png',
    amount: '519.89565131',
    usdValue: '519.89565131',
    todayProfit: null,
    todayProfitRate: null
  },
  {
    symbol: 'USDC',
    name: 'USDC',
    icon: '/static/coins/usdc.png',
    amount: '0.3467859',
    usdValue: '0.34709801',
    todayProfit: null,
    todayProfitRate: null
  },
  {
    symbol: 'PUMP',
    name: 'Pump.Fun',
    icon: '/static/coins/pump.png',
    amount: '17.98',
    usdValue: '0.05404788',
    todayProfit: 0.00208568,
    todayProfitRate: '+4.01'
  }
])

// 显示充值方式弹窗
const showDepositModal = () => {
  depositModalShow.value = true
}

// 处理充值方式选择（可选，组件内部已有默认处理）
const handleDepositMethodSelect = (method) => {
  console.log('选择了充值方式:', method)
  // 如果需要自定义处理逻辑，可以在这里添加
}

// 处理提现方式选择
const handleWithdrawMethodSelect = (method) => {
  console.log('选择了提现方式:', method)
}

// 转出
const withdraw = () => {
  withdrawModalShow.value = true
}

// 划转
const transfer = () => {
  navigateToTransfer()
}

// 小额兑换
const goToExchange = () => {
  console.log('小额兑换')
}

// 显示盈亏详情
const showProfitDetail = () => {
  console.log('显示盈亏详情')
}

// 币种详情
const goToCoinDetail = (coin) => {
  console.log('币种详情', coin)
}
</script>

<style scoped lang="scss">
.asset-fund {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  overflow-y: auto;
}

// 总资产区域
.total-asset {
  background-color: #ffffff;
  padding: 32rpx;
  
  .asset-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .asset-title {
      display: flex;
      align-items: center;
      
      .title-text {
        font-size: 28rpx;
        color: #707A8A;
      }
    }
  }
  
  .asset-amount {
    margin-bottom: 4rpx;
    
    .amount-main {
      display: flex;
      align-items: baseline;
      margin-bottom: 8rpx;
      
      .amount-value {
        font-size: 50rpx;
        font-weight: 600;
        color: #0B0E11;
        line-height: 1.2;
      }
      
      .currency-selector {
        display: flex;
        align-items: center;
        margin-left: 16rpx;
        
        .currency-text {
          font-size: 28rpx;
          color: #0B0E11;
          margin-right: 8rpx;
        }
      }
    }
    
    .amount-usd {
      font-size: 28rpx;
      color: #707A8A;
    }
  }
  
  .daily-profit {
    display: flex;
    align-items: center;
    padding: 16rpx 0;
    
    .profit-label {
      font-size: 28rpx;
      color: #707A8A;
      margin-right: 16rpx;
    }
    
    .profit-value {
      flex: 1;
      font-size: 28rpx;
      color: #0B0E11;
    }
  }
}

// 操作按钮区
.action-buttons {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 32rpx;
  background-color: #FFFFFF;
  
  .action-btn {
    flex: 1;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    
    .btn-text {
      font-size: 28rpx;
      color: #0B0E11;
      font-weight: 500;
    }
    
    &.primary {
      background-color: #F0B90B;
      
      .btn-text {
        color: #0B0E11;
      }
    }
  }
}


// 币种列表
.coin-list {
  flex: 1;
  background-color: #ffffff;
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid #F5F5F5;
    
    .header-title {
      font-size: 28rpx;
      color: #0B0E11;
      font-weight: 500;
    }
    
    .header-icons {
      display: flex;
      align-items: center;
    }
  }
  
  .coin-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx;
    border-bottom: 1rpx solid #F5F5F5;
    
    .coin-left {
      display: flex;
      align-items: center;
      
      .coin-icon {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-right: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #F5F5F5;
      }
      
      .coin-info {
        display: flex;
        flex-direction: column;
        
        .coin-symbol {
          font-size: 32rpx;
          color: #0B0E11;
          font-weight: 500;
          margin-bottom: 8rpx;
        }
        
        .coin-name {
          font-size: 24rpx;
          color: #707A8A;
        }
      }
    }
    
    .coin-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      
      .amount-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-bottom: 8rpx;
        
        .coin-amount {
          font-size: 32rpx;
          color: #0B0E11;
          font-weight: 500;
          margin-bottom: 4rpx;
        }
        
        .coin-usd-value {
          font-size: 24rpx;
          color: #707A8A;
        }
      }
      
      .coin-profit {
        display: flex;
        align-items: center;
        
        .profit-label {
          font-size: 24rpx;
          color: #707A8A;
          margin-right: 8rpx;
        }
        
        .profit-value {
          font-size: 24rpx;
          
          &.profit-up {
            color: #0ECB81;
          }
          
          &.profit-down {
            color: #F6465D;
          }
        }
      }
    }
  }
}
</style>
