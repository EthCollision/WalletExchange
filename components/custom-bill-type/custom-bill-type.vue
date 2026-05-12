<template>
  <u-popup v-model="show" mode="center" border-radius="16">
    <view class="type-selector">
      <view class="type-item" @click="handleSelect('现货')">
        <text class="type-text">现货</text>
      </view>
      <view class="type-item" @click="handleSelect('杠杆全仓')">
        <text class="type-text">杠杆全仓</text>
      </view>
      <view class="type-item" @click="handleSelect('杠杆逐仓')">
        <text class="type-text">杠杆逐仓</text>
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

const handleSelect = (type) => {
  emit('select', type)
  show.value = false
}
</script>

<style scoped lang="scss">
.type-selector {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  min-width: 400rpx;
}

.type-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
}

.type-item:last-child {
  border-bottom: none;
}

.type-text {
  font-size: 28rpx;
  color: #0B0E11;
  text-align: center;
  display: block;
}
</style>
