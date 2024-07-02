<template>
    <div class="BG">
        <div class="LoginBox">
            <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            @keyup.enter.native="onSubmit"
          >
          <h2 style="text-align: center; font-size: 30px;">微商城登录页面</h2>
            <a-form-item ref="name" label="用户名" name="name">
              <a-input v-model:value="formState.username" />
            </a-form-item>

            <a-form-item ref="password" label="密码" name="password">
                <a-input-password v-model:value="formState.password" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <div style="display: flex; justify-content: space-between;">
                    <a-button type="primary" @click="onSubmit">登录</a-button>
                    <a-button @click="resetForm">重置</a-button>
                </div>
              </a-form-item>
          </a-form>
        </div>
    </div>
    
</template>

<script setup>
import { reactive, ref, toRaw } from 'vue';
import {login} from '../api/index';
import { useRouter } from 'vue-router';
import useToken from '../stores/token.js';
import notification from '../utils/notification.js'

const router = useRouter();
const { updateToken } = useToken();

  const formRef = ref();

  const formState = reactive({
    username: '',
    password: '',
  });
//   表单验证
  const rules = reactive({
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'change',
      },
      {
        min: 3,
        max: 5,
        message: '用户名长度是3-5位',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码！',
        trigger: 'change',
      },
      {
        min: 6,
        max: 32,
        message: '密码长度是6-32位',
        trigger: 'blur',
      },
    ],
  });

// 提交表单
const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      const data = await login(formState);
      console.log(data.token)
      if (data) {
        updateToken(data.token);
        router.push({ name: 'index-home' });
      } else {
        notification({
          type: 'error',
          message: '用户名或密码错误！',
        });
      }
    })
    .catch(errors => {
      console.log('表单验证失败:', errors);
    });
};
//   重置表单
  const resetForm = () => {
    formRef.value.resetFields();
  };
</script>

<style>
.LoginBox {
    width: 600px;
    height: 300px;
    background-color: #91ff7e;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.BG {
    background-color: #d9ff72;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
