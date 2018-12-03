<template>
  <el-checkbox class="task-option" :label="myOption.title" :checked="myOption.checked">
    <span class="task-option-alpha">{{alpha + '. '}}</span>
    <el-input class="task-option-input" v-model="myOption.title" placeholder="请输入内容"></el-input>
    <el-button class="task-option-button" type="danger" icon="el-icon-delete" size="mini" circle @click="remove"></el-button>
    <el-alert class="task-option-error" v-show="error" :title="error" type="error" show-icon :closable="false"></el-alert>
  </el-checkbox>
</template>

<script>
export default {
  props: {
    value: Object,
    // 选项字母: A,B,C,D
    alpha: String
  },
  data() {
    return {
      myOption: {
        title: "",
        checked:false,
        remove: false
      },
      error: ""
    };
  },
  watch: {
    value(val) {
      this.initMyOption(val);
    },
    ["myOption.title"]() {
      this.emitChange();
    }
  },
  created() {
    this.initMyOption(this.value);
  },
  methods: {
    initMyOption(newValue) {
      this.myOption = Object.assign({}, this.myOption, newValue);
    },
    getNewValue() {
      return Object.assign(
        {
          alpha: this.alpha
        },
        this.value,
        this.myOption
      );
    },
    emitChange() {
      this.$emit("emitChange", this.getNewValue());
    },
    remove() {
      this.myOption.remove = true;
      this.emitChange();
    }
  }
};
</script>

<style lang="scss" scoped>
.task-option {
  margin-left: 20px;
  .task-option-alpha {
    display: inline-block;
    width: 18px;
  }
  .task-option-input {
    width: 750px;
  }
  .task-option-button {
    margin-left: 10px;
    visibility: hidden;
  }
  &:hover {
    .task-option-button {
      visibility: visible;
    }
  }
  .task-option-error {
    display: inline;
    margin-left: 10px;
  }
}
</style>

<style lang="scss">
.task-option {
  .task-option-input {
    input {
      border-width: 0 0 1px 0;
      border-radius: 0;
    }
  }
}
</style>


