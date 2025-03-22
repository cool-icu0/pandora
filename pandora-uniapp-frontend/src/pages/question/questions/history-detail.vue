<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import dayjs from 'dayjs';
import { getUserSignInRecordUsingGet } from '@/api/userController';

// 页面参数
const year = ref('');
const month = ref('');

// 签到日期列表
const dataList = ref<number[]>([]);

// 当月的日期记录
const monthlyRecords = ref<{date: string; day: number; hasRecord: boolean}[]>([]);

// 接收页面参数
onLoad((options: any) => {
  year.value = options.year || new Date().getFullYear().toString();
  month.value = options.month || (new Date().getMonth() + 1).toString().padStart(2, '0');
  fetchDataList();
});

// 请求后端获取数据
const fetchDataList = async () => {
  try {
    const res = await getUserSignInRecordUsingGet({
      year: parseInt(year.value),
    });
    dataList.value = res.data;
    generateMonthlyRecords();
  } catch (e: any) {
    uni.showToast({
      title: "获取刷题签到记录失败，" + e.message,
      icon: "none"
    });
  }
};

// 生成当月的日期记录
const generateMonthlyRecords = () => {
  const records: {date: string; day: number; hasRecord: boolean}[] = [];
  
  // 获取当月的天数
  const daysInMonth = new Date(parseInt(year.value), parseInt(month.value), 0).getDate();
  
  // 遍历当月的每一天
  for (let day = 1; day <= daysInMonth; day++) {
    // 计算当前日期是一年中的第几天
    const date = new Date(parseInt(year.value), parseInt(month.value) - 1, day);
    const dayOfYear = Math.floor((date.getTime() - new Date(parseInt(year.value), 0, 0).getTime()) / 86400000);
    
    // 检查是否有签到记录
    const hasRecord = dataList.value.includes(dayOfYear);
    
    // 格式化日期
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    
    records.push({
      date: dateStr,
      day,
      hasRecord
    });
  }
  
  // 按日期倒序排列，最近的日期在前面
  monthlyRecords.value = records.reverse();
};

// 计算当月刷题天数
const monthlyTotalDays = computed(() => {
  return monthlyRecords.value.filter(record => record.hasRecord).length;
});

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 格式化日期显示
const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('MM月DD日');
};
</script>

<template>
  <view class="container">
    <view class="header">
      <view class="back-button" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title">{{ year }}年{{ month }}月刷题记录</text>
      <view class="heatmap">
        <view 
          v-for="(record, index) in monthlyRecords" 
          :key="index"
          class="heatmap-cell"
          :class="{ 'has-record': record.hasRecord }"
          :title="formatDate(record.date)"
        ></view>
      </view>
    </view>
    
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ monthlyTotalDays }}</text>
        <text class="stat-label">本月刷题天数</text>
      </view>
    </view>
    
    <view class="records-card">
      <text class="section-title">每日记录</text>
      <view class="records-list">
        <view 
          v-for="(record, index) in monthlyRecords" 
          :key="index"
          class="record-item"
          :class="{ 'has-record': record.hasRecord }"
        >
          <text class="record-date">{{ formatDate(record.date) }}</text>
          <view class="record-status">
            <text v-if="record.hasRecord" class="status-text success">已刷题</text>
            <text v-else class="status-text">未刷题</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  .back-button {
    margin-right: 20rpx;
    
    .back-icon {
      font-size: 36rpx;
      color: #333;
    }
  }
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    margin-right: 20rpx;
  }

  .heatmap {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4rpx;
    padding: 10rpx;
    background: #fff;
    border-radius: 8rpx;
    
    .heatmap-cell {
      width: 20rpx;
      height: 20rpx;
      background-color: #f0f0f0;
      border-radius: 4rpx;
      
      &.has-record {
        background-color: #40a9ff;
      }
    }
  }
}

.stats-card {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;

  .stat-item {
    text-align: center;

    .stat-value {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }

    .stat-label {
      font-size: 24rpx;
      color: #666;
      margin-top: 10rpx;
    }
  }
}

.records-card {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  
  .records-list {
    .record-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.has-record {
        .record-date {
          color: #333;
          font-weight: bold;
        }
      }
      
      .record-date {
        font-size: 28rpx;
        color: #666;
      }
      
      .record-status {
        .status-text {
          font-size: 24rpx;
          color: #999;
          
          &.success {
            color: #40a9ff;
          }
        }
      }
    }
  }
}
</style>