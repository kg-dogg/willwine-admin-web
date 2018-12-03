<template>
  <div class="app-container">
    <el-form label-width="160px" :model='formData' :rules="rules" ref="ruleForm" v-loading="loading">
      <el-card>
        <el-row>
          <el-col :span='10'>
              <el-form-item label="姓名 full_name" prop="full_name">
                <el-input v-model='formData.full_name'  type='text' clearable placeholder="请输入外教名字"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span='10' :offset="1">
              <el-form-item label="外教简称 short_name" prop="short_name">
                  <el-input v-model='formData.short_name' type='text' clearable placeholder="请输入外教简称"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='10'>
            <el-form-item label="国籍 Nationality" prop="country_id">
              <el-select placeholder='请选择国籍' v-model='formData.country_id'>
                <el-option v-for='(item, index) in country' :key='index' :value='item._id' :label="item.c_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label="性别 Gender" prop="gender">
               <el-radio-group v-model="formData.gender" size="small">
                <el-radio-button v-for='(item,index) in genderList' :key='item.value' :label="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='10'>
              <el-form-item   label="邮箱 Email" prop="email">
                <el-input v-model='formData.email' type='text' clearable placeholder="请输入外教邮箱"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label="出生日期" prop="date_of_birth">
              <el-date-picker v-model='formData.date_of_birth' value-format="yyyy-MM-dd" type="date" placeholder="选择生日">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='10'>
              <el-form-item label="院校 graduate_from" prop="graduate_from">
                <el-input  v-model='formData.graduate_from'  type='text' clearable placeholder="请输入外教院校"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label="Degree" prop="degree">
              <el-select  placeholder='请选择' v-model="formData.degree"  v-if="global.param.forigen_teacher">
                <el-option v-for="(v, k) in global.param.forigen_teacher.degree" :key="k" :label="v" :value="k"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='10'>
              <el-form-item label="教龄" prop="teaching_experience" required>
                <el-select  placeholder='请选择' v-model="formData.teaching_experience"  v-if="global.param.forigen_teacher">
                  <el-option v-for="(v, k) in global.param.forigen_teacher.teaching_experience" :key="k" :label="v" :value="k"></el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label="附件简历" prop="resumes" required>
              <el-upload
                :action="upload_url"
                ref='portfolio'
                :limit="1"
                :data="{source: 'forigenteacher'}"
                :headers="myHeaders"
                :on-success="onUploadSuccess_resume"
                :before-remove="beforeRemove"
                :on-remove="handleRemove_resume"
                :file-list="formData.resumes">
              <el-button size='small' type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='10'>
              <el-form-item label="视频" prop="video" required>
                <el-input v-model='formData.video' type='text'  clearable placeholder="请输入视频链接" class='video'></el-input>
                <el-upload
                :disabled='formData.video.length>0'
                :action="upload_url"
                :headers="myHeaders"
                :limit="1"
                :file-list="formData.videoList"
                :data="{source: 'forigenteacher'}"
                :on-success="onUploadSuccess_video"
                :before-remove="beforeRemove"
                class='uploadVideo'>
              <el-button size='small' type="primary" :disabled='formData.video.length>0'>上传<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label="证书" required>
              <el-upload
                :action="upload_url"
                :limit="6"
                :headers="myHeaders"
                :data="{source: 'forigenteacher'}"
                :on-success="onUploadSuccess_certificate"
                :before-remove="beforeRemove"
                :on-remove="handleRemove_certificate"
                multiple
                :file-list="formData.certificateList"
                >

                <el-button size='small' type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='10'>
            <el-form-item   label="结算方式" prop="settlement_method">
              <el-select placeholder='请选择结算方式' v-model='formData.settlement_method' v-if="global.param.forigen_teacher">
                <el-option v-for='(item, index) in global.param.forigen_teacher.settlement' :key='index' :value='index' :label="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label="单价" prop="unit_price">
              <el-input v-model='formData.unit_price' type='text' clearable placeholder="请输入单价">
                <template slot="append">元/小时</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='10'>
            <el-form-item   label="开始时间" >
              <el-date-picker  v-model='formData.begin_at' type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label="品牌" prop="brand" required>
              <el-select placeholder='请选择品牌（可多选）' multiple v-model='formData.brand' v-if="global.param.forigen_teacher">
                <el-option v-for='(item, index) in global.param.forigen_teacher.brand' :key='index' :label="item" :value='index'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class='buyOut'>
        <el-row>
          <el-col :span='24'>
            <el-form-item   label="瑞思买断">
              <el-select placeholder='请选择周几' v-model='formData.week'>
                <el-option v-for='(item, index) in weeks' :key="index" :value='item'>{{item}}</el-option>
              </el-select>
              <el-time-select
                placeholder="起始时间"
                v-model="startTime"
                :picker-options="{
                  start: '08:00',
                  step: '01:00',
                  end: '22:00',
                  maxTime: endTime
                }">
              </el-time-select>
              —
              <el-time-select
                placeholder="结束时间"
                v-model="endTime"
                :picker-options="{
                  start: '08:00',
                  step: '01:00',
                  end: '22:00',
                  minTime: startTime
                }">
              </el-time-select>
              <el-button type="primary" icon='el-icon-plus' size="small" round @click='addTime'></el-button>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
           <el-form-item label="已选择时间" required prop="times">
             <el-tag
             class='time'
             v-for ='(item, index) in formData.times'
             :key = 'index'
              closable
              :disable-transitions="false"
              @close='deleteTime(item)'
              >{{item.name}}
            </el-tag>
           </el-form-item>
        </el-row>
      </el-card>
      <el-row>
        <el-col :span='24' class='buttons'>
          <el-form-item>
            <el-button type="primary" @click='validForm ' :loading="loading">提 交</el-button>
            <router-link :to="{name: 'teacherList'}"><el-button>取 消</el-button></router-link>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { globalUploadUrl,globalViewUrl, addTeacher, getCountry, getTeacherDetail, editTeacher } from '@/api/api';
