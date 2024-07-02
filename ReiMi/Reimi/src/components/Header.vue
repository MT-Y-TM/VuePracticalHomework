<template>
  <div class="header-container">
    <div class="navbar">“微商城”后台管理系统</div>
    <a-menu mode="horizontal" :ellipsis="false">
      <a-sub-menu key="1">
        <template #title>
          <a-avatar class="avatar" :src="admin.avatar"> {{ admin.username }} </a-avatar>
        </template>
        <router-link :to="{ name: 'setting' }">
          <a-menu-item key="5">个人中心</a-menu-item>
        </router-link>
        <a-menu-item key="6" @click="onLogout">退出登录</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { getAdmin } from '../api'
import useAdmin from '../stores/admin'
import router from '../router'
import useToken from '../stores/token'
import notification from '../utils/notification'


const { removeToken } = useToken()

const { admin, updateAdmin, removeAdmin } = useAdmin()


onMounted(() => {
    loadAdmin()
})
// 载入登录
const loadAdmin = async () => {
    let data = await getAdmin()
    updateAdmin({
        username: data.username,
        avatar: data.avatar
    })
}

// 退出登录
const onLogout = async () => {
    removeToken()
    removeAdmin()
    router.push({ name: 'login' })
    notification({
        message: '退出成功',
        type: 'success'
    })
}

</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.navbar {
  font-size: 40px;
  font-weight: bold;
  color: white;
}

.el-menu-demo {
  background-color: transparent;
}

.avatar {
  margin-right: 5px;
}
</style>