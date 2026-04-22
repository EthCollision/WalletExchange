<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="top-navbar">
      <!-- 左侧图标组 -->
      <view class="left-icons">
        <view class="icon-btn" @click="goToSetting">
          <image src="/static/icon/home/more.png" mode="aspectFit" class="icon-img"></image>
        </view>
      </view>
      <!-- 右侧图标组 -->
      <view class="right-icons">
        <view class="icon-btn" @click="goToCustomerService">
          <image src="/static/icon/home/kf.png" mode="aspectFit" class="icon-img"></image>
        </view>
        <view class="icon-btn" @click="goToMessage">
          <image src="/static/icon/home/message.png" mode="aspectFit" class="icon-img"></image>
          <!-- 未读消息红点 -->
          <view v-if="hasUnreadMessage" class="red-dot"></view>
        </view>
        
      </view>
    </view>

    <!-- 个人资产模块 -->
    <custom-index-asset />

    <!-- Banner栏 -->
    <custom-index-banner />

    <!-- 功能模块 -->
    <custom-index-function />

    <!-- 行情模块 -->
    <custom-index-market />

    <!-- 通知公告模块 -->
    <custom-index-notice />

    <!-- 底部菜单 -->
    <custom-menu v-model="currentTab" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import CustomIndexAsset from '@/components/custom-index/custom-index-asset.vue'
import CustomIndexBanner from '@/components/custom-index/custom-index-banner.vue'
import CustomIndexFunction from '@/components/custom-index/custom-index-function.vue'
import CustomIndexMarket from '@/components/custom-index/custom-index-market.vue'
import CustomIndexNotice from '@/components/custom-index/custom-index-notice.vue'

// 当前底部tab
const currentTab = ref(0)

// 是否有未读消息（示例：从后端获取或本地状态管理）
const hasUnreadMessage = ref(true)

// 切换底部tab事件
const onTabChange = (index) => {
  console.log('首页监听到tab切换:', index)
  currentTab.value = index
  // 注意：不要在这里手动跳转,让 u-tabbar 组件自己处理
}

// 跳转到消息页面
const goToMessage = () => {
  console.log('跳转到消息页面')
  // TODO: 跳转到消息页面
  uni.showToast({
    title: '跳转到消息页面',
    icon: 'none'
  })
}

// 跳转到客服页面
const goToCustomerService = () => {
  console.log('跳转到客服页面')
  // TODO: 跳转到客服页面
  uni.showToast({
    title: '跳转到客服页面',
    icon: 'none'
  })
}

// 跳转到设置页面
const goToSetting = () => {
  uni.navigateTo({
    url: '/sub_package/setting/setting'
  })
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
}

/* 顶部导航栏 */
.top-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background-color: #fdfdfd;
  position: sticky;
  top: 0;
  z-index: 999;
}

/* 左侧图标组 */
.left-icons {
  display:flex;
  align-items: center;
  gap: 24rpx;
}

/* 右侧图标组 */
.right-icons {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

/* 图标按钮 */
.icon-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 图标图片 */
.icon-img {
  width: 44rpx;
  height: 44rpx;
}

/* 未读消息红点 */
.red-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 16rpx;
  height: 16rpx;
  background-color: #ff4444;
  border-radius: 50%;
  border: 2rpx solid #fdfdfd;
}
</style>