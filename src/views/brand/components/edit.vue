<template>
  <el-dialog
    custom-class="brand-edit"
    :visible.sync="dialogVisible"
    width="60%"
    center
    top="10vh"
    :show-close="false"
  >
    <el-row>
      <el-col :span="24">
        <el-form ref="form" :model="form" label-width="90px">
          <el-form-item label="品牌名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="列表页图片">
            <el-col :span="24">
              <SingleUploader
                :data="{ dir: 'brand/cover' }"
                :on-success="coverUploadSuccess"
                :edit-image="form.list_pic"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="详情页图片">
            <el-col :span="24">
              <SingleUploader
                :data="{ dir: 'brand/primary' }"
                :on-success="primaryUploadSuccess"
                :editImage="form.pic"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="品牌介绍">
            <el-col :span="24">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="form.simple_desc"
              />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import { goodsBrand } from '@/api';
  import SingleUploader from '@/components/upload/single';
  export default {
    components:{
      SingleUploader,
    },
    props: {
      // 控制 显示/隐藏
      value: Boolean,
      editId: Number,
    },
    data() {
      return {
        dialogVisible: this.value,
        loadingInstance: {},
        category: [],
        attributes: [],
        defaultForm: {
          name: '',
          simple_desc: '',
          list_pic_url: {},
          pic_url: {},
        },
        form: {
          name: '',
          simple_desc: '',
          list_pic_url: {},
          pic_url: {},
        },
      };
    },
    watch: {
      value(val) {
        this.dialogVisible = val;
        // val ? this.startLoading() : this.stopLoading();
      },
      async editId(val) {
        if (val === 0) {
          this.form = this.defaultForm;
        } else {
          const { code, data } = await goodsBrand.get(val);
          if (code === 200) {
            this.form = {
              ...data,
              list_pic: this.urlToUploadImg(data.list_pic_url),
              pic: this.urlToUploadImg(data.pic_url),
            };
          }
        }
      },
      dialogVisible(val) {
        this.$emit("input", val);
      }
    },
    methods: {
      startLoading(){
        this.loadingInstance = this.$loading({
          target: ".brand-edit",
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      },
      stopLoading() {
        this.loadingInstance.close();
      },
      coverUploadSuccess(file) {
        this.form.list_pic = file;
      },
      primaryUploadSuccess(file) {
        this.form.pic = file;
      },
      onSubmit() {
        if (!this.form.list_pic || !this.form.pic) return this.$message.error('信息不全！');
        this.form.list_pic_url = this.form.list_pic.url;
        this.form.pic_url = this.form.pic.url;
        this.$emit("submitBrand", this.form);
      },
      urlToUploadImg(url) {
        return { name: url, url };
      }
    }
  };
</script>

<style lang="scss">
  .brand-edit {
    .el-dialog__header {
      display: none;
    }
  }
</style>
