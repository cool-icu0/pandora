<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QuestionList from '@/components/QuestionList.vue'
import BankList from '@/components/BankList.vue'  // 添加导入
import Banner from '@/components/Banner.vue'
import { listQuestionVoByPageUsingPost } from '@/api/questionController'
import { listQuestionBankVoByPageUsingPost } from '@/api/questionBankController'

const questionList = ref<API.QuestionVO[]>([])
const questionBanks = ref<API.QuestionBankVO[]>([])

// 获取题库列表
const loadQuestionBanks = async () => {
  try {
    const res = await listQuestionBankVoByPageUsingPost({ 
      pageSize: 8,
      current: 1,
      sortField: 'createTime',
      sortOrder: 'desc'
    })
    questionBanks.value = (res.data as any)?.records || []
  } catch (error) {
    console.error('获取题库列表失败：', error)
  }
}

// 获取推荐题目列表
const loadRecommendQuestions = async () => {
  try {
    const res = await listQuestionVoByPageUsingPost({ pageSize: 6 })
    questionList.value = (res.data as any)?.records || []
  } catch (error) {
    console.error('获取推荐题目失败：', error)
  }
}
onMounted(() => {
  loadRecommendQuestions()
  loadQuestionBanks()
})

// 可以添加广告数据,示例数据，实际使用时可以通过 API 获取
const ads = ref([
  // {
  //   id: 1,
  //   image: "https://www.mianshiya.com/logo.png",
  //   url: '跳转链接'
  // },
  // {
  //   id: 2,
  //   image: "https://www.mianshiya.com/logo.png",
  //   url: '跳转链接'
  // }
])

// 导航到所有题库页面
const navigateToAllBanks = () => {
  uni.navigateTo({
    url: '/pages/question/questions/index'
  })
}
</script>

<template>
  <view class="container">
    <Banner 
      title="智能刷题平台"
      subtitle="你的面试刷题助手"
      :ads="ads"
    />
    
    <view class="view-section">
      <view class="section-title">热门题库</view>
      <BankList :bank-list="questionBanks" />
    </view>
    
    <view class="view-section">
      
      <view class="section-header">
        <view class="section-title">推荐题目</view>
        <view class="more-link" @click="navigateToAllBanks">更多 ></view>
      </view>
      <QuestionList :question-list="questionList" />
    </view>
  </view>
</template>

<style scoped>

.section-title {
  font-size: 28rpx;  /* 原来是 32rpx */
  font-weight: bold;
  margin: 30rpx 0;
}

.question-card {
  margin-bottom: 20rpx;
}

.question-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.question-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
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
  color: #faad14;
  background-color: #fff7e6;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
}

.view-section {
  margin: 12rpx 20rpx;  /* 原来是 20rpx */
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;  /* 原来是 20rpx */
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin: 20rpx 0;  /* 原来是 30rpx 0 */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-link {
  font-size: 24rpx;
  color: #999;
}

.bank-scroll {
  width: 100%;
}

.bank-list {
  display: flex;
  padding: 10rpx 0;
}

.bank-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  margin-right: 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.bank-icon {
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.bank-name {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.bank-count {
  font-size: 20rpx;
  color: #999;
}

.bank-item.more {
  background: #e6f7ff;
}
.bank-image {
  width: 80rpx;
  height: 80rpx;
  object-fit: cover;
  border-radius: 8rpx;
}
</style>