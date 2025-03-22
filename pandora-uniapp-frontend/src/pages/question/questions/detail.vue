<template>
  <view class="container">
    <view class="question-detail">
      <view class="question-header">
        <text class="question-title">{{ question?.title }}</text>
        <view class="question-info">
          <view class="tag" v-if="question?.tagList" v-for="tag in question?.tagList">
            <text class="tag" >{{ tag }}</text>
          </view>
          <text class="difficulty" :class="question?.difficulty">{{ question?.difficulty }}</text>
        </view>
      </view>

      <view class="question-content">
        <text class="content-title">题目详情：</text>
        <rich-text class="content-text" :nodes="question?.content || ''"></rich-text>
      </view>

      <view class="question-answer" v-if="showAnswer">
        <text class="content-title">参考答案：</text>
        <rich-text class="content-text" :nodes="question?.answer || ''"></rich-text>
      </view>

      <button class="answer-btn" type="primary" @tap="toggleAnswer">
        {{ showAnswer ? '隐藏回答' : '推荐回答' }}
      </button>

      <view class="question-stats">
        <view class="stat-item">
          <uni-icons type="eye" size="20" />
          <text>{{ viewCount || question?.viewNum || 0 }}</text>
        </view>
        <view class="stat-item" @tap="handleLike">
          <uni-icons :type="isLiked ? 'heart-filled' : 'heart'" size="20" :color="isLiked ? '#ff4d4f' : '#666'" />
          <text>{{ question?.likeNum || 0 }}</text>
        </view>
        <view class="stat-item" @tap="handleFavorite">
          <uni-icons :type="isFavorited ? 'star-filled' : 'star'" size="20" :color="isFavorited ? '#faad14' : '#666'" />
          <text>{{ question?.favourNum || 0 }}</text>
        </view>
      </view>

      <view class="comment-section">
        <view class="comment-input">
          <input
            class="input"
            type="text"
            v-model="commentText"
            placeholder="写下你的讨论..."
            @confirm="submitComment"
          />
          <button class="submit-btn" @tap="submitComment">发送</button>
        </view>
        <view class="section-title-container">
          <uni-icons type="chat" size="20" color="#1890ff" />
          <text class="section-title">回答讨论 {{ comments?.length || 0 }}个</text>
        </view>
        <view class="comment-list">
          <view class="comment-item" v-for="comment in comments" :key="comment.id">
            <view class="comment-header">
              <image class="avatar" :src="comment.userAvatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
              <view class="user-info">
                <view class="user-name-role">
                  <text class="username">{{ comment.userName }}</text>
                  <text class="user-role" v-if="comment.userRole" :class="comment.userRole">{{ comment.userRole }}</text>
                </view>
                <text class="time">{{ formatTime(comment.createTime) }}</text>
              </view>
            </view>
            <view class="comment-content">{{ comment.content }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getQuestionVoByIdUsingGet, increaseQuestionViewCountUsingPost, getQuestionViewCountUsingGet } from '@/api/questionController';
import { onLoad } from '@dcloudio/uni-app';
import { doThumbUsingPost1,checkThumbUsingGet, getThumbCountUsingGet } from '@/api/questionThumbController';
import { listQuestionCommentByPageUsingPost, addQuestionCommentUsingPost } from '@/api/questionCommentController';
import { getUserVoByIdUsingGet } from '@/api/userController';
import { getFavouriteUsingGet,checkFavouriteUsingGet, doFavouriteUsingPost } from '@/api/questionFavouriteController';
import { useUserStore } from '@/stores/userStore';

// 格式化时间的函数
const formatTime = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 一分钟内
  if (diff < 60000) {
    return '刚刚';
  }
  // 一小时内
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  }
  // 24小时内
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  }
  // 30天内
  if (diff < 2592000000) {
    return `${Math.floor(diff / 86400000)}天前`;
  }
  // 超过30天，显示具体日期
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const question = ref<any>(null);
const showAnswer = ref(false);
const isLiked = ref(false);
const isFavorited = ref(false);
const comments = ref<any[]>([]);
const commentText = ref('');
const viewCount = ref<number>(0); // 添加浏览量的响应式变量

// 获取题目ID和题库ID
const questionId = ref<number>();
const bankId = ref<number>();
const userStore = useUserStore();
import { storeToRefs } from 'pinia';
const { loginUser } = storeToRefs(userStore);
const userInfo = ref(loginUser.value);
onMounted(async () => {
  // 初始化时获取用户信息
  await userStore.getLoginUserInfo();
  userInfo.value = loginUser.value;
});

