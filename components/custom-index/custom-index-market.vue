<template>
  <view class="market-section">
    <!-- 标签栏 -->
    <view class="market-tabs">
      <view 
        class="tab-item" 
        v-for="(tab, index) in marketTabs" 
        :key="index"
        :class="{ active: currentMarketTab === index }"
        @click="onMarketTabChange(index)"
      >
        <text class="tab-text" :class="{ active: currentMarketTab === index }">{{ tab }}</text>
      </view>
    </view>

    <!-- 未登录且选中自选时显示登录按钮 -->
    <view v-if="currentMarketTab === 0 && !isLoggedIn" class="login-container">
      <view class="login-btn" @click="handleLogin">
        登录/注册
      </view>
    </view>

    <!-- 已登录或非自选标签时显示正常内容 -->
    <template v-else>
      <!-- 币种类型切换 -->
      <view class="coin-type-tabs">
        <view 
          class="coin-type-item" 
          v-for="(type, index) in coinTypes" 
          :key="index"
          :class="{ active: currentCoinType === index }"
          @click="onCoinTypeChange(index)"
        >
          <text class="coin-type-text" :class="{ active: currentCoinType === index }">{{ type }}</text>
        </view>
      </view>

      <!-- 表头 -->
      <view class="market-header">
        <text class="header-name">名称</text>
        <text class="header-price">最新价</text>
        <text class="header-change">24h涨跌幅</text>
      </view>

      <!-- 币种列表 -->
      <view class="coin-list">
        <view class="coin-item" v-for="(coin, index) in coinList" :key="index" @click="onCoinClick(coin)">
          <view class="coin-name">
            <view class="name-wrapper">
              <text class="name-text">{{ coin.symbol }}</text>
              <u-icon v-if="coin.hot" name="fire-fill" color="#F0B90B" size="16" />
              <text v-if="currentCoinType === 1 && coin.label" class="contract-label">{{ coin.label }}</text>
            </view>
          </view>
          <view class="coin-price">
            <text class="price-value">{{ formatPrice(coin.price) }}</text>
            <text class="price-usd" v-if="currentCoinType === 1">${{ formatPriceUsd(coin.priceUsd) }}</text>
            <text class="price-usd" v-else>${{ formatNumber(coin.price) }}</text>
          </view>
          <view class="coin-change" :class="coin.change >= 0 ? 'positive' : 'negative'">
            <text class="change-text">{{ coin.change >= 0 ? '+' : '' }}{{ Math.abs(coin.change) }}%</text>
          </view>
        </view>
      </view>

      <!-- 查看更多 -->
      <view class="view-more" @click="onViewMore">
        <text class="view-more-text">查看更多</text>
      </view>
    </template>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 登录状态（TODO: 后续从全局状态管理或本地存储获取）
const isLoggedIn = ref(false)

// 行情模块数据
const marketTabs = ref(['自选', '热门', '新币上线', '涨幅榜', '跌幅榜','市值'])
const currentMarketTab = ref(1) // 默认选中"热门"
const coinTypes = ref(['币种', '合约'])
const currentCoinType = ref(0) // 默认选中"币种"

// 币种数据
const spotCoinList = ref([
  { symbol: 'BNB', price: 1101.70, change: -10.52, hot: true },
  { symbol: 'BTC', price: 110905.70, change: 2.30, hot: true },
  { symbol: 'ETH', price: 4025.71, change: 10.89, hot: true },
  { symbol: 'ZBT', price: 0.3296, change: -4.88, hot: false },
  { symbol: 'SOL', price: 191.14, change: -0.07, hot: false }
])

// 合约数据
const contractCoinList = ref([
  { symbol: 'BTCUSDT', label: '永续', price: 88990.3, priceUsd: 88990.30, change: -1.39, hot: false },
  { symbol: 'ETHUSDT', label: '永续', price: 3095.52, priceUsd: 3095.52, change: -0.72, hot: false },
  { symbol: 'ZECUSDT', label: '永续', price: 414.40, priceUsd: 414.40, change: -5.60, hot: false },
  { symbol: 'SOLUSDT', label: '永续', price: 130.69, priceUsd: 130.6900, change: -1.82, hot: false },
  { symbol: 'BNBUSDT', label: '永续', price: 884.96, priceUsd: 884.960, change: -1.36, hot: false }
])

