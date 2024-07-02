<template>
  <a-row :gutter="20">
    <a-col :span="6">
      <a-card class="box-card">
        <template #title>
          <div class="card-header">
            <a-avatar class="avatar" :src="admin.avatar" shape="square" :size="40"></a-avatar>
            <span style="font-size: 24px;">{{ admin.username }}</span>
          </div>
        </template>
        <div class="info">
          <p>登录时间：{{ loginInfo.loginTime }}</p>
          <p>登录地点：{{ loginInfo.loginPlace }}</p>
        </div>
      </a-card>
    </a-col>
    <!-- 单月统计信息展示 -->
    <a-col :span="18">
      <a-card class="box-card">
        <template #title>
          <div class="card-header">
            6 月统计信息
          </div>
        </template>
        <div class="info">
          <a-row :gutter="24">
            <!-- 商品数量 -->
            <a-col :span="8">
              <div class="card-container">
                <div class="card-left-container" style="background-color: #EEAD0E;">
                  <a-icon :component="AlignLeftOutlined" :size="120"> <!-- 调整 size 属性 -->
                    <AlignLeftOutlined />
                  </a-icon>
                </div>
                <div class="card-right-container">
                  <p class="number">500</p>
                  <p>商品数量(个)</p>
                </div>
              </div>
            </a-col>
            <!-- 商品分类数量 -->
            <a-col :span="8">
              <div class="card-container">
                <div class="card-left-container" style="background-color: #AB82FF;">
                  <a-icon :component="AlignLeftOutlined" :size="120"> <!-- 调整 size 属性 -->
                    <AlignLeftOutlined />
                  </a-icon>
                </div>
                <div class="card-right-container">
                  <p class="number">20</p>
                  <p>商品分类数量(个)</p>
                </div>
              </div>
            </a-col>
            <!-- 用户访问次数 -->
            <a-col :span="8">
              <div class="card-container">
                <div class="card-left-container" style="background-color: #63B8FF;">
                  <a-icon :component="AlignLeftOutlined" :size="120"> <!-- 调整 size 属性 -->
                    <AlignLeftOutlined />
                  </a-icon>
                </div>
                <div class="card-right-container">
                  <p class="number">121</p>
                  <p>用户访问次数(次)</p>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </a-col>
  </a-row>
  <!-- 图表区域 -->
  <a-row :gutter="20">
    <a-col :span="12">
      <!-- 通过折线图展示 2022 年月度销售额 -->
      <a-card class="box-card">
        <div id="salesVolume" style="width: auto; height: 400px;"></div>
      </a-card>
    </a-col>
    <a-col :span="12">
      <!-- 通过柱状图展示 2022 年订单数量 -->
      <a-card class="box-card">
        <div id="orderQuantity" style="width: auto; height: 400px;"></div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { getAdmin } from '../../api';
import useAdmin from '../../stores/admin';
import { AlignLeftOutlined } from '@ant-design/icons-vue';
import * as echarts from 'echarts'
import config from '../../config';

const { admin, updateAdmin } = useAdmin();

//挂载图表
onMounted(() => {
  loadAdmin()  
  initCharts1()
  initCharts2()
});

//月销售额度图表数据
const initCharts1 = () => {
  const myChart = echarts.init(document.getElementById('salesVolume'));
  myChart.setOption({
    color: ['#1493fa'],
    title: {
      text: '2022 年月度销售额'
    },
    xAxis: {
      data: [
        '1 月', '2 月', '3 月', '4 月', '5 月', '6 月',
        '7 月', '8 月', '9月', '10 月', '11 月', '12 月'
      ],
      name: '月份',
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      name: '单位（千万元）'
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '5%',
      containLabel: true
    },
    legend: {},
    series: [{
      data: [6, 7, 8.5, 8, 9, 10, 13, 12, 10, 16, 15, 14],
      type: 'line',
      name: '销售额',
      smooth: true,
      label: {
        show: true,
        position: 'top'
      }
    }]
  });

  // 图表自适应大小
  window.onresize = () => {
    myChart.resize();
  };
};

// 2022年订单数量图标数据
const initCharts2 = () => {
  const myChart = echarts.init(document.getElementById('orderQuantity'));
  myChart.setOption({
    title: { text: '2022 年订单数量' },
    color: ['#1493fa'],
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: [
        '1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'
      ],
      name: '月份',
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        interval: 0,
        rotate: 45, // 设置刻度标签旋转角度为 45 度
      },
    },
    legend: {},
    yAxis: {
      name: '单位（个）',
    },
    series: [
      {
        data: [400, 450, 300, 230, 250, 300, 400, 350, 160, 350, 380, 400],
        type: 'bar',
        barWidth: '60%',
        name: '订单总数',
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
  });

  // 图表自适应大小
  window.onresize = () => {
    myChart.resize();
  };
};

const loadAdmin = async () => {
  let data = await getAdmin();
  updateAdmin({
    username: data.username,
    avatar: data.avatar
  });
};

// 用户登录信息（模拟数据）
const loginInfo = reactive({
  loginTime: '2023-07-22 09:00:00',
  loginPlace: '北京'
});
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 10px;
}

.info p {
  margin: 0;
}
</style>

<style lang="scss" scoped>
.a-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .a-col {
    .box-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .info {
        font-size: 14px;
      }
    }
  }
}

.card-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e4e7ed;
  text-align: center;
  padding-right: 20px;
  .card-left-container {
    color: white;
  }
  .card-right-container {
    .number {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
