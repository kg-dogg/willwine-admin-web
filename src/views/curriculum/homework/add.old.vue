<template>
  <div class="app-container">
    <el-form label-width="100px" ref="form" :model="form">
      <el-row :span="24">
        <el-col :span="12">
          <el-form-item label="作业名称" prop="title" :rules='titleRule'>
            <el-input 
              type="text" 
              clearable 
              v-model='form.title'
              :disabled="pageType === 'viewHomework'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="12">
          <el-form-item label="作业说明" prop="description">
            <el-input 
              type="textarea" 
              clearable 
              v-model='form.description'
              :disabled="pageType === 'viewHomework'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-card v-for='(item, index) in form.tasks' :key='item.uniqId' class='quest homework-card'>
        <div slot="header" class='task-header'>
          <el-row :span="24">
            <el-col :span="4">
              <el-form-item :prop="`tasks.${index}.type`" :rules='typeRule' label-width='80px' :ref='`type${index}`'>
                <span slot='label' class="card-header-select-label ">试题{{index+1}}</span>
                <el-select 
                  class="filter-item-select" 
                  clearable
                  placeholder='请选择所属任务类型'
                  v-model="form.tasks[index].type"
                  :disabled="pageType === 'viewHomework'">
                  <el-option v-for="(v,k) in taskTypeList" :key="k" :label="v" :value="k"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :prop="`tasks.${index}.template`" :rules='templateRule' :ref='`template${index}`'>
                <span slot='label' class="card-header-select-label">模板</span>
                <el-select
                  class="filter-item-select"
                  clearable
                  placeholder='请选择内容模板'
                  v-model="form.tasks[index].template"
                  :disabled="pageType === 'viewHomework'">
                  <el-option v-for="(v,k) in templateList" :key="k" :label="v" :value="k"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-button
              style="float: right; padding: 14px 0"
              type="text"
              @click="deleteTask(index)"
              :disabled="form.tasks.length===1"
              v-if="!form.effective_time">删除</el-button>
          </el-row>
        </div>
        <!-- 材料 -->
        <el-collapse v-model="activeName" class='resource'>
          <el-collapse-item :name="`${index}-resource`">
            <template slot="title">
              <div class='section-title'>材料</div>
            </template>
            <el-form-item :prop="`tasks.${index}.material.description`" label-width='0'>
              <Tinymce class='tinymce' v-model="item.material.description"></Tinymce>
            </el-form-item>
            <component :is='resUploadCom':item='item.material' source='jobs' :ref='`mUpload${index}`'></component>
          </el-collapse-item>
        </el-collapse>
        <!-- 题干 -->
        <div class='section-title'>题干</div>
        <div class='section-content'>
          <el-card class='quest' v-for='(quest, qIndex) in item.sub_tasks' :key='quest.uniqId' shadow="never">
            <div slot="header">
              <span class="card-header-select-label" style='font-size:14px;' a='asd'>题干{{qIndex+1}}</span>
              <el-button 
              style="float: right; padding: 3px 0"
              type="text"
              @click='deleteQuest(index,qIndex)'
              v-if="!form.effective_time">删除</el-button>
            </div>
            <el-form-item label-width='0'>
              <Tinymce class='tinymce' v-model="quest.description"></Tinymce>
            </el-form-item>
            <el-form-item label="提交方式" v-if='quest.description'>
              <el-radio-group v-model="quest.method">
                <el-radio v-for="(v,k) in methods" :key="k" :label="k" >{{v}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-card>
          <el-card class='quest' v-if="!form.effective_time" shadow="never">
            <el-button
              type="text"
              icon='el-icon-plus'
              @click='addQuest(index)'>新增题干</el-button>
          </el-card>
        </div>
        <!-- 解析 -->
        <el-collapse v-model="activeName" class='resource'>
          <el-collapse-item :name="`${index}-answer`">
            <template slot="title">
              <div class='section-title'>解析</div>
            </template>
            <el-form-item label-width='0'>
              <Tinymce class='tinymce' v-model='item.analysis[0].description'></Tinymce>
            </el-form-item>
            <component :is='resUploadCom' :item='item.analysis[0]' source='jobs' :ref='`aUpload${index}`'></component>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card class='quest' v-if="!form.effective_time">
        <el-button
          type="text"
          icon='el-icon-plus'
          @click='addTask'>新增试题</el-button>
      </el-card>
      <el-row>
        <el-col :span="24" style='text-align:right'>
          <el-button @click='reset("form")' v-if="pageType !== 'modifyHomework'">重置</el-button>
          <el-button type="primary" @click='submit'>保存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Lockr from 'lockr';
import { mapState } from 'vuex';
import Tinymce from '@/components/Tinymce';
import audioLyric from '@/components/audio_lyric';
import { addJob, getJob, modifyJob, getCourseInfo } from '@/api/api';
import resUpload from '../components/resUpload';

export default {
  components: {
    audioLyric,
    Tinymce,
    resUpload,
  },
  data(){
    return {
      resUploadCom: '',
      user_id: Lockr.get('user_detail').id,
      questNum: 2,
      id: this.$route.query.id,
      pageType: this.$route.name,
      //表单
      form: {
        title: '',
        type: this.$route.query.type,
        course_id: this.$route.query.courseId,
        curriculum_id:this.$route.params.id,
        description: '',
        tag: this.$route.query.tag,
        tasks:[
          {
            uniqId: _.uniqueId(),
            type: '',
            template: '',
            material: { description:"" },
            sub_tasks: [{ description: '', method: 'NON', uniqId: _.uniqueId()},],
            analysis: [{ description:'' }],
          },
        ]
      },
      formTamplate:{
        title: '',
        type: this.$route.query.type,
        course_id: this.$route.query.courseId,
        curriculum_id:this.$route.params.id,
        description: '',
        tag: this.$route.query.tag,
        tasks:[
          {
            type: '',
            template: '',
            material: { description:'' },
            sub_tasks: [{ description: '', method: 'NON', uniqId: _.uniqueId()}],
            analysis: [{ description:'' }],
          },
        ]
      },
      // 表单验证规则
      titleRule: { required: true, message: '请输入作业名称', trigger: 'change'},
      typeRule: { required: true, message: '请选择所属任务类型', trigger: 'change'},
      templateRule: { required: true, message: '请选择内容模板', trigger: 'change'},
      submitTypeRule: { required: true, message: '请选择提交方式', trigger: 'change' },

      activeName:[],// 材料、解析折叠
    }
  },
  computed: {
    ...mapState([
      'global',
    ]),
    taskTypeList(){
      return this.global.param.jobs && this.global.param.jobs.task_type;
    },
    templateList(){
      return this.global.param.jobs && this.global.param.jobs.task_template;
    },
    methods(){
      return this.global.param.jobs && this.global.param.jobs.method;
    },
    jobType() {
      return this.global.param.jobs && this.global.param.jobs.job_type[this.form.type];
    },
  },
  created(){
    if (this.id && this.pageType === 'modifyHomework') {
      this.getData();
      
    } else {
      this.setClassInfo('创建');
      this.resUploadCom = 'resUpload'
    }
  },
  methods:{
    setClassInfo(type) {
      getCourseInfo(this.form.course_id).then((res) => {
        const data = res.data
        this.$route.matched[1].meta.title = `${type}作业（${data.stage}，${data.curriculum}，${this.jobType}，${data.title}）`;
      });
    },
    getData() {
      getJob(this.id, this.form.tag).then((res) => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        const { title, description, type, jobtask:{ data }, course_id, effective_time } = res.data;
        data.forEach((item) => {
          item.uniqId = _.uniqueId();
          item.sub_tasks.forEach((qItem) => {
            qItem.uniqId = _.uniqueId();
          })
        });
        this.form = {
          title,
          description: description || '',
          type,
          course_id,
          effective_time,
          tasks: data,
          id: this.id,
          tag: this.$route.query.tag,
          curriculum_id:this.$route.params.id,
        }
        this.setClassInfo('编辑');
        this.resUploadCom = 'resUpload';
        // 如果 材料 有内容，则呈现展开状态
        data.forEach((taskItem,itemIndex)=>{
          if(taskItem.material.file_name || taskItem.material.description){
            this.activeName.push(`${itemIndex}-resource`);
          }
        });
      });
    },
    addTask(){ // 添加试题
      const template = JSON.parse(JSON.stringify(this.formTamplate.tasks[0]));
      template.uniqId = _.uniqueId();
      template.sub_tasks[0].uniqId = _.uniqueId();
      this.form.tasks.push(template);
    },
    addQuest(index){ // 添加题干
      this.form.tasks[index].sub_tasks.push({ description: '', method: 'NON', uniqId: _.uniqueId() });
    },
    deleteQuest(index,qIndex){// 试题index,题干index
      this.$confirm(`你确定要删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.tasks[index].sub_tasks.splice(qIndex, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });   
      });
    },
    deleteTask(index){// 试题index
      this.$confirm(`你确定要删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.form.tasks.splice(index, 1);
      }).catch((err) => {
        console.log(err);
        this.$message({
          type: 'info',
          message: '已取消删除'
        });   
      });
    },
    reset(){ //重置
      this.form = JSON.parse(JSON.stringify(this.formTamplate));
      this.$refs.form.resetFields();
      this.activeName=[];
      this.$forceUpdate();
    },
    submit(){
      const valid = this.validate();
      if(!valid){
        return false;
      }
      this.form.user_id = this.user_id;
      console.log(this.form);
      this.submitType().then((res) => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.$message({
          message: '保存成功',
          type: 'success'
        });
        this.$router.replace({
          name: 'homeworkList',
          query: {
            tag: this.$route.query.tag,
            course_id: this.$route.query.course_id,
            page: this.$route.query.page,
          }
        });
      })
    },
    validate(){
      const tasks = this.form.tasks;
      let validate = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          tasks.forEach((item,index) => {
            const questions = item.sub_tasks.filter((qItem) => qItem.description);
            if (questions.length < item.sub_tasks.length && this.pageType === 'modifyHomework') {
              this.$message.error('题干不能为空');
              validate = false;
            }
            if (!(questions.length > 0 || item.material.description || item.material.resource_id)){
              this.$message.error('题干、材料、材料资源不能全部为空');
              validate = false;
            }
          });
        } else {
          this.$message.error('必填内容不能为空');
          validate =  false;
        }
      });
      return validate;
    },
    submitType(){
      if (this.id && this.pageType === 'modifyHomework') {
        return modifyJob(this.id, this.form)
      }
      return addJob(this.form)
    }

  },
}
</script>
<style scoped>
.card-header-select-label{
  padding-right: 10px;
  font-size: 18px;
}
.tinymce{
  margin-bottom: 20px;
}
.radioGroup label{
  margin-bottom: 0;
}
.resource{
  margin-bottom: 15px;
}
.quest{
  margin-bottom: 20px;
}
.section-title{
  font-size:14px;
  font-weight: bold;
}
.section-title{
  margin-bottom: 15px;
}
.section-content{
  margin-bottom: 15px;
}
.app-container label{
  margin-bottom: 0;
}
</style>
<style>
.homework-card .el-form-item{
  margin-bottom: 0;
}
.homework-card .task-header .el-card__header{
  padding-bottom: 8px;
}
.homework-card label{
  margin-bottom: 0;
}
</style>


