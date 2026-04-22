<template>
  <view class="contract-content">
    <view class="pair-info">
      <view class="pair-left" @click="showPairSelector = true">
        <view class="pair-name">
          <text class="symbol">{{ currentSymbol }}</text>
          <view class="tag-wrapper">
            <text class="tag">永续</text>
          </view>
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
    
    <scroll-view class="scroll-content" scroll-y>
      <view class="main-content">
        <!-- 左侧区域 -->
        <view class="left-section">
          <!-- 资金费率信息 -->
          <view class="contract-info">
            <view class="info-item">
              <text class="info-label">资金费率 <text class="info-highlight">(4时)</text>/倒计时</text>
            </view>
            <view class="info-item">
              <text class="info-value">{{ fundingRate }}</text>
            </view>
          </view>
          
          <!-- 盘口 -->
          <custom-depth
            :sell-orders="sellOrders"
            :buy-orders="buyOrders"
            :current-price="currentPrice"
            :price-label="currentPriceUsd"
            :price-change="changePercent"
            quote-currency="USD"
            base-currency="张"
          />
        </view>
        
        <!-- 右侧交易面板 -->
        <view class="trade-panel">
          <!-- 全仓/杠杆按钮组 -->
          <view class="leverage-buttons">
            <view class="leverage-btn" @click="showPositionModeSelector">
              <text class="leverage-btn-text">{{ positionMode === 'cross' ? '全仓' : '逐仓' }}</text>
            </view>
            <view class="leverage-btn" @click="showLeverageSelector">
              <text class="leverage-btn-text">{{ leverage }}x</text>
            </view>
          </view>
          
          <!-- 开仓/平仓切换 -->
          <view class="trade-tabs">
            <view 
              class="trade-tab open" 
              :class="{ active: tradeAction === 'open' }"
              @click="tradeAction = 'open'"
            >
              <text class="trade-tab-text">开仓</text>
            </view>
            <view 
              class="trade-tab close" 
              :class="{ active: tradeAction === 'close' }"
              @click="tradeAction = 'close'"
            >
              <text class="trade-tab-text">平仓</text>
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
                  <text class="input-label">价格 (USD)</text>
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
                  <text class="input-label">数量 (张)</text>
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
                  <text class="input-label">数量 (张)</text>
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
                  <text class="input-label">触发价 (USD)</text>
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
                  <text class="input-label">委托价 (USD)</text>
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
                  <text class="input-label">数量 (张)</text>
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
                  <text class="input-label">触发价 (USD)</text>
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
                  <text class="input-label">数量 (张)</text>
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
          
          <!-- 止盈止损（限价单和市价单显示） -->
          <view class="checkbox-group" v-if="currentOrderType === 0 || currentOrderType === 1">
            <view class="checkbox-wrapper" @click="showStopLoss = !showStopLoss">
              <view class="custom-checkbox" :class="{ checked: showStopLoss }">
                <u-icon v-if="showStopLoss" name="checkbox-mark" size="16" color="#17b26a" />
              </view>
              <text class="checkbox-text">止盈/止损</text>
            </view>
          </view>

          
          <view class="position-info">
            <view class="info-row">
              <text class="info-label">可用</text>
              <view class="info-value-with-icon">
                <text class="info-value">{{ availableBalance }} BTC</text>
                <u-icon name="plus-circle-fill" size="32" color="#F0B90B" />
              </view>
            </view>
            <view class="info-row">
              <text class="info-label">可开</text>
              <text class="info-value">{{ maxPosition }} 张</text>
            </view>
            <view class="info-row">
              <text class="info-label">保证金</text>
              <text class="info-value">{{ margin }} BTC</text>
            </view>
          </view>
          
          <view class="trade-buttons">
            <view class="trade-button long" @click="handleTrade('long')">
              <text class="button-text">开多</text>
              <text class="button-sub">看涨</text>
            </view>
          </view>
          
          <view class="position-info bottom-info">
            <view class="info-row">
              <text class="info-label">可开</text>
              <text class="info-value">0.000 张</text>
            </view>
            <view class="info-row">
              <text class="info-label">保证金</text>
              <text class="info-value">0 BTC</text>
            </view>
          </view>
          
          <view class="trade-buttons">
            <view class="trade-button short" @click="handleTrade('short')">
              <text class="button-text">开空</text>
              <text class="button-sub">看跌</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="bottom-orders">
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
          </view>
          <view class="order-tab-icon">
            <u-icon name="arrow-down" size="16" color="#707A8A" />
          </view>
        </view>
        
        <scroll-view class="order-list" scroll-y>
          <view class="empty-orders">
            <text class="empty-text">暂无订单</text>
          </view>
        </scroll-view>
      </view>
    </scroll-view>
    
    <!-- 保证金模式选择弹窗 -->
    <u-popup v-model="showPositionModePopup" mode="bottom" border-radius="24" :safe-area-inset-bottom="true">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">保证金模式</text>
        </view>
        
        <!-- 全仓选项 -->
        <view class="position-mode-item" :class="{ selected: positionMode === 'cross' }" @click="selectPositionMode('cross')">
          <view class="mode-content">
            <text class="mode-title">全仓</text>
            <text class="mode-desc">保证金资产相同的全仓仓位共享该资产的全仓保证金。在强平事件中，交易者可能会损失全部该保证金和该保证金资产下的所有全仓仓位。</text>
          </view>
        </view>
        
        <!-- 逐仓选项 -->
        <view class="position-mode-item" :class="{ selected: positionMode === 'isolated' }" @click="selectPositionMode('isolated')">
          <view class="mode-content">
            <text class="mode-title">逐仓</text>
            <text class="mode-desc">一定数量保证金被分配到仓位上。如果仓位保证金亏损到低于维持保证金的水平，仓位将被强平。在逐仓模式下，您可以为这个仓位添加和减少保证金。</text>
          </view>
        </view>
        
        <view class="popup-footer">
          <text class="footer-note">* 调整保证金模式仅对当前合约生效。</text>
          <view class="footer-link">
            <text class="link-text">默认杠杆和保证金模式</text>
            <u-icon name="arrow-right" size="24" color="#F0B90B" />
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
            <text class="section-title">热门永续合约</text>
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
                <text class="hot-pair">USD</text>
                <text class="hot-leverage">永续</text>
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
                  <text class="coin-symbol">{{ pair.symbol }}USD</text>
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
    
    <!-- 杠杆倍数调整弹窗 -->
    <u-popup v-model="showLeveragePopup" mode="bottom" border-radius="24" :safe-area-inset-bottom="true">
      <view class="popup-container leverage-popup">
        <view class="popup-header">
          <text class="popup-title">调整杠杆</text>
        </view>
        
        <view class="leverage-control">
          <view class="leverage-control-row">
            <view class="control-btn" @click="decreaseLeverage">
              <text class="control-btn-text">−</text>
            </view>
            <view class="leverage-display">
              <text class="leverage-value">{{ tempLeverage }}x</text>
            </view>
            <view class="control-btn" @click="increaseLeverage">
              <text class="control-btn-text">+</text>
            </view>
          </view>
        </view>
        
        <view class="leverage-quick-select">
          <view 
            class="quick-btn" 
            v-for="item in quickLeverages" 
            :key="item"
            :class="{ active: tempLeverage === item }"
            @click="selectQuickLeverage(item)"
          >
            <text class="quick-btn-text">{{ item }}x</text>
          </view>
        </view>
        
        <view class="leverage-info">
          <text class="info-text">* 当前杠杆倍数最高可开：10,000 BTC</text>
          <text class="info-text">杠杆调整将同时影响当前仓位和挂单的杠杆。</text>
          <text class="info-text warning">* 选择超过10x杠杆交易会增加强行平仓风险，请注意相关风险，更多信息请参考<text class="link">这里</text>。</text>
        </view>
        
        <view class="popup-actions">
          <view class="action-btn confirm" @click="confirmLeverage">
            <text class="action-btn-text">确认</text>
          </view>
        </view>
        
        <view class="popup-footer">
          <view class="footer-link centered">
            <text class="link-text">默认杠杆和保证金模式</text>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const currentSymbol = ref('BTCUSD')
