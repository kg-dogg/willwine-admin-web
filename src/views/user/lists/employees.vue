<template>
    <div>
        <div>
            <div style="margin-top: 10px;margin-bottom:10px">
                <el-input placeholder="请输入搜索内容" v-model="search.value" class="input-with-select">
                    <el-select v-model="search.type" slot="prepend" placeholder="请选择" @change="searchChang">
                        <el-option label="员工号" value="employee_id"></el-option>
                        <el-option label="中文名" value="name"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
                </el-input>
            </div>
        </div>
        <el-table :data="employees" element-loading-text="加载中"  highlight-current-row v-loading="loading" empty-text="暂无数据" style="width: 100%">
            <el-table-column  prop="profile.employee_id" label="员工号"  ></el-table-column>
            <el-table-column  prop="name" label="姓名"></el-table-column>
            <el-table-column  prop="profile.brand" label="业务品牌"></el-table-column>
            <el-table-column  prop="org_name" label="机构/岗位">
                <template slot-scope="scope">{{scope.row.profile.orgText}} ● {{scope.row.profile.postText}}</template>
            </el-table-column>
            <el-table-column  prop="roles[0].description" label="角色权限"></el-table-column>
            <el-table-column  prop="status" label="状态"></el-table-column>
            <el-table-column  prop="created_at" label="创建时间"></el-table-column>
            <el-table-column  label="操作" width="100px">
                <template slot-scope="scope">
                    <router-link :to="`/user/employee/${scope.row.id}`" title="查看/编辑"><el-button type="primary" size="mini" icon="el-icon-edit" circle></el-button></router-link>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination" >
            <el-pagination background layout="total, prev, pager, next" :page-size="pagination.per_page" :current-page = "pagination.current_page"  @current-change ="page" :total="pagination.total"></el-pagination>
        </div>
    </div>
</template>

<script>
import { getUsersEmployee } from "@/api/api";
export default {
    data() {
        return {
            loading:false,
            employees: [],
            pagination: {per_page:10, current_page:0, total: 0},
            search: {
                type: 'employee_id',
                value: '',
            }
        }
    },

    created: function() {
        this.init();
    },

    // 方法集合
    methods: {
        init() {
            this.loading = true;
            let searchCond = {}
            if (this.search.value) {
                searchCond = this.search;
            }
            getUsersEmployee(this.pagination.current_page, searchCond).then(res => {
                this.employees = res.data
                //this.pagination.current_page = response.activity_logs.current_page;
                //this.pagination.total = res.meta.pagination.total;
                this.pagination.current_page = res.current_page
                this.pagination.total = res.total
                this.pagination.per_page = res.per_page
                this.loading = false
            }).catch(e => this.loading = false)
        },

        page(currPage) {
            this.pagination.current_page = currPage;
            this.init();
        },

        searchChang(type) {
            this.search.value = '';
        },
        onSearch() {
            this.pagination.current_page = 1;
            if (this.search.value == '') {
                //return false
            }
            this.init();
        }
    },
}
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

