import OSS from '../../static/js/aliyun_upload/aliyun-oss-sdk-5.2.0.min'
window.OSS = OSS;
import '../../static/js/aliyun_upload/aliyun-upload-sdk-1.4.0.min'

const videoUploader = ({
  UploadAddress,
  UploadAuth,
  VideoId,
  onUploadFailed,
  onUploadSucceed,
  onUploadProgress,
  onUploadTokenExpired,
onUploadstarted}) => {

  return new AliyunUpload.Vod({
    //参数
    UploadAddress,
    UploadAuth,
    VideoId,
    // 文件上传失败
    onUploadFailed,
    // 文件上传完成
    onUploadSucceed,
    // 文件上传进度
    onUploadProgress,
    // 开始上传
    onUploadstarted,
    // 上传凭证超时
    onUploadTokenExpired,
    // 上传结束
    onUploadEnd: function(uploadInfo){
        console.log("onUploadEnd: uploaded all the files");
    },

  })
};

export default videoUploader;