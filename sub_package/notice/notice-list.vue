<template>
  <view class="notice-list-page">
    <!-- 顶部导航栏 -->
    <custom-navbar title="公告列表" :show-back="true" :back-path="backPath" />

    <!-- 公告列表 -->
    <view class="notice-list-container">
      <scroll-view 
        scroll-y 
        class="notice-list-scroll"
        @scrolltolower="onLoadMore"
        :lower-threshold="100"
      >
        <view class="notice-list">
          <view 
            class="notice-item" 
            v-for="notice in noticeList" 
            :key="notice.id" 
            @click="onNoticeClick(notice)"
          >
            <view class="notice-content-wrapper">
              <text class="notice-title">{{ notice.title }}</text>
              <text class="notice-time">{{ notice.time }}</text>
            </view>
            <u-icon name="arrow-right" size="16" color="#B7BDC6" />
          </view>
          
          <!-- 加载状态 -->
          <view class="load-more" v-if="!noMore">
            <view v-if="loading" class="loading-wrapper">
              <text class="loading-text">加载中...</text>
            </view>
          </view>
          
          <!-- 没有更多数据 -->
          <view class="no-more" v-if="noMore">
            <text class="no-more-text">没有更多数据了</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 返回路径 - 固定返回到首页
const backPath = '/pages/index/index'

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const noMore = ref(false)

// 公告列表
const noticeList = ref([])

// 模拟数据源(实际项目中应该从API获取)
const mockDataSource = [
  { id: 1, title: 'XRP/USDT 杠杆倍数调整公告', time: '2025/10/21 10:03:05', content: 'XRP/USDT 交易对的最大杠杆倍数已调整为20倍,请及时检查您的持仓情况。为了更好地保护用户资产安全,我们会根据市场波动情况定期调整各交易对的杠杆倍数。' },
  { id: 2, title: 'BNB/USDT 杠杆倍数调整公告', time: '2025/10/21 10:03:05', content: 'BNB/USDT 交易对的最大杠杆倍数已调整为15倍,请及时检查您的持仓情况。' },
  { id: 3, title: 'SOL/USDT 杠杆倍数调整公告', time: '2025/10/21 10:03:05', content: 'SOL/USDT 交易对的最大杠杆倍数已调整为10倍,请及时检查您的持仓情况。' },
  { id: 4, title: 'BTC/USDT 杠杆倍数调整公告', time: '2025/10/21 10:03:05', content: 'BTC/USDT 交易对的最大杠杆倍数已调整为125倍,请及时检查您的持仓情况。' },
  { id: 5, title: 'ETH/USDT 杠杆倍数调整公告', time: '2025/10/20 15:30:00', content: 'ETH/USDT 交易对的最大杠杆倍数已调整为75倍,请及时检查您的持仓情况。' },
  { id: 6, title: 'ADA/USDT 新交易对上线公告', time: '2025/10/20 14:00:00', content: 'ADA/USDT 交易对现已上线,支持最高10倍杠杆交易。欢迎广大用户参与交易。' },
  { id: 7, title: 'DOT/USDT 杠杆倍数更新通知', time: '2025/10/20 12:00:00', content: 'DOT/USDT 交易对的最大杠杆倍数已更新为20倍。' },
  { id: 8, title: 'LINK/USDT 系统维护通知', time: '2025/10/19 18:00:00', content: 'LINK/USDT 将于2025年10月22日进行系统维护,维护期间交易功能将暂停使用,请提前做好准备。' },
  { id: 9, title: 'MATIC/USDT 价格异动提醒', time: '2025/10/19 16:30:00', content: 'MATIC/USDT 价格创新高,请密切关注您的持仓情况,注意风险控制。' },
  { id: 10, title: 'AVAX/USDT 上线公告', time: '2025/10/19 14:00:00', content: 'AVAX/USDT 现已正式上线,支持最高15倍杠杆交易。' },
  { id: 11, title: 'UNI/USDT 手续费优惠活动', time: '2025/10/18 10:00:00', content: 'UNI/USDT 交易手续费降低20%,优惠活动持续一个月,欢迎参与交易。' },
  { id: 12, title: 'ATOM/USDT 系统升级通知', time: '2025/10/18 09:00:00', content: 'ATOM/USDT 交易系统将于今晚零点进行升级,预计持续1小时。' },
  { id: 13, title: 'FTM/USDT 新功能上线', time: '2025/10/17 17:00:00', content: 'FTM/USDT 现已支持止盈止损功能,帮助您更好地管理风险。' },
  { id: 14, title: 'NEAR/USDT 杠杆调整通知', time: '2025/10/17 15:00:00', content: 'NEAR/USDT 最大杠杆倍数提升至25倍。' },
  { id: 15, title: 'ALGO/USDT 交易大赛开启', time: '2025/10/17 12:00:00', content: '参与 ALGO/USDT 交易大赛,赢取丰厚奖励!活动时间:10月20日-10月30日。' },
  { id: 16, title: 'VET/USDT 维护公告', time: '2025/10/16 18:00:00', content: 'VET/USDT 将于10月20日进行例行维护,请提前做好准备。' },
  { id: 17, title: 'XTZ/USDT 价格波动提醒', time: '2025/10/16 16:00:00', content: 'XTZ/USDT 出现较大价格波动,请谨慎交易,做好风险控制。' },
  { id: 18, title: 'THETA/USDT 新币上线', time: '2025/10/16 14:00:00', content: 'THETA/USDT 现已开放交易,支持10倍杠杆。' },
  { id: 19, title: 'EGLD/USDT 手续费调整', time: '2025/10/15 10:00:00', content: 'EGLD/USDT 交易手续费已调整,详情请查看费率说明。' },
  { id: 20, title: 'AAVE/USDT 杠杆更新', time: '2025/10/15 09:00:00', content: 'AAVE/USDT 杠杆倍数已更新至30倍最大值。' },
  { id: 21, title: 'SUSHI/USDT 交易预警', time: '2025/10/14 17:00:00', content: 'SUSHI/USDT 检测到高波动性,请谨慎交易。' },
  { id: 22, title: 'COMP/USDT 系统升级', time: '2025/10/14 15:00:00', content: 'COMP/USDT 交易系统将于今晚进行升级维护。' },
  { id: 23, title: 'YFI/USDT 价格发现阶段', time: '2025/10/14 12:00:00', content: 'YFI/USDT 进入价格发现阶段,市场波动可能较大。' },
  { id: 24, title: 'SNX/USDT 维护通知', time: '2025/10/13 18:00:00', content: 'SNX/USDT 将于10月16日进行维护。' },
  { id: 25, title: 'CRV/USDT 交易暂停通知', time: '2025/10/13 16:00:00', content: 'CRV/USDT 交易将因系统更新暂时暂停,恢复时间另行通知。' }
]

