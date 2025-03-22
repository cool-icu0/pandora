<template>
  <view class="container">
    <!-- 帖子内容区域 -->
    <view class="post-detail">
      <view class="post-header">
        <view class="user-info">
          <image class="avatar" :src="post.userAvatar || '/static/images/login/notLoginUser.png'" mode="aspectFill"></image>
          <view class="info">
            <text class="username">{{ post.userName }}</text>
            <text class="time">{{ formatTime(post.createTime) }}</text>
          </view>
        </view>
        <view class="actions" v-if="isCurrentUser">
          <text class="delete" @tap="deletePost">删除</text>
        </view>
      </view>
      
      <view class="post-content">
        <text class="title">{{ post.title }}</text>
        <text class="content">{{ post.content }}</text>
        <view class="image-list" v-if="post.images && post.images.length">
          <image 
            v-for="(img, index) in post.images" 
            :key="index" 
            :src="img" 
            mode="aspectFill"
            @tap="previewImage(index)"
          ></image>
        </view>
      </view>
      
      <view class="post-stats">
        <view class="stat-item" @tap="handleLike">
          <text class="icon" :class="{ active: isLiked }">👍</text>
          <text class="count">{{ post.likeCount || 0 }}</text>
        </view>
        <view class="stat-item">
          <text class="icon">💬</text>
          <text class="count">{{ post.commentCount || 0 }}</text>
        </view>
      </view>
    </view>

    <!-- 评论区域 -->
    <view class="comments-section">
      <view class="section-title">评论 ({{ post.commentCount || 0 }})</view>
      <view class="comment-list">
        <view v-if="comments.length === 0" class="empty-comments">
          <text>暂无评论，快来抢沙发吧~</text>
        </view>
        <view v-else v-for="comment in comments" :key="comment.id" class="comment-item">
          <image class="avatar" :src="comment.userAvatar || '/static/images/login/notLoginUser.png'" mode="aspectFill"></image>
          <view class="comment-content">
            <text class="username">{{ comment.userName }}</text>
            <text class="text">{{ comment.content }}</text>
            <view class="comment-footer">
              <text class="time">{{ formatTime(comment.createTime) }}</text>
              <text class="reply" @tap="replyComment(comment)">回复</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 评论输入框 -->
    <view class="comment-input">
      <input 
        type="text"
        v-model="commentText"
        :placeholder="replyTo ? `回复 ${replyTo.userName}` : '说点什么吧...'"
        confirm-type="send"
        @confirm="submitComment"
      />
      <text class="send-btn" @tap="submitComment">发送</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const post = ref<any>({});
const comments = ref<any[]>([]);
const commentText = ref('');
const replyTo = ref<any>(null);
const isLiked = ref(false);

// 模拟数据
onMounted(() => {
  post.value = {
    id: 1,
    title: '前端面试常见问题总结',
    content: '分享一下我最近面试遇到的一些问题，希望对大家有帮助...',
    userName: '前端小王',
    userAvatar: '/static/images/login/notLoginUser.png',
    createTime: Date.now() - 3600000,
    likeCount: 32,
    commentCount: 15,
    images: []
  };
  
  comments.value = [
    {
      id: 1,
      content: '感谢分享，很有帮助！',
      userName: '用户A',
      userAvatar: '/static/images/login/notLoginUser.png',
      createTime: Date.now() - 1800000
    }
  ];
});

// 判断是否是当前用户的帖子
const isCurrentUser = computed(() => {
  return userStore.loginUser?.id === post.value.userId;
});

// 点赞
const handleLike = () => {
  if (!userStore.loginUser) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
  isLiked.value = !isLiked.value;
  post.value.likeCount += isLiked.value ? 1 : -1;
};

// 删除帖子
const deletePost = () => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这个帖子吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '删除成功', icon: 'success' });
        setTimeout(() => uni.navigateBack(), 1500);
      }
    }
  });
};

// 预览图片
const previewImage = (index: number) => {
  uni.previewImage({
    urls: post.value.images,
    current: index
  });
};

// 回复评论
const replyComment = (comment: any) => {
  replyTo.value = comment;
};

// 提交评论
const submitComment = () => {
  if (!userStore.loginUser) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
  
  if (!commentText.value.trim()) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' });
    return;
  }
  
  // 模拟提交评论
  const newComment = {
    id: comments.value.length + 1,
    content: commentText.value,
    userName: userStore.loginUser.userName,
    userAvatar: userStore.loginUser.userAvatar,
    createTime: Date.now()
  };
  
  comments.value.unshift(newComment);
  post.value.commentCount++;
  commentText.value = '';
  replyTo.value = null;
  
  uni.showToast({ title: '评论成功', icon: 'success' });
};

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.post-detail {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .post-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30rpx;
    
    .user-info {
      display: flex;
      align-items: center;
      
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      
      .info {
        .username {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          display: block;
        }
        
        .time {
          font-size: 24rpx;
          color: #999;
          margin-top: 4rpx;
        }
      }
    }
    
    .actions {
      .delete {
        font-size: 28rpx;
        color: #ff4d4f;
      }
    }
  }
  
  .post-content {
    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .content {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .image-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10rpx;
      
      image {
        width: 100%;
        height: 200rpx;
        border-radius: 8rpx;
      }
    }
  }
  
  .post-stats {
    display: flex;
    margin-top: 30rpx;
    border-top: 1rpx solid #f5f5f5;
    padding-top: 20rpx;
    
    .stat-item {
      display: flex;
      align-items: center;
      margin-right: 40rpx;
      
      .icon {
        font-size: 32rpx;
        margin-right: 8rpx;
        
        &.active {
          color: #1890ff;
        }
      }
      
      .count {
        font-size: 28rpx;
        color: #999;
      }
    }
  }
}

.comments-section {
  background-color: #fff;
  padding: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .empty-comments {
    text-align: center;
    padding: 40rpx 0;
    color: #999;
  }
  
  .comment-item {
    display: flex;
    margin-bottom: 30rpx;
    
    .avatar {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    
    .comment-content {
      flex: 1;
      
      .username {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
        display: block;
      }
      
      .text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.5;
        margin-bottom: 8rpx;
        display: block;
      }
      
      .comment-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .time {
          font-size: 24rpx;
          color: #999;
        }
        
        .reply {
          font-size: 24rpx;
          color: #1890ff;
        }
      }
    }
  }
}

.comment-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  input {
    flex: 1;
    height: 72rpx;
    background-color: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    margin-right: 20rpx;
  }
  
  .send-btn {
    font-size: 28rpx;
    color: #1890ff;
    padding: 0 20rpx;
  }
}
</style>