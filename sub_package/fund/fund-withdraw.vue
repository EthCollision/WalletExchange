<template>
  <view class="fund-withdraw">
    <!-- 自定义导航栏 -->
    <custom-navbar 
      :title="`发送${currentCoin}`" 
      :show-back="true"
      back-path="/sub_package/fund/fund-withdraw-network"
    >
      <template #right>
        <view class="nav-right">
          <u-icon name="question-circle" size="40" color="#0B0E11" style="margin-right: 24rpx;"></u-icon>
          <u-icon name="clock" size="40" color="#0B0E11"></u-icon>
        </view>
      </template>
    </custom-navbar>

    <!-- 地址输入 -->
    <view class="address-section">
      <view class="section-label">地址</view>
      <view class="address-input-wrapper">
        <input 
          v-model="withdrawAddress" 
          type="text" 
          placeholder="长按粘贴" 
          placeholder-class="placeholder"
          class="address-input"
        />
        <view class="address-actions">
          <u-icon name="man" size="40" color="#707A8A" @click="selectFromAddressBook"></u-icon>
          <u-icon name="scan" size="40" color="#707A8A" @click="scanQRCode"></u-icon>
        </view>
      </view>
    </view>

    <!-- 转账网络 -->
    <view class="network-section">
      <view class="network-header">
        <text class="section-label">转账网络</text>
        <u-icon name="info-circle" size="28" color="#707A8A"></u-icon>
      </view>
      <view class="network-selector" @click="showNetworkModal = true">
        <view class="network-selected-content" v-if="currentNetwork">
          <view class="network-info">
            <text class="network-code">{{ currentNetwork }}</text>
            <text class="network-name">{{ networkName }}</text>
          </view>
        </view>
        <text class="network-text" v-else>选择主网</text>
        <u-icon name="arrow-down" size="32" color="#707A8A"></u-icon>
      </view>
    </view>

    <!-- 金额输入 -->
    <view class="amount-section">
      <view class="amount-header">
        <text class="section-label">金额</text>
        <u-icon name="info-circle" size="28" color="#707A8A"></u-icon>
      </view>
      <view class="amount-input-wrapper">
        <input 
          v-model="withdrawAmount" 
          type="digit" 
          placeholder="最少 0" 
          placeholder-class="placeholder"
          class="amount-input"
        />
        <view class="amount-actions">
          <text class="coin-unit">{{ currentCoin }}</text>
          <text class="max-btn" @click="setMaxAmount">全部提现</text>
        </view>
      </view>
      <view class="balance-info">
        <text class="balance-label">可用</text>
        <text class="balance-amount">{{ availableAmount }} {{ currentCoin }}</text>
      </view>
      <view class="balance-info">
        <text class="balance-label">不可用</text>
        <text class="balance-amount">0 {{ currentCoin }}</text>
      </view>
    </view>

    <!-- 提示信息 -->
    <view class="tip-section">
      <text class="tip-text">* 请勿直接提现至众筹或ICO地址，否则将无法收到众筹或ICO发放的代币。</text>
      <text class="tip-text">* 请勿与受制裁实体进行交易。</text>
      <text class="tip-link" @click="viewDetails">了解详情</text>
    </view>

    <!-- 到账信息 -->
    <view class="receive-section">
      <text class="section-title">到账数量</text>
      <view class="receive-amount">
        <text class="amount-value">{{ receiveAmount }}</text>
        <text class="amount-unit">{{ currentCoin }}</text>
      </view>
      <view class="fee-info">
        <text class="fee-label">网络手续费</text>
        <text class="fee-value">{{ networkFee }} {{ currentCoin }}</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-action">
      <view 
        class="action-btn" 
        :class="{ disabled: !canSubmit }"
        @click="handleWithdraw"
      >
        <text class="btn-text">提现</text>
      </view>
    </view>

    <!-- 选择网络抽屉 -->
    <u-popup v-model="showNetworkModal" mode="bottom" border-radius="24">
      <view class="network-drawer">
        <view class="drawer-header">
          <text class="drawer-title">选择网络</text>
        </view>
        
        <view class="drawer-network-list">
          <view 
            class="drawer-network-item" 
            v-for="network in networkList" 
            :key="network.code"
            @click="selectNetwork(network)"
          >
            <view class="drawer-network-info">
              <view class="drawer-network-header">
                <text class="drawer-network-code">{{ network.code }}</text>
                <text class="drawer-network-name">{{ network.name }}</text>
              </view>
              <text class="drawer-network-fee">手续费 {{ network.fee }} USDT (≈ ${{ network.feeUsd }})</text>
              <text class="drawer-network-min">最小提现金额{{ network.minWithdraw }} USDT</text>
              <text class="drawer-network-time">到账时间 ≈ {{ network.estimatedTime }}</text>
            </view>
          </view>
        </view>

        <view class="drawer-bottom-tip">
          <u-icon name="info-circle" size="32" color="#F59E0B"></u-icon>
          <text class="drawer-tip-text">
            确保您选择的充币网络与您在币安提币平台使用的网络一致，否则资产可能会丢失。
          </text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 当前币种、网络和可用余额
