<template>
  <el-form ref="form" class="copy-upload-form" :model="model" :rules="rules" label-width="170px" >
    <el-form-item label="请选择要复制的内容项" prop="selectedItem">
      <el-select v-model="model.selectedItem" placeholder="请选择">
        <el-option v-for="(value, key) in sourceType" :key="key" :label="value" :value="key">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    value: String
  },
  data() {
    return {
      model:{
        selectedItem: "",
      },
      rules: {
        selectedItem: [
          { required: true, message: "请选择要复制的内容项", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    sourceType(){
      if(this.$store.state.global){
        return this.$store.state.global.param.copy;
      }
      return {};
    }
  },
  watch: {
    ['model.selectedItem'](val) {
      this.$emit("input", val);
    }
  },
  methods: {
    confirm() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve(this.model.selectedItem);
          } else {
            reject('请选择要复制的内容项');
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.copy-upload-form {
  width: 400px;
  margin: 50px auto;
}
</style>

