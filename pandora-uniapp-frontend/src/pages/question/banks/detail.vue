<template>
  <view class="container">
    <view class="bank-info">
      <view class="bank-header">
        <image class="bank-avatar" :src="bank?.picture || '/static/images/login/notLoginUser.png'" mode="aspectFill" />
        <view class="bank-title">{{ bank?.title }}</view>
      </view>
      <view class="bank-desc">{{ bank?.description }}</view>
      <button class="start-btn" type="primary" @tap="startPractice" :disabled="!firstQuestionId">
        开始刷题
      </button>
    </view>

    <view class="question-list">
      <view class="list-header">
        <text class="list-title">题目列表（{{ bank?.questionPage?.total || 0 }}）</text>
      </view>
      <view class="question-item" v-for="question in questions" :key="question.id" @tap="goToQuestion(question.id)">
        <view class="question-title">{{ question.title }}</view>
        <view class="question-info">
          <text class="tag">{{ question.tags?.[0] }}</text>
          <text class="difficulty" :class="question.difficulty">{{ question.difficulty }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getQuestionBankVoByIdUsingGet } from '@/api/questionBankController';
import { onLoad } from '@dcloudio/uni-app';

const bank = ref<any>(null);
const questions = ref<any[]>([]);
const firstQuestionId = ref<number>();

// 获取题库ID
const bankId = ref<string>();

// 加载题库详情
const loadBankDetail = async () => {
  try {
    const res = await getQuestionBankVoByIdUsingGet({
      id: bankId.value ? Number(bankId.value) : undefined,
      needQueryQuestionList: true,
      pageSize: 10
    });
    bank.value = res.data;
    questions.value = (res.data as any).questionPage?.records || [];
    if (questions.value.length > 0) {
      firstQuestionId.value = questions.value[0].id;
    }
  } catch (error) {
    uni.showToast({
      title: '获取题库详情失败',
      icon: 'none'
    });
  }
};

// 开始刷题
const startPractice = () => {
  if (firstQuestionId.value) {
    uni.navigateTo({
      url: `/pages/question/questions/detail?id=${firstQuestionId.value}&bankId=${bankId.value}`
    });
  }
};

// 跳转到题目详情
const goToQuestion = (questionId: number) => {
  uni.navigateTo({
    url: `/pages/question/questions/detail?id=${questionId}&bankId=${bankId.value}`
  });
};

onLoad((options) => {
  bankId.value = options?.id;
  loadBankDetail();
});
</script>

<style lang="scss">
.container {
  padding: 20rpx;
}

.bank-info {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .bank-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .bank-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .bank-title {
      font-size: 32rpx;
      font-weight: bold;
    }
  }

  .bank-desc {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 30rpx;
  }

  .start-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
  }
}

.question-list {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;

  .list-header {
    margin-bottom: 20rpx;

    .list-title {
      font-size: 32rpx;
      font-weight: bold;
    }
  }

  .question-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .question-title {
      font-size: 28rpx;
      margin-bottom: 10rpx;
    }

    .question-info {
      display: flex;
      align-items: center;

      .tag {
        font-size: 24rpx;
        color: #666;
        background: #f5f5f5;
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        margin-right: 16rpx;
      }

      .difficulty {
        font-size: 24rpx;
        padding: 4rpx 16rpx;
        border-radius: 20rpx;

        &.简单 {
          color: #52c41a;
          background: #f6ffed;
        }

        &.中等 {
          color: #faad14;
          background: #fff7e6;
        }

        &.困难 {
          color: #ff4d4f;
          background: #fff1f0;
        }
      }
    }
  }
}
</style>