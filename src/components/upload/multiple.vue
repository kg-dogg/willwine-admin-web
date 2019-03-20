<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :headers="headers"
      :data="data"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      :file-list="imageList"
      list-type="picture"
      multiple
      accept='image/*'
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import { fileUpload } from "../../api";
export default {
  name: "multiple-uploader",
  props: {
    data: {
      type: Object,
      default() {
        return { dir: '' };
      }
    },
    editImageList: {
      type: Array,
      default() {
        return [];
      }
    },
    onSuccess: {
      type: Function,
      default() {
        return true;
      }
    },
  },
  computed: {
    headers() {
      return { Authorization: `Bearer ${lockr.get('auth_token')}` };
    },
  },
  data() {
    return {
      imageList: [],
      uploadUrl: fileUpload.globalUploadUrl,
    }
  },
  watch: {
    editImageList: {
      handler(val) {
        this.imageList = val.length ? val : [];
        console.log('watch imageList', this.imageList);
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.imageList = fileList;
      this.onSuccess(this.imageList);
    },
    handleUploadSuccess(res, file, fileList) {
      this.imageList = fileList;
      this.onSuccess(this.imageList);
    },
  }
}
</script>