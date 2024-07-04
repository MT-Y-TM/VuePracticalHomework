<template>
    <el-form ref="formRef" :model="form" label-width="120px">
    <!-- 分类名称 -->
    <el-form-item prop="name" label="分类名称" style="width: 92%">
    <el-input v-model="form.name" placeholder="请填写分类名称" />
    <!-- 是否为二级分类 -->
<el-form-item label="二级分类">
 <el-radio-group v-model="showMore">
 <el-radio :label="true" :disabled="form.id !== 0 && !form.pid">是</el-radio>
 <el-radio :label="false" :disabled="form.id !== 0 && !form.pid">否</el-radio>
 </el-radio-group>
</el-form-item>
<!-- 上级分类 -->
<el-form-item v-show="showMore" label="上级分类" prop="pid">
 <el-select v-model="form.pid" placeholder="请选择上级分类名称" >
 <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
 </el-select>
</el-form-item>
    </el-form-item>
    <!-- 操作按钮 -->
    <el-form-item>
    <el-button type="primary" @click="editSubmit" v-if="id">修改</el-button>
    <el-button type="primary" @click="addSubmit" v-else>新增</el-button>
    <el-button @click="btnCancel">重置</el-button>
    </el-form-item>
    </el-form>
   </template>
   
   <script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCategory, getCategoryList } from '../api'

const categoryList = ref([])
const showMore = ref(false)


const props = defineProps({
 id: {
 type: Number
 },
})
const form = reactive({
 id: props.id,
 name: '',
 pid: '',
 picture: ''
})
const formRef = ref()
// 新增操作
const addSubmit = () => {
}
// 修改操作
const editSubmit = () => {
}
// 重置表单
const btnCancel = () => {
 formRef.value.resetFields()
 loadCategory()
}


onMounted(() => {
 loadCategory()
})
const loadCategory = async () => {
 if (form.id) {
 const data = await getCategory({ id: form.id })
 Object.assign(form, data)
 }
 const list = await getCategoryList()
 categoryList.value = list.filter(item => item.pid == 0)
}

const resetForm = id => {
 form.id = id
 btnCancel()
}
defineExpose({ resetForm })
</script>
