<template>
  <view class="asset-section">
    <!-- 未登录状态 -->
    <view v-if="!isLoggedIn" class="login-container">
      <view class="login-btn" @click="handleLogin">
        登录/注册
      </view>
    </view>
    
    <!-- 已登录状态 -->
    <template v-else>
      <view class="asset-header">
        <view class="title-with-icon">
          <text class="asset-title">预估总资产 (USDT)</text>
          <u-icon :name="assetExpanded ? 'arrow-up' : 'arrow-down'" color="#0B0E11" size="18" @click="toggleAssetExpanded" />
        </view>
      </view>
      <view v-if="assetExpanded" class="asset-main">
        <text class="asset-value">{{ formattedAsset }}</text>
        <text class="asset-sub">≈ ${{ approxUsd }}</text>
      </view>
    </template>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 登录状态（TODO: 后续从全局状态管理或本地存储获取）
const isLoggedIn = ref(false)

// 个人资产模块状态
const assetExpanded = ref(true)
const assetValue = ref(2657.43)
const formattedAsset = computed(() => assetValue.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const approxUsd = computed(() => assetValue.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))

const toggleAssetExpanded = () => {
  assetExpanded.value = !assetExpanded.value
}

const handleLogin = () => {
  uni.navigateTo({
    url: '/sub_package/login/login'
  })
}
</script>

<style scoped lang="scss">
/* 个人资产模块 */
.asset-section {
  padding: 24rpx 32rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
}
.asset-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title-with-icon {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.asset-title {
  font-size: 26rpx;
  color: #0B0E11;
}
.asset-main {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-top: 16rpx;
}
.asset-value {
  font-size: 64rpx;
  font-weight: 700;
  color: #0B0E11;
  letter-spacing: 1rpx;
}

.asset-sub {
  color: #707A8A;
  font-size: 24rpx;
}

/* 未登录状态 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0;
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
