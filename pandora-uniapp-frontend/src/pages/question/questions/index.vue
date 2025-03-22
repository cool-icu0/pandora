<template>
  <view class="container">
    <view class="filter-bar">
      <view class="search-box">
        <input
          class="search-input"
          type="text"
          v-model="searchText"
          placeholder="搜索题目"
          @confirm="handleSearch"
        />
      </view>
      
      <scroll-view class="tag-scroll" scroll-x>
        <view class="tag-list">
          <view
            class="tag-item"
            :class="{ active: (tag === '全部' && selectedTag === '') || selectedTag === tag }"
            v-for="tag in tags"
            :key="tag"
            @tap="selectTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="question-list">
      <view
        class="question-item"
        v-for="question in questions"
        :key="question.id"
        @tap="goToQuestion(question.id)"
      >
        <text class="question-title">{{ question.title }}</text>
        <view class="question-content">{{ question.content }}</view>
        <view class="question-info">
          <view class="tags">
            <text class="tag" v-for="tag in question.tags" :key="tag">{{ tag }}</text>
          </view>
        </view>
      </view>
    </view>

    <uni-load-more :status="loadMoreStatus" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onReachBottom } from '@dcloudio/uni-app';
import { listQuestionVoByPageUsingPost } from '@/api/questionController';

const searchText = ref('');
const selectedTag = ref('');
const questions = ref<any[]>([]);
const page = ref(1);
const loadMoreStatus = ref<'more' | 'loading' | 'noMore'>('more');

const tags = [
  '全部',
  '前端',
  '后端',
  'Java',
  'Python',
  'JavaScript',
  'React',
  'Vue',
  '算法',
  '数据库',
  '云计算'
];

onMounted(() => {
  loadQuestions();
});

const loadQuestions = async (reset = false) => {
  if (reset) {
    page.value = 1;
    questions.value = [];
  }

  loadMoreStatus.value = 'loading';
  
  try {
    const response = await listQuestionVoByPageUsingPost({
      pageSize: 6,
      current: page.value,
      searchText: searchText.value,
      tags: selectedTag.value ? [selectedTag.value] : undefined
    });

    const newQuestions = (response.data as any )?.records || [];
    questions.value = [...questions.value, ...newQuestions];
    page.value++;
    loadMoreStatus.value = newQuestions.length < 4 ? 'noMore' : 'more';
  } catch (error) {
    console.error('加载题目失败：', error);
    loadMoreStatus.value = 'more';
  }
};

const handleSearch = () => {
  loadQuestions(true);
};

const selectTag = (tag: string) => {
  selectedTag.value = tag === '全部' ? '' : tag;
  loadQuestions(true);
};

const goToQuestion = (id: number) => {
  uni.navigateTo({
    url: `/pages/question/questions/detail?id=${id}`  // 修改为正确的路径
  });
};

onReachBottom(() => {
  if (loadMoreStatus.value === 'more') {
    loadQuestions();
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.filter-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding-bottom: 20rpx;
  
  .search-box {
    margin-bottom: 20rpx;
    
    .search-input {
      width: 100%;
      height: 80rpx;
      background: #ebedf0;
      border-radius: 40rpx;
      padding: 0 40rpx;  /* 增加左右内边距，避免文字贴近圆角 */
      font-size: 28rpx;
      box-sizing: border-box;  /* 确保内边距不会影响整体宽度 */
    }
  }
  
  .tag-scroll {
    white-space: nowrap;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    .tag-list {
      display: inline-block;
      padding-bottom: 12rpx;  /* 添加底部间距 */
      
      .tag-item {
        display: inline-block;
        padding: 10rpx 30rpx;
        margin-right: 20rpx;
        font-size: 28rpx;
        color: #666;
        background: #f5f5f5;
        border-radius: 30rpx;
        
        &.active {
          color: #fff;
          background: #1890ff;
        }
      }
    }
  }
}

.question-list {
  margin-top: 20rpx;
  
  .question-item {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .question-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }
    
    .question-content {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 20rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    
    .question-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .tags {
        display: flex;
        flex-wrap: wrap;
        
        .tag {
          font-size: 24rpx;
          color: #1890ff;
          background: rgba(24, 144, 255, 0.1);
          padding: 4rpx 12rpx;
          border-radius: 4rpx;
          margin-right: 10rpx;
          margin-bottom: 10rpx;
        }
      }
    }
  }
}
</style>