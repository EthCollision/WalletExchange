<template>
  <view class="market-container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="goToSearch">
        <u-icon name="search" size="18" color="#B7BDC6" />
        <text class="search-placeholder">搜索币种/币对/合约</text>
      </view>
    </view>

    <!-- 主标签页导航 -->
    <view class="main-tabs">
      <scroll-view scroll-x class="main-tabs-scroll" show-scrollbar="false">
        <view class="main-tabs-wrapper">
          <view 
            class="main-tab-item" 
            v-for="(tab, index) in mainTabs" 
            :key="index"
            :class="{ active: currentMainTab === index }"
            @click="onMainTabChange(index)"
          >
            <text class="main-tab-text" :class="{ active: currentMainTab === index }">{{ tab }}</text>
            <view class="main-tab-underline" v-if="currentMainTab === index"></view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 表头 -->
    <view class="table-header">
      <view class="header-col header-name">
        <text class="header-text">名称</text>
        <text class="header-text">/</text>
        <text class="header-text">成交额</text>
      </view>
      <view class="header-col header-price">
        <text class="header-text">最新价</text>
      </view>
      <view class="header-col header-change">
        <text class="header-text">24h涨跌幅</text>
      </view>
    </view>

    <!-- 币种列表 -->
    <view class="coin-list-container">
      <!-- 自选标签页且未登录时显示登录按钮 -->
      <view v-if="currentMainTab === 0 && !isLoggedIn" class="login-container">
        <view class="login-btn" @click="handleLogin">
          登录/注册
        </view>
      </view>
      
      <!-- 已登录或非自选标签时显示列表 -->
      <scroll-view 
        v-else
        scroll-y 
        class="coin-list-scroll"
        @scrolltolower="onLoadMore"
        :lower-threshold="100"
      >
        <view class="coin-list">
          <view class="coin-item" v-for="(coin, index) in coinList" :key="index" @click="onCoinClick(coin)">
            <view class="coin-info">
              <view class="coin-name-row">
                <text class="coin-symbol">{{ getSymbolDisplay(coin) }}</text>
                <text class="coin-pair" v-if="currentMainTab === 0 || currentMainTab === 1">/{{ coin.pair }}</text>
                <text class="coin-leverage" v-if="showLeverageLabel(coin)">{{ getLeverageLabel(coin) }}</text>
              </view>
              <view class="coin-volume-row">
                <view 
                  v-if="currentMainTab === 0 || currentMainTab === 1"
                  class="favorite-icon-wrapper"
                  @click.stop="toggleFavorite(coin)"
                >
                  <u-icon 
                    :name="coin.favorite ? 'star-fill' : 'star'" 
                    size="30" 
                    :color="coin.favorite ? '#F0B90B' : '#D1D5DB'" 
                    class="favorite-icon"
                  />
                </view>
                <text class="coin-volume">{{ getVolumeDisplay(coin) }}</text>
              </view>
            </view>
            <view class="coin-price">
              <text class="price-value">{{ formatPrice(coin.price) }}</text>
              <text class="price-usd">${{ formatPrice(coin.priceUsd) }}</text>
            </view>
            <view class="coin-change" :class="coin.change >= 0 ? 'positive' : 'negative'">
              <text class="change-text">{{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%</text>
            </view>
          </view>
          
          <!-- 加载状态 -->
          <view class="load-more" v-if="!noMore">
            <view v-if="loading" class="loading-wrapper">
              <text class="loading-text">加载中...</text>
            </view>
          </view>
          
          <!-- 没有更多数据 -->
          <view class="no-more" v-if="noMore">
            <text class="no-more-text">没有更多数据了</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部菜单 -->
    <custom-menu v-model="currentTab" @change="onTabChange" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 主标签页
const mainTabs = ref(['自选', '现货', 'U本位', '币本位'])
const currentMainTab = ref(1) // 默认选中“现货”

// 当前底部tab
const currentTab = ref(1) // 行情页

// 登录状态（TODO: 后续从全局状态管理或本地存储获取）
const isLoggedIn = ref(false)

// 分页相关
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页数量
const loading = ref(false) // 加载中
const noMore = ref(false) // 没有更多数据

// 币种列表数据
const coinList = ref([])

// 模拟数据源（实际项目中应该从API获取）
const mockDataSource = [
  { symbol: 'USDC', pair: 'USDT', leverage: '10x', price: 0.9996, priceUsd: 0.9996, change: 0.00, volume: '23.10亿', favorite: false },
  { symbol: 'BTC', pair: 'USDT', leverage: '10x', price: 109518.77, priceUsd: 109518.77, change: 1.07, volume: '20.73亿', favorite: true },
  { symbol: 'ETH', pair: 'USDT', leverage: '10x', price: 3936.86, priceUsd: 3936.86, change: -0.18, volume: '19.81亿', favorite: true },
  { symbol: 'MORPHO', pair: 'USDT', leverage: '5x', price: 1.881, priceUsd: 1.88, change: -6.97, volume: '11.03亿', favorite: false },
  { symbol: 'SOL', pair: 'USDT', leverage: '10x', price: 186.31, priceUsd: 186.31, change: 0.39, volume: '6.16亿', favorite: true },
  { symbol: 'BNB', pair: 'USDT', leverage: '10x', price: 1081.4, priceUsd: 1081.4, change: -2.02, volume: '5.18亿', favorite: true },
  { symbol: 'XRP', pair: 'USDT', leverage: '10x', price: 2.4615, priceUsd: 2.46, change: 3.55, volume: '3.22亿', favorite: true },
  { symbol: 'FDUSD', pair: 'USDT', leverage: '10x', price: 0.9977, priceUsd: 0.9977, change: 0.03, volume: '3.06亿', favorite: false },
  { symbol: 'USDE', pair: 'USDT', leverage: '5x', price: 0.999, priceUsd: 0.999, change: -0.02, volume: '2.94亿', favorite: false },
  { symbol: 'DOGE', pair: 'USDT', leverage: '10x', price: 0.19697, priceUsd: 0.19697, change: 1.32, volume: '2.17亿', favorite: true },
  { symbol: 'ADA', pair: 'USDT', leverage: '10x', price: 0.8654, priceUsd: 0.8654, change: 2.45, volume: '1.89亿', favorite: false },
  { symbol: 'AVAX', pair: 'USDT', leverage: '10x', price: 32.45, priceUsd: 32.45, change: -1.23, volume: '1.67亿', favorite: true },
  { symbol: 'MATIC', pair: 'USDT', leverage: '10x', price: 0.7234, priceUsd: 0.7234, change: 0.89, volume: '1.45亿', favorite: false },
  { symbol: 'DOT', pair: 'USDT', leverage: '10x', price: 5.632, priceUsd: 5.632, change: -2.34, volume: '1.23亿', favorite: true },
  { symbol: 'LINK', pair: 'USDT', leverage: '10x', price: 14.89, priceUsd: 14.89, change: 3.21, volume: '1.12亿', favorite: false },
  { symbol: 'UNI', pair: 'USDT', leverage: '10x', price: 8.456, priceUsd: 8.456, change: 1.67, volume: '0.98亿', favorite: true },
  { symbol: 'ATOM', pair: 'USDT', leverage: '10x', price: 9.234, priceUsd: 9.234, change: -0.56, volume: '0.87亿', favorite: false },
  { symbol: 'LTC', pair: 'USDT', leverage: '10x', price: 78.92, priceUsd: 78.92, change: 0.78, volume: '0.76亿', favorite: true },
  { symbol: 'TRX', pair: 'USDT', leverage: '10x', price: 0.1234, priceUsd: 0.1234, change: 2.11, volume: '0.65亿', favorite: false },
  { symbol: 'APT', pair: 'USDT', leverage: '10x', price: 12.45, priceUsd: 12.45, change: -3.45, volume: '0.54亿', favorite: true },
  { symbol: 'ARB', pair: 'USDT', leverage: '10x', price: 1.234, priceUsd: 1.234, change: 1.89, volume: '0.43亿', favorite: false },
  { symbol: 'OP', pair: 'USDT', leverage: '10x', price: 2.567, priceUsd: 2.567, change: 0.45, volume: '0.32亿', favorite: true },
  { symbol: 'INJ', pair: 'USDT', leverage: '10x', price: 23.45, priceUsd: 23.45, change: -1.78, volume: '0.21亿', favorite: false },
  { symbol: 'SUI', pair: 'USDT', leverage: '10x', price: 1.678, priceUsd: 1.678, change: 4.56, volume: '0.19亿', favorite: true },
  { symbol: 'PEPE', pair: 'USDT', leverage: '10x', price: 0.00001234, priceUsd: 0.00001234, change: 12.34, volume: '0.15亿', favorite: false }
]

// 获取币种列表数据
const loadCoinList = async (page = 1) => {
  console.log('loadCoinList 调用, page:', page, ', loading:', loading.value, ', noMore:', noMore.value)
  
  if (loading.value || noMore.value) {
    console.log('loadCoinList 返回：loading 或 noMore 为 true')
    return
  }
  
  loading.value = true
  console.log('开始加载数据...')
  
  try {
    // 模拟分页数据（移除延迟，直接加载）
    const start = (page - 1) * pageSize.value
    const end = start + pageSize.value
    const newData = mockDataSource.slice(start, end)
    
    console.log('加载到的数据:', newData.length, '条, start:', start, ', end:', end)
    
    if (newData.length === 0) {
      noMore.value = true
      console.log('没有更多数据了')
    } else {
      if (page === 1) {
        // 使用map创建新对象，保持响应式
        coinList.value = newData.map(item => ({ ...item }))
        console.log('首次加载，设置列表:', coinList.value.length, '条')
      } else {
        coinList.value = [...coinList.value, ...newData.map(item => ({ ...item }))]
        console.log('追加数据，当前列表:', coinList.value.length, '条')
      }
      currentPage.value = page
      
      // 判断是否还有更多数据
      if (end >= mockDataSource.length) {
        noMore.value = true
        console.log('已加载全部数据')
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
    console.log('加载完成, loading 设为 false')
  }
}

// 加载更多
const onLoadMore = () => {
  console.log('触发加载更多, loading:', loading.value, ', noMore:', noMore.value, ', currentPage:', currentPage.value)
  if (!loading.value && !noMore.value) {
    console.log('开始加载第', currentPage.value + 1, '页')
    loadCoinList(currentPage.value + 1)
  }
}

// 页面加载时获取初始数据
onLoad(() => {
  loadCoinList(1)
})

// 格式化价格
const formatPrice = (price) => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (price >= 1) {
    return price.toFixed(2)
  } else {
    return price.toString()
  }
}

// 主标签页切换
const onMainTabChange = (index) => {
  currentMainTab.value = index
  console.log('切换主标签:', mainTabs.value[index])
  // 切换标签时重置列表
  resetList()
}

// 重置列表
const resetList = () => {
  currentPage.value = 1
  coinList.value = []
  noMore.value = false
  loadCoinList(1)
}

// 币种点击
const onCoinClick = (coin) => {
  console.log('点击币种:', coin.symbol)
  uni.navigateTo({
    url: `/pages/trade/trade?symbol=${coin.symbol}`
  })
}

// 切换收藏状态
const toggleFavorite = (coin) => {
  coin.favorite = !coin.favorite
  console.log('切换收藏:', coin.symbol, '收藏状态:', coin.favorite)
  // 这里可以调用API保存收藏状态
  // await saveFavorite(coin.symbol, coin.favorite)
}

// 获取币种名称显示
const getSymbolDisplay = (coin) => {
  // U本位显示：ETHUSDT
  if (currentMainTab.value === 2) {
    return coin.symbol + coin.pair
  }
  // 币本位显示：ETHUSD CM
  if (currentMainTab.value === 3) {
    return `${coin.symbol}USD CM`
  }
  // 自选和现货只显示币种名称
  return coin.symbol
}

// 获取成交额显示
const getVolumeDisplay = (coin) => {
  // U本位显示：成交额 + USDT
  if (currentMainTab.value === 2) {
    return `${coin.volume} ${coin.pair}`
  }
  // 币本位显示：成交额 + 张
  if (currentMainTab.value === 3) {
    return `${coin.volume} 张`
  }
  // 自选和现货只显示成交额
  return coin.volume
}

// 判断是否显示杠杆/永续标签
const showLeverageLabel = (coin) => {
  return coin.leverage !== undefined && coin.leverage !== null
}

// 获取标签显示内容
const getLeverageLabel = (coin) => {
  // U本位(index=2)和币本位(index=3)显示"永续"
  if (currentMainTab.value === 2 || currentMainTab.value === 3) {
    return '永续'
  }
  // 其他标签页显示原始杠杆倍数
  return coin.leverage
}

// 跳转到搜索页面
const goToSearch = () => {
  uni.navigateTo({
    url: '/sub_package/search/search'
  })
}

// 登录按钮点击
const handleLogin = () => {
  uni.navigateTo({
    url: '/sub_package/login/login'
  })
}

// 底部菜单切换
const onTabChange = (index) => {
  console.log('底部菜单切换:', index)
  currentTab.value = index
  // 注意：不要在这里手动跳转，让 u-tabbar 组件自己处理
}
</script>

<style scoped lang="scss">
.market-container {
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 搜索栏 */
.search-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 20rpx 32rpx;
  gap: 16rpx;
  background-color: #ffffff;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  cursor: pointer;
}

.search-placeholder {
  flex: 1;
  font-size: 28rpx;
  color: #B7BDC6;
}

.search-btn {
  padding: 16rpx 24rpx;
  background-color: #F0B90B;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 主标签页导航 */
.main-tabs {
  flex-shrink: 0;
  background-color: #ffffff;
  border-bottom: 1rpx solid #F5F5F5;
}

.main-tabs-scroll {
  width: 100%;
  white-space: nowrap;
}

.main-tabs-wrapper {
  display: inline-flex;
  padding: 0 32rpx;
  gap: 48rpx;
}

.main-tab-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 20rpx 0;
  position: relative;
}

.main-tab-text {
  font-size: 32rpx;
  color: #707A8A;
  font-weight: 400;
  white-space: nowrap;
}

.main-tab-text.active {
  color: #0B0E11;
  font-weight: 600;
}

.main-tab-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48rpx;
  height: 6rpx;
  background-color: #F0B90B;
  border-radius: 3rpx;
}

/* 交易类型标签 */
.trade-type-tabs {
  flex-shrink: 0;
  background-color: #ffffff;
  padding: 20rpx 0;
}

.trade-type-scroll {
  width: 100%;
  white-space: nowrap;
}

.trade-type-wrapper {
  display: inline-flex;
  padding: 0 32rpx;
  gap: 48rpx;
  white-space: nowrap;
}

.trade-type-item {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  position: relative;
  padding-bottom: 16rpx;
  flex-shrink: 0;
}

.trade-type-text {
  font-size: 30rpx;
  color: #707A8A;
  font-weight: 400;
  white-space: nowrap;
  letter-spacing: 0rpx;
}

.trade-type-text.active {
  color: #0B0E11;
  font-weight: 700;
  font-size: 32rpx;
  letter-spacing: 0rpx;
}

/* 表头 */
.table-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 20rpx 32rpx;
  background-color: #F9FAFB;
  border-bottom: 1rpx solid #F5F5F5;
}

.header-col {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.header-name {
  flex: 1;
}

.header-price {
  flex: 1;
  justify-content: flex-end;
}

.header-change {
  width: 180rpx;
  justify-content: flex-end;
}

.header-text {
  font-size: 24rpx;
  color: #707A8A;
}

.sort-icon {
  display: flex;
  align-items: center;
}

/* 币种列表容器 */
.coin-list-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* 币种列表 */
.coin-list-scroll {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
}

.coin-list {
  padding: 0 32rpx;
}

.coin-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.coin-info {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.coin-name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-wrap: nowrap;
}

.coin-symbol {
  font-size: 30rpx;
  font-weight: 600;
  color: #0B0E11;
  white-space: nowrap;
}

.coin-pair {
  font-size: 26rpx;
  color: #707A8A;
}

.coin-leverage {
  padding: 2rpx 8rpx;
  background-color: #F5F5F5;
  border-radius: 4rpx;
  font-size: 20rpx;
  color: #707A8A;
}

.coin-volume-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.favorite-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rpx;
  cursor: pointer;
}

.favorite-icon {
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.coin-volume {
  font-size: 24rpx;
  color: #B7BDC6;
}

.coin-price {
  width: 200rpx;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
  padding-right: 16rpx;
}

.price-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
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

/* 加载状态 */
.load-more {
  padding: 32rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #B7BDC6;
}

/* 没有更多数据 */
.no-more {
  padding: 32rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-more-text {
  font-size: 28rpx;
  color: #B7BDC6;
}

/* 未登录状态 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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