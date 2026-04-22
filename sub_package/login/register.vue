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
        <text class="title">创建账户</text>
        <text class="subtitle">开始您的交易之旅</text>
      </view>
      <view class="from-box">
        <view class="input-item">
          <u-icon name="email" size="36rpx" color="#666"></u-icon>
          <input
            class="input"
            v-model="loginInfo.mail"
            placeholder="请输入邮箱"
            type="text"
          />
        </view>
        <view
          class="input-tip"
          v-if="loginInfo.mail && !validateEmail(loginInfo.mail)"
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
        <view
          class="input-tip"
          v-if="loginInfo.password && loginInfo.password.length < 3"
        >
          密码长度至少3位
        </view>

        <view class="input-item code-input">
          <u-icon name="checkbox-mark" size="36rpx" color="#666"></u-icon>
          <input
            class="input"
            v-model="loginInfo.code"
            placeholder="请输入验证码"
            type="text"
          />
          <view
            class="send-code-btn"
            @click="sendCode"
            :class="{ disabled: isCounting || !loginInfo.mail }"
          >
            {{ isCounting ? `重新发送(${countDown}s)` : '发送验证码' }}
          </view>
        </view>

        <view class="input-item">
          <u-icon name="share" size="36rpx" color="#666"></u-icon>
          <input
            class="input"
            v-model="loginInfo.referralCode"
            placeholder="推荐码(可选)"
            type="text"
          />
        </view>
      </view>
      <view class="login-btn">
        <u-button
          :custom-style="buttonStyle"
          :disabled="!isFormValid"
          @click="handleRegister"
        >
          注册
        </u-button>
      </view>

      <view class="privacy-policy">
        <text class="policy-text">注册即表示您同意我们的</text>
        <text class="policy-link" @click="goToTerms">服务条款</text>
        <text class="policy-text">和</text>
        <text class="policy-link" @click="goToPrivacy">隐私政策</text>
      </view>

      <view class="line">
        <navigator url="/sub_package/login/login" hover-class="none">
          <view class="line-right">
            已有账户?
            <text class="line-right-text">立即登录</text>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from "vue";
import { md5 } from "@/utils/crypto.js";

const loginInfo = reactive({
  mail: "",
  password: "",
  code: "",
  referralCode: "",
});

// 按钮自定义样式
const buttonStyle = computed(() => {
  return {
    height: '90rpx',
    fontSize: '32rpx',
    fontWeight: '500',
    borderRadius: '16rpx',
    background: isFormValid.value ? '#fcd535' : '#E5E7EB',
    backgroundColor: isFormValid.value ? '#fcd535' : '#E5E7EB',
    color: isFormValid.value ? '#333' : '#999',
    border: 'none',
    borderWidth: '0',
    borderColor: 'transparent',
    boxShadow: isFormValid.value ? '0 8rpx 16rpx rgba(252, 213, 53, 0.3)' : 'none'
  };
});

// 倒计时相关
const isCounting = ref(false);
const countDown = ref(60);
let timer = null;

// 验证邮箱格式
const validateEmail = (email) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  return emailRegex.test(email);
};

// 表单验证
const isFormValid = computed(() => {
  return (
    loginInfo.mail &&
    validateEmail(loginInfo.mail) &&
    loginInfo.password &&
    loginInfo.password.length >= 3 &&
    loginInfo.code
  );
});

// 发送验证码
const sendCode = () => {
  // 检查邮箱是否已输入
  if (!loginInfo.mail) {
    uni.showToast({
      title: "请输入邮箱",
      icon: "none",
      duration: 2000,
    });
    return;
  }

  // 检查邮箱格式是否正确
  if (!validateEmail(loginInfo.mail)) {
    uni.showToast({
      title: "邮箱格式不正确",
      icon: "none",
      duration: 2000,
    });
    return;
  }

  // 检查是否正在倒计时
  if (isCounting.value) {
    return;
  }

  // 模拟发送验证码
  uni.showLoading({
    title: "发送中...",
  });

  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: "验证码已发送",
      icon: "success",
      duration: 2000,
    });
    startCountDown();
  }, 1000);
};

// 开始倒计时
const startCountDown = () => {
  isCounting.value = true;
  countDown.value = 60;

  timer = setInterval(() => {
    countDown.value--;
    if (countDown.value <= 0) {
      clearInterval(timer);
      isCounting.value = false;
      countDown.value = 60;
    }
  }, 1000);
};

// 跳转到服务条款页面
const goToTerms = () => {
  console.log("跳转到服务条款页面");
  // 暂时不跳转
  uni.showToast({
    title: "服务条款",
    icon: "none",
  });
};

// 跳转到隐私政策页面
const goToPrivacy = () => {
  console.log("跳转到隐私政策页面");
  // 暂时不跳转
  uni.showToast({
    title: "隐私政策",
    icon: "none",
  });
};

// 注册处理
const handleRegister = () => {
  // 校验表单
  if (!isFormValid.value) {
    return;
  }

  // 显示加载中
  uni.showLoading({
    title: "注册中...",
  });

  // 模拟注册请求
  setTimeout(() => {
    uni.hideLoading();

    uni.showToast({
      title: "注册成功",
      icon: "success",
      duration: 2000,
    });

    // 注册成功后跳转到登录页面
    setTimeout(() => {
      uni.redirectTo({
        url: "/sub_package/login/login",
      });
    }, 1500);
  }, 1000);
};

// 页面卸载时清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
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
    margin-bottom: 60rpx;
    position: relative;
    text-align: center;

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

    .code-input {
      .send-code-btn {
        background-color: #fcd535;
        height: 60rpx;
        border-radius: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 30rpx;
        margin-left: 20rpx;
        font-size: 26rpx;
        color: #333;
        white-space: nowrap;
        font-weight: 500;
        box-shadow: 0 4rpx 8rpx rgba(252, 213, 53, 0.3);

        &:active {
          transform: translateY(2rpx);
          box-shadow: 0 2rpx 4rpx rgba(252, 213, 53, 0.3);
        }

        &.disabled {
          background-color: #f5f5f5;
          color: #999;
          box-shadow: none;
        }
      }
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

  .privacy-policy {
    text-align: center;
    margin-top: 40rpx;
    font-size: 24rpx;
    color: #999;

    .policy-link {
      color: #fcd535;
      margin: 0 4rpx;
    }
  }

  .line {
    font-size: 28rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx 0;

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
