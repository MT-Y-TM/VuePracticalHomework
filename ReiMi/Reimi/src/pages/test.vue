<template>
  <div>
    <a-button type="primary" @click="addRow" style="margin-bottom: 10px;">新增分类</a-button>
    <!-- 分类管理 -->
    <a-table ref="tableRef" :data-source="tableData" :row-key="record => record.id" :columns="columns" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          {{ record.name }}
        </template>
        <template v-if="column.dataIndex === 'level'">
          <span v-if="record.pid == 0">一级分类</span>
          <span v-else>二级分类</span>
        </template>
        <template v-if="column.dataIndex === 'id'">
          {{ record.id }}
        </template>
        <template v-if="column.dataIndex === 'picture'">
          <a-image v-if="record.picture" :src="record.picture" :preview="false" style="max-height: 60px;"/>
        </template>
        <template v-if="column.dataIndex === 'actions'">
          <a-button type="link" @click="editRow(record)">编辑</a-button>
          <a-button type="link" @click="delRow(record)" style="color: #f5222d;">删除</a-button>
        </template>
      </template>
    </a-table>
    <!-- 新增分类的弹出框 -->
    <a-drawer v-model:open="dialogVisible" title="分类编辑" placement="right" :wrap-style="{ width: '80%' }">
      <CategoryEdit ref="categoryForm" :id="id" @success="editSuccess" />
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategoryList, delCategory } from '../api'
import { message, Modal } from 'ant-design-vue'
import CategoryEdit from '../components/CategoryEdit.vue'

const tableData = ref([])
const dialogVisible = ref(false)
const id = ref(0)
const columns = ref([
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: '分类级别',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: '分类编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '分类图片',
    dataIndex: 'picture',
    key: 'picture',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    key: 'actions',
  },
])

onMounted(() => {
  loadCategoryList()
})

// 查询分类列表
const loadCategoryList = async () => {
  const data = await getCategoryList()
  tableData.value = convertToTree(data)
}

// 将一维数组转换成树形结构的方法
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

// 关闭弹出框前调用的函数
const handleBeforeClose = () => {
  message.info('Dialog is closing')
  dialogVisible.value = false
}

const editSuccess = () => {
  loadCategoryList()
  dialogVisible.value = false
}

// 新增分类
const addRow = () => {
  id.value = 0
  dialogVisible.value = true
}

// 修改分类
const editRow = row => {
  id.value = row.id
  dialogVisible.value = true
}

// 删除分类
const delRow = async row => {
  if (row.pid == 0 && row.children.length != 0) {
    message.warning('该分类下存在二级分类，请先删除二级分类再删除此分类')
  } else {
    const confirmResult = await Modal.confirm({
      title: '确定要删除此分类吗？',
      onOk() {
        return delCategory({ id: row.id })
      }
    })
    if (confirmResult) {
      loadCategoryList()
    }
  }
}
</script>
