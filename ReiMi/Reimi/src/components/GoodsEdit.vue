<template>
   <a-form ref="formRef" :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
     <!-- 商品名称 -->
     <a-form-item label="商品名称" :name="['name']">
       <a-input v-model:value="form.name" placeholder="请填写商品名称" />
     </a-form-item>
     <!-- 商品分类 -->
     <a-form-item label="分类名称" :name="['category_id']">
       <a-select v-model:value="form.category_id" placeholder="请选择二级分类名称">
         <a-select-opt-group v-for="category in categoryList" :key="category.id" :label="category.name">
           <a-select-option v-for="item in category.children" :key="item.id" :value="item.id">
             {{ item.name }}
           </a-select-option>
         </a-select-opt-group>
       </a-select>
     </a-form-item>
     <!-- 商品价格 -->
     <a-form-item label="商品价格" :name="['price']">
       <a-input v-model:value="form.price" placeholder="请填写商品价格" />
     </a-form-item>
     <!-- 商品图片 -->
     <a-form-item label="商品图片">
       <a-upload v-model:file-list="fileList" :action="uploadPictureURL()"
         :headers="{ jwt: token, 'X-Requested-With': null }" :data="{ type: 'goods_picture' }" :multiple="false"
         :max-size="500 * 1024" @change="handleChange">
         <a-button title="图片文件大小不超过500KB"><upload-outlined></upload-outlined>选择图片</a-button>
       </a-upload>
     </a-form-item>
     <!-- 商品相册 -->
     <a-form-item label="图片相册" :name="['album']">
       <a-upload list-type="picture-card" :action="uploadURL" :data="{ type: 'goods_album' }" :headers="headers"
         ref="uploadRef" :multiple="true">
         <a-icon v-if="true" type="plus" />
       </a-upload>
       <a-modal v-model="albumDialogVisible" :centered="true" width="30%">
         <a-img :src="albumDialogImageUrl" />
       </a-modal>
     </a-form-item>
     <!-- 商品库存 -->
     <a-form-item label="商品库存" :name="['stock']">
       <a-input v-model="form.stock" placeholder="请填写库存数量" />
     </a-form-item>
     <!-- 商品规格 -->
     <a-form-item label="商品规格" :name="['spec']">
       <a-input v-model="form.spec" placeholder="请填写商品规格" />
     </a-form-item>
     <!-- 商品简介 -->
     <a-form-item label="商品简介" :name="['description']" class="desc">
       <Editor :init="initEditor" v-model="form.description"></Editor>
     </a-form-item>
     <!-- 操作按钮 -->
     <a-form-item>
       <a-button type="primary" @click="editSubmit()" v-if="form.id">修改</a-button>
       <a-button type="primary" @click="addSubmit()" v-else>新增</a-button>
       <a-button @click="btnCancel">重置</a-button>
     </a-form-item>
   </a-form>
 </template>
 
 <script setup>
 import { ref, defineProps, defineEmits, defineExpose, reactive, onMounted } from 'vue'
 import { getCategoryList, uploadPictureURL, getGoods, addGoods, editGoods } from '../api'
 import useToken from '../stores/token'
 import notification from '../utils/notification'
 
 const props = defineProps({
   id: {
     type: Number
   }
 })
 
 const emit = defineEmits(['success'])
 
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
 const formRef = ref()
 const categoryList = ref([])
 const fileList = ref([])
 const uploadRef = ref()
 
 const uploadURL = uploadPictureURL()
 const { token } = useToken()
 const headers = { jwt: token, 'X-Requested-With': null }
 
 onMounted(() => {
   loadGoods()
 })
 
 const resetForm = id => {
   form.id = id
   btnCancel()
 }
 
 defineExpose({ resetForm })
 
 const loadGoods = async () => {
   if (form.id) {
     const goods = await getGoods({ id: form.id })
     if (goods.picture !== '') {
       const fileName = goods.picture.substring(goods.picture.lastIndexOf('/') + 1)
       if (fileName) {
         fileList.value = [{ name: fileName, url: goods.picture }]
       }
     }
     albumFileList.value = goods.album.map(item => {
       return {
         name: item.picture.substring(item.picture.lastIndexOf('/') + 1),
         url: item.picture
       }
     })
     goods.album = goods.album.map(item => {
       return item.picture.replace(/^https?:\/\/.*?\//, '')
     })
     Object.assign(form, goods)
   }
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
 
 // 新增商品
 const addSubmit = async () => {
   const data = {
     name: form.name,
     category_id: form.category_id,
     price: form.price,
     picture: form.picture,
     album: form.album,
     stock: form.stock,
     spec: form.spec,
     description: form.description
   }
   if (await addGoods(data)) {
     emit('success')
   }
 }
 
 // 修改商品
 const editSubmit = async () => {
   if (await editGoods(form)) {
     emit('success')
   }
 }
 
 // 重置表单
 const btnCancel = () => {
   formRef.value.resetFields()
   form.picture = ''
   // uploadRef.value.clearFiles()
   form.album = []
   // albumUploadRef.value.clearFiles()
   loadGoods()
 }
 
 // 文件超出个数限制时替换已有图片
 const handleExceed = files => {
   uploadRef.value.clearFiles()
   uploadRef.value.handleStart(files[0])
   uploadRef.value.submit()
 }
 
 const handleChange = info => {
   if (info.file.status === 'done') {
     if (info.file.response.errno === 0) {
       form.picture = info.file.response.data.savepath
     } else {
       notification({
         message: info.file.response.errmsg,
         type: 'error'
       })
     }
   }
 }
 // 上传成功
 const uploadSuccess = response => {
   const { errno, errmsg, data } = response
   if (errno !== 0) {
     notification({
       message: errmsg,
       type: 'error'
     })
   } else {
     if (errmsg !== '') {
       notification({
         message: errmsg,
         type: 'success'
       })
     }
     form.picture = data.savepath
   }
 }
 
 const albumUploadRef = ref()
 const albumDialogImageUrl = ref('')
 const albumDialogVisible = ref(false)
 const albumFileList = ref([])
 
 // 相册图上传成功  
 const albumUploadSuccess = response => {
   const { errno, errmsg, data } = response
   if (errno !== 0) {
     notification({
       message: errmsg,
       type: 'error'
     })
   } else {
     if (errmsg !== '') {
       notification({
         message: errmsg,
         type: 'success'
       })
     }
     form.album.push(data.savepath)
   }
 }
 
 // 删除相册图
 const albumHandleRemove = (removeFile, uploadFiles) => {
   form.album = []
   uploadFiles.forEach(item => {
     form.album.push(item.url.replace(/^https?:\/\/.*?\//, ''))
   })
 }
 
 // 预览已上传的相册图
 const handlePictureCardPreview = uploadFile => {
   albumDialogImageUrl.value = uploadFile.url
   albumDialogVisible.value = true
 }
 
 import Editor from '@tinymce/tinymce-vue'
 
 import 'tinymce/tinymce'
 import 'tinymce/models/dom'
 import 'tinymce/themes/silver'
 import 'tinymce/icons/default'
 import 'tinymce/plugins/image'
 
 // 编辑器配置
 let initEditor = {
   width: '100%',
   skin_url: '/tinymce/skins/ui/oxide',
   content_css: '/tinymce/skins/content/default/content.css',
   language_url: '/tinymce/langs/zh-Hans.js',
   language: 'zh-Hans',
   menubar: false,
   statusbar: false,
   toolbar: 'bold underline italic strikethrough image undo redo',
   plugins: 'image',
 }
 
 </script>
 
 <style scoped>
 .upload-demo {
   text-align: left;
   width: 91%;
 }
 </style>
 