<template>
  <view class="trade-content">
    <view class="pair-info">
      <view class="pair-left" @click="showPairSelector = true">
        <view class="pair-name">
          <text class="symbol">{{ currentSymbol }}</text>
          <u-icon name="arrow-down" size="24" color="#0B0E11" />
        </view>
        <view class="pair-change">
          <text class="change-text" :class="changePercent >= 0 ? 'positive' : 'negative'">
            {{ changePercent >= 0 ? '+' : '' }}{{ changePercent }}%
          </text>
        </view>
      </view>
      <view class="pair-right">
        <image class="icon-kline" src="/static/icon/trade/kline.png" mode="aspectFit" />
        <image class="icon-more" src="/static/icon/trade/more.png" mode="aspectFit" @click="showFunctionMenu = true" />
      </view>
    </view>

    <!-- 可滚动内容区 -->
    <scroll-view class="scroll-content" scroll-y>
      <!-- 主内容区 -->
      <view class="main-content">
        <!-- 左侧盘口 -->
        <custom-depth
          :sell-orders="sellOrders"
          :buy-orders="buyOrders"
          :current-price="currentPrice"
          :price-label="'≈ $' + currentPriceUsd"
          :price-change="changePercent"
          quote-currency="USDT"
          base-currency="EUL"
        />

        <!-- 右侧交易面板 -->
        <view class="trade-panel">
          <!-- 买入/卖出切换 -->
          <view class="trade-tabs">
            <view
              class="trade-tab buy"
              :class="{ active: tradeType === 'buy' }"
              @click="tradeType = 'buy'"
            >
              <text class="trade-tab-text">买入</text>
            </view>
            <view
              class="trade-tab sell"
              :class="{ active: tradeType === 'sell' }"
              @click="tradeType = 'sell'"
            >
              <text class="trade-tab-text">卖出</text>
            </view>
          </view>

          <!-- 订单类型选择 -->
          <view class="order-type" @click="showOrderTypeSelector">
            <view class="order-type-select">
              <text class="order-type-text">{{ orderTypes[currentOrderType] }}</text>
            </view>
             <u-icon name="arrow-down" size="12" color="#707A8A" />
          </view>

          <!-- 限价单 - 价格+数量 -->
          <template v-if="currentOrderType === 0">
            <!-- 价格输入 -->
            <view class="input-group">
              <view class="input-row-outer">
                <view class="input-btn-outer" @click="decreasePrice">
                  <text class="btn-icon">−</text>
                </view>
                <view class="input-box">
                  <text class="input-label">价格 (USDT)</text>
                  <view class="input-row">
                    <input
                      class="input-field"
                      type="digit"
                      v-model="price"
                      placeholder=""
                    />
                  </view>
                </view>
                <view class="input-btn-outer" @click="increasePrice">
                  <text class="btn-icon">+</text>
                </view>
              </view>
            </view>

            <!-- 数量输入 -->
            <view class="input-group">
              <view class="input-row-outer">
                <view class="input-btn-outer" @click="decreaseAmount">
                  <text class="btn-icon">−</text>
                </view>
                <view class="input-box">
                  <text class="input-label">数量 (EUL)</text>
                  <view class="input-row">
                    <input
                      class="input-field"
                      type="digit"
                      v-model="amount"
                      placeholder=""
                      @input="onAmountInput"
                    />
                  </view>
                </view>
                <view class="input-btn-outer" @click="increaseAmount">
                  <text class="btn-icon">+</text>
                </view>
              </view>
            </view>
          </template>

          <!-- 市价单 - 市价+数量 -->
          <template v-if="currentOrderType === 1">
            <!-- 市价 -->
            <view class="input-group">
              <view class="input-box readonly">
                <text class="input-label">市价</text>
              </view>
            </view>

            <!-- 数量输入 -->
            <view class="input-group">
              <view class="input-row-outer">
                <view class="input-btn-outer" @click="decreaseAmount">
                  <text class="btn-icon">−</text>
                </view>
                <view class="input-box">
                  <text class="input-label">数量 (EUL)</text>
                  <view class="input-row">
                    <input
                      class="input-field"
                      type="digit"
                      v-model="amount"
                      placeholder=""
                      @input="onAmountInput"
                    />
                  </view>
                </view>
                <view class="input-btn-outer" @click="increaseAmount">
                  <text class="btn-icon">+</text>
                </view>
              </view>
            </view>
          </template>

          <!-- 限价止盈止损 - 触发价+委托价+数量 -->
          <template v-if="currentOrderType === 2">
            <!-- 触发价输入 -->
            <view class="input-group">
              <view class="input-row-outer">
                <view class="input-btn-outer" @click="decreaseTriggerPrice">
                  <text class="btn-icon">−</text>
                </view>
                <view class="input-box">
                  <text class="input-label">触发价 (USDT)</text>
                  <view class="input-row">
                    <input
                      class="input-field"
                      type="digit"
                      v-model="triggerPrice"
                      placeholder=""
                    />
                  </view>
                </view>
                <view class="input-btn-outer" @click="increaseTriggerPrice">
                  <text class="btn-icon">+</text>
                </view>
              </view>
            </view>

            <!-- 委托价输入 -->
            <view class="input-group">
              <view class="input-row-outer">
                <view class="input-btn-outer" @click="decreasePrice">
                  <text class="btn-icon">−</text>
                </view>
                <view class="input-box">
                  <text class="input-label">委托价 (USDT)</text>
                  <view class="input-row">
                    <input
                      class="input-field"
                      type="digit"
                      v-model="price"
                      placeholder=""
                    />
                  </view>
                </view>
                <view class="input-btn-outer" @click="increasePrice">
                  <text class="btn-icon">+</text>
                </view>
              </view>
            </view>

            <!-- 数量输入 -->
            <view class="input-group">
              <view class="input-row-outer">
                <view class="input-btn-outer" @click="decreaseAmount">
                  <text class="btn-icon">−</text>
                </view>
                <view class="input-box">
                  <text class="input-label">数量 (EUL)</text>
                  <view class="input-row">
                    <input
                      class="input-field"
                      type="digit"
                      v-model="amount"
                      placeholder=""
                      @input="onAmountInput"
                    />
                  </view>
                </view>
                <view class="input-btn-outer" @click="increaseAmount">
                  <text class="btn-icon">+</text>
                </view>
              </view>
            </view>
          </template>

          <!-- 市价止盈止损 - 触发价+市价+数量 -->
          <template v-if="currentOrderType === 3">
            <!-- 触发价输入 -->
            <view class="input-group">
              <view class="input-row-outer">
                <view class="input-btn-outer" @click="decreaseTriggerPrice">
                  <text class="btn-icon">−</text>
                </view>
                <view class="input-box">
                  <text class="input-label">触发价 (USDT)</text>
                  <view class="input-row">
                    <input
                      class="input-field"
                      type="digit"
                      v-model="triggerPrice"
                      placeholder=""
                    />
                  </view>
                </view>
                <view class="input-btn-outer" @click="increaseTriggerPrice">
                  <text class="btn-icon">+</text>
                </view>
              </view>
            </view>

            <!-- 市价 -->
            <view class="input-group">
              <view class="input-box readonly">
                <text class="input-label">市价</text>
              </view>
            </view>

            <!-- 数量输入 -->
            <view class="input-group">
              <view class="input-row-outer">
                <view class="input-btn-outer" @click="decreaseAmount">
                  <text class="btn-icon">−</text>
                </view>
                <view class="input-box">
                  <text class="input-label">数量 (EUL)</text>
                  <view class="input-row">
                    <input
                      class="input-field"
                      type="digit"
                      v-model="amount"
                      placeholder=""
                      @input="onAmountInput"
                    />
                  </view>
                </view>
                <view class="input-btn-outer" @click="increaseAmount">
                  <text class="btn-icon">+</text>
                </view>
              </view>
            </view>
          </template>

          <!-- 滑块 -->
          <view class="slider-wrapper">
            <view class="slider-container">
              <u-slider
                v-model="sliderPercent"
                :min="0"
                :max="100"
                :step="1"
                :height="6"
                :block-width="28"
                active-color="#17b26a"
                inactive-color="#E5E7EB"
                block-color="#17b26a"
                :block-style="sliderBlockStyle"
                @input="onSliderChange"
                @start="onSliderStart"
                @moving="onSliderMoving"
                @end="onSliderEnd"
              >
                <template v-slot:default>
                  <view class="custom-slider-thumb">
                    <!-- 百分比提示 -->
                    <view class="slider-tooltip" v-if="showTooltip">
                      <text class="tooltip-text">{{ sliderPercent }}%</text>
                      <view class="tooltip-arrow"></view>
                    </view>
                    <view class="thumb-diamond"></view>
                  </view>
                </template>
              </u-slider>
            </view>
          </view>

          <!-- 成交金额 -->
          <view class="input-group" v-if="currentOrderType !== 1">
            <view class="input-box readonly">
              <text class="input-label">成交金额 (USDT)</text>
              <view class="input-row">
                <text class="input-value">{{ totalAmount || '' }}</text>
              </view>
            </view>
          </view>

          <!-- 止盈止损（限价单和市价单显示） -->
          <view class="checkbox-group" v-if="currentOrderType === 0 || currentOrderType === 1">
            <u-checkbox v-model="stopLoss" shape="square" :size="32" active-color="#17b26a">
              <text class="checkbox-label">止盈/止损</text>
            </u-checkbox>
          </view>

          <!-- 可用余额 -->
          <view class="balance-section">
            <view class="balance-row">
              <view class="balance-left">
                <text class="balance-label">可用</text>
              </view>
              <view class="balance-right">
                <text class="balance-value">{{ availableBalance }} USDT</text>
                <u-icon name="plus-circle-fill" size="32" color="#F0B90B" />
              </view>
            </view>
            <view class="balance-row">
              <text class="balance-label">可买</text>
              <text class="balance-value">{{ availableBuy }} EUL</text>
            </view>
            <view class="balance-row">
              <text class="balance-label underline">预估手续费</text>
              <text class="balance-value">-- EUL</text>
            </view>
          </view>

          <!-- 交易按钮 -->
          <view class="trade-button-wrapper">
            <view
              class="trade-button"
              :class="tradeType"
              @click="handleTrade"
            >
              <text class="button-text">{{ tradeType === 'buy' ? '买入 EUL' : '卖出 EUL' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部订单区 -->
      <view class="bottom-orders">
        <!-- 顶部提示 -->
        <view class="orders-notice">
          <u-icon name="info-circle-fill" size="32" color="#F0B90B" />
          <text class="notice-text">该币种有子母币，波动性可能更高</text>
          <text class="notice-link">查看详情</text>
          <u-icon name="close" size="32" color="#B7BDC6" />
        </view>

        <view class="order-tabs">
          <view
            class="order-tab"
            v-for="(tab, index) in orderTabs"
            :key="index"
            :class="{ active: currentOrderTab === index }"
            @click="currentOrderTab = index"
          >
            <text class="order-tab-text" :class="{ active: currentOrderTab === index }">
              {{ tab }}
            </text>
            <text class="order-tab-count" v-if="index === 0">({{ currentOrders.length }})</text>
          </view>
          <view class="history-icon" @click="goToHistory">
            <image class="history-icon-img" src="/static/icon/trade/zd.png" mode="aspectFit" />
          </view>
        </view>

        <!-- 操作栏（仅当前委托显示） -->
        <view class="order-actions" v-if="currentOrderTab === 0">
          <view class="checkbox-wrapper" @click="hideOtherPairs = !hideOtherPairs">
            <view class="custom-checkbox" :class="{ checked: hideOtherPairs }">
              <u-icon v-if="hideOtherPairs" name="checkbox-mark" size="20" color="#17b26a" />
            </view>
            <text class="checkbox-text">隐藏其他交易对</text>
          </view>
          <view class="cancel-all-btn" @click="cancelAllOrders">
            <text class="cancel-all-text">撤销全部</text>
          </view>
        </view>

        <!-- 当前委托列表 -->
        <scroll-view class="order-list" v-if="currentOrderTab === 0" scroll-y>
          <view class="order-item-wrapper" v-if="currentOrders.length > 0">
            <view class="order-card" v-for="(order, index) in currentOrders" :key="index">
              <view class="order-header">
                <view class="order-pair">
                  <text class="order-symbol">{{ order.symbol }}</text>
                  <u-icon name="share-square" size="28" color="#707A8A" />
                </view>
                <view class="order-right">
                  <text class="order-percent" :class="order.percent === 0 ? 'zero' : 'positive'">
                    {{ order.percent }}%
                  </text>
                  <view class="order-action-btn" @click="cancelOrder(order)">
                    <text class="action-btn-text">撤单</text>
                  </view>
                </view>
              </view>

              <view class="order-info-row">
                <text class="order-label">{{ order.type }} / </text>
                <text class="order-side" :class="order.side === '买入' ? 'buy' : 'sell'">{{ order.side }}</text>
                <text class="order-time">{{ order.time }}</text>
              </view>

              <view class="order-info-row">
                <text class="order-label">成交数量 / 数量</text>
                <text class="order-value">{{ order.filled }} / {{ order.total }}</text>
              </view>

              <view class="order-info-row">
                <text class="order-label">价格</text>
                <view class="order-price-edit">
                  <text class="order-value">{{ order.price }}</text>
                  <u-icon v-if="order.price !== '市价'" name="edit-pen" size="28" color="#707A8A" />
                </view>
              </view>

              <!-- 触发条件（仅止盈止损订单显示） -->
              <view class="order-info-row" v-if="order.triggerCondition">
                <text class="order-label">触发条件</text>
                <text class="order-value">{{ order.triggerCondition }}</text>
              </view>
            </view>
          </view>
          <view class="empty-orders" v-else>
            <text class="empty-text">暂无委托订单</text>
          </view>
        </scroll-view>

        <!-- 持有币种 -->
        <scroll-view class="holdings-list" v-if="currentOrderTab === 1" scroll-y>
          <view class="holdings-header">
            <text class="holdings-title">当前交易对资产</text>
          </view>
          <view class="holdings-wrapper" v-if="holdings.length > 0">
            <view class="holding-item" v-for="(holding, index) in holdings" :key="index">
              <view class="holding-left">
                <view class="coin-icon">{{ holding.icon }}</view>
                <view class="coin-info">
                  <text class="coin-symbol">{{ holding.symbol }}</text>
                  <text class="coin-name">{{ holding.fullName }}</text>
                </view>
              </view>
              <view class="holding-right">
                <text class="coin-amount">{{ holding.amount }}</text>
                <text class="coin-usdt">{{ holding.usdtValue }}</text>
              </view>
            </view>
          </view>
          <view class="empty-state" v-else>
            <text class="empty-text">暂无持仓</text>
          </view>
        </scroll-view>
      </view>
    </scroll-view>

    <!-- 功能菜单弹窗 -->
    <u-popup v-model="showFunctionMenu" mode="bottom" border-radius="32" :safe-area-inset-bottom="true">
      <view class="function-menu">
        <!-- 标题 -->
        <view class="function-header">
          <text class="function-title">精选功能</text>
        </view>

        <!-- 功能列表 -->
        <view class="function-content">
          <view class="function-grid">
            <view
              class="function-item"
              v-for="(item, index) in functionItems"
              :key="index"
              @click="handleFunctionClick(item)"
            >
              <view class="function-icon-wrapper">
                <image v-if="item.image" :src="item.image" mode="aspectFit" class="function-icon-img" />
                <u-icon v-else :name="item.icon" :size="item.iconSize || 48" :color="item.iconColor || '#0B0E11'" />
              </view>
              <text class="function-name">{{ item.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 交易对选择弹窗 -->
    <u-popup v-model="showPairSelector" mode="bottom" border-radius="32" :safe-area-inset-bottom="true">
      <view class="pair-selector">
        <!-- 顶部标题栏 -->
        <view class="selector-header">
          <text class="selector-title">选择交易对</text>
          <view class="close-btn" @click="showPairSelector = false">
            <u-icon name="close" size="32" color="#707A8A" />
          </view>
        </view>

        <!-- 搜索框 -->
        <view class="search-wrapper">
          <view class="search-box">
            <u-icon name="search" size="32" color="#B7BDC6" />
            <input
              class="search-input"
              type="text"
              v-model="searchKeyword"
              placeholder="搜索币种/币对"
              placeholder-style="color: #B7BDC6;"
            />
            <view class="clear-search-btn" v-if="searchKeyword" @click="clearSearchKeyword">
              <u-icon name="close-circle-fill" size="30" color="#B7BDC6" />
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
              v-for="(item, index) in hotPairs"
              :key="index"
              @click="selectPair(item)"
            >
              <text class="hot-rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</text>
              <view class="hot-info">
                <text class="hot-symbol">{{ item.symbol }}</text>
                <text class="hot-pair">/{{ item.pair }}</text>
                <text class="hot-leverage" v-if="item.leverage">{{ item.leverage }}</text>
              </view>
              <view class="hot-right">
                <text class="hot-price">{{ item.price }}</text>
                <text class="hot-change" :class="item.change >= 0 ? 'positive' : 'negative'">
                  {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                </text>
              </view>
            </view>
          </view>
        </view>

        <!-- 搜索结果 -->
        <view class="search-results" v-if="searchKeyword">
          <view v-if="filteredPairs.length > 0">
            <!-- 列表头部 -->
            <view class="list-header">
              <text class="header-col col-name">名称</text>
              <text class="header-col col-price">最新价</text>
              <text class="header-col col-change">24h涨幅</text>
            </view>

            <!-- 交易对列表 -->
            <scroll-view class="pair-list" scroll-y>
              <view
                class="pair-item"
                v-for="(pair, index) in filteredPairs"
                :key="index"
                @click="selectPair(pair)"
              >
                <view class="pair-col col-name">
                  <view class="coin-icon" :style="{ backgroundColor: pair.iconBg }">
                    <text class="coin-emoji">{{ pair.icon }}</text>
                  </view>
                  <text class="coin-symbol">{{ pair.symbol }}/{{ pair.pair || 'USDT' }}</text>
                </view>
                <view class="pair-col col-price">
                  <text class="price-value">{{ pair.price }}</text>
                </view>
                <view class="pair-col col-change">
                  <text class="change-value" :class="pair.change >= 0 ? 'positive' : 'negative'">
                    {{ pair.change >= 0 ? '+' : '' }}{{ pair.change }}%
                  </text>
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- 无结果 -->
          <view class="no-result" v-else>
            <u-icon name="search" size="48" color="#D1D5DB" />
            <text class="no-result-text">未找到相关结果</text>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 顶部tab - 移除，由父组件控制
const currentSymbol = ref('EUL/USDT')
const currentPrice = ref('8.371')
const currentPriceUsd = ref('8.37')
const changePercent = ref(8.73)

// 功能菜单
const showFunctionMenu = ref(false)

// 功能项列表
const functionItems = ref([
  { name: '划转', image: '/static/icon/trade/hz.png' },
  { name: '充值', image: '/static/icon/trade/cz.png' },
   { name: '添加自选', image:'/static/icon/trade/sc.png' },
])

// 交易对选择器
const showPairSelector = ref(false)
const searchKeyword = ref('')

// 热门交易对数据
const hotPairs = ref([
  { symbol: 'BTC', pair: 'USDT', leverage: '10x', price: '109518.77', change: 1.07, icon: '🟠', iconBg: '#F7931A' },
  { symbol: 'ETH', pair: 'USDT', leverage: '10x', price: '3936.86', change: -0.18, icon: '💎', iconBg: '#627EEA' },
  { symbol: 'SOL', pair: 'USDT', leverage: '10x', price: '186.31', change: 0.39, icon: '🟣', iconBg: '#9945FF' },
  { symbol: 'BNB', pair: 'USDT', leverage: '10x', price: '1081.4', change: -2.02, icon: '🟡', iconBg: '#F3BA2F' },
  { symbol: 'XRP', pair: 'USDT', leverage: '10x', price: '2.4615', change: 3.55, icon: '⚪', iconBg: '#00AAE4' }
])

// 所有交易对列表数据
const allPairs = ref([
  { symbol: 'BTC', pair: 'USDT', price: '109518.77', change: 1.07, icon: '🟠', iconBg: '#F7931A' },
  { symbol: 'ETH', pair: 'USDT', price: '3936.86', change: -0.18, icon: '💎', iconBg: '#627EEA' },
  { symbol: 'SOL', pair: 'USDT', price: '186.31', change: 0.39, icon: '🟣', iconBg: '#9945FF' },
  { symbol: 'BNB', pair: 'USDT', price: '1081.4', change: -2.02, icon: '🟡', iconBg: '#F3BA2F' },
  { symbol: 'XRP', pair: 'USDT', price: '2.4615', change: 3.55, icon: '⚪', iconBg: '#00AAE4' },
  { symbol: 'USDT', pair: 'USDC', price: '0.9974', change: 0.02, icon: '💵', iconBg: '#26A17B' },
  { symbol: 'USDC', pair: 'USDT', price: '1.0005', change: -0.01, icon: '💠', iconBg: '#2775CA' },
  { symbol: 'PUMP', pair: 'USDT', price: '0.003394', change: -5.33, icon: '💚', iconBg: '#00D395' },
  { symbol: 'EUL', pair: 'USDT', price: '8.371', change: 8.73, icon: '🟠', iconBg: '#FF6B35' },
  { symbol: 'DOGE', pair: 'USDT', price: '0.0823', change: -2.45, icon: '🐕', iconBg: '#C2A633' }
])

// 过滤后的交易对列表
const filteredPairs = computed(() => {
  if (!searchKeyword.value) {
    return []
  }

  const keyword = searchKeyword.value.trim().toUpperCase()
  return allPairs.value.filter(pair =>
    pair.symbol.toUpperCase().includes(keyword) ||
    (pair.pair && pair.pair.toUpperCase().includes(keyword))
  )
})

// 清除搜索关键词
const clearSearchKeyword = () => {
  searchKeyword.value = ''
}

// 交易类型
const tradeType = ref('buy') // buy 或 sell

// 订单类型
const orderTypes = ref(['限价单', '市价单', '限价止盈止损', '市价止盈止损'])
const currentOrderType = ref(0)

// 交易表单
const price = ref('8.375')
const triggerPrice = ref('') // 触发价（止盈止损用）
const amount = ref('')
const sliderPercent = ref(0)
const sliderBlockStyle = ref({})
const showTooltip = ref(false)

// 止盈止损
const stopLoss = ref(false)
const icebergOrder = ref(false) // 冰山单

// 可用余额
const availableBalance = ref('2,002.23')
const availableBuy = ref('239.07')

// 计算成交金额
const totalAmount = computed(() => {
  const p = parseFloat(price.value) || 0
  const a = parseFloat(amount.value) || 0
  return (p * a).toFixed(2)
})

// 盘口数据（卖单降序，买单升序，各显示5条）
const sellOrders = ref([
  { price: '8.393', amount: '30.71' },
  { price: '8.392', amount: '280.64' },
  { price: '8.391', amount: '30.71' },
  { price: '8.387', amount: '280.64' },
  { price: '8.382', amount: '0.86' },
  { price: '8.381', amount: '22.22' }
])

const buyOrders = ref([
  { price: '8.372', amount: '3.87' },
  { price: '8.371', amount: '36.34' },
  { price: '8.367', amount: '5.39' },
  { price: '8.366', amount: '59.74' },
  { price: '8.364', amount: '1.81' },
  { price: '8.363', amount: '1.81' }
])

// 精度选择
const precision = ref('0.001')



// 底部订单tab
const orderTabs = ref(['当前委托', '持有币种'])
const currentOrderTab = ref(0)

// 当前委托列表（添加更多测试数据）
const currentOrders = ref([
  {
    symbol: 'EUL/USDT',
    type: '市价止盈',
    side: '买入',
    time: '2025-10-24 15:06:29',
    filled: '0.00',
    total: '3.00',
    price: '市价',
    triggerCondition: '≤5',
    percent: 0
  },
  {
    symbol: 'EUL/USDT',
    type: '限价止盈',
    side: '买入',
    time: '2025-10-24 15:06:08',
    filled: '0.00',
    total: '4.00',
    price: '3.00',
    triggerCondition: '≤5',
    percent: 0
  },
  {
    symbol: 'EUL/USDT',
    type: '限价',
    side: '买入',
    time: '2025-10-24 14:56:08',
    filled: '0.00',
    total: '4.00',
    price: '5.00',
    percent: 0
  },
  {
    symbol: 'EUL/USDT',
    type: '限价',
    side: '买入',
    time: '2025-10-24 14:56:00',
    filled: '0.00',
    total: '1.66',
    price: '6.00',
    percent: 0
  }
])

// 持有币种列表
const holdings = ref([
  {
    symbol: 'EUL',
    fullName: 'Euler',
    icon: '🟠',
    amount: '0.00',
    usdtValue: '--'
  },
  {
    symbol: 'USDT',
    fullName: 'TetherUS',
    icon: '🔵',
    amount: '215.692799',
    usdtValue: '$215.69'
  }
])

const hideOtherPairs = ref(false)

// 撤销单个订单
const cancelOrder = (order) => {
  uni.showModal({
    title: '确认撤单',
    content: `确定要撤销这笔${order.side}订单吗？`,
    success: (res) => {
      if (res.confirm) {
        const index = currentOrders.value.findIndex(o => o === order)
        if (index > -1) {
          currentOrders.value.splice(index, 1)
          uni.showToast({
            title: '撤单成功',
            icon: 'success'
          })
        }
      }
    }
  })
}

// 撤销全部订单
const cancelAllOrders = () => {
  if (currentOrders.value.length === 0) {
    uni.showToast({
      title: '暂无订单',
      icon: 'none'
    })
    return
  }
  uni.showModal({
    title: '确认撤销全部',
    content: `确定要撤销全部${currentOrders.value.length}笔订单吗？`,
    success: (res) => {
      if (res.confirm) {
        currentOrders.value = []
        uni.showToast({
          title: '已撤销全部订单',
          icon: 'success'
        })
      }
    }
  })
}

// 底部菜单 - 移除，由父组件控制

// 页面加载
onLoad((options) => {
  if (options.symbol) {
    currentSymbol.value = options.symbol + '/USDT'
  }
})

// 数量输入事件
const onAmountInput = () => {
  // 根据输入的数量反向计算滑块位置
  const maxAmount = parseFloat(availableBuy.value.replace(/,/g, '')) || 0
  if (maxAmount > 0) {
    const currentAmount = parseFloat(amount.value) || 0
    const percent = Math.min(100, Math.max(0, (currentAmount / maxAmount) * 100))
    sliderPercent.value = Math.round(percent)
  }
}

// 价格增减
const decreasePrice = () => {
  const p = parseFloat(price.value) || 0
  price.value = Math.max(0, p - 0.001).toFixed(3)
}

const increasePrice = () => {
  const p = parseFloat(price.value) || 0
  price.value = (p + 0.001).toFixed(3)
}

// 触发价增减
const decreaseTriggerPrice = () => {
  const p = parseFloat(triggerPrice.value) || 0
  triggerPrice.value = Math.max(0, p - 0.001).toFixed(3)
}

const increaseTriggerPrice = () => {
  const p = parseFloat(triggerPrice.value) || 0
  triggerPrice.value = (p + 0.001).toFixed(3)
}

// 数量增加
const increaseAmount = () => {
  const a = parseFloat(amount.value) || 0
  amount.value = (a + 1).toFixed(2)
}

// 数量减少
const decreaseAmount = () => {
  const a = parseFloat(amount.value) || 0
  amount.value = Math.max(0, a - 1).toFixed(2)
}

// 滑块改变事件
const onSliderChange = (value) => {
  sliderPercent.value = value
  // 根据百分比计算数量
  const maxAmount = parseFloat(availableBuy.value.replace(/,/g, '')) || 0
  const calculatedAmount = (maxAmount * value / 100)
  amount.value = calculatedAmount > 0 ? calculatedAmount.toFixed(2) : ''
}

// 滑块开始滑动
const onSliderStart = () => {
  showTooltip.value = true
}

// 滑块滑动中
const onSliderMoving = () => {
  showTooltip.value = true
}

// 滑块结束滑动
const onSliderEnd = () => {
  showTooltip.value = false
}

// 设置滑块百分比
const setSliderPercent = (percent) => {
  sliderPercent.value = percent
  onSliderChange(percent)
}

// 执行交易
const handleTrade = () => {
  if (!price.value || !amount.value) {
    uni.showToast({
      title: '请输入价格和数量',
      icon: 'none'
    })
    return
  }

  uni.showToast({
    title: tradeType.value === 'buy' ? '买入成功' : '卖出成功',
    icon: 'success'
  })

  // 清空表单
  price.value = currentPrice.value
  amount.value = ''
  sliderPercent.value = 0
}

// 显示订单类型选择器
const showOrderTypeSelector = () => {
  uni.showActionSheet({
    itemList: orderTypes.value,
    success: (res) => {
      currentOrderType.value = res.tapIndex
      // 切换订单类型时重置相关字段
      if (currentOrderType.value === 1) {
        // 市价单
        price.value = ''
        triggerPrice.value = ''
      } else if (currentOrderType.value === 0) {
        // 限价单
        price.value = currentPrice.value
        triggerPrice.value = ''
      } else {
        // 止盈止损单
        if (!price.value) {
          price.value = currentPrice.value
        }
      }
    }
  })
}

// 跳转到历史订单
const goToHistory = () => {

}

// 处理功能点击
const handleFunctionClick = (item) => {
  showFunctionMenu.value = false

  // 根据功能类型执行相应操作
  switch(item.name) {
    case '划转':
      uni.navigateTo({
        url: '/sub_package/transfer/transfer'
      })
      break
    case '充值':
      uni.navigateTo({
        url: '/sub_package/fund/fund-deposit'
      })
      break
    case '添加至自选':
      uni.showToast({
        title: '已添加至自选',
        icon: 'success'
      })
      break
    default:
      uni.showToast({
        title: `${item.name}功能待开发`,
        icon: 'none'
      })
  }
}

// 选择交易对
const selectPair = (pair) => {
  const pairSymbol = pair.pair || 'USDT'
  currentSymbol.value = pair.symbol + '/' + pairSymbol
  currentPrice.value = pair.price
  currentPriceUsd.value = pair.price
  changePercent.value = pair.change
  showPairSelector.value = false
  searchKeyword.value = ''

  uni.showToast({
    title: `已切换到 ${pair.symbol}/${pairSymbol}`,
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.trade-content {
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部tabs */
.top-tabs {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  background-color: #ffffff;
  position: relative;
  z-index: 10;
}

.tabs-scroll {
  flex: 1;
  white-space: nowrap;
}

.tabs-wrapper {
  display: inline-flex;
  gap: 48rpx;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 0;
}

.tab-text {
  font-size: 28rpx;
  color: #707A8A;
  white-space: nowrap;
}

.tab-text.active {
  color: #0B0E11;
  font-weight: 600;
}

.menu-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
}

/* 交易对信息 */
.pair-info {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10rpx 32rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #F5F5F5;
  position: relative;
  z-index: 10;
}

.pair-left {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.pair-name {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.symbol {
  font-size: 34rpx;
  font-weight: 700;
  color: #0B0E11;
  line-height: 1;
}

.pair-change {
  display: flex;
  align-items: center;
}

.change-text {
  font-size: 28rpx;
  font-weight: 500;
}

.change-text.positive {
  color: #17b26a;
}

.change-text.negative {
  color: #f6465d;
}

.pair-right {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding-top: 8rpx;
}

.icon-kline {
  width: 34rpx;
  height: 34rpx;
}
.icon-more {
  width: 34rpx;
  height: 34rpx;
}

/* 可滚动内容区 */
.scroll-content {
  flex: 1;
  overflow-y: auto;
}

/* 主内容区 */
.main-content {
  flex-shrink: 0;
  display: flex;
  border-bottom: 1rpx solid #F5F5F5;
}

/* 底部工具栏 */
.orderbook-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  border-top: 1rpx solid #F5F5F5;
  background-color: #ffffff;
}

.precision-select {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background-color: #F5F5F5;
  border-radius: 6rpx;
}

.precision-text {
  font-size: 24rpx;
  color: #0B0E11;
}

.footer-icons {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.color-indicator {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.color-block {
  width: 24rpx;
  height: 8rpx;
  border-radius: 2rpx;
}

.color-block.red {
  background-color: #f6465d;
}

.color-block.green {
  background-color: #17b26a;
}

/* 右侧交易面板 */
.trade-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24rpx 32rpx;
  background-color: #ffffff;
}

/* 买入卖出切换 */
.trade-tabs {
  display: flex;
  margin-bottom: 10rpx;
  position: relative;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  padding: 4rpx;
}

.trade-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rpx 20rpx;
  border-radius: 6rpx;
  position: relative;
  z-index: 1;
  transition: all 0.3s;
}

.trade-tab.buy.active {
  background-color: #17b26a;
  clip-path: polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%);
}

.trade-tab.sell.active {
  background-color: #f6465d;
  clip-path: polygon(5% 0, 100% 0, 100% 100%, 5% 100%, 0 50%);
}

.trade-tab-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #707A8A;
}

.trade-tab.active .trade-tab-text {
  color: #ffffff;
  font-weight: 600;
}

/* 订单类型 */
.order-type {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 10rpx;
  padding: 5rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.order-type-select {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-type-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #0B0E11;
}

/* 输入组 */
.input-group {
  margin-bottom: 10rpx;
}

.input-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  box-sizing: border-box;
  height: 70rpx;
  gap: 4rpx;
}

.input-box.readonly {
  background-color: #FAFAFA;
}

.input-label {
  font-size: 16rpx;
  color: #B7BDC6;
  line-height: 1;
  text-align: center;
}

.input-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  width: 100%;
}

.input-btn {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 外部按钮容器 */
.input-row-outer {
  display: flex;
  align-items: center;
  gap: 24rpx;
    background-color: #F5F5F5;
}

.input-btn-outer {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0rpx 20rpx;;
}

.btn-icon {
  font-size: 40rpx;
  color: #D1D5DB;
  font-weight: 300;
  line-height: 1;
}

.input-field {
  flex: 1;
  font-size: 26rpx;
  color: #0B0E11;
  text-align: center;
  background-color: transparent;
  line-height: 1.2;
}

.input-value {
  width: 100%;
  font-size: 28rpx;
  color: #B7BDC6;
  text-align: center;
}

/* 滑块 */
.slider-wrapper {
  margin-top: 24rpx;
  margin-bottom: 24rpx;
  position: relative;
  padding: 0 14rpx;
}

.slider-container {
  position: relative;
}

.custom-slider-thumb {
  width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.thumb-diamond {
  width: 24rpx;
  height: 24rpx;
  background-color: #17b26a;
  border: 3rpx solid #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
  transform: rotate(45deg);
  z-index: 10;
}

/* 百分比提示框 */
.slider-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 16rpx;
  padding: 8rpx 16rpx;
  background-color: #0B0E11;
  border-radius: 6rpx;
  white-space: nowrap;
  z-index: 10;
}

.tooltip-text {
  font-size: 24rpx;
  color: #ffffff;
  line-height: 1;
}

.tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8rpx solid transparent;
  border-right: 8rpx solid transparent;
  border-top: 8rpx solid #0B0E11;
}

/* 复选框组 */
.checkbox-group {
  margin-bottom: 22rpx;
}

.checkbox-label {
  font-size: 28rpx;
  color: #0B0E11;
  margin-left: 16rpx;
}

/* 余额信息 */
.balance-section {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  margin-bottom: 22rpx;
}

.balance-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.balance-left {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.balance-label {
  font-size: 20rpx;
  color: #707A8A;
}

.balance-label.underline {
  border-bottom: 2rpx dashed #707A8A;
  padding-bottom: 2rpx;
}

.balance-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.balance-value {
  font-size: 20rpx;
  color: #0B0E11;
  font-weight: 500;
}

/* 交易按钮 */
.trade-button-wrapper {
  padding-top: 10rpx;
  flex-shrink: 0;
}

.trade-button {
  width: 100%;
  padding: 16rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trade-button.buy {
  background-color: #17b26a;
}

.trade-button.sell {
  background-color: #f6465d;
}

.button-text {
  font-size: 22rpx;
  font-weight: 600;
  color: #ffffff;
}

/* 底部订单区 */
.bottom-orders {
  flex-shrink: 0;
  background-color: #ffffff;
  border-top: 1rpx solid #F5F5F5;
  display: flex;
  flex-direction: column;
  padding-bottom: 20rpx;
}

/* 顶部提示 */
.orders-notice {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  background-color: #FFFAEB;
  border-bottom: 1rpx solid #F5F5F5;
  gap: 12rpx;
}

.notice-text {
  flex: 1;
  font-size: 24rpx;
  color: #0B0E11;
  line-height: 1.4;
}

.notice-link {
  font-size: 24rpx;
  color: #F0B90B;
  text-decoration: underline;
}

.order-tabs {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx 16rpx;
  background-color: #ffffff;
}

.order-tab {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-right: 48rpx;
  position: relative;
}

.order-tab-text {
  font-size: 28rpx;
  color: #707A8A;
  font-weight: 500;
}

.order-tab.active .order-tab-text {
  color: #0B0E11;
  font-weight: 600;
}

.order-tab-count {
  font-size: 28rpx;
  color: #707A8A;
}

.history-icon {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8rpx;
}

.history-icon-img {
  width: 32rpx;
  height: 32rpx;
}

.order-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 32rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #F5F5F5;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
  cursor: pointer;
}

.custom-checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #D1D5DB;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  flex-shrink: 0;
}

.custom-checkbox.checked {
  border-color: #17b26a;
  background-color: #ffffff;
}

.checkbox-text {
  font-size: 24rpx;
  color: #0B0E11;
  font-weight: 400;
  line-height: 1;
}

.cancel-all-btn {
  padding: 12rpx 32rpx;
  background-color: transparent;
  border: 2rpx solid #E5E7EB;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-all-btn:active {
  background-color: #F5F5F5;
}

.cancel-all-text {
  font-size: 24rpx;
  color: #0B0E11;
  font-weight: 400;
  line-height: 1;
}

/* 订单列表 */
.order-list {
  flex: 1;
}

.order-item-wrapper {
  display: flex;
  flex-direction: column;
}

.order-card {
  background-color: #ffffff;
  padding: 32rpx;
  border-bottom: 2rpx solid #F5F5F5;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.order-pair {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.order-symbol {
  font-size: 28rpx;
  font-weight: 600;
  color: #0B0E11;
}

.order-right {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.order-percent {
  font-size: 28rpx;
  font-weight: 600;
}

.order-percent.zero {
  color: #B7BDC6;
}

.order-percent.positive {
  color: #17b26a;
}

.order-action-btn {
  padding: 10rpx 28rpx;
  background-color: transparent;
  border: 1rpx solid #E5E7EB;
  border-radius: 6rpx;
}

.action-btn-text {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 400;
}

.order-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.order-info-row:last-child {
  margin-bottom: 0;
}

.order-label {
  font-size: 28rpx;
  color: #707A8A;
  font-weight: 400;
}

.order-side {
  font-size: 28rpx;
  font-weight: 400;
}

.order-side.buy {
  color: #17b26a;
}

.order-side.sell {
  color: #f6465d;
}

.order-time {
  flex: 1;
  text-align: right;
  font-size: 28rpx;
  color: #707A8A;
  font-weight: 400;
}

.order-value {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 400;
}

.order-price-edit {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.empty-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
}

/* 持仓列表 */
.holdings-list {
  flex: 1;
}

.holdings-header {
  padding: 24rpx 32rpx 16rpx;
  background-color: #ffffff;
}

.holdings-title {
  font-size: 28rpx;
  color: #707A8A;
  font-weight: 400;
}

.holdings-wrapper {
  display: flex;
  flex-direction: column;
}

.holding-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #F5F5F5;
}

.holding-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.coin-icon {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  border-radius: 50%;
  background-color: #F5F5F5;
}

.coin-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.coin-symbol {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
  line-height: 1;
}

.coin-name {
  font-size: 24rpx;
  color: #707A8A;
  font-weight: 400;
  line-height: 1;
}

.holding-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.coin-amount {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
  line-height: 1;
}

.coin-usdt {
  font-size: 24rpx;
  color: #707A8A;
  font-weight: 400;
  line-height: 1;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #B7BDC6;
  font-weight: 400;
}

/* 交易对选择弹窗 */
.pair-selector {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

/* 顶部标题栏 */
.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.selector-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx;
  cursor: pointer;
}

/* 搜索框 */
.search-wrapper {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #0B0E11;
}

.clear-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rpx;
  cursor: pointer;
}

/* 热门交易 */
.hot-section {
  flex: 1;
  overflow-y: auto;
  padding: 0 32rpx;
}

.section-header {
  padding: 24rpx 0 16rpx 0;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 1;
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
  cursor: pointer;
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
  display: flex;
  flex-direction: column;
}

/* 列表头部 */
.list-header {
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  background-color: #FAFAFA;
  border-bottom: 1rpx solid #F5F5F5;
  position: sticky;
  top: 0;
  z-index: 1;
}

.header-col {
  font-size: 24rpx;
  color: #B7BDC6;
  font-weight: 400;
}

.col-name {
  flex: 1;
}

.col-price {
  width: 200rpx;
  text-align: center;
}

.col-change {
  width: 160rpx;
  text-align: right;
}

/* 交易对列表 */
.pair-list {
  flex: 1;
  overflow-y: auto;
  min-height: 400rpx;
}

.pair-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #F5F5F5;
  cursor: pointer;
}

.pair-col {
  display: flex;
  align-items: center;
}

.pair-col.col-name {
  flex: 1;
  gap: 20rpx;
}

.pair-col.col-price {
  width: 200rpx;
  justify-content: center;
}

.pair-col.col-change {
  width: 160rpx;
  justify-content: flex-end;
}

.coin-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.coin-emoji {
  font-size: 36rpx;
}

.coin-symbol {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.price-value {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 400;
}

.change-value {
  font-size: 28rpx;
  font-weight: 500;
}

.change-value.positive {
  color: #17b26a;
}

.change-value.negative {
  color: #f6465d;
}

/* 无结果 */
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

/* 功能菜单弹窗 */
.function-menu {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding-bottom: 40rpx;
  min-height: 400rpx;
}

.function-header {
  padding: 32rpx 32rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.function-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.function-content {
  padding: 32rpx;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48rpx 32rpx;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  cursor: pointer;
}

.function-icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  background-color: #F5F5F5;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.function-icon-img {
  width: 48rpx;
  height: 48rpx;
}

.function-name {
  font-size: 24rpx;
  color: #0B0E11;
  text-align: center;
  line-height: 1.2;
}
</style>
