<template>
  <view class="question-list">
    <view v-if="loading" class="loading-state">
      <uni-load-more status="loading" />
    </view>
    <view v-else-if="error" class="error-state">
      <text>{{ error }}</text>
    </view>
    <view v-else-if="questionList.length === 0" class="empty-state">
      <text>暂无题目</text>
    </view>
    <view
      v-else
      class="question-card card"
      v-for="question in questionList"
      :key="question.id"
      @tap="goToDetail(question.id ?? 0)"
    >
      <text class="question-title">{{ question.title }}</text>
      <rich-text class="question-content" :nodes="formatContent(question.content)" />
      <view class="question-info">
        <view class="left-info">
          <text class="tag" v-for="tag in question.tagList" :key="tag">{{ tag }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  questionList: API.QuestionVO[];
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
});

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/question/questions/detail?id=${id}`
  });
};

const formatContent = (content?: string) => {
  if (!content) return '';
  const truncated = content.slice(0, 100);
  return truncated + (content.length > 100 ? '...' : '');
};

</script>

<style>
.question-list {
  padding: 20rpx;
  min-height: 200rpx;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  color: #999;
  font-size: 28rpx;
}

.retry-btn {
  margin-top: 16rpx;
  padding: 8rpx 24rpx;
  font-size: 24rpx;
  color: #1890ff;
  background: #fff;
  border: 1px solid #1890ff;
  border-radius: 4rpx;
}

.question-card {
  background-color: #f2f7fd;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.question-card:active {
  transform: scale(0.98);
  opacity: 0.8;
}

.question-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.question-content {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
  line-height: 1.5;
}

.question-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.right-info {
  display: flex;
  gap: 24rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 24rpx;
  color: #999;
}

.tag {
  font-size: 24rpx;
  color: #1890ff;
  background-color: #e6f7ff;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
}

.difficulty {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
}

.difficulty.简单 {
  color: #52c41a;
  background-color: #f6ffed;
}

.difficulty.中等 {
  color: #faad14;
  background-color: #fff7e6;
}

.difficulty.困难 {
  color: #f5222d;
  background-color: #fff1f0;
}
</style>