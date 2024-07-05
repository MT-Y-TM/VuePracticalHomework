<template>
  <a-form ref="formRef" :model="form" >
    <!-- 分类名称 -->
    <a-form-item label="分类名称">
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
    <a-form-item v-show="showMore" label="上级分类" :name="['pid']">
      <a-select v-model:value="form.pid" placeholder="请选择上级分类名称">
        <a-select-option v-for="item in categoryList" :key="item.id" :title="item.name" :value="item.id">{{ item.name
          }}</a-select-option>
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
        <a-button title="图片文件大小不超过500KB"><upload-outlined></upload-outlined>选择图片</a-button>
      </a-upload>
    </a-form-item>
    <!-- 操作按钮 -->
    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-button type="primary" @click="editSubmit" v-if="id">修改</a-button>
      <a-button type="primary" @click="addSubmit" v-else>新增</a-button>
      <a-button @click="btnCancel">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCategory, getCategoryList, uploadPictureURL, addCategory, editCategory } from '../api'
import useToken from '../stores/token'
import notification from '../utils/notification'
import { UploadOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  id: {
    type: Number
  }
})

const emit = defineEmits(['success'])

const form = reactive({
  id: props.id,
  name: '',
  pid: '',
  picture: ''
})

const formRef = ref()
const categoryList = ref([])
const showMore = ref(false)
const fileList = ref([])
const { token } = useToken()

onMounted(() => {
  loadCategory()
})

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
  form.id = id
  btnCancel()
}

defineExpose({ resetForm })

// 上传文件变化处理
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

// 新增操作
const addSubmit = async () => {
  const data = {
    name: form.name,
    picture: form.picture,
    pid: form.pid
  }
  if (await addCategory(data)) {
    emit('success')
  }
}

// 修改操作
const editSubmit = async () => {
  if (await editCategory(form)) {
    emit('success')
  }
}

// 重置表单
const btnCancel = () => {
  formRef.value.resetFields()
  form.picture = ''
  fileList.value = []
  loadCategory()
}
</script>

<style scoped>
.ant-upload-drag-container {
  width: 91%;
}
</style>