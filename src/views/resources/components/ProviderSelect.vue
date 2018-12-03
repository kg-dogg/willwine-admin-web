<template>
  <el-select class="filter-item" clearable filterable v-model="currentValue" placeholder="选择渠道">
    <el-option v-for="item in providers" :key="item.id" :label="item.provider" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import { getProviders } from "@/api/api";
export default {
  name: "provider-select",
  props: {
    value: String
  },
  data() {
    return {
      providers: [],
      currentValue:
        this.value === undefined || this.value === null ? "" : this.value
    };
  },
  watch: {
    currentValue(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.currentValue = val;
    }
  },
  created() {
    this.pullProviders();
  },
  methods: {
    // 获取渠道信息
    pullProviders() {
      getProviders(0)
        .then(res => {
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.providers = res.data;
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>

<style>
</style>
