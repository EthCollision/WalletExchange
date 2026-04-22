<template>
  <view class="content">
    <text class="message">{{title}}</text>
  </view>
</template>
<script>
  import {
    initVueI18n
  } from '@dcloudio/uni-i18n'
  import messages from './i18n/index.js'
  const {
    t
  } = initVueI18n(messages)

  export default {
    name: 'no-data',
    props: {},
    data() {
      return {
        title: t('no-data.title')
      }
    },
    created(e) {},
    // #ifndef VUE3
    destroyed() {},
    // #endif
    // #ifdef VUE3
    unmounted() {},
    // #endif
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .message {
    opacity: .8;
  }
</style>
