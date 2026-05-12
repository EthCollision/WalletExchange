<template>
  <u-popup v-model="show" mode="bottom" border-radius="24" @close="handleClose">
    <view class="withdraw-method-modal">
      <!-- 顶部标题 -->
      <view class="modal-header">
        <view class="header-bar"></view>
        <text class="modal-title">选择提现方式</text>
      </view>

      <!-- 提现方式列表 -->
      <view class="method-list">

        <!-- 链上提现 -->
        <view class="method-item" @click="handleSelect('chain')">
          <view class="method-icon">
            <u-icon name="grid" size="48" color="#F0B90B"></u-icon>
          </view>
          <view class="method-info">
            <text class="method-title">链上提现</text>
            <text class="method-desc">将加密货币从币安提现到其他交易平台/钱包</text>
          </view>
          <u-icon name="arrow-right" size="32" color="#707A8A"></u-icon>
        </view>


      </view>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'select'])

// 显示状态
const show = ref(props.modelValue)

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  show.value = newVal
})

// 监听 show 变化
watch(show, (newVal) => {
  emit('update:modelValue', newVal)
})

// 关闭弹窗
const handleClose = () => {
  show.value = false
}

// 选择提现方式
const handleSelect = (method) => {
  console.log('选择提现方式:', method)
  
  // 根据不同的方式进行跳转
  if (method === 'chain') {
    // 链上提现 - 跳转到选择币种页面
    uni.navigateTo({
      url: '/sub_package/fund/fund-withdraw-coin'
    })
  } 
  
  // 触发选择事件
  emit('select', method)
  
  // 关闭弹窗
  handleClose()
}
</script>

<style scoped lang="scss">
.withdraw-method-modal {
  background-color: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  padding: 0 0 60rpx 0;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0 24rpx;
  border-bottom: 2rpx solid #F5F5F5;
  
  .header-bar {
    width: 64rpx;
    height: 8rpx;
    background-color: #E5E7EB;
    border-radius: 4rpx;
    margin-bottom: 16rpx;
  }
  
  .modal-title {
    font-size: 32rpx;
    color: #0B0E11;
    font-weight: 600;
  }
}

.method-list {
  padding: 0 32rpx;
}

.method-item {
  display: flex;
  align-items: center;
  padding: 32rpx 0;
  border-bottom: 2rpx solid #F5F5F5;
  
  &:last-child {
    border-bottom: none;
  }
  
  .method-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background-color: #FFF8E1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    flex-shrink: 0;
  }
  
  .method-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    
    .method-title {
      font-size: 32rpx;
      color: #0B0E11;
      font-weight: 600;
    }
    
    .method-desc {
      font-size: 24rpx;
      color: #707A8A;
      line-height: 1.5;
    }
  }
}
</style>
