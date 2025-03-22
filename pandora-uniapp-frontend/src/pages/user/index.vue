<template>
  <view class="container">
    
    <view class="user-card">
      <!-- 添加退出登录按钮到页面右上角 -->
    <!-- 添加退出按钮到卡片右上角 -->
    <view v-if="userInfo" class="logout-corner" @tap="handleLogout">
        <image class="logout-icon" src="/static/images/index/tuichu_1.png" mode="aspectFit" />
      </view>
      <view class="user-header">
        <view class="avatar-container">
          <image class="avatar" :src="userInfo?.userAvatar || '/static/images/login/notLoginUser.png'" mode="aspectFill" />
          <text v-if="userInfo" class="role-badge">{{ userInfo.userRole === 'admin' ? '管理员' : '用户' }}</text>
        </view>
        <text class="nickname">{{ userInfo?.userName || '未登录' }}</text>
      </view>
      
      <view class="user-info" v-if="userInfo">
        <view class="info-item">
          <text class="label">简介</text>
          <text class="value">{{ userInfo.userProfile }}</text>
        </view>
      </view>
      
      <button class="action-btn" type="primary" v-if="!userInfo" @tap="goToLogin">去登录</button>
      <!-- 移除原来位置的退出登录按钮 -->
    </view>
    
    <view class="menu-list">
      <view class="menu-item" @tap="goToFavorites">
        <text class="menu-title">我的收藏</text>
        <text class="menu-arrow">></text>
      </view>

      <view class="menu-item" @tap="goToFavorites">
        <text class="menu-title">我的评论</text>
        <text class="menu-arrow">></text>
      </view>

      <view class="menu-item" @tap="goToFavorites">
        <text class="menu-title">我的点赞</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @tap="goToHistory">
        <text class="menu-title">刷题记录</text>
        <text class="menu-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { onShow } from '@dcloudio/uni-app';
import { userLogoutUsingPost } from '@/api/userController';

const userStore = useUserStore();
const { loginUser } = storeToRefs(userStore);
const userInfo = ref(loginUser.value);

onMounted(async () => {
  // 初始化时获取用户信息
  await userStore.getLoginUserInfo();
  userInfo.value = loginUser.value;
});

// 监听页面显示
onShow(async () => {  // 每次页面显示时更新用户信息
  await userStore.getLoginUserInfo();
  userInfo.value = loginUser.value;
});

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.clearLoginUser();

        userLogoutUsingPost();
        // 强制更新页面数据
        userInfo.value = undefined as any;
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        });
        // 刷新当前页面
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/user/index'
          });
        }, 500);
      }
    }
  });
};

// 跳转到收藏页面
const goToFavorites = () => {
  if (!userInfo.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }
  // TODO: 实现跳转到收藏页面
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  });
};

// 跳转到刷题记录页面
const goToHistory = () => {
  if (!userInfo.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }
  // 跳转到刷题记录页面
  uni.navigateTo({
    url: '/pages/user/history'
  });
};
// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/user/login'
  });
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  padding: 20rpx;
  background-color: #f5f5f5;
  position: relative; /* 添加相对定位 */
}

/* 添加右上角退出登录按钮样式 */
.logout-corner {
  position: fixed;
  top: 20rpx;
  right: 20rpx;
  z-index: 100;
  border-radius: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.user-card {
  position: relative;  /* 添加相对定位 */
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  /* 修改退出按钮样式 */
  .logout-corner {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    z-index: 100;
    padding: 10rpx;
    border-radius: 50%;
    
    .logout-icon {
      width: 40rpx;
      height: 30rpx;
    }
  }

  .user-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40rpx;

    .avatar-container {
      position: relative;
      margin-bottom: 20rpx;
      
      .avatar {
        width: 160rpx;
        height: 160rpx;
        border-radius: 50%;
      }
      
      .role-badge {
        position: absolute;
        top: 0;
        right: -50rpx; /* 向右移动更多 */
        background: linear-gradient(135deg, #ff4d4f, #ff7a45);
        color: #fff;
        font-size: 20rpx;
        padding: 6rpx 14rpx;
        border-radius: 20rpx;
        box-shadow: 0 4rpx 8rpx rgba(255, 77, 79, 0.3);
        font-weight: bold;
        transform: scale(1);
        transition: transform 0.3s ease;
        border: 2rpx solid #fff;
        z-index: 10;
      }
      
      /* 为管理员角标添加特殊样式 */
      .role-badge:contains('管理员') {
        background: linear-gradient(135deg, #1890ff, #36cfc9);
        box-shadow: 0 4rpx 8rpx rgba(24, 144, 255, 0.3);
        animation: badgePulse 2s infinite;
      }
      
      /* 添加闪烁动画 */
      @keyframes badgePulse {
        0% {
          box-shadow: 0 4rpx 8rpx rgba(24, 144, 255, 0.3);
        }
        50% {
          box-shadow: 0 4rpx 15rpx rgba(24, 144, 255, 0.8);
        }
        100% {
          box-shadow: 0 4rpx 8rpx rgba(24, 144, 255, 0.3);
        }
      }
      
      .role-badge:contains('管理员') {
        background: linear-gradient(135deg, #1890ff, #36cfc9);
        box-shadow: 0 4rpx 8rpx rgba(24, 144, 255, 0.3);
      }
    }

    .nickname {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .user-info {
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .label {
        font-size: 28rpx;
        color: #666;
      }

      .value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .action-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    margin-top: 20rpx;
  }
}

.menu-list {
  background: #fff;
  border-radius: 20rpx;
  padding: 0 20rpx;

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .menu-title {
      font-size: 28rpx;
      color: #333;
    }

    .menu-arrow {
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>