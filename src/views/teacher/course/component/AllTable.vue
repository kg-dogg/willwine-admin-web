<template>
  <div>
    <el-table :data="tableData" border v-loading="loading" element-loading-text="loading" style="width: 100%">
      <el-table-column prop="teacher_name" label="外教"></el-table-column>
      <el-table-column prop="provider_name" label="渠道" v-if="!isProvider"></el-table-column>
      <el-table-column prop="pay_method" label="付费方式"></el-table-column>
      <el-table-column prop="actual_hours" label="实排课时" v-if="!isProvider"></el-table-column>
      <el-table-column prop="course_duration" label="课时长" v-if="!isProvider"></el-table-column>
      <el-table-column prop="percentOfTeacherUsed" label="老师使用率" v-if="!isProvider"></el-table-column>
      <el-table-column prop="bought_hours" label="买断小时数"></el-table-column>
      <el-table-column prop="course_price" label="单价"></el-table-column>
      <el-table-column prop="pay_hours" label="付费小时数"></el-table-column>
      <el-table-column prop="bought_money" label="买断金额"></el-table-column>
      <el-table-column prop="pay_money" label="实付金额"></el-table-column>
      <el-table-column prop="diff_money" label="差价"></el-table-column>
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
          const tableData = res.data.map(item=>{
            let newItem = {
              percentOfTeacherUsed:Math.round(item.actual_hours / item.bought_hours * 10000) / 100 + '%',
              bought_money:item.bought_hours * item.course_price,
              pay_money:item.actual_hours * item.course_price,
              diff_money: 0,
              ...item
            }
            newItem.diff_money = newItem.bought_money - newItem.pay_money
            return newItem
          })
          this.tableData = tableData;
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
    }
  }
};
</script>

<style>
</style>
