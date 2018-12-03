<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="选择时间">
            <el-date-picker style="width:380px" v-model="search.select_date" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>

          <el-form-item v-if="!isProvider">
            <!-- <el-select clearable filterable class="filter-item" v-model="search.provider" placeholder="选择渠道">
              <el-option v-for="item in providers" :key="item.id" :label="item.provider" :value="item.id"></el-option>
            </el-select> -->
            <ProviderSelect v-model="search.provider"></ProviderSelect>
          </el-form-item>

          <el-form-item>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
          </el-form-item>
          <el-button class="exportBtn" type="primary" @click="handleExport">导出</el-button>
        </el-form>

      </div>

      <div>
        <el-tabs type="border-card" @tab-click="handleTabClick" :value="tab">
          <el-tab-pane name="all" label="全部">
            <AllTable ref="allTable" :search="search" :isProvider="isProvider"></AllTable>
          </el-tab-pane>
          <el-tab-pane name="leave" label="老师请假">
            <LeaveTable ref="leaveTable" :search="search" :isProvider="isProvider"></LeaveTable>
          </el-tab-pane>
          <el-tab-pane name="substitution" label="临时代课">
            <SubstitutionTable ref="substitutionTable" :search="search" :isProvider="isProvider"></SubstitutionTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getTeachersCourses, getProviders } from "@/api/api";
import { mapState } from "vuex";
import ProviderSelect from "@/views/resources/components/ProviderSelect.vue";
import AllTable from "./component/AllTable.vue";
import LeaveTable from "./component/LeaveTable.vue";
import SubstitutionTable from "./component/SubstitutionTable.vue";
import ExportCsv from "@/components/ExportCsv/index.js";

export default {
  components: {
    ProviderSelect,
    AllTable,
    LeaveTable,
    SubstitutionTable
  },
  data() {
    return {
      list: [], // table 数据
      loading: false,
      search: {
        select_date: [],
        provider: ""
      }, // 搜索条件
      providers: [], // 渠道
      tab: "all",
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }],
          disabledDate(currentDate){
            let now = new Date();
            let currentTime = currentDate.getTime(); 
            return currentTime < new Date(now.getFullYear()-1,now.getMonth(),now.getDate()).getTime() || currentTime > now.getTime()
          }
        },
    };
  },
  created() {
    let now = new Date();
    let theWeekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + 1
    );
    let theWeekEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + 7
    );
    if(theWeekEnd.getTime() > now.getTime()){
      theWeekEnd = now
    }
    this.search.select_date = [theWeekStart,theWeekEnd]

    this.getProviders();
  },

  // 方法集合
  methods: {
    // 获取数据
    getData() {
      this.$refs.allTable.handlePage(1);
      this.$refs.leaveTable.handlePage(1);
      this.$refs.substitutionTable.handlePage(1);
    },
    // 获取渠道信息
    getProviders() {
      getProviders(0)
        .then(res => {
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.providers = res.data;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // tab 切换
    handleTabClick(tabInstance) {
      this.tab = tabInstance.name;
    },
    handleExport() {
      // TODO:下面的现在是测试代码
      let columns = [
        { title: "姓名", prop: "name" },
        { title: "姓名2", prop: "name2" },
        { title: "姓名3", prop: "name3" }
      ];
      let rows = [
        { name: "a", name2: "1", name3: "a1" },
        { name: "b", name2: "2", name3: "a2" }
      ];
      ExportCsv("test1.csv", columns, rows);
    }
  }
};
</script>


<style scoped>
.exportBtn {
  float: right;
}
</style>
