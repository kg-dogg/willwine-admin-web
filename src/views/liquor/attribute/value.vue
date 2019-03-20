<template>
  <el-card>
    <div class="filter-container">
      <el-row type="flex">
        <el-col :span="12">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/liquor/goods/attribute/category' }">属性类别</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: `/liquor/goods/attribute/${$route.params.keyId}/key` }">属性名</el-breadcrumb-item>
            <el-breadcrumb-item>属性值</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
    </div>
    <div>
      <h1 class="category-title">当前属性：
        <span>{{attribute}}</span>
      </h1>
      <el-form :inline="true" ref="form" :model="form">
        <el-form-item label="属性值">
          <el-input v-model="form.value" />
        </el-form-item>
        <el-form-item label="顺序">
          <el-input-number
            v-model="form.sort_order"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="data">
        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column label="名称" width="300">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" />
          </template>
        </el-table-column>
        <el-table-column label="顺序" width="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sort_order" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="updateRow(scope)"
              type="text"
              size="small">
              更新
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope)"
              type="text"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
  import { attribute } from '@/api';
  export default {
    data() {
      return {
        attribute: '',
        data: [],
        form: {
          value: '',
          sort_order: 0,
        }
      }
    },
    created() {
      this.getCurrentAttribute();
      this.getList();
    },
    methods: {
      async getCurrentAttribute() {
        const { id } = this.$route.params;
        const { code, data } = await attribute.goodsAttributeKey.get(id);
        code === 200 && (this.attribute = data.name);
      },
      async deleteRow({ row }) {
        const { id } = row;
        const { code, msg } = await attribute.goodsAttributeValue.del({ id });
        if (code === 200) {
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
      async updateRow({ row }) {
        const { id, value, sort_order } = row;
        const { code } = await attribute.goodsAttributeValue.put({ id, value, sort_order });
        if (code === 200) {
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
      async getList() {
        const { id } = this.$route.params;
        const { code, data } = await attribute.goodsAttributeValue.list(id);
        code === 200 && (this.data = data);
      },
      async save() {
        const { code, msg } = await attribute.goodsAttributeValue.create({
          ...this.form,
          attribute_key_id: this.$route.params.id,
        });
        if (code === 200) {
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.category-title {
  margin-bottom: 3rem;
  > span{
    color: #f80;
  }
}
</style>
