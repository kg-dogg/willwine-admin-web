<template>
  <el-col :span="18">
    <el-form ref="form" :model="form[0]" label-width="120px">
      <el-form-item label="规格名称">
        <el-input v-model="form[0].skuName" />
      </el-form-item>
      <el-form-item label="列表页图片">
        <el-col :span="24">
          <SingleUploader
            :data="{ dir: 'liquor/sku/cover' }"
            :on-success="coverUploadSuccess"
            :edit-image="editImage.cover"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form[0].skuPrice" />
      </el-form-item>
      <el-form-item label="配送模板">
        <el-select
          clearable
          v-model="form[0].distributionTemplate"
          placeholder="请选择"
        >
          <el-option
            v-for="option in distributionTemplateList"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运费">
        <el-input v-model="form[0].skuCarriage" />
      </el-form-item>
      <el-form-item>
        <el-button type="button" @click="onSave">仅保存</el-button>
        <el-button type="primary" @click="onSubmit">保存并上架</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
  import { goodsBrand, supplier, attribute } from '@/api';
  import SingleUploader from '@/components/upload/single';
  export default {
    components:{
      SingleUploader,
    },
    data() {
      return {
        distributionTemplateList: [],
        form: [{
          skuName: '',
          skuPrice: 0,
          skuCover: '',
          distributionTemplate: '',
          skuCarriage: 0,
        }],
        editImage: {
          cover: {},
        },
      }
    },
    created() {
      this.getDistributionTemplateList();
    },
    methods: {
      async getDistributionTemplateList() {
        // const { code, data } = await goodsBrand.list();
        // code === 200 && (this.distributionTemplateList = data);
      },
      coverUploadSuccess(file) {
        this.form[0].skuCover = file.url;
      },
      onSave() {
        console.log('save', this.form);
      },
      onSubmit() {
        console.log('submit!', this.form);
        // this.$emit("onSubmit", this.form);
      }
    }
  }
</script>