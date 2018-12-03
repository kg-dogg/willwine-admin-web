<template>

  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="form" label-width="80px">

        <el-form-item label="最新生效版本" style="width:271px;">

        <el-select clearable class="filter-item" v-if="this.versions"
                   v-model="form.new_num" placeholder="最新生效版本">
          <el-option v-for="item in this.versions" :key="item.number" :label="item.name" :value="item.number">{{item.name}}</el-option>
        </el-select>
        </el-form-item>

        <el-form-item label="最低生效版本" style="width:271px;">

        <el-select clearable class="filter-item" v-if="this.versions"
                   v-model="form.last_num" placeholder="最低生效版本">
          <el-option v-for="item in this.versions" :key="item.number" :label="item.name" :value="item.number">{{item.name}}</el-option>
        </el-select>
        </el-form-item>

        <hr />

        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style>
  .el-table__header{
    width:100%;
  }
</style>
<script>
import { mapState } from 'vuex';
import Tinymce from '@/components/Tinymce';
import { statusVersions, getVersions } from '../../api/api';

export default {
  created() {
    let platform = this.form.platform = this.$route.query.platform;

    getVersions(0,platform).then((res) => {
      if (res.status_code === 200) {
        this.versions = res.data;
      }
    });
  },
  data() {
    return {
      versions:[],
      form: {
        platform: '',
        new_num:'请选择',
        last_num:'请选择',
      },
    };
  },

  // 计算属性
  computed: {
    ...mapState({

      global: 'global',

    }),
  },
  methods: {
    // 添加属性
    onForm(form) {

    },
    handleSuccess(res, file) {
      this.form.url = res.data.resources_path;
    },
    onSubmit() {
      let form = this.form;

      statusVersions(form).then((res) => {
        this.$alert('版本状态修改成功!', '成功', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$router.replace({ name: 'versionsIndex',params:{platform:this.form.platform} });
          },
        });
      });
    },
  //
  },
};
</script>

