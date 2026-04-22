<template>
  <view class="banner">
    <u-swiper 
      :list="bannerList" 
      :autoplay="true" 
      :circular="true" 
      indicator 
      indicatorActiveColor="#F0B90B" 
      indicatorColor="rgba(255,255,255,0.4)" 
      height="300" 
      @change="onBannerChange" 
      @click="onBannerClick" 
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'

// Banner列表（示例图片，可替换为你的静态资源）
const bannerList = ref([
  '/static/icon/banner/banner1.png',
  '/static/icon/banner/banner2.png'
])

const onBannerChange = (index) => {
  console.log('banner切换:', index)
}

const onBannerClick = (index) => {
  console.log('点击banner:', index)
}
</script>

<style scoped lang="scss">
/* Banner样式 */
.banner {
  width: 100%;
  padding: 16rpx;
}
</style>
