<template>
  <div class="app-container">
    <el-card>
    <div slot="header" class="clearfix">
        <span>邮件模板</span>
    </div>

    <div >
      <el-form label-width="160px" label-position="top">
        <el-form-item  label="邮件标题:" required>
            <el-input v-model="template.subject"></el-input>
        </el-form-item>

        <el-form-item  label="类别:">
           <el-input v-model="template.category" disabled></el-input>
        </el-form-item>

        <el-form-item  label="邮件正文:" required>
          <el-alert title="邮件内可用变量" type="warning" :description="fields" show-icon :closable="false"></el-alert>
           <div style="margin-top:20px"><tinymce :height=600 v-model="template.body" ></tinymce></div>
        </el-form-item>



        <hr/>
        <el-form-item>
          <el-button  icon="el-icon-success" type="primary" @click="submit" :loading="loading">确定</el-button>
          <router-link :to="{name:'configurationMail'}"><el-button  icon="el-icon-remove-outline" >取消</el-button></router-link>
        </el-form-item>

      </el-form>
    </div>
    </el-card>
  </div>
</template>


<script>
import Tinymce from '@/components/Tinymce';
import { editEmailTemplate, addEmailTemplate } from "@/api/api";

export default {
  components: { Tinymce },
  data() {
    return {
      id: this.$route.params.id || '',
      loading: false,
      fields: '',
      template: {
        subject: '',
        category: 'user',
        body: '',
      },
    };
  },
  mounted() {
    if (this.id) {
      axios.get(`/email-template/${this.id}`)
      .then(response => response.data)
      .then((response) => {
        Object.keys(this.template).forEach(v => {
          this.template[v] = response.email_template[v]
        })
        // this.template.subject = response.email_template.subject;
        // this.template.category = response.email_template.category;
        // this.template.body = response.email_template.body;
        this.fields = response.fields;
      })
      .catch((error) => {
        helper.message('error', error);
      });
    }

  },
  methods: {
    submit() {
      this.loading = true
      if (this.id) {
        editEmailTemplate(this.id, this.template).then(res => {
          this.loading = false
          helper.message('success', '编辑成功!');
          this.$router.push({name:'configurationMail'});
        }).catch(e => this.loading = false);
      } else {
        addEmailTemplate(this.template).then(res => {
          this.loading = false;
          helper.message('success', '创建成功!');
          this.$router.push({name:'configurationMail'});
        }).catch(e => this.loading = false)
      }


    }
  },
};
</script>
