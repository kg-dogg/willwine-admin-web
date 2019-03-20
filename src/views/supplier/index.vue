<template>
  <el-card>
    <div class="filter-container">
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商户管理</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="请输入商品名称或商户名称" v-model="searchData">
            <el-button slot="append" icon="el-icon-search" @click="search()" />
          </el-input>
        </el-col>
      </el-row>
      <el-button type='text' icon='el-icon-plus' @click='add()'>创建</el-button>
    </div>
    <el-table :data="data">
      <el-table-column prop="name" label="商户" />
      <el-table-column prop="goods_count" label="商品数" />
      <el-table-column prop="sold_count" label="已成交订单数" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="modifyRow(scope)"
            type="text"
            size="small">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import { supplier } from '@/api';
  export default {
    data() {
      return {
        searchData: '',
        form: {
          name: '',
        },
        data: [],
      }
    },
    created() {
      this.getList();
    },
    methods: {
      async getList() {
        const { code, data } = await supplier.list();
        code === 200 && (this.data = data);
      },
      add() {
        this.$prompt('请输入商户名称', '添加商户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputErrorMessage: '商户名不能为空'
        }).then(({ value }) => {
          this.createSupplier(value);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
      async createSupplier(name) {
        this.form.name = name;
        const { code, msg } = await supplier.create(this.form);
        if (code === 200) {
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
      search() {
        this.$message({
          message: `目前商户只有一家，此功能暂不实现，搜索：${this.searchData}`,
          type: 'warning'
        });
      },
      modifyRow({ row }) {
        const { id } = row;
        this.$prompt('请输入商户名称', '修改商户信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputErrorMessage: '商户名不能为空'
        }).then(({ value }) => {
          this.updateSupplier({ id, name: value });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
      async updateSupplier(form) {
        const { code } = await supplier.put(form);
        if (code === 200) {
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
    },
  }
</script>