<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-form ref="form" :model="form" label-width="80px" :span="18">
          <el-form-item label="产品类型" style="margin-top: 0px;margin-bottom: 0px;">
            <el-radio-group v-model="form.product_type" size="small" v-if="global.param.curriculum" @change="productTypeChange">
              <el-radio-button v-for="(v,k) in global.param.curriculum.product_type" :label="k" :value="k" :key="k">{{v}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="阶段" style="margin-top: 20px;margin-bottom: 0px;" v-if="global.param.curriculum">
            <el-radio-group v-model="form.stage" size="small" @change="search">
              <el-radio-button v-for="(v,k) in global.param.curriculum.stage[form.product_type]" :label="k" :key="k" value="k">{{v}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="作业类型" style="margin-top: 20px;margin-bottom: 0px;" v-if="global.param.curriculum">
            <el-radio-group v-model="form.type" size="small" @change="search">
              <el-radio-button label="all" key="all" value="all">{{'全部'}}</el-radio-button>
              <el-radio-button v-for="(v,k) in global.param.jobs.job_type" :label="k" :key="k" value="k">{{v}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核状态" style="margin-top: 20px;margin-bottom: 0px;" v-if="global.param.curriculum">
            <el-radio-group v-model="form.status" size="small" @change="search">
              <el-radio-button label="all" key="all" value="all">{{'全部'}}</el-radio-button>
              <el-radio-button v-for="(v,k) in global.param.jobs.status" :label="k" :key="k" value="k">{{v}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label=""  style="margin-top: 0px;margin-bottom: 10px;">
            <el-input v-model="form.title" placeholder="请输入名称关键字" style="width:300px;"></el-input>
            <el-button :loading="loading"
              v-if="searchButton"
              type="primary"
              icon="el-icon-search"
              @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" style="padding-top: 20px;">
        <el-button @click="copyJop" type="primary" align="right" >批量复制</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px"
      @selection-change="handleSelectionChange"
      element-loading-text="给我一点时间"  fit highlight-current-row v-loading="loading" empty-text="暂无数据"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column prop="title" fixed label="名称" width="150"></el-table-column>
      <el-table-column prop="stage" label="阶段" width="150"></el-table-column>
      <el-table-column prop="type" label="类型" width="150"></el-table-column>
      <el-table-column prop="jobs_task" label="任务数量" width="150"></el-table-column>
      <el-table-column prop="user_name" label="创建人" width="150"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="200" sortable ></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="160"
            prop = "enableLabel"
            v-model="scope.row.enableLabel">
            <p v-if="!scope.row.deleted_at">确定要停用吗？</p>
            <p v-else>确定要启用吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.enableLabel = false">取消</el-button>
              <el-button type="primary" size="mini" @click="enableLabelFunction(scope.row)">确定</el-button>
            </div>
              <el-button v-if="scope.row.deleted_at" slot="reference" size="mini" type="success" @click="scope.row.enableLabel = true">
                <span>启用</span>
              </el-button>
              <el-button v-if="!scope.row.deleted_at" slot="reference" size="mini" type="danger" @click="scope.row.enableLabel = true">
                <span>停用</span>
              </el-button>
              <!--<span v-if="scope.row.deleted_at">启用</span>-->
              <!--<span v-else>停用</span>-->
          </el-popover>
          <el-popover
            placement="top"
            width="160"
            prop="examineLabel"
            v-model="scope.row.examineLabel">
            <p>确定审核通过吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.examineLabel = false">取消</el-button>
              <el-button type="primary" size="mini" @click="examineLabelFunction(scope.row)">确定</el-button>
            </div>
            <el-button v-if="!scope.row.deleted_at && (scope.row.status != 'audited')"
              slot="reference" size="mini" type="warning" @click="scope.row.examineLabel = true">审核</el-button>
          </el-popover>
        </template>>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button size="mini" @click="handleLook(scope.row)">查看</el-button>
            <el-button size="mini" v-if="scope.row.deleted_at" type="primary" @click="handmodify(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :current-page="pagination.current_page"
      :page-size="pagination.per_page"
      style="margin-top: 20px"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<style>
.el-button + .el-button {
  margin-left: 0px;
}
</style>

<script>
import { mapState } from 'vuex';
import { getHomeworks, copyJop, jobEnable, jobStatus } from '../../api/api';

export default {
  // 计算属性
  computed: {
    ...mapState({
      global: 'global',
    }),
  },
  created() {
    this.search();
  },
  data() {
    return {
      loading: true,
      searchButton: true,
      pagination: {
        per_page: 50,
        total: 2,
        current_page: 1,
      },
      tableData: [
        {
          name: '',
          stage: '',
          type: '',
          jobs_task: '',
          user_name: '',
          created_at: '',
          enableLabel: false,
          examineLabel: false,
        },
      ],
      job_ids: [],
      form: {
        product_type: 'NormalClass',
        stage: 'Pre-K',
        status: 'all',
        type: 'all',
        title: '',
      },
    };
  },
  methods: {
    handleLook(row) {
      const id = row._id;
      this.$router.push({
        name: 'jobsCheck',
        path: './check',
        query: {
          id,
        },
      });
    },
    handmodify(row) {
      const id = row._id;
      this.$router.push({
        name: 'jobsModify',
        path: './modify',
        query: {
          id,
        },
      });
    },
    copyJop() {
      copyJop(this.job_ids).then((res) => {
        this.search();
      });
    },
    handleSelectionChange(val) {
      val.forEach((v, i) => {
        this.job_ids[i] = v._id;
      });
    },
    productTypeChange() {
      const stage = this.global.param.curriculum.stage[this.form.product_type];
      Object.keys(stage).forEach((v, k) => {
        if (k === 0) this.form.stage = v;
      });
      this.search();
    },
    search() {
      this.loading = true;
      const params = {};
      Object.keys(this.form).forEach((item) => {
        const param = this.form[item];
        if (param && param !== 'all') params[item] = this.form[item];
      });
      // for (const k in this.form) {
      //   const v = this.form[k];
      //   if (v && v !== 'all') params[k] = this.form[k];
      // }

      getHomeworks(this.pagination.current_page, 'curriculum', params).then(
        (res) => {
          if (res.status_code === 200) {
            console.log(res.data);
            const data = res.data;
            const tableData = [];
            data.forEach((v, i) => {
              tableData[i] = [];
              tableData[i]._id = v._id;
              tableData[i].title = v.title;
              tableData[i].stage = v.curriculum.data.stage;
              tableData[i].type = v.type;
              tableData[i].jobs_task = 0;
              v.jobtask.data.forEach((item) => {
                tableData[i].jobs_task += 1;
              });
              tableData[i].user_name = v.user_name;
              tableData[i].created_at = v.created_at;
              tableData[i].deleted_at = v.deleted_at;
              tableData[i].status = v.status;
              this.$set(this.tableData, i, { enableLabel: false });
              this.$set(this.tableData, i, { examineLabel: false });

              // tableData[i].enableLabel = false;
            });
            this.tableData = tableData;

            const pagination = res.meta.pagination;
            this.pagination.per_page = pagination.per_page;
            this.pagination.total = pagination.total;
            this.pagination.current_page = pagination.current_page;
            this.loading = false;
          }
        },
      );
    },
    changePage(currentPage) {
      this.pagination.current_page = currentPage;
      this.search();
    },
    changeSearchButton() {
      if (this.form.title) {
        this.searchButton = true;
      } else {
        this.searchButton = false;
      }
    },
    enableLabelFunction(row) {
      let status;
      if (row.deleted_at) {
        status = 'enable';
      } else {
        status = 'disable';
      }
      jobEnable(row._id, status).then((res) => {
        this.search();
        row.enableLabel = false;
      });
    },
    examineLabelFunction(row) {
      jobStatus(row._id).then((res) => {
        this.search();
        row.examineLabel = false;
      });
    },
  },
};
</script>
