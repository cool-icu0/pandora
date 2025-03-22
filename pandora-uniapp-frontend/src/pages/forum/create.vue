<template>
  <view class="container">
    <view class="header">
      <text class="title">发布帖子</text>
      <view class="submit-btn" @tap="submitPost">
        <text>发布</text>
      </view>
    </view>
    
    <view class="form">
      <view class="form-item">
        <input class="title-input" v-model="postTitle" placeholder="请输入标题" maxlength="50" />
        <text class="count">{{ postTitle.length }}/50</text>
      </view>
      
      <view class="form-item">
        <textarea class="content-input" v-model="postContent" placeholder="请输入内容" maxlength="2000" />
        <text class="count">{{ postContent.length }}/2000</text>
      </view>
      
      <view class="form-item">
        <view class="upload-section">
          <text class="section-title">添加图片（选填）</text>
          <view class="image-list">
            <view v-for="(image, index) in images" :key="index" class="image-item">
              <image :src="image" mode="aspectFill"></image>
              <text class="delete-btn" @tap.stop="deleteImage(index)">×</text>
            </view>
            <view v-if="images.length < 9" class="upload-btn" @tap="chooseImage">
              <text class="plus">+</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const postTitle = ref('');
const postContent = ref('');
const images = ref<string[]>([]);

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 9 - images.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths];
    }
  });
};

// 删除图片
const deleteImage = (index: number) => {
  images.value.splice(index, 1);
};

// 提交帖子
const submitPost = () => {
  if (!userStore.loginUser) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }
  
  if (!postTitle.value.trim()) {
    uni.showToast({
      title: '请输入标题',
      icon: 'none'
    });
    return;
  }
  
  if (!postContent.value.trim()) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    });
    return;
  }
  
  // 模拟提交
  uni.showLoading({
    title: '发布中...'
  });
  
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: '发