<template>
  <view class="fund-deposit">
    <!-- 自定义导航栏 -->
    <custom-navbar 
      :title="`充值 ${currentCoin}`" 
      :show-back="true"
      back-path="/sub_package/fund/fund-deposit-network"
    >
      <template #right>
        <view class="nav-right">
          <u-icon name="question-circle" size="40" color="#0B0E11" style="margin-right: 24rpx;"></u-icon>
          <u-icon name="clock" size="40" color="#0B0E11"></u-icon>
        </view>
      </template>
    </custom-navbar>

    <!-- 提示信息 -->
    <view class="tip-banner">
      <u-icon name="info-circle" size="32" color="#F59E0B"></u-icon>
      <view class="tip-content">
        <text class="tip-text">该地址已经升级为TSS地址。</text>
        <text class="tip-link">了解更多</text>
      </view>
      <u-icon name="close" size="32" color="#92400E" @click="closeTip"></u-icon>
    </view>

    <!-- 二维码区域 -->
    <view class="qrcode-section">
      <view class="qrcode-container">
        <l-qrcode 
          :value="depositAddress" 
          :size="180"
          :margin="0"
          :logo-size="60"
          logo="/static/logo.png"
        ></l-qrcode>
      </view>
    </view>

    <!-- 网络信息 -->
    <view class="network-section">
      <view class="section-label">网络</view>
      <view class="network-info" @click="showNetworkModal = true">
        <view class="network-left">
          <text class="network-code">{{ currentNetwork }}</text>
          <text class="network-name">{{ networkName }}</text>
        </view>
        <u-icon name="arrow-right" size="32" color="#707A8A"></u-icon>
      </view>
      <view class="contract-info">
        <text class="contract-label">合约信息</text>
        <text class="contract-value">***97955</text>
      </view>
    </view>

    <!-- 充值地址 -->
    <view class="address-section">
      <view class="section-header">
        <text class="section-label">充值地址</text>
      </view>
      <view class="address-content">
        <text class="address-text">{{ depositAddress }}</text>
        <view class="copy-btn" @click="copyAddress">
          <u-icon name="file-text" size="36" color="#0B0E11"></u-icon>
        </view>
      </view>
    </view>

    <!-- 更多信息 -->
    <view class="more-info" @click="toggleMoreInfo">
      <text class="more-text">更多信息</text>
      <u-icon :name="showMoreInfo ? 'arrow-up' : 'arrow-down'" size="32" color="#707A8A"></u-icon>
    </view>

    <!-- 详细信息(折叠) -->
    <view class="detail-info" v-if="showMoreInfo">
      <view class="info-item">
        <text class="info-label">最低充值金额</text>
        <text class="info-value">>0.01 USDT</text>
      </view>
      <view class="info-item">
        <text class="info-label">预计到账</text>
        <text class="info-value">1次网络确认</text>
      </view>
      <view class="info-item">
        <text class="info-label">预计解锁</text>
        <text class="info-value">1次网络确认</text>
      </view>
      <view class="info-item">
        <text class="info-label">合约地址</text>
        <view class="info-right">
          <text class="info-value contract">0x55d398326f99059fF775485246999027B3197955</text>
          <u-icon name="copy" size="32" color="#707A8A" @click="copyContract"></u-icon>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-action">
      <view class="action-btn" @click="saveAndShare">
        <text class="btn-text">保存并分享地址</text>
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
              <text class="drawer-network-confirm">{{ network.confirm }}次区块确认</text>
              <text class="drawer-network-min">最低充值 >{{ network.minDeposit }} USDT</text>
              <text class="drawer-network-time">预计到账时间 ≈ {{ network.estimatedTime }}</text>
            </view>
          </view>
        </view>

        <view class="drawer-bottom-tip">
          <u-icon name="info-circle" size="32" color="#F59E0B"></u-icon>
          <text class="drawer-tip-text">
            当您充值该币种时，请仅限于通过下方币安支持的网络充值。如您通过其他网络充值会造成资金丢失。
          </text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 当前币种和网络
const currentCoin = ref('USDT')
const currentNetwork = ref('BSC')

// 充值地址
const depositAddress = ref('0xf83beb70219b0760b397a9a6db677490bbfc6b93')

// 显示状态
const showTip = ref(true)
const showMoreInfo = ref(false)
const showNetworkModal = ref(false)

// 网络名称映射
const networkNameMap = {
  'BSC': 'BNB Smart Chain (BEP20)',
  'TRX': 'Tron (TRC20)',
  'ETH': 'Ethereum (ERC20)',
  'APT': 'Aptos',
  'POL': 'Polygon POS',
  'SOL': 'Solana',
  'AVAX': 'Avalanche C-Chain'
}