const currentPrice = ref('91,292.4')
const currentPriceUsd = ref('91,292.9')
const changePercent = ref(-3.78)
const fundingRate = ref('0.01000% / 05:09:40')
const showPairSelector = ref(false)
const searchKeyword = ref('')
const positionMode = ref('cross')
const leverage = ref(20)
const tradeAction = ref('open')
const orderTypes = ref(['限价单', '市价单', '限价止盈止损', '市价止盈止损'])
const currentOrderType = ref(0)
const orderType = ref('limit')
const price = ref('91306.8')
const triggerPrice = ref('')
const amount = ref('')
const showStopLoss = ref(false)
const icebergOrder = ref(false)
const availableBalance = ref('0.00')
const maxPosition = ref('0')
const margin = ref('0')
const precision = ref('0.00001')
const buyRatio = ref(49.67)
const sellRatio = ref(50.33)
const sliderPercent = ref(0)
const showTooltip = ref(false)
const orderTabs = ref(['仓位 (0)', '当前委托'])
const currentOrderTab = ref(0)
const showPositionModePopup = ref(false)
const showLeveragePopup = ref(false)
const tempLeverage = ref(20)
const quickLeverages = ref([1, 10, 30, 100])

// 热门交易对数据
const hotPairs = ref([
  { symbol: 'BTC', price: '91,292.4', change: -3.78, icon: '🟠', iconBg: '#F7931A' },
  { symbol: 'ETH', price: '3936.86', change: -0.18, icon: '💎', iconBg: '#627EEA' },
  { symbol: 'SOL', price: '186.31', change: 0.39, icon: '🟣', iconBg: '#9945FF' },
  { symbol: 'BNB', price: '1081.4', change: -2.02, icon: '🟡', iconBg: '#F3BA2F' },
  { symbol: 'XRP', price: '2.4615', change: 3.55, icon: '⚪', iconBg: '#00AAE4' }
])

