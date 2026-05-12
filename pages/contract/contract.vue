<template>
  <view class="contract-container">
    <view class="top-tabs">
      <scroll-view scroll-x class="tabs-scroll" show-scrollbar="false">
        <view class="tabs-wrapper">
          <view 
            class="tab-item" 
            v-for="(tab, index) in topTabs" 
            :key="index"
            :class="{ active: currentTopTab === index }"
            @click="onTopTabChange(index)"
          >
            <text class="tab-text" :class="{ active: currentTopTab === index }">{{ tab }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 根据当前选中的tab显示对应内容 -->
    <contract-ubw v-if="currentTopTab === 0" />
    <contract-bbw v-if="currentTopTab === 1" />
    <custom-menu v-model="currentTab" @change="onTabChange" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ContractUbw from '@/sub_package/contract/contract-ubw.vue'
import ContractBbw from '@/sub_package/contract/contract-bbw.vue'

const topTabs = ref(['U本位', '币本位'])
const currentTopTab = ref(0)
const currentTab = ref(3)

onLoad((options) => {
  // 如果有传入tab参数，设置对应的tab
  if (options.tab !== undefined) {
    currentTopTab.value = parseInt(options.tab)
  }
  // 如果有传入symbol参数，可以传递给子组件
  // 这里可以通过provide/inject或者事件总线来传递
})

const onTopTabChange = (index) => {
  currentTopTab.value = index
}

const onTabChange = (index) => {
  currentTab.value = index
}
</script>

<style scoped lang="scss">
.contract-container {
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-tabs {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  margin-bottom: 20rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #e8e8e8;
  position: relative;
  z-index: 10;
}
.tabs-scroll {
  flex: 1;
  white-space: nowrap;
}

.tabs-wrapper {
  display: inline-flex;
  gap: 48rpx;
}

.tab-item {
  display: inline-flex;
  padding: 12rpx 0;
}

.tab-text {
  font-size: 30rpx;
  color: #707A8A;
}

.tab-text.active {
  color: #0B0E11;
  font-weight: 600;
}

.coming-soon {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.coming-soon-text {
  font-size: 28rpx;
  color: #B7BDC6;
}
</style>