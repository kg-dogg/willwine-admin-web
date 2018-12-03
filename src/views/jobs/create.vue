<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="form" label-width="80px">
        <el-form-item label="作业名称" style="width:271px;">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="作业类型">
          <el-select v-model="form.type" placeholder="请选择作业类型" v-if="global.param.jobs">
            <el-option v-for="(v,k) in global.param.jobs.job_type" :key="k" :label="v" :value="k">{{v}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加说明">
          <el-input type="explain" v-model="form.description"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="班型">
              <el-select v-if="global.param.curriculum" v-model="form.product_type" placeholder="请选择班型" @change="onOptionChange('product_type')">
                <el-option v-for="(v,k) in global.param.curriculum.product_type" :key="k" :label="v" :value="k" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="阶段">
              <el-select value-key="stage" v-if="global.param.curriculum" v-model="form.stage" placeholder="请选择阶段" @change="onOptionChange('stage')">
                <el-option v-for="(v,k) in global.param.curriculum.stage[form.product_type]" :key="k" :label="v" :value="k"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="课时">
              <el-select id="course" v-model="form.course_id" placeholder="请选择课时">
                <el-option v-if="courseOption" v-for="v in courseOption" :key="v.value" :label="v.label" :value="v.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>

        <el-form-item label="生效时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.available_from"></el-date-picker>
        </el-form-item>

        <el-form-item label="作业任务">
          <el-card class="box-card">
            <el-collapse v-model="activeNames">
              <el-collapse-item v-for="item in AddTask" :key="item.id" :name="item.index">
                <template slot="title">{{item.name}} <i class="el-icon-error" @click.stop="onDeleteTask(item)"></i></template>
                <el-form >
                  <el-form-item label="任务类型">
                    <el-select v-model="item.type" placeholder="请选择任务类型" v-if="global.param.jobs">
                      <el-option v-for="(v,k) in global.param.jobs.task_type" :key="k" :label="v" :value="k"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务内容">
                    <div><tinymce style="margin-left:68px; margin-right:5px" :height=400 v-model="item.description" ></tinymce></div>
                  </el-form-item>

                  <el-form-item label="提交方式">
                    <el-switch v-model="item.submit_type"  active-color="#13ce66" ></el-switch>
                  </el-form-item>
                  <el-form-item  v-if="item.submit_type">
                    <el-radio-group style="margin-left:30px" v-if="item.submit_type"
                                    v-model="item.method">
                      <el-radio v-for="(v,k) in global.param.jobs.method" v-if="k != 'NON' " :key="k" :label="k" >{{v}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="上传" style="margin-bottom:10px" class='jobRes'>
                    <div style="margin-left:68px">
                      <el-row>
                        <el-col :span="15">
                          <el-upload :limit="1" :ref="item.ref" class="upload-demo" :action="upload_url"
                            :headers="myHeaders"
                            :data="upLoadData"
                            :on-preview="(file)=>{
                                                          return resourcePreview({file},item)
                                                      }"
                            :on-success="(res, file) => {
                                                  return uploadResource({res, file}, item)
                                              }"
                            :on-remove="(file,fileList)=>{
                                                  return uploadRemoveResource({file,fileList},item);
                                              }"
                            :file-list="item.resource">
                            <el-button size="small" type="primary">任务资源</el-button>
                          </el-upload>
                        </el-col>

                        <el-col :span="21">
                          <el-input class='audioLyric' v-if="item.attachment_flag"  type="textarea"  :rows="7"  placeholder="请输入音频歌词"  v-model="item.attachment"></el-input>
                        </el-col>

                        <el-col :span="21">
                          <audioLyric :audiosync="item" v-if="item.audioLyric" ></audioLyric>
                        </el-col>
                      </el-row>
                    </div>
                  </el-form-item>
                  <el-form-item label="添加解析">
                    <div><tinymce style="margin-left:68px; margin-right:5px" :height=200 v-model="item.analysis[0].description" ></tinymce></div>

                  </el-form-item>
                  <el-form-item label="上传" style="margin-top:10px" class='jobRes'>
                    <div style="margin-left:68px">
                      <el-row>
                        <el-col :span="15">
                          <el-upload
                                    :limit="1" class="upload-demo"
                                    :action="upload_url"
                                    :headers="myHeaders"
                                    :data="upLoadData"
                                    :on-preview="(file)=>{
                                                                    return resourcePreview({file}, item.analysis[0])
                                                              }"
                                    :on-success="(res, file) => {
                                                          return uploadResource({res, file}, item.analysis[0])
                                                      }"
                                    :on-remove="(file,fileList)=>{
                                                            return uploadRemoveResource({file,fileList},item.analysis[0]);
                                                        }"
                                    :file-list="item.analysis[0].resource">
                            <el-button size="small" type="primary">解析资源</el-button>
                          </el-upload>
                        </el-col>
                        <el-col :span="21">
                          <el-input v-if="item.analysis[0].attachment_flag"
                                    type="textarea"
                                    :rows="7"
                                    placeholder="请输入音频歌词"
                                    v-model="item.analysis[0].attachment">

                          </el-input>
                        </el-col>
                        <el-col :span="21">
                          <audioLyric :audiosync="item.analysis[0]" v-if="item.analysis[0].audioLyric" ></audioLyric>
                        </el-col>
                      </el-row>
                    </div>
                  </el-form-item>
                </el-form>

              </el-collapse-item>

            </el-collapse>
          </el-card>
        </el-form-item>
        <el-form-item>
          <el-button medium style="width:30%" icon="el-icon-circle-plus" type="success" @click="onAddTask">添加任务</el-button>
        </el-form-item>
        <hr />

        <el-form-item>
          <el-button type="primary" @click="onSubmit">完成</el-button>
          <!--<el-button>取消</el-button>-->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce';
