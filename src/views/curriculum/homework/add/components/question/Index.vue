<template>
  <div class="task-question">
    <!-- 题干编辑 -->
    <el-input v-if="hasOptions" class="task-question-input" type="textarea" autosize placeholder="请输入题干内容" v-model="myTitle"></el-input>
    <Tinymce v-else class='tinymce' v-model="myTitle"></Tinymce>
    <!-- 选项 -->
    <el-card v-if="hasOptions">
      <div slot="header" class="clearfix">
        <span>选项</span>
      </div>

      <div>
        <el-checkbox-group class="task-options" v-model="myAnswers" :class="{'task-options-picture':optionType === 'picture'}" :max="maxChecked" @change="answersChange">
          <TaskQuestionOption v-for="(item,index) in myOptions" :key="item.uid" :value="item" :alpha="getUpperAlpha(index)" :optionType="optionType" @emitChange="emitChange"></TaskQuestionOption>
        </el-checkbox-group>

        <div style="padding: 14px;">
          <el-button type="text" icon='el-icon-plus' @click="addOption">选项</el-button>
        </div>
      </div>
    </el-card>

    <div v-else class="el-form-item el-form-item--medium">
      <label class="el-form-item__label">提交方式</label>
      <el-radio-group class="el-form-item__content" v-model="myMethod">
        <el-radio v-for="(v,k) in methods" :key="k" :label="k">{{v}}</el-radio>
      </el-radio-group>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
import Tinymce from "@/components/Tinymce";
import TaskQuestionOption from "../option/Index.vue";
export default {
  components: {
    Tinymce,
    TaskQuestionOption
  },
  props: {
    title: String,
    // 选项内容
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    method: String,
    template: String,
    // 是否多选
    multiple: {
      type: Boolean,
      default() {
        return true;
      }
    },
    index: Number
  },
  data() {
    return {
      myTitle: "",
      // 选项内容
      myOptions: [],
      myAnswers: [],
      defaultOption: {
        uid: "", // 唯一Id
        alpha: "", // 选项字母
        title: "", // 选项文本内容
        url: "", // 图片资源
        checked: false, // 是否是正确答案
        remove: false // 删除状态
      },
      // 提交方式
      myMethod: "",
      optionTypeEnum: {
        picture: "picture",
        text: "text"
      }
    };
  },
  computed: {
    ...mapState(["global"]),
    maxChecked() {
      return this.multiple ? 100 : 1;
    },
    hasOptions() {
      if (this.template.indexOf("choice") > -1) {
        return true;
      }
      return false;
    },
    // 选项类型：text or picture
    optionType() {
      if (this.template.indexOf("picture") > -1) {
        return this.optionTypeEnum.picture;
      }
      return this.optionTypeEnum.text;
    },
    methods() {
      return this.global.param.jobs && this.global.param.jobs.method;
    }
  },
  watch: {
    myTitle(val) {
      if (val !== this.title) {
        this.$emit("update:title", val);
      }
    },
    myMethod(val) {
      if (val !== this.method) {
        this.$emit("update:method", val);
      }
    },
    hasOptions(val, oldVal) {
      // 需要在下一阶段进行更新，因为他和上面的 myTitle watch 有冲突（富文本框的<p></p>会emit到父组件上）
      this.$nextTick(() => {
        this.myTitle = ""; // 选择题类型和非选择题类型切换时，清空 题干内容。（因为富文本框输入框有html字符）
      });
    }
  },
  created() {
    this.myTitle = this.title;
    this.initMyOptions(this.options);
    this.myMethod = this.method;
  },
  methods: {
    initMyOptions(val) {
      this.myOptions = val
        .map(item => {
          item.uid = item.uid || this.getUniqueId();
          item.alpha = item.alpha || ""; // 如果传递了选项会排序靠前，然后根据新的排序重新生成 字母选项
          item.checked = item.checked || false;
          item.remove = item.remove || false;
          return item;
        })
        .sort((a, b) => {
          const nameA = a.alpha.toUpperCase();
          const nameB = b.alpha.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
    },
    // 获取一个唯一id
    getUniqueId() {
      return _.uniqueId();
    },
    // 将num转换成 A-Z 的大写字母
    getUpperAlpha(num) {
      return String.fromCharCode((num % 26) + 65);
    },
    // 发送变化 (编辑和删除)
    emitChange(newValue) {
      if (newValue) {
        let index = this.myOptions.findIndex(item => item.uid === newValue.uid);
        if (index === -1) {
          this.$message.error("操作发生异常，无法进行");
          return false;
        }
        if (newValue.remove) {
          this.myOptions.splice(index, 1);
          // 还要删除对应的答案记录
          this.myAnswers = this.myAnswers.filter(item => {
            if (this.optionType === this.optionTypeEnum.picture) {
              return item !== newValue.url;
            } else {
              return item !== newValue.title;
            }
          });
        } else {
          // 直接利用数组索引设置新值，vue无法检测到变化
          this.myOptions.splice(index, 1, newValue);
        }
        this.$emit("update:options", this.myOptions);
      }
    },
    addOption() {
      if (this.myOptions.length > 25) {
        this.$message({
          message: "大兄弟，什么选择题这么多选项啊？不给你加了啊",
          type: "warning"
        });
        return false;
      }
      let newOption = Object.assign({}, this.defaultOption, {
        uid: this.getUniqueId(),
        alpha: this.getUpperAlpha(this.myOptions.length)
      });
      this.myOptions.push(newOption);
      this.$emit("update:options", this.myOptions);
    },
    answersChange(val) {
      // 更新 options 的 checked 为正确答案选中
      // checkbox 的答案保存具体的内容而不是A,B,C,D。这样的好处是删除选项的时候 正确答案不会丢失。因为我们的A,B,C,D 是根据数组索引自动生成的，eg:删除了B后，C会自动变成B
      if (this.optionType === "picture") {
        // 图片的答案保存的是 url
        this.myOptions.forEach(item => {
          item.checked = val.includes(item.url);
        });
      } else {
        // 文本的答案保存的是 选项的具体文本内容
        this.myOptions.forEach(item => {
          item.checked = val.includes(item.title);
        });
      }

      this.$emit("update:options", this.myOptions);
    },
    validate() {
      // "<p></p>\n<p><audio controls=\"controls\" style=\"display: none;\"></audio></p>"
      return new Promise((resolve, reject) => {
        let questionTitle = `题干 ${this.index + 1}`;
        if (!this.myTitle) {
          reject(questionTitle + " 不能为空");
        }
        const pattern = new RegExp("<p>(.*?)</p>", "i");
        const matched = this.myTitle.match(pattern);
        if (matched && matched.length > 1) {
          if (!matched[1]) {
            reject(questionTitle + " 不能为空");
          }
        }
        // 选择题需要的检验
        if (this.hasOptions) {
          if (this.myOptions.length === 0) {
            reject(questionTitle + " 请添加选项");
          }
          const invalidOption = this.myOptions.find(
            item => !item.title && !item.url
          );
          if (invalidOption) {
            reject(
              `${questionTitle} 选项${invalidOption.alpha}的内容为空，请检查`
            );
          }
          const checkedOptions = this.myOptions.filter(item => item.checked);
          if (checkedOptions.length === 0) {
            reject(questionTitle + " 请选择正确答案");
          }
        }

        resolve();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.task-question {
  .task-option-title {
    padding: 10px 0;
  }
  .task-question-input {
    margin-bottom: 1rem;
  }
  .task-options {
    display: flex;
    flex-direction: column;
    &.task-options-picture {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>

