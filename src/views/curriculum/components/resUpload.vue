<template>
  <el-form-item label-width='0' class='uploadComponent'>
    <el-upload ref='upload' :limit="uploadLimit" class="upload-demo" :action="upload_url" :headers="myHeaders" :data="upLoadData" :on-preview="(file)=>{ return resourcePreview({file}) }" :on-success="(res, file) => { return uploadResource({res, file}) }" :on-remove="(file,fileList)=>{ return uploadRemoveResource({file,fileList}); }" :file-list="fileList" :before-upload="beforeUpload" :accept='allowExtention'>
      <el-button size="small" type="primary">上传资源</el-button>
    </el-upload>
    <div class='video-label' v-if="isVideo && resource_id" @mouseover='fileMouseover' @mouseout="fileMouseout">
      {{item.file_name}} &nbsp;&nbsp;
      <i v-if='updateSuccess' :class='iconClass' @click='deleteVideo'></i>
      <i v-else class='el-icon-close' @click='cancelVideo'></i>
      <div class='percent-bg' v-if='showPercent'>
        <div class='percent-bar' :style='{width: percent}'>
        </div>
        <span>{{percent}}</span>
      </div>
    </div>
    <el-col :span="21">
      <el-input class='audioLyric' v-if="attachment_flag" type="textarea" :rows="7" placeholder="请输入音频歌词" v-model="item.attachment"></el-input>
    </el-col>
    <el-col :span="21">
      <audioLyric :audiosync="item" v-if="item.audioLyric"></audioLyric>
    </el-col>
  </el-form-item>
