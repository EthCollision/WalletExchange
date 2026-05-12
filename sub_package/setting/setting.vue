<template>
  <view class="setting-page">
    <!-- 顶部导航栏 -->
    <custom-navbar title="设置" :show-back="true" />

    <!-- 设置列表 -->
    <view class="setting-list">
      <!-- 账户与安全 -->
      <view class="setting-section">
        <view class="section-title">账户与安全</view>
        <view class="setting-item" @click="handleItemClick('language')">
          <text class="item-label">语言设置</text>
          <view class="item-right">
            <text class="item-value">简体中文</text>
            <u-icon name="arrow-right" size="16" color="#B7BDC6" />
          </view>
        </view>
        <view class="setting-item" @click="handleItemClick('password')">
          <text class="item-label">修改密码</text>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#B7BDC6" />
          </view>
        </view>
        <view class="setting-item" @click="handleItemClick('security')">
          <text class="item-label">安全设置</text>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#B7BDC6" />
          </view>
        </view>
      </view>

     

      <!-- 关于 -->
      <view class="setting-section">
        <view class="section-title">关于</view>
        <view class="setting-item" @click="handleItemClick('about')">
          <text class="item-label">关于我们</text>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#B7BDC6" />
          </view>
        </view>
        <view class="setting-item" @click="handleItemClick('terms')">
          <text class="item-label">服务条款</text>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#B7BDC6" />
          </view>
        </view>
        <view class="setting-item" @click="handleItemClick('privacy')">
          <text class="item-label">隐私政策</text>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#B7BDC6" />
          </view>
        </view>
        <view class="setting-item">
          <text class="item-label">当前版本</text>
          <view class="item-right">
            <text class="item-value">v1.0.0</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-container">
      <view class="logout-btn" @click="handleLogout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 通知设置
const pushNotification = ref(true)
const tradeAlert = ref(true)
const priceAlert = ref(false)

// 交易设置
const orderConfirm = ref(true)
const soundEffect = ref(false)

// 处理项目点击
const handleItemClick = (type) => {
  console.log('点击了:', type)
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗?',
    success: (res) => {
      if (res.confirm) {
        console.log('用户点击确定')
        // TODO: 清除登录状态，跳转到登录页
        uni.showToast({
          title: '已退出登录',
          icon: 'none'
        })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.setting-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

/* 设置列表 */
.setting-list {
  flex: 1;
  padding: 0 32rpx 32rpx 32rpx;
}

/* 设置分区 */
.setting-section {
  margin-top: 32rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #707A8A;
  padding: 0 0 16rpx 0;
}

/* 设置项 */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  background-color: #ffffff;
  margin-bottom: 2rpx;
}

.setting-item:first-of-type {
  border-radius: 16rpx 16rpx 0 0;
}

.setting-item:last-of-type {
  border-radius: 0 0 16rpx 16rpx;
  margin-bottom: 0;
}

.setting-item:only-of-type {
  border-radius: 16rpx;
}

.item-label {
  font-size: 30rpx;
  color: #0B0E11;
  font-weight: 400;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.item-value {
  font-size: 28rpx;
  color: #707A8A;
}

/* 退出登录按钮 */
.logout-container {
  padding: 32rpx;
  background-color: #F5F5F5;
}

.logout-btn {
  width: 100%;
  padding: 28rpx 0;
  background-color: #ffffff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1rpx solid #F5F5F5;
}

.logout-btn:active {
  opacity: 0.8;
}

.logout-text {
  font-size: 32rpx;
  color: #F6465D;
  font-weight: 500;
}
</style>
