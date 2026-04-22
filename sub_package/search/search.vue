<template>
  <view class="search-page">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-content">
        <view class="search-input-wrapper">
          <view class="search-input">
            <u-icon name="search" size="30" color="#B7BDC6" />
            <input 
              class="search-input-field" 
              v-model="searchKeyword" 
              placeholder="搜索币种/币对/合约"
              placeholder-style="color: #B7BDC6; font-size: 28rpx;"
              @input="onSearchInput"
              @confirm="onSearchConfirm"
              focus
            />
            <view class="clear-btn" v-if="searchKeyword" @click="clearSearch">
              <u-icon name="close-circle-fill" size="30" color="#B7BDC6" />
            </view>
          </view>
        </view>
        <view class="cancel-btn" @click="goBack">
          <text>取消</text>
        </view>
      </view>
    </view>

    <!-- 搜索结果内容 -->
    <view class="search-content">
      <!-- 历史搜索 -->
      <view class="search-history" v-if="!searchKeyword && historyList.length > 0">
        <view class="history-header">
          <text class="history-title">历史搜索</text>
          <view class="clear-history" @click="clearHistory">
            <u-icon name="trash" size="36" color="#707A8A" />
          </view>
        </view>
        <view class="history-tags">
          <view 
            class="history-tag" 
            v-for="(item, index) in historyList" 
            :key="index"
            @click="onHistoryClick(item)"
          >
            <text class="history-tag-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 热门交易 -->
      <view class="hot-section" v-if="!searchKeyword">
        <view class="section-header">
          <text class="section-title">热门交易</text>
        </view>
        <view class="hot-list">
          <view 
            class="hot-item" 
            v-for="(item, index) in hotList" 
            :key="index"
            @click="onCoinClick(item)"
          >
            <text class="hot-rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</text>
            <view class="hot-info">
              <text class="hot-symbol">{{ item.symbol }}</text>
              <text class="hot-pair">/{{ item.pair }}</text>
              <text class="hot-leverage" v-if="item.leverage">{{ item.leverage }}</text>
            </view>
            <view class="hot-right">
              <text class="hot-price">{{ formatPrice(item.price) }}</text>
              <text class="hot-change" :class="item.change >= 0 ? 'positive' : 'negative'">{{ item.change >= 0 ? '+' : '' }}{{ item.change }}%</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 搜索结果 -->
      <view class="search-results" v-if="searchKeyword">
        <!-- 有结果时显示列表 -->
        <view v-if="searchResults.length > 0">
          <!-- 分类结果列表 -->
          <view class="category-list">
            <view 
              class="category-section" 
              v-for="(category, catIndex) in searchCategories" 
              :key="catIndex"
            >
              <view class="category-header">
                <text class="category-name">{{ category.name }}</text>
              </view>
              <view class="category-items">
                <view 
                  class="category-item" 
                  v-for="(item, index) in category.items" 
                  :key="index"
                  @click="onCoinClick(item)"
                >
                  <view class="item-left">
                    <view class="item-icon">
                      <u-icon name="star" size="24" color="#FCD535" />
                    </view>
                    <view class="item-info">
                      <view class="item-name-row">
                        <text class="item-symbol">{{ item.symbol }}</text>
                        <text class="item-pair">/{{ item.pair }}</text>
                        <text class="item-leverage" v-if="item.leverage">{{ item.leverage }}</text>
                      </view>
                      <text class="item-desc" v-if="item.desc">{{ item.desc }}</text>
                    </view>
                  </view>
                  <view class="item-right">
                    <text class="item-price">{{ formatPrice(item.price) }}</text>
                    <text class="item-change" :class="item.change >= 0 ? 'positive' : 'negative'">{{ item.change >= 0 ? '+' : '' }}{{ item.change }}%</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 无结果 -->
        <view class="no-result" v-else>
          <u-icon name="search" size="48" color="#D1D5DB" />
          <text class="no-result-text">未找到相关结果</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 搜索关键词
const searchKeyword = ref('')

// 历史搜索记录
const historyList = ref(['BTC', 'ETH', 'BNB'])

