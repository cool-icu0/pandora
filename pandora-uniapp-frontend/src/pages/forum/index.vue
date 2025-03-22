<template>
  <view class="container">
    <view class="header">
      <text class="title">交流论坛</text>
      <view class="post-btn" @tap="goToCreatePost">
        <text class="post-btn-text">发帖</text>
      </view>
    </view>
    
    <view class="filter-bar">
      <view class="filter-item" :class="{ active: currentTab === 'latest' }" @tap="switchTab('latest')">
        <text>最新</text>
      </view>
      <view class="filter-item" :class="{ active: currentTab === 'hot' }" @tap="switchTab('hot')">
        <text>热门</text>
      </view>
      <view class="filter-item" :class="{ active: currentTab === 'my' }" @tap="switchTab('my')">
        <text>我的</text>
      </view>
    </view>
    
    <scroll-view scroll-y class="post-list" @scrolltolower="loadMore">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      <view v-else-if="posts.length === 0" class="empty">
        <text>暂无帖子</text>
      </view>
      <view v-else>
        <view v-for="(post, index) in posts" :key="post.id" class="post-item" @tap="goToPostDetail(post.id)">
          <view class="post-header">
            <image class="avatar" :src="post.userAvatar || '/static/images/login/notLoginUser.png'" mode="aspectFill"></image>
            <view class="post-info">
              <text class="username">{{ post.userName }}</text>
              <text class="time">{{ formatTime(post.createTime) }}</text>
            </view>
          </view>
          <view class="post-content">
            <text class="post-title">{{ post.title }}</text>
            <text class="post-summary">{{ post.content }}</text>
          </view>
          <view class="post-footer">
            <view class="action-item">
              <text class="icon">⭐</text>
              <text class="count">{{ post.favourNum || 0 }}</text>
            </view>
            <view class="action-item">
              <text class="icon">👍</text>
              <text class="count">{{ post.thumbNum || 0 }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view v-if="hasMore && !loading" class="load-more" @tap="loadMore">
        <text>加载更多</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { onShow } from '@dcloudio/uni-app';

// 导入帖子相关接口
import { listPostVoByPageUsingPost, listMyPostVoByPageUsingPost } from '@/api/postController';

const userStore = useUserStore();
const posts = ref<any[]>([]);
const currentTab = ref('latest');
const loading = ref(false);
const hasMore = ref(true);
const page = ref(1);
const pageSize = ref(10);

// 删除 mockPosts 数组

// 加载帖子
const loadPosts = async () => {
  if (loading.value) return;
  loading.value = true;
  
  try {
    const params = {
      current: page.value,
      pageSize: pageSize.value,
      sortField: currentTab.value === 'hot' ? 'viewCount' : 'createTime',
      sortOrder: currentTab.value === 'hot' ? 'descend' : 'descend'
    };

    let res;
    if (currentTab.value === 'my') {
      if (!userStore.loginUser) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        loading.value = false;
        return;
      }
      res = await listMyPostVoByPageUsingPost(params);
    } else {
      res = await listPostVoByPageUsingPost(params);
    }

    if (res.code === 0 && res.data) {
      const { records, total } = res.data;
      posts.value = page.value === 1 ? records : [...posts.value, ...records];
      hasMore.value = posts.value.length < total;
    } else {
      uni.showToast({
        title: '获取帖子列表失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('加载帖子失败:', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPosts();
});

onShow(() => {
  // 每次页面显示时刷新数据
  page.value = 1;
  posts.value = [];
  loadPosts();
});

// 切换标签
const switchTab = (tab: string) => {
  if (tab === 'my' && !userStore.loginUser) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }
  
  currentTab.value = tab;
  page.value = 1;
  posts.value = [];
  hasMore.value = true;
  loadPosts();
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  page.value++;
  loadPosts();
};

// 跳转到发帖页面
const goToCreatePost = () => {
  if (!userStore.loginUser) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }
  
  uni.navigateTo({
    url: '/pages/forum/create'
  });
};

// 跳转到帖子详情
const goToPostDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/forum/detail?id=${id}`
  });
};

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = new Date().getTime();
  const diff = now - timestamp;
  
  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  
  .title {
    font-size: 36rpx;
    font-weight: 800;
    background: linear-gradient(135deg, #1890ff, #36cfc9);
    -webkit-background-clip: text;
    color: transparent;
  }
  
  .post-btn {
    background: linear-gradient(135deg, #1890ff, #36cfc9);
    padding: 12rpx 30rpx;
    border-radius: 32rpx;
    box-shadow: 0 4rpx 15rpx rgba(24, 144, 255, 0.3);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.95);
    }
    
    .post-btn-text {
      color: #fff;
      font-size: 26rpx;
      font-weight: 500;
    }
  }
}

.filter-bar {
  display: flex;
  background-color: #fff;
  padding: 0 16rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
  
  .filter-item {
    padding: 20rpx 30rpx;
    margin-right: 16rpx;
    position: relative;
    transition: all 0.3s ease;
    
    text {
      font-size: 26rpx;
      color: #666;
      transition: all 0.3s ease;
    }
    
    &.active {
      text {
        color: #1890ff;
        font-weight: bold;
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 25rpx;
        right: 25rpx;
        height: 4rpx;
        background: linear-gradient(90deg, #1890ff, #36cfc9);
        border-radius: 2rpx;
        transition: all 0.3s ease;
      }
    }
    
    &:active {
      opacity: 0.8;
    }
  }
}

.post-list {
  flex: 1;
}

.post-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
  
  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 16rpx;
      border: 3rpx solid #fff;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    }
    
    .post-info {
      display: flex;
      flex-direction: column;
      
      .username {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 4rpx;
      }
      
      .time {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
  
  .post-content {
    margin-bottom: 20rpx;
    
    .post-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
    }
    
    .post-summary {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  
  .post-footer {
    display: flex;
    border-top: 1rpx solid rgba(0, 0, 0, 0.05);
    padding-top: 20rpx;
    
    .action-item {
      display: flex;
      align-items: center;
      margin-right: 32rpx;
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.95);
      }
      
      .icon {
        font-size: 28rpx;
        margin-right: 8rpx;
      }
      
      .count {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.loading, .empty, .load-more {
  text-align: center;
  padding: 32rpx;
  
  text {
    font-size: 26rpx;
    color: #999;
    background: linear-gradient(135deg, #1890ff, #36cfc9);
    -webkit-background-clip: text;
    color: transparent;
  }
}
</style>