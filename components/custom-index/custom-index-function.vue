<template>
  <view class="function-section">
    <view class="function-item" v-for="(item, index) in functionList" :key="index" @click="onFunctionClick(item)">
      <view class="icon-wrapper">
        <image :src="item.icon" mode="aspectFit" class="icon-img" />
      </view>
      <text class="function-label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 功能模块列表
const functionList = ref([
  { icon: '/static/icon/function/deposit.png', label: '充币' },
  { icon: '/static/icon/function/withdraw.png', label: '提币' },
  { icon: '/static/icon/function/bill.png', label: '账单' },
  { icon: '/static/icon/function/security.png', label: '安全' },
  { icon: '/static/icon/function/setting.png', label: '设置' }
])

// 功能模块点击
const onFunctionClick = (item) => {
  console.log('点击功能:', item.label)
  uni.$u?.toast?.(item.label)
}
</script>

<style scoped lang="scss">
/* 功能模块 */
.function-section {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16rpx;
  background-color: #f5f5f5;
}
.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  cursor: pointer;
}
.icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  background-color: #ffffff;
  border-radius: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  &:active {
    transform: scale(0.95);
    background-color: #fafafa;
  }
}

.icon-img {
  width: 54rpx;
  height: 54rpx;
}
.function-label {
  font-size: 24rpx;
  color: #0B0E11;
  text-align: center;
}
</style>
