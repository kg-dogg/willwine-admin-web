<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <el-form v-if="global.param.jobs">
          <el-select clearable class="filter-item" v-model="search.class" placeholder="请选择品牌" @change="onClassChange">
            <el-option v-for="(item, cos_id) in global.param.curriculum.brand" :key="cos_id" :label="item.brand_name" :value="cos_id"></el-option>
          </el-select>

          <el-select clearable class="filter-item" v-model="search.stage" placeholder="请选择对应阶段" :disabled="!search.class">
            <el-option v-for="(v,k) in global.param.curriculum.stage[search.class]" :key="k" :label="v.class_level_name" :value="v.cos_id"></el-option>
          </el-select>

          <el-input clearable class="filter-item" style="width:30%" v-model="search.title" placeholder="请输入班型名称关键词"></el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="loading" @click="handleSearch">查询</el-button>

          <el-button type="text" class="btn-copy-resource" @click="showCopyWin">批量复制资源和作业</el-button>
        </el-form>
      </div>

      <div>
        <el-table :data="curriculum" element-loading-text="加载中..." border fit highlight-current-row v-loading="loading" empty-text="暂无数据">
          <el-table-column type="index" fixed :index="getIndex" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="brand_name" fixed label="品牌" width="180" align="center"></el-table-column>
          <el-table-column prop="stage_name" fixed label="阶段" align="center"></el-table-column>
          <el-table-column prop="title" fixed label="班型名称" align="center" width="180"></el-table-column>
          <el-table-column prop="periods" fixed label="课时数" align="center"></el-table-column>
          <el-table-column prop="coursetitle" label="课时统计" align="center"></el-table-column>
          <el-table-column prop="preclass" label="课前作业统计" align="center"></el-table-column>
          <el-table-column prop="afterclass" label="课后作业统计" align="center"></el-table-column>
          <el-table-column prop="courseware" label="课件统计" align="center"></el-table-column>
          <el-table-column prop="teachingcase" label="教案统计" align="center"></el-table-column>
          <el-table-column prop="teaching_goal" label="教学目标统计" align="center"></el-table-column>
          <el-table-column prop="home_suggestion" label="家辅建议统计" align="center"></el-table-column>
          <el-table-column label="操作" fixed="right" width="320" align="center">
            <template slot-scope="scope">
              <el-button class="el-icon-tickets" size="mini" type="primary" @click="editCourseBase(scope.$index, scope.row)"> 课时目录</el-button>
              <el-button class="el-icon-upload" size="mini" type="danger" @click="editCourseRes(scope.$index, scope.row)"> 关联资源</el-button>
              <el-button size="mini" @click="homeWorkList(scope.row)"> 作业</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination v-if="pagination.total > 0" background layout="prev, pager, next" :page-size="pagination.per_page" :current-page="pagination.current_page" @current-change="handlePage" :total="pagination.total"></el-pagination>
      </div>
    </el-card>

    <CopyUpload ref="copyUploadComp"></CopyUpload>
  </div>
</template>

<script>
import { getCurriculums } from "@/api/api";
import { mapState } from "vuex";

export default {
  components: {
    CopyUpload: () => import("./components/CopyUpload.vue")
  },
  data() {
    return {
      curriculum: [], // 课程数据
      pagination: { current_page: 1, per_page: 10 }, // 分页等附加数据结构
      loading: false,
      search: { class: "", stage: "", title: "" }, // 搜索条件
    };
  },
  // 计算属性
  computed: {
    ...mapState({
      global: "global"
    })
  },

  created() {
    this.getData();
  },

  // 方法集合
  methods: {
    // 获取数据
    getData() {
      this.loading = true;
      getCurriculums({ page: this.pagination.current_page, ...this.search })
        .then(res => {
          this.curriculum = res.data;
          this.pagination = res.meta.pagination;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 自定义的序号生成方法
    getIndex(index) {
      return (
        index +
        1 +
        (this.pagination.current_page - 1) * this.pagination.per_page
      );
    },
    handleSearch() {
      this.pagination.current_page = 1;
      this.getData();
    },
    // 翻页操作
    handlePage(currPage) {
      this.pagination.current_page = currPage;
      this.getData();
    },

    // 产品类型选择变更
    onClassChange(val) {
      this.search.stage = "";
    },

    // 课时目录跳转
    editCourseBase(index, row) {
      this.$router.push({ name: "editCourseBase", params: { id: row.id } });
    },

    // 关联资源跳转
    editCourseRes(index, row) {
      this.$router.push({ name: "editCourseRes", params: { id: row.id } });
    },

    // 获取产品类型
    getProductTypeName(key) {
      return this.global.param.curriculum.product_type[key];
    },

    // 作业列表跳转
    homeWorkList(row) {
      this.$router.push({ name: "homeworkList", params: { id: row.id } });
    },
    showCopyWin(){
      this.$refs.copyUploadComp.show();
    }
  }
};
</script>


<style scoped>
.btn-copy-resource {
  float: right;
}
</style>
