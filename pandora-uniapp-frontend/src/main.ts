import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 引入uni-ui组件
import LoadMore from '@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue'
import Icons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  
  // 注册uni-ui组件
  app.component('uni-load-more', LoadMore)
  app.component('uni-icons', Icons)
  
  return { app }
}