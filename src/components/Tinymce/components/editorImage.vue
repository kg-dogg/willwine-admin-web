<template>
  <div class="upload-container editorImage">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传本地图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload
        class="editor-slide-upload"
        :action="upload_url"
        :multiple="true"
        :file-list="fileList"
        :headers="myHeaders"
        :show-file-list="true"
        list-type="picture-card"
        :on-remove="handleRemove"
        :data="upLoadData"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :on-error="handleError"
        accept='image/*'
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button style="margin-top: 10px" @click="dialogVisible = false">取 消</el-button>
      <el-button style="margin-top: 10px" type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import {
  globalUploadUrl,
  globalViewUrl,
  uploadVideo,
  uploadVideoSTS
} from "../../../api/api";
import videoUploader from "@/services/videoUpload";

export default {
  name: "editorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#1890ff"
    },
    allowExtention: {
      type: String
    }
  },
  computed: {
    // 上传地址:
    upload_url() {
      return globalUploadUrl;
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      myHeaders: {
        Authorization: `Bearer ${lockr.get("auth_token")}`
      },
      upLoadData: {
        source: "editor",
        duration: 0,
        cover_file: "", // 视频封面
        aspect_ratio: "" // 视频封面宽高比
      },
      // 阿里云上传凭证信息
      aliyunUploadData: null,
      // 阿里云上传实例
      aliyunUploader: null
    };
  },
  beforeDestroy() {
    // 清理阿里云上传文件列表
    if (this.aliyunUploader) {
      this.aliyunUploader.cleanList();
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(
        item => this.listObj[item].hasSuccess
      );
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
      if (!this.checkAllSuccess()) {
        this.$message(
          "请等待所有资源上传成功 或 出现了网络问题，请刷新页面重新上传！"
        );
        return;
      }
      this.$emit("successCBK", arr);
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },
    handleSuccess(response, file) {
      const uid = file.uid;
      this.listObj[uid].url = response.result.data;
      this.listObj[uid].hasSuccess = true;
      if (file.cover_url) {
        this.listObj[uid].cover_url = file.cover_url;
      }
      if (file.videoId) {
        this.listObj[uid].videoId = file.videoId;
      }
    },
    handleRemove(file) {
      const uid = file.uid;
      const url = file.response && file.response.result.data;
      const objKeyArr = Object.keys(this.listObj);

      // 同步删除 fileList
      let targetIndex = this.fileList.findIndex(item => item.uid === uid);
      this.fileList.splice(targetIndex, 1);
      // 同步删除 aliyun uploadList
      if (this.aliyunUploader) {
        this.aliyunUploader.listFiles().forEach((element, index) => {
          if (element.file.uid === uid) {
            this.aliyunUploader.cancelFile(index);
            this.aliyunUploader.deleteFile(index);
          }
        });
      }

      for (let i = 0, len = objKeyArr.length; i < len; i += 1) {
        if (
          this.listObj[objKeyArr[i]].uid === uid ||
          this.listObj[objKeyArr[i]].url === url
        ) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
    beforeUpload(file) {
      const self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.listObj[fileName] = {
        uid: file.uid // 上传的非图片文件不执行下方的 onload 事件，这行代码确保 listObj 中的每一个对象都有 uid 属性
      };

      let fileListItem = {
        uid: file.uid,
        status: "uploading",
        name: file.name,
        size: file.size,
        percentage: 0,
        raw: file,
        url: ""
      };
      return new Promise((resolve, reject) => {
        const objectUrl = _URL.createObjectURL(file);
        if (file.type.indexOf("audio") === 0) {
          const audio = new Audio();
          audio.src = objectUrl;
          audio.addEventListener("durationchange", function() {
            file.duration = audio.duration;
            resolve(true);
          });
          fileListItem.url = globalViewUrl + "/static/images/audio-paused.png";
          this.fileList.push(fileListItem);
        } else if (file.type.indexOf("image") === 0) {
          fileListItem.url = objectUrl;
          this.fileList.push(fileListItem);
          // const img = new Image();
          // img.src = objectUrl;

          // img.onload = function() {
          //   self.listObj[fileName] = {
          //     hasSuccess: false,
          //     uid: file.uid,
          //     width: this.width,
          //     height: this.height
          //   };
          // };

          resolve(true);
        } else if (file.type.indexOf("video" === 0)) {
          // 将视频传到阿里云
          const video = document.createElement("video");
          video.src = objectUrl;
          video.addEventListener("canplay", () => {
            // this.upLoadData.duration = video.duration;
            file.duration = video.duration;
            this.captureImage(video, file);
            this.uploadVideoToAliyun(file);
            return false;
          });
          this.fileList.push(fileListItem);
        } else {
          resolve(true);
        }
      });
    },
    handleError(err, file, fileList) {
      delete this.listObj[file.uid];
    },
    // 阿里云上传
    uploadVideoToAliyun(file) {
      uploadVideoSTS({
        title: file.name,
        file_name: file.name,
        source: this.upLoadData.source,
        duration: file.duration,
        cover_file: file.cover_file, // 视频封面
        aspect_ratio: file.ratio // 视频封面宽高比
      }).then(res => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.aliyunUploadData = res.data;
        if (!this.aliyunUploader) {
          const {
            onUploadstarted,
            onUploadProgress,
            onUploadSucceed,
            onUploadFailed,
            onUploadTokenExpired
          } = this;
          this.aliyunUploader = videoUploader({
            ...res.data,
            onUploadstarted,
            onUploadProgress,
            onUploadSucceed,
            onUploadFailed,
            onUploadTokenExpired
          });
        }
        file.url = res.data.cdn_prefix; // 先记录阿里云视频地址的前缀
        file.cover_url = res.data.cover_url; // 封面图片 http url
        // 两种方式 userData 不一样
        // if (方式1) {
        //         userData = '{"Vod":{"StorageLocation":"","UserData":{"IsShowWaterMark":"false","Priority":"7"}}}';
        //     } else {
        //         userData = '{"Vod":{"StorageLocation":"","Title":"this is title.我是标题","Description":"this is desc.我是描述","CateId":"19","Tags":"tag1,tag2,标签3"}}';
        //     }
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
      });
    },
    onUploadstarted(uploadInfo) {
      const {
        AccessKeyId, // STS 凭证
        AccessKeySecret,
        SecurityToken,
        cdn_prefix, // cdn 地址
        cover_url // 视频封面图片 http url
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
      let targetIndex = this.fileList.findIndex(
        item => item.uid === uploadInfo.file.uid
      );
      if (targetIndex > -1) {
        let file = this.fileList[targetIndex];
        file.percentage = progress;
        this.$set(this.fileList, targetIndex, file);
      }
    },
    onUploadSucceed(uploadInfo) {
      let targetIndex = this.fileList.findIndex(
        item => item.uid === uploadInfo.file.uid
      );
      if (targetIndex > -1) {
        let file = this.fileList[targetIndex];
        file.status = "success";
        file.url = uploadInfo.file.cover_file;
        file.videoId = uploadInfo.videoId;
        uploadInfo.file.videoId = uploadInfo.videoId;
        this.$set(this.fileList, targetIndex, file);

        let mockResponse = {
          result: {
            data: `${uploadInfo.file.url}/${uploadInfo.object}`
          }
        };

        this.handleSuccess(mockResponse, uploadInfo.file);
      }
    },
    onUploadFailed(uploadInfo, code, message) {
      this.$message.error(message);
    },
    onUploadTokenExpired() {},

    captureImage(video, file) {
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
      file.ratio = canvas.width / canvas.height;
      file.cover_file = canvas.toDataURL("image/jpeg");
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  .editor-slide-upload {
    margin-bottom: 20px;
  }
}
</style>
<style>
.el-upload-list--picture-card
  .el-upload-list__item.is-success:hover
  .el-upload-list__item-status-label {
  display: block;
}
.el-upload-list--picture-card
  .el-upload-list__item.is-success
  .el-upload-list__item-status-label {
  display: block;
}
</style>

