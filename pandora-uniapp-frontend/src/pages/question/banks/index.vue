<template>
  <view class="container">
    <view class="search-box">
      <input
        class="search-input"
        type="text"
        v-model="searchText"
        placeholder="搜索题库"
        @confirm="handleSearch"
      />
    </view>

    <view class="bank-list">
      <view
        class="bank-item"
        v-for="bank in banks"
        :key="bank.id"
        @tap="goToBank(bank.id)"
      >
        <view class="bank-header">
          <image class="bank-image" :src="bank.picture || '/static/images/default-avatar.png'" mode="aspectFill" />
          <view class="bank-info">
            <text class="bank-title">{{ bank.title }}</text>
            <text class="bank-desc">{{ bank.description }}</text>
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

const searchText = ref('');
const banks = ref<any[]>([]);
const page = ref(1);
const loadMoreStatus = ref<'more' | 'loading' | 'noMore'>('more');

onMounted(() => {
  loadBanks();
});

import { listQuestionBankVoByPageUsingPost } from '@/api/questionBankController';

const loadBanks = async (reset = false) => {
  if (reset) {
    page.value = 1;
    banks.value = [];
  }

  loadMoreStatus.value = 'loading';
  
  try {
    const response = await listQuestionBankVoByPageUsingPost({
      current: page.value,
      pageSize: 5,
      searchText: searchText.value,
    });

    const newBanks = (response.data as any)?.records || [];
    banks.value = [...banks.value, ...newBanks];
    page.value++;
    loadMoreStatus.value = newBanks.length < 5 ? 'noMore' : 'more';
  } catch (error) {
    console.error('加载题库列表失败：', error);
    uni.showToast({
      title: '加载题库列表失败',
      icon: 'none'
    });
    loadMoreStatus.value = 'more';
  }
};

const handleSearch = () => {
  loadBanks(true);
};

const goToBank = (id: number) => {
  uni.navigateTo({
    url: `/pages/question/banks/detail?id=${id}`
  });
};

onReachBottom(() => {
  if (loadMoreStatus.value === 'more') {
    loadBanks();
  }
});
</script>

<style lang="scss">
.container {
  padding: 20rpx;
}

.search-box {
  margin-bottom: 20rpx;
  
  .search-input {
    width: 100%;
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 40rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
  }
}

.bank-list {
  .bank-item {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .bank-header {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16rpx;
      
      .bank-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
      }
      
      .bank-info {
        flex: 1;
        overflow: hidden;
        
        .bank-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 12rpx;
        }
        
        .bank-desc {
          font-size: 28rpx;
          color: #666;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
    
    .bank-stats {
      display: flex;
      justify-content: space-around;
      border-top: 2rpx solid #f5f5f5;
      padding-top: 20rpx;
      
      .stat-item {
        text-align: center;
        
        .count {
          font-size: 32rpx;
          color: #333;
          font-weight: bold;
        }
        
        .label {
          font-size: 24rpx;
          color: #999;
          margin-left: 8rpx;
        }
      }
    }
  }
}
</style>