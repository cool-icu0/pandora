<template>
  <view 
    v-if="show" 
    class="to-top"
    @tap="handleToTop"
  >
    ↑
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)

const handleToTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
}

// 提供给父组件的方法
const toggleShow = (isShow: boolean) => {
  show.value = isShow
}

defineExpose({
  toggleShow
})
</script>

<style lang="scss" scoped>
.to-top {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  width: 80rpx;
  height: 80rpx;
  background: rgba(24, 144, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 40rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  z-index: 99;
  
  &:active {
    transform: scale(0.95);
  }
}
</style>