const currentCoin = ref('USDT')
const currentNetwork = ref('')
const availableAmount = ref('0')
const networkFee = ref('0.00')

// 提现地址和金额
const withdrawAddress = ref('')
const withdrawAmount = ref('')

// 显示状态
const showNetworkModal = ref(false)

// 网络名称映射
const networkNameMap = {
  'BSC': 'BNB Smart Chain (BEP20)',
  'TRX': 'Tron (TRC20)',
  'ETH': 'Ethereum (ERC20)',
  'OPBNB': 'opBNB',
  'APT': 'Aptos'
}

// 网络列表
const networkList = ref([
  {
    code: 'BSC',
    name: 'BNB Smart Chain (BEP20)',
    fee: '0.01',
    feeUsd: '0.009999',
    minWithdraw: '10',
    estimatedTime: '1分钟'
  },
  {
    code: 'OPBNB',
    name: 'opBNB',
    fee: '0.015',
    feeUsd: '0.014999',
    minWithdraw: '10',
    estimatedTime: '3分钟'
  },
  {
    code: 'TRX',
    name: 'Tron (TRC20)',
    fee: '1.00',
    feeUsd: '0.999999',
    minWithdraw: '10',
    estimatedTime: '1分钟'
  },
  {
    code: 'APT',
    name: 'Aptos',
    fee: '0.02',
    feeUsd: '0.019999',
    minWithdraw: '10',
    estimatedTime: '1分钟'
  },
  {
    code: 'ETH',
    name: 'Ethereum (ERC20)',
    fee: '1.00',
    feeUsd: '0.999999',
    minWithdraw: '10',
    estimatedTime: '2分钟'
  }
])

// 网络名称
const networkName = computed(() => {
  return networkNameMap[currentNetwork.value] || ''
})

// 到账金额
const receiveAmount = computed(() => {
  const amount = parseFloat(withdrawAmount.value) || 0
  const fee = parseFloat(networkFee.value) || 0
  const receive = amount - fee
  return receive > 0 ? receive.toFixed(2) : '0.00'
})

// 是否可以提交
const canSubmit = computed(() => {
  return withdrawAddress.value && 
         withdrawAmount.value && 
         currentNetwork.value &&
         parseFloat(withdrawAmount.value) > 0
})

// 页面加载
onLoad((options) => {
  if (options.coin) {
    currentCoin.value = options.coin
  }
  if (options.network) {
    currentNetwork.value = options.network
  }
  if (options.amount) {
    availableAmount.value = options.amount
  }
  if (options.fee) {
    networkFee.value = options.fee
  }
})

// 从地址簿选择
const selectFromAddressBook = () => {
  uni.showToast({
    title: '地址簿功能开发中',
    icon: 'none'
  })
}

// 扫描二维码
const scanQRCode = () => {
  uni.scanCode({
    success: (res) => {
      withdrawAddress.value = res.result
    },
    fail: () => {
      uni.showToast({
        title: '扫描失败',
        icon: 'none'
      })
    }
  })
}

