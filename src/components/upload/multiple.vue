<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :headers="headers"
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
import { globalUploadUrl } from "../../api/api";
export default {
  name: "multiple-uploader",
  computed: {
    headers() {
      return { Authorization: `Bearer ${lockr.get('auth_token')}` };
    },
  },
  data() {
    return {
      imageList: [],
      uploadUrl: globalUploadUrl,
      fileDataList: [],
    }
  },
  methods: {
    handleRemove(file, fileList) {
      const removeIndex = this.fileDataList.indexOf(file.response.result.data);
      this.fileDataList.splice(removeIndex, 1);
    },
    handleUploadSuccess(res, file) {
      this.fileDataList.push(res.result.data);
    },
  }
}
</script>