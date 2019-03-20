<template>
    <div class="app-container">
        <el-card>
            <div slot="header" class="clearfix"><el-button type="text" >操作日志</el-button> <i>(共{{pagination.total}}条数据)</i></div>

            <el-table :data="activity_logs" element-loading-text="loading"  highlight-current-row v-loading="loading" empty-text="暂无数据" style="width: 100%">
                <el-table-column  prop="user.name" label="操作者"  ></el-table-column>
                <el-table-column  prop="ip" label="IP"></el-table-column>
                <el-table-column  prop="user_agent" label="user_agent"></el-table-column>
                <el-table-column  prop="activity" label="activity"></el-table-column>
                <el-table-column  prop="created_at" label="时间"></el-table-column>
                <el-table-column  label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteConfirm(scope.row)" ></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination" >
                <el-pagination background layout="prev, pager, next" :page-size="pagination.per_page" :current-page = "pagination.current_page"  @current-change ="page" :total="pagination.total"></el-pagination>
            </div>
        </el-card>
    </div>
</template>


<script>
export default {
    data() {
        return {
            loading:false,
            activity_logs: [],
            pagination: {per_page:10, current_page:0, total: 0}
        }
    },

    created: function() {
        this.init();
    },

    // 方法集合
    methods: {
        init() {
            this.loading = true;
            axios.get(`/activity-log?page=${this.pagination.current_page}`).then(response => response.data)
                .then((response) => {
                    this.loading = false;
                    this.users = response.users;
                    this.activity_logs = response.activity_logs.data;
                    this.pagination.current_page = response.activity_logs.current_page;
                    this.pagination.total = response.activity_logs.total;
                })
                .catch((error) => {
                    helper.message('error', error);
                    this.loading = false
                });
        },

        page(currPage) {
            this.pagination.current_page = currPage
            this.init();
        }
    },
}
</script>


<style scoped>

</style>


