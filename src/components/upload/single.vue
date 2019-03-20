<template>
  <div>
    <el-upload
      :class="{disabled: uploadDisabled}"
      :file-list="imageList"
      list-type="picture-card"
      :action="uploadUrl"
      :headers="headers"
      :data="data"
      :limit="1"
      accept='image/*'
      :on-preview="handlePictureCardPreview"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script>
import { fileUpload } from "../../api";
export default {
  name: "single-uploader",
  props: {
    data: {
      type: Object,
      default() {
        return { dir: '' };
      }
    },
    editImage: {
      type: Object,
      default() {
        return {};
      }
    },
    onSuccess: {
      type: Function,
      default() {
        return true;
      }
    },
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      imageList: [],
      uploadUrl: fileUpload.globalUploadUrl,
    }
  },
  computed: {
    headers() {
      return { Authorization: `Bearer ${lockr.get('auth_token')}` };
    },
    uploadDisabled() {
      return this.imageList.length > 0;
    },
  },
  watch: {
    editImage: {
      handler(val) {
        this.imageList = val.url ? [val] : [];
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.imageList.pop();
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleUploadSuccess(res, file) {
      this.imageList.push({
        name: file.name,
        // file,
        // id: res.result.data,
        url: res.result.data,
        // uid: file.uid
      });
      this.onSuccess(this.imageList[0]);
    },
  }
}
</script>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
