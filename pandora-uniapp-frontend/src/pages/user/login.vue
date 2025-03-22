<template>
  <view class="container">
    <view class="login-card">
      <Banner 
        title="用户登录"
        subtitle="智能面试平台 - 你的面试刷题助手"
      />
      
      <!-- 登录方式切换 -->
      <view class="login-tabs">
        <view 
          class="tab-item" 
          :class="{ active: loginType === 'account' }" 
          @tap="loginType = 'account'"
        >
          账号登录
        </view>
        <view 
          class="tab-item" 
          :class="{ active: loginType === 'phone' }" 
          @tap="loginType = 'phone'"
        >
          手机登录
        </view>
        <view 
          class="tab-item" 
          :class="{ active: loginType === 'email' }" 
          @tap="loginType = 'email'"
        >
          邮箱登录
        </view>
      </view>
      
      <view class="form">
        <!-- 账号密码登录 -->
        <block v-if="loginType === 'account'">
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
        </block>
        
        <!-- 手机号登录 -->
        <block v-if="loginType === 'phone'">
          <view class="form-item">
            <text class="icon">📱</text>
            <input
              class="input"
              type="number"
              v-model="phoneNumber"
              placeholder="请输入手机号"
            />
          </view>
          
          <view class="form-item code-item">
            <text class="icon">🔑</text>
            <input
              class="input code-input"
              type="number"
              v-model="smsCode"
              placeholder="请输入验证码"
            />
            <button class="code-btn" @tap="sendSmsCode">获取验证码</button>
          </view>
        </block>
        
        <!-- 邮箱登录 -->
        <block v-if="loginType === 'email'">
          <view class="form-item">
            <text class="icon">📧</text>
            <input
              class="input"
              type="text"
              v-model="email"
              placeholder="请输入邮箱"
            />
          </view>
          
          <view class="form-item code-item">
            <text class="icon">🔑</text>
            <input
              class="input code-input"
              type="number"
              v-model="emailCode"
              placeholder="请输入验证码"
            />
            <button class="code-btn" @tap="sendEmailCode">获取验证码</button>
          </view>
        </block>
        
        <button class="login-btn" type="primary" @tap="handleLogin">登录</button>
        
        <view class="register-link">
          还没有账号？
          <text class="link" @tap="goToRegister">去注册</text>
        </view>
        
        <!-- 第三方登录 -->
        <view class="third-party-login">
          <view class="divider">
            <view class="line"></view>
            <text class="text">其他登录方式</text>
            <view class="line"></view>
          </view>
          
          <view class="third-party-icons">
            <view class="icon-item" @tap="thirdPartyLogin('wechat')">
              <text class="third-icon">🔵</text>
              <text class="icon-text">微信</text>
            </view>
            <view class="icon-item" @tap="thirdPartyLogin('qq')">
              <text class="third-icon">🔷</text>
              <text class="icon-text">QQ</text>
            </view>
            <view class="icon-item" @tap="thirdPartyLogin('weibo')">
              <text class="third-icon">🔴</text>
              <text class="icon-text">微博</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { userLoginUsingPost } from '@/api/userController';
import Banner from '@/components/Banner.vue'; // 导入Banner组件


const userStore = useUserStore();
const loginType = ref('account'); // 登录方式：account, phone, email

// 账号密码登录
const userAccount = ref('');
const userPassword = ref('');

// 手机号登录
const phoneNumber = ref('');
const smsCode = ref('');

// 邮箱登录
const email = ref('');
const emailCode = ref('');

// 发送短信验证码
const sendSmsCode = () => {
  if (!phoneNumber.value) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    });
    return;
  }
  
  // TODO: 调用发送短信验证码接口
  uni.showToast({
    title: '验证码已发送',
    icon: 'success'
  });
};

// 发送邮箱验证码
const sendEmailCode = () => {
  if (!email.value) {
    uni.showToast({
      title: '请输入邮箱',
      icon: 'none'
    });
    return;
  }
  
  // TODO: 调用发送邮箱验证码接口
  uni.showToast({
    title: '验证码已发送',
    icon: 'success'
  });
};

// 第三方登录
const thirdPartyLogin = (type: string) => {
  // TODO: 实现第三方登录
  uni.showToast({
    title: `${type}登录功能开发中`,
    icon: 'none'
  });
};

