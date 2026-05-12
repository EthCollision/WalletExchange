<template>
  <view class="fund-withdraw-coin">
    <!-- 自定义导航栏 -->
    <custom-navbar 
      title="选择币种" 
      :show-back="true"
      back-path="/pages/asset/asset"
    ></custom-navbar>

    <!-- 搜索框 -->
    <view class="search-box">
      <view class="search-input">
        <u-icon name="search" size="32" color="#9CA3AF"></u-icon>
        <input 
          v-model="searchKey" 
          type="text" 
          placeholder="请输入关键字搜索" 
          placeholder-class="placeholder"
        />
      </view>
    </view>

    <!-- 币种列表表头 -->
    <view class="list-header">
      <text class="header-text">币种列表</text>
      <view class="sort-icon" @click="toggleSort">
        <text class="sort-text">{{ sortType === 'name' ? '名称' : '余额' }}</text>
        <u-icon name="arrow-down" size="24" color="#707A8A"></u-icon>
      </view>
    </view>

    <!-- 币种列表 -->
    <view class="coin-list">
      <view 
        class="coin-item" 
        v-for="coin in filteredCoinList" 
        :key="coin.symbol"
        @click="selectCoin(coin)"
      >
        <view class="coin-left">
          <view class="coin-icon" :style="{ backgroundColor: coin.iconBg || '#F0B90B' }">
            <text class="coin-icon-text">{{ coin.symbol.substring(0, 1) }}</text>
          </view>
          <view class="coin-info">
            <text class="coin-symbol">{{ coin.symbol }}</text>
            <text class="coin-name">{{ coin.name }}</text>
          </view>
        </view>
        <view class="coin-right">
          <text class="coin-amount">{{ coin.amount }}</text>
          <text class="coin-usdt">≈ ${{ coin.usdtValue }}</text>
        </view>
      </view>
    </view>

    <!-- 无数据提示 -->
    <view class="empty-tip" v-if="filteredCoinList.length === 0">
      <text class="empty-text">暂无可提币种</text>
    </view>


  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 搜索关键字
const searchKey = ref('')

// 排序类型: name-按名称, balance-按余额
const sortType = ref('balance')

// 币种列表
const coinList = ref([
  { symbol: 'USDT', name: 'TetherUS', amount: '419.89565131', usdtValue: '419.89', iconBg: '#26A17B' },
  { symbol: 'USDC', name: 'USDC', amount: '0.34682636', usdtValue: '0.347103', iconBg: '#2775CA' },
  { symbol: 'PUMP', name: 'Pump.Fun', amount: '17.98', usdtValue: '0.055720', iconBg: '#F59E0B' },
  { symbol: 'BNB', name: 'BNB', amount: '0.00000328', usdtValue: '0.003003', iconBg: '#F0B90B' },
  { symbol: 'BTC', name: 'Bitcoin', amount: '0.00123', usdtValue: '45.67', iconBg: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', amount: '0.0456', usdtValue: '78.90', iconBg: '#627EEA' },
])

// 切换排序
const toggleSort = () => {
  sortType.value = sortType.value === 'name' ? 'balance' : 'name'
}

// 过滤后的币种列表
const filteredCoinList = computed(() => {
  let list = coinList.value
  
  // 搜索过滤
  if (searchKey.value) {
    const key = searchKey.value.toLowerCase()
    list = list.filter(coin => {
      return coin.symbol.toLowerCase().includes(key) || 
             coin.name.toLowerCase().includes(key)
    })
  }
  
  // 排序
  if (sortType.value === 'name') {
    list = [...list].sort((a, b) => a.symbol.localeCompare(b.symbol))
  } else {
    list = [...list].sort((a, b) => parseFloat(b.usdtValue) - parseFloat(a.usdtValue))
  }
  
  return list
})

// 选择币种
const selectCoin = (coin) => {
  // 检查余额
  if (parseFloat(coin.amount) <= 0) {
    uni.showToast({
      title: '该币种余额不足',
      icon: 'none'
    })
    return
  }
  
  console.log('选择币种:', coin.symbol)
  uni.navigateTo({
    url: `/sub_package/fund/fund-withdraw-network?coin=${coin.symbol}&amount=${coin.amount}`,
    success: () => {
      console.log('跳转成功')
    },
    fail: (err) => {
      console.error('跳转失败:', err)
      uni.showToast({
        title: '跳转失败',
        icon: 'none'
      })
    }
  })
}


</script>

<style scoped lang="scss">
.fund-withdraw-coin {
  min-height: 100vh;
  background-color: #FFFFFF;
  padding-bottom: 32rpx;
}

.search-box {
  padding: 24rpx 32rpx;
  background-color: #F5F5F5;
  
  .search-input {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 8rpx;
    padding: 20rpx 24rpx;
    
    input {
      flex: 1;
      margin-left: 16rpx;
      font-size: 28rpx;
      color: #0B0E11;
    }
    
    .placeholder {
      color: #9CA3AF;
    }
  }
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 2rpx solid #F5F5F5;
  
  .header-text {
    font-size: 28rpx;
    color: #0B0E11;
    font-weight: 500;
  }
  
  .sort-icon {
    display: flex;
    align-items: center;
    gap: 8rpx;
    
    .sort-text {
      font-size: 24rpx;
      color: #707A8A;
    }
  }
}

.coin-list {
  .coin-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx;
    border-bottom: 2rpx solid #F5F5F5;
    
    .coin-left {
      display: flex;
      align-items: center;
      
      .coin-icon {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24rpx;
        
        .coin-icon-text {
          font-size: 28rpx;
          color: #FFFFFF;
          font-weight: 600;
        }
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
      margin-right: 20rpx;
      
      .coin-amount {
        font-size: 28rpx;
        color: #0B0E11;
        font-weight: 500;
        margin-bottom: 8rpx;
      }
      
      .coin-usdt {
        font-size: 24rpx;
        color: #707A8A;
      }
    }
  }
}

.empty-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
  
  .empty-text {
    font-size: 28rpx;
    color: #9CA3AF;
  }
}


</style>