// 热门交易列表
const hotList = ref([
  { symbol: 'BTC', pair: 'USDT', leverage: '10x', price: 109518.77, priceUsd: 109518.77, change: 1.07 },
  { symbol: 'ETH', pair: 'USDT', leverage: '10x', price: 3936.86, priceUsd: 3936.86, change: -0.18 },
  { symbol: 'SOL', pair: 'USDT', leverage: '10x', price: 186.31, priceUsd: 186.31, change: 0.39 },
  { symbol: 'BNB', pair: 'USDT', leverage: '10x', price: 1081.4, priceUsd: 1081.4, change: -2.02 },
  { symbol: 'XRP', pair: 'USDT', leverage: '10x', price: 2.4615, priceUsd: 2.46, change: 3.55 }
])

// 搜索结果列表
const searchResults = ref([])

// 分类搜索结果
const searchCategories = ref([])

// 模拟数据源（添加分类字段）
const mockDataSource = [
  { symbol: 'USDC', pair: 'USDT', leverage: '10x', price: 0.9996, priceUsd: 0.9996, change: 0.00, volume: '23.10亿', category: '现货' },
  { symbol: 'BTC', pair: 'USDT', leverage: '10x', price: 109518.77, priceUsd: 109518.77, change: 1.07, volume: '20.73亿', category: '现货' },
  { symbol: 'ETH', pair: 'USDT', leverage: '10x', price: 3936.86, priceUsd: 3936.86, change: -0.18, volume: '19.81亿', category: '现货' },
  { symbol: 'MORPHO', pair: 'USDT', leverage: '5x', price: 1.881, priceUsd: 1.88, change: -6.97, volume: '11.03亿', category: 'Alpha', desc: '0xdc...a8fc' },
  { symbol: 'SOL', pair: 'USDT', leverage: '10x', price: 186.31, priceUsd: 186.31, change: 0.39, volume: '6.16亿', category: '现货' },
  { symbol: 'BNB', pair: 'USDT', leverage: '10x', price: 1081.4, priceUsd: 1081.4, change: -2.02, volume: '5.18亿', category: '现货' },
  { symbol: 'BNBUSDC', pair: 'USDC', leverage: '永续', price: 893.77, priceUsd: 893.77, change: -0.32, volume: '3.06亿', category: '合约' },
  { symbol: 'BNBUSDT', pair: 'USDT', leverage: '永续', price: 893.58, priceUsd: 893.58, change: -0.30, volume: '2.94亿', category: '合约' }
]

// 页面加载
onLoad(() => {
  // 可以从本地存储加载历史搜索记录
  loadHistory()
})

// 加载历史搜索
const loadHistory = () => {
  const history = uni.getStorageSync('search_history')
  if (history) {
    historyList.value = JSON.parse(history)
  }
}

// 保存历史搜索
const saveHistory = (keyword) => {
  if (!keyword.trim()) return
  
  // 去重并添加到最前面
  const newHistory = [keyword, ...historyList.value.filter(item => item !== keyword)]
  // 最多保留10条
  historyList.value = newHistory.slice(0, 10)
  // 保存到本地
  uni.setStorageSync('search_history', JSON.stringify(historyList.value))
}

// 清除历史搜索
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除历史搜索记录吗？',
    success: (res) => {
      if (res.confirm) {
        historyList.value = []
        uni.removeStorageSync('search_history')
      }
    }
  })
}

// 搜索输入
const onSearchInput = () => {
  performSearch()
}

// 搜索确认
const onSearchConfirm = () => {
  if (searchKeyword.value.trim()) {
    saveHistory(searchKeyword.value.trim())
    performSearch()
  }
}

// 执行搜索
const performSearch = () => {
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    searchCategories.value = []
    return
  }
  
  const keyword = searchKeyword.value.trim().toUpperCase()
  const results = mockDataSource.filter(item => {
    return item.symbol.toUpperCase().includes(keyword) || 
           item.pair.toUpperCase().includes(keyword)
  })
  
  searchResults.value = results
  
  // 按分类分组
  if (results.length > 0) {
    const categoryMap = {}
    results.forEach(item => {
      const cat = item.category || '其他'
      if (!categoryMap[cat]) {
        categoryMap[cat] = []
      }
      categoryMap[cat].push(item)
    })
    
    searchCategories.value = Object.keys(categoryMap).map(name => ({
      name,
      items: categoryMap[name]
    }))
  } else {
    searchCategories.value = []
  }
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
}

// 历史记录点击
const onHistoryClick = (keyword) => {
  searchKeyword.value = keyword
  performSearch()
}

