<template>
  <u-popup v-model="show" mode="bottom" border-radius="24" @close="handleClose">
    <view class="deposit-modal">
      <view class="modal-header">
        <text class="modal-title">选择充值方式</text>
      </view>
      
      <view class="deposit-options">
        <view class="option-item" @click="selectMethod('onchain')">
          <view class="option-icon">
            <u-icon name="arrow-down" size="48" color="#0B0E11"></u-icon>
          </view>
          <view class="option-content">
            <text class="option-title">链上充值</text>
            <text class="option-desc">将其他交易平台/钱包中的加密资币存入币安账户</text>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const show = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  show.value = val
})

watch(show, (val) => {
  emit('update:modelValue', val)
})

const handleClose = () => {
  show.value = false
}

const selectMethod = (method) => {
  show.value = false
  emit('select', method)
  
  // 默认行为处理
  if (method === 'onchain') {
    // 链上充值 - 跳转到选择币种页面
    uni.navigateTo({
      url: '/sub_package/fund/fund-deposit-coin'
    })
  }
}
</script>

<style scoped lang="scss">
.deposit-modal {
  background-color: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: 60rpx;
  
  .modal-header {
    padding: 32rpx 32rpx 24rpx;
    border-bottom: 2rpx solid #F5F5F5;
    
    .modal-title {
      font-size: 32rpx;
      color: #0B0E11;
      font-weight: 600;
    }
  }
  
  .deposit-options {
    padding: 16rpx 32rpx;
    
    .option-item {
      display: flex;
      align-items: flex-start;
      padding: 32rpx 0;
      border-bottom: 2rpx solid #F5F5F5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .option-icon {
        width: 88rpx;
        height: 88rpx;
        background-color: #F5F5F5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24rpx;
        flex-shrink: 0;
      }
      
      .option-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .option-title {
          font-size: 32rpx;
          color: #0B0E11;
          font-weight: 600;
          margin-bottom: 8rpx;
        }
        
        .option-desc {
          font-size: 26rpx;
          color: #707A8A;
          line-height: 1.5;
        }
      }
    }
  }
}
</style>
