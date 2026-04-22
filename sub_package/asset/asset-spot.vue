<template>
  <view class="asset-spot">
    <!-- 现货子Tab导航 -->
    <view class="spot-tabs">
      <view 
        class="spot-tab-item" 
        v-for="(tab, index) in spotTabs" 
        :key="index"
        :class="{ active: currentSpotTab === index }"
        @click="onSpotTabChange(index)"
      >
        <text class="spot-tab-text" :class="{ active: currentSpotTab === index }">{{ tab }}</text>
      </view>
    </view>
    
    <!-- 根据当前选中的tab显示对应内容 -->
    <view class="spot-content">
      <asset-spot-xh v-if="currentSpotTab === 0" />
      <asset-spot-ggqc v-if="currentSpotTab === 1" />
      <asset-spot-ggzc v-if="currentSpotTab === 2" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AssetSpotXh from './asset-spot-xh.vue'
import AssetSpotGgqc from './asset-spot-ggqc.vue'
import AssetSpotGgzc from './asset-spot-ggzc.vue'

// 现货子Tab
const spotTabs = ref(['现货账户', '杠杆账户(全仓)', '杠杆账户(逐仓)'])
const currentSpotTab = ref(0)

// 子Tab切换
const onSpotTabChange = (index) => {
  currentSpotTab.value = index
}
</script>

<style scoped lang="scss">
.asset-spot {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  overflow: hidden;
}

/* 现货子Tab导航 */
.spot-tabs {
  display: flex;
  gap: 16rpx;
  background-color: #ffffff;
  padding: 20rpx 32rpx;
  flex-shrink: 0;
}

.spot-tab-item {
  flex: 1;
  padding: 6rpx 12rpx;
  text-align: center;
  border-radius: 8rpx;
  transition: all 0.3s;
}

.spot-tab-item.active {
  background-color: #F5F5F5;
}

.spot-tab-text {
  font-size: 22rpx;
  color: #707A8A;
  font-weight: 400;
}

.spot-tab-text.active {
  color: #0B0E11;
  font-weight: 500;
}

/* 内容区域 */
.spot-content {
  flex: 1;
  overflow: hidden;
}
</style>