// 币种点击
const onCoinClick = (coin) => {
  console.log('点击币种:', coin.symbol)
  // 保存到历史搜索
  saveHistory(coin.symbol)
  
  // 直接跳转到交易页面
  uni.navigateTo({
    url: `/pages/trade/trade?symbol=${coin.symbol}`,
    animationType: 'none', // 禁用动画，加快跳转
    success: () => {
      // 跳转成功后删除搜索页面
      const pages = getCurrentPages()
      if (pages.length >= 2) {
        // 获取搜索页面（倒数第二个）
        const searchPage = pages[pages.length - 2]
        // 关闭搜索页面（回退一步再前进是不可能的，所以我们接受页面栈中有搜索页）
      }
    }
  })
}

// 返回到行情页面
const goBack = () => {
  console.log('点击取消按钮 - goBack 被调用')
  // 使用 redirectTo 跳转到行情页面
  uni.redirectTo({
    url: '/pages/market/market',
    success: () => {
      console.log('跳转成功')
    },
    fail: (err) => {
      console.log('跳转失败:', err)
    }
  })
}

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
</script>

<style scoped lang="scss">
.search-page {
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.navbar {
  flex-shrink: 0;
  background-color: #ffffff;
  border-bottom: 1rpx solid #F5F5F5;
  padding-top: calc(env(safe-area-inset-top));
}

.navbar-content {
  display: flex;
  align-items: center;
  padding: 20rpx 32rpx;
  gap: 16rpx;
}

.search-input-wrapper {
  flex: 1;
}

.search-input {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
}

.search-input-field {
  flex: 1;
  font-size: 28rpx;
  color: #0B0E11;
  border: none;
  outline: none;
  background-color: transparent;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rpx;
}

.cancel-btn {
  font-size: 28rpx;
  color: #707A8A;
  white-space: nowrap;
  padding: 12rpx 16rpx;
  cursor: pointer;
}

/* 搜索内容 */
.search-content {
  flex: 1;
  overflow-y: auto;
}

/* 历史搜索 */
.search-history {
  padding: 24rpx 32rpx 32rpx 32rpx;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.history-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.clear-history {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.history-tag {
  padding: 16rpx 32rpx;
  background-color: #F7F8FA;
  border-radius: 44rpx;
}

.history-tag-text {
  font-size: 28rpx;
  color: #474D57;
}

/* 热门交易 */
.hot-section {
  padding: 0 32rpx 32rpx 32rpx;
}

.section-header {
  padding: 32rpx 0 24rpx 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.hot-list {
  display: flex;
  flex-direction: column;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.hot-rank {
  width: 56rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #B7BDC6;
  text-align: left;
}

.hot-rank.top-three {
  color: #FCD535;
}

.hot-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-left: 24rpx;
}

.hot-symbol {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.hot-pair {
  font-size: 28rpx;
  color: #85898E;
}

.hot-leverage {
  padding: 4rpx 12rpx;
  background-color: #F7F8FA;
  border-radius: 4rpx;
  font-size: 22rpx;
  color: #85898E;
}

.hot-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.hot-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.hot-change {
  font-size: 28rpx;
  font-weight: 500;
}

.hot-change.positive {
  color: #0ECB81;
}

.hot-change.negative {
  color: #F6465D;
}

/* 搜索结果 */
.search-results {
  flex: 1;
  overflow-y: auto;
}

/* 分类列表 */
.category-list {
  padding: 0 32rpx;
}

.category-section {
  margin-bottom: 32rpx;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0 16rpx 0;
}

.category-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #707A8A;
}

.category-items {
  display: flex;
  flex-direction: column;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.item-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.item-icon {
  width: 48rpx;
  height: 48rpx;
  background-color: #FCD535;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.item-name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.item-symbol {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.item-pair {
  font-size: 28rpx;
  color: #85898E;
}

.item-leverage {
  padding: 4rpx 12rpx;
  background-color: #F7F8FA;
  border-radius: 4rpx;
  font-size: 22rpx;
  color: #85898E;
}

.item-desc {
  font-size: 24rpx;
  color: #B7BDC6;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.item-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.item-change {
  font-size: 28rpx;
  font-weight: 500;
}

.item-change.positive {
  color: #0ECB81;
}

.item-change.negative {
  color: #F6465D;
}

.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  gap: 24rpx;
}

.no-result-text {
  font-size: 28rpx;
  color: #B7BDC6;
}
</style>
