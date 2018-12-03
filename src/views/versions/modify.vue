<template>

  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="form" label-width="100px" :model="form" :rules="isReadonly ? {}:rules" v-if="global.param.versions">
        <el-form-item label="平台类型" prop="platform">
          <el-select class="filter-item" v-model="form.platform" disabled placeholder="请选择版本平台">
            <el-option v-for="(k,v) in global.param.versions.platform" :key="v" :label="k" :value="v"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="应用" prop="project">
          <el-select class="filter-item" v-model="form.project" disabled placeholder="请选择应用">
            <el-option v-for="(k,v) in global.param.versions.project" :key="v" :label="k" :value="v"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="版本号" prop="version">
          <el-input type="text" v-model="form.version" clearable style="width:195px" :disabled="isReadonly"></el-input>
        </el-form-item>

        <el-form-item label="版本类别">
          <el-radio v-model="form.type" label="test" :disabled="isReadonly">测试版</el-radio>
          <el-radio v-model="form.type" label="stable" :disabled="isReadonly">稳定版</el-radio>
        </el-form-item>

        <!-- <el-form-item label="强制升级" prop="requirement">
          <el-switch v-model="form.requirement"></el-switch>
        </el-form-item> -->

        <el-form-item label="版本资源" prop="url">
          <div v-if="isReadonly" v-html="form.url">

          </div>
          <template v-else>
            <el-upload :limit="1" class="upload-demo" :action="upload.uploadUrl" :headers="upload.myHeaders" :data="upload.upLoadData" :on-success="handleSuccess" :on-exceed="handleUploadExceed" :file-list="resource">
            <el-button size="small" type="primary">任务资源</el-button>
          </el-upload>
          <el-input type="explain" v-model="form.url"></el-input>
            </template>
           
        </el-form-item>

        <el-form-item label="版本内容" prop="content">
          <div v-if="isReadonly" v-html="form.content"></div>
          <div v-else><textarea v-model="form.content" id="" cols="100" rows="10"></textarea></div>
          
        </el-form-item>

        <hr />

        <el-form-item>
          <el-button type="primary" @click="onSubmit" v-if="!isReadonly">立即编辑</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style>
.el-table__header {
  width: 100%;
}
</style>
<script>
import { mapState } from "vuex";
import { updateVersions, getOneVersions, globalUploadUrl } from "../../api/api";

export default {
  created() {
    const id = this.$route.query.id;
    getOneVersions(id).then(res => {
      this.id = res.data.id;

      this.onForm(res.data);
    });
  },
  data() {
    return {
      upload: {
        uploadUrl: globalUploadUrl,
        // 上传
        // token
        myHeaders: {
          Authorization: `Bearer ${lockr.get("auth_token")}`
        },
        upLoadData: {
          source: "versions"
        }
      },
      id: "",
      resource: [
        
      ],
      form: {
        platform: "ANDROID",
        project:'PARENT',
        version: "",
        requirement: "",
        url: "",
        content: "",
        type: "stable"
      },
      rules: {
        platform: [
          { required: true, message: "请选择平台类型", trigger: "change" }
        ],
        project: [
          { required: true, message: "请选择客户端", trigger: "change" }
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
      }
    };
  },

  // 计算属性
  computed: {
    ...mapState({
      global: "global"
    }),
    isReadonly(){
      return this.$route.name === 'versionsCheck';
    }
  },
  methods: {
    // 添加属性
    onForm(form) {
      if(form){
        this.form = form;
      }
      
      const pathArr = form.url.split("/");

      this.resource = [{ name: pathArr[pathArr.length - 1], url: form.url }];
    },
    handleSuccess(res, file) {
      this.form.url = res.data.resources_path;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false;
        }
        const form = this.form;
        updateVersions(this.id, form).then(res => {
          this.$alert("版本编辑成功!", "成功", {
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

