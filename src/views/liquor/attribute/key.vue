<template>
  <el-card>
    <div class="filter-container">
      <el-row type="flex">
        <el-col :span="12">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/liquor/goods/attribute/category' }">属性类别</el-breadcrumb-item>
            <el-breadcrumb-item>属性名</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-card>
        <el-row>
          <h1 class="category-title">当前分类：
            <span>{{category}}</span>
          </h1>
        </el-row>
        <el-form :inline="true" ref="form" :model="form" label-width="80px">
          <el-col :span="10">
            <el-form-item label="属性名称">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
          <el-form-item label="录入方式">
            <el-select v-model="form.input_type">
              <el-option
                v-for="item in input_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="10">
          <el-form-item label="顺序">
            <el-input-number
              v-model="form.sort_order"
              controls-position="right"
              :min="0"
            />
          </el-form-item>
          </el-col>
          <el-col :span="10">
          <el-form-item>
            <el-button type="primary" @click="save">添加</el-button>
          </el-form-item>
          </el-col>
        </el-form>
      </el-card>
      <el-table :data="data">
        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column label="名称" width="300">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column label="录入方式" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.input_type">
              <el-option
                v-for="item in input_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
            <el-button
              @click.native.prevent="toAddAttribute(scope)"
              type="text"
              size="small">
              添加属性值
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
        category: '',
        input_type: [
          { label: '输入框', value: 0 },
          { label: '下拉框（单选）', value: 1 },
          { label: '下拉框（多选）', value: 2 },
        ],
        data: [],
        form: {
          name: '',
          sort_order: 0,
        }
      }
    },
    created() {
      this.getCurrentCategory();
      this.getList();
    },
    methods: {
      async getCurrentCategory() {
        const { id } = this.$route.params;
        const { code, data } = await attribute.goodsAttributeCategory.get(id);
        code === 200 && (this.category = data.name);
      },
      async deleteRow({ row }) {
        const { id } = row;
        const { code, msg } = await attribute.goodsAttributeKey.del({ id });
        if (code === 200) {
          this.$message.success(msg);
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
      async updateRow({ row }) {
        const { id, name, input_type, sort_order } = row;
        const { code, msg } = await attribute.goodsAttributeKey.put({ id, name, input_type, sort_order });
        if (code === 200) {
          this.$message.success(msg);
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
      async getList() {
        const { id } = this.$route.params;
        const { code, data } = await attribute.goodsAttributeKey.list(id);
        code === 200 && (this.data = data);
      },
      async save() {
        const { code, msg } = await attribute.goodsAttributeKey.create({
          ...this.form,
          attribute_category_id: this.$route.params.id,
        });
        if (code === 200) {
          this.getList();
        } else {
          this.$message.error(msg);
        }
      },
      toAddAttribute({ row }) {
        const { id } = row;
        this.$router.push({ name: 'goodsAttributeValueList', params: { keyId: this.$route.params.id, id } });
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
