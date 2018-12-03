<template>
  <div>
    <el-table :data="tableData" border v-loading="loading" element-loading-text="loading" style="width: 100%">
      <el-table-column prop="teacher_name" label="外教"></el-table-column>
      <el-table-column prop="provider_name" label="渠道" v-if="!isProvider"></el-table-column>
      <el-table-column prop="bought_hours" label="买断小时数"></el-table-column>
      <el-table-column prop="leave_hours" label="请假小时数"></el-table-column>
      <el-table-column prop="leave_times" label="请假时间"></el-table-column>
      <el-table-column prop="diff_money" label="差价金额"></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination v-if="pagination.total > 0" background layout="prev, pager, next" :page-size="pagination.per_page" :current-page="pagination.current_page" :total="pagination.total" @current-change="handlePage"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getTeachersCourses } from "@/api/api";
export default {
  props: {
    search: Object
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: { current_page: 1, per_page: 10 }
    };
  },
  created() {
    this.handlePage(1);
  },
  methods: {
    getData() {
      this.loading = true;
      getTeachersCourses({page:this.pagination.current_page,...this.search})
        .then(res => {
          this.tableData = res.data;
          this.pagination = res.meta.pagination;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 翻页操作
    handlePage(currPage) {
      this.pagination.current_page = currPage;
      this.getData();
    },
  }
};
</script>

<style>
</style>
