<template>
    <div class="app-container">
       <el-card>
        <div class="filter-container">
            <el-form>
                <el-select clearable class="filter-item" v-model="search.system" placeholder="请选择系统类型" @change='getData(1)'>
                    <el-option v-for='(option,index) in systemList' :key='index' :value='option[0]' :label="option[1]"></el-option>
                </el-select>
                <el-input clearable class="filter-item" style="width:20%" v-model="search.title" placeholder="请输入标题关键词"></el-input>
                <el-button class="filter-item" type="primary" icon="el-icon-search" :disabled="loading" @click="getData(1)">查询</el-button>
                <el-button class="addNotification" type="primary" @click="gotoAdd()">创建消息模板</el-button>
            </el-form>
        </div>

        <div>
            <el-table  :data="listData"  element-loading-text="加载中..." border fit highlight-current-row v-loading="loading" empty-text="暂无数据">
                <el-table-column type="index" label="序号"  width="80" align="center"></el-table-column>
                <el-table-column width="80" label="系统">
                  <template slot-scope="scope">{{global.param.messageTemplate.system[scope.row.system]}}</template>
                </el-table-column>
                <el-table-column label="消息分类" width="100">
                  <template slot-scope="scope">{{global.param.messageTemplate.classification[scope.row.classification]}}</template>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="200"></el-table-column>
                <el-table-column prop="content" label="内容" header-align='center'></el-table-column>
                <el-table-column prop="created_at"  width='160' label="创建时间"></el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="gotoAdd(scope.row._id)"> 编辑</el-button>
                        <el-button size="mini"  type="danger" @click="deleteTemplate(scope.row._id)"> 删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination" >
            <el-pagination
                v-if="pagination.total > 0"
                background layout="prev, pager, next"
                :page-size="pagination.per_page"
                :current-page = "pagination.current_page"
                @current-change ="page"
                :total="pagination.total"></el-pagination>
        </div>
       </el-card>
   </div>
</template>

<script>
import { mapState } from 'vuex';
import { getTemplateList, deleteTemplate } from '@/api/api';

export default {
  data() {
    return {
      listData: [], // 课程数据
      pagination: { current_page: 1, per_page: 10, total: 10 }, // 分页等附加数据结构
      loading: false,
      search: { system: '', title: '', page: 1 }, // 搜索条件
    };
  },
  computed: {
    ...mapState({
      global: 'global',
    }),
    messageTemplate() {
      return this.global.param.messageTemplate;
    },
    systemList() {
      if (this.messageTemplate) {
        return Object.entries(this.messageTemplate.system);
      }
      return [];
    },
  },
  created() {
    this.getData();
  },
  // 方法集合
  methods: {
    // 获取数据
    getData(page) {
      this.loading = true;
      this.search.page = page || this.pagination.current_page;
      getTemplateList(this.search).then((res) => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.listData = res.data;
        this.pagination = res.meta.pagination;
        this.loading = false;
      }).catch((err) => {
        this.$message.error(err);
        this.loading = false;
      });
    },

    // 翻页操作
    page(currPage) {
      this.pagination.current_page = currPage;
      this.getData();
    },
    gotoAdd(id) {
      if (id) {
        // this.$router.push({ name: 'modifyNotification' ,params:{ id: id } });
        this.$router.push({ name: 'modifyNotification', params: { id } });
      } else {
        this.$router.push({ name: 'addNotification' });
      }
    },
    deleteTemplate(id) {
      this.$confirm('确定删除该消息模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true;
        deleteTemplate(id).then((res) => {
          if (res.status_code !== 200) {
            this.$message.error(res.message);
            return;
          }
          this.loading = false;
          this.getData();
        });
      }).catch((err) => {
        console.log(err);
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped>
.addNotification {
  float: right;
}
</style>
