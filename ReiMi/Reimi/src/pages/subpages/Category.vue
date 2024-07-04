<template>
  <div>
    <el-button type="primary" style="margin-bottom: 10px" @click="addRow">新增分类</el-button>
    <!-- 分类管理 -->
    <el-table ref="tableRef" :data="tableData" style="margin-bottom: 20px" row-key="id" border default-expand-all>
      <el-table-column prop="name" label="分类名称" sortable />
      <el-table-column label="分类级别">
        <template #default="{ row }">
          <span v-if="row.pid == 0">一级分类</span>
          <span v-else>二级分类</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="分类编号" />
      <el-table-column label="分类图片">
        <template #default="{ row }">
          <el-image v-if="row.picture != ''" :src="row.picture" fit="contain" style="display: flex; align-items: center; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="{ row }">
          <el-button type="warning" @click="editRow(row)">编辑</el-button>
          <el-button type="danger" @click="delRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增分类的弹出框 -->
    <el-dialog v-model="dialogVisible" :title="id ? '修改分类' : '新增分类'" :before-close="handleBeforeClose">
      <CategoryEdit ref="categoryForm" :id="id" @success="editSuccess" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategoryList,delCategory } from '../../api'
import { ElMessageBox,ElMessage } from 'element-plus'
import CategoryEdit from '../../components/CategoryEdit.vue'

const tableData = ref([])
const dialogVisible = ref(false)
const id = ref(0)
const categoryForm = ref()

onMounted(() => {
  loadCategoryList()
})

// 查询分类列表
const loadCategoryList = async () => {
  let data = await getCategoryList()
  tableData.value = convertToTree(data)
}

// 将一维数组转换成树形结构的方法
const convertToTree = data => {
  const treeData = []
  const map = {}
  // 遍历一维数组数据，建立节点映射表
  for (const item of data) {
    map[item.id] = { ...item, children: [] }
  }

  // 遍历映射表，将节点添加到父节点的 children 中
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

// 关闭弹出框前调用的函数
const handleBeforeClose = () => {
  ElMessageBox.confirm('确定关闭对话框吗？', {
    showClose: false,
    closeOnClickModal: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    dialogVisible.value = false
  }).catch(() => {})
}

const editSuccess = () => {
  loadCategoryList()
  dialogVisible.value = false
}

// 新增分类
const addRow = () => {
  if (categoryForm.value) {
    categoryForm.value.resetForm(0)
  }
  id.value = 0
  dialogVisible.value = true
}

// 修改分类
const editRow = row => {
  if (categoryForm.value) {
    categoryForm.value.resetForm(row.id)
  }
  id.value = row.id
  dialogVisible.value = true
}

// 删除分类
const delRow = row => {
 if (row.pid == 0 && row.children.length != 0) {
 ElMessage({
 type: 'warning',
 message: '该分类下存在二级分类，请先删除二级分类再删除此分类'
 })
 } else {
 ElMessageBox.confirm('确定要删除此分类吗？', {
 closeOnClickModal: false,
 confirmButtonText: '确定',
 cancelButtonText: '取消',
 }).then(async () => {
 if (await delCategory({ id: row.id })) {
 loadCategoryList()
 }
 }).catch(() => {})
 }
}

</script>
