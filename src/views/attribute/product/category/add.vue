<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="分类层级">
      <el-select v-model="form.parent_id" placeholder="请选择父类" clearable @clear="clearCategory">
        <el-option
          v-for="item in parent"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="分类名称">
      <el-col :span="12">
        <el-input v-model="form.name" />
      </el-col>
    </el-form-item>
    <el-form-item label="排序次序">
      <el-col :span="4">
        <el-input-number
          v-model="form.sort_order"
          controls-position="right"
          :min="0"
        />
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { attribute } from '@/api';
  export default {
    data() {
      return {
        parent: [],
        form: {
          name: '',
          parent_id: undefined,
          sort_order: 0,
        }
      }
    },
    created() {
      this.getRootCategory();
    },
    methods: {
      clearCategory(val) {
        this.form.parent_id = 0;
      },
      async getRootCategory() {
        const { code, data } = await attribute.productCategory.get();
        code === 200 && (this.parent = data);
      },
      async onSubmit() {
        const { code, msg } = await attribute.productCategory.create(this.form);
        if ( code === 200 ) {
          this.$router.push({ name: "productCategory" });
        } else {
          this.$message.error(msg.original.code);
        }
      },
    }
  }
</script>