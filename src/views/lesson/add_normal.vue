<template>
    <div class="app-container">
        <el-card class="box-card">


                <el-form label-width="160px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item  label="学生姓名">
                                <el-input :value="studentName" disabled></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="订单产品名称">
                                <el-input :value="productName" disabled></el-input>
                            </el-form-item>

                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="课程">
                                <el-input :value="curriculumTitle" disabled></el-input>
                            </el-form-item>
                            <div style="margin-left:160px" v-if="selectCourseItem">所选课程详情: 共{{selectCourseItem.periods}}课时, 每课时{{selectCourseItem.duration}}分钟</div>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="是否异动课时">
                                <el-switch  v-model="course_add_type"  active-text="是" inactive-text="否" @change="transactionChange"></el-switch>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8" v-if="course_add_type">
                            <el-form :inline="true" >
                                <el-form-item label="输入异动课时">
                                    <el-input size="mini" v-model="transaction.start" placeholder="开始课时" maxlength=2 style="width:25%"></el-input>
                                    至 <el-input size="mini"  style="width:25%" maxlength=2  v-model="transaction.end" placeholder="结束课时"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>


                    </el-row>

                </el-form>
        </el-card>


        <el-card class="box-card" style="margin-top:20px">
            <lessonTime :finalDates.sync="finalDates" type="normal" @dataChange='clearTeacher'></lessonTime>
        </el-card>

        <hr>

        <el-form>
            <el-form-item>
                <el-button type="primary" @click="searchTeacher">查询符合条件的外教</el-button>
            </el-form-item>
        </el-form>

         <div v-if="teachers.length > 0" id='teacherList'>
            <hr />
            <el-card class="box-card" style="margin-top:20px;width:50%">
                <el-table  :data="teachers"  element-loading-text="加载中" border fit highlight-current-row empty-text="暂无可排课老师" >
                    <el-table-column label="头像"  width="180" align="center">
                        <template slot-scope="scope"><img :src="scope.row.avatar" width="50px" /></template>
                    </el-table-column>
                    <el-table-column prop="name"  label="老师" align="center"></el-table-column>
                    <el-table-column prop="course_number"  label="可排课课时数" align="center"></el-table-column>
                    <el-table-column label="操作" width="280" align="center">
                        <template slot-scope="scope">
                            <el-button class="el-icon-circle-plus" size="mini"  @click="chooseTeacher(scope.$index, scope.row)"> 确定排课</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <el-dialog title="确认排课" :visible.sync="centerDialogVisible" v-if="selectedTeacher" width="50%"  center>
            <span>老师: {{selectedTeacher.name}}</span>
            <span>学生: {{studentName}}</span>
            <span>已预约 {{sendDatasFinal.length}}课时</span>
            <el-form label-width="90px">
                <el-form-item label="选择时间">
                    <el-checkbox-group v-model="sendDatasFinal">
                        <el-checkbox v-for="(item, index) in sendDatas" :key="item" :label="item" name="type" :class="index == 0 ? 'ml30' : ''"></el-checkbox>

                    </el-checkbox-group>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
import { getSuborderDetail, getLessonTeathers, addLessonsNormal } from '@/api/api';
import lessonTime from '../../components/lesson_time';

export default {
  // 引入的组件列表
  components: {
    lessonTime,
  },
  data() {
    return {
      soid: this.$route.query.soid,
      orderDetail: {},
      product: [], // 产品包,暂时没有
      selectCurriculum: [],
      selectCourse: '', // 选择的课程
      courses: [], // 课程列表
      finalDates: [], // 最终计算完成后要传的时间数组
      curriculums: [],
      teachers: [],
      course_add_type: false,
      transaction: { start: '', end: '' },
      centerDialogVisible: false,
      selectedTeacher: null,
      sendDatas: [],
      sendDatasFinal: [],
    };
  },

  // 计算属性
  computed: {
    selectCourseItem() {
      return _.find(this.curriculums, ['id', this.selectCurriculum]);
    },
    studentName() {
      return (this.orderDetail.student && this.orderDetail.student.data.name) || '';
    },
    productName() {
      return (this.orderDetail.product && this.orderDetail.product.data.name) || '';
    },
    curriculumTitle() {
      return (this.orderDetail.curriculum && this.orderDetail.curriculum.data.title) || '';
    },
  },

  created() {
    // 获取子订单对应的相关信息
    getSuborderDetail(this.soid, { include: 'student,curriculum,product' }).then((res) => {
      this.orderDetail = res.data;
    });
  },

  // 方法集合
  methods: {
    searchTeacher() {
      if (!this.selectCurriculum) {
        helper.message('error', '请选择课程');
        return;
      }
      if (this.finalDates.length <= 0) {
        this.$message({ message: '请选择时间段', type: 'error' });
        return;
      }

      //  let sendDatasFinal = [];
      //   if (this.finalDates.length >= this.orderDetail.curriculum.data.periods) {
      //     sendDatasFinal = _.take(this.finalDates, this.orderDetail.curriculum.data.periods);
      //   } else {
      if (this.finalDates.length < this.orderDetail.curriculum.data.periods) {
        let num = this.orderDetail.curriculum.data.periods - this.finalDates.length;
        let pos = 0;
        let round = 1;
        const addDate = [];
        while (num > 0) {
          if (pos >= this.finalDates.length) {
            pos = 0;
            round += 1;
          }
          const tmp = moment(this.finalDates[pos]);
          addDate.push(tmp.add(7 * round, 'days').format('YYYY-MM-DD HH:mm:ss'));
          pos += 1;
          num -= 1;
        }
        this.finalDates = _.union(this.finalDates, addDate);
      }
      getLessonTeathers(this.soid, this.finalDates).then((res) => {
        this.teachers = res.data;
        if (this.teachers.length === 0) {
          this.$message({ message: '无符合条件的外教', type: 'error' });
          return false;
        }
        this.scrollToTeacherList();
        return true;
      });
    },
    clearTeacher() {
      this.teachers = []
    },

    scrollToTeacherList() {
      this.$nextTick(() => {
        const anchor = this.$el.querySelector('#teacherList');
        // $('html').animate({ scrollTop: anchor.offsetTop }, 500);
        document.querySelector('html').scrollTop = anchor.offsetTop;
      });
    },

    // 是否异动课程切换
    transactionChange(val) {
      // console.log("val:", val)
    },

    // 选择老师操作
    chooseTeacher(index, data) {
      this.centerDialogVisible = true;
      this.selectedTeacher = data;
      this.sendDatas = data.scheduled_at;
      this.sendDatasFinal = data.scheduled_at;
    },


    // 确认排课
    submit() {
      // 数据判断
      if (this.sendDatasFinal.length <= 0) {
        helper.message('error', '请选择排课时间');
        return;
      }
      if (!this.selectedTeacher || this.selectedTeacher == null) {
        helper.message('error', '请选择教室');
        return;
      }
      addLessonsNormal(this.soid, this.selectedTeacher.id, this.sendDatasFinal).then((res) => {
        this.$alert('排课成功!', '成功', {
          confirmButtonText: '确定',
          callback: (action) => { this.$router.replace({ name: 'lessonIndexNormal' }); },
        });
        this.centerDialogVisible = false;
      });
    },
  },
};
</script>


<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .ml30 {
      margin-left: 30px;
  }

</style>

