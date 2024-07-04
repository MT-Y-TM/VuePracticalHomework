<template>
  <el-form ref="formRef" :model="form" label-width="120px">
    <!-- 分类名称 -->
    <el-form-item prop="name" label="分类名称" style="width: 92%" :rules="[{ required: true, message: '请填写分类名称', trigger: 'blur' }]">
      <el-input v-model="form.name" placeholder="请填写分类名称" />
    </el-form-item>
    <!-- 是否为二级分类 -->
    <el-form-item label="二级分类">
      <el-radio-group v-model="showMore">
        <el-radio :label="true" :disabled="form.id !== 0 && !form.pid">是</el-radio>
        <el-radio :label="false" :disabled="form.id !== 0 && !form.pid">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 上级分类 -->
    <el-form-item v-show="showMore" label="上级分类" prop="pid">
      <el-select v-model="form.pid" placeholder="请选择上级分类名称">
        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <!-- 分类图片 -->
    <el-form-item label="分类图片" v-show="showMore">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        v-model:file-list="fileList"
        :action="uploadPictureURL()"
        :headers="{ jwt: token }"
        :data="{ type: 'category_picture' }"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="uploadSuccess"
      >
        <template #trigger>
          <a-button type="primary">请选择图片</a-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">图片文件大小不超过 500KB</div>
        </template>
      </el-upload>
    </el-form-item>
    <!-- 操作按钮 -->
    <el-form-item>
      <a-button type="primary" @click="editSubmit" v-if="id">修改</a-button>
      <a-button type="primary" @click="addSubmit" v-else>新增</a-button>
      <a-button @click="btnCancel">重置</a-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getCategory, getCategoryList, uploadPictureURL, addCategory, editCategory } from '../api';
import useToken from '../stores/token';

const categoryList = ref([]);
const showMore = ref(false);
const fileList = ref([]);
const uploadRef = ref();
const { token } = useToken();
const emit = defineEmits(['success']);

const props = defineProps({
  id: {
    type: Number,
  },
});

const form = reactive({
  id: props.id,
  name: '',
  pid: '',
  picture: '',
});

const formRef = ref();

// 新增操作
const addSubmit = async () => {
  const data = {
    name: form.name,
    picture: form.picture,
    pid: form.pid,
  };
  try {
    await addCategory(data);
    emit('success');
  } catch (error) {
    console.error('添加分类失败:', error);
  }
};

// 修改操作
const editSubmit = async () => {
  try {
    await editCategory(form);
    emit('success');
  } catch (error) {
    console.error('修改分类失败:', error);
  }
};

// 重置表单
const btnCancel = () => {
  formRef.value.resetFields();
  form.picture = '';
  uploadRef.value.clearFiles();
  loadCategory();
};

// 文件超出个数限制时替换已有图片
const handleExceed = (files) => {
  uploadRef.value.clearFiles();
  uploadRef.value.handleStart(files[0]);
  uploadRef.value.submit();
};

// 上传成功
const uploadSuccess = (response) => {
  const { errno, errmsg, data } = response;
  if (errno !== 0) {
    notification({
      message: errmsg,
      type: 'error',
    });
  } else {
    if (errmsg !== '') {
      notification({
        message: errmsg,
        type: 'success',
      });
    }
    form.picture = data.savepath;
  }
};

onMounted(() => {
  loadCategory();
});

const loadCategory = async () => {
  if (form.id) {
    const data = await getCategory({ id: form.id });
    if (data.picture !== '') {
      const fileName = data.picture.substring(data.picture.lastIndexOf('/') + 1);
      if (fileName) {
        fileList.value = [{ name: fileName, url: data.picture }];
      }
    }
    Object.assign(form, data);
  }
  const list = await getCategoryList();
  categoryList.value = list.filter((item) => item.pid === 0);
};

const resetForm = (id) => {
  form.id = id;
  btnCancel();
};

defineExpose({ resetForm });
</script>

<style scoped>
.upload-demo {
  text-align: left;
  width: 91%;
}
</style>
