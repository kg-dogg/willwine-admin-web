<template>
  <el-col :span="18">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="品牌">
        <el-select
          clearable
          v-model="form.brand"
          placeholder="请选择"
        >
          <el-option
            v-for="option in brandList"
            :key="option.id"
            :label="option.name"
            :value="option.id">
            <div
              class="select-option-icon"
              v-bind:style="{ backgroundImage: `url(${option.list_pic_url})` }"
            />
            <div>{{ option.name }}</div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="列表页图片">
        <el-col :span="24">
          <SingleUploader
            :data="{ dir: 'liquor/cover' }"
            :on-success="coverUploadSuccess"
            :edit-image="editImage.cover"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="详情页图片">
        <el-col :span="24">
          <MultipleUploader
            :data="{ dir: 'liquor/primary' }"
            :on-success="primaryUploadSuccess"
            :edit-image-list="editImage.primaryList"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="商品详情">
        <el-col :span="24">
          <MultipleUploader
            :data="{ dir: 'liquor/description' }"
            :on-success="descUploadSuccess"
            :edit-image-list="editImage.descList"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="商户">
        <el-select
          clearable
          v-model="form.supplier"
          placeholder="请选择"
        >
          <el-option
            v-for="option in supplierList"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.category_id" size="small">
          <el-radio-button
            v-for="item in category"
            :label="item.id"
            :key="item.id"
          >{{item.name}}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-alert v-if="form.category_id !== '' && attributes.length ===0" title="" type="warning" :closable="false">
          该类型还没有属性，请先<el-button type="text" @click="toAddAttribute">添加</el-button>
        </el-alert>
      </el-form-item>
      <el-form-item v-for="item in attributes" :label="item.name" :key="item.id">
        <el-input
          v-if="item.input_type === 0"
          v-model="form.attributes[item.id]"
        />
        <el-select
          v-if="item.input_type > 0"
          clearable
          class="attribute-select"
          :multiple="item.input_type === 2"
          v-model="form.attributes[item.id]"
          placeholder="请选择"
        >
          <el-option
            v-for="option in item.goods_attribute_values"
            :key="option.id"
            :label="option.value"
            :value="option.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">下一步：规格信息</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
  import { goodsBrand, supplier, attribute } from '@/api';
  import SingleUploader from '@/components/upload/single';
  import MultipleUploader from '@/components/upload/multiple';
  export default {
    components:{
      SingleUploader,
      MultipleUploader,
    },
    data() {
      return {
        brandList: [],
        supplierList: [],
        category: [],
        attributes: [],
        form: {
          brand: '',
          supplier: '',
          name: '',
          attributes: {},
          category_id: '',
          thumbnail: '',
        },
        editImage: {
          cover: {},
          primaryList: [],
          descList: [],
        },
      }
    },
    watch: {
      ['form.category_id'](val) {
        this.getAttribute({ id: val });
      },
      ['form.attributes']: {
        deep: true,
        handler(val) {
          const result = Object.values(val).flat();
          // 降维原因：goods_attribute表中只需保存goods_id与goods_attribute_value_id
          // 通过goods_attribute_value表attribute_key_id字段可找到对应的goods_attribute_key
          console.log('form.attributes.values', result);
        }
      },
    },
    created() {
      this.getBrandList();
      this.getSupplierList();
      this.getAttributeCategory();
    },
    methods: {
      async getBrandList() {
        const { code, data } = await goodsBrand.list();
        code === 200 && (this.brandList = data);
      },
      async getSupplierList() {
        const { code, data } = await supplier.list();
        if (code === 200) {
          this.supplierList = data;
          data.length === 1 && (this.form.supplier = data[0].id);
        }
      },
      async getAttributeCategory() {
        const { code, data } = await attribute.goodsAttributeCategory.list();
        code === 200 && (this.category = data);
      },
      async getAttribute({ id }) {
        const { code, data } = await attribute.goodsAttributeValue.listByCategoryId(id);
        this.attributes = data;
        // console.log('getAttribute', this.attributes);
      },
      toAddAttribute() {
        this.$router.push({
          name: 'goodsAttributeKeyList',
          params: { id: this.form.category_id },
        });
      },
      coverUploadSuccess(file) {
        this.form.list_pic_url = file.url;
      },
      primaryUploadSuccess(list) {
        this.form.primary_pic_url = list.map(item => item.response ? item.response.result.data : '').filter(item => item);
      },
      descUploadSuccess(list) {
        this.form.goods_desc = list.map(item => item.response ? item.response.result.data : '').filter(item => item);
      },
      onSubmit() {
        console.log('submit!', this.form);
        this.$emit('onSubmit', this.form);
      }
    }
  }
</script>
<style lang="less">
.filter-container{
  margin-bottom: 20px;
}
.attribute-select{
  width: 300px;
}
.el-select-dropdown__item{
  margin: 5px 0;
}
.select-option-icon{
  float: left;
  width: 34px;
  height: 34px;
  border: 1px solid #ccc;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  +div{
    float: left;
    margin-left: 10px;
  }
}
</style>