// 所有交易对列表数据
const allPairs = ref([
  { symbol: 'BTC', price: '91,292.4', change: -3.78, icon: '🟠', iconBg: '#F7931A' },
  { symbol: 'ETH', price: '3936.86', change: -0.18, icon: '💎', iconBg: '#627EEA' },
  { symbol: 'SOL', price: '186.31', change: 0.39, icon: '🟣', iconBg: '#9945FF' },
  { symbol: 'BNB', price: '1081.4', change: -2.02, icon: '🟡', iconBg: '#F3BA2F' },
  { symbol: 'XRP', price: '2.4615', change: 3.55, icon: '⚪', iconBg: '#00AAE4' },
  { symbol: 'DOGE', price: '0.0823', change: -2.45, icon: '🐕', iconBg: '#C2A633' },
  { symbol: 'ADA', price: '1.0234', change: 5.21, icon: '🔷', iconBg: '#0033AD' },
  { symbol: 'DOT', price: '7.82', change: -1.34, icon: '🔴', iconBg: '#E6007A' },
  { symbol: 'MATIC', price: '0.8912', change: 3.15, icon: '🟣', iconBg: '#8247E5' }
])

const sellOrders = ref([
  { price: '91,293.4', amount: '1' },
  { price: '91,293.3', amount: '22' },
  { price: '91,292.9', amount: '1' },
  { price: '91,292.8', amount: '1' },
  { price: '91,292.6', amount: '25' }
])

const buyOrders = ref([
  { price: '91,292.3', amount: '812' },
  { price: '91,292.2', amount: '3' },
  { price: '91,292.1', amount: '3' },
  { price: '91,289.3', amount: '4' },
  { price: '91,288.1', amount: '1' }
])

onLoad((options) => {
  if (options.symbol) {
    currentSymbol.value = options.symbol
  }
})

// 数量输入事件
const onAmountInput = () => {
  // 根据输入的数量反向计算滑块位置
  const maxAmount = parseFloat(maxPosition.value.replace(/,/g, '')) || 0
  if (maxAmount > 0) {
    const currentAmount = parseFloat(amount.value) || 0
    const percent = Math.min(100, Math.max(0, (currentAmount / maxAmount) * 100))
    sliderPercent.value = Math.round(percent)
  }
}

const decreasePrice = () => {
  const p = parseFloat(price.value.replace(/,/g, '')) || 0
  price.value = Math.max(0, p - 0.1).toFixed(1)
}

const increasePrice = () => {
  const p = parseFloat(price.value.replace(/,/g, '')) || 0
  price.value = (p + 0.1).toFixed(1)
}

const decreaseAmount = () => {
  const a = parseFloat(amount.value) || 0
  amount.value = Math.max(0, a - 1).toString()
}

const increaseAmount = () => {
  const a = parseFloat(amount.value) || 0
  amount.value = (a + 1).toString()
}

