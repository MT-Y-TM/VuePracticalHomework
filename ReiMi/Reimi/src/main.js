import { createApp } from 'vue'

import router from './router'
import axios from 'axios'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import Antd from 'ant-design-vue'
import './style.css'
import './router/permission.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersist)

const app = createApp(App)
app.use(Antd)
app.use(router)
app.use(ElementPlus)
app.use(pinia) // 安装 Pinia
app.mount('#app')
