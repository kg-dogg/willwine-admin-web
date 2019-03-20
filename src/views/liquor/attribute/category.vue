<template>
  <el-card>
    <div class="filter-container">
      <el-row type="flex">
        <el-col :span="12">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>属性类别</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-form :inline="true" ref="form" :model="form">
        <el-form-item label="属性类型名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="data">
        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column label="名称" width="400">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" />
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
            <el-button
              @click.native.prevent="toAddAttribute(scope)"
              type="text"
              size="small">
              添加属性
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
        data: [],
        form: {
          name: '',
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      async deleteRow({ row }) {
        const { id } = row;
        const { code } = await attribute.goodsAttributeCategory.del({ id });
        if (code === 200) {
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
      async updateRow({ row }) {
        const { id, name } = row;
        const { code } = await attribute.goodsAttributeCategory.put({ id, name });
        if (code === 200) {
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
      async getList() {
        const { code, data } = await attribute.goodsAttributeCategory.list();
        code === 200 && (this.data = data);
      },
      async save() {
        const { code, msg } = await attribute.goodsAttributeCategory.create(this.form);
        if (code === 200) {
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
      toAddAttribute({ row }) {
        const { id } = row;
        this.$router.push({ name: 'goodsAttributeKeyList', params: { id } });
      },
    },
  }
</script>