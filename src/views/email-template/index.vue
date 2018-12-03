<template>
    <div class="app-container">
        <el-card>
           <div slot="header" class="clearfix">
                <span>邮件模板</span>
                <router-link :to="{name:'configurationMailCreate'}"><el-button style="float: right;" type="primary" icon="el-icon-circle-plus">新增模板</el-button></router-link>
            </div>

            <div >
                <el-table :data="templates" element-loading-text="给我一点时间" highlight-current-row v-loading="loading" empty-text="暂无数据" style="width: 100%">
                    <el-table-column  prop="id" label="ID" width="80" ></el-table-column>
                    <!-- <el-table-column  prop="name" label="模板名称" width="240" ></el-table-column> -->
                    <el-table-column  prop="category" label="类别" width="140"></el-table-column>
                    <el-table-column  prop="subject" label="标题"></el-table-column>
                    <el-table-column  prop ="address" label="操作" width="200">
                        <template slot-scope="scope">
                            <router-link :to="{name:'configurationMailEdit', params: {id: scope.row.id}}"><el-button class="el-icon-remove-outline" size="mini"  > 编辑</el-button></router-link>
                            <el-button class="el-icon-zoom-in" size="mini"  type="danger" @click="deleteConfirm(scope.row)" > 删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination" >
                    <el-pagination background layout="prev, pager, next" :page-size="pagination.per_page" :current-page = "pagination.current_page"  @current-change ="page" :total="pagination.total"></el-pagination>
                </div>

            </div>
        </el-card>
    </div>
</template>


<script>
import { emailTemplates, deleteEmailTemplate } from "@/api/api";
export default {
    data() {
        return {
            loading: false,
            templates: [],
            pagination: { current_page: 0 },
        }
    },

    created: function() {
        this.init();
    },

    // 方法集合
    methods: {
        init() {
            this.loading = true;
            emailTemplates(this.pagination.cur).then(res => {
                this.templates = res.data;
                this.pagination.current_page = res.current_page
                this.pagination.total = res.total
                this.pagination.per_page = res.per_page
                this.loading = false
            }).catch(e => this.loading = false)
        },

        // 分页
        page(pageno) {
            this.pagination.current_page = pageno
            this.init();
        },

        // 删除
        deleteConfirm(row) {
            this.$confirm('此操作将永久删除该邮件模板, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteEmailTemplate(row.id).then(res => {
                        helper.message('success', '删除成功!');
                        this.init();
                    }).catch(e => {})
                }).catch(() => {});
        }
    },
}
</script>


<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>

