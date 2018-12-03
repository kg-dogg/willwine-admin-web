<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="form" label-width="80px">
        <el-form-item label="作业名称" style="width:271px;">
          <el-input v-model="form.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="作业类型">
          <el-select v-model="form.type" placeholder="请选择作业类型" v-if="global.param.jobs" disabled>
            <el-option v-for="(v,k) in global.param.jobs.job_type" :key="k" :label="v" :value="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加说明">
          <el-input type="explain" v-model="form.description" disabled></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="班型">
              <el-select v-if="global.param.curriculum" v-model="form.product_type"  placeholder="请选择班型" disabled>
                <el-option v-for="(v,k) in global.param.curriculum.product_type" :key="k" :label="v" :value="k"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="阶段">
              <el-select value-key="stage" v-if="global.param.curriculum" v-model="form.stage" placeholder="请选择阶段" @change="onStageChange" disabled>
                <el-option v-for="(v,k) in global.param.curriculum.stage[form.product_type]" :key="k" :label="v" :value="k"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="课时">
              <el-select id="course" v-model="form.course_id" placeholder="请选择课时" disabled>
                <el-option v-if="courseOption" v-for="v in courseOption" :key="v.value" :label="v.label" :value="v.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <el-form-item label="生效时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.available_from" disabled></el-date-picker>
        </el-form-item>

        <el-form-item label="作业任务">
          <el-card class="box-card">
            <el-collapse v-model="activeNames">
              <el-collapse-item v-for="item in AddTask" :key="item.id" :name="item.index">
                <template slot="title">{{item.name}} <i class="el-icon-error" @click.stop="onDeleteTask(item)"></i></template>
                <el-form >
                  <el-form-item label="任务类型">
                    <el-select v-model="item.type" placeholder="请选择任务类型" v-if="global.param.jobs" disabled>
                      <el-option v-for="(v,k) in global.param.jobs.task_type" :key="k" :label="v" :value="k"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务内容">
                    <div v-html="'<br>'"></div>
                    <div v-html="item.description"></div>
                  </el-form-item>
                  <el-form-item label="提交方式">
                    <el-switch v-model="item.submit_type"  active-color="#13ce66" disabled></el-switch>
                  </el-form-item>

                  <el-form-item  v-if="item.submit_type">
                    <el-radio-group style="margin-left:30px" v-if="item.submit_type" disabled
                                    v-model="item.method">
                      <el-radio v-for="(v,k) in global.param.jobs.method" v-if="k != 'NON' " :key="k" :label="k" >{{v}}</el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item label="添加解析">
                    <div v-html="item.analysis[0].description"></div>
                  </el-form-item>
                  <el-form-item label="上传" class='jobRes'>
                    <div style="margin-left:68px">
                      <el-row>
                        <el-col :span="15">
                          <el-upload :limit="1" :ref="item.ref" class="upload-demo" disabled :action="upload_url"
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
                            <!-- <el-button size="small" type="primary">任务资源</el-button> -->
                          </el-upload>
                        </el-col>

                        <el-col :span="21">
                          <el-input v-if="item.attachment_flag"  disabled type="textarea"  :rows="7"  placeholder="请输入音频歌词"  v-model="item.attachment"></el-input>
                        </el-col>

                        <el-col :span="21">
                          <audioLyric :attachment="item.attachment" :audiosync="item" v-if="item.audioLyric" ></audioLyric>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="15">
                          <el-upload style="margin-top:10px" disabled
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
                            <!-- <el-button size="small" type="primary">解析资源</el-button> -->
                          </el-upload>
                        </el-col>
                        <el-col :span="21">
                          <el-input v-if="item.analysis[0].attachment_flag" disabled
                            type="textarea"
                            :rows="7"
                            placeholder="请输入音频歌词"
                            v-model="item.analysis[0].attachment">
                          </el-input>
                        </el-col>
                        <el-col :span="21">
                          <audioLyric :attachment="item.analysis[0].attachment" :audiosync="item.analysis[0]" v-if="item.analysis[0].audioLyric" ></audioLyric>
                        </el-col>
                      </el-row>
                    </div>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-form-item>
        <hr />
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Tinymce from '@/components/Tinymce';
import { globalUploadUrl, patchJobs, getJobCourse, getJobDetail } from '@/api/api';
import audioLyric from '@/components/audio_lyric';