// 获取题目浏览量
const getQuestionViewCount = async () => {
  try {
    if (!questionId.value) return;
    const res = await getQuestionViewCountUsingGet({
      questionId: questionId.value
    });
    if (res.data !== undefined) {
      viewCount.value = Number(res.data);
      // 更新题目对象中的浏览量
      if (question.value) {
        question.value.viewNum = viewCount.value;
      }
    }
  } catch (error) {
    console.error('获取浏览量失败：', error);
  }
};

// 加载题目详情
const loadQuestionDetail = async () => {
  try {
    if (!questionId.value) return;
    
    // 增加浏览量
    await increaseQuestionViewCountUsingPost({
      questionId: questionId.value
    });
    
    const res = await getQuestionVoByIdUsingGet({
      id: questionId.value
    });
    question.value = res.data;
    
    // 加载点赞状态
    await checkLikeStatus();
    // 加载收藏状态
    await checkFavouriteStatus();
    // 获取最新浏览量
    await getQuestionViewCount();
  } catch (error) {
    uni.showToast({
      title: '获取题目详情失败',
      icon: 'none'
    });
  }
};

// 检查点赞状态
const checkLikeStatus = async () => {
  try {
    if (!questionId.value) return;
    const resp = await checkThumbUsingGet({
      questionId: questionId.value
    });
    // 更新点赞状态
    isLiked.value = Boolean(resp.data);
    // 如果API返回了准确的点赞数，则更新
    const res = await getThumbCountUsingGet({
      questionId: questionId.value
    });
    if (res.data !== undefined) {
      question.value.likeNum = res.data;
    }
  } catch (error) {
    console.error('获取点赞状态失败：', error);
  }
};

// 切换答案显示状态
const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value;
};