// 计算当前显示的币种列表
const coinList = computed(() => {
  return currentCoinType.value === 0 ? spotCoinList.value : contractCoinList.value
})

// 格式化数字
const formatNumber = (num) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 格式化价格（主价格显示）
const formatPrice = (num) => {
  if (currentCoinType.value === 1) {
    // 合约价格使用逗号分隔，保留一位小数
    return num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 格式化USD价格（灰色小字）
const formatPriceUsd = (num) => {
  // 保留两位小数，但去除末尾多余的0
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

// 行情标签切换
const onMarketTabChange = (index) => {
  currentMarketTab.value = index
  console.log('切换行情标签:', marketTabs.value[index])
}

// 币种类型切换
const onCoinTypeChange = (index) => {
  currentCoinType.value = index
  console.log('切换币种类型:', coinTypes.value[index])
}

// 币种点击
const onCoinClick = (coin) => {
  console.log('点击币种:', coin.symbol)
  uni.$u?.toast?.(coin.symbol)
}

// 查看更多
const onViewMore = () => {
  console.log('查看更多')
  uni.$u?.toast?.('查看更多')
}

// 登录按钮点击
const handleLogin = () => {
  uni.navigateTo({
    url: '/sub_package/login/login'
  })
}
</script>

<style scoped lang="scss">
/* 行情模块 */
.market-section {
  padding: 24rpx 32rpx;
  background-color: #ffffff;
  margin: 16rpx;
  border-radius: 16rpx;
}

/* 标签栏 */
.market-tabs {
  display: flex;
  gap: 32rpx;
  margin-bottom: 24rpx;
  overflow-x: auto;
  white-space: nowrap;
}
.tab-item {
  flex-shrink: 0;
}
.tab-text {
  font-size: 28rpx;
  color: #707A8A;
  font-weight: 400;
  &.active {
    color: #0B0E11;
    font-weight: 600;
  }
}

/* 币种类型切换 */
.coin-type-tabs {
  display: flex;
  gap: 32rpx;
  margin-bottom: 24rpx;
}
.coin-type-item {
  padding: 8rpx 0;
  position: relative;
}
.coin-type-text {
  font-size: 28rpx;
  color: #707A8A;
  &.active {
    color: #0B0E11;
    font-weight: 600;
  }
}
.coin-type-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background-color: #F0B90B;
  border-radius: 2rpx;
}

/* 表头 */
.market-header {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  font-size: 24rpx;
  color: #B7BDC6;
}
.header-name {
  flex: 1;
}
.header-price {
  flex: 1;
  text-align: right;
  padding-right: 32rpx;
}
.header-change {
  width: 160rpx;
  text-align: right;
}

/* 币种列表 */
.coin-list {
  margin-bottom: 20rpx;
}
.coin-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.coin-name {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.name-wrapper {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.name-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}
.contract-label {
  font-size: 22rpx;
  color: #17b26a;
  background-color: rgba(23, 178, 106, 0.1);
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  margin-left: 8rpx;
}
.coin-price {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 32rpx;
}
.price-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
  margin-bottom: 4rpx;
}
.price-usd {
  font-size: 24rpx;
  color: #B7BDC6;
}
.coin-change {
  width: 160rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}
.change-text {
  width: 140rpx;
  text-align: center;
  padding: 12rpx 0;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #FFFFFF;
}
.coin-change.positive .change-text {
  background-color: #17b26a;
}
.coin-change.negative .change-text {
  background-color: #f6465d;
}

/* 查看更多 */
.view-more {
  text-align: center;
  padding: 24rpx 0;
}
.view-more-text {
  font-size: 28rpx;
  color: #F0B90B;
}

/* 未登录状态 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80rpx 0;
}

.login-btn {
  padding: 24rpx 80rpx;
  background: linear-gradient(90deg, #FCD535 0%, #F7B731 100%);
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
  text-align: center;
}
</style>
