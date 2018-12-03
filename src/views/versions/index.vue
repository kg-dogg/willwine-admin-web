<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <el-form v-if="global.param.versions">
          <el-select class="filter-item" v-model="searchs.platform" placeholder="请选择版本平台">
            <el-option v-for="(k,v) in global.param.versions.platform" :key="v" :label="k" :value="v"></el-option>
          </el-select>

          <el-select class="filter-item" v-model="searchs.project" placeholder="请选择APP类型">
            <el-option v-for="(k,v) in global.param.versions.project" :key="v" :label="k" :value="v"></el-option>
          </el-select>

          <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="loading" @click="handleSearch">查询</el-button>
          <el-button class="right" type="primary" @click="handleCreate">创建版本</el-button>
        </el-form>
      </div>
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top: 20px" element-loading-text="加载中" fit highlight-current-row v-loading="loading" empty-text="暂无数据">
        <el-table-column prop="platform" label="平台类型"></el-table-column>
        <el-table-column prop="project" label="APP">
          <template slot-scope="scope">
            <span>{{global.param.versions.project[scope.row.project]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="url" label="版本CDN地址">
          <template slot-scope="scope">
            <a :href="scope.row.url" :title="scope.row.url" target="_blank">{{scope.row.url}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="版本类别">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.type === 'test'">测试版</el-tag>
            <el-tag v-else>稳定版</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="content" :formatter="formatter" label="内容描述">
          <cell-content slot-scope="scope" :value="scope.row.content"></cell-content>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="danger" v-else>已停用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleLook(scope.row)">查看</el-button>
            <el-button size="mini" type="primary" @click="handmodify(scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="destroy(scope.row)">删除</el-button> -->
            <el-button size="mini" type="danger" @click="handleEnable(scope.row.id,false)" v-if="scope.row.enabled">停用</el-button>
            <el-button size="mini" type="success" @click="handleEnable(scope.row.id,true)" v-else>启用</el-button>

          </template>
        </el-table-column>

      </el-table>

      <el-pagination background layout="prev, pager, next" :total="pagination.total" :current-page="pagination.current_page" :page-size="pagination.per_page" style="margin-top: 20px" @current-change="changePage">
      </el-pagination>

    </el-card>
  </div>

</template>

<script>
import { mapState } from "vuex";
import {
  getVersions,
  updateVersionsCurrent,
  destoryVersions,
  statusVersions
} from "../../api/api";
import CellContent from "@/components/CellContent.vue";

export default {
  components: {
    CellContent
  },
  // 计算属性
  computed: {
    ...mapState({
      global: "global"
    })
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
        current_page: 1
      },
      tableData: [],
      searchs: {
        platform: "ANDROID",
        project: "PARENT"
      }
    };
  },
  methods: {
    filterHTMLTag(msg) {
      let msg_ = msg.replace(/<\/?[^>]*>/g, "");
      msg_ = msg_.replace(/[|]*\n/, "");
      msg_ = msg_.replace(/&npsp;/gi, "");
      return msg_;
    },
    formatter(row, column) {
      return this.filterHTMLTag(row.content);
    },
    handleLook(row) {
      const id = row._id;
      this.$router.push({
        name: "versionsCheck",
        path: "./check",
        query: {
          id
        }
      });
    },
    handmodify(row) {
      const id = row._id;
      this.$router.push({
        name: "versionsModify",
        path: "./modify",
        query: {
          id
        }
      });
    },
    handleSearch(){
      this.pagination.current_page = 1;
      this.search();
    },
    search() {
      this.loading = true;

      getVersions(
        this.pagination.current_page,
        this.searchs.platform,
        this.searchs.project
      ).then(res => {
        if (res.status_code === 200) {
          // const data = res.data;
          // const tableData = [];
          // data.forEach((v, i) => {
          //   tableData[i] = [];
          //   tableData[i].i = i;
          //   tableData[i]._id = v._id;
          //   tableData[i].api_version = v.api_version;
          //   tableData[i].name = v.name;
          //   tableData[i].number = v.number;
          //   let status = "";
          //   switch (v.status) {
          //     case "new_effective":
          //       status = "最高生效版本";
          //       break;
          //     case "last_effective":
          //       status = "最低生效版本";
          //       break;
          //     case "effective":
          //       status = "生效";
          //       break;
          //     case "uneffective":
          //       status = "失效";
          //       break;
          //   }
          //   tableData[i].status = status;
          //   tableData[i].platform = v.platform;
          //   tableData[i].requirement = v.requirement;
          //   tableData[i].content = v.content;
          //   tableData[i].url = v.url;
          //   this.$set(this.tableData, i, { currentLabel: false });
          // });
          this.tableData = res.data;
          const pagination = res.meta.pagination;
          this.pagination.per_page = pagination.per_page;
          this.pagination.total = pagination.total;
          this.pagination.current_page = pagination.current_page;
          this.loading = false;
        }
      });
    },
    changePage(currentPage) {
      this.pagination.current_page = currentPage;
      this.search();
    },
    currentLabelFunction(row) {
      updateVersionsCurrent(row._id).then(res => {
        this.search();
        row.currentLabel = false;
      });
    },
    handleCreate() {
      this.$router.push({
        name: "versionsCreate",
        query: {
          platform: this.searchs.platform,
          project: this.searchs.project
        }
      });
    },
    destroy(res) {
      let id = res._id;
      destoryVersions(id).then(res => {
        this.$router.push({
          name: "versions",
          query: { platform: this.searchs.platform }
        });
      });
    },
    handleEnable(id, enable) {
      statusVersions(id, { enabled: enable }).then(
        res => {
          this.$message({
            showClose: true,
            message: enable ? "启用成功" : "停用成功",
            type: "success"
          });
          this.search();
        }
      );
    }
  }
};
</script>
<style scoped>
.right {
  float: right;
}
</style>