// 设置最大金额
const setMaxAmount = () => {
  withdrawAmount.value = availableAmount.value
}

// 选择网络
const selectNetwork = (network) => {
  currentNetwork.value = network.code
  networkFee.value = network.fee
  showNetworkModal.value = false
}

// 查看详情
const viewDetails = () => {
  uni.showToast({
    title: '查看详情',
    icon: 'none'
  })
}

// 提现操作
const handleWithdraw = () => {
  if (!canSubmit.value) {
    return
  }
  
  // 验证提现金额
  const amount = parseFloat(withdrawAmount.value)
  const available = parseFloat(availableAmount.value)
  
  if (amount > available) {
    uni.showToast({
      title: '余额不足',
      icon: 'none'
    })
    return
  }
  
  // 验证最小提现金额
  const network = networkList.value.find(n => n.code === currentNetwork.value)
  if (network && amount < parseFloat(network.minWithdraw)) {
    uni.showToast({
      title: `最小提现金额为 ${network.minWithdraw} ${currentCoin.value}`,
      icon: 'none'
    })
    return
  }
  
  // 确认提现
  uni.showModal({
    title: '确认提现',
    content: `您将向 ${withdrawAddress.value.substring(0, 10)}... 发送 ${withdrawAmount.value} ${currentCoin.value}`,
    success: (res) => {
      if (res.confirm) {
        // 这里调用提现接口
        uni.showLoading({
          title: '提现中...'
        })
        
        // 模拟提现请求
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({
            title: '提现申请已提交',
            icon: 'success'
          })
          
          // 延迟返回
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }, 2000)
      }
    }
  })
}
</script>

<style scoped lang="scss">
.fund-withdraw {
  min-height: 100vh;
  background-color: #FFFFFF;
  padding-bottom: 140rpx;
}

.nav-right {
  display: flex;
  align-items: center;
}

.address-section {
  padding: 32rpx;
  border-bottom: 2rpx solid #F5F5F5;
  
  .section-label {
    font-size: 28rpx;
    color: #707A8A;
    margin-bottom: 16rpx;
  }
  
  .address-input-wrapper {
    display: flex;
    align-items: center;
    background-color: #F5F5F5;
    padding: 24rpx;
    border-radius: 8rpx;
    
    .address-input {
      flex: 1;
      font-size: 26rpx;
      color: #0B0E11;
      margin-right: 16rpx;
    }
    
    .placeholder {
      color: #9CA3AF;
    }
    
    .address-actions {
      display: flex;
      align-items: center;
      gap: 24rpx;
    }
  }
}

.network-section {
  padding: 32rpx;
  border-bottom: 2rpx solid #F5F5F5;
  
  .network-header {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 16rpx;
  }
  
  .section-label {
    font-size: 28rpx;
    color: #707A8A;
  }
  
  .network-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #F5F5F5;
    padding: 24rpx;
    border-radius: 8rpx;
    
    .network-selected-content {
      flex: 1;
      
      .network-info {
        display: flex;
        align-items: baseline;
        
        .network-code {
          font-size: 28rpx;
          color: #0B0E11;
          font-weight: 600;
          margin-right: 12rpx;
        }
        
        .network-name {
          font-size: 24rpx;
          color: #707A8A;
        }
      }
    }
    
    .network-text {
      flex: 1;
      font-size: 28rpx;
      color: #9CA3AF;
    }
  }
}

