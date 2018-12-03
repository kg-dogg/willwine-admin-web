<template>
  <el-dialog title="批量复制" :visible.sync="visible" width="800px" top="5vh">
    <div class="copy-upload">
      <div>
        <el-steps :active="currentStep" align-center finish-status="success">
          <el-step title="选择复制内容项"></el-step>
          <el-step title="上传文件"></el-step>
          <el-step title="确认复制"></el-step>
        </el-steps>
      </div>

      <div>
        <div class="step1" v-show="currentStep === 0">
          <UploadChoose ref="step1" v-model="sourceType"></UploadChoose>
        </div>
        <UploadCore ref="step2" v-show="currentStep === 1" :sourceType="sourceType" @next="next">
        </UploadCore>
        <UploadResult ref="step3" v-show="currentStep === 2" :value="uploadResult"></UploadResult>
      </div>

      <div class="footer">
        <el-button size="small" @click="prev" :disabled="this.currentStep === 0">上一步</el-button>
        <el-button type="primary" size="small" @click="next" v-show="this.currentStep < 2">下一步</el-button>
        <el-button type="primary" size="small" @click="next" v-show="this.currentStep === 2" :disabled="!this.isSuccess" :loading="loading">确认复制</el-button>
      </div>

    </div>
  </el-dialog>
</template>

<script>
import { copyConfirmJob } from "@/api/api";
import UploadChoose from "./components/UploadChoose.vue";
import UploadCore from "./components/UploadCore.vue";
import UploadResult from "./components/UploadResult.vue";
export default {
  components: {
    UploadChoose,
    UploadCore,
    UploadResult
  },
  data() {
    return {
      visible:false,
      currentStep: 0,
      sourceType: "", // 复制的内容项
      isSuccess: false, // 上传是否成功
      uploadResult: {},
      loading: false
    };
  },
  methods: {
    show(){
      this.visible = true;
    },
    prev() {
      if (this.currentStep > 0) {
        this.currentStep -= 1;
      }
    },
    next() {
      if (this.currentStep === 0) {
        this.step1();
      } else if (this.currentStep === 1) {
        this.step2();
      } else if (this.currentStep === 2) {
        this.step3();
      }
    },
    step1() {
      this.$refs.step1
        .confirm()
        .then(() => {
          this.currentStep = 1;
        })
        .catch(() => {});
    },
    step2() {
      this.$refs.step2
        .confirm()
        .then(result => {
          this.uploadResult = result;
          this.currentStep = 2;
          // 判断 result 成功 or 失败
          if (result.verfiy) {
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    step3() {
      this.loading = true;
      copyConfirmJob({ key: this.uploadResult.key }).then(res => {
        this.loading = false;
        if (res.status_code === 200) {
          this.$message({
            message: "复制成功",
            type: "success"
          });
          this.visible = false;
        } else {
          this.$message.error("复制错误：" + res.message);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.copy-upload {
  .step1 {
    height: 200px;
  }
  .footer {
    text-align: right;
    padding-top: 20px;
  }
  .el-table th {
    background-color: #f5f7fa;
  }
}
</style>

