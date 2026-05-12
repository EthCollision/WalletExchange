<script>
// 引入权限控制模块，确保在应用启动时生效

export default {
  onLaunch: function () {
    console.log("App Launch");
    // 延迟且安全地初始化 WebSocket，避免白屏
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/* 此处为style标签内容的最前面 */
@import "./static/css/iconfont.css";
/* 此处为style标签内容的最前面 */
@import "./uni_modules/vk-uview-ui/index.scss";

/* 安全区域适配 - 支持刘海屏和异形屏 */
page {
  /* iOS 11+ 安全区域变量 */
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.container {
  background: #f4f4f4;
}
.mr-10 {
  margin-right: 20rpx;
}
.mt-10 {
  margin-top: 20rpx;
}
.mb-5 {
  margin-top: 10rpx;
}
.my-20 {
  margin-top: 40rpx;
  margin-bottom: 40rpx;
}
.mt-20 {
  margin-top: 40rpx;
}
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}

.item-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.justify-around {
  justify-content: space-around;
}
.flex-1 {
  flex: 1;
}
.pd10 {
  padding: 20rpx;
}
.font-bold {
  font-weight: bold;
}
.back-button {
  padding: 10rpx 20rpx;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
