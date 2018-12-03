<template>
  <div class="app-container homework-add" v-loading="loading">
    <el-form label-width="100px" ref="form" :model="form" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="作业名称" prop="title">
            <el-input type="text" clearable v-model='form.title' :disabled="pageType === 'viewHomework'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="作业说明" prop="description">
            <el-input type="textarea" clearable v-model='form.description' :disabled="pageType === 'viewHomework'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 试题 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="试题列表" prop="tasks">
            <el-card>
              <ol v-if="form.tasks.length > 0">
                <li v-for="(item,index) in form.tasks" class="task-item">
                  <!-- <a href="#" v-html="setTaskTitle(item,index)" class="task-title" @click="editTask(index)"></a> -->
                  <el-button class="task-item-title" type="text" @click="editTask(index)">{{setTaskTitle(item,index)}}</el-button>
                  <el-button class="task-item-remove" icon="el-icon-delete" size="mini" circle :disabled="!!form.effective_time" @click="removeTask(index)"></el-button>
                </li>
              </ol>

              <div>
                <el-button type="text" icon='el-icon-plus' @click="addTask" :disabled="!!form.effective_time">新增试题</el-button>
                <span class="secondary-text" v-if="form.tasks.length === 0">暂无试题，请添加</span>
              </div>

            </el-card>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" style='text-align:right'>
          <el-button @click="reset" v-if="pageType !== 'modifyHomework'">重置</el-button>
          <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click='submit'>保存</el-button>
        </el-col>
      </el-row>
    </el-form>

    <Task :visible.sync="visible" :task="currentTask" :index="currentTaskIndex" :effective_time="form.effective_time" @save="taskSave" v-if="visible"></Task>

  </div>
</template>
<script>
import Lockr from "lockr";
import { mapState } from "vuex";
import { addJob, getJob, modifyJob, getCourseInfo } from "@/api/api";
import Task from "./components/Task.vue";