export default {
  // 引入的组件列表
  components: {
    audioLyric, Tinymce,
  },
  created() {
    const id = this.$route.query.id;
    getJobDetail(id).then((res) => {
      this.id = res.data.id;

      this.onForm(res.data);
      const onAddTask = v => this.onAddTask(v);
      res.data.jobtask.data.forEach((v, i) => {
        onAddTask(v);
      });

      this.onStageChange();
    });

    this.judgeMp3('a34979e8-6e21-11e8-9f14-f194b015801d.mp3');
  },
  data() {
    return {
      upload_url: globalUploadUrl,
      // 上传
      // token
      myHeaders: {
        Authorization: `Bearer${localStorage.getItem('auth_token')}`,
      },
      upLoadData: {
        source: 'jobs',
      },
      id: '',
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
      if (this.judgeMp3(task.resource_path)) {
        if (task.audioLyric) {
          task.audioLyric = false;
        } else {
          task.audioLyric = true;
        }
      } else {
        task.audioLyric = false;
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 添加属性
    onForm(form) {
      this.form.title = form ? form.title : '';
      this.form.description = form ? form.description : '';
      this.form.type = form ? form.type : '';
      this.form.stage = form ? form.stage : '';
      this.form.product_type = form ? form.product_type : '';
      this.form.course_id = form ? form.course_id : '';
      this.form.available_from = form ? form.available_from : '';
    },
    // 新增一个任务
    onAddTask(oTask = {}) {
      let oneTask = oTask;

      const analysis = oneTask.analysis ? oneTask.analysis[0] : '';

      this.task_index += 1;
      const nameString = `任务${this.task_index}`;
      this.activeNames.push(this.task_index);
      const task = {
        type: oneTask ? oneTask.type : '', // 任务类型
        description: oneTask ? oneTask.description : '', // 任务说明
        resource_id: oneTask ? oneTask.resource_id : '',
        method: (oneTask && oneTask.method !== 'NON') ? oneTask.method : '', // 资源提交方式多选的已选择label
        attachment: oneTask ? oneTask.attachment : '',

        analysis: [
          {
            description: analysis ? analysis.description : '',
            resource_id: analysis.resource_id,
            attachment: analysis ? analysis.attachment : '',

            resource: (analysis && analysis.resource_path)  ? [{ url: analysis.resource_path, id: analysis.resource_id, name: analysis.file_name }] : [],
            name: `${nameString} - 解析`,
            attachment_flag: !!((analysis && this.judgeMp3(analysis.resource_path))),
            resource_path: analysis ? analysis.resource_path : '',
            audioLyric: false,
          },
        ],

        index: this.task_index,
        name: nameString,
        submit_type: !!((oneTask && oneTask.method !== 'NON')), // 提交方式


        resource: (oneTask && oneTask.resource_path) ? [{ url: oneTask.resource_path, id: oneTask.resource_id, name: oneTask.file_name }] : [],
        attachment_flag: !!((oneTask && this.judgeMp3(oneTask.resource_path))),
        resource_path: oneTask ? oneTask.resource_path : '',
        audioLyric: false,
      };
      this.AddTask.push(task);
    },
    // 删除一个任务
    onDeleteTask(item) {
      this.AddTask = this.AddTask.filter(i => i.index !== item.index);
    },

    // 任务资源上传回调
    uploadResource({ res, file }, task) {
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

    // 提交新增
    onSubmit() {
      if (this.form.title === '') {
        helper.message('error', '请填写作业名称');
        return;
      }
      if (this.form.type === '') {
        helper.message('error', '请选择作业类型');
        return;
      }
      if (this.AddTask.length <= 0) {
        helper.message('error', '请添加至少1个任务!');
        return;
      }

      this.AddTask.forEach((v, k) => {
        if (v.submit_type === false) {
          v.method = 'NON';
        }
      });
      const data = {
        ...this.form,
        available_from: this.form.available_from === '' ? '' : moment(this.form.available_from).format('YYYY-MM-DD 00:00:00'),
        tasks: this.AddTask,
      };

      patchJobs(this.id, data).then((res) => {
        this.$alert('作业编辑成功!', '成功', {
          confirmButtonText: '确定',
          callback: (action) => { this.$router.replace({ name: 'jobsIndex' }); },
        });
      });
    },
    onStageChange(val) {
      const option = [];
      this.courseOption = [];
      getJobCourse(this.form.stage, this.form.product_type).then((res) => {
        if (!res.data) return;
        res.data.forEach((v, i) => {
          option.push({ value: v.id, label: v.title });
        });
        this.courseOption = option;
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