const handleLogin = async () => {
  if (loginType.value === 'account') {
    if (!userAccount.value || !userPassword.value) {
      uni.showToast({
        title: '请输入账号和密码',
        icon: 'none'
      });
      return;
    }

    try {
      const res = await userLoginUsingPost({
        userAccount: userAccount.value,
        userPassword: userPassword.value
      });

      if (res.data) {
        userStore.setLoginUser(res.data as any);
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        });
        uni.switchTab({
          url: '/pages/user/index'
        });
      }
    } catch (error) {
      uni.showToast({
        title: '登录失败：' + (error as Error).message,
        icon: 'none'
      });
    }
  } else if (loginType.value === 'phone') {
    if (!phoneNumber.value || !smsCode.value) {
      uni.showToast({
        title: '请输入手机号和验证码',
        icon: 'none'
      });
      return;
    }
    
    // TODO: 实现手机号登录
    uni.showToast({
      title: '手机号登录功能开发中',
      icon: 'none'
    });
  } else if (loginType.value === 'email') {
    if (!email.value || !emailCode.value) {
      uni.showToast({
        title: '请输入邮箱和验证码',
        icon: 'none'
      });
      return;
    }
    
    // TODO: 实现邮箱登录
    uni.showToast({
      title: '邮箱登录功能开发中',
      icon: 'none'
    });
  }
};

const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/user/register'
  });
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 85vh;
  padding: 40rpx;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

  .login-tabs {
    display: flex;
    justify-content: space-around;
    margin: 30rpx 0 40rpx;
    
    .tab-item {
      font-size: 30rpx;
      color: #666;
      padding: 12rpx 0;
      position: relative;
      
      &.active {
        color: #1890ff;
        font-weight: bold;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background-color: #1890ff;
          border-radius: 2rpx;
        }
      }
    }
  }

  .form {
    .form-item {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      background: #f5f7fa;
      border-radius: 45rpx;
      padding: 0 30rpx;
      border: 1rpx solid #eaeaea;
      
      .icon {
        font-size: 36rpx;
        margin-right: 20rpx;
        color: #999;
      }

      .input {
        flex: 1;
        height: 90rpx;
        font-size: 28rpx;
        background: transparent;
      }
      
      &.code-item {
        padding-right: 0;
      }
      
      .code-input {
        flex: 1;
      }
      
      .code-btn {
        height: 70rpx;
        line-height: 70rpx;
        font-size: 24rpx;
        margin: 0;
        border-radius: 35rpx;
        background-color: #1890ff;
        color: #fff;
        padding: 0 20rpx;
      }
    }

    .login-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      border-radius: 45rpx;
      font-size: 32rpx;
      margin: 50rpx 0 30rpx;
      background: linear-gradient(to right, #1890ff, #36c2ff);
      color: #fff;
      font-weight: bold;
      letter-spacing: 2rpx;
      box-shadow: 0 10rpx 20rpx rgba(24, 144, 255, 0.3);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 5rpx 10rpx rgba(24, 144, 255, 0.2);
      }
    }

    .logout-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      border-radius: 45rpx;
      font-size: 32rpx;
      margin: 20rpx 0;
      background: linear-gradient(to right, #ff4d4f, #ff7875);
      color: #fff;
      font-weight: bold;
      letter-spacing: 2rpx;
      box-shadow: 0 10rpx 20rpx rgba(255, 77, 79, 0.3);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 5rpx 10rpx rgba(255, 77, 79, 0.2);
      }
    }

    .register-link {
      text-align: center;
      font-size: 28rpx;
      color: #666;
      margin-bottom: 40rpx;

      .link {
        color: #1890ff;
        margin-left: 10rpx;
      }
    }
    
    .third-party-login {
      margin-top: 20rpx;
      
      .divider {
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;
        
        .line {
          flex: 1;
          height: 1rpx;
          background-color: #eee;
        }
        
        .text {
          padding: 0 20rpx;
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .third-party-icons {
        display: flex;
        justify-content: space-around;
        
        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          
          .third-icon {
            font-size: 60rpx;
            margin-bottom: 10rpx;
          }
          
          .icon-text {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }
}
</style>