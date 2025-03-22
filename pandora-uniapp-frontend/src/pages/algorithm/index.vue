<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Banner from '@/components/Banner.vue';
import QuestionList from '@/components/QuestionList.vue';
// 算法题目列表
const algorithmQuestions = ref<any[]>([]);

// 难度选项
const difficultyOptions = [
  { label: '全部', value: '' },
  { label: '简单', value: '简单' },
  { label: '中等', value: '中等' },
  { label: '困难', value: '困难' }
];

// 当前选中的难度
const selectedDifficulty = ref('');

// 搜索关键词
const searchKeyword = ref('');

// 当前页码
const currentPage = ref(1);

// 每页数量
const pageSize = ref(10);

// 总数
const total = ref(0);

// 是否加载中
const loading = ref(false);

// 广告数据
const ads = ref([
  // {
  //   id: 1,
  //   image: '/static/images/banner/algorithm.jpg',
  //   url: ''
  // }
]);

// 模拟算法题目数据
const mockAlgorithmData = [
  {
    id: 1,
    title: '两数之和',
    content: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。',
    difficulty: '简单',
    tags: ['算法', '数组', '哈希表'],
    viewCount: 1024,
    favourCount: 512,
    createTime: '2023-01-01 12:00:00'
  },
  {
    id: 2,
    title: '三数之和',
    content: '给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。',
    difficulty: '中等',
    tags: ['算法', '数组', '双指针'],
    viewCount: 856,
    favourCount: 423,
    createTime: '2023-01-02 12:00:00'
  },
  {
    id: 3,
    title: '最长回文子串',
    content: '给你一个字符串 s，找到 s 中最长的回文子串。',
    difficulty: '中等',
    tags: ['算法', '字符串', '动态规划'],
    viewCount: 765,
    favourCount: 321,
    createTime: '2023-01-03 12:00:00'
  },
  {
    id: 4,
    title: '接雨水',
    content: '给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。',
    difficulty: '困难',
    tags: ['算法', '栈', '双指针'],
    viewCount: 654,
    favourCount: 298,
    createTime: '2023-01-04 12:00:00'
  },
  {
    id: 5,
    title: '合并两个有序链表',
    content: '将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。',
    difficulty: '简单',
    tags: ['算法', '链表', '递归'],
    viewCount: 987,
    favourCount: 476,
    createTime: '2023-01-05 12:00:00'
  },
  {
    id: 6,
    title: '最大子数组和',
    content: '给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。',
    difficulty: '简单',
    tags: ['算法', '数组', '动态规划'],
    viewCount: 876,
    favourCount: 432,
    createTime: '2023-01-06 12:00:00'
  },
  {
    id: 7,
    title: '二叉树的层序遍历',
    content: '给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。',
    difficulty: '中等',
    tags: ['算法', '树', '广度优先搜索'],
    viewCount: 765,
    favourCount: 345,
    createTime: '2023-01-07 12:00:00'
  },
  {
    id: 8,
    title: '排序链表',
    content: '给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。',
    difficulty: '中等',
    tags: ['算法', '链表', '排序'],
    viewCount: 654,
    favourCount: 321,
    createTime: '2023-01-08 12:00:00'
  },
  {
    id: 9,
    title: '最长递增子序列',
    content: '给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。',
    difficulty: '中等',
    tags: ['算法', '数组', '动态规划'],
    viewCount: 543,
    favourCount: 276,
    createTime: '2023-01-09 12:00:00'
  },
  {
    id: 10,
    title: '编辑距离',
    content: '给你两个单词 word1 和 word2，请你计算出将 word1 转换成 word2 所使用的最少操作数。',
    difficulty: '困难',
    tags: ['算法', '字符串', '动态规划'],
    viewCount: 432,
    favourCount: 234,
    createTime: '2023-01-10 12:00:00'
  },
  {
    id: 11,
    title: '有效的括号',
    content: '给定一个只包括 \'(\', \')\', \'{\', \'}\', \'[\', \']\' 的字符串 s ，判断字符串是否有效。',
    difficulty: '简单',
    tags: ['算法', '栈', '字符串'],
    viewCount: 876,
    favourCount: 432,
    createTime: '2023-01-11 12:00:00'
  },
  {
    id: 12,
    title: '最小路径和',
    content: '给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。',
    difficulty: '中等',
    tags: ['算法', '数组', '动态规划'],
    viewCount: 765,
    favourCount: 345,
    createTime: '2023-01-12 12:00:00'
  }
];

