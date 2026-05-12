<template>
  <view>
    <view :style="{ height: safeAreaInsetTop + navbarHeight + 'rpx' }"></view>
    <view
      class="custom-navbar"
      :style="{
        'background-color': bgColor,
        'padding-top': safeAreaInsetTop + 'rpx'
      }"
    >
      <!-- 状态栏+刘海/灵动岛占位区域 -->
      <!-- <view
        class="status-bar"
        :style="{ height: statusBarHeight + 'px' }"
      ></view> -->

      <!-- 导航栏内容区域 -->
      <view class="navbar-content" :style="{ height: navbarHeight + 'rpx' }">
        <!-- 左侧插槽 -->
        <view class="left-area">
          <slot name="left">
            <view class="back-btn" @click="handleBack" v-if="showBack">
              <u-icon name="arrow-left" :size="backIconSize" :color="iconColor"></u-icon>
            </view>
          </slot>
        </view>

        <!-- 标题插槽 -->
        <view class="title-area" :style="{ color: titleColor }">
          <slot name="title">{{ title }}</slot>
        </view>

        <!-- 右侧插槽 -->
        <view class="right-area">
          <slot name="right"></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "custom-navbar",
  props: {
    // 标题文字
    title: {
      type: String,
      default: "",
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: "#ffffff",
    },
    // 是否显示返回按钮
    showBack: {
      type: Boolean,
      default: true,
    },
    // 导航栏高度(不包含状态栏)
    navbarHeight: {
      type: Number,
      default: 88,
    },
    // 标题颜色
    titleColor: {
      type: String,
      default: "#0B0E11",
    },
    // 图标颜色
    iconColor: {
      type: String,
      default: "#0B0E11",
    },
    // 返回图标大小
    backIconSize: {
      type: Number,
      default: 36,
    },
    // 自定义返回路径(不设置则返回上一页)
    backPath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      safeAreaInsetTop: 30, // 顶部安全区域高度，默认120rpx适配灵动岛/刘海屏
    };
  },
  methods: {
    // 返回上一页或指定路径
    handleBack() {
      if (this.backPath) {
        // 如果指定了返回路径,则跳转到指定页面
        uni.redirectTo({
          url: this.backPath,
          fail: () => {
            // 如果redirectTo失败,尝试switchTab(可能是tabBar页面)
            uni.switchTab({
              url: this.backPath,
              fail: () => {
                // 如果都失败了,还是返回上一页
                uni.navigateBack({
                  delta: 1,
                });
              },
            });
          },
        });
      } else {
        // 默认返回上一页
        uni.navigateBack({
          delta: 1,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.custom-navbar {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  /* 顶部安全区域通过 padding-top 动态设置，支持刘海屏/灵动岛 */
  box-sizing: border-box;
}

.navbar-content {
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  width: 100%;
  box-sizing: border-box;
}

.left-area {
  flex: 1;
  display: flex;
  align-items: center;
}

.title-area {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #0B0E11;
}

.right-area {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
}
</style>
