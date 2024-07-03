<template>
  <a-upload
    :file-list="fileList"
    :before-upload="beforeUpload"
    @remove="handleRemove"
    :max-count="1"
    list-type="picture"
    @change="handleChange"
  >
    <a-button>
      <upload-outlined></upload-outlined>
      选择图片
    </a-button>
  </a-upload>
  <a-button 
    :type="primary" 
    @click="handleUpload" 
    :disabled="fileList.length === 0">
    上传
  </a-button>
  <p>限制上传 1 个文件，且旧文件会被新文件覆盖</p>
</template>

<script setup>
import { ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const fileList = ref([]);

const beforeUpload = (file) => {
  // 清空 fileList 以确保只有一个文件
  fileList.value = [file];
  return false; // 阻止自动上传
};

const handleRemove = (file) => {
  // 移除文件时清空 fileList
  fileList.value = [];
};

const handleChange = (info) => {
  // 处理文件选择变化
  if (info.file.status === 'removed') {
    fileList.value = [];
  }
};

const handleUpload = () => {
  if (fileList.value.length === 0) {
    message.warning('请先选择图片');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileList.value[0]);

  // 这里可以添加你的上传逻辑，例如使用 axios 发送请求
  // axios.post('/upload', formData).then(response => {
  //   message.success('上传成功');
  // }).catch(error => {
  //   message.error('上传失败');
  // });

  console.log('上传文件:', fileList.value[0]);
  message.success('上传成功');
};
</script>
