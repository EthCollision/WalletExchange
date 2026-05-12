<template>
  <view>
    <view class="login">
      <view class="logo">
        <image
          src="/static/logo.png"
          style="width: 200rpx; height: 200rpx"
        ></image>
      </view>
      <view class="welcome-text">
        <text class="title">欢迎回来</text>
        <text class="subtitle">登录您的账户以继续</text>
      </view>
      <view class="from-box">
        <view class="input-item">
          <u-icon name="email" size="36rpx" color="#666"></u-icon>
          <input
            class="input"
            v-model="loginInfo.account"
            placeholder="请输入邮箱"
            type="text"
          />
        </view>
        <view
          class="input-tip"
          v-if="loginInfo.account && !validateEmail(loginInfo.account)"
        >
          邮箱格式不正确
        </view>
        <view class="input-item">
          <u-icon name="lock" size="36rpx" color="#666"></u-icon>
          <input
            class="input"
            v-model="loginInfo.password"
            placeholder="请输入密码"
            type="password"
          />
        </view>
      </view>
      <view class="login-btn">
        <u-button
          :custom-style="buttonStyle"
          :disabled="!(loginInfo.account && loginInfo.password)"
          @click="handleLogin"
        >
          登录
        </u-button>
      </view>

      <view class="line">
        <navigator url="/sub_package/login/forgot-password" hover-class="none">
          <view class="line-left">
            <text class="line-left-text">忘记密码?</text>
          </view>
        </navigator>
        <navigator url="/sub_package/login/register" hover-class="none">
          <view class="line-right">
            还没有账户?
            <text class="line-right-text">立即注册</text>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { md5 } from "@/utils/crypto.js";

const loginInfo = reactive({
  account: "",
  password: "",
});

// 按钮自定义样式
const buttonStyle = computed(() => {
  const isDisabled = !(loginInfo.account && loginInfo.password);
  return {
    height: '90rpx',
    fontSize: '32rpx',
    fontWeight: '500',
    borderRadius: '16rpx',
    background: isDisabled ? '#E5E7EB' : '#fcd535',
    backgroundColor: isDisabled ? '#E5E7EB' : '#fcd535',
    color: isDisabled ? '#999' : '#333',
    border: 'none',
    borderWidth: '0',
    borderColor: 'transparent',
    boxShadow: isDisabled ? 'none' : '0 8rpx 16rpx rgba(252, 213, 53, 0.3)'
  };
});

// 验证邮箱格式
const validateEmail = (email) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  return emailRegex.test(email);
};

// 登录表单验证
const isFormValid = computed(() => {
  return (
    loginInfo.account && validateEmail(loginInfo.account) && loginInfo.password
  );
});

// 处理登录
const handleLogin = () => {
  // 验证表单
  if (!loginInfo.account) {
    uni.showToast({
      title: "请输入邮箱",
      icon: "none",
      duration: 2000,
    });
    return;
  }

  if (!validateEmail(loginInfo.account)) {
    uni.showToast({
      title: "邮箱格式不正确",
      icon: "none",
      duration: 2000,
    });
    return;
  }

  if (!loginInfo.password) {
    uni.showToast({
      title: "请输入密码",
      icon: "none",
      duration: 2000,
    });
    return;
  }

  // 显示加载中
  uni.showLoading({
    title: "登录中...",
  });

  // 模拟登录请求
  setTimeout(() => {
    uni.hideLoading();
    
    // 模拟登录成功
    const token = "mock_token_" + Date.now();
    uni.setStorageSync("token", token);

    uni.showToast({
      title: "登录成功",
      icon: "success",
      duration: 2000,
    });

    // 登录成功后跳转到首页
    setTimeout(() => {
      uni.switchTab({
        url: "/pages/index/index",
      });
    }, 1500);
  }, 1000);
};
</script>

<style lang="scss" scoped>
.login {
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
  }

  .welcome-text {
    text-align: center;
    margin-bottom: 60rpx;
    position: relative;

    .title {
      display: block;
      font-size: 48rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }

    .subtitle {
      font-size: 28rpx;
      color: #999;
    }
  }

  .from-box {
    .input-item {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      background-color: #f8f8f8;
      border-radius: 16rpx;
      padding: 0 20rpx;
      height: 100rpx;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

      .u-icon {
        margin-right: 20rpx;
      }
    }

    .input {
      flex: 1;
      height: 100rpx;
      font-size: 30rpx;
      color: #333;
      box-sizing: border-box;
      background-color: transparent;
    }

    .input-tip {
      font-size: 24rpx;
      color: #ff4d4f;
      margin-top: -20rpx;
      margin-bottom: 20rpx;
      margin-left: 56rpx;
    }
  }

  .login-btn {
    margin-top: 60rpx;
    margin-bottom: 30rpx;

    :deep(.u-button) {
      border: none !important;
      border-width: 0 !important;
    }

    :deep(.u-button::after) {
      border: none !important;
    }

    :deep(.u-button--disabled) {
      background: #f5f5f5 !important;
      background-color: #f5f5f5 !important;
      color: #999 !important;
      box-shadow: none !important;
      border: none !important;
    }
  }

  .line {
    font-size: 28rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;

    .line-left {
      color: #666;

      .line-left-text {
        color: #fcd535;
      }
    }

    .line-right {
      color: #666;

      .line-right-text {
        color: #fcd535;
        font-weight: 500;
      }
    }
  }
}
</style>
