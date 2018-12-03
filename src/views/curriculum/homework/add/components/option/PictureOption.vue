<template>
  <div class="task-option">
    <i class="el-icon-circle-close task-option-close" @click.stop="remove"></i>
    <el-card class="task-option-picture" :body-style="{ padding: '5px',textAlign:'center',position:'relative' }">

      <MyUploader class="task-option-picture-uploader" :show-file-list="false" :data="updalodData" accept=".png,.jpg" :before-upload="onUploadBefore" :on-success="onUploadSuccess" :on-progress="onUploadProgress">
        <template v-if="uploadStatus === ''">
          <img v-if="value.url" :src="value.url" class="picture">
          <i v-else class="el-icon-plus picture-uploader-icon"></i>
        </template>
        <template v-else>
          <img v-if="uploadStatus==='success'" :src="previewUrl" class="picture">
          <el-progress v-else type="circle" :percentage="percentage"></el-progress>
        </template>
      </MyUploader>

      <el-checkbox class="task-option-picture-checkbox" :label="myOption.url" :checked="myOption.checked" @change="checkboxChange">
        <span class="task-option-alpha">{{alpha}}</span>
      </el-checkbox>
      <el-alert v-show="error" :title="error" type="error" show-icon :closable="false"></el-alert>
    </el-card>
  </div>
</template>

<script>
import MyUploader from "@/components/MyUploader/Index.vue";
export default {
  components: {
    MyUploader
  },
  props: {
    value: Object,
    // 选项字母: A,B,C,D
    alpha: String
  },
  data() {
    return {
      updalodData: { source: "jobs" },
      myOption: {
        url: "", // http://ww2.sinaimg.cn/mw690/703be3b1jw1evmwm4pdhfj207s05udg0.jpg
        remove: false
      },
      previewUrl: "", // 存放 base64 用来预览的地址
      uploadStatus: "",
      percentage: 0,
      error: ""
    };
  },
  created() {
    this.initMyOption(this.value);
  },
  methods: {
    initMyOption(newValue) {
      this.myOption = Object.assign({}, this.myOption, newValue);
    },
    getNewValue() {
      return Object.assign({ alpha: this.alpha }, this.value, this.myOption);
    },
    emitChange() {
      this.$emit("emitChange", this.getNewValue());
    },
    remove() {
      this.myOption.remove = true;
      this.emitChange();
    },

    checkboxChange() {
      if (!this.myOption.url) {
        this.error = "请上传图片";
      }
    },
    onUploadBefore(file) {
      this.myOption.url = "";
      this.uploadStatus = "uploading";
      this.error = "";
      return true;
    },
    onUploadProgress(file) {
      this.percentage = file.percentage;
    },
    onUploadSuccess(response, file, fileList) {
      // response.data.resources_path 是真实的图片 http 地址，但是它有延迟生成（图片上传成功后过几秒才能访问到这个地址）
      // 所以这里预览使用 base64 地址吧
      this.myOption.url = response.data.resources_path;
      this.previewUrl = file.url;
      this.uploadStatus = "success";
      this.error = "";
      this.emitChange();
    },
    onUploadRemove() {
      this.myOption.url = "";
      this.uploadStatus = "";
      this.previewUrl = "";
      this.emitChange();
    },
    onUploadError() {
      this.myOption.url = "";
      this.uploadStatus = "";
      this.previewUrl = "";
      this.emitChange();
    }
  }
};
</script>

<style lang="scss" scoped>
$uploaderWidth: 180px;
.task-option {
  position: relative;
  .task-option-close {
    width: 20px;
    height: 20px;
    font-size: 20px;
    position: absolute;
    top: 5px;
    right: 5px;
    color: #909399;
    cursor: pointer;
    z-index: 999;
    &:hover {
      color: #f56c6c;
    }
  }
}
.task-option-picture {
  margin: 10px;
  .task-option-close {
    width: 20px;
    height: 20px;
    font-size: 20px;
    position: absolute;
    top: 5px;
    right: 5px;
    color: #909399;
    cursor: pointer;
    z-index: 999;
    &:hover {
      color: #f56c6c;
    }
  }
  .task-option-picture-uploader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: $uploaderWidth;
    height: $uploaderWidth;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
    .picture {
      width: $uploaderWidth;
      height: $uploaderWidth;
    }
    .picture-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: $uploaderWidth;
      height: $uploaderWidth;
      line-height: $uploaderWidth;
    }
  }
  .task-option-picture-checkbox {
    margin: 10px 0;
  }
}
</style>
