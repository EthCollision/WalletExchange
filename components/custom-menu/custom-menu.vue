<template>
  <view class="custom-tabbar">
    <!-- 底部菜单栏 -->
    <u-tabbar
      v-model="current"
      :list="tabbarList"
      :mid-button="true"
      @change="changeTab"
      :fixed="true"
      :placeholder="true"
    ></u-tabbar>
  </view>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: 0
  }
})

// 定义事件发射
const emit = defineEmits(['update:modelValue', 'change'])

// 当前选中的tab索引
const current = ref(props.modelValue || 0)

// 监听外部传入的值变化
watch(() => props.modelValue, (newVal) => {
  current.value = newVal
})

// tabbar配置列表
const tabbarList = ref([
  {
    iconPath: '/static/icon/menu/menu-home.png',
    selectedIconPath: '/static/icon/menu/menu-home-select.png',
    text: '首页',
    count: 0,
    isDot: false
    // 不设置 pagePath，手动处理跳转
  },
  {
    iconPath: '/static/icon/menu/menu-market.png',
    selectedIconPath: '/static/icon/menu/menu-market-select.png',
    text: '行情',
    count: 0,
    isDot: false
    // 不设置 pagePath，手动处理跳转
  },
  {
    iconPath: '/static/icon/menu/menu-trade.png',
    selectedIconPath: '/static/icon/menu/menu-trade-select.png',
    text: '交易',
    midButton: true
    // 不设置 pagePath，手动处理跳转
  },
  {
    iconPath: '/static/icon/menu/menu-contract.png',
    selectedIconPath: '/static/icon/menu/menu-contract-select.png',
    text: '合约',
    count: 0,
    isDot: false
    // 不设置 pagePath，手动处理跳转
  },
  {
    iconPath: '/static/icon/menu/menu-asset.png',
    selectedIconPath: '/static/icon/menu/menu-asset-select.png',
    text: '资产',
    count: 0,
    isDot: false
    // 不设置 pagePath，手动处理跳转
  }
])

// 切换tab事件
const changeTab = (index) => {
  console.log('切换到tab:', index)
  
  // 手动处理页面跳转
  const routes = [
    '/pages/index/index',       // 0: 首页
    '/pages/market/market',     // 1: 行情
    '/pages/trade/trade',       // 2: 交易
    '/pages/contract/contract', // 3: 合约
    '/pages/asset/asset'        // 4: 资产
  ]
  
  const targetRoute = routes[index]
  
  // 获取当前页面路径（安全获取）
  let currentRoute = ''
  try {
    const pages = getCurrentPages()
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      currentRoute = currentPage.route ? '/' + currentPage.route : ''
    }
  } catch (e) {
    console.warn('获取当前页面失败:', e)
  }
  
  // 只有当目标路由与当前路由不同时才跳转
  if (targetRoute && targetRoute !== currentRoute) {
    // 使用 reLaunch 确保页面栈干净
    uni.reLaunch({
      url: targetRoute
    })
  }
  
  current.value = index
  // 发射事件给父组件
  emit('update:modelValue', index)
  emit('change', index)
}
</script>

<style scoped lang="scss">
.custom-tabbar {
  /* 底部安全区域适配 - 支持 iPhone X 等异形屏 */
  :deep(.u-tabbar) {
    /* 使用 safe-area-inset-bottom 确保底部按钮不被虚拟横条遮挡 */
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  :deep(.u-tabbar__content) {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>