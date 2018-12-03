<template>
  <div>
    <div class="upload-wrapper">
      <el-upload class="uploader" drag :action="uploadUrl" :headers="myHeaders" accept=".xls,.xlsx,.csv" :limit="1" :data="uploadData" :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError" :on-remove="onRemove" :on-exceed="onExceed">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">此步骤需要导入班型课时对应关系表,支持Excel和CSV文件（单个文件最大10M);默认识别第一个sheet文件</div>
      </el-upload>
    </div>
    <UploadSample :sourceType="sourceType" v-if="!uploadStatus"></UploadSample>
  </div>
</template>

<script>
import {
  copyUploadJobUrl
} from "@/api/api";
import UploadSample from "./UploadSample.vue";
export default {
  components: {
    UploadSample
  },
  props:{
    sourceType:String
  },
  data(){
    return {
      uploadStatus:false, // 上传状态，是否成功
      uploadUrl: copyUploadJobUrl,
      myHeaders: { Authorization: `Bearer ${lockr.get("auth_token")}` },
      result:[], // 上传结果
    };
  },
  computed:{
    uploadData(){
      return { type: this.sourceType };
    }
  },
  methods:{
    beforeUpload(file){
      this.uploadStatus = false;
      return true;
    },
    onSuccess(response, file, fileList){
      if(response.status_code === 200){
        this.uploadStatus = true;
      this.result = response.data;
      this.$emit('next');
      }else{
        this.$message.error('上传错误：'+response.message);
      }
      
    },
    onError(err, file, fileList){
      this.$message.error('上传错误：'+err);
    },
    onRemove(){
      this.uploadStatus = false;
    },
    onExceed(){
      this.$message.error('只能上传一个文件，请先删除旧文件再上传');
    },
    confirm(){
      return new Promise((resolve, reject) => {
        if (this.uploadStatus) {
            resolve(this.result);
          } else {
            reject('请上传文件');
          }
      });
    }
  }
};
</script>

<style lang="scss">
.copy-upload {
  .upload-wrapper {
    margin: 20px;
    .uploader {
      text-align: center;
      .el-upload-dragger {
        width: 640px;
      }
    }
  }
}
</style>

