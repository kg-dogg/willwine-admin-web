<template>
    <div>
        <div style="margin-top: 10px;margin-bottom:10px">
            <el-input placeholder="请输入搜索内容" v-model="search.value" class="input-with-select">
                <el-select v-model="search.type" slot="prepend" placeholder="请选择" @change="searchChang">
                    <el-option label="手机号" value="mobile"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
        </div>
        <el-table :data="parents" element-loading-text="加载中" highlight-current-row v-loading="loading" empty-text="暂无数据" style="width: 100%">
            <el-table-column prop="id" label="家长ID"></el-table-column>
            <el-table-column prop="name" label="家长姓名"></el-table-column>
            <el-table-column prop="mobile" label="家长手机号"></el-table-column>
            <el-table-column prop="department" label="机构属性"></el-table-column>
            <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                    <router-link :to="`/user/parent/${scope.row.id}`" title="查看/编辑"><el-button type="primary" size="mini" icon="el-icon-edit" circle></el-button></router-link>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination background layout="prev, pager, next" :page-size="pagination.per_page" :current-page="pagination.current_page" @current-change="page" :total="pagination.total"></el-pagination>
        </div>
    </div>
</template>

<script>
import { getUsersParent } from "@/api/api";
export default {
  data() {
    return {
      loading: false,
      parents: [],
      pagination: { per_page: 10, current_page: 0, total: 0 },
      search: {
        type: "mobile",
        value: ""
      }
    };
  },

  created: function() {
    this.init();
  },

  // 方法集合
  methods: {
    init() {
      this.loading = true;
      getUsersParent(this.pagination.current_page,this.search)
        .then(res => {
          this.parents = res.data;
          this.pagination.current_page = res.current_page;
          this.pagination.total = res.total;
          this.pagination.per_page = res.per_page;
          this.loading = false;
        })
        .catch(e => (this.loading = false));
    },

    page(currPage) {
      this.pagination.current_page = currPage;
      this.init();
    },
    searchChang(type) {
      this.search.value = "";
    },
    onSearch() {
      this.pagination.current_page = 1;
      this.init();
    }
  }
};
</script>

<style lang="scss" scoped >
    .app-container {
        .el-select {
            width: 130px;
        }
    }

  .input-with-select {
      width: 40%;
    .el-input-group__prepend {
        background-color: #fff;
    }


  }
</style>

