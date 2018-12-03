<template>
    <div class="app-container">
        <el-tabs type="border-card" :value="tab_status" @tab-click="tabChange">
            <el-tab-pane name="off" label="未排课学生">
                <div class="filter-container">
                    <el-input style="width: 300px;" class="filter-item" placeholder="输入家长手机号检索" v-model="search.mobile">
      </el-input>
                    <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="searchHandle">搜索</el-button>

                </div>

                <el-table :data="students_off" element-loading-text="给我一点时间"  fit highlight-current-row v-loading="loading" empty-text="暂无数据" style="width: 100%">
                    <el-table-column type="index" :index="getIndex"  label="序号"  width="90"></el-table-column>
                    <el-table-column  prop="student.data.name" label="学生姓名"  width="180"></el-table-column>
                    <el-table-column  prop="student.data.profile.parent_mobile" label="家长手机号"></el-table-column>
                    <el-table-column  prop="curriculum.data.title" label="课程"></el-table-column>
                    <el-table-column  prop="updated_at" label="订单时间"></el-table-column>
                    <el-table-column  prop="remarks" label="备注"></el-table-column>
                    <el-table-column  prop="not_course" label="未排课课时"></el-table-column>
                    <el-table-column  label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button class="el-icon-circle-plus" size="mini" @click="add_normal(scope.row)"  > 排课</el-button>
                            <el-button class="el-icon-zoom-in" size="mini"  type="danger" @click="gotoTimeTable(scope.row)"> 课表</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination" >
                    <el-pagination background layout="prev, pager, next" :page-size="pagination_off.per_page" :current-page = "pagination_off.current_page"  @current-change ="page" :total="pagination_off.total"></el-pagination>
                </div>

            </el-tab-pane>
            <el-tab-pane name="on" label="已排课学生">
                <div class="filter-container">
                    <el-input style="width: 300px;" class="filter-item" placeholder="输入家长手机号检索" v-model="search.mobile">
      </el-input>
                    <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="searchHandle">搜索</el-button>

                </div>

                <el-table :data="students_on" element-loading-text="给我一点时间" fit highlight-current-row v-loading="loading" empty-text="暂无数据" style="width: 100%">
                    <el-table-column type="index" :index="getIndex"  label="序号"  width="90"></el-table-column>
                    <el-table-column  prop="student.data.name" label="学生姓名"  width="180"></el-table-column>
                    <el-table-column  prop="student.data.profile.parent_mobile" label="家长手机号"></el-table-column>
                    <el-table-column  prop="curriculum.data.title" label="课程"></el-table-column>
                    <el-table-column  prop="scheduled_at" label="近期课程时间"></el-table-column>
                    <el-table-column  prop="remarks" label="备注"></el-table-column>
                    <el-table-column  label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button class="el-icon-remove-outline" size="mini" disabled > 休学</el-button>
                            <el-button class="el-icon-zoom-in" size="mini"  type="danger" @click="gotoTimeTable(scope.row)" > 课表</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination" >
                    <el-pagination background layout="prev, pager, next" :page-size="pagination_on.per_page" :current-page = "pagination_on.current_page"       @current-change ="page" :total="pagination_on.total"></el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>


<script>
import { getNormalLessonsUnlessoned, getNormalLessonsLessoned } from '../../api/api';

export default {
  data() {
    return {
      loading: false,
      tab_status: 'off', // 未排课off / 已排课on
      search: { mobile: '' },
      students_on: [], // 已排课学生数据
      students_off: [], // 未排课学生数据
      pagination_off: { current_page: 0 }, // 未排课分页
      pagination_on: { current_page: 0 }, // 已排课分页
    };
  },

  created() {
    this.getData();
  },

  // 方法集合
  methods: {
    getData() {
      this.loading = true;
      if (this.tab_status === 'off') {
        getNormalLessonsUnlessoned({ page: this.pagination_off.current_page, mobile: this.search.mobile, include: 'curriculum,product,student' }).then((res) => {
          this.students_off = res.data;
          this.pagination_off = res.meta.pagination;
          this.loading = false;
        });
        // this.students_off = [
        //     {name:"学生1", parent_mobile: "13439580001", curriculum: "课程1", order_time: '2018-05-15 16:00:34', comment:'大灰狼大灰狼', 'lesson_left': 10, teacher_id:1},
        //     {name:"学生2", parent_mobile: "13439580001", curriculum: "课程2", order_time: '2018-05-15 16:00:34', comment:'大灰狼大灰狼22', 'lesson_left': 8}
        // ];
      } else {
        getNormalLessonsLessoned({ page: this.pagination_on.current_page, mobile: this.search.mobile, include: 'curriculum,product,student' }).then((res) => {
          this.students_on = res.data;
          this.pagination_on = res.meta.pagination;
          this.loading = false;
        });
        // this.students_on = [
        //     {name:"学生3", parent_mobile: "13439580001", curriculum: "课程3", order_time: '2018-05-15 16:00:34', comment:'大灰狼大灰狼', 'lesson_left': 0},
        //     {name:"学生4", parent_mobile: "13439580001", curriculum: "课程4", order_time: '2018-05-15 16:00:34', comment:'大灰狼大灰狼22', 'lesson_left': 0}
        // ];
      }
    },

    searchHandle() {
      if (this.search.mobile === '') {
        helper.message('error', '请输入正确的家长手机号');
        return;
      }

      if (this.tab_status === 'off') {
        this.pagination_off.current_page = 1;
      } else {
        this.pagination_on.current_page = 1;
      }

      // ajax
      this.getData();
      console.log(this.search.mobile);
    },

    // 自定义的序号生成方法
    getIndex(index) {
      return index + 1;
    },

    tabChange(tab) {
      this.tab_status = tab.name;
      this.getData();
    },

    // 跳转排课
    add_normal(row) {
      this.$router.push({ name: 'lessonAddNormal', query: { soid: row.id } });

      // 下面这段代码报错，接口返回的数据没有 curriculum 和 not_course 这两个字段，先直接跳 lessonAddNormal

      // 未选老师,没有排过课程:
      // if (row.curriculum.data.periods === row.not_course) {
      //   this.$router.push({ name: 'lessonAddNormal', query: { soid: row.id } });
      // } else {
      //   this.$router.push({ name: 'lessonAddLeftNormal', query: { soid: row.id,left:row.not_course } });
      // }
    },

    // 翻页操作
    page(currPage) {
      if (this.tab_status === 'off') {
        this.pagination_off.current_page = currPage;
      } else {
        this.pagination_on.current_page = currPage;
      }

      this.getData();
    },
    gotoTimeTable(row){
      this.$router.push({name: 'timetableList', query: {student_id: row.student_id, curriculum_id: row.curriculum_id}});
    },
  },
};
</script>


<style scoped>

</style>

