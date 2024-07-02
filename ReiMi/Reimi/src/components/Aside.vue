<template>
  <a-layout-sider>
    <a-menu
      :default-selected-keys="[active]"
      mode="inline"
      theme="dark"
    >
      <!-- 首页 -->
      <router-link :to="{ name: 'index-home' }">
        <a-menu-item key="1">
          <home-outlined />
          <span>首页</span>
        </a-menu-item>
      </router-link>
      <!-- 分类管理 -->
      <router-link :to="{ name: 'category' }">
        <a-menu-item key="2">
          <unordered-list-outlined />
          <span>分类管理</span>
        </a-menu-item>
      </router-link>
      <!-- 商品管理 -->
      <router-link :to="{ name: 'goods' }">
        <a-menu-item key="3">
          <unordered-list-outlined />
          <span>商品管理</span>
        </a-menu-item>
      </router-link>
      <!-- 个人中心 -->
      <router-link :to="{ name: 'setting' }">
        <a-menu-item key="4">
          <setting-outlined />
          <span>个人中心</span>
        </a-menu-item>
      </router-link>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { HomeOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import router from '../router';

const menuIndex = {
  'index': '1',
  'category': '2',
  'goods': '3',
  'setting': '4'
};

const active = ref(menuIndex[router.currentRoute.value.name] || '0');
</script>

<style lang="scss" scoped>
.ant-menu {
  border: 0 !important;
  .ant-menu-item-selected {
    background: linear-gradient(90deg, #1493fa, #01c6fa) !important;
  }
  a {
    text-decoration: none;
    color: white;
  }
}
</style>

<style>
.AsideBox {
  color: white;
}
</style>
