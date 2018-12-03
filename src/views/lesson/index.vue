<template>
    <div class="app-container">
        <div class="handle-box">
          <el-button type="primary" @click="addLesson" >新建试听课</el-button>
            <span style="float:right; margin-right: 50px; margin-bottom: 20px">已排课结果: {{pagination.total}}</span>
        </div>

        <div >
            <el-table  :data="lessons"  element-loading-text="给我一点时间" border fit highlight-current-row v-loading="loading" empty-text="暂无数据" >
                <el-table-column type="index" :index="getIndex" label="序号"  width="80" align="center"></el-table-column>
                <el-table-column  label="上课日期"  width="180" align="center">
                    <template slot-scope="scope">{{scope.row.scheduled_at | time_get_date}}</template>
                </el-table-column>
                <el-table-column label="开课时间" width="180" align="center">
                    <template slot-scope="scope">{{scope.row.scheduled_at | time_get_time}}</template>
                </el-table-column>
                <el-table-column prop="curriculum.data.title"  label="课程名称" align="center"></el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-popover placement="bottom" title="标题" width="200" trigger="click" >
                            <div v-loading="detail_loading" v-if="lessonDetail">
                            <p>已有外教(直播间):{{lessonDetail.has_liveroom}}</p>
                            <p>已约课直播间:{{lessonDetail.has_student}}</p>
                            <p>空闲直播间:{{lessonDetail.not_student}}</p>
                            </div>
                            <el-button class="el-icon-view" size="mini" slot="reference" @click="detail(scope.$index, scope.row)" > 查看</el-button>
                        </el-popover>

                        <!-- <el-button size="mini"  @click="detail(scope.$index, scope.row)">查看</el-button> -->
                        <el-button class="el-icon-circle-plus" size="mini"  @click="chooseTeacher(scope.$index, scope.row)"> 分配外教</el-button>
                        <el-button class="el-icon-error" size="mini"  type="danger"  @click="deleteLesson(scope.$index, scope.row)" > 删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination" >
            <el-pagination v-if="pagination.total > 0"  background layout="prev, pager, next" :page-size="pagination.per_page" :current-page = "pagination.current_page"       @current-change ="page" :total="pagination.total"></el-pagination>
        </div>


    </div>
</template>


<script>
import { getTrialLessons, getLessonDetail, deleteLessonTrial } from '../../api/api';

export default {
  data() {
    return {
      lessons: [], // 已排试听课列表
      pagination: { current_page: 0 }, // 分页等附加数据结构
      loading: true,
      detail_loading: false,
      dialogVisible: true,
      lessonDetail: {}, // 单个排课信息
      lessonDetailList: {},
    };
  },

  created() {
    this.getData();
  },

  // 方法集合
  methods: {
    // 获取数据
    getData() {
      this.loading = true;
      // 获取试听课列表
      getTrialLessons({ page: this.pagination.current_page }, true).then((res) => {
        this.lessons = res.data;
        console.log(res);
        this.pagination = res.meta.pagination;
        this.loading = false;
        // this.lessons = [{scheduled_start: '2018-05-09 18:09:03'}]
      });
    },

    // 自定义的序号生成方法
    getIndex(index) {
      return (index + 1) + ((this.pagination.current_page - 1) * this.pagination.per_page);
    },

    // 查看详情
    detail(index, row) {
      if (_.has(this.lessonDetailList, row.id)) {
        this.lessonDetail = this.lessonDetailList[row.id];
      } else {
        this.detail_loading = true;
        getLessonDetail(row.id).then((res) => {
          this.lessonDetail = res.data;
          _.set(this.lessonDetailList, row.id, res.data);
          this.detail_loading = false;
        });
      }
    },

    // 删除功能
    deleteLesson(index, row) {
      this.loading = true;
      if (_.has(this.lessonDetailList, row.id)) {
        this.lessonDetail = this.lessonDetailList[row.id];
        this.deleteSub(row.id);
        this.loading = false;
      } else {
        getLessonDetail(row.id).then((res) => {
          this.lessonDetail = res.data;
          _.set(this.lessonDetailList, row.id, res.data);
          this.deleteSub(row.id);
          this.loading = false;
        });
      }
    },
    // 具体的删除功能,用于上面的调用
    deleteSub(id) {
      if (this.lessonDetail && this.lessonDetail.has_liveroom > 0) {
        this.$alert('确定要删除该时间段的全部直播吗?已有外教老师加入,请先去删除外教老师后再删除.', '提示', {
          confirmButtonText: '我知道了',
        });
        return;
      }
      this.$confirm('确定要删除该时间段的全部直播吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteLessonTrial(id).then(() => {
          helper.message('success', '删除成功');
          this.getData();
        });
      }).catch((err) => { console.log(err); });
    },

    // 翻页操作
    page(currPage) {
      this.pagination.current_page = currPage;
      this.getData();
    },

    // 选择外教
    chooseTeacher(index, row) {
      this.$router.push({ name: 'chooseTeacher', query: { tid: row.id } });
    },
    addLesson() {
      this.$router.push({ name: 'lessonAdd' });
    },
  },
};
</script>


<style scoped>

</style>