.amount-section {
  padding: 32rpx;
  border-bottom: 2rpx solid #F5F5F5;
  
  .amount-header {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 16rpx;
  }
  
  .section-label {
    font-size: 28rpx;
    color: #707A8A;
  }
  
  .amount-input-wrapper {
    display: flex;
    align-items: center;
    background-color: #F5F5F5;
    padding: 24rpx;
    border-radius: 8rpx;
    margin-bottom: 16rpx;
    
    .amount-input {
      flex: 1;
      font-size: 32rpx;
      color: #0B0E11;
      font-weight: 600;
    }
    
    .placeholder {
      color: #9CA3AF;
    }
    
    .amount-actions {
      display: flex;
      align-items: center;
      gap: 24rpx;
      
      .coin-unit {
        font-size: 28rpx;
        color: #0B0E11;
      }
      
      .max-btn {
        font-size: 28rpx;
        color: #F0B90B;
        font-weight: 500;
      }
    }
  }
  
  .balance-info {
    display: flex;
    justify-content: space-between;
    padding: 8rpx 0;
    
    .balance-label {
      font-size: 26rpx;
      color: #707A8A;
    }
    
    .balance-amount {
      font-size: 26rpx;
      color: #0B0E11;
    }
  }
}

.tip-section {
  padding: 32rpx;
  border-bottom: 2rpx solid #F5F5F5;
  
  .tip-text {
    display: block;
    font-size: 24rpx;
    color: #707A8A;
    line-height: 1.6;
    margin-bottom: 12rpx;
  }
  
  .tip-link {
    font-size: 24rpx;
    color: #F0B90B;
    text-decoration: underline;
  }
}

.receive-section {
  padding: 32rpx;
  
  .section-title {
    font-size: 28rpx;
    color: #707A8A;
    margin-bottom: 16rpx;
  }
  
  .receive-amount {
    display: flex;
    align-items: baseline;
    margin-bottom: 16rpx;
    
    .amount-value {
      font-size: 48rpx;
      color: #0B0E11;
      font-weight: 600;
      margin-right: 16rpx;
    }
    
    .amount-unit {
      font-size: 28rpx;
      color: #707A8A;
    }
  }
  
  .fee-info {
    display: flex;
    justify-content: space-between;
    
    .fee-label {
      font-size: 26rpx;
      color: #707A8A;
    }
    
    .fee-value {
      font-size: 26rpx;
      color: #0B0E11;
    }
  }
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  background-color: #FFFFFF;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
  
  .action-btn {
    width: 100%;
    height: 88rpx;
    background-color: #F0B90B;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s;
    
    &.disabled {
      opacity: 0.5;
      background-color: #E5E7EB;
    }
    
    .btn-text {
      font-size: 32rpx;
      color: #0B0E11;
      font-weight: 600;
    }
  }
}

// 选择网络抽屉样式
.network-drawer {
  background-color: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: 60rpx;
  max-height: 80vh;
  overflow-y: auto;
  
  .drawer-header {
    padding: 32rpx 32rpx 24rpx;
    border-bottom: 2rpx solid #F5F5F5;
    
    .drawer-title {
      font-size: 32rpx;
      color: #0B0E11;
      font-weight: 600;
    }
  }
  
  .drawer-network-list {
    padding: 24rpx 32rpx;
    
    .drawer-network-item {
      background-color: #FFFFFF;
      border-radius: 12rpx;
      padding: 32rpx;
      margin-bottom: 24rpx;
      border: 2rpx solid #F5F5F5;
      
      &:active {
        background-color: #FAFAFA;
      }
      
      .drawer-network-info {
        display: flex;
        flex-direction: column;
        gap: 16rpx;
        
        .drawer-network-header {
          display: flex;
          align-items: baseline;
          margin-bottom: 8rpx;
          
          .drawer-network-code {
            font-size: 36rpx;
            color: #0B0E11;
            font-weight: 600;
            margin-right: 16rpx;
          }
          
          .drawer-network-name {
            font-size: 28rpx;
            color: #707A8A;
          }
        }
        
        .drawer-network-fee,
        .drawer-network-min,
        .drawer-network-time {
          font-size: 26rpx;
          color: #707A8A;
          line-height: 1.5;
        }
      }
    }
  }
  
  .drawer-bottom-tip {
    display: flex;
    align-items: flex-start;
    padding: 32rpx;
    background-color: #FFFBEB;
    margin: 0 32rpx 24rpx;
    border-radius: 12rpx;
    
    .drawer-tip-text {
      flex: 1;
      margin-left: 16rpx;
      font-size: 24rpx;
      color: #92400E;
      line-height: 1.6;
    }
  }
}
</style>
