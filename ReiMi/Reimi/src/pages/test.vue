<template>
  <div>
      <a-layout-header>
          <a-menu mode="horizontal">
              <div class="navbar">"微商城"后台管理系统</div>
              <a-sub-menu key="sub1">
                  <template slot="title">
                      <a-avatar shape="square" size="small" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">
                          {{ admin.username }}
                      </a-avatar>
                  </template>
                  <a-menu-item key="setting">
                      <router-link :to="{name: 'setting'}">个人中心</router-link>
                  </a-menu-item>
                  <a-menu-item key="logout" @click="onLogout">退出登录</a-menu-item>
              </a-sub-menu>
          </a-menu>
      </a-layout-header>
  </div>
</template>