// 过滤后的数据
const filteredData = computed(() => {
  let result = [...mockAlgorithmData];
  
  // 按难度筛选
  if (selectedDifficulty.value) {
    result = result.filter(item => item.difficulty === selectedDifficulty.value);
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(keyword) || 
      item.content.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

// 加载算法题目
const loadAlgorithmQuestions = async () => {
  loading.value = true;
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    const paginatedData = filteredData.value.slice(start, end);
    
    if (currentPage.value === 1) {
      algorithmQuestions.value = paginatedData;
    } else {
      algorithmQuestions.value = [...algorithmQuestions.value, ...paginatedData];
    }
    
    total.value = filteredData.value.length;
  } catch (error) {
    uni.showToast({
      title: '获取算法题目失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 搜索题目
const searchQuestions = () => {
  currentPage.value = 1;
  loadAlgorithmQuestions();
};

// 切换难度
const changeDifficulty = (difficulty: string) => {
  selectedDifficulty.value = difficulty;
  currentPage.value = 1;
  loadAlgorithmQuestions();
};

// 加载更多
const loadMore = () => {
  if (loading.value) return;
  if (algorithmQuestions.value.length >= total.value) {
    uni.showToast({
      title: '没有更多数据了',
      icon: 'none'
    });
    return;
  }
  
  currentPage.value += 1;
  loadAlgorithmQuestions();
};

// 跳转到题目详情
const goToQuestionDetail = (questionId: number) => {
  uni.navigateTo({
    url: `/pages/question/questions/detail?id=${questionId}`
  });
};

onMounted(() => {
  loadAlgorithmQuestions();
});
</script>

<template>
  <view class="container">
    <Banner 
      title="算法刷题平台"
      subtitle="提升你的算法能力"
      :ads = "ads"
    />
    
    <!-- 搜索和筛选区域 -->
    <view class="search-filter-section">
      <view class="search-box">
        <input 
          v-model="searchKeyword" 
          class="search-input" 
          placeholder="搜索算法题目" 
          @confirm="searchQuestions"
        />
        <button class="search-btn" @click="searchQuestions">搜索</button>
      </view>
      
      <view class="difficulty-filter">
        <text class="filter-label">难度：</text>
        <view class="difficulty-options">
          <view 
            v-for="option in difficultyOptions" 
            :key="option.value"
            :class="['difficulty-option', selectedDifficulty === option.value ? 'active' : '']"
            @click="changeDifficulty(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>
    </view>
    
    <!-- 算法题目列表 -->
    <view class="algorithm-section">
      <view class="section-title">算法题目列表</view>
      <view v-if="loading && currentPage === 1" class="loading">加载中...</view>
      <view v-else-if="algorithmQuestions.length === 0" class="empty-data">暂无数据</view>
      <view v-else>
        <QuestionList :question-list="algorithmQuestions" @click="goToQuestionDetail" />
        
        <!-- 加载更多 -->
        <view class="load-more" v-if="algorithmQuestions.length < total">
          <view v-if="loading" class="loading-more">加载中...</view>
          <view v-else class="load-more-btn" @click="loadMore">加载更多</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-filter-section {
  margin: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
}

.search-box {
  display: flex;
  margin-bottom: 20rpx;
  
  .search-input {
    flex: 1;
    height: 70rpx;
    border: 1px solid #ddd;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
  }
  
  .search-btn {
    width: 140rpx;
    height: 70rpx;
    line-height: 70rpx;
    background: #1890ff;
    color: #fff;
    font-size: 28rpx;
    margin-left: 20rpx;
    border-radius: 8rpx;
    text-align: center;
  }
}

.difficulty-filter {
  display: flex;
  align-items: center;
  
  .filter-label {
    font-size: 28rpx;
    color: #333;
    margin-right: 20rpx;
  }
  
  .difficulty-options {
    display: flex;
    flex-wrap: wrap;
    
    .difficulty-option {
      padding: 10rpx 20rpx;
      font-size: 26rpx;
      color: #666;
      background: #f5f5f5;
      border-radius: 6rpx;
      margin-right: 20rpx;
      margin-bottom: 10rpx;
      
      &.active {
        background: #1890ff;
        color: #fff;
      }
    }
  }
}

.algorithm-section {
  margin: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #eee;
}

.loading, .empty-data {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

.load-more {
  text-align: center;
  padding: 30rpx 0;
  
  .loading-more {
    color: #999;
    font-size: 28rpx;
  }
  
  .load-more-btn {
    display: inline-block;
    padding: 15rpx 40rpx;
    background: #f5f5f5;
    color: #666;
    font-size: 28rpx;
    border-radius: 8rpx;
  }
}
</style>