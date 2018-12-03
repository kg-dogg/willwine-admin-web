<template>
  <el-dialog :title="`试题 ${index === -1 ? index+2:index+1}`" width="1000px" top="5vh" :visible.sync="dialogVisible" :close-on-click-modal="false" v-show="visible" @close="close" class="homework-task">
    <el-card>
      <TaskHeader ref="header" :type.sync="model.type" :template.sync="model.template" :duration.sync="model.duration"></TaskHeader>

      <el-collapse v-model="collapseActiveName">
        <!-- 材料 -->
        <el-collapse-item title="材料" name="material">
          <TaskMaterial v-model="model.material" :updalodData="updalodData"></TaskMaterial>
        </el-collapse-item>

        <!-- 题干 -->
        <el-collapse-item v-for="(item,index) in model.questions" :key="item.uid" :title="`题干${index+1}`" :name="index">
          <template slot="title">
            <span>{{`题干${index+1}`}}</span>
            <i class="el-icon-delete el-collapse-item__arrow task-item-header" :class="{disabled:!!effective_time}" @click.stop="removeQuestion(index)"></i>
          </template>
          <TaskQuestion :ref="`question${index}`" :template="model.template" v-bind.sync="item" :index="index"></TaskQuestion>
        </el-collapse-item>

        <el-card class='quest' v-show="!isChoice">
          <el-button type="text" icon="el-icon-plus" @click="addQuestion" :disabled="!!effective_time">题干</el-button>
        </el-card>

        <!-- 解析 -->
        <el-collapse-item v-for="(item,index) in model.analysis" :key="`analysis${index}`" title="解析" name="analysis">
          <TaskMaterial v-model="model.analysis[index]" :updalodData="updalodData"></TaskMaterial>
        </el-collapse-item>

      </el-collapse>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import Tinymce from "@/components/Tinymce";
import TaskHeader from "./TaskHeader";
import TaskMaterial from "./TaskMaterial";
import TaskQuestion from "./question/Index.vue";
export default {
  components: {
    Tinymce,
    TaskHeader,
    TaskMaterial,
    TaskQuestion
  },
  props: {
    visible: Boolean,
    task: Object,
    index: Number,
    effective_time: String
  },
  data() {
    return {
      dialogVisible: false,
      updalodData: { source: "jobs" },
      model: null,
      defaultTask: {
        uid:'',
        type: "", // string:任务类型 : STUDY 学习型 INTERACTION 互动型 SHARE 分享型 CHALLENGE 挑战型
        template: "", // string:作业模版 : subjective, choice_of_picture, choice_of_word
        duration: 180,
        material: {
          description: "", // 材料说明（富文本框编辑内容）
          resource_id: "", // 材料对应资源ID
          attachment: "" // 展示视频资源时对应的字幕
        },
        analysis: [
          {
            description: "", // 解析说明（富文本框编辑内容）
            resource_id: "", // 解析对应资源ID
            attachment: "" // 解析资源是视频时对应的字幕
          }
        ],
        questions: []
      },
      defaultQuestion: { title: "", options: [], method: "NON" },
      // 材料折叠面板状态
      collapseActiveName: [0]
    };
  },
  computed:{
    isChoice() {
      if (this.model && this.model.template.indexOf("choice") > -1) {
        return true;
      }
      return false;
    },
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    task: {
      immediate: true,
      handler(val) {
        this.model = this.transformToModel(val);
      }
    }
  },
  created() {
    if (this.task) {
      // 编辑
      // 如果 材料 有内容，则呈现展开状态
      if (this.model.material.description || this.model.material.resource_id) {
        this.collapseActiveName.push("material");
      }
      // 展开所有题干
      this.model.questions.forEach((element, index) => {
        this.collapseActiveName.push(index);
      });
      // 如果有解析，展开
      if (this.model.analysis.length > 0) {
        this.collapseActiveName.push("analysis");
      }
    }
    if (this.model && this.model.questions.length === 0) {
      this.addQuestion();
    }
    this.dialogVisible = this.visible;
  },
  methods: {
    // 获取一个唯一id
    getUniqueId() {
      return _.uniqueId('question');
    },
    close() {
      this.$emit("update:visible", false);
    },
    // 验证
    async validate() {
      try {
        // header 部分验证
        await this.$refs["header"].validate();

        for (let i = 0; i < this.model.questions.length; i++) {
          await this.$refs[`question${i}`][0].validate();
        }
        const questions = this.model.questions.filter(item => item.title);

        if (
          !this.model.material.description &&
          !this.model.material.resource_id &&
          questions.length === 0
        ) {
          throw new Error("题干、材料、材料资源不能全部为空");
        }
        return true;
      } catch (e) {
        let message = "请检查所填写内容";
        if(typeof e === 'string'){
          message = e;
        }else if(typeof e === 'object'){
          message = e.message;
        }
        this.$message.error(message);
        return false;
      }
    },
    // 保存
    save() {
      this.validate().then(valid => {
        if (!valid) {
          return false;
        }
        let form = this.transformToForm(this.model);
        this.$emit("save", form, this.index);
        this.close();
      });
    },
    addQuestion() {
      this.model.questions.push(Object.assign({}, this.defaultQuestion,{
        uid:this.getUniqueId()
      }));
      this.collapseActiveName.push(this.model.questions.length - 1);
    },
    removeQuestion(index) {
      if (this.effective_time) {
        this.$message({
          message: "所属版本已经有发布记录，不能删除！",
          type: "warning"
        });
        return false;
      }
      this.model.questions.splice(index, 1);
    },
    transformToModel(form) {
      let model = null;
      if (form) {
        model = Object.assign({}, form);
        model.questions = form.sub_tasks.map(item => {
          // 转成 question 组件需要的 options 格式
          let options = [];
          if (item.answer && item.answer.length > 0) {
            options = item.answer.map(optionItem => {
              return {
                alpha: optionItem.option, // 选项字母
                title: optionItem.description, // 选项内容
                url: optionItem.image_url, // 图片资源
                checked: optionItem.right // 是否是正确答案
              };
            });
          }

          // question Model 数据格式
          return {
            title: item.description,
            options: options,
            method: item.method
          };
        });
      } else {
        model = Object.assign({}, this.defaultTask);
      }
      return model;
    },
    transformToForm(model) {
      let form = null;
      if (model) {
        form = Object.assign({}, model);
        form.sub_tasks = form.questions.map(item => {
          // 转成 api form 需要的sub_tasks格式
          let options = item.options.map(optionItem => {
            return {
              option: optionItem.alpha, // 选项字母
              description: optionItem.title, // 选项内容
              image_url: optionItem.url,
              right: optionItem.checked // 是否是正确答案
            };
          });
          // api form 数据格式
          return {
            description: item.title,
            answer: options,
            method: item.method
          };
        });
        Reflect.deleteProperty(form, "questions");
      }
      return form;
    }
  }
};
</script>

<style lang="scss" scoped>
.task-item-header {
  margin-right: 20px;
  font-size: 1.5rem;
  color: #909399;
  &:hover {
    color: #f56c6c;
  }
}
.task-item-header.disabled {
  color: #dcdfe6 !important;
}
</style>


