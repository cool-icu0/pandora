<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import dayjs from "dayjs";
import { getUserSignInRecordUsingGet } from "@/api/userController";

// 签到日期列表（[1, 200]，表示第 1 和第 200 天有签到记录）
const dataList = ref<number[]>([]);
// 当前年份
const currentYear = ref(new Date().getFullYear().toString());

// 处理年份变化
const handleYearChange = (e: any) => {
  currentYear.value = e.detail.value;
  fetchDataList();
};

// 请求后端获取数据
const fetchDataList = async () => {
  try {
    const res = await getUserSignInRecordUsingGet({
      year: parseInt(currentYear.value),
    });
    dataList.value = Array.isArray(res.data) ? res.data : [];
  } catch (e: any) {
    uni.showToast({
      title: "获取刷题签到记录失败，" + e.message,
      icon: "none"
    });
  }
};

// 保证只会调用一次
onMounted(() => {
  fetchDataList();
});

// 计算统计数据
const totalDays = computed(() => {
  return dataList.value.length;
});

// 计算月度数据
const monthlyData = computed(() => {
  const months = Array(12).fill(0);
  dataList.value.forEach((dayOfYear) => {
    const date = new Date(parseInt(currentYear.value), 0, dayOfYear);
    const month = date.getMonth();
    months[month]++;
  });
  return months;
});

// 计算每月的天数
const daysInMonth = computed(() => {
  const year = parseInt(currentYear.value);
  return Array(12).fill(0).map((_, month) => {
    return new Date(year, month + 1, 0).getDate();
  });
});

// 计算完成率（用于颜色区分）
const completionRate = computed(() => {
  return monthlyData.value.map((count, index) => {
    const totalDaysInMonth = daysInMonth.value[index];
    return count / totalDaysInMonth;
  });
});

// 根据完成率获取颜色
const getColorByRate = (rate: number) => {
  if (rate >= 0.8) return '#1890ff'; // 深绿色 - 完成率高
  if (rate >= 0.5) return '#40a9ff'; // 柠檬绿色 - 完成率中
  if (rate >= 0.3) return '#69c0ff'; // 淡绿色 - 完成率低
  return '#91d5ff'; // 极浅绿色 - 完成率很低
};

// 处理月份点击事件
const handleMonthClick = (month: number) => {
  const monthStr = (month + 1).toString().padStart(2, '0');
  uni.navigateTo({
    url: `/pages/questions/history-detail?year=${currentYear.value}&month=${monthStr}`
  });
};
</script>

<template>
  <view class="container">
    <view class="header">
      <text class="title">刷题记录</text>
      <view class="filter">
        <picker mode="date" fields="year" :value="currentYear" @change="handleYearChange">
          <text class="year-text">{{ currentYear }}年</text>
        </picker>
      </view>
    </view>
    
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ totalDays }}</text>
        <text class="stat-label">总刷题天数</text>
      </view>
    </view>

    <view class="monthly-card">
      <text class="section-title">月度统计</text>
      <view class="chart-container">
        <view 
          v-for="(count, index) in monthlyData" 
          :key="index"
          class="bar-item"
          @tap="handleMonthClick(index)"
        >
          <text v-if="count > 0" class="bar-count">{{ count }}</text>
          <view 
            class="bar" 
            :style="{ 
              height: `${count * 10}rpx`,
              backgroundColor: getColorByRate(completionRate[index])
            }"
          ></view>
          <text class="bar-label">{{ index + 1 }}月</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .title {
    font-size: 32rpx;
    font-weight: bold;
  }

  .year-text {
    font-size: 28rpx;
    color: #666;
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

.monthly-card {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;

  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .chart-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 300rpx;

    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .bar {
        width: 30rpx;
        border-radius: 4rpx;
      }
      
      .bar-count {
        font-size: 22rpx;
        color: #333;
        margin-bottom: 4rpx;
        font-weight: bold;
      }

      .bar-label {
        font-size: 24rpx;
        color: #666;
        margin-top: 10rpx;
      }
    }
  }
}
</style>