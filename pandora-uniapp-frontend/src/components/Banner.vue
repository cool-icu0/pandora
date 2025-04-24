<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  ads?: Array<{
    id: number
    image: string
    url: string
  }>
}>()

const handleAdClick = (url: string) => {
  if (url) {
    uni.navigateTo({ url })
  }
}
</script>

<template>
  <view class="banner-container">
    <!-- 默认展示区域 -->
    <view v-if="!ads?.length" class="banner card">
      <text class="title">{{ title || '智能刷题平台' }}</text>
      <text class="subtitle">{{ subtitle || '你的面试刷题助手' }}</text>
    </view>

    <!-- 广告轮播区域 -->
    <swiper v-else class="banner-swiper" circular autoplay interval="3000">
      <swiper-item v-for="ad in ads" :key="ad.id" @click="handleAdClick(ad.url)">
        <image class="banner-ad" :src="ad.image" mode="aspectFill" />
      </swiper-item>
    </swiper>
  </view>
</template>

<style scoped>
.banner-container {
  width: 100%;
}

.banner {
  padding: 40rpx;
  text-align: center;
  background: linear-gradient(to right, #1890ff, #36cfc9);
}

.title {
  font-size: 48rpx;
  color: #fff;
  font-weight: bold;
  display: block;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10rpx;
  display: block;
}

.banner-swiper {
  width: 100%;
  height: 300rpx;
}

.banner-ad {
  width: 100%;
  height: 100%;
}
</style>