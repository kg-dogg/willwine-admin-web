<template>
  <div>
    <el-upload class="editor-slide-upload" :action="upload_url" :multiple="true" :file-list="fileList" :headers="myHeaders" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove" :data="upLoadData" :on-success="handleSuccess" :before-upload="beforeUpload" :on-error="handleError" :accept='allowExtention'>
      <slot name="button"></slot>
    </el-upload>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload class="editor-slide-upload" :action="upload_url" :multiple="true" :file-list="fileList" :headers="myHeaders" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove" :data="upLoadData" :on-success="handleSuccess" :before-upload="beforeUpload" :on-error="handleError" :accept='allowExtention'>
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button style="margin-top: 10px" @click="dialogVisible = false">取 消</el-button>
      <el-button style="margin-top: 10px" type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>
<script>
import videoUploader from "@/services/videoUpload";
import {
  globalUploadUrl,
  uploadVideo,
  uploadVideoSuccessNotice
} from "@/api/api";
export default {
  props:['uploadLimit', 'multiple', ],
  data() {
    return {
      uploadLimit: 1,
      upload_url: globalUploadUrl,
      myHeaders: { Authorization: `Bearer ${lockr.get("auth_token")}` },
      resource_id: "",
      userData: JSON.stringify({
        Vod: { UserData: { IsShowWaterMark: false, Priority: 1 } }
      }),
      file: null,
      uploader: null,
      UploadAuth: null,
      iconClass: "",
      upLoad: null,
      percent: "",
      showPercent: false,
      updateSuccess: false,
      fileList: [],
      resource_path: "",
      file_name: "",
      isUploading: false,
      resourceDuration: 0,
      capture: '', // 视频封面
      ratio: '', // 视频封面宽高比
    };
  },
}
  
</script>
