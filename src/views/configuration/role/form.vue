<template>
          <el-form ref="form" label-width="80px" size="mini" label-position="top">
            <el-form-item label="角色名称:" required >
              <el-input placeholder="请输入角色名称,英文" v-model="form.name" clearable></el-input>
            </el-form-item>

            <el-form-item label="描述:" required="" >
              <el-input placeholder="请输入中文描述" v-model="form.description" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" class="waves-light pull-right" size="mini"  @click="storeRole">保存</el-button>
            </el-form-item>

          </el-form>
</template>


<script>
import { addRole } from "@/api/api";
export default {
  data() {
    return {
      guards: [{val: 'web', label: "后台角色"}, {val: 'api', label: "前台角色"}],
      form: {
        name: "",
        guard: 'web',
        description: '',
      },
    };
  },
  methods: {
    storeRole() {
      if (this.form.name == "" || this.form.description == "") {
        helper.message('notice', '请输入角色名称与描述');
        return;
      }
      addRole(this.form).then((res) => {
        this.form.name = '';
        this.form.description = '';
        helper.message('success', '角色添加成功!');
        this.$emit('completed');
      }).catch((error) => {
          helper.message('error', error);
      });
    },
  },
};
</script>



