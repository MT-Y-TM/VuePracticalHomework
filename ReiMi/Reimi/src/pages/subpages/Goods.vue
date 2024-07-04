<template>
  <div>
    <a-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增商品</a-button>
    <!-- 新增商品的弹出框 -->
    <a-modal v-model:visible="dialogVisible" :title="id ? '修改商品' : '新增商品'" @cancel="handleBeforeClose">
      <GoodsEdit ref="goodsForm" :id="id" @success="editSuccess"></GoodsEdit>
    </a-modal>
    <!-- 商品列表 -->
    <a-table :dataSource="goodsList" style="width: 100%; margin-bottom: 20px" rowKey="id" bordered>
      <a-table-column key="id" dataIndex="id" title="商品编号" width="100" />
      <a-table-column key="name" dataIndex="name" title="商品名称" width="260" />
      <a-table-column key="price" dataIndex="price" title="商品价格" width="100" />
      <a-table-column key="stock" dataIndex="stock" title="商品库存" width="100" />
      <a-table-column key="description" dataIndex="description" title="商品简介" />
      <a-table-column key="picture" dataIndex="picture" title="商品图片" width="120">
        <template #default="{ record }">
          <a-image v-if="record.picture != ''" :src="record.picture" fit="contain" style="display: flex; align-items: center; height: 60px;" />
        </template>
      </a-table-column>
      <a-table-column key="action" title="操作" width="200">
        <template #default="{ record }">
          <a-button type="warning" @click="editRow(record)">编辑</a-button>
          <a-button type="danger" @click="delRow(record)">删除</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-pagination
      v-model:current="page"
      :total="total"
      :page-size="pagesize"
      @change="handleCurrentChange"
      style="margin-bottom: 50px;"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getGoodsList, delGoods } from '../../api'
import GoodsEdit from '../../components/GoodsEdit.vue'
import { message, Modal } from 'ant-design-vue'

const goodsList = ref([])
const page = ref(1)
const pagesize = ref(10)
const total = ref(0)
const id = ref()
const dialogVisible = ref(false)
const goodsForm = ref()

onMounted(() => {
  loadGoodsList()
})

const loadGoodsList = async () => {
  const params = {
    page: page.value,
    pagesize: pagesize.value
  }
  const data = await getGoodsList(params)
  goodsList.value = data.list.map(item => {
    item.description = removeTags(item.description)
    return item
  })
  total.value = data.total
}

// 去掉标签，仅显示文字
const removeTags = str => {
  return str.replace(/<[^>]+>/g, '')
}

// 新增商品
const addRow = () => {
  if (goodsForm.value) {
    goodsForm.value.resetForm(0)
  }
  id.value = 0
  dialogVisible.value = true
}

// 修改商品
const editRow = row => {
  if (goodsForm.value) {
    goodsForm.value.resetForm(row.id)
  }
  id.value = row.id
  dialogVisible.value = true
}

// 删除商品
const delRow = row => {
  Modal.confirm({
    title: '确定要删除此商品吗？',
    onOk: async () => {
      if (await delGoods({ id: row.id })) {
        loadGoodsList()
      }
    },
    onCancel() {}
  })
}

// 换页
const handleCurrentChange = value => {
  page.value = value
  loadGoodsList()
}

// 编辑完成
const editSuccess = () => {
  loadGoodsList()
  dialogVisible.value = false
}

// 关闭弹出框前
const handleBeforeClose = () => {
  Modal.confirm({
    title: '确定关闭对话框吗？',
    onOk: () => {
      dialogVisible.value = false
      setTimeout(() => {
        goodsForm.value.resetForm()
      }, 500)
    },
    onCancel() {}
  })
}
</script>
