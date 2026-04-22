<template>
  <view class="asset-container">
    <!-- 顶部标签导航 -->
    <view class="top-tabs">
      <scroll-view scroll-x class="top-tabs-scroll" show-scrollbar="false">
        <view class="top-tabs-wrapper">
          <view 
            class="top-tab-item" 
            v-for="(tab, index) in topTabs" 
            :key="index"
            :class="{ active: currentTopTab === index }"
            @click="onTopTabChange(index)"
          >
            <text class="top-tab-text" :class="{ active: currentTopTab === index }">{{ tab }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 根据当前选中的tab显示对应内容 -->
    <view class="tab-content">
      <asset-total v-if="currentTopTab === 0" />
      <asset-fund v-if="currentTopTab === 1" />
      <asset-spot v-if="currentTopTab === 2" />
      <asset-contract v-if="currentTopTab === 3" />
    </view>

    
    <!-- 底部菜单 -->
    <custom-menu v-model="menuTab" @change="onMenuChange" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AssetTotal from '@/sub_package/asset/asset-total.vue'
import AssetFund from '@/sub_package/asset/asset-fund.vue'
import AssetContract from '@/sub_package/asset/asset-contract.vue'
import AssetSpot from '@/sub_package/asset/asset-spot.vue'

// 顶部标签页
const topTabs = ref(['总览', '资金','现货',  '合约' ])
const currentTopTab = ref(0)

// 底部菜单当前选中
const menuTab = ref(4) // 资产页

// 顶部标签页切换
const onTopTabChange = (index) => {
  currentTopTab.value = index
}

// 底部菜单切换
const onMenuChange = (index) => {
  menuTab.value = index
}

// 页面加载
onLoad((options) => {
  // 如果有传入tab参数，设置对应的tab
  if (options && options.tab !== undefined) {
    currentTopTab.value = parseInt(options.tab)
  }
})
</script>

<style scoped lang="scss">
.asset-container {
  height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 内容区域 */
.tab-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 顶部标签导航 */
.top-tabs {
  flex-shrink: 0;
  background-color: #ffffff;
  border-bottom: 1rpx solid #F5F5F5;
  position: relative;
  z-index: 10;
}

.top-tabs-scroll {
  width: 100%;
  white-space: nowrap;
}

.top-tabs-wrapper {
  display: inline-flex;
  padding: 0 32rpx;
  gap: 48rpx;
}

.top-tab-item {
  display: inline-flex;
  padding: 24rpx 0;
  white-space: nowrap;
}

.top-tab-text {
  font-size: 32rpx;
  color: #707A8A;
  font-weight: 400;
}

.top-tab-text.active {
  color: #0B0E11;
  font-weight: 600;
}
</style>
