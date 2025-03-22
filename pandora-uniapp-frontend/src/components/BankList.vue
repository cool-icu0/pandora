<script setup lang="ts">
defineProps<{
  bankList: API.QuestionBankVO[]
}>()

const handleBankSelect = (bankId: number) => {
  uni.navigateTo({
    url: `/pages/question/banks/detail?id=${bankId}`
  })
}

const handleMoreBanks = () => {
  uni.navigateTo({
    url: '/pages/question/banks/index'
  })
}
</script>

<template>
  <scroll-view scroll-x class="bank-scroll" show-scrollbar="false">
    <view class="bank-list">
      <view 
        v-for="bank in bankList" 
        :key="bank.id" 
        class="bank-item"
        @click="bank.id && handleBankSelect(bank.id)"
      >
        <text class="bank-icon"><img class="bank-image" :src="bank.picture" alt="图片"></text>
        <text class="bank-name">{{ bank.title }}</text>
      </view>
      <view 
        v-if="bankList.length >= 4" 
        class="bank-item more"
        @click="handleMoreBanks"
      >
        <text class="bank-icon">👉</text>
        <text class="bank-name">更多题库</text>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped>
.bank-scroll {
  width: 100%;
}

.bank-list {
  display: flex;
  padding: 20rpx;
  gap: 20rpx;  /* 添加固定间距 */
  justify-content: flex-start;  /* 改为左对齐 */
}

.bank-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140rpx;  /* 调整宽度，考虑间距 */
  height: 140rpx;
  background: #f2f7fd;
  border-radius: 16rpx;
  flex-shrink: 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.bank-item:active {
  transform: scale(0.95);
}

.bank-icon {
  margin-bottom: 12rpx;
}

.bank-image {
  width: 72rpx;
  height: 72rpx;
  object-fit: cover;
  border-radius: 12rpx;
}

.bank-name {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.bank-item.more {
  background: #e6f7ff;
  border: 2rpx solid #91d5ff;
}
</style>