// 触发价增减
const decreaseTriggerPrice = () => {
  const p = parseFloat(triggerPrice.value.replace(/,/g, '')) || 0
  triggerPrice.value = Math.max(0, p - 0.1).toFixed(1)
}

const increaseTriggerPrice = () => {
  const p = parseFloat(triggerPrice.value.replace(/,/g, '')) || 0
  triggerPrice.value = (p + 0.1).toFixed(1)
}

const onSliderChange = (value) => {
  sliderPercent.value = value
  // 根据百分比计算数量
  const maxAmount = parseFloat(maxPosition.value.replace(/,/g, '')) || 0
  const calculatedAmount = (maxAmount * value / 100)
  amount.value = calculatedAmount > 0 ? calculatedAmount.toFixed(0) : ''
}

const onSliderStart = () => {
  showTooltip.value = true
}

const onSliderMoving = () => {
  showTooltip.value = true
}

const onSliderEnd = () => {
  showTooltip.value = false
}

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
      } else if (currentOrderType.value === 3) {
        // 市价止盈止损
        price.value = ''
        if (!triggerPrice.value) {
          triggerPrice.value = currentPrice.value
        }
      } else if (currentOrderType.value === 2) {
        // 限价止盈止损
        if (!price.value) {
          price.value = currentPrice.value
        }
        if (!triggerPrice.value) {
          triggerPrice.value = currentPrice.value
        }
      }
    }
  })
}

// 显示仓位模式选择器
const showPositionModeSelector = () => {
  showPositionModePopup.value = true
}

// 选择仓位模式
const selectPositionMode = (mode) => {
  positionMode.value = mode
  showPositionModePopup.value = false
  uni.showToast({
    title: mode === 'cross' ? '已切换至全仓' : '已切换至逐仓',
    icon: 'none'
  })
}

// 显示杠杆倍数选择器
const showLeverageSelector = () => {
  tempLeverage.value = leverage.value
  showLeveragePopup.value = true
}

// 减少杠杆倍数
const decreaseLeverage = () => {
  if (tempLeverage.value > 1) {
    tempLeverage.value--
  }
}

// 增加杠杆倍数
const increaseLeverage = () => {
  if (tempLeverage.value < 100) {
    tempLeverage.value++
  }
}

// 快捷选择杠杆
const selectQuickLeverage = (value) => {
  tempLeverage.value = value
}

// 确认杠杆设置
const confirmLeverage = () => {
  leverage.value = tempLeverage.value
  showLeveragePopup.value = false
  uni.showToast({
    title: `杠杆已设置为${leverage.value}x`,
    icon: 'none'
  })
}

const handleTrade = (direction) => {
  if (!price.value || !amount.value) {
    uni.showToast({
      title: '请输入价格和数量',
      icon: 'none'
    })
    return
  }
  
  const directionText = direction === 'long' ? '开多' : '开空'
  uni.showToast({
    title: `${directionText}成功`,
    icon: 'success'
  })
  
  amount.value = ''
}

// 清除搜索关键词
const clearSearchKeyword = () => {
  searchKeyword.value = ''
}

// 过滤后的交易对列表
const filteredPairs = computed(() => {
  if (!searchKeyword.value) {
    return []
  }
  
  const keyword = searchKeyword.value.trim().toUpperCase()
  return allPairs.value.filter(pair => 
    pair.symbol.toUpperCase().includes(keyword)
  )
})

