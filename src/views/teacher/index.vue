<template>
  <div class="app-container">
    <el-button style="float:right; margin-right:10%" type="primary" @click="gotoAdd()" v-if="hasProviderPower">新建外教</el-button>

    <div class="filter-container">
      <el-input style="width: 300px;" class="filter-item" placeholder="输入外教名" v-model="search.name"></el-input>
      <!-- <el-select clearable class="filter-item" v-model="search.status" placeholder="状态">
        <el-option label="考核中" value="0"></el-option>
        <el-option label="在职" value="0"></el-option>
        <el-option label="停用" value="0"></el-option>
      </el-select> -->
      <ProviderSelect v-model="search.provider_id" v-if="!isProvider"></ProviderSelect>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchHandle">搜索</el-button>

    </div>

    <el-alert title="" type="info" show-icon :closable="false">
      <span>总人数: {{pagination.total}} </span>
      <span style="margin-left:20px;">在职: {{meta.activated_total}} </span>
      <span style="margin-left:20px">停用: {{meta.banned_total}} </span>
    </el-alert>

    <el-table :data="teachers" element-loading-text="给我一点时间" fit v-loading="loading" empty-text="暂无数据" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="外教简称:">
              <span>{{ props.row.short_name }}</span>
            </el-form-item>
            <el-form-item label="邮箱:">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="性别:">
              <span>{{ props.row.gender }}</span>
            </el-form-item>
            <el-form-item label="出生日期:">
              <span>{{ props.row.date_of_birth }}</span>
            </el-form-item>
            <el-form-item label="毕业院校:">
              <span>{{ props.row.graduate_from }}</span>
            </el-form-item>
            <el-form-item label="学位:">
              <span>{{ global.param.forigen_teacher.degree[props.row.degree] }}</span>
            </el-form-item>
            <el-form-item label="教龄:">
              <span>{{ global.param.forigen_teacher.teaching_experience[props.row.teaching_experience] }}</span>
            </el-form-item>
            <el-form-item label="附件简历:">
              <span>
                <a :href="props.row.resume | cdn_img" target="_blank">查看</a>
              </span>
            </el-form-item>
            <el-form-item label="视频:">
              <!-- <span>{{ props.row.video }}</span> -->
              <span>
                <a :href="props.row.video | cdn_img" target="_blank">查看</a>
              </span>
            </el-form-item>
            <el-form-item label="证书:">
              <span>
                <a v-for="(v,k) in props.row.certificate" :key="k" :href="v | cdn_img" target="_blank" style="margin-right:5px">查看{{k+1}}</a>
              </span>
            </el-form-item>
            <hr />
            <el-form-item label="入职瑞思时间:">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
            <el-form-item label="结算方式:">
              <span>{{ global.param.forigen_teacher.settlement[props.row.settlement_method] }}</span>
            </el-form-item>
            <el-form-item label="总学生数:">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
            <el-form-item label="请假次数:">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
            <el-form-item label="迟到次数:">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="user_id" label="ID" width="70"></el-table-column>
      <el-table-column prop="full_name" label="Full Name" width="180"></el-table-column>
      <el-table-column prop="c_country" label="国籍"></el-table-column>
      <el-table-column prop="work_time" label="买断时间" width="100">
        <template slot-scope="scope">
          <workTimeCell :value="scope.row.work_time"></workTimeCell>
          <!-- <template v-for="(v,week) in scope.row.work_time" >
              <el-tag style="margin-top:5px" v-for="vv in v" :key="`${weeks[week]}: ${vv[0]}~${vv[1]}`" disable-transitions>{{weeks[week]}}: {{vv[0]}}~{{vv[1]}}</el-tag>
            </template> -->
        </template>
      </el-table-column>
      <el-table-column prop="student_total" label="当前学生"></el-table-column>
      <el-table-column prop="lesson_total" label="已排新课时"></el-table-column>
      <el-table-column prop="week_status" label="状态" :filters="[{ text: '启用', value: 'started' }, { text: '停用', value: 'stoped' }]" :filter-method="filterStatus">
        <template slot-scope="scope" v-if="global.param.forigen_teacher">
          {{global.param.forigen_teacher.week_status[scope.row.week_status]}}
        </template>
      </el-table-column>
      <el-table-column prop="brand" label="品牌标签" :filters="brandTag" :filter-method="filterBrand" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag v-for="v in scope.row.brand" :key="v" disable-transitions>{{v}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="300">
        <template slot-scope="scope">
          <p>
            <router-link :to="{name:'modifyTeacher', params:{id: scope.row.user_id}}" v-if="hasProviderPower">
              <el-button class="el-icon-edit" size="mini"> 编辑</el-button>
            </router-link>
            <el-button class="el-icon-zoom-in" size="mini" @click="gotoTimeTable(scope.row)"> 课表</el-button>
            <el-button class="el-icon-edit-outline" size="mini" @click="editDescription(scope.row)" v-if="!isProvider"> 编辑介绍</el-button>
          </p>
          <p>
            <el-button v-if="scope.row.week_status == 'activated' || scope.row.week_status == 'will_activate'" class="el-icon-zoom-in" size="mini" @click="stop(scope.row)">停用</el-button>
            <el-button v-else-if="scope.row.week_status == 'banned' || scope.row.week_status == 'initial'" class="el-icon-zoom-in" size="mini" @click="start(scope.row)">启用</el-button>
            <el-button v-else-if="scope.row.week_status == 'will_ban'" class="el-icon-zoom-in" size="mini" @click="start(scope.row)">已停用</el-button>
            <el-button class="el-icon-time" size="mini" @click="leaving(scope.row.user_id)" v-if="hasProviderPower"> 请假</el-button>
          </p>

        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :page-size="pagination.per_page" :current-page="pagination.current_page" @current-change="page" :total="pagination.total"></el-pagination>
    </div>

    <el-dialog title="停用" :visible.sync="stopDialogVisible" width="30%" center>
      <el-alert style="margin-bottom:20px" title="停用后，这个外教不会再被排新课。但已经排好课的外教需要继续完成授课工作。特殊情况可以通过换老师功能处理。" type="info" show-icon :closable="false"></el-alert>
      <span>
        <el-date-picker style="width:100%" v-model="stopDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stopDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmStop" :loading="stopLoading">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="启用" :visible.sync="startDialogVisible" width="30%" center>
      <el-alert style="margin-bottom:20px" title="启用即刻生效，请慎重！" type="info" show-icon :closable="false"></el-alert>
      <span v-if="currData.week_status == 'will_ban' || currData.week_status == 'banned'">停用起始时间: {{currData.week_at}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="startDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmStart" :loading="stopLoading" v-if="currData.week_status == 'initial'">启用</el-button>
        <el-button type="primary" @click="confirmStart" :loading="stopLoading" v-else>重新启用</el-button>
      </span>
    </el-dialog>

    <!-- 请假弹出框 -->
    <el-dialog title="请假" :visible.sync="leaveDialogVisible" center>
      <div>{{currData.full_name}}</div>
      <!-- <el-form label-width="80px">
        <el-form-item label="选择时间">
          <el-date-picker v-model="leaveRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </el-form> -->

      <el-form label-width="80px" label-position="top">
        <el-card>
          <el-form-item>
            <slot name="label">已请假/总排课数 ({{leavingCnt}} / {{lessonsCnt}})</slot>
            <el-checkbox-group v-model="is_leaved" size="mini" v-if="currData.lessons">
              <el-checkbox v-for="(v,k) in currData.lessons.data" :class="k == 0 ? 'checkboxFirst' : ''" :label="v._id" border :key="v._id" :disabled="leaveCan(v.scheduled_at, v.is_leave)" :checked="v.is_leave == 1">{{v | timeRange}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-card>

        <el-input style="margin-top:20px" type="textarea" :rows="3" placeholder="请输入请假原因,100字以内" v-model="leaveReason"></el-input>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLeaving">取 消</el-button>
        <el-button type="primary" @click="confirmLeaving" :loading="leavingLoading">提交</el-button>
      </span>
    </el-dialog>

    <!-- 编辑介绍弹出框 -->
    <dialog-des :showDialog="dialog" :teacher.sync="currData"></dialog-des>
  </div>
</template>
<script>
import {
  getTeachers,
  stopTeacher,
  startTeacher,
  getTeacherDetail,
  addTeacherLeaving
} from "@/api/api";
import { mapState } from "vuex";
import dialogDes from "./component/dialogDes";
import workTimeCell from "./component/workTimeCell.vue";
import ProviderSelect from "@/views/resources/components/ProviderSelect.vue";
export default {
  // 引入的组件列表
  components: {
    dialogDes,
    workTimeCell,
    ProviderSelect
  },
  data() {
    return {
      loading: false,
      stopLoading: false,
      leavingLoading: false,
      stopDialogVisible: false,
      startDialogVisible: false,
      leaveDialogVisible: false,

      dialog: {
        descDialogVisible: false
      },
      teachers: [],
      pagination: { current_page: 0 },
      meta: {},
      search: {
        name: "",
        provider_id: ""
      },
      stopDate: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      currData: {},
      weeks: [
        "每周日",
        "每周一",
        "每周二",
        "每周三",
        "每周四",
        "每周五",
        "每周六"
      ],
      leaveRange: [],
      leaveData: [],
      leaveReason: "",
      is_leaved: []
    };
  },

  created: function() {
    this.init();
  },

  // 计算属性
  computed: {
    ...mapState(["global"]),
    brandTag() {
      let brands = [];
      if (this.global.param.forigen_teacher) {
        Object.keys(this.global.param.forigen_teacher.brand).forEach(v => {
          brands.push({
            text: this.global.param.forigen_teacher.brand[v],
            value: v
          });
        });
      }
      return brands;
    },
    leavingCnt() {
      return this.is_leaved.length || 0;
    },
    lessonsCnt() {
      if (this.currData.lessons) {
        return this.currData.lessons.data.length;
      } else {
        return 0;
      }
    },
    hasProviderPower(){
      return this.isProvider || this.isAdmin;
    }
  },

  methods: {
    // 初始化列表数据
    init() {
      this.loading = true;
      // 渠道方账户设置 provider_id
      this.search.provider_id = this.$store.getters.getAuthUser().profile.provider_id || ''
      getTeachers(this.pagination.current_page, this.search)
        .then(res => {
          this.teachers = res.data;
          this.pagination = res.meta.pagination;
          this.meta = res.meta;
          this.loading = false;
        })
        .catch(e => (this.loading = false));
    },

    // 筛选品牌
    filterBrand(value, row) {
      return _.indexOf(row.brand, value) === -1 ? false : true;
    },
    // 筛选状态
    filterStatus(value, row) {
      if (value == "started") {
        return row.week_status === "activated" || row.week_status == "will_ban";
      } else {
        return (
          row.week_status === "initial" ||
          row.week_status == "will_activate" ||
          row.week_status == "banned"
        );
      }
    },

    gotoAdd() {
      this.$router.push({ name: "addTeacher" });
    },

    // 停用外教
    stop(row) {
      this.currData = row;
      this.stopDialogVisible = true;
    },
    confirmStop() {
      if (this.stopDate == "") {
        helper.message("error", "请选择停用日期!");
        return;
      }

      this.stopLoading = true;
      stopTeacher(this.currData.user_id, this.stopDate)
        .then(res => {
          helper.message("success", "停用外教成功!");
          this.stopDialogVisible = false;
          this.stopLoading = false;
          this.stopDate = "";
          this.init();
        })
        .catch(e => {
          this.stopLoading = false;
        });
    },

    // 启用外教
    start(row) {
      this.currData = row;
      this.startDialogVisible = true;
    },
    confirmStart() {
      this.stopLoading = true;
      startTeacher(this.currData.user_id)
        .then(res => {
          helper.message("success", "启用外教成功!");
          this.startDialogVisible = false;
          this.stopLoading = false;
          this.init();
        })
        .catch(e => {
          this.stopLoading = false;
        });
    },

    // 翻页
    page(currPage) {
      this.pagination.current_page = currPage;
      this.init();
    },

    // 搜索
    searchHandle() {
      this.pagination.current_page = 1;
      this.init();
    },

    // 请假弹出框
    leaving(id) {
      this.loading = true;
      getTeacherDetail(id, "lessons")
        .then(res => {
          this.currData = res.data;
          this.leaveDialogVisible = true;
          this.loading = false;
        })
        .catch(e => (this.loading = false));
    },
    // 取消请假
    cancelLeaving() {
      this.is_leaved = [];
      this.leaveReason = "";
      this.leaveDialogVisible = false;
    },

    // 提交请假申请
    confirmLeaving() {
      if (this.leaveReason == "") {
        helper.message("error", "请输入请假理由");
        return;
      }
      if (this.is_leaved.length <= 0) {
        helper.message("error", "请选择请假时间");
        return;
      }
      this.leavingLoading = true;
      addTeacherLeaving(this.currData.user_id, this.is_leaved, this.leaveReason)
        .then(res => {
          this.leavingLoading = false;
          helper.message("success", "请假成功!");
          this.leaveDialogVisible = false;
          this.currData = {};
          this.is_leaved = [];
          this.leaveReason = "";
        })
        .catch(e => (this.leavingLoading = false));
    },

    leaveCan(time, checked) {
      return moment(time) < moment() || checked == 1;
    },

    editDescription(row) {
      this.currData = row;
      this.dialog.descDialogVisible = true;
    },

    //课表跳转
    gotoTimeTable(row) {
      if (row.lesson_total <= 0) {
        helper.message("error", "该外教还没有任何新排课!");
        return;
      }
      this.$router.push({
        name: "teacherTimeTable",
        params: { id: row.user_id }
      });
    }
  },

  filters: {
    timeRange(v) {
      return `${moment(v.scheduled_at).format("YYYY-MM-DD")} ${moment(
        v.scheduled_at
      ).format("HH:mm")}~${moment(v.scheduled_end_at).format("HH:mm")}`;
    }
  }
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand a {
  color: #409eff;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<style>
.el-table th > .cell.highlight {
  padding: 0;
  margin: 0;
  background-color: white;
}
.checkboxFirst {
  margin-left: 10px;
}
</style>


