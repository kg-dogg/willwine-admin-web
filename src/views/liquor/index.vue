<template>
  <el-card>
    <div class="filter-container">
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="请输入商品名称" v-model="searchData">
            <el-button slot="append" icon="el-icon-search" @click="search()" />
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-button type="text" icon='el-icon-plus' @click='add()'>创建</el-button>
        </el-col>
        <el-col :span="12">
          <el-tabs v-model="activeName">
            <el-tab-pane
              :key="k"
              v-for="(v, k) in saleStatusTabs"
              :label="v.name"
              :name="k"
            />
          </el-tabs>
        </el-col>
      </el-row>
    </div>
    <el-table :data="data">
      <el-table-column prop="name" label="商户" />
      <el-table-column prop="goods_count" label="商品数" />
      <el-table-column prop="sold_count" label="已成交订单数" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="view(scope)"
            type="text"
            size="small">
            详情
          </el-button> | 
          <el-popover
            placement="bottom"
            trigger="hover"
          >
            <div style="text-align:center;">
              <el-button
                type="text"
                size="small"
                @click.native.prevent="modifyStatus(scope, 0)"
              >下架商品
              </el-button>
            </div>
            <div style="text-align:center;">
              <el-button
                type="text"
                size="small"
                @click.native.prevent="modifyStatus(scope, -1)"
              >标记缺货
              </el-button>
            </div>
            <el-button type="text" size="small" slot="reference">更多</el-button>
          </el-popover>
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
        activeName: 'all',
        // -1：缺货|0：已下架|1: 待上架|2：售卖中
        saleStatusTabs: {
          all: { name: '全部', value: {} },
          onSale: { name: '售卖中', value: { sale_status: 2 } },
          prepare: { name: '待上架', value: { sale_status: 1 } },
          stockout: { name: '缺货', value: { sale_status: -1 } },
          offShelf: { name: '已下架', value: { sale_status: 0 } },
        },
        searchData: '',
        form: {
          name: '',
        },
        data: [],
      }
    },
    watch: {
      activeName(val) {
        console.log('activeName', this.saleStatusTabs[val].value);
      },
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
        this.$router.push({ name: 'addLiquor' });
      },
      modifyStatus({ row }, status) {
        console.log('modifyStatus', row.id, status);
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