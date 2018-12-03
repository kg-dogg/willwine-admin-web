<template>
  <div class="app-container schedule">
    <div class="filter-container">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="选择时间">
          <el-date-picker style="width:450px" v-model="select_date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <el-button type="primary" icon="el-icon-search" @click="searchHandle">搜索</el-button>
        </el-form-item>

        <el-form-item style="float:right; margin-right:50px">
          <el-button v-if="hide" type="primary" @click="hideHandle">显示已有学生直播间</el-button>
          <el-button v-if="!hide" type="warning" @click="hideHandle">隐藏已有学生直播间</el-button>
        </el-form-item>
      </el-form>

    </div>

    <el-table :data="schedules" element-loading-text="加载中" border highlight-current-row v-loading="loading" empty-text="暂无数据" :cell-class-name="getCellClass" :header-row-class-name="getHeaderClass">
      <el-table-column prop="time" align="right" width="80" fixed>
      </el-table-column>

      <el-table-column v-for="day in schedules_day" :key="day" :label="day" align="center" >
        <template slot-scope="scope" v-if="hasLessons(scope.row, day)">
          <!-- <p v-for="lesson in scope.row[day]" :key="lesson.id" v-if="!hide && lesson.students" :class="'lesson-' + lesson.status">教室:{{lesson.room || '-'}} / 老师:{{lesson.teacher.data.name || '-'}}</p> -->
          <p v-for="lesson,index in scope.row[day]" :key="lesson.id" v-if="!hide && lesson.students">
            <el-tooltip placement="top">
            <div slot="content" v-html="getTagContent(lesson)"></div>
              <el-tag :type="getTagType(index)">{{lesson.room || '-'}} / {{lesson.teacher ? lesson.teacher.data.name || '-' : '未知'}}</el-tag>
            </el-tooltip>
          </p>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
// import { FullCalendar } from "vue-full-calendar";
// import "fullcalendar/dist/locale/zh-cn";

import { getLessonTable } from "../../api/api";

