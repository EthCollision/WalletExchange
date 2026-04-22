<template>
  <view class="fund-deposit-coin">
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

    <!-- 历史记录 -->
    <view class="history-section" v-if="historyCoins.length > 0 && !searchKey">
      <view class="section-header">
        <text class="section-title">历史记录</text>
        <u-icon name="trash" size="40" color="#9CA3AF" @click="clearHistory"></u-icon>
      </view>
      <view class="history-tags">
        <view 
          class="history-tag" 
          v-for="coin in historyCoins" 
          :key="coin"
          @click="selectCoin(coin)"
        >
          {{ coin }}
        </view>
      </view>
    </view>

    <!-- 热门币种 -->
    <view class="hot-section" v-if="!searchKey">
      <text class="section-title">热门</text>
    </view>

    <!-- 币种列表 -->
    <view class="coin-list">
      <view 
        class="coin-item" 
        v-for="coin in filteredCoinList" 
        :key="coin.symbol"
        @click="selectCoin(coin.symbol)"
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
        <view class="coin-right" v-if="coin.tag">
          <view class="coin-tag">{{ coin.tag }}</view>
        </view>
      </view>
    </view>


  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 搜索关键字
const searchKey = ref('')

// 历史记录
const historyCoins = ref(['USDT', 'BNB', 'SUI', 'ETH', 'BTC'])

// 币种列表
const coinList = ref([
  { symbol: 'BTC', name: 'Bitcoin', iconBg: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', iconBg: '#627EEA' },
  { symbol: 'USDT', name: 'TetherUS', iconBg: '#26A17B' },
  { symbol: 'BNB', name: 'BNB', iconBg: '#F0B90B' },
  { symbol: 'OG', name: 'OG', iconBg: '#9333EA' },
  { symbol: '1000CAT', name: '1000*Simons Cat', iconBg: '#EC4899' },
  { symbol: '1000CHEEMS', name: '1000*cheems.pet', iconBg: '#F59E0B' },
  { symbol: '1000PEPPER', name: 'PEPPER', iconBg: '#EF4444', tag: '暂停' },
  { symbol: '1000SATS', name: '1000*SATS (Ordinals)', iconBg: '#F97316' },
  { symbol: '1INCH', name: '1inch', iconBg: '#DC2626' },
  { symbol: 'AAVE', name: 'Aave', iconBg: '#B91C9C' },
  { symbol: 'ACE', name: 'ACE', iconBg: '#7C3AED' },
  { symbol: 'ADA', name: 'Cardano', iconBg: '#0EA5E9' },
])

// 过滤后的币种列表
const filteredCoinList = computed(() => {
  if (!searchKey.value) {
    return coinList.value
  }
  return coinList.value.filter(coin => {
    const key = searchKey.value.toLowerCase()
    return coin.symbol.toLowerCase().includes(key) || 
           coin.name.toLowerCase().includes(key)
  })
})

// 选择币种
const selectCoin = (symbol) => {
  console.log('选择币种:', symbol)
  uni.navigateTo({
    url: `/sub_package/fund/fund-deposit-network?coin=${symbol}`,
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

// 清空历史记录
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空历史记录吗?',
    success: (res) => {
      if (res.confirm) {
        historyCoins.value = []
      }
    }
  })
}


</script>

<style scoped lang="scss">
.fund-deposit-coin {
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

.history-section {
  padding: 32rpx;
  border-bottom: 2rpx solid #F5F5F5;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
  }
  
  .section-title {
    font-size: 28rpx;
    color: #0B0E11;
    font-weight: 500;
  }
  
  .history-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    .history-tag {
      padding: 12rpx 24rpx;
      background-color: #F5F5F5;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #0B0E11;
    }
  }
}

.hot-section {
  padding: 32rpx;
  border-bottom: 2rpx solid #F5F5F5;
  
  .section-title {
    font-size: 28rpx;
    color: #0B0E11;
    font-weight: 500;
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
      .coin-tag {
        padding: 8rpx 16rpx;
        background-color: #FEF3C7;
        border-radius: 4rpx;
        font-size: 24rpx;
        color: #92400E;
      }
    }
  }
}


</style>
