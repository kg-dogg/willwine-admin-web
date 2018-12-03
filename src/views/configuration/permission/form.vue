<template>
        <div class="form-group">
          <el-form ref="form" label-width="80px" size="mini" label-position="top">
            <el-form-item label="权限名称:" required >
              <el-input placeholder="权限英文名称, eg: edit-user" v-model="form.name" clearable></el-input>
            </el-form-item>

            <el-form-item label="权限描述:" required>
              <el-input placeholder="请输入权限中文描述" v-model="form.description" clearable></el-input>
            </el-form-item>

            <el-form-item >
              <el-tooltip content="改功能暂时屏蔽" placement="top">
                <el-button type="primary" class="waves-light pull-right" size="mini"  @click="storePermission" disabled>保存</el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>

</template>


<script>
import { addPermission } from "@/api/api";
export default {
  data() {
    return {
      form: {
        guard: 'web',
        name: '',
        description: '',
      },
    };
  },
  methods: {
    storePermission() {
      addPermission(this.form).then(res => {
        helper.message('success', '权限创建成功!');
        this.$emit('completed');
      }).catch((error) => {
        helper.message('error', error);
      });
    },
  },
};
</script>
