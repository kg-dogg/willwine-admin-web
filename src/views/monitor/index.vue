<template>
  <div class="app-container">
    <div>
      <el-row class='info'>
        <el-col :span="6">
          <Clock class='clock'></Clock>
        </el-col>
        <el-col :span="6">
          <p>正在开课直播教室：<span class='red'>{{statics.liveroom || 0}}</span></p>
          <p>未进入教室学生：{{statics.studentNotIn || 0}}</p>
        </el-col>
        <el-col :span="6">
          <p>求助直播教室：{{statics.helproom || 0}}</p>
          <p>未进入教室老师：{{statics.teacherNotIn || 0}}</p>
        </el-col>
        <el-col :span="6">
          <el-radio-group v-model="listType" class='listTab'>
            <el-radio-button label="TableList">列表模式</el-radio-button>
            <el-radio-button label="VisualList" disabled>视频模式</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>

      <el-tabs type="border-card" @tab-click="tabChange" :value="roomType">
        <el-tab-pane name='all' label="全部直播教室">
          <TableList :data='listData' :meta='meta' @showAnswer='showAnswer'></TableList>
        </el-tab-pane>
        <el-tab-pane name='abnormal' label="异常教室">
          <TableList :data='abnormalData' :meta='meta' @showAnswer='showAnswer'></TableList>
        </el-tab-pane>
        <el-tab-pane name='help' label="求助教室">
          <TableList :data='helpData' :meta='meta' @showAnswer='showAnswer'></TableList>
        </el-tab-pane>
      </el-tabs>
    </div>
    <IM v-if='showHelp' @close='closeHelp'></IM>
  </div>
</template>
<script>
import { getMonitorStatics, getMonitorList } from "@/api/api";
import Clock from "@/components/Clock";
import TableList from "./components/TableList";
import VisualList from "./components/VisualList";
import IM from "@/components/IM";

export default {
  components: {
    Clock,
    TableList,
    VisualList,
    IM
  },
  data() {
    return {
      listType: "TableList",
      listData: [],
      roomType: "all",
      statics: {},
      showHelp: false,
      meta: [],
      loading: false,
      dataRefreshTast: null
    };
  },
  computed: {
    abnormalData() {
      return this.listData.filter(item => {
        return (
          item.teacherStatus === "off_line" || item.studentStatus === "off_line"
        );
      });
    },
    helpData() {
      return this.listData.filter(item => {
        return item.teacherHelpStatus || item.studentHelpStatus;
      });
    }
  },
  watch: {
    listType() {
      this.getData();
    }
  },
  created() {
    this.getData();
    // 定时刷新数据
    this.dataRefreshTast = setInterval(() => {
      this.getData();
    }, 2000);
  },
  beforeDestroy() {
    // 清楚定时任务
    clearInterval(this.dataRefreshTast);
  },
  methods: {
    closeHelp() {
      this.showHelp = false;
    },
    getData() {
      // 获取统计信息
      getMonitorStatics()
        .then(res => {
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.statics = res.data;
        })
        .catch(err => {
          this.$message.error(err);
        });
      this.loading = true;
      // 获取列表信息
      getMonitorList({ include: "student,teacher,curriculum" })
        .then(res => {
          this.loading = false;
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.listData = res.data;
          this.meta = res.meta;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    tabChange(tab) {
      this.roomType = tab.name;
      // this.getData();
    },
    showAnswer() {
      this.showHelp = true;
    }
  }
};
</script>
<style scoped>
.red {
  color: red;
}
.info {
  margin: 30px 0;
}
.clock {
  margin-top: 4px;
}
.noData {
  text-align: center;
  margin-top: 100px;
  color: #909399;
}
.listTab {
  margin-top: 10px;
}
.el-radio-button:focus:not(.is-focus):not(:active) {
  box-shadow: none;
}
</style>
