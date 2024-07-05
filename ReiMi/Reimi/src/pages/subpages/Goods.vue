<template>
  <div>
    <a-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增商品</a-button>
    <!-- 新增商品的弹出框 -->
    <a-modal v-model:open="dialogVisible" :title="id ? '修改商品' : '新增商品'" @cancel="handleBeforeClose" :footer="null"
      style="width: 60vw;height: 60vh;">
      <GoodsEdit ref="goodsForm" :id="id" @success="editSuccess" />
    </a-modal>
    <!-- 商品列表 -->
    <a-table :data-source="goodsList" style="width: 100%; margin-bottom: 20px" :row-key="(record) => record.id" bordered
      :pagination="false" size="middle">
      <a-table-column title="商品编号" data-index="id" width="100" />
      <a-table-column title="商品名称" data-index="name" width="260" />
      <a-table-column title="商品价格" data-index="price" width="100" />
      <a-table-column title="商品库存" data-index="stock" width="100" />
      <a-table-column title="商品简介" data-index="description" />
      <a-table-column title="商品图片" data-index="picture" width="120">
        <template #default="{ record }">
          <a-image v-if="record.picture" :src="record.picture" :preview="false"
            style="height: 60px; object-fit: contain;" />
        </template>
      </a-table-column>
      <a-table-column fixed="right" title="操作" width="200">
        <template #default="{ record }">
          <a-button type="warning" @click="editRow(record)">编辑</a-button>
          <a-popconfirm title="确定要删除此商品吗？" @confirm="() => delRow(record)">
            <a-button type="danger">删除</a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </a-table>
    <a-pagination v-model:current="page" show-less-items :total="total" v-model:pageSize="pagesize"
      @change="handleCurrentChange" style="margin-bottom: 50px;" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getGoodsList, delGoods } from '../../api'
import GoodsEdit from '../../components/GoodsEdit.vue'
import { message, Modal } from 'ant-design-vue'

const current = ref(2);
const goodsList = ref([])
const page = ref(1)
const pagesize = ref(7)
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

const delRow = async (row) => {
  try {
    if (await delGoods({ id: row.id })) {
      loadGoodsList();
      message.success('商品已成功删除');
    }
  } catch (error) {
    // 用户点击取消或关闭对话框时的异常处理（如果需要）
  }
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
    title: '提示',
    content: '确定关闭对话框吗？',
    onOk: () => {
      dialogVisible.value = false
    },
  });
}
</script>