<template>
  <div class="app-container">
    <el-form label-width="100px">
      <el-form-item label="作业名称：">
        {{hwData.title}}
      </el-form-item>
      <el-form-item label="作业说明：">
        {{hwData.description}}
      </el-form-item>
      <el-form-item label="创建时间：">
        {{hwData.created_at}}
      </el-form-item>
      <el-form-item label="创建人：">
        {{hwData.user_name}}
      </el-form-item>
      <el-card class='quest homework-card' v-for ="(item, index) in hwData.jobtask && hwData.jobtask.data" :key="index">
        <div slot="header" class='task-header'>
          <el-row :span="24">
            <el-col :span="4">
              <el-form-item label-width='70px'>
                <span slot='label' class="card-header-select-label">试题{{index+1}}</span>
                {{taskTypeList[item.type]}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <span slot='label' class="card-header-select-label">模板</span>
                {{templateList[item.template]}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-card class='quest' shadow="never" v-if='item.material.description'>
          <div slot="header">
            <span class="section-title">材料</span>
          </div>
          <div v-html='item.material.description'></div>
        </el-card>
        <el-card class='quest' shadow="never" v-if='item.material.file_name'>
          <div slot="header">
            <span class="section-title">材料资源</span>
          </div>
          <div>{{item.material.file_name}}</div>
          <audioLyric
            :attachment="item.material.attachment"
            :audiosync="item.material"
            v-if='item.material.resource_path && item.material.file_type===fileType.AUDIO' ></audioLyric>
        </el-card>
        <el-card class='quest' shadow="never" v-if='item.sub_tasks.length > 0'>
          <div slot="header">
            <span class="section-title">题干</span>
          </div>
          <div class='quest-section' v-for='(quest, index) in item.sub_tasks' :key='index'>
            <div class="questTitle" >题干{{index + 1}}</div>
            <div v-html='quest.description'></div>
            <div>提交方式：{{methods[quest.method]}}</div>
          </div>
        </el-card>
        <el-card class='quest' shadow="never"  v-if='item.analysis[0].description'>
          <div slot="header">
            <span class="section-title">解析</span>
          </div>
          <div v-html='item.analysis[0].description'></div>
        </el-card>
        <el-card class='quest' shadow="never" v-if='item.analysis[0].resource_path'>
          <div slot="header">
            <span class="section-title">解析资源</span>
          </div>
          <div>{{item.analysis[0].file_name}}</div>
          <audioLyric
            :attachment="item.analysis[0].attachment"
            :audiosync="item.analysis[0]"
            v-if='item.analysis[0].resource_path && item.analysis[0].file_type===fileType.AUDIO' ></audioLyric>
        </el-card>
      </el-card>
    </el-form>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { getJob, getCourseInfo } from '@/api/api';
  import audioLyric from '@/components/audio_lyric';

  export default {
    components:{
      audioLyric
    },
    data(){
      return {
        id: this.$route.query.id,
        tag: this.$route.query.ver,
        hwData: {},
        fileType: {
          VIDEO: 'video',
          AUDIO: 'audio',
          IMAGE: 'image',
        }
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
      videoTypes() {
        return this.global.type.allow_video.split(',');
      },
      audioTypes() {
        return this.global.type.allow_audio.split(',');
      },
    },
    created() {
      this.getData();
    },
    methods: {
      getData(){
        getJob(this.id, this.tag).then((res) => {
          if(res.status_code !== 200){
            this.$message.error(res.message);
            return;
          }
          this.hwData = res.data;
          this.setClassInfo('查看');
        });
      },
      setClassInfo(type) {
        getCourseInfo(this.hwData.course_id).then((res) => {
          const data = res.data
          this.$route.matched[1].meta.title = `${type}作业（${data.stage}，${data.curriculum}，${this.hwData.type_tag}，${data.title}）`;
        });
      },
      judgeMp3(url) {
        if(!url) return;
        const suffix = url.match('mp3');
        if (!suffix) return false;
        return true;
      },
      judgeType(name, tp) {
        if(!name) return false; 
        const type = `.${name.split('.')[1].toLowerCase()}`;
        const typeList = tp === 'video' ? this.videoTypes : this.audioTypes;
        return typeList.some(item => item === type);
      },
    },
  }
</script>
<style scoped>
.el-form-item{
  margin-bottom: 0;
}
.card-header-select-label{
  padding-right: 10px;
  font-size: 18px;
}
.section-title{
  font-size:15px;
  font-weight: bold;
}
.quest{
  margin-bottom: 20px;
}
.quest-section{
  margin-bottom: 20px;
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


