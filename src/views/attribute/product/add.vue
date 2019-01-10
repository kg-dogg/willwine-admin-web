<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="所属分类">
      <el-select v-model="form.product_category_id" placeholder="请选择类别" clearable>
        <el-option
          v-for="item in category"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="产品名称">
      <el-col :span="12">
        <el-input v-model="form.name" />
      </el-col>
    </el-form-item>
    <el-form-item label="副标题">
      <el-col :span="12">
        <el-input v-model="form.subtitle" />
      </el-col>
    </el-form-item>
    <el-form-item label="产品主图">
      <el-col :span="12">
        <SingleUploader />
      </el-col>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-col :span="12">
        <MultipleUploader />
      </el-col>
    </el-form-item>
    <el-form-item label="产品详情">
      <Tinymce class='tinymce' v-model="form.detail" />
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
import Tinymce from "@/components/Tinymce";
import SingleUploader from '@/components/upload/single';
import MultipleUploader from '@/components/upload/multiple';

export default {
  components:{
    Tinymce,
    SingleUploader,
    MultipleUploader,
  },
  data() {
    return {
      category: [],
      form: {
        name: '',
        subtitle: '',
        product_category_id: undefined,
        main_image: '',
        sub_images: [],
        detail: '',
        sort_order: 0,
      }
    }
  },
  created() {
    this.getCategory();
  },
  methods: {
    async getCategory() {
      const { code, data } = await attribute.productCategory.get();
      code === 200 && (this.category = data);
    },
    async onSubmit() {
      // product_category_id, name, subtitle, main_image
      // sub_images, detail
      const { code, msg } = await attribute.product.create(this.form);
      if ( code === 200 ) {
        this.$router.push({ name: "productList" });
      } else {
        this.$message.error(msg.original.code);
      }
    },
  }
}
</script>