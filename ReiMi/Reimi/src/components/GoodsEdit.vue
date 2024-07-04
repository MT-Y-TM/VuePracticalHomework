<template>
    <el-form ref="formRef" :model="form" label-width="120px">
    <!-- 商品名称 -->
    <el-form-item label="商品名称" prop="name" style="width: 92%">
        <el-input v-model="form.name" placeholder="请填写商品名称" />
    </el-form-item>
   <!-- 商品分类 -->
<el-form-item label="分类名称" prop="category_id">
   <el-select v-model="form.category_id" placeholder="请选择二级分类名称" >
   <el-option-group v-for="category in categoryList" :key="category.id"
  :label="category.name">
   <el-option v-for="item in category.children" :key="item.id" :label=
  "item.name" :value="item.id" />
   </el-option-group>
   </el-select>
  </el-form-item>
    <!-- 商品价格 -->
    <el-form-item label="商品价格" prop="price" style="width: 92%">
    <el-input v-model="form.price" placeholder="请填写商品价格" />
    </el-form-item>
    <!-- 商品图片 -->
    <el-form-item label="商品图片" prop="picture">
    </el-form-item>
    <!-- 商品相册 -->
    <el-form-item label="图片相册" prop="album">
    </el-form-item>
    <!-- 商品库存 -->
    <el-form-item label="商品库存" prop="stock" style="width: 92%">
    <el-input v-model="form.stock" placeholder="请填写库存数量" />
    </el-form-item>
    <!-- 商品规格 -->
    <el-form-item label="商品规格" prop="spec" style="width: 92%">
    <el-input v-model="form.spec" placeholder="请填写商品规格" />
    </el-form-item>
    <!-- 商品简介 -->
    <el-form-item label="商品简介" prop="description" style="width: 92%" c
   lass="desc">
    </el-form-item>
    <!-- 操作按钮 -->
    <el-form-item>
    <el-button type="primary" @click="editSubmit()" v-if="form.id">修改
   </el-button>
    <el-button type="primary" @click="addSubmit()" v-else>新增</el-button>
    <el-button @click="btnCancel">重置</el-button>
    </el-form-item>
    </el-form>
   </template>

   <script setup>
import { reactive, ref , onMounted} from 'vue'
import { getCategoryList } from '../api'

const formRef = ref()
const categoryList = ref([])
const emit = defineEmits(['success'])


   const props = defineProps({
   id: {
   type: Number
   }
   })

   onMounted(() => {
 loadGoods()
})
   
   const form = reactive({
 id: props.id,
 name: '',
 category_id: '',
 price: '',
 picture: '',
 album: [],
 stock: '',
 spec: '',
 description: ''
})

// 新增操作
const addSubmit = () => {
}
// 修改操作
const editSubmit = () => {
}
// 重置表单
const btnCancel = () => {
 formRef.value.resetFields()
 loadGoods()
}

const resetForm = id => {
 form.id = id
 btnCancel()
}


const loadGoods = async () => {
 const data = await getCategoryList()
 categoryList.value = convertToTree(data)
}
const convertToTree = data => {
 const treeData = []
 const map = {}
 for (const item of data) {
 map[item.id] = { ...item, children: [] }
 }
 for (const item of data) {
 const node = map[item.id]
 if (item.pid === 0) {
 treeData.push(node)
 } else {
 const parent = map[item.pid]
 parent.children.push(node)
 }
 }
 return treeData
}

defineExpose({ resetForm })
   </script>
   