export default {
  components: {
    // FullCalendar
  },

  data() {
    return {
      select_date: "",
      schedulesData: [],
      // 课表数据
      schedules_time: [
        "08:00:00",
        "08:30:00",
        "09:00:00",
        "09:30:00",
        "10:00:00",
        "10:30:00",
        "11:00:00",
        "15:00:00",
        "15:30:00",
        "16:00:00",
        "16:30:00",
        "17:00:00",
        "17:30:00",
        "18:00:00",
        "18:30:00",
        "19:00:00",
        "19:30:00",
        "20:00:00",
        "20:30:00",
        "21:00:00",
        "21:30:00"
      ],
      schedules_day: [],
      schedules: [],
      loading: false,
      hide: false // 是否隐藏已有学生直播间
    };
  },

  created() {
    this.initDay().then(() => {
      this.getData();
    });
  },

  // 方法集合
  methods: {
    // 获取课表数据
    getData() {
      this.loading = true;
      getLessonTable(
        _.head(this.schedules_day),
        _.last(this.schedules_day),
        'teacher,student'
      ).then(res => {
        this.schedulesData = res.data;
        this.fliterData();
        this.loading = false;
      });
    },

    // 初始化日期
    initDay() {
      this.schedules_day = [];
      if (this.select_date && this.select_date.length === 2) {
        console.log(
          moment(this.select_date[1]).diff(this.select_date[0], "days")
        );
        for (
          let i = 0;
          i <= moment(this.select_date[1]).diff(this.select_date[0], "days");
          i += 1
        ) {
          this.schedules_day.push(
            moment(this.select_date[0])
              .add(i, "days")
              .format("YYYY-MM-DD")
          );
        }
      } else {
        // const start = moment();
        for (let i = 0; i < 7; i += 1) {
          this.schedules_day.push(
            moment()
              .add(i, "days")
              .format("YYYY-MM-DD")
          );
        }
      }
      return new Promise((resolve, reject) => resolve());
    },

    // 判断某列日期下是否有数据
    hasLessons(row, day) {
      if (_.has(row, day)) {
        return true;
      }
      return false;
    },

    getCellClass({ row, column, columnIndex }) {
      if (columnIndex === 0) {
        return "time";
      }
      return "td_old";
    },

    getHeaderClass({ row, rowIndex }) {
      return "schedule_table_header";
    },

    // 组装数据
    fliterData() {
      this.schedules = [];
      if (this.schedulesData.length <= 0) {
        // return
      }

      for (let j = 0; j < this.schedules_time.length; j += 1) {
        const lessons = {};
        for (let i = 0; i < this.schedules_day.length; i += 1) {
          const time = `${this.schedules_day[i]} ${this.schedules_time[j]}`;
          const lessonData = _.filter(this.schedulesData, [
            "scheduled_at",
            time
          ]);

          if (lessonData) {
            if (_.has(lessons, this.schedules_day[i])) {
              lessons[this.schedules_day].push(...lessonData);
            } else {
              lessons[this.schedules_day[i]] = lessonData;
            }
          }
        }

        // 找渲染数组的时间点是否已经有
        const idx = _.findIndex(this.schedules, [
          "time",
          this.schedules_time[j]
        ]);
        if (idx === -1) {
          lessons.time = this.schedules_time[j];
          this.schedules.push(lessons);
        } else {
          this.schedules[idx] = {
            ...this.schedules[idx],
            lessons
          };
        }
      }
      console.log(this.schedules);
    },

    // 搜索时间段
    searchHandle() {
      this.initDay().then(() => {
        this.getData();
      });
    },

    hideHandle() {
      this.hide = !this.hide;
    },
    getTagType(status) {
      switch (status) {
        case "NORMAL":
          return "";
        case "CANCELED":
          return "warning";
        case "FINISHED":
          return "info";
        case "PROGRESS":
          return "success";
        case "ABNORMAL":
          return "danger";
      }
      return "";
    },
    getTagContent(lesson){
      if(!lesson.teacher){
        return `教室:${lesson.room || '-'} <br/> 老师:未知 <br/> 状态:未知`;
      }
      switch (lesson.status) {
        case "NORMAL":
          return `教室:${lesson.room || '等待分配'} <br/> 老师:${lesson.teacher.data.name || '-'} <br/> 状态:正常`;
        case "CANCELED":
          return `教室:${lesson.room || '-'} <br/> 老师:${lesson.teacher.data.name || '-'} <br/> 状态:已取消`;
        case "FINISHED":
          return `教室:${lesson.room || '-'} <br/> 老师:${lesson.teacher.data.name || '-'} <br/> 状态:已结束`;
        case "PROGRESS":
          return `教室:${lesson.room || '-'} <br/> 老师:${lesson.teacher.data.name || '-'} <br/> 状态:上课中`;
        case "ABNORMAL":
          return `教室:${lesson.room || '-'} <br/> 老师:${lesson.teacher.data.name || '-'} <br/> 状态:老师请假`;
      }
      return `教室:${lesson.room || '-'} <br/> 老师:${lesson.teacher.data.name || '-'} <br/> 状态:未知`;
    }
  }
};
</script>


<style lang="scss">
/* @import 'fullcalendar/dist/fullcalendar.css'; */
.schedule {
  .time {
    // border-bottom: none;
    // border-left: none;
    color: brown;
  }
  .schedule_table_header {
    color: red;
  }
  .el-table__body {
    .lesson-NORMAL {
      color: #909399;
    }
    .lesson-CANCELED {
      color: #e6a23c;
    }
    .lesson-FINISHED {
      color: #67c23a;
    }
    .lesson-PROGRESS {
      color: #409eff;
    }
    .lesson-ABNORMAL {
      color: #f56c6c;
    }
  }
}
</style>

