<template>
  <div class="app-container">
    <el-form label-width="130px" :model="formData" :rules="rules" ref="ruleForm">
      <el-row>
        <el-col>
          <el-form-item prop='provider' label='外教提供商名称'>
            <el-input type='text' placeholder='请输入简称' clearable v-model="formData.provider"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop='email' label='邮箱'>
            <el-input type='text' placeholder='邮箱将作为登录id' clearable v-model="formData.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop='contacts' label='联系人'>
            <el-input type='text' placeholder='请输入联系人姓名' clearable v-model="formData.contacts"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop='cell_phone' label='手机号'>
            <el-input type='text' placeholder='请输入联系人手机号' clearable v-model="formData.cell_phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <el-button @click='gotoList'>返 回</el-button>
            <el-button type="primary" @click='submit' :loading="loading">确定并生成账号</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { addProvider, getProvider, modifyProvider } from '@/api/api';
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      const reg = /^[0-9]{11}$/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    };
    return {
      id: this.$route.params.id || '',
      loading: false,
      formData: {
        provider: '',
        email: '',
        cell_phone:'',
        contacts: '',
      },
      rules: {
        provider: [
          { required: true, message: '请输入外教提供商名称', trigger: ['blur', 'change'] },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ],
        contacts: [
          { required: true, message: '请输入联系人姓名', trigger: ['blur', 'change'] },
        ],
        cell_phone: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { validator: validatePhone, trigger: ['blur', 'change'] },
        ],
      },
    }
  },
  created() {
    if(this.id){
      this.getData();
    }
  },
  methods:{
    getData() {
      getProvider(this.id).then((res) => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.formData.provider = res.data.provider;
        this.formData.email = res.data.email;
        this.formData.cell_phone = res.data.cell_phone;
        this.formData.contacts = res.data.contacts;
      })
    },
    gotoList() {
      this.$router.go(-1);
    },
    submit() {
      if(!this.checkFormData('ruleForm')) return;
      this.loading = true;
      this.submitType().then((res) => {
        this.loading = false;
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.$message({
          type: 'success',
          message: '操作成功!',
        });
        this.gotoList();
      }).catch((err) => {
        this.loading = false;
        this.$message.error(err);
      });
    },
    submitType() {
      if(this.id){
        return modifyProvider(this.id, this.formData)
      }
      return addProvider(this.formData)
    },
    checkFormData(formName) {
      let res;
      this.$refs[formName].validate((valid) => {
        res = valid;
      });
      return res;
    },
  }
};
</script>
<style scoped>
.app-container{
  width:600px;
}
</style>
