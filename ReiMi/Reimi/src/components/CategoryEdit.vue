<template>
  <a-form ref="formRef" :model="form" label-width="120px">
    <!-- 分类名称 -->
    <a-form-item label="分类名称" :rules="[{ required: true, message: '请填写分类名称', trigger: 'blur' }]">
      <a-input v-model:value="form.name" placeholder="请填写分类名称" />
    </a-form-item>
    <!-- 是否为二级分类 -->
    <a-form-item label="二级分类">
      <a-radio-group v-model:value="showMore">
        <a-radio :value="true" :disabled="form.id !== 0 && !form.pid">是</a-radio>
        <a-radio :value="false" :disabled="form.id !== 0 && !form.pid">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <!-- 上级分类 -->
    <a-form-item v-show="showMore" label="上级分类" :name="[pid]">
      <a-select v-model:value="form.pid" placeholder="请选择上级分类名称">
        <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <!-- 分类图片 -->
    <a-form-item label="分类图片" v-show="showMore">
      <a-upload 
      v-model:file-list="fileList"
       :action="uploadPictureURL()"
        :headers="{ jwt: token, 'X-Requested-With': null }"
         :data="{ type: 'category_picture' }" 
         :multiple="false"
        @change="handleChange">
        <a-button>
          <upload-outlined></upload-outlined>
          选择图片
        </a-button>
      </a-upload>
    </a-form-item>
    <!-- 操作按钮 -->
    <a-form-item>
      <a-button type="primary" @click="editSubmit" v-if="id">修改</a-button>
      <a-button type="primary" @click="addSubmit" v-else>新增</a-button>
      <a-button @click="btnCancel">重置</a-button>
    </a-form-item>
  </a-form>
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

// 上传文件变化处理(包含上传中、完成、失败)
const handleChange = (info) => {
  if (info.file.status === 'done') {
    form.picture = info.file.response.data.savepath;
  } else if (info.file.status === 'error') {
    notification({
      message: '上传失败',
      type: 'error'
    });
  }
}

onMounted(() => {
  loadCategory();
});

const loadCategory = async () => {
  if (form.id) {
    const data = await getCategory({ id: form.id })
    const fileName = data.picture.substring(data.picture.lastIndexOf('/') + 1)
    if (fileName) {
      fileList.value = [{ name: fileName, url: data.picture }]
    }
    Object.assign(form, data)
  }
  const list = await getCategoryList()
  categoryList.value = list.filter(item => item.pid === 0)
  console.log(form)
  showMore.value = form.pid != 0
}

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
