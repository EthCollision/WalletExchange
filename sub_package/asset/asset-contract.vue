<template>
  <view class="asset-contract">
    <!-- 合约子Tab导航 -->
    <view class="contract-tabs">
      <view 
        class="contract-tab-item" 
        v-for="(tab, index) in contractTabs" 
        :key="index"
        :class="{ active: currentContractTab === index }"
        @click="onContractTabChange(index)"
      >
        <text class="contract-tab-text" :class="{ active: currentContractTab === index }">{{ tab }}</text>
      </view>
    </view>
    
    <!-- 根据当前选中的tab显示对应内容 -->
    <view class="contract-content">
      <asset-contract-ubw v-if="currentContractTab === 0" />
      <asset-contract-bbw v-if="currentContractTab === 1" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AssetContractUbw from './asset-contract-ubw.vue'
import AssetContractBbw from './asset-contract-bbw.vue'

// 合约子Tab
const contractTabs = ref(['U本位合约', '币本位合约'])
const currentContractTab = ref(0)

// 子Tab切换
const onContractTabChange = (index) => {
  currentContractTab.value = index
  console.log('切换合约子Tab:', contractTabs.value[index])
}
</script>

<style scoped lang="scss">
.asset-contract {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  overflow: hidden;
}

/* 合约子Tab导航 */
.contract-tabs {
  display: flex;
  gap: 16rpx;
  background-color: #ffffff;
  padding: 20rpx 32rpx;
  flex-shrink: 0;
}

.contract-tab-item {
  flex: 1;
  padding: 6rpx 12rpx;
  text-align: center;
  border-radius: 8rpx;
  transition: all 0.3s;
}

.contract-tab-item.active {
  background-color: #F5F5F5;
}

.contract-tab-text {
  font-size: 22rpx;
  color: #707A8A;
  font-weight: 400;
}

.contract-tab-text.active {
  color: #0B0E11;
  font-weight: 500;
}

/* 内容区域 */
.contract-content {
  flex: 1;
  overflow: hidden;
}
</style>