// 网络列表
const networkList = ref([
  {
    code: 'BSC',
    name: 'BNB Smart Chain (BEP20)',
    confirm: 1,
    minDeposit: '0.01',
    estimatedTime: '1分钟'
  },
  {
    code: 'TRX',
    name: 'Tron (TRC20)',
    confirm: 1,
    minDeposit: '0.01',
    estimatedTime: '1分钟'
  },
  {
    code: 'APT',
    name: 'Aptos',
    confirm: 1,
    minDeposit: '0.000001',
    estimatedTime: '1分钟'
  },
  {
    code: 'ETH',
    name: 'Ethereum (ERC20)',
    confirm: 6,
    minDeposit: '0.001',
    estimatedTime: '2分钟'
  },
  {
    code: 'POL',
    name: 'Polygon POS',
    confirm: 1,
    minDeposit: '0.02',
    estimatedTime: '1分钟'
  },
  {
    code: 'SOL',
    name: 'Solana',
    confirm: 1,
    minDeposit: '0.01',
    estimatedTime: '1分钟'
  },
  {
    code: 'AVAX',
    name: 'Avalanche C-Chain',
    confirm: 1,
    minDeposit: '0.01',
    estimatedTime: '1分钟'
  }
])

// 网络名称
const networkName = computed(() => {
  return networkNameMap[currentNetwork.value] || ''
})

// 页面加载
onLoad((options) => {
  if (options.coin) {
    currentCoin.value = options.coin
  }
  if (options.network) {
    currentNetwork.value = options.network
  }
})

// 关闭提示
const closeTip = () => {
  showTip.value = false
}

// 选择网络
const selectNetwork = (network) => {
  currentNetwork.value = network.code
  showNetworkModal.value = false
}

// 切换更多信息
const toggleMoreInfo = () => {
  showMoreInfo.value = !showMoreInfo.value
}

// 复制地址
const copyAddress = () => {
  uni.setClipboardData({
    data: depositAddress.value,
    success: () => {
      uni.showToast({
        title: '地址已复制',
        icon: 'success'
      })
    }
  })
}

// 复制合约地址
const copyContract = () => {
  uni.setClipboardData({
    data: '0x55d398326f99059fF775485246999027B3197955',
    success: () => {
      uni.showToast({
        title: '合约地址已复制',
        icon: 'success'
      })
    }
  })
}

// 保存并分享
const saveAndShare = () => {
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })
}
</script>

<style scoped lang="scss">
.fund-deposit {
  min-height: 100vh;
  background-color: #FFFFFF;
  padding-bottom: 120rpx;
}

.nav-right {
  display: flex;
  align-items: center;
}

.tip-banner {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  background-color: #FFFBEB;
  margin: 0 32rpx 32rpx;
  border-radius: 12rpx;
  
  .tip-content {
    flex: 1;
    margin: 0 16rpx;
    
    .tip-text {
      font-size: 26rpx;
      color: #92400E;
      margin-right: 8rpx;
    }
    
    .tip-link {
      font-size: 26rpx;
      color: #F59E0B;
      text-decoration: underline;
    }
  }
}

.qrcode-section {
  display: flex;
  justify-content: center;
  padding: 32rpx 0;
  
  .qrcode-container {
    width: 300rpx;
    height: 300rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
  }
}

.network-section {
  padding: 32rpx;
  border-top: 2rpx solid #F5F5F5;
  border-bottom: 2rpx solid #F5F5F5;
  
  .section-label {
    font-size: 28rpx;
    color: #707A8A;
    margin-bottom: 16rpx;
  }
  
  .network-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 0;
    
    .network-left {
      display: flex;
      align-items: baseline;
      
      .network-code {
        font-size: 32rpx;
        color: #0B0E11;
        font-weight: 600;
        margin-right: 16rpx;
      }
      
      .network-name {
        font-size: 26rpx;
        color: #707A8A;
      }
    }
  }
  
  .contract-info {
    display: flex;
    justify-content: space-between;
    padding-top: 16rpx;
    
    .contract-label {
      font-size: 26rpx;
      color: #707A8A;
    }
    
    .contract-value {
      font-size: 26rpx;
      color: #0B0E11;
    }
  }
}

.address-section {
  padding: 32rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }
  
  .section-label {
    font-size: 28rpx;
    color: #707A8A;
  }
  
  .address-content {
    display: flex;
    align-items: center;
    background-color: #F5F5F5;
    padding: 24rpx;
    border-radius: 8rpx;
    
    .address-text {
      flex: 1;
      font-size: 26rpx;
      color: #0B0E11;
      word-break: break-all;
      line-height: 1.6;
      margin-right: 16rpx;
    }
    
    .copy-btn {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64rpx;
      height: 64rpx;
      background-color: #FFFFFF;
      border-radius: 8rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    }
  }
}

.more-info {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 32rpx;
  border-top: 2rpx solid #F5F5F5;
  border-bottom: 2rpx solid #F5F5F5;
  
  .more-text {
    font-size: 28rpx;
    color: #0B0E11;
    margin-right: 8rpx;
  }
}

.detail-info {
  padding: 32rpx;
  background-color: #FAFAFA;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16rpx 0;
    
    .info-label {
      font-size: 26rpx;
      color: #707A8A;
      flex-shrink: 0;
    }
    
    .info-value {
      font-size: 26rpx;
      color: #0B0E11;
      text-align: right;
      
      &.contract {
        max-width: 400rpx;
        word-break: break-all;
      }
    }
    
    .info-right {
      display: flex;
      align-items: center;
      gap: 16rpx;
      flex: 1;
      justify-content: flex-end;
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
        
        .drawer-network-confirm,
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