// 处理点赞
const handleLike = async () => {
  try {
    // 检查用户是否登录
    if (!userInfo.value) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    if (!questionId.value) {
      uni.showToast({
        title: '题目ID不存在',
        icon: 'none'
      });
      return;
    }
    const res = await doThumbUsingPost1({
      questionId: questionId.value
    });
    // res.data为本次点赞变化数：1表示点赞，-1表示取消点赞
    // 判断是否为点赞操作（1表示点赞，-1表示取消点赞）
    const isAdd = Number(res.data) === 1;
    isLiked.value = isAdd;
    question.value.likeNum += res.data;
    uni.showToast({
      title: isAdd ? '点赞成功' : '已取消点赞',
      icon: 'none'
    });
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

// 检查收藏状态(当前用户是否点赞及收藏数量)
const checkFavouriteStatus = async () => {
  try {
    if (!questionId.value) return;
    const resp = await checkFavouriteUsingGet({
      questionId: questionId.value
    });
    // 更新收藏状态
    isFavorited.value = Boolean(resp.data);
    // 如果API返回了准确的收藏数，则更新
    const res = await getFavouriteUsingGet({
      questionId: questionId.value
    })
    if (res.data!== undefined) {
      question.value.favourNum = Number(res.data);
    }
  } catch (error) {
    console.error('获取收藏状态失败：', error);
  }
};

// 处理收藏
const handleFavorite = async () => {
  try {
    // 检查用户是否登录
    if (!userInfo.value) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    if (!questionId.value) {
      uni.showToast({
        title: '题目ID不存在',
        icon: 'none'
      });
      return;
    }
    const res = await doFavouriteUsingPost({
      questionId: questionId.value
    });
    // res.data为本次收藏变化数：1表示收藏，-1表示取消收藏
    const isAdd = Number(res.data) === 1;
    isFavorited.value = isAdd;
    question.value.favourNum += res.data; // 修正这里，使用 += 而不是 =
    uni.showToast({
      title: isAdd ? '收藏成功' : '已取消收藏',
      icon: 'none'
    });
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

// 加载评论列表
const loadComments = async () => {
  try {
    const res = await listQuestionCommentByPageUsingPost({
      questionId: questionId.value,
      pageSize: 10,
      current: 1
    });
    const commentList = (res.data as any)?.records || [];
    
    // 获取每条评论的用户详细信息
    const commentsWithUserInfo = await Promise.all(
      commentList.map(async (comment: any) => {
        try {
          const userRes = await getUserVoByIdUsingGet({ id: comment.userId });
          return {
            ...comment,
            userAvatar: (userRes.data as any)?.userAvatar,
            userName: (userRes.data as any)?.userName,
            userRole: (userRes.data as any)?.userRole
          };
        } catch (error) {
          console.error('获取用户信息失败：', error);
          return comment;
        }
      })
    );
    
    comments.value = commentsWithUserInfo;
  } catch (error) {
    console.error('加载评论失败：', error);
  }
};

// 提交评论
const submitComment = async () => {
  if (!commentText.value.trim()) {
    uni.showToast({
      title: '请输入评论内容',
      icon: 'none'
    });
    return;
  }

  try {
    await addQuestionCommentUsingPost({
      questionId: questionId.value,
      content: commentText.value.trim()
    });
    commentText.value = '';
    loadComments();
    question.value.commentNum++;
    uni.showToast({
      title: '评论成功',
      icon: 'success'
    });
  } catch (error) {
    uni.showToast({
      title: '评论失败',
      icon: 'none'
    });
  }
};

onLoad((options) => {
  questionId.value = Number(options?.id);
  bankId.value = Number(options?.bankId);
  loadQuestionDetail();
  loadComments();
});
</script>

<style lang="scss">
.container {
  padding: 20rpx;
}

.question-detail {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;

  .question-header {
    margin-bottom: 30rpx;

    .question-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }

    .question-info {
      display: flex;
      align-items: center;
      gap: 20rpx;

      .tag {
        background: #e6f4ff;
        color: #1890ff;
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
      }

      .difficulty {
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;

        &.简单 {
          background: #f6ffed;
          color: #52c41a;
        }

        &.中等 {
          background: #fff7e6;
          color: #fa8c16;
        }

        &.困难 {
          background: #fff1f0;
          color: #f5222d;
        }
      }
    }
  }

  .question-content,
  .question-answer {
    margin-bottom: 30rpx;

    .content-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }

    .content-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }

  .answer-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    margin-top: 40rpx;
  }

  .question-stats {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 2rpx 0;
  
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      padding: 12rpx 20rpx;
      border-radius: 12rpx;
      transition: all 0.3s ease;
      
      uni-icons {
        font-size: 36rpx;
      }
      
      text {
        font-size: 24rpx;
        font-weight: 500;
        color: #666;
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
  }
  
  .comment-section {
    margin-top: 40rpx;
  
    .section-title-container {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      margin-top: 30rpx;
      padding-bottom: 16rpx;
      border-bottom: 1px solid #eee;
      
      .section-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-left: 10rpx;
      }
    }
  
    .comment-list {
      .comment-item {
        margin-bottom: 30rpx;
        padding-bottom: 20rpx;
        border-bottom: 1px solid #eee;
  
        .comment-header {
          display: flex;
          align-items: center;
          margin-bottom: 16rpx;
  
          .avatar {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            margin-right: 16rpx;
          }
  
          .user-info {
            .user-name-role {
              display: flex;
              align-items: center;
              gap: 12rpx;
              margin-bottom: 4rpx;
              
              .username {
                font-size: 26rpx;
                color: #333;
              }
              
              .user-role {
                font-size: 22rpx;
                padding: 2rpx 12rpx;
                border-radius: 10rpx;
                
                &.管理员 {
                  color: #ff4d4f;
                  background: #fff2f0;
                }
                
                &.会员 {
                  color: #faad14;
                  background: #fff7e6;
                }
                
                &.用户 {
                  color: #1890ff;
                  background: #e6f4ff;
                }
              }
            }

            .time {
              font-size: 22rpx;
              color: #999;
            }
          }
        }
  
        .comment-content {
          font-size: 26rpx;
          color: #666;
          line-height: 1.6;
        }
      }
    }
  
    .comment-input {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-top: 30rpx;
  
      .input {
        flex: 1;
        height: 70rpx;
        padding: 0 20rpx;
        background: #f5f5f5;
        border-radius: 35rpx;
        font-size: 26rpx;
      }
  
      .submit-btn {
        width: 140rpx;
        height: 70rpx;
        line-height: 70rpx;
        text-align: center;
        background: #1890ff;
        color: #fff;
        border-radius: 35rpx;
        font-size: 26rpx;
      }
    }
  }
}
</style>