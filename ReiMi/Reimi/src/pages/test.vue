<template>
  <el-col :span="16">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">个人信息</div>
      </template>
      <div class="change-password-box">
        <el-form 
        ref="ruleFormRef" 
        :model="form" 
        :rules="rules" >
          <a-form-item label="修改密码" name="password">
            <a-input-password v-model:value="form.password" />
          </a-form-item>
          <a-form-item label="请再次输入密码" name="password2">
            <a-input-password v-model:value="form.password2" />
          </a-form-item>
          <el-form-item :wrapper-col="{ offset: 6, span: 14 }">
            <a-button type="primary" @click="submitForm(ruleFormRef)">提交</a-button>
            <a-button @click="resetForm">重置</a-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </el-col>
</template>

<script setup>
import { ref, reactive } from 'vue';
import defaultAvatarURL from '/images/avatar-default.png';
import { uploadPictureURL, changeAdminPassword, changeAdminAvatar } from '../api';
import useToken from '../stores/token';
import useAdmin from '../stores/admin';
import router from '../router';
import notification from '../utils/notification';

const { admin, removeAdmin, updateAdmin } = useAdmin();
const { token, removeToken } = useToken();

const form = reactive({
  password: '',
  password2: ''
});

const rules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  password2: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { validator: validate , trigger: 'blur' }
  ]
};


const validate = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致!'));
  } else {
    callback();
  }
};


const submitForm = (ruleFormRef) => {
  ruleFormRef.validate((valid) => {
    if (valid) {
      changeAdminPassword(token.value, form.password, form.password2).then(res => {
        if (res.code === 200) {
          notification.success({
            message: '修改密码成功',
            description: '请重新登录'
          });
          removeToken();
          router.push('/login');
        } else {
          notification.error({
            message: '修改密码失败',
            description: res.message
          });
        }
      });
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};


const resetForm = () => {
  form.password = '';
  form.password2 = '';
};


</script>