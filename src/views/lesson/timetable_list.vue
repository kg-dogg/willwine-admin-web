<template>
    <div class='app-container'>
        <div class="handle-box">
            <el-button type="primary" @click="showMakeup" >补课</el-button>
            <el-button type="primary" @click='showSendMessage' >给老师留言</el-button>
            <!-- <el-button type="primary" >换老师</el-button> -->
            <el-button   @click='goBack'>返回</el-button>
        </div>
            <el-row class='info'>
                <el-col :span="8">
                    <p>学生姓名：{{data.student_name}}</p>
                    <p>开课时间：{{data.start_time}}</p>
                </el-col>
                <el-col :span="8">
                    <p>学生状态：<template v-if="data.learning_state == 'STUDYING'">在读</template><template v-else>休学</template></p>
                    <p>最后一节课：{{data.end_time}}</p>
                </el-col>
                <el-col :span="8" >
                    <p>督导老师：{{getSupList}}</p>
                </el-col>
            </el-row>
        <el-card class="box-card">
        <el-row class='lesson-info'>
            <el-col :span="4">应排课时：{{data.course_totle}}</el-col>
            <el-col :span="4">已排课时：{{data.course_schedule}}</el-col>
            <el-col :span="4" >已完成课时：{{data.finished}}</el-col>
            <el-col :span="4" >剩余课时：{{data.normal}}</el-col>
            <el-col :span="4" >补课：{{data.makeup_num}}</el-col>
        </el-row>
        <div class='list'>
            <TimetableItem v-for="(item,k) in lessons_normal" :data="{item:item, teachers:data.teachers, index:k, markups: markups(item)}" :key="item.id"
            @showLeave='showTeacherLeave'
            @showComment='showComment'>
            </TimetableItem>
        </div>
        </el-card>
        <!-- 弹窗 -->
        <MessageDialog :showDialog='dialog' :data="{recent_time:recent_time, sid:sid, cid:cid}"></MessageDialog>
        <TeacherLeaveDialog :showDialog='dialog'></TeacherLeaveDialog>
        <CommentDialog :showDialog='dialog'></CommentDialog>


    </div>
</template>
<script>
import TimetableItem from './components/TimetableListItem';
import MessageDialog from './components/MessageDialog';
import TeacherLeaveDialog from './components/TeacherLeaveDialog';
import CommentDialog from './components/CommentDialog';
import { getStudentSchedule } from "@/api/api";
export default {
  components:{
    TimetableItem,
    MessageDialog,
    TeacherLeaveDialog,
    CommentDialog,
  },
  data() {
    return {
      loading: false,
      data: '',
      sid: this.$route.query.student_id,
      cid: this.$route.query.curriculum_id,
      recent_time: '',
      lessons_normal: [],
      lessons_markup: [],
      dialog: {
        showMessage: false,
        showLeave: false,
        showComment: false,
      },
    };
  },
  // 计算属性
  computed: {
      getSupList() {
        if (this.data.teachers && this.data.teachers[this.data.supervisor_id]) {
          return this.data.teachers[this.data.supervisor_id].name;
        }
        return '-';
      }
  },
  created: function() {
      this.init();
  },
  methods:{
    // 获取初始数据
    init() {
      getStudentSchedule(this.sid, this.cid).then(res => {
        this.data = res.data
        this.lessons_normal = res.data.lessons.filter((item) => item.category == 'NORMAL')
        this.lessons_markup = res.data.lessons.filter(item => item.category == 'MAKEUPFOR')
      }).catch(() => {
        this.loading = false;
      })
    },
    // 给老师留言
    showSendMessage() {
      // 获取最近一节课的时间
      if (!this.data.lessons || this.data.lessons.length <= 0) {
        helper.message('error', '无法找到最近的排课信息');
        return;
      }

      let recent_lesson = _.head(this.data.lessons.filter((item) => {
        return item.status == 'NORMAL' && moment(item.scheduled_at) > moment()
      }));
      if (!recent_lesson) {
        helper.message('notice', '暂无即将上课的信息,无法留言');
        return;
      }

      this.recent_time = recent_lesson.scheduled_at;
      this.dialog.showMessage = true;
    },
    showTeacherLeave() {
        this.dialog.showLeave = true;
    },
    showComment() {
        this.dialog.showComment = true;
    },
    goBack() {
        this.$router.go(-1);
    },

    // 获取老师姓名
    getTeacherName(val) {
      if (this.data.teachers && this.data.teachers[val.teacher_id]) {
        return this.data.teachers[val.teacher_id].name;
      }
    },

    showMakeup() {
      this.$router.push({name: 'makeupLesson', query:{curriculum_id:this.cid, student_id: this.sid}});
    },

    // 获取某个课时是否有补课
    markups(item) {
      return this.lessons_markup.filter((m) => {
        return m.course_id == item.course_id
      })
    }




  },
};
</script>
<style scoped>
.app-container{
    font-size: 14px;
}
.handle-box {
  text-align: right;
}
.info{
    margin-bottom: 30px;
    padding: 0 15px;
}
.info p {
  padding-left: 10px;
  margin: 0;
  line-height: 40px;
}
.lesson-info {
  margin-top: 10px 0;
  padding-left: 5px;
}
.list {
    margin-top:10px;
}
</style>
