<template>

  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="form" label-width="100px" :model="form" :rules="rules" v-if="global.param.versions">
        <el-form-item label="平台类型" prop="platform">
          <!-- <el-radio-group style="margin-top:10px" v-if="global.param.versions"
                          v-model="form.platform">
            <el-radio v-for="(v,k) in global.param.versions.platform" :key="k" :label="k" :value="k" >{{v}}</el-radio>
          </el-radio-group> -->
          <el-select class="filter-item" v-model="form.platform" placeholder="请选择版本平台">
            <el-option v-for="(k,v) in global.param.versions.platform" :key="v" :label="k" :value="v"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="应用" prop="project">
          <el-select class="filter-item" v-model="form.project" placeholder="请选择应用">
            <el-option v-for="(k,v) in global.param.versions.project" :key="v" :label="k" :value="v"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="版本号" prop="version">
          <el-input type="text" v-model="form.version" clearable style="width:195px"></el-input>
        </el-form-item>

        <el-form-item label="版本类别">
          <el-radio v-model="form.type" label="test">测试版</el-radio>
          <el-radio v-model="form.type" label="stable">稳定版</el-radio>
        </el-form-item>

        <!-- <el-form-item label="强制升级" prop="requirement">
          <el-switch v-model="form.requirement"></el-switch>
        </el-form-item> -->

        <el-form-item label="版本资源" prop="url">
          <el-upload :limit="1" class="upload-demo" :action="upload.upload_url" :headers="upload.myHeaders" :data="upload.upLoadData" :on-success="handleSuccess" :on-exceed="handleUploadExceed" :file-list="resource">
            <el-button size="small" type="primary">任务资源</el-button>
          </el-upload>
          <el-input type="explain" v-model="form.url"></el-input>
        </el-form-item>

        <el-form-item label="版本内容" prop="content">
          <div><textarea v-model="form.content" id="" cols="100" rows="10"></textarea></div>
          <!--<div><tinymce style="margin-left:68px; margin-right:5px" :height=400 v-model="form.content" ></tinymce></div>-->
        </el-form-item>

        <hr />

        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import Tinymce from "@/components/Tinymce";
import { addVersions, globalUploadUrl } from "../../api/api";
// import audioLyric from "../../components/audio_lyric";

export default {
  // 引入的组件列表
  components: {
    // audioLyric,
    // Tinymce
  },
  data() {
    return {
      upload: {
        upload_url: globalUploadUrl,
        // 上传
        // token
        myHeaders: {
          Authorization: `Bearer ${lockr.get("auth_token")}`
        },
        upLoadData: {
          source: "versions"
        }
      },
      form: {
        platform: this.$route.query.platform,
        project: this.$route.query.project,
        // api_version: "",
        // current: "",
        // force: "",
        version: "",
        // number: "",
        requirement: false,
        url: "",
        content: "",
        type: "stable"
      },
      rules: {
        platform: [
          { required: true, message: "请选择平台类型", trigger: "change" }
        ],
        project: [
          { required: true, message: "请选择应用", trigger: "change" }
        ],
        version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        url: [
          {
            type: "url",
            required: true,
            message: "请上传任务资源或手动填写",
            trigger: "change"
          }
        ],
        content: [
          { required: true, message: "请输入版本内容", trigger: "blur" }
        ]
      },
      resource: []
    };
  },
  // 计算属性
  computed: {
    ...mapState({
      global: "global"
    })
  },
  methods: {
    handleSuccess(res, file) {
      this.form.url = res.data.resources_path;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false;
        }
        const form = this.form;
        if (form.platform === "ANDROID" && !form.url) {
          this.$message.error("安卓平台需要上传任务资源");
          return false;
        }
        addVersions(form).then(res => {
          this.$alert("版本新增成功!", "成功", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.replace({ name: "versionsIndex" });
            }
          });
        });
      });
    },
    onCancel(){
      this.$router.replace({ name: "versionsIndex" });
    },
    handleUploadExceed(){
      this.$message.error('请先删除旧文件后再上传');
    }
  }
};
</script>

