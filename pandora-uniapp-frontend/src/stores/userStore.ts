import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getLoginUserUsingGet } from '@/api/userController';

export interface LoginUserVO {
  id: string | number;
  userAccount?: string;
  userName: string;
  userAvatar?: string;
  userProfile?: string;
  userRole: string;
  createTime: string | Date;
  updateTime: string | Date;
  email?: string | null;
  expertiseDirection?: string | null;
  grade?: string | null;
  phoneNumber?: string | null;
  workExperience?: string | null;
}

export const useUserStore = defineStore('user', () => {
  const loginUser = ref<LoginUserVO | null>(null);
  const loading = ref(false);

  // 获取用户信息
  async function getLoginUserInfo() {

    loading.value = true;
    try {
      const res = await getLoginUserUsingGet();
      if (res.data) {
        setLoginUser(res.data as LoginUserVO);
        return res.data;
      }
      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    } finally {
      loading.value = false;
    }
  }

  function setLoginUser(user: LoginUserVO | null) {
    loginUser.value = user;
  }

  function clearLoginUser() {
    loginUser.value = null;
  }

  return {
    loginUser,
    loading,
    getLoginUserInfo,
    setLoginUser,
    clearLoginUser,
  };
});