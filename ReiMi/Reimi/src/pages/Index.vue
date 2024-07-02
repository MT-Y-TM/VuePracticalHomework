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
 
    text-align: center;
    line-height: 60px;
    color: #949494;
  }
  .a-layout-sider {
    width: 200px;
    height: 100%;
    color: #7a7a7a;
    background: rgb(75, 75, 75);
  }
  .a-layout-content {
    height: 100vh;
    background-color: #585858;
    color: #333;
  }
}
.ant-layout-header{
  background-color: rgb(61, 61, 61)
}
</style>