import { mapState } from 'vuex';
import { globalUploadUrl, addJobs, getJobCourse } from '../../api/api';
import audioLyric from '../../components/audio_lyric';

export default {
  // 引入的组件列表
  components: {
    audioLyric, Tinymce,
  },
  data() {
    return {
      upload_url: globalUploadUrl,
      // 上传
      // token
      myHeaders: {
        Authorization: `Bearer ${lockr.get('auth_token')}`,
      },
      upLoadData: {
        source: 'jobs',
      },
      form: {
        title: '',
        description: '',
        type: '',
        stage: '',
        product_type: '',
        course_id: '',
        available_from: '',
      },
      resource: [{ name: '', url: '', id: '' }],

      // 任务列表
      AddTask: [],

      // 当前任务数
      task_index: 0,

      // 面板展开数据
      activeNames: [],

      courseOption: [],
    };
  },

  // 计算属性
  computed: {
    ...mapState({

      global: 'global',

    }),
  },
  methods: {
    judgeMp3(url) {
      const suffix = url.match('mp3');
      if (!suffix) return false;
      return true;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 预览或播放弹出回调
    resourcePreview(file, task) {
      task.audioLyric = false;
      if (this.judgeMp3(task.resource_path)) {
        task.audioLyric = !task.audioLyric;
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    // 新增一个任务
    onAddTask() {
      this.task_index += 1;
      const nameString = `任务${this.task_index}`;
      this.activeNames.push(this.task_index);
      const task = {
        type: '', // 任务类型
        description: '', // 任务说明
        resource_id: '',
        method: '', // 资源提交方式多选的已选择label
        attachment: '',
        analysis: [
          {
            description: '',
            attachment: '',
            resource_id: '',

            resource: [],
            name: `${nameString} - 解析`,
            attachment_flag: false,
            resource_path: '',
            audioLyric: false,
          },
        ],

        index: this.task_index,
        name: nameString,
        submit_type: false, // 提交方式
        resource: [],
        attachment_flag: false, // 是否可以填入歌词
        resource_path: '',
        audioLyric: false,
      };
      this.AddTask.push(task);
    },

    // 删除一个任务
    onDeleteTask(item) {
      this.AddTask = this.AddTask.filter(i => i.index !== item.index);
      this.task_index--;
      this.AddTask.forEach((v,k,a) => {
        v.name = `任务${k+1}`
      })
    },

    // 任务资源上传回调
    uploadResource({ res, file }, task) {
      // const resource = [];

      const upRes = { name: file.name, file, id: res.data.resources_id, url: res.data.resources_path, uid: file.uid };
      task.resource.push(upRes);
      task.resource_id = res.data.resources_id;
      task.resource_path = res.data.resources_path;
      // 如果是mp3,则可以填写歌词

      if (this.judgeMp3(task.resource_path)) {
        task.attachment_flag = true;
      } else {
        task.attachment_flag = false;
      }
    },
    uploadRemoveResource({ file, fileList }, task) {
      const uid = file.uid;
      task.resource.forEach((v, k) => {
        if (v.uid === uid) {
          task.resource.splice(k, 1);
        }
      });
    },
    onOptionChange(option){
      switch (option){
        case 'product_type':
          this.form.stage = '';
          this.form.course_id = '';
          break;
        case 'stage':
          this.form.course_id = '';
          const stageOption = [];
          this.courseOption = [];
          getJobCourse(this.form.stage, this.form.product_type).then((res) => {
            if (!res.data) return;
            res.data.forEach((v, i) => {
              stageOption.push({ value: v.id, label: v.title });
            });
            this.courseOption = stageOption;
          });
          break;
        case 'course':
          break;
      }
    },
    submitData(data){
      if (data.title === '') return helper.message('error', '请填写作业名称');
      if (data.type === '') return helper.message('error', '请选择作业类型');
      if (data.product_type === '') return helper.message('error', '请选择班型');
      if (data.stage === '') return helper.message('error', '请选择阶段');
      if (data.course_id === '') return helper.message('error', '请选择课时');
      if (data.available_from === '') return helper.message('error', '请填写生效时间');
      if (data.tasks.length <= 0) return helper.message('error', '请添加至少1个任务!');


      let new_data = {};

      new_data.title = data.title;
      new_data.type = data.type;
      new_data.stage = data.stage;
      new_data.product_type = data.product_type;
      new_data.course_id = data.course_id;
      new_data.available_from = data.available_from;
      new_data.description = data.description;

      let tasks_ok = true;
      let tasks = [];
      data.tasks.forEach((v, i) => {
        tasks[i] = {};
        if (v.type === ''){ tasks_ok = false; helper.message('error', '第'+(i+1)+'个任务类型，请选择一个!');return;}
        if (v.description === '' && v.resource_id === ''){ tasks_ok = false; helper.message('error', '第'+(i+1)+'个任务详情和任务资源，二者必须有一个!');return;}
        if (v.method === ''){ tasks_ok = false; helper.message('error', '第'+(i+1)+'个任务打开提交方式，请选择一个!');return;}

        tasks[i]['type'] = v.type;
        tasks[i]['method'] = v.method;
        if(v.description !== '') tasks[i]['description'] = v.description;
        if(v.resource_id !== '') tasks[i]['resource_id'] = v.resource_id;
        if(v.attachment !== '') tasks[i]['attachment'] = v.attachment;

        if(v.analysis !== []){
          let analysis = [];
          v.analysis.forEach((v, i) => {
            analysis[i] = {};
            analysis[i]['description'] = v.description;
            analysis[i]['resource_id'] = v.resource_id;
            analysis[i]['attachment'] = v.attachment;
          })
          tasks[i]['analysis'] = analysis;
        }
      });
      new_data.tasks = tasks;
      if(!tasks_ok)return false;

      return new_data;
    },
    // 提交新增
    onSubmit() {
      this.AddTask.forEach((v,i) => {
        if (v.submit_type === false) {
          v.method = 'NON';
        }
      });
      const data = {
        ...this.form,
        available_from: this.form.available_from === '' ? '' : moment(this.form.available_from).format('YYYY-MM-DD 00:00:00'),
        tasks: this.AddTask,
      };

      const new_data = this.submitData(data);
      if(!new_data) return;
      addJobs(new_data).then((res) => {
        this.$alert('作业新增成功!', '成功', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$router.replace({ name: 'jobsIndex' });
          },
        });
      });
    },
  },
};
</script>
<style lang="less">
  .jobRes{
    .el-upload-list__item{
      width: auto;
      display: inline-block;
    }
  }
</style>

