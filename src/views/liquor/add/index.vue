<template>
  <el-card>
    <div class="filter-container">
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/liquor' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品 - {{children[currentChildIndex].title}}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
    </div>
    <keep-alive>
      <component :is="children[currentChildIndex].comopnent" />
    </keep-alive>
  </el-card>
</template>

<script>
  import Info from './component/info';
  import Sku from './component/sku';
  export default {
    components: {
      Info,
      Sku,
    },
    data() {
      return {
        currentChildIndex: 0,
        children: [
          { title: '商品信息', comopnent: Info },
          { title: '规格信息', comopnent: Sku },
        ],
        form: {
          name: '',
        }
      }
    },
    methods: {
      submit(form) {
        console.log('submit', form);
      }
    }
  }
</script>
<style>
.filter-container{
  margin-bottom: 20px;
}
</style>