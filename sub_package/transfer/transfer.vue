<template>
  <view class="transfer-page">
    <!-- 顶部导航栏 -->
    <custom-navbar title="划转" :show-back="true" back-path="/pages/asset/asset">
      <template #right>
        <u-icon name="clock" size="40" color="#0B0E11"></u-icon>
      </template>
    </custom-navbar>

    <!-- 划转方向 -->
    <view class="transfer-direction">
      <view class="direction-item">
        <text class="direction-label">从</text>
        <view class="direction-selector" @click="showFromWallet = true">
          <text class="wallet-name">{{ fromWallet ? fromWallet.name : '请选择' }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      
      <view class="swap-icon" @click="swapWallet">
        <u-icon name="reload" size="32" color="#0B0E11"></u-icon>
      </view>
      
      <view class="direction-item">
        <text class="direction-label">到</text>
        <view class="direction-selector" @click="showToWallet = true">
          <text class="wallet-name">{{ toWallet ? toWallet.name : '请选择' }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </view>

    <!-- 逐仓杠杆交易对选择 -->
    <view class="pair-section" v-if="needSelectPair">
      <view class="pair-selector" @click="showPairPicker = true">
        <text class="pair-label">{{ selectedPair || '请选择交易对' }}</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>

    <!-- 币种选择 -->
    <view class="coin-section" v-if="!needSelectPair || (needSelectPair && selectedPair)">
      <text class="section-label">币种</text>
      
      <!-- 逐仓杠杆：显示交易对的两个币种 -->
      <view v-if="needSelectPair && selectedPair" class="pair-coins-wrapper">
        <view class="pair-coins">
          <view 
            class="coin-card" 
            :class="{ active: selectedTransferCoin === pairCoins.base }"
            @click="selectTransferCoin(pairCoins.base)"
          >
            <view class="coin-card-header">
              <view class="coin-icon">
                <u-icon name="photo" size="32" color="#8B7FF8"></u-icon>
              </view>
              <view class="coin-info-text">
                <text class="coin-name">{{ pairCoins.base }}</text>
                <text class="coin-subtitle">{{ pairCoins.base }}</text>
              </view>
            </view>
            <text class="coin-balance">{{ getPairCoinBalance(pairCoins.base) }}</text>
          </view>
          
          <view 
            class="coin-card" 
            :class="{ active: selectedTransferCoin === pairCoins.quote }"
            @click="selectTransferCoin(pairCoins.quote)"
          >
            <view class="coin-card-header">
              <view class="coin-icon">
                <u-icon name="photo" size="32" color="#4A90E2"></u-icon>
              </view>
              <view class="coin-info-text">
                <text class="coin-name">{{ pairCoins.quote }}</text>
                <text class="coin-subtitle">{{ pairCoins.quote }}</text>
              </view>
            </view>
            <text class="coin-balance">{{ getPairCoinBalance(pairCoins.quote) }}</text>
          </view>
        </view>
        
        <text class="coin-tip" v-if="selectedTransferCoin && getPairCoinBalance(selectedTransferCoin) === '0'">当前币种无可划转资产，请选择其他币种</text>
      </view>
      
      <!-- 普通账户：正常选择币种 -->
      <view v-else class="coin-selector" @click="showCoinPicker = true">
        <view class="coin-info">
          <view class="coin-icon">
            <u-icon name="photo" size="32" color="#F0B90B"></u-icon>
          </view>
          <view class="coin-details">
            <text class="coin-name">{{ selectedCoin.name }}</text>
            <text class="coin-fullname">{{ selectedCoin.fullname }}</text>
          </view>
        </view>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>

    <!-- 数量输入 -->
    <view class="amount-section">
      <text class="section-label">数量</text>
      <view class="amount-input-wrapper">
        <input 
          class="amount-input" 
          type="digit" 
          v-model="amount"
          placeholder="最少 0.00000001"
        />
        <view class="amount-right">
          <text class="coin-unit">{{ selectedCoin.name }}</text>
          <text class="max-btn" @click="setMaxAmount">最大</text>
        </view>
      </view>
      <text class="available-amount">可用 {{ getAvailableAmount() }} {{ getCurrentCoin() }}</text>
    </view>

    <!-- 确认按钮 -->
    <view class="transfer-footer">
      <view class="confirm-btn" :class="{ disabled: !canConfirm }" @click="confirmTransfer">
        <text>确认划转</text>
      </view>
    </view>

    <!-- 钱包选择弹窗（从） -->
    <u-popup v-model="showFromWallet" mode="bottom" border-radius="24">
      <view class="wallet-picker">
        <text class="picker-title">选择钱包</text>
        <view 
          class="wallet-item" 
          v-for="(wallet, index) in walletList" 
          :key="index"
          :class="{ active: fromWallet && fromWallet.code === wallet.code }"
          @click="selectFromWallet(wallet)"
        >
          <view class="wallet-item-left">
            <text class="iconfont" :class="wallet.icon"></text>
            <view class="wallet-item-info">
              <text class="wallet-item-name">{{ wallet.name }}</text>
              <text class="wallet-item-amount">{{ wallet.amount }} {{ selectedCoin.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 钱包选择弹窗（到） -->
    <u-popup v-model="showToWallet" mode="bottom" border-radius="24">
      <view class="wallet-picker">
        <text class="picker-title">选择钱包</text>
        <view 
          class="wallet-item" 
          v-for="(wallet, index) in walletList" 
          :key="index"
          :class="{ active: toWallet && toWallet.code === wallet.code }"
          @click="selectToWallet(wallet)"
        >
          <view class="wallet-item-left">
            <text class="iconfont" :class="wallet.icon"></text>
            <view class="wallet-item-info">
              <text class="wallet-item-name">{{ wallet.name }}</text>
              <text class="wallet-item-amount">{{ wallet.amount }} {{ selectedCoin.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 交易对选择弹窗 -->
    <u-popup v-model="showPairPicker" mode="bottom" border-radius="24" height="60%">
      <view class="pair-picker">
        <view class="picker-header">
          <text class="iconfont icon-arrow-left" @click="showPairPicker = false"></text>
          <text class="picker-title">选择交易对</text>
          <view style="width: 32rpx;"></view>
        </view>
        
        <view class="search-bar">
          <text class="iconfont icon-search"></text>
          <input class="search-input" placeholder="请输入关键字搜索" v-model="pairSearchKeyword" />
          <text class="iconfont icon-delete" v-if="pairSearchKeyword" @click="pairSearchKeyword = ''"></text>
        </view>

        <scroll-view class="pair-list" scroll-y>
          <view 
            class="pair-list-item" 
            v-for="(pair, index) in filteredPairList" 
            :key="index"
            :class="{ active: selectedPair === pair.symbol }"
            @click="selectPair(pair)"
          >
            <text class="pair-symbol">{{ pair.symbol }}</text>
          </view>
        </scroll-view>
      </view>
    </u-popup>

    <!-- 币种选择弹窗 -->
    <u-popup v-model="showCoinPicker" mode="bottom" border-radius="24" height="80%">
      <view class="coin-picker">
        <view class="picker-header">
          <text class="iconfont icon-arrow-left" @click="showCoinPicker = false"></text>
          <text class="picker-title">选择币种</text>
          <view style="width: 32rpx;"></view>
        </view>
        
        <view class="search-bar">
          <text class="iconfont icon-search"></text>
          <input class="search-input" placeholder="请输入关键字搜索" v-model="searchKeyword" />
          <text class="iconfont icon-delete" v-if="searchKeyword" @click="searchKeyword = ''"></text>
        </view>

        <view class="coin-history" v-if="!searchKeyword && coinHistory.length > 0">
          <view class="history-header">
            <text class="history-title">历史搜索</text>
            <text class="iconfont icon-delete" @click="clearHistory"></text>
          </view>
          <view class="history-list">
            <view 
              class="history-coin" 
              v-for="(coin, index) in coinHistory" 
              :key="index"
              @click="selectCoin(coin)"
            >
              {{ coin.name }}
            </view>
          </view>
        </view>

        <view class="coin-list-header">
          <text class="list-title">币种列表</text>
          <text class="sort-btn">A-Z</text>
        </view>

        <scroll-view class="coin-list" scroll-y>
          <view 
            class="coin-list-item" 
            v-for="(coin, index) in filteredCoinList" 
            :key="index"
            @click="selectCoin(coin)"
          >
            <view class="coin-item-left">
              <view class="coin-item-icon">
                <u-icon name="photo" size="32" color="#F0B90B"></u-icon>
              </view>
              <view class="coin-item-info">
                <text class="coin-item-name">{{ coin.name }}</text>
                <text class="coin-item-fullname">{{ coin.fullname }}</text>
              </view>
            </view>
            <view class="coin-item-right">
              <text class="coin-item-amount">{{ coin.amount }}</text>
              <text class="coin-item-value">{{ coin.value }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

// 钱包类型模板（前端写死的类型配置）
const walletTypeTemplate = [
  { code: 'FUNDING', name: '资金', icon: 'icon-fund' },
  { code: 'SPOT', name: '现货账户', icon: 'icon-wallet' },
  { code: 'ISOLATED_MARGIN', name: '逐仓杠杆', icon: 'icon-leverage' },
  { code: 'CROSS_MARGIN', name: '全仓杠杆账户', icon: 'icon-leverage' },
  { code: 'COIN_FUTURES', name: '币本位合约账户', icon: 'icon-contract' },
  { code: 'USDT_FUTURES', name: 'U本位合约账户', icon: 'icon-contract' },
]

// 钱包列表（动态数据，通过后台返回的code匹配）
const walletList = ref([])

// 交易对列表（用于逐仓杠杆）
const pairList = ref([
  { symbol: 'AAVE/USDC' },
  { symbol: 'BTC/USDT' },
  { symbol: 'ETH/USDT' },
  { symbol: 'BNB/USDT' },
])

// 交易对搜索关键字
const pairSearchKeyword = ref('')

// 当前选择的交易对
const selectedPair = ref('')

// 当前选择的划转币种（逐仓杠杆时使用）
const selectedTransferCoin = ref('')

// 币种列表
const coinList = ref([
  { name: 'BNB', fullname: 'BNB', amount: '0.00000328', value: '$0.002968' },
  { name: 'USDC', fullname: 'USDC', amount: '0.00004046', value: '$0.000040' }
])

// 币种历史搜索
const coinHistory = ref([
  { name: 'BNB', fullname: 'BNB' }
])

// 当前选择
const fromWallet = ref(null)
const toWallet = ref(null)
const selectedCoin = ref(coinList.value[0])
const amount = ref('')
const searchKeyword = ref('')

// 弹窗控制
const showFromWallet = ref(false)
const showToWallet = ref(false)
const showCoinPicker = ref(false)
const showPairPicker = ref(false)

// 筛选后的币种列表
const filteredCoinList = computed(() => {
  if (!searchKeyword.value) return coinList.value
  return coinList.value.filter(coin => 
    coin.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    coin.fullname.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 筛选后的交易对列表
const filteredPairList = computed(() => {
  if (!pairSearchKeyword.value) return pairList.value
  return pairList.value.filter(pair => 
    pair.symbol.toLowerCase().includes(pairSearchKeyword.value.toLowerCase())
  )
})

// 是否需要选择交易对（逐仓杠杆需要）
const needSelectPair = computed(() => {
  return (fromWallet.value && fromWallet.value.code === 'ISOLATED_MARGIN') ||
         (toWallet.value && toWallet.value.code === 'ISOLATED_MARGIN')
})

// 解析交易对，拆分为基础币和报价币
const pairCoins = computed(() => {
  if (!selectedPair.value) {
    return { base: '', quote: '' }
  }
  const [base, quote] = selectedPair.value.split('/')
  return { base, quote }
})

// 是否可以确认
const canConfirm = computed(() => {
  // 基本条件检查
  if (!amount.value || parseFloat(amount.value) <= 0 || !fromWallet.value || !toWallet.value) {
    return false
  }
  
  // 检查钱包不能相同
  if (fromWallet.value.code === toWallet.value.code) {
    return false
  }
  
  // 如果涉及逐仓杠杆，必须选择交易对和币种
  if (needSelectPair.value) {
    if (!selectedPair.value || !selectedTransferCoin.value) {
      return false
    }
  }
  
  return true
})

// 页面加载时获取数据
onMounted(() => {
  getWalletList()
})

// 交换钱包
const swapWallet = () => {
  const temp = fromWallet.value
  fromWallet.value = toWallet.value
  toWallet.value = temp
}

// 选择来源钱包
const selectFromWallet = (wallet) => {
  if (toWallet.value && wallet.code === toWallet.value.code) {
    uni.showToast({
      title: '来源和目标钱包不能相同',
      icon: 'none'
    })
    return
  }
  fromWallet.value = wallet
  showFromWallet.value = false
  
  // 如果选择了逐仓杠杆，自动选择第一个交易对
  if (wallet.code === 'ISOLATED_MARGIN') {
    if (pairList.value.length > 0) {
      selectedPair.value = pairList.value[0].symbol
      // 自动选择第一个币种
      const [base] = selectedPair.value.split('/')
      selectTransferCoin(base)
    } else {
      selectedPair.value = ''
      selectedTransferCoin.value = ''
    }
  }
}

// 选择目标钱包
const selectToWallet = (wallet) => {
  if (fromWallet.value && wallet.code === fromWallet.value.code) {
    uni.showToast({
      title: '来源和目标钱包不能相同',
      icon: 'none'
    })
    return
  }
  toWallet.value = wallet
  showToWallet.value = false
  
  // 如果选择了逐仓杠杆，自动选择第一个交易对
  if (wallet.code === 'ISOLATED_MARGIN') {
    if (pairList.value.length > 0) {
      selectedPair.value = pairList.value[0].symbol
      // 自动选择第一个币种
      const [base] = selectedPair.value.split('/')
      selectTransferCoin(base)
    } else {
      selectedPair.value = ''
      selectedTransferCoin.value = ''
    }
  }
}

// 选择交易对
const selectPair = (pair) => {
  selectedPair.value = pair.symbol
  selectedTransferCoin.value = '' // 清空币种选择
  showPairPicker.value = false
}

// 选择划转币种（逐仓杠杆）
const selectTransferCoin = (coin) => {
  selectedTransferCoin.value = coin
  // 同步更新 selectedCoin
  selectedCoin.value = {
    name: coin,
    fullname: coin
  }
}

// 获取交易对币种余额
const getPairCoinBalance = (coin) => {
  // TODO: 从后台获取对应币种的余额
  // 这里暂时返回模拟数据
  const balances = {
    'AAVE': '0',
    'USDC': '0.00004046',
    'BTC': '0',
    'USDT': '100.5',
    'ETH': '0.5',
    'BNB': '2.3'
  }
  return balances[coin] || '0'
}

// 获取当前可用余额
const getAvailableAmount = () => {
  if (!fromWallet.value) return '0'
  
  if (needSelectPair.value && selectedTransferCoin.value) {
    return getPairCoinBalance(selectedTransferCoin.value)
  }
  
  return fromWallet.value.amount || '0'
}

// 获取当前币种名称
const getCurrentCoin = () => {
  if (needSelectPair.value && selectedTransferCoin.value) {
    return selectedTransferCoin.value
  }
  return selectedCoin.value.name
}

// 选择币种
const selectCoin = (coin) => {
  selectedCoin.value = coin
  showCoinPicker.value = false
  
  // 添加到历史记录
  const existIndex = coinHistory.value.findIndex(c => c.name === coin.name)
  if (existIndex === -1) {
    coinHistory.value.unshift(coin)
    if (coinHistory.value.length > 5) {
      coinHistory.value.pop()
    }
  }
}

// 清除历史
const clearHistory = () => {
  coinHistory.value = []
}

// 设置最大金额
const setMaxAmount = () => {
  amount.value = getAvailableAmount()
}

// 获取钱包列表数据
const getWalletList = async () => {
  try {
    // TODO: 调用后台接口获取钱包数据
    // const res = await uni.request({ url: '/api/wallet/list' })
    // const backendData = res.data.data
    
    // 模拟后台返回的数据
    const backendData = [
      { code: 'SPOT', amount: '0.00000328' },
      { code: 'ISOLATED_MARGIN', amount: '1.00970611' },
      { code: 'USDT_FUTURES', amount: '0' },
    ]
    
    // 将后台数据与前端模板匹配
    walletList.value = backendData.map(item => {
      const template = walletTypeTemplate.find(t => t.code === item.code)
      if (template) {
        return {
          code: item.code,
          name: template.name,
          icon: template.icon,
          amount: item.amount
        }
      }
      return null
    }).filter(item => item !== null)
    
    // 设置默认选择
    if (walletList.value.length > 0) {
      fromWallet.value = walletList.value[0]
      if (walletList.value.length > 1) {
        toWallet.value = walletList.value[1]
      }
    }
  } catch (error) {
    console.error('获取钱包列表失败:', error)
    uni.showToast({
      title: '获取钱包列表失败',
      icon: 'none'
    })
  }
}

// 确认划转
const confirmTransfer = () => {
  if (!canConfirm.value) return
  
  // TODO: 调用划转接口
  const params = {
    fromType: fromWallet.value.code,
    toType: toWallet.value.code,
    coin: needSelectPair.value ? selectedTransferCoin.value : selectedCoin.value.name,
    amount: amount.value
  }
  
  // 如果涉及逐仓杠杆，添加交易对参数
  if (needSelectPair.value) {
    params.symbol = selectedPair.value
  }
  
  console.log('划转参数:', params)
  
  uni.showToast({
    title: '划转成功',
    icon: 'success'
  })
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}
</script>

<style scoped lang="scss">
.transfer-page {
  min-height: 100vh;
  background-color: #ffffff;
}

/* 划转方向 */
.transfer-direction {
  background-color: #ffffff;
  padding: 28rpx;
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.direction-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.direction-label {
  font-size: 24rpx;
  color: #707A8A;
}

.direction-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
}

.wallet-name {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.swap-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F5F5F5;
  border-radius: 50%;
  margin-top: 36rpx;
}

/* 币种选择 */
.coin-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-top: 16rpx;
}

/* 逐仓杠杆交易对选择 */
.pair-section {
  background-color: #ffffff;
  padding: 32rpx;
}

.pair-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
}

.pair-label {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.section-label {
  font-size: 24rpx;
  color: #707A8A;
  display: block;
  margin-bottom: 16rpx;
}

.coin-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
}

.coin-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.coin-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin-details {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.coin-name {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 600;
}

.coin-fullname {
  font-size: 24rpx;
  color: #707A8A;
}

/* 逐仓杠杆币种卡片 */
.pair-coins-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.pair-coins {
  display: flex;
  gap: 16rpx;
}

.coin-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 8rpx;
  border: 2rpx solid #0B0E11;
}

.coin-card.active {
  border-color: #0B0E11;
  border-width: 3rpx;
}

.coin-card-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.coin-card .coin-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.coin-info-text {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.coin-card .coin-name {
  font-size: 32rpx;
  color: #0B0E11;
  font-weight: 600;
  line-height: 1;
}

.coin-card .coin-subtitle {
  font-size: 24rpx;
  color: #707A8A;
  line-height: 1;
}

.coin-balance {
  font-size: 32rpx;
  color: #0B0E11;
  font-weight: 400;
  padding-left: 60rpx;
}

.coin-tip {
  font-size: 24rpx;
  color: #F56C6C;
  margin-top: 16rpx;
  display: block;
  width: 100%;
}

/* 数量输入 */
.amount-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-top: 16rpx;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
}

.amount-input {
  flex: 1;
  font-size: 28rpx;
  color: #0B0E11;
}

.amount-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.coin-unit {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.max-btn {
  font-size: 28rpx;
  color: #F0B90B;
  font-weight: 500;
}

.available-amount {
  font-size: 24rpx;
  color: #707A8A;
  margin-top: 16rpx;
  display: block;
}


/* 确认按钮 */
.transfer-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #ffffff;
}

.confirm-btn {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F0B90B;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.confirm-btn.disabled {
  background-color: #E6E8EA;
  color: #B7BDC6;
}

/* 钱包选择弹窗 */
.wallet-picker {
  padding: 32rpx;
  max-height: 80vh;
}

.picker-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
  display: block;
  margin-bottom: 32rpx;
  text-align: center;
}

.wallet-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border: 2rpx solid transparent;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  background-color: #F5F5F5;
}

.wallet-item.active {
  border-color: #17b26a;
  background-color: #ffffff;
}

.wallet-item-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.wallet-item-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.wallet-item-name {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}

.wallet-item-amount {
  font-size: 24rpx;
  color: #707A8A;
}

/* 币种选择弹窗 */
.coin-picker {
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 32rpx;
  background-color: #F5F5F5;
  margin: 16rpx 32rpx;
  border-radius: 8rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #0B0E11;
}

.coin-history {
  padding: 0 32rpx;
  margin-bottom: 24rpx;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.history-title {
  font-size: 24rpx;
  color: #707A8A;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.history-coin {
  padding: 8rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #0B0E11;
}

.coin-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  margin-bottom: 16rpx;
}

.list-title {
  font-size: 24rpx;
  color: #707A8A;
}

.sort-btn {
  font-size: 24rpx;
  color: #0B0E11;
}

.coin-list {
  flex: 1;
  padding: 0 32rpx;
}

.coin-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
  gap: 16rpx;
}

.coin-item-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
  min-width: 0;
}

.coin-item-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin-item-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.coin-item-name {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coin-item-fullname {
  font-size: 24rpx;
  color: #707A8A;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coin-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
  flex-shrink: 0;
  margin-right: 100rpx;
}

.coin-item-amount {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 600;
  white-space: nowrap;
}

.coin-item-value {
  font-size: 24rpx;
  color: #707A8A;
  white-space: nowrap;
}

/* 交易对选择弹窗 */
.pair-picker {
  height: 60vh;
  display: flex;
  flex-direction: column;
}

.pair-list {
  flex: 1;
  padding: 0 32rpx;
}

.pair-list-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;
  border-radius: 8rpx;
  margin-bottom: 12rpx;
}

.pair-list-item.active {
  background-color: #F0F9FF;
  border: 2rpx solid #17b26a;
}

.pair-symbol {
  font-size: 28rpx;
  color: #0B0E11;
  font-weight: 500;
}
</style>
