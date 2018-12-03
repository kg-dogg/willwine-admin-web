<template>
  <div class="app-container">
    <!-- 版本管理 -->
    <Version :versionData='versionData' :loading='versionLoading' @submitVersion="addVersionToList" @restoreVersions="restoreVersions" @launchVersion="launchVersion" @delVersion="delVersion" @getVersionList="getVersionList" @unlaunchVersion='unlaunchVersion' />

    <el-card class="homework" v-if='versionData.length>0'>
      <el-form :inline="true">
        <el-form-item label="版本" class="filter-item">
          <el-select size="small" class="filter-item-select" v-model="tag" @change='verChange'>
            <el-option v-for='(item) in versionOptions' :key='item._id' :label="item.label" :value="item.title">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课时" class="filter-item">
          <el-select size="small" class="filter-item-select course-select" clearable placeholder='请选择' v-model="course_id">
            <el-option v-for='item in lessonOptions' :key='item._id' :label='item.title' :value='item._id'></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="goSearch" size="small">查询</el-button>
      </el-form>
      <el-table :data="homeworkData" border v-loading="loading" style="width: 100%" :span-method="objectSpanMethod">
        <el-table-column prop="course_title" label="课时" align="center">
        </el-table-column>
        <el-table-column label="作业类型" align="center">
          <template slot-scope="scope">
            {{scope.row.type === homeWorkType[0][0] ? homeWorkType[0][1] : homeWorkType[1][1] }}
          </template>
        </el-table-column>
        <el-table-column prop="version" label="作业名称" align="center">
          <template slot-scope="scope">
            <el-button type='text' v-if='activeVer !== search.tag && !scope.row.title' icon='el-icon-plus' @click='add(scope.row)'>创建</el-button>
            {{scope.row.title}}
          </template>
        </el-table-column>
        <el-table-column prop="task_num" label="试题数统计" align="center">
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            {{hwStatus[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="view(scope.row.id)" v-if='scope.row.title'>查看</el-button>
              <el-button type="text" @click="preview(scope.row.id)" v-if='scope.row.title'>预览</el-button>
              <el-button type="text" @click="modify(scope.row)" v-if='activeVer !== search.tag && scope.row.title'>编辑</el-button>
              <el-button type="text" @click="review(scope.row)" v-if='activeVer !== search.tag && scope.row.title' :disabled="scope.row.status !== 'unaudited'">审核</el-button>
              <el-button type="text" @click="remove(scope.row)" v-if='activeVer !== search.tag && scope.row.title' :disabled="!deleteStatus(scope.row)" :class="{delete:deleteStatus(scope.row)}">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-if="pagination.total > 0" background layout="total, prev, pager, next, jumper" :page-size="pagination.per_page" :current-page.sync="pagination.current_page" @current-change="changePage" :total="pagination.total"></el-pagination>
      </div>
    </el-card>

    <Preview v-model="previewVisible" :jobId="previewJobId"></Preview>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Version from "@/views/curriculum/components/version";
import Preview from "../components/preview";
import {
  getVersionList,
  addVersion,
  deleteVersion,
  launchVersion,
  getCurriculumByID,
  getJobList,
  checkJob,
  deleteJob
} from "@/api/api";
export default {
  name: "homeworkList",
  components: {
    Version,
    Preview
  },
  computed: {
    ...mapGetters(["param"]),
    homeWorkType() {
      return (
        this.param &&
        this.param.jobs &&
        Object.entries(this.param.jobs.job_type)
      );
    },
    homeWorkStatus() {
      return (
        this.param && this.param.jobs && Object.entries(this.param.jobs.status)
      );
    },
    currentVersion(){
      return this.versionData.find(item=>item.title === this.tag);
    }
  },
  data() {
    return {
      hwStatus: {
        unaudited: "未审核",
        audited: "已审核"
      },
      hwId: this.$route.params.id,
      versionData: [], // 版本管理数据
      versionOptions: [],
      lessonOptions: [],
      activeVer: "",
      homeworkData: [],
      tag: "",
      course_id: "",
      search: {
        tag: "",
        course_id: ""
      },
      pagination: { current_page: 1, per_page: 10, total: 10 }, // 分页
      loading: false,
      versionLoading: false,
      init_create: false,
      // 预览窗口状态
      previewVisible: false,
      // 当前预览的作业Id
      previewJobId: ""
    };
  },
  created() {
    this.init_create = true;
    this.setClassInfo();
    this.getVersionList();
  },
  beforeRouteUpdate(to, from, next) {
    this.getQueryData(to.query);
    this.getHomeworkList();
    next();
  },
  methods: {
    setClassInfo() {
      getCurriculumByID(this.hwId, { include: "course" })
        .then(res => {
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.$route.matched[1].meta.title = `作业管理（${res.data.title}）`;
          const lessonData = res.data.course.data;
          this.initLessonOptions(lessonData);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    getQueryData(query) {
      const activeTag = this.activeVer || this.versionOptions[0].title;
      const { tag = activeTag, page, course_id } = query || this.$route.query;

      this.search = {
        tag,
        course_id
      };
      this.tag = tag;

      this.course_id = course_id;
      this.pagination.current_page = +page || 1;
    },
    getVersionList() {
      this.versionLoading = true;
      getVersionList(this.hwId)
        .then(res => {
          this.versionLoading = false;
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.versionData = res.data;
          if (this.versionData.length > 0) {
            this.activeVer = "";
            this.initVerOptions();
            this.getQueryData();
            this.getHomeworkList();
          } else {
            this.$router.replace({ name: "homeworkList", query: {} });
          }
        })
        .catch(err => {
          this.versionLoading = false;
          this.$message.error(err);
        });
    },
    initVerOptions() {
      // 版本选项
      const vers = this.versionData.map(item => {
        let label = `V${item.title}`;
        if (item.status === "effective") {
          this.activeVer = item.title;
          label = `当前版本：V${item.title}`;
        }
        return { ...item, label };
      });
      this.versionOptions = vers;

      if (
        !this.init_create &&
        !this.versionOptions.find(res => res.title === this.tag)
      ) {
        this.$router.replace({ name: "homeworkList", query: {} });
      }
    },
    initLessonOptions(lessonData) {
      //课时选项
      let options = [];
      let obj = {};
      lessonData.forEach(item => {
        if (!obj[item._id]) {
          obj[item._id] = 1;
          options.push(item);
        }
      });
      this.lessonOptions = options;
    },
    goSearch() {
      this.pagination.current_page = 1;
      const { tag, course_id } = this;
      this.search = {
        tag,
        course_id
      };
      this.getHomework();
    },
    getHomework() {
      this.$router.replace({
        name: "homeworkList",
        query: { ...this.search, page: this.pagination.current_page }
      });
      this.getHomeworkList();
    },
    getHomeworkList() {
      this.loading = true;
      getJobList({
        ...this.search,
        page: this.pagination.current_page,
        id: this.hwId
      })
        .then(res => {
          this.loading = false;
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.homeworkData = res.data;
          this.pagination = res.meta.pagination;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    addVersionToList(item) {
      const {
        data: { id }
      } = JSON.parse(localStorage.getItem("user_detail"));
      addVersion(this.hwId, id)
        .then(res => {
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.getVersionList();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    restoreVersions(list) {
      this.versionData = list;
    },
    launchVersion(version) {
      this.versionLoading = true;
      const id = version.id;
      const data = {
        status: version.status,
        effective_time: version.effectiveTime
      };
      launchVersion(id, data)
        .then(res => {
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            this.versionData.forEach(item => {
              if (item._id === id) {
                item.status = "uneffective";
              }
            });
          }
          this.$message({ type: "success", message: "启用成功" });
          this.getVersionList();
        })
        .catch(err => {
          this.versionLoading = false;
          this.$message.error(err);
          this.versionData.forEach(item => {
            if (item._id === id) {
              item.status = "uneffective";
            }
          });
        });
    },
    unlaunchVersion(version) {
      // console.log(version);
      this.versionLoading = true;
      const { _id, status, effective_time } = version;
      launchVersion(_id, { status, effective_time })
        .then(res => {
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            this.versionData.forEach(item => {
              if (item._id === id) {
                item.status = "effective";
              }
            });
          }
          this.getVersionList();
          this.$forceUpdate();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    delVersion(version) {
      this.versionLoading = true;
      deleteVersion(version._id)
        .then(res => {
          // this.versionLoading = false;
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.init_create = false;
          this.getVersionList();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          row.type = this.homeWorkType[0][0];
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          row.type = this.homeWorkType[1][0];
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    changePage(currentPage) {
      this.pagination.current_page = currentPage;
      this.getHomework();
    },
    review(row) {
      this.$confirm(`你确定要审核通过${row.title}作业吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          checkJob(row.id, this.search.tag)
            .then(res => {
              if (res.status_code !== 200) {
                this.$message.error(res.message);
                return;
              }
              this.getHomeworkList();
              this.$message({
                type: "success",
                message: "审核成功!"
              });
            })
            .catch(err => {
              this.$message.error(err);
            });
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "已取消审核"
          });
        });
    },
    modify(row) {
      this.$router.push({
        name: "modifyHomework",
        query: {
          id: row.id,
          ...this.search,
          page: this.pagination.current_page
        }
      });
    },
    view(id) {
      this.$router.push({
        name: "viewHomework",
        query: { id: id, ver: this.search.tag }
      });
    },
    // 预览作业
    preview(id) {
      this.previewJobId = id;
      this.previewVisible = true;
    },
    // 删除作业
    remove(row) {
      this.$confirm(`你确定要删除作业 ${row.title} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteJob(row.id, this.search.tag)
          .then(res => {
            if (res.status_code !== 200) {
              this.$message.error(res.message);
              return;
            }
            this.getHomeworkList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(err => {
            this.$message.error(err);
          });
      });
    },
    add(row) {
      this.$router.push({
        name: "addHomework",
        query: {
          type: row.type,
          courseId: row.course_id,
          ...this.search,
          page: this.pagination.current_page
        }
      });
    },
    verChange(val) {
      this.$forceUpdate();
    },
    deleteStatus(row){
      return row.status === 'unaudited' && !this.currentVersion.effective_time
    }
  }
};
</script>
<style scoped>
.homework {
  margin-top: 20px;
}
.delete {
  color: #f56c6c;
}
</style>
<style>
.course-select.el-select {
  width: 276px;
}
</style>