// 选择交易对
const selectPair = (pair) => {
  currentSymbol.value = pair.symbol + 'USD'
  currentPrice.value = pair.price
  currentPriceUsd.value = pair.price
  changePercent.value = pair.change
  showPairSelector.value = false
  searchKeyword.value = ''
  
  uni.showToast({
    title: `已切换到 ${pair.symbol}USD 永续`,
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.contract-content {
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-tabs {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #F5F5F5;
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
  padding: 12rpx 0;
}

.tab-text {
  font-size: 28rpx;
  color: #707A8A;
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

.pair-info {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  padding: 10rpx 32rpx;
  background-color: #ffffff;
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

.tag-wrapper {
  padding: 4rpx 8rpx;
  background-color: #FFF7E6;
  border-radius: 4rpx;
}

.tag {
  font-size: 20rpx;
  color: #F0B90B;
}

.pair-change {
  display: flex;
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

.contract-info {
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  background-color: #FAFAFA;
  border-bottom: 1rpx solid #F5F5F5;
}

.info-row-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-item {
  display: flex;
  justify-content: space-between;
}

.info-label {
  font-size: 24rpx;
  color: #707A8A;
}

.info-value {
  font-size: 24rpx;
  color: #0B0E11;
  font-weight: 500;
}

.scroll-content {
  flex: 1;
  height: 0;
}

.main-content {
  display: flex;
  border-bottom: 1rpx solid #F5F5F5;
}

/* 左侧区域（资金费率+盘口） */
.left-section {
  width: 300rpx;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.contract-info {
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  background-color: #FAFAFA;
  border-bottom: 1rpx solid #F5F5F5;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 20rpx;
  color: #707A8A;
  margin-bottom: 8rpx;
}

.info-highlight {
  color: #f6465d;
}

.info-value {
  font-size: 20rpx;
  color: #0B0E11;
  font-weight: 500;
}

.trade-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0rpx 32rpx;
  background-color: #ffffff;
}

/* 全仓/杠杆按钮组 */
.leverage-buttons {
  display: flex;
  gap: 16rpx;
  margin-bottom: 10rpx;
}

.leverage-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  height: 44rpx;
}

.leverage-btn-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #0B0E11;
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

.trade-tab.open.active {
  background-color: #17b26a;
  clip-path: polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%);
}

.trade-tab.close.active {
  background-color: #f6465d;
  clip-path: polygon(5% 0, 100% 0, 100% 100%, 5% 100%, 0 50%);
}

.trade-tab-text {
  font-size: 28rpx;
  color: #707A8A;
  font-weight: 500;
}

.trade-tab.active .trade-tab-text {
  color: #ffffff;
  font-weight: 600;
}

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

.available-balance {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.balance-left {
  display: flex;
}

.balance-right {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.balance-label {
  font-size: 20rpx;
  color: #707A8A;
}

.balance-value {
  font-size: 20rpx;
  color: #0B0E11;
  font-weight: 500;
}

.input-group {
  margin-bottom: 10rpx;
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
  margin: 0rpx 20rpx;
}

.btn-icon {
  font-size: 40rpx;
  color: #D1D5DB;
  font-weight: 300;
  line-height: 1;
}

.input-box {
  flex: 1;
  min-width: 0;
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

.input-field {
  flex: 1;
  font-size: 26rpx;
  color: #0B0E11;
  text-align: center;
  background-color: transparent;
  line-height: 1.2;
}

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

.checkbox-group {
  margin-bottom: 22rpx;
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
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 400;
  line-height: 1;
}

.input-box.readonly {
  background-color: #F5F5F5;
  border-radius: 8rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 24rpx;
}

.input-box.readonly .input-label {
  font-size: 26rpx;
  color: #707A8A;
  text-align: center;
}

.position-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.position-info.bottom-info {
  margin-top: 16rpx;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-label {
  font-size: 20rpx;
  color: #707A8A;
}

.info-value {
  font-size: 20rpx;
  color: #0B0E11;
  font-weight: 500;
}

.info-value-with-icon {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.info-value-with-icon .info-value {
  font-size: 20rpx;
  color: #0B0E11;
  font-weight: 500;
}

.trade-buttons {
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

.trade-button.long {
  background-color: #17b26a;
}

.trade-button.short {
  background-color: #f6465d;
}

.button-text {
  font-size: 22rpx;
  font-weight: 600;
  color: #ffffff;
}

.button-sub {
  font-size: 22rpx;
  color: #ffffff;
  font-weight: 600;
  margin-left: 16rpx;
}

.bottom-orders {
  flex-shrink: 0;
  background-color: #ffffff;
  border-top: 1rpx solid #F5F5F5;
  display: flex;
  flex-direction: column;
  padding-bottom: 20rpx;
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

.order-tab-icon {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-list {
  flex: 1;
}

.empty-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #B7BDC6;
  font-weight: 400;
}
/* 弹窗样式 */
.popup-container {
  background-color: #ffffff;
  padding: 32rpx;
}

.popup-header {
  margin-bottom: 32rpx;
}

.popup-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #0B0E11;
}

.position-mode-item {
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #E5E7EB;
  border-radius: 12rpx;
  background-color: #FAFAFA;
}

.position-mode-item.selected {
  border-color: #0B0E11;
  background-color: #ffffff;
}

.mode-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.mode-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.mode-desc {
  font-size: 24rpx;
  color: #707A8A;
  line-height: 1.6;
}

.popup-footer {
  margin-top: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.footer-note {
  font-size: 24rpx;
  color: #707A8A;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.link-text {
  font-size: 28rpx;
  color: #F0B90B;
  font-weight: 500;
}

/* 杠杆弹窗样式 */
.leverage-popup {
  padding-bottom: 48rpx;
}

.leverage-control {
  padding: 32rpx 0 0 0;
}

.leverage-control-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48rpx;
  background-color: #F5F5F5;
  padding: 24rpx;
  border-radius: 12rpx;
}

.control-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 8rpx;
  border: 1rpx solid #E5E7EB;
}

.control-btn-text {
  font-size: 40rpx;
  color: #707A8A;
  font-weight: 300;
  line-height: 1;
}

.leverage-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.leverage-value {
  font-size: 56rpx;
  font-weight: 600;
  color: #0B0E11;
}

.leverage-quick-select {
  display: flex;
  gap: 16rpx;
  padding: 22rpx 0;
}

.quick-btn {
  flex: 1;
  padding: 10rpx;
  background-color: #F5F5F5;
  border: 2rpx solid #E5E7EB;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
}

.quick-btn.active {
  background-color: #0B0E11;
  border-color: #0B0E11;
}

.quick-btn-text {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.quick-btn.active .quick-btn-text {
  color: #ffffff;
}

.leverage-info {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  margin-bottom: 32rpx;
}

.info-text {
  font-size: 24rpx;
  color: #707A8A;
  line-height: 1.6;
}

.info-text.warning {
  color: #707A8A;
}

.info-text .link {
  color: #F0B90B;
  text-decoration: underline;
}

.popup-actions {
  margin-bottom: 24rpx;
}

.action-btn {
  width: 100%;
  padding: 24rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.confirm {
  background-color: #F0B90B;
}

.action-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.footer-link.centered {
  justify-content: center;
}

/* 交易对选择器样式 */
.pair-selector {
  background-color: #ffffff;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.selector-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.selector-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #0B0E11;
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-wrapper {
  flex-shrink: 0;
  padding: 24rpx 32rpx;
  background-color: #ffffff;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #0B0E11;
  background-color: transparent;
}

.clear-search-btn {
  width: 30rpx;
  height: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hot-section {
  flex: 1;
  padding: 0 32rpx 32rpx;
  overflow-y: auto;
}

.section-header {
  padding: 24rpx 0 16rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #0B0E11;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 16rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
}

.hot-rank {
  width: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #707A8A;
  text-align: center;
}

.hot-rank.top-three {
  color: #F0B90B;
}

.hot-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.hot-symbol {
  font-size: 30rpx;
  font-weight: 600;
  color: #0B0E11;
}

.hot-pair {
  font-size: 28rpx;
  color: #707A8A;
}

.hot-leverage {
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  color: #F0B90B;
  background-color: #FFF7E6;
  border-radius: 4rpx;
  margin-left: 8rpx;
}

.hot-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.hot-price {
  font-size: 28rpx;
  font-weight: 500;
  color: #0B0E11;
}

.hot-change {
  font-size: 24rpx;
  font-weight: 500;
}

.hot-change.positive {
  color: #17b26a;
}

.hot-change.negative {
  color: #f6465d;
}

.search-results {
  flex: 1;
  padding: 0 32rpx 32rpx;
  overflow-y: auto;
}

.list-header {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.header-col {
  font-size: 24rpx;
  color: #707A8A;
  font-weight: 500;
}

.col-name {
  flex: 2;
}

.col-price {
  flex: 1.5;
  text-align: right;
}

.col-change {
  flex: 1;
  text-align: right;
}

.pair-list {
  max-height: 500rpx;
}

.pair-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.pair-col {
  display: flex;
  align-items: center;
}

.pair-col.col-name {
  flex: 2;
  gap: 16rpx;
}

.pair-col.col-price {
  flex: 1.5;
  justify-content: flex-end;
}

.pair-col.col-change {
  flex: 1;
  justify-content: flex-end;
}

.coin-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.coin-emoji {
  font-size: 28rpx;
}

.coin-symbol {
  font-size: 28rpx;
  font-weight: 500;
  color: #0B0E11;
}

.price-value {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
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

.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
  gap: 16rpx;
}

.no-result-text {
  font-size: 28rpx;
  color: #B7BDC6;
}
</style>
