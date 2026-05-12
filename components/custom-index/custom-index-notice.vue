<template>
  <view class="notice-section">
    <view class="notice-header">
      <image class="notice-icon" src="/static/icon/home/gg.png" mode="aspectFit"></image>
      <text class="notice-title">公告</text>
    </view>
    <view class="notice-list">
      <view class="notice-item" v-for="(notice, index) in displayNoticeList" :key="index" @click="onNoticeClick(notice)">
        <text class="notice-content">{{ notice.title }}</text>
        <text class="notice-time">{{ notice.time }}</text>
      </view>
    </view>
    <view class="view-more" @click="onViewMore">
      <text class="view-more-text">查看更多</text>
      <u-icon name="arrow-right" size="24" color="#F0B90B" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 通知公告数据
const noticeList = ref([
  { id: 1, title: 'XRP/USDT 杠杆倍数调整公告', time: '2025/10/21 10:03:05', content: 'XRP/USDT 交易对的最大杠杆倍数已调整为20倍,请及时检查您的持仓情况。' },
  { id: 2, title: 'BNB/USDT 杠杆倍数调整公告', time: '2025/10/21 10:03:05', content: 'BNB/USDT 交易对的最大杠杆倍数已调整为15倍,请及时检查您的持仓情况。' },
  { id: 3, title: 'SOL/USDT 杠杆倍数调整公告', time: '2025/10/21 10:03:05', content: 'SOL/USDT 交易对的最大杠杆倍数已调整为10倍,请及时检查您的持仓情况。' },
  { id: 4, title: 'BTC/USDT 杠杆倍数调整公告', time: '2025/10/21 10:03:05', content: 'BTC/USDT 交易对的最大杠杆倍数已调整为125倍,请及时检查您的持仓情况。' }
])

// 默认只显示3条
const displayNoticeList = computed(() => noticeList.value.slice(0, 3))

// 公告点击 - 跳转到详情页
const onNoticeClick = (notice) => {
  console.log('点击公告:', notice.title)
  uni.navigateTo({
    url: `/sub_package/notice/notice-detail?id=${notice.id}`
  })
}

// 查看更多 - 跳转到列表页
const onViewMore = () => {
  console.log('查看更多公告')
  uni.navigateTo({
    url: '/sub_package/notice/notice-list'
  })
}
</script>

<style scoped lang="scss">
/* 通知公告模块 */
.notice-section {
  padding: 24rpx 32rpx;
  background-color: #ffffff;
  margin: 16rpx;
  border-radius: 16rpx;
}
.notice-header {
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.notice-icon {
  width: 42rpx;
  height: 42rpx;
  flex-shrink: 0;
}
.notice-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.notice-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  cursor: pointer;
}
.notice-item:last-child {
  border-bottom: none;
}
.notice-content {
  display: block;
  font-size: 28rpx;
  color: #0B0E11;
  margin-bottom: 12rpx;
  line-height: 1.5;
}
.notice-time {
  display: block;
  font-size: 24rpx;
  color: #B7BDC6;
}
.view-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding-top: 20rpx;
  cursor: pointer;
}
.view-more-text {
  font-size: 28rpx;
  color: #F0B90B;
  font-weight: 500;
}
</style>
