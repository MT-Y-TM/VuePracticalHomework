<template>
  <div class="common-layout">
    <a-layout>
      <a-layout-header>
        <Header></Header>
      </a-layout-header>
      <a-layout>
        <a-layout-sider>
          <Aside></Aside>
        </a-layout-sider>
        <a-layout-content>
          <a-card class="box-card">
            <router-view></router-view>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import Aside from '../components/Aside.vue';
import { useRouter } from 'vue-router';
</script>

<style lang="scss" scoped>
.a-layout {
  height: 100%;
  .a-layout-header {
    background: -webkit-gradient(linear, left top, right top, from(#1493fa), to(#01c6fa));
    text-align: center;
    line-height: 60px;
    color: #333;
  }
  .a-layout-sider {
    width: 200px;
    height: 100%;
    color: #333;
    background: white;
  }
  .a-layout-content {
    height: 100vh;
    background-color: #e9eef3;
    color: #333;
  }
}
</style>