// 加载公告列表
const loadNoticeList = async (page = 1) => {
  if (loading.value || noMore.value) {
    return
  }
  
  loading.value = true
  
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟分页数据
    const start = (page - 1) * pageSize.value
    const end = start + pageSize.value
    const newData = mockDataSource.slice(start, end)
    
    if (newData.length === 0) {
      noMore.value = true
    } else {
      if (page === 1) {
        noticeList.value = newData
      } else {
        noticeList.value = [...noticeList.value, ...newData]
      }
      currentPage.value = page
      
      // 判断是否还有更多数据
      if (end >= mockDataSource.length) {
        noMore.value = true
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 加载更多
const onLoadMore = () => {
  if (!loading.value && !noMore.value) {
    loadNoticeList(currentPage.value + 1)
  }
}

// 页面加载时获取初始数据
onLoad(() => {
  loadNoticeList(1)
})

// 公告点击 - 跳转到详情页
const onNoticeClick = (notice) => {
  uni.navigateTo({
    url: `/sub_package/notice/notice-detail?id=${notice.id}`
  })
}
</script>

<style scoped lang="scss">
.notice-list-page {
  height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 公告列表容器 */
.notice-list-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.notice-list-scroll {
  height: 100%;
  width: 100%;
}

.notice-list {
  padding: 16rpx;
}

.notice-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notice-item:active {
  opacity: 0.8;
}

.notice-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-right: 16rpx;
}

.notice-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #0B0E11;
  line-height: 1.5;
}

.notice-time {
  font-size: 24rpx;
  color: #B7BDC6;
}

/* 加载状态 */
.load-more {
  padding: 32rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #B7BDC6;
}

/* 没有更多数据 */
.no-more {
  padding: 32rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-more-text {
  font-size: 28rpx;
  color: #B7BDC6;
}
</style>
