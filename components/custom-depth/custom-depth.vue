<template>
  <view class="orderbook-panel">
    <view class="price-header">
      <view class="header-item">
        <text class="header-label">价格</text>
        <text class="header-label">({{ quoteCurrency }})</text>
      </view>
      <view class="header-item right">
        <text class="header-label">数量</text>
        <text class="header-label">({{ baseCurrency }})</text>
      </view>
    </view>
    
    <!-- 卖单区 -->
    <view class="orderbook-list sell-orders">
      <view 
        class="order-item sell-item" 
        v-for="(order, index) in displaySellOrders" 
        :key="'sell-' + index"
        :style="{ backgroundImage: 'linear-gradient(to left, rgba(246, 70, 93, 0.12) ' + order.progress + '%, transparent ' + order.progress + '%)' }"
      >
        <text class="order-price sell">{{ order.price }}</text>
        <text class="order-amount">{{ order.amount }}</text>
      </view>
    </view>
    
    <!-- 当前价格 -->
    <view class="current-price">
      <text class="price-large" :class="priceChange >= 0 ? 'positive' : 'negative'">
        {{ currentPrice }}
      </text>
      <text class="price-usd">{{ priceLabel }}</text>
    </view>
    
    <!-- 买单区 -->
    <view class="orderbook-list buy-orders">
      <view 
        class="order-item buy-item" 
        v-for="(order, index) in displayBuyOrders" 
        :key="'buy-' + index"
        :style="{ backgroundImage: 'linear-gradient(to left, rgba(23, 178, 106, 0.12) ' + order.progress + '%, transparent ' + order.progress + '%)' }"
      >
        <text class="order-price buy">{{ order.price }}</text>
        <text class="order-amount">{{ order.amount }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  // 卖单数据
  sellOrders: {
    type: Array,
    default: () => []
  },
  // 买单数据
  buyOrders: {
    type: Array,
    default: () => []
  },
  // 当前价格
  currentPrice: {
    type: String,
    default: ''
  },
  // 价格标签（如 ≈ $3,025.81）
  priceLabel: {
    type: String,
    default: ''
  },
  // 价格变化百分比（用于显示红绿色）
  priceChange: {
    type: Number,
    default: 0
  },
  // 计价货币（USDT、USD等）
  quoteCurrency: {
    type: String,
    default: 'USDT'
  },
  // 基础货币（BTC、ETH等）
  baseCurrency: {
    type: String,
    default: 'BTC'
  }
})

/**
 * 解析数量字符串为数字
 * @param {String|Number} val - 数量值
 * @returns {Number} 解析后的数字
 */
const parseAmount = (val) => {
  if (typeof val === 'number') return val
  if (typeof val !== 'string') return 0
  
  let num = val.replace(/,/g, '')
  
  // 处理K(千)、M(百万)等单位
  if (num.includes('K')) {
    return parseFloat(num.replace('K', '')) * 1000
  }
  if (num.includes('M')) {
    return parseFloat(num.replace('M', '')) * 1000000
  }
  
  return parseFloat(num) || 0
}

/**
 * 解析价格字符串为数字
 * @param {String|Number} val - 价格值
 * @returns {Number} 解析后的数字
 */
const parsePrice = (val) => {
  if (typeof val === 'number') return val
  if (typeof val !== 'string') return 0
  return parseFloat(val.replace(/,/g, '')) || 0
}

/**
 * 计算累积进度条
 * 取前5条数据,计算每条的累积占比
 * @param {Array} orders - 订单列表
 * @param {String} type - 'sell'(从下往上累积) 或 'buy'(从上往下累积)
 * @returns {Array} 带progress字段的订单列表
 */
const calculateCumulativeProgress = (orders, type = 'buy') => {
  if (!orders || orders.length === 0) return []
  
  // 按价格从高到低排序(降序)
  const sortedOrders = [...orders].sort((a, b) => {
    const priceA = parsePrice(a.price)
    const priceB = parsePrice(b.price)
    return priceB - priceA  // 价格递减
  })
  
  // 只取前5条
  const topOrders = sortedOrders.slice(0, 5)
  
  // 计算总数量
  const totalAmount = topOrders.reduce((sum, order) => {
    return sum + parseAmount(order.amount)
  }, 0)
  
  if (totalAmount === 0) return topOrders.map(order => ({ ...order, progress: 15 }))
  
  if (type === 'sell') {
    // 卖单: 从下往上累积 (倒序计算)
    let cumulativeAmount = 0
    const reversedOrders = [...topOrders].reverse()
    
    const ordersWithProgress = reversedOrders.map(order => {
      cumulativeAmount += parseAmount(order.amount)
      const progress = Math.max(15, Math.min(100, (cumulativeAmount / totalAmount) * 100))
      return {
        ...order,
        progress: Math.round(progress)
      }
    })
    
    // 再反转回原来的顺序(价格从高到低)
    return ordersWithProgress.reverse()
  } else {
    // 买单: 从上往下累积
    let cumulativeAmount = 0
    return topOrders.map(order => {
      cumulativeAmount += parseAmount(order.amount)
      const progress = Math.max(15, Math.min(100, (cumulativeAmount / totalAmount) * 100))
      return {
        ...order,
        progress: Math.round(progress)
      }
    })
  }
}

// 计算卖单显示数据(带累积进度,从下往上累积)
const displaySellOrders = computed(() => calculateCumulativeProgress(props.sellOrders, 'sell'))

// 计算买单显示数据(带累积进度,从上往下累积)
const displayBuyOrders = computed(() => calculateCumulativeProgress(props.buyOrders, 'buy'))
</script>

<style scoped lang="scss">
.orderbook-panel {
  width: 300rpx;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-right: 1rpx solid #F5F5F5;
}

.price-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx 12rpx;
  background-color: #ffffff;
  flex-shrink: 0;
}

.header-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.header-item.right {
  align-items: flex-end;
}

.header-label {
  font-size: 24rpx;
  color: #B7BDC6;
  line-height: 1.2;
}

.orderbook-list {
  flex: 1;
  min-height: 0;
}

.order-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rpx 24rpx;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: right center;
}

.order-price {
  font-size: 26rpx;
  font-weight: 400;
  position: relative;
  z-index: 1;
}

.order-price.sell {
  color: #f6465d;
}

.order-price.buy {
  color: #17b26a;
}

.order-amount {
  font-size: 26rpx;
  color: #0B0E11;
  font-weight: 400;
  position: relative;
  z-index: 1;
}

.current-price {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 24rpx;
  background-color: #ffffff;
  gap: 8rpx;
}

.price-large {
  font-size: 40rpx;
  font-weight: 600;
  line-height: 1;
}

.price-large.positive {
  color: #17b26a;
}

.price-large.negative {
  color: #f6465d;
}

.price-usd {
  font-size: 24rpx;
  color: #B7BDC6;
}
</style>