</template>
<script>
import {
  globalUploadUrl,
  uploadVideo,
  uploadVideoSuccessNotice
} from "@/api/api";
import { mapState } from "vuex";
import audioLyric from "@/components/audio_lyric";
import videoUploader from "@/services/videoUpload";
export default {
  props: ["item", "source"],
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
      file_type: "",
      file_name: "",
      isUploading: false,
      resourceDuration: 0,
      capture: "", // 视频封面
      ratio: "", // 视频封面宽高比
      fileType: {
        VIDEO: "video",
        AUDIO: "audio",
        IMAGE: "image"
      }
    };
  },
  computed: {
    ...mapState(["global"]),
    upLoadData() {
      return { source: this.source, duration: this.resourceDuration };
    },
    attachment_flag() {
      return this.file_type === this.fileType.AUDIO;
    },
    allowExtention() {
      return this.global.type.allow_extension;
    },
    videoTypes() {
      return this.global.type.allow_video.split(",");
    },
    audioTypes() {
      return this.global.type.allow_audio.split(",");
    },
    isVideo() {
      return this.file_type === this.fileType.VIDEO;
    },
    videoUploadData() {
      return {
        source: this.source,
        duration: this.resourceDuration,
        aspect_ratio: this.ratio,
        cover_file: this.capture
      };
    }
  },
  created() {
    this.initFile();
  },
  beforeDestroy() {
    if (this.isUploading) {
      console.log("cancel!!!");
      this.$refs.upload.abort(this.fileList[0]);
    }
  },
  methods: {
    initFile() {
      if (!this.item.file_name) return;
      this.file_name = this.item.file_name;
      this.file_type = this.item.file_type;
      this.resource_id = this.item.resource_id;
      if (this.file_type === this.fileType.VIDEO) {
        this.updateSuccess = true;
        this.iconClass = "el-icon-upload-success el-icon-circle-check";
        return;
      }
      this.fileList.push({
        url: this.item.resource_path || "",
        id: this.item.resource_id || "",
        name: this.item.file_name || ""
      });
    },
    // 任务资源上传回调
    uploadResource({ res, file }) {
      this.isUploading = false;
      const upRes = {
        name: file.name,
        file,
        id: res.data.resources_id,
        url: res.data.resources_path,
        uid: file.uid
      };
      this.fileList.push(upRes);
      this.file_name = file.name;
      this.item.file_name = file.name;
      this.item.resource_id = res.data.resources_id;
      this.resource_id = res.data.resources_id;
    },
    uploadRemoveResource({ file, fileList }) {
      // const { raw: { type } } = file;
      const uid = file.uid;
      this.file_type === this.fileType.VIDEO ? (this.file = file.raw) : null;
      this.fileList.forEach((v, k) => {
        if (v.uid === uid) {
          this.fileList.splice(k, 1);
          this.file_name = "";
          this.item.resource_id = "";
          this.file_type = "";
          this.item.attachment = "";
          this.resource_id = "";
        }
      });
    },

    judgeType(name, tp) {
      if (!name) return false;
      const type = `.${name.split(".")[1].toLowerCase()}`;
      const typeList = tp === "video" ? this.videoTypes : this.audioTypes;
      return typeList.some(item => item === type);
    },
    // 预览或播放弹出回调
    resourcePreview(file) {
      this.item.audioLyric = false;
      if (this.judgeType(this.file_name)) {
        this.item.audioLyric = !this.item.audioLyric;
      }
    },
    beforeUpload(file) {
      this.file_type = file.type.split("/")[0];
      if (!this.item.resource_id) {
        // 音频上传设置音频时长
        if (file.type.split("/")[0] === this.fileType.AUDIO) {
          return new Promise((resolve, reject) => {
            const objectUrl = URL.createObjectURL(file);
            const audio = new Audio();
            audio.src = objectUrl;
            audio.addEventListener("durationchange", () => {
              this.resourceDuration = audio.duration;
              resolve(true);
            });
          });
        }

        if (file.type.split("/")[0] !== this.fileType.VIDEO) {
          this.isUploading = true;
          return true;
        }

        const objectUrl = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.preload = "none";
        video.src = objectUrl;
        video.addEventListener("canplay", () => {
          this.resourceDuration = video.duration;
          this.captureImage(video);
          this.uploadVideo(file);
        });
      }
      return false;
    },
    uploadVideo(file) {
      uploadVideo({
        title: file.name,
        file_name: file.name,
        ...this.videoUploadData
      }).then(res => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.upLoad = res.data;
        if (!this.uploader) {
          const {
            onUploadSucceed,
            onUploadFailed,
            onUploadProgress,
            onUploadstarted,
            onUploadTokenExpired
          } = this;
          this.uploader = videoUploader({
            ...res.data,
            onUploadSucceed,
            onUploadFailed,
            onUploadProgress,
            onUploadstarted,
            onUploadTokenExpired
          });
        }
        this.uploader.addFile(
          this.file,
          null,
          null,
          null,
          this.userData
          // JSON.stringify({
          //   Vod: {}
          // })
        );
        this.uploader.startUpload();
        this.item.file_name = file.name;
        this.file_name = file.name;
        this.resource_id = res.data.resource_id;
        this.item.file_name = file.name;
        this.item.resource_id = res.data.resource_id;
      });
    },
    onUploadSucceed(uploadInfo) {
      this.iconClass = "el-icon-upload-success el-icon-circle-check";
      this.percent = "";
      this.showPercent = false;
      this.updateSuccess = true;
    },
    onUploadFailed(uploadInfo, code, message) {
      console.log("failed", code, message);
      this.deleteVideo();
    },
    onUploadstarted(uploadInfo) {
      this.showPercent = true;
      const {
        StsRole,
        UploadAddressBase64,
        UploadAuthBase64,
        VideoId,
        cover_url,
        resource_id,
        video_url
      } = this.upLoad;
      // https://help.aliyun.com/document_detail/52204.html?spm=a2c4g.11186623.6.798.151c16ccXXYSK4
      // 优先使用 STS 上传
      if (StsRole && StsRole.securityToken) {
        const { accessKeyId, accessKeySecret, securityToken } = StsRole;
        this.uploader.setSTSToken(
          uploadInfo,
          accessKeyId,
          accessKeySecret,
          securityToken
        );
      } else {
        if (!uploadInfo.videoId) {
          //这个文件没有上传异常
          //获取上传凭证后，调用setUploadAuthAndAddress
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            UploadAuthBase64,
            UploadAddressBase64,
            uploadInfo.videoId
          );
        } else {
          //如果videoId有值，根据videoId刷新上传凭证
          //获取上传凭证后，调用setUploadAuthAndAddress
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            UploadAuthBase64,
            UploadAddressBase64
          );
        }
      }
      this.updateSuccess = false;
    },
    onUploadProgress(uploadInfo, totalSize, loadedPercent) {
      this.percent = Math.ceil(loadedPercent * 100) + "%";
    },
    onUploadTokenExpired() {
      console.log("expired");
    },
    fileMouseover() {
      this.iconClass ? (this.iconClass = "el-icon-close") : "";
    },
    fileMouseout() {
      this.iconClass
        ? (this.iconClass = "el-icon-upload-success el-icon-circle-check")
        : "";
    },
    deleteVideo() {
      // this.isVideo = false;
      this.item.file_name = "";
      this.file_name = "";
      this.item.resource_id = "";
      this.resource_id = "";
      this.iconClass = "";
    },
    cancelVideo() {
      console.log("canceled");
      this.uploader.cancelFile(0);
      this.uploader.cleanList();
      this.deleteVideo();
    },
    captureImage(video) {
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

      this.ratio = canvas.width / canvas.height;
      this.capture = canvas.toDataURL("image/jpeg");
    }
  }
};
</script>
<style scoped>
.el-icon-upload-success {
  color: #67c23a;
}
.el-icon-close {
  cursor: pointer;
}
.percent-bg {
  display: inline-block;
  width: 100%;
  background: #eee;
  height: 2px;
  position: relative;
  top: -15px;
}
.percent-bar {
  background: #409eff;
  height: 2px;
  width: 0;
}
.percent-bg span {
  position: absolute;
  right: -39px;
  top: -16px;
}
.video-label {
  display: inline-block;
}
</style>
<style>
.uploadComponent .el-upload-list__item {
  display: inline-block;
  width: auto;
}
</style>


