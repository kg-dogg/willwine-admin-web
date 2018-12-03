<template>

  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="form" label-width="80px">
        <el-form-item  label="平台类型">
          <el-radio-group style="margin-top:10px" v-if="global.param.versions"
                          v-model="form.platform">
            <el-radio disabled v-for="(v,k) in global.param.versions.platform" :key="k" :label="v" :value="k" >{{v}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="版本name" style="width:271px;">
          <el-input type="text" v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="版本code" style="width:271px;">
          <el-input type="number" v-model="form.number" disabled></el-input>
        </el-form-item>
        <el-form-item label="版本url">
          <el-input type="explain" v-model="form.url" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务内容">
          <div v-html="form.content"></div>
        </el-form-item>


        <hr />
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
import { getOneVersions } from '../../api/api';
import audioLyric from '../../components/audio_lyric';

export default {
  created() {
    const id = this.$route.query.id;
    getOneVersions(id).then((res) => {
      this.id = res.data.id;

      this.onForm(res.data);
    });
  },
  // 引入的组件列表
  components: {
    audioLyric, Tinymce,
  },
  data() {
    return {
      id: '',
      form: {
        api_version: '',
        current: '',
        force: '',
        number: '',
        platform: '',
        requirement: '',
        url: '',
        content: '',
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
      this.form.api_version = form ? form.api_version : '';
      this.form.current = form ? form.current : '';
      this.form.force = form ? form.force : '';
      this.form.number = form ? form.number : '';
      this.form.name = form ? form.name : '';
      this.form.platform = form ? form.platform : '';
      this.form.requirement = form ? form.requirement : '';
      this.form.url = form ? form.url : '';
      this.form.content = form ? form.content : '';
    },
  },
};
</script>

