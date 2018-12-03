<template>
    <div class="app-container">
        <el-card>
            <el-form label-width="100px" :model='formData' :rules="rules" ref="ruleForm">
                <el-row>
                    <el-col :span='24'>
                        <el-form-item  prop="system" label="系统">
                            <el-select v-model='formData.system'>
                                <el-option v-for='(option,index) in systemList' :key='index' :value='option[0]' :label="option[1]"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item prop="classification" label="消息分类">
                            <el-select v-model='formData.classification'>
                                <el-option v-for='(option,index) in classificationList' :key='index' :value='option[0]' :label="option[1]"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item prop="title" label="标题">
                            <el-input
                            type='text'
                            class='title'
                            clearable
                            maxlength='10'
                            v-model='formData.title'></el-input>
                            <span class='grey'>（{{formData.title && formData.title.length || 0}}/10）</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24' class='content'>
                        <el-form-item prop="content" label="消息内容">
                            <el-input
                            type='textarea'
                            resize='vertical'
                            class='content'
                            rows='8'
                            v-model='formData.content'></el-input>
                        </el-form-item>
                          <p class='grey'>
                            <span>配置参数请用【】标识</span>
                            <span>学生姓名：【student】</span>
                            <span>课程名称：【curriculum】</span>
                            <span>课时名称：【course】适用于上课提醒</span>
                            <span>作业名称：【job】适用于作业提醒</span>
                          </p>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item  label="发送设置" class='sendSetting'>
                            <el-radio v-model="formData.send_setting" label="advance">提前发送</el-radio>
                            <el-radio v-model="formData.send_setting" label="timely">即时发送</el-radio>
                            <el-radio v-model="formData.send_setting" label="postpone">延后发送</el-radio>
                        </el-form-item>
                        <el-form-item  v-if='formData.send_setting!=="timely"' :label="formData.send_setting=='advance'? '提前' : '延后'" class='minutes' prop='time_difference'>
                            <el-input
                            type='text'
                            class='minutesInput'
                            v-model='formData.time_difference'></el-input> &nbsp;分钟
                        </el-form-item>
                    </el-col>
                    <el-col :span='24' class='buttons'>
                        <el-form-item>
                            <el-button type="primary" @click='submit' :loading="loading">提 交</el-button>
                            <el-button @click='gotoList'>取 消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { getTemplate, modifyTemplate, addTemplate } from '@/api/api';

export default {
  data() {
    const timeVali = (rule, value, callback) =>{
      if(!value) {
        return callback(new Error('请输入时差'));
      } else if(isNaN(value) || value.includes('.') || value.includes('-')) {
        return callback(new Error('时差必须是正整数'))
      }
      return callback();
    }
    return {
      formData: {
        send_setting: 'timely',
        title: '',
        content: '',
        time_difference: 0,
        system: '',
        classification: '',
        id: this.$route.params.id || '',
        created_at: '',
      },
      loading: false,
      rules: {
        system: [
          { required: true, message: '请选择系统', trigger: ['blur', 'change'] },
        ],
        classification: [
          { required: true, message: '请选择消息分类', trigger: ['blur', 'change'] },
        ],
        title: [
          { required: true, message: '请填写标题', trigger: ['blur', 'change'] },
        ],
        content: [
          { required: true, message: '请填写内容', trigger: ['blur', 'change'] },
        ],
        // time_difference: [
        //   { required: true, message: '请填写时差', trigger: ['blur', 'change'] },
        // ],
        time_difference: [
          { validator: timeVali, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      global: 'global',
    }),
    messageTemplate() {
      return this.global.param.messageTemplate;
    },
    systemList() {
      if (this.messageTemplate) {
        return Object.entries(this.messageTemplate.system);
      }
      return [];
    },
    classificationList() {
      if (this.messageTemplate) {
        return Object.entries(this.messageTemplate.classification);
      }
      return [];
    },
  },
  created() {
    if (this.formData.id) {
      this.getTemplateData();
    }
  },
  methods: {
    getTemplateData() {
      getTemplate(this.formData.id).then((res) => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        Object.keys(this.formData).forEach((item) => {
          this.formData[item] = item === 'id' ? res.data[`_${item}`] : res.data[item];
        });
      }).catch((err) => {
        this.$message.error(err);
      });
    },
    check() {
      let res = false;
      this.formData.title = this.formData.title.replace(/(^\s*)|(\s*$)/g,'');
      this.formData.content = this.formData.content.replace(/(^\s*)|(\s*$)/g,'');
      // if(isNaN(this.time_difference)){
      //   this.$message.error('时差必须是正整数');
      //   return;
      // }
      this.$refs['ruleForm'].validate((valid) => {
        res = valid;
      });
      return res;
    },
    add() {
      return addTemplate(this.formData);
    },
    modify() {
      return modifyTemplate(this.formData, this.formData.id);
    },
    submit() {
      this.loading = true;
      if (this.check()) {
        const submit = this.formData.id ? 'modify' : 'add';
        this[submit]().then((res) => {
          this.loading = false;
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          const message = this.formData.id ? '修改' : '添加';
          this.$alert(`${message}成功`, '成功', {
            confirmButtonText: '确定',
            callback: (action) => {
              this.gotoList();
            },
          });
        }).catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    },
    gotoList() {
      this.$router.replace({ name: 'notificationList' });
    },
  },
};
</script>
<style scoped>
.title {
  width: 400px;
}
.content {
  width: 600px;
}
.grey {
  color: #aaa;
  font-size: 13px;
  margin-top: 10px;
  margin-bottom:0;
}

.content .grey{
  margin-left: 100px;
}
.grey span{
  display: block;
  line-height: 22px;
}
.minutesInput {
  width: 80px;
}
.minutes {
  font-size: 14px;
}

.sendSetting{
  margin-bottom: 0;
}

.buttons{
  margin-top: 10px;
}
</style>

