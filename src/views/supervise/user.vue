<template>
    <div class="app-container">
        <div class="filter-container">
            <h2>督导人员列表</h2> <span>人数：({{total}})</span>
        </div>
        <div>
            <el-table :data="tableDatas" border fit highlight-current-row
                      style="width: 100%" v-loading="loading" element-loading-text="给我一点时间">
                <el-table-column prop="user_id" label="ID"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="class_num" label="班级数量" sortable></el-table-column>
                <el-table-column prop="student_num" label="学生数量" sortable></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { classSupervisor } from '../../api/api';

export default {
  data() {
    return {
      loading: true,
      total: 0,
      tableDatas: [],
    };
  },
  created() {
    this.getData();
  },

  methods: {
    // 获取数据
    getData() {
      this.loading = true;
      classSupervisor()
        .then((res) => {
          this.tableDatas = res.data;
          this.total = res.total;
          this.loading = false;
        })
        .catch(error => console.log(error.response.data));
    },
  },
};
</script>
<style scoped>
</style>
