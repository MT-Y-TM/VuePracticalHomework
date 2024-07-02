<template>
Index
</template>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
    .el-col {
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
</style>

<script setup>
import useAdmin from '../../stores/admin.js'
</script>
