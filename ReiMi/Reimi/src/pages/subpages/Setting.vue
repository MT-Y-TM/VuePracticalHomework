<template>
  <a-row :gutter="20">
    <a-col :span="8">
      <a-card class="box-card">
        <template #title>
          <div class="card-header">头像信息</div>
        </template>
        <div class="text item">
          <div class="avatar">
            <a-avatar class="avatar" shape="square" :size="50" :src="avatarURL" />
          </div>
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :limit="1"
            :action="uploadURL"
            :headers="headers"
            :data="uploadData"
            :auto-upload="false"
            :on-success="uploadSuccess"
          >
            <template #trigger>
              <p><a-button type="dashed">选择头像</a-button></p>
            </template>
            <div>
              <a-button type="primary" @click="submitUpload">上传头像</a-button>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                <p>限制上传 1 个文件，且旧文件会被新文件覆盖</p>
              </div>
            </template>
          </el-upload>
        </div>
      </a-card>
    </a-col>
    <a-col :span="16">
      <a-card class="box-card">
        <template #title>
          <div class="card-header">个人信息</div>
        </template>
        <div class="change-password-box">
          <a-form ref="ruleFormRef" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
            <a-form-item label="请输入修改的密码" name="password">
              <a-input-password v-model:value="form.password" />
            </a-form-item>
            <a-form-item label="请再一次输入密码" name="password2">
              <a-input-password v-model:value="form.password2" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 6, span: 14 }">
              <a-button type="primary" @click="submitForm">提交</a-button>
              <a-button @click="resetForm">重置</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref, reactive } from 'vue';
import defaultAvatarURL from '/images/avatar-default.png';
import { uploadPictureURL, changeAdminPassword, changeAdminAvatar } from '../../api';
import useToken from '../../stores/token';
import useAdmin from '../../stores/admin';
import router from '../../router';
import notification from '../../utils/notification';

const { admin, removeAdmin, updateAdmin } = useAdmin();
const { token, removeToken } = useToken();

const headers = { jwt: token };
const uploadURL = uploadPictureURL();
const uploadData = { type: 'admin_avatar' };

const form = reactive({
  password: '',
  password2: ''
});

const avatarURL = ref(admin.avatar || defaultAvatarURL);
const ruleFormRef = ref();
const uploadRef = ref();

const submitForm = async () => {
  try {
    await ruleFormRef.value.validate();
    await changeAdminPassword({ password: form.password });
    resetForm();
    removeToken();
    removeAdmin();
    router.push({ name: 'login' });
    notification({
      message: '修改密码后，请重新登录',
      type: 'warning'
    });
  } catch (error) {
    notification({
      message: '表单填写有误',
      type: 'error'
    });
  }
};

const resetForm = () => {
  ruleFormRef.value.resetFields();
};

const submitUpload = () => {
  uploadRef.value.submit();
};

const uploadSuccess = async response => {
  const { errno, errmsg, data } = response;
  if (errno !== 0) {
    notification({
      message: errmsg,
      type: 'error'
    });
  } else {
    if (errmsg !== '') {
      notification({
        message: errmsg,
        type: 'success'
      });
    }
    await changeAdminAvatar({
      avatar: data.savepath
    });
    updateAdmin({
      avatar: data.url
    });
    avatarURL.value = data.url;
  }
  uploadRef.value.clearFiles();
};

const validatePass = async (rule, value) => {
  if (value !== form.password) {
    throw new Error('两次输入密码不一致！');
  }
};

const rules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 24, message: '密码长度为 6~24 个字符', trigger: 'blur' }
  ],
  password2: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ]
};
</script>

<style lang="scss" scoped>
.avatar {
  text-align: center;
}

.upload-demo {
  text-align: center;
}

.box-card {
  height: 316px;
}

.change-password-box {
  padding-top: 38px;
}
</style>