import { mapState } from 'vuex';
export default {
  data(){
    return {
      id: this.$route.params.id,
      loading:false,
      formData: {
        full_name: '',
        short_name: '',
        country_id: '',
        email: '',
        gender: 'male',
        date_of_birth: '',
        graduate_from: '',
        degree: '',
        video: '',
        videoList: [],
        certificate: [], // String[]
        certificateList: [],
        resume: '',
        resumes: [],
        settlement_method: '',
        unit_price: '',
        begin_at: '',
        brand: '',
        times:[],
        week: '',
        teaching_experience: '',
      },
      uploadPools: {
        cert: []
      },
      country: [],
      genderList: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }],
      weeks:[ '周日', '周一', '周二', '周三', '周四', '周五', '周六'],

      week: '',
      startTime: '',
      endTime: '',
      // 上传
      upload_url: globalUploadUrl,
      myHeaders: {
        Authorization: `Bearer ${lockr.get('auth_token')}`,
      },

      rules: {
        full_name:[
          {required:true, message: '请输入英文名全称', trigger:['blur']}
        ],
        short_name: [
          {required:true, message: '请输入简称', trigger: ['blur']}
        ],
        gender: [
          {required:true, message: '请选择性别', trigger: ['blur', 'change']}
        ],
        country_id: [
          {required:true, message: '请选择国籍', trigger: ['blur', 'change']}
        ],
        email: [
          {required:true, message: '请输入邮箱地址', trigger: ['blur']},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur']}
        ],
        date_of_birth: [
          {required:true, message: '请选择出生日期', trigger: ['blur', 'change']},
        ],
        graduate_from: [
          {required:true, message: '请选择毕业院校', trigger: ['blur', 'change']},
        ],
        degree: [
          {required:true, message: '请选择学位', trigger: ['blur', 'change']},
        ],
        teaching_experience: [
          {required:true, message: '请选择教龄', trigger: ['blur', 'change']},
        ],
        video: [
          {required: true, message: '请输入或选择视频介绍', trigger: 'blur'},
          {type:'url', message: '请输入正确的视频URL', trigger: 'blur'}
        ],
        settlement_method: [
          {required:true, message: '请选择结算方式', trigger: 'blur'}
        ],
        unit_price: [
          {required:true, message: '请输入单价', trigger: 'blur'}
        ],
        brand: [
          {required:true, message: '请选择所属品牌', trigger: 'blur'}
        ],
        times: [
          {required:true, message:'请选择买断时间', trigger: 'change'}
        ],
        resumes: [
          {required:true, message: '请上传附件简历', trigger: 'change'}
        ]
      }

    }
  },

  created: function() {
      getCountry().then(res => {
        this.country = res.data
      });

      // 编辑数据获取
      if (this.id) {
        this.loading = true
        getTeacherDetail(this.id).then(res => {
          this.initModifyData(res.data);
          this.loading = false
        }).catch(e => this.loading = false)
      }
  },

  // 计算属性
  computed: {
    ...mapState(['global'])
  },

  methods: {
    addTime() {
      if (this.formData.week === '' || this.startTime === '' || this.endTime === '') {
        helper.message('error', '请选择买断的星期与时间!');
        return
      }
      const tags = [];
      tags.push({
        name: `${this.formData.week} ${this.startTime}-${this.endTime}`,
        week: this.formData.week,
        start: this.startTime,
        end: this.endTime
      });

      // 判断时间重复
      let timeError = false
      this.formData.times.filter(i => i.week == this.formData.week).forEach((v,k, a) => {
        if ((this.startTime >= v.start && this.startTime <= v.end)
         || (this.endTime >= v.start && this.endTime <= v.end)
         || (this.startTime <= v.start && this.endTime >= v.end)) {
          timeError = true
          return
        }
      })
      if (timeError) {
        helper.message('error', '已经选择了相同一天的日期,无法交叉选择');
        return
      }

      this.formData.times = _.unionBy(this.formData.times, tags, 'name');
    },

    // 移除tags
    deleteTime(time) {
      this.formData.times.splice(this.formData.times.indexOf(time), 1);
    },

    // 上传简历成功
    onUploadSuccess_resume(response, file, fileList) {
      this.formData.resumes = [{name:file.name, relative_resources_path:response.data.relative_resources_path}]
    },
    // 上传证书成功
    onUploadSuccess_certificate(response, file, fileList) {
      // cerificateList 存放上传文件，在保存提交时 将 url 写入 certificate
      if(response.status_code === 200){
        this.formData.certificateList.push({uid:file.uid,name:file.name, relative_resources_path:response.data.relative_resources_path})
      }
    },
    // 上传视频成功
    onUploadSuccess_video(response, file, fileList) {
      const cdnUrl = globalViewUrl.replace(/^\/\//,'https://')
      this.formData.video = cdnUrl + response.data.relative_resources_path
      this.formData.videoList = [{name:file.name, relative_resources_path:response.data.relative_resources_path}]
    },

    // 移除上传文件警告
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleRemove_resume(file, fileList) {
      this.formData.resumes = [];
    },
    handleRemove_certificate(file, fileList) {
      const deleteIndex = this.formData.certificateList.findIndex(item=>item.uid === file.uid && item.name === file.name);
      if(deleteIndex > -1){
        this.formData.certificateList.splice(deleteIndex, 1);
      }
    },
    handleRemove_video(file, fileList){
      this.formData.videoList = []
    },

    validForm() {
      const valid = this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
            this.submit();
          } else {
            return false;
          }
      });
    },

    // 提交
    submit() {
      if (this.formData.times.length <= 0) {
        helper.message('error', '请选择外教的买断时间!');
        return
      }

      if (this.formData.resumes.length <= 0) {
        helper.message('error', '请上传附件简历');
        return
      }

      if (this.formData.certificateList.length <= 0) {
        helper.message('error', '请上传证书');
        return
      }

      // 组装上课时间
      const times = {}
      this.formData.times.forEach((v,k,a) => {
        let weeknum = _.indexOf(this.weeks, v.week);
        if (_.has(times, weeknum)) {
          times[weeknum].push([v.start, v.end]);
        } else {
          times[weeknum] = [[v.start, v.end]];
        }
      })
      this.formData.work_time = times

      // 组装上传的简历
      this.formData.resume = _.head(this.formData.resumes).relative_resources_path;

      // 组装上传的证书
      this.formData.certificateList.forEach((v,k,a) => {
        this.formData.certificate.push(v.relative_resources_path);
      })

      this.loading = true
      if (this.id) {  // 修改操作
        editTeacher(this.id, this.formData).then(res => {
          this.$alert('外教修改成功!', '成功', {
              confirmButtonText: '确定',
              callback: (action) => {
                //this.$router.push({ name: 'jobsIndex' });
              },
            });
          this.loading = false
        }).catch(e => this.loading = false)
      } else {  // 新增操作
        addTeacher(this.formData).then(res => {
          this.$alert('外教新增成功!', '成功', {
              confirmButtonText: '确定',
              callback: (action) => {
                this.$router.push({ name: 'teacherList' });
              },
            });
          this.loading = false
        }).catch(e => this.loading = false)
      }

    },

    // 编辑时候的初始化数据
    initModifyData(data) {
       this.formData = {
        full_name: data.full_name,
        short_name: data.short_name,
        country_id: data.country_id,
        email: data.email,
        gender: data.gender || 'male',
        date_of_birth: data.date_of_birth,
        graduate_from: data.graduate_from,
        degree: data.degree,
        video: '',
        videoList: [],
        certificate: [],
        certificateList: [],
        resume: data.resume,
        resumes: [],
        settlement_method: data.settlement_method,
        unit_price: data.unit_price,
        begin_at: data.begin_at,
        brand: data.brand || '',
        times:[],
        week: '',
        teaching_experience: data.teaching_experience,
      };
      data.certificate.forEach((v,k,a) => {
        this.formData.certificateList.push({name:v, relative_resources_path: v});
      })
      this.formData.resumes = [{name:data.resume, relative_resources_path: data.resume}];


      Object.keys(data.work_time).forEach((v,k,a) => {
        let daydata = [];
        data.work_time[v].forEach((vv) => {
          let temp = {
            name: `${this.weeks[v]} ${vv[0]}-${vv[1]}`,
            week: this.weeks[v],
            start: vv[0],
            end: vv[1]
          }
          this.formData.times.push(temp);
        })
      })
    }
  }
}

</script>
<style scoped>
  .buyOut{
    margin: 20px 0;
  }
  .video{
    width: 253px
  }
  .uploadVideo{
    display: inline-block;
  }
  .time{
    margin-right: 10px;
  }
</style>

