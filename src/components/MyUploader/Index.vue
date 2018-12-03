<template>
  <div class="my-uploader">
    <el-upload ref='upload' :action="action" :multiple="multiple" :data="data" :accept="allowExtention" :before-upload="handleBeforeUpload" :on-remove="handleRemove" :http-request="onHttpRequest" :file-list="myFileList" :on-change="handleFileChange" :list-type="listType" :showFileList="showFileList">
      <slot>
        <el-button size="small" type="primary">点击上传</el-button>
      </slot>
    </el-upload>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { globalUploadUrl, globalViewUrl, uploadVideoSTS } from "@/api/api";
import videoUploader from "@/services/videoUpload";

export default {
  name: "my-uploader",
  props: {
    action: {
      type: String,
      default() {
        return globalUploadUrl;
      }
    },
    name: {
      type: String,
      default: "file"
    },
    multiple: {
      type: Boolean,
      default() {
        return false;
      }
    },
    data: {
      type: Object,
      default() {
        // 我们服务端接口的source参数
        return { source: "editor" };
      }
    },
    drag: {
      type: Boolean,
      default() {
        return false;
      }
    },
    accept: String,
    limit: Number,
    onChange: {
      type: Function,
      default() {
        return true;
      }
    },
    beforeUpload: {
      type: Function,
      default() {
        return true;
      }
    },
    onProgress: {
      type: Function,
      default() {
        return true;
      }
    },
    onSuccess: {
      type: Function,
      default() {
        return true;
      }
    },
    onError: {
      type: Function,
      default() {
        return true;
      }
    },
    listType: {
      type: String,
      default() {
        return "text";
      }
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    showFileList: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      //{uid:'',name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg',status:'uploading | success',percentage:0-100}
      myFileList: [],
      // 阿里云上传凭证信息
      aliyunUploadData: null,
      // 阿里云上传实例
      aliyunUploader: null
    };
  },
  computed: {
    ...mapState(["global"]),
    allowExtention() {
      return this.accept || this.global.type.allow_extension;
    }
  },
  watch: {
    fileList(val) {
      this.myFileList = val.map(item => {
        item.uid = item.uid;
        item.status = item.status || "success";
        return item;
      });
    }
  },
  beforeDestroy() {
    // 取消所有上传
    this.myFileList.forEach(file => {
      this.$refs.upload.abort(file);
    });
    if (this.aliyunUploader) {
      this.aliyunUploader.listFiles().forEach((element, index) => {
        this.aliyunUploader.cancelFile(index);
        this.aliyunUploader.deleteFile(index);
      });
    }
  },
  methods: {
    handleFileChange(file, fileList) {
      // this.myFileList = fileList;
      this.onChange(file, fileList);
    },
    handleBeforeUpload(rawFile) {
      // const before = this.beforeUpload(rawFile);
      // if (before && before.then) {
      //   return before;
      // } else if (before !== false) {
      //   return true;
      // }
      // return false;
      rawFile.status = "uploading";
      rawFile.percentage = 0;
      this.myFileList.push(rawFile);
      return this.beforeUpload(rawFile);
    },
    handleProgress(event, file) {
      this.$forceUpdate();
      this.onProgress(file);
    },
    handleSuccess(response, file) {
      if (!file.url) {
        file.url = window.URL.createObjectURL(file);
      }
      file.percentage = 100;
      file.status = "success";
      this.$forceUpdate();
      this.onSuccess(response, file, this.myFileList);
    },
    handleRemove(file) {
      // 同步删除 myFileList
      let targetIndex = this.myFileList.findIndex(
        item => item.uid === file.uid
      );
      if (targetIndex > -1) {
        this.myFileList.splice(targetIndex, 1);
      }
      // 同步删除 aliyun uploadList
      if (this.aliyunUploader) {
        this.aliyunUploader.listFiles().forEach((element, index) => {
          if (element.file.uid === file.uid) {
            this.aliyunUploader.cancelFile(index);
            this.aliyunUploader.deleteFile(index);
          }
        });
      }
    },
    handleError(errMessage) {
      this.$message.error(errMessage);
    },
    onHttpRequest({ file }) {
      if (file.type.indexOf("video") > -1) {
        return this.videoHttpUpload(file);
      } else {
        return this.defaultHttpUpload(file);
      }
    },
    defaultHttpUpload(file) {
      const formData = new FormData();

      if (this.data) {
        Object.keys(this.data).forEach(key => {
          formData.append(key, this.data[key]);
        });
      }

      formData.append(this.name, file, file.name);

      axios
        .post(this.action, formData, {
          onUploadProgress: e => {
            file.percentage = (e.loaded / e.total) * 100;
            this.handleProgress(e, file);
          }
        })
        .then(res => {
          this.handleSuccess(res.data, file);
        })
        .catch(err => {
          this.handleError(err);
        });
    },
    // 将视频传到阿里云
    videoHttpUpload(file) {
      const objectUrl = window.URL.createObjectURL(file);

      const video = document.createElement("video");
      video.src = objectUrl;
      video.addEventListener("canplay", () => {
        file.duration = video.duration; // 视频时长
        const posterData = this.getVideoPoster(video);
        file.ratio = posterData.ratio; // 宽高比
        file.cover_file = posterData.url; // 封面图片 dataUrl
        file.url = posterData.url; // 上传预览图片
        this.uploadVideoToAliyun(file);
      });
    },
    getVideoPoster(video) {
      // 图片原始尺寸
      const originWidth = video.videoWidth;
      const originHeight = video.videoHeight;
      // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
      const maxWidth = 400;
      const maxHeight = 400;
      // 目标尺寸
      let targetWidth = originWidth;
      let targetHeight = originHeight;
      // 图片尺寸超过 max 的限制
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      let context = canvas.getContext("2d");
      // 清除画布
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 图片压缩
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const ratio = canvas.width / canvas.height;
      // jpg 比 png 小很多
      const url = canvas.toDataURL("image/jpeg");
      return { ratio, url };
    },
    // 阿里云上传
    uploadVideoToAliyun(file) {
      // if (this.aliyunUploader) {
      //   this.startAliyunUpload(file);
      //   return true;
      // }
      uploadVideoSTS({
        title: file.name,
        file_name: file.name,
        source: this.data.source,
        duration: file.duration,
        cover_file: file.cover_file, // 视频封面 dataUrl
        aspect_ratio: file.ratio // 视频封面宽高比
      }).then(res => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.aliyunUploadData = res.data;
        if (!this.aliyunUploader) {
          this.aliyunUploader = videoUploader({
            ...res.data,
            onUploadstarted: this.onUploadstarted,
            onUploadProgress: this.onUploadProgress,
            onUploadSucceed: this.onUploadSucceed,
            onUploadFailed: this.onUploadFailed,
            onUploadTokenExpired: this.onUploadTokenExpired
          });
        }
        // file.url = res.data.cdn_prefix; // 先记录阿里云视频地址的前缀
        // file.cover_url = res.data.cover_url; // 封面图片 http url
        this.startAliyunUpload(file);
      });
    },
    startAliyunUpload(file) {
      this.aliyunUploader.addFile(
        file,
        null,
        null,
        null,
        JSON.stringify({
          Vod: {}
        })
      );
      this.aliyunUploader.startUpload();
    },
    onUploadstarted(uploadInfo) {
      const {
        AccessKeyId, // STS 凭证
        AccessKeySecret,
        SecurityToken,
        cdn_prefix // cdn 地址
      } = this.aliyunUploadData;
      // https://help.aliyun.com/document_detail/52204.html?spm=a2c4g.11186623.6.798.151c16ccXXYSK4
      // 优先使用 STS 上传
      if (SecurityToken) {
        this.aliyunUploader.setSTSToken(
          uploadInfo,
          AccessKeyId,
          AccessKeySecret,
          SecurityToken
        );
      } else {
        this.$message.error("视频上传STS凭证获取异常");
        return false;
      }
    },
    onUploadProgress(uploadInfo, totalSize, loadedPercent) {
      let progress = Math.ceil(loadedPercent * 100);
      uploadInfo.file.percentage = progress;
      this.handleProgress(null, uploadInfo.file);
    },
    onUploadSucceed(uploadInfo) {
      uploadInfo.file.videoId = uploadInfo.videoId;
      let mockResponse = {
        data: {
          resources_path: `${uploadInfo.file.url}/${uploadInfo.object}`
        }
      };
      this.handleSuccess(mockResponse, uploadInfo.file);
    },
    onUploadFailed(uploadInfo, code, message) {
      // this.$message.error(message);
      this.handleError(message);
    },
    onUploadTokenExpired() {
      this.$message.error("上传凭证已过期，请刷新页面重试");
    }
  }
};
</script>

