<template>
  <el-dialog custom-class="homework-preview" :visible.sync="dialogVisible" width="375px" top="5vh" :show-close="false">
    <iframe v-if="dialogVisible" :src="ifmSrc" frameborder="0" width="375" height="667" @load="stopLoading"></iframe>
  </el-dialog>
</template>

<script>
import Lockr from "lockr";
// import config from '@/config';
// console.log('config :', config);
export default {
  // 192.168.17.39:9090/h5/teacher/homework/:id/:token?
  props: {
    // 控制 显示/隐藏
    value: Boolean,
    //作业id
    jobId: String
  },
  data() {
    return {
      dialogVisible: this.value,
      loadingInstance: {}
    };
  },
  computed: {
    ifmSrc() {
      let token = Lockr.get("auth_token").replace(/\./g, ",");
      return `${WEB_URL}/h5/teacher/homework/${this.jobId}/${token}`;
      // return "https://h5.ele.me/";
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if(val){
        this.startLoading()
      }else{
        this.stopLoading();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    startLoading(){
      this.loadingInstance = this.$loading({
        target: ".homework-preview",
        lock: true,
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    stopLoading() {
      this.loadingInstance.close();
    }
  }
};
</script>

<style lang="scss">
.homework-preview {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>


