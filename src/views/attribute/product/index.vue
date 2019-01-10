<template>
  <div>
    <el-button
      type="text"
      icon='el-icon-plus'
      @click="addProduct"
    >新增产品</el-button>
    <el-table :data="data">
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, data)"
            type="text"
            size="small">
            移除
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
      deleteRow(index, data) {
        console.log(data[index].id);
      },
      async getList() {
        console.log('this.$route.params.id', this.$route.params.id);
        const { code, data } = await attribute.product.get();
        code === 200 && (this.data = data);
      },
      addProduct() {
        this.$router.push({ name: 'addProduct' });
      },
    },
  }
</script>