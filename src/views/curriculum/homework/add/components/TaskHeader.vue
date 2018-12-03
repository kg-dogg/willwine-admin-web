<template>
  <el-form ref="form" slot="header" class="task-header" :inline="true" :model="form" :rules="rules">
    <el-form-item label="任务类型" prop="type">
      <el-select clearable placeholder='请选择所属任务类型' v-model="form.type">
        <el-option v-for="(v,k) in taskTypeList" :key="k" :label="v" :value="k"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="模板" prop="template">
      <el-select clearable placeholder='请选择内容模板' v-model="form.template">
        <el-option v-for="(v,k) in templateList" :key="k" :label="v" :value="k"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="倒计时(秒)" prop="duration">
      <el-input-number v-model="form.duration" :min="0" label="秒数"></el-input-number>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    type: String,
    template: String,
    duration: Number
  },
  data() {
    return {
      form: {
        type: "",
        template: "",
        duration: 180
      },
      rules: {
        type: [
          { required: true, message: "请选择任务类型", trigger: "change" }
        ],
        template: [{ required: true, message: "请选择模板", trigger: "change" }]
      }
    };
  },
  computed: {
    ...mapState(["global"]),
    taskTypeList() {
      return this.global.param.jobs && this.global.param.jobs.task_type;
    },
    templateList() {
      // return this.global.param.jobs && this.global.param.jobs.task_template;
      return {
        subjective: "主观题",
        choice_of_word: "选择题（文字）",
        choice_of_picture: "选择题（图片）"
      };
    }
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        this.form.type = val;
      }
    },
    template: {
      immediate: true,
      handler(val) {
        this.form.template = val;
      }
    },
    duration: {
      immediate: true,
      handler(val) {
        this.form.duration = val;
      }
    },
    ["form.type"](val) {
      if (val !== this.type) {
        this.$emit("update:type", val);
      }
    },
    ["form.template"](val) {
      if (val !== this.template) {
        this.$emit("update:template", val);
      }
    },
    ["form.duration"](val) {
      if (val !== this.duration) {
        this.$emit("update:duration", val);
      }
    }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.task-header{
  height: 60px;
}
</style>

