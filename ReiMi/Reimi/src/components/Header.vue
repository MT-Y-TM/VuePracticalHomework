<template>
    <div class="header-container">
      <div class="navbar">“微商城”后台管理系统</div>
      <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
        <el-sub-menu class="menu" index="1">
          <template #title>
            <el-avatar class="avatar" :src="admin.avatar"> {{ admin.username }} </el-avatar>
          </template>
          <router-link :to="{ name: 'setting' }">
            <el-menu-item index="5">个人中心</el-menu-item>
          </router-link>
          <el-menu-item index="6" @click="onLogout">退出登录</el-menu-item>
        </el-sub-menu>
      </el-menu>
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
}

.el-menu-demo {
  background-color: transparent;
}

.avatar {
  margin-right: 5px;
}
</style>