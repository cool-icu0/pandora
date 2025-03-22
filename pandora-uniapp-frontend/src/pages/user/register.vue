<template>
  <view class="container">
    <view class="register-card">
      <Banner 
        title="用户注册"
        subtitle="智能面试平台 - 你的面试刷题助手"
      />
      
      <view class="form">
        <view class="form-item">
          <text class="icon">👤</text>
          <input
            class="input"
            type="text"
            v-model="userAccount"
            placeholder="请输入用户账号"
          />
        </view>
        
        <view class="form-item">
          <text class="icon">🔒</text>
          <input
            class="input"
            type="password"
            v-model="userPassword"
            placeholder="请输入密码"
          />
        </view>

        <view class="form-item">
          <text class="icon">🔐</text>
          <input
            class="input"
            type="password"
            v-model="checkPassword"
            placeholder="请再次输入密码"
          />
        </view>
        
        <button class="register-btn" type="primary" @tap="handleRegister">立即注册</button>
        
        <view class="login-link">
          已有账号？
          <text class="link" @tap="goToLogin">去登录</text>
        </view>

        <view class="agreement">
          注册即表示同意
          <text class="link">《用户协议》</text>
          和
          <text class="link">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { userRegisterUsingPost } from '@/api/userController';
import Banner from '@/components/Banner.vue'; // 导入Banner组件

const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');

const handleRegister = async () => {
  if (!userAccount.value || !userPassword.value || !checkPassword.value) {
    uni.showToast({
      title: '请输入完整信息',
      icon: 'none'
    });
    return;
  }

  if (userPassword.value !== checkPassword.value) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    });
    return;
  }

  try {
    const res = await userRegisterUsingPost({
      userAccount: userAccount.value,
      userPassword: userPassword.value,
      checkPassword: checkPassword.value
    });

    if (res.data) {
      uni.showToast({
        title: '注册成功',
        icon: 'success'
      });
      uni.navigateTo({
        url: '/pages/user/login'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '注册失败：' + error.message,
      icon: 'none'
    });
  }
};

const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/user/login'
  });
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 80vh;
  padding: 30rpx;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-card {
  width: 100%;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx; // 减少卡片内边距
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

  .header {
    text-align: center;
    margin-bottom: 40rpx; // 减少标题下方间距

    .title {
      font-size: 42rpx; // 减小标题字体
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx; // 减少标题和副标题间距
      display: block;
      letter-spacing: 2rpx;
    }

    .subtitle {
      font-size: 26rpx;
      color: #999;
      display: block;
    }
  }

  .form {
    .form-item {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx; // 减少表单项间距
      background: #f8f8f8;
      border-radius: 45rpx;
      padding: 0 30rpx;
      transition: all 0.3s ease;

      &:focus-within {
        background: #f0f7ff;
        box-shadow: 0 2rpx 12rpx rgba(24, 144, 255, 0.1);
      }

      .icon {
        font-size: 36rpx;
        margin-right: 20rpx;
      }

      .input {
        flex: 1;
        height: 80rpx; // 减少输入框高度
        background: transparent;
        font-size: 28rpx;
      }
    }

    .password-rules {
      padding: 15rpx 30rpx; // 减少密码规则内边距
      background: #f8f8f8;
      border-radius: 16rpx;
      margin-bottom: 20rpx; // 减少下方间距

      .rule-title {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 5rpx; // 减少标题和规则项间距
        display: block;
      }

      .rule-item {
        font-size: 22rpx; // 减小规则项字体
        color: #999;
        display: block;
        line-height: 1.5; // 减少行高
      }
    }

    .register-btn {
      width: 100%;
      height: 80rpx; // 减少按钮高度
      line-height: 80rpx;
      border-radius: 40rpx;
      font-size: 30rpx;
      margin: 25rpx 0 20rpx; // 减少按钮上下间距
      background: linear-gradient(to right, #1890ff, #36c2ff);
      border: none;
      color: #fff;
      font-weight: bold;
      letter-spacing: 2rpx;
      transition: opacity 0.3s ease;

      &:active {
        opacity: 0.8;
      }
    }

    .login-link {
      text-align: center;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 15rpx; // 减少下方间距

      .link {
        color: #1890ff;
        margin-left: 10rpx;
      }
    }

    .agreement {
      text-align: center;
      font-size: 22rpx; // 减小协议字体
      color: #999;
      padding: 0 40rpx;
      line-height: 1.4; // 减少行高

      .link {
        color: #1890ff;
        display: inline;
      }
    }
  }
}
</style>