export default {
  components: {
    Task
  },
  data() {
    return {
      questNum: 2,
      id: this.$route.query.id,
      pageType: this.$route.name,
      //表单
      form: {
        title: "", // 作业名称
        description: "", // 作业描述
        tasks: [],
        type: this.$route.query.type, // 作业类型 PRECLASS 课前作业 AFTERCLASS 课后作业
        course_id: this.$route.query.courseId, // 课时ID
        curriculum_id: this.$route.params.id, // 课程（班型）id
        tag: this.$route.query.tag, // 版本号
        effective_time:'', // 最近一次的生效时间
      },
      rules: {
        title: [
          { required: true, message: "请输入作业名称", trigger: "change" }
        ],
        tasks: [{ required: true, message: "请添加试题", trigger: "change" }]
      },
      // 当前选择的试题
      currentTask: null,
      currentTaskIndex: 0,
      visible: false,
      // 本页面的加载loading
      loading: false,
      btnLoading: false
    };
  },
  computed: {
    ...mapState(["global"]),
    taskTypeList() {
      return this.global.param.jobs && this.global.param.jobs.task_type;
    },
    templateList() {
      return this.global.param.jobs && this.global.param.jobs.task_template;
      // return {
      //   subjective: "主观题",
      //   choice_of_word: "选择题（文字）",
      //   choice_of_picture: "选择题（图片）"
      // };
    },
    methods() {
      return this.global.param.jobs && this.global.param.jobs.method;
    },
    jobType() {
      return (
        this.global.param.jobs &&
        this.global.param.jobs.job_type[this.form.type]
      );
    }
  },
  created() {
    if (this.id && this.pageType === "modifyHomework") {
      this.getData();
    } else {
      this.setClassInfo("创建");
    }
  },
  methods: {
    addTask() {
      this.editTask(-1);
    },
    editTask(index) {
      this.visible = true;
      if (index > -1) {
        this.currentTask = this.form.tasks[index];
        this.currentTaskIndex = index;
      } else {
        this.currentTask = null;
        this.currentTaskIndex = -1;
      }
    },
    removeTask(index) {
      this.$confirm(`确定要删除第${index + 1}题吗?`, "重要提示", {
        type: "warning"
      }).then(() => {
        this.form.tasks.splice(index, 1);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    taskSave(newTask, index) {
      if (typeof index === "number" && index > -1) {
        this.form.tasks.splice(index, 1, newTask);
      } else {
        this.form.tasks.push(newTask);
      }
    },
    setTaskTitle(task, index) {
      let title = `试题${index + 1}`;
      if (task.sub_tasks && task.sub_tasks.length > 0) {
        let html = task.sub_tasks[0].description;
        if (html) {
          const pattern = new RegExp("<p>(.*?)</p>", "i");
          const matched = html.match(pattern);
          if (matched) {
            title = matched[1];
            // 图片替换
            title = title.replace(/<img [^>]*>/g, "  [图片]  ");
            title = title.replace(/<audio [^>]*>/g, "  [音频]  ");
            title = title.replace(/<video [^>]*>/g, "  [视频]  ");
            // 剩下的html标签全部抹去 <[^>]*>
            title = title.replace(/<[^>]*>/g, "");
          }
        }
      }
      task.title = title;
      let displayLength = 50;
      if(title.length > displayLength){
        title = title.substr(0, displayLength);
      }
      return title;
    },
    reset() {
      this.form.title = "";
      this.form.description = "";
    },

    setClassInfo(type) {
      getCourseInfo(this.form.course_id).then(res => {
        const data = res.data;
        this.$route.matched[1].meta.title = `${type}作业（${data.stage}，${
          data.curriculum
        }，${this.jobType}，${data.title}）`;
      });
    },
    getData() {
      this.loading = true;
      getJob(this.id, this.form.tag).then(res => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        const {
          title,
          description,
          type,
          jobtask: { data },
          course_id,
          effective_time
        } = res.data;
        data.forEach(item => {
          item.uniqId = _.uniqueId();
          item.sub_tasks.forEach(qItem => {
            qItem.uniqId = _.uniqueId();
          });
        });
        this.form = {
          title,
          description: description || "",
          type,
          course_id,
          effective_time,
          tasks: data,
          id: this.id,
          tag: this.$route.query.tag,
          curriculum_id: this.$route.params.id
        };
        this.setClassInfo("编辑");
        this.loading = false;
      });
    },
    submit() {
      const valid = this.validate();
      if (!valid) {
        return false;
      }
      this.btnLoading = true;
      this.form.user_id = Lockr.get("user_detail").id;
      console.log(this.form);
      this.submitType().then(res => {
        this.btnLoading = false;
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.$router.replace({
          name: "homeworkList",
          query: {
            tag: this.$route.query.tag,
            course_id: this.$route.query.course_id,
            page: this.$route.query.page
          }
        });
      });
    },
    validate() {
      const tasks = this.form.tasks;
      let validate = true;
      this.$refs.form.validate(valid => {
        if (valid) {
          tasks.forEach((item, index) => {
            const questions = item.sub_tasks.filter(qItem => qItem.description);
            if (
              questions.length < item.sub_tasks.length &&
              this.pageType === "modifyHomework"
            ) {
              this.$message.error("题干不能为空");
              validate = false;
            }
            if (
              !(
                questions.length > 0 ||
                item.material.description ||
                item.material.resource_id
              )
            ) {
              this.$message.error("题干、材料、材料资源不能全部为空");
              validate = false;
            }
          });
        } else {
          this.$message.error("必填内容不能为空");
          validate = false;
        }
      });
      return validate;
    },
    submitType() {
      if (this.id && this.pageType === "modifyHomework") {
        return modifyJob(this.id, this.form);
      }
      return addJob(this.form);
    }
  }
};
</script>

<style lang="scss" scoped>
.homework-add {
  .quest {
    margin-bottom: 20px;
  }
  .secondary-text {
    margin-left: 2rem;
  }
  .task-item {
    border-width: 0;
    border-style: inset;
    border-bottom-width: 1px;
    border-color: transparent;
    &:hover {
      border-bottom-width: 1px;
      border-color: inherit;
      .task-item-remove {
        visibility: visible;
      }
    }
    .task-item-remove {
      float: right;
      visibility: hidden;
    }
  }
}
</style>




