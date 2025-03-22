import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
  id?: number
  userName?: string
  userAvatar?: string
  userRole?: string
  createTime?: string
  updateTime?: string
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')

  function setUserInfo(info: UserInfo | null) {
    userInfo.value = info
    if (info) {
      uni.setStorageSync('userInfo', info)
    } else {
      uni.removeStorageSync('userInfo')
    }
  }

  function setToken(newToken: string) {
    token.value = newToken
    if (newToken) {
      uni.setStorageSync('token', newToken)
    } else {
      uni.removeStorageSync('token')
    }
  }

  function loadFromStorage() {
    const storedUserInfo = uni.getStorageSync('userInfo')
    const storedToken = uni.getStorageSync('token')
    if (storedUserInfo) {
      userInfo.value = storedUserInfo
    }
    if (storedToken) {
      token.value = storedToken
    }
  }

  function logout() {
    setUserInfo(null)
    setToken('')
  }

  return {
    userInfo,
    token,
    setUserInfo,
    setToken,
    loadFromStorage,
    logout
  }
})