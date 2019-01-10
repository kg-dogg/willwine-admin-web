<template>
  <div>
    <el-button
      type="text"
      icon='el-icon-plus'
      @click="toAddProductCategory"
    >新增分类</el-button>
    <el-table :data="data">
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.row.id)"
            type="text"
            size="small">
            移除
          </el-button>
          <el-button
            @click.native.prevent="toAddProduct(scope.row.id)"
            type="text"
            size="small">
            添加产品
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { attribute } from '@/api';
  export default {
    data() {
      return {
        data: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      deleteRow(id) {
        console.log(id);
      },
      async getList() {
        const { code, data } = await attribute.productCategory.get();
        code === 200 && (this.data = data);
      },
      toAddProductCategory() {
        this.$router.push({ name: 'addProductCategory' });
      },
      toAddProduct(id) {
        this.$router.push({ name: 'productList', params: { id } });
      },
    },
  }
</script>