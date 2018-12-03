<template>
    <div class="app-container">
        <div class="handle-box">
            <span style="float:left; margin-left: 50px; margin-bottom: 20px">用户总数: {{pagination.total}}</span>
            <span style="float:right; margin-right: 50px; margin-bottom: 20px"><el-button class="el-icon-circle-plus" type="primary"  @click="dialogFormVisible = true"> 创建用户</el-button></span>
        </div>

        <div >
            <el-table  :data="users"  element-loading-text="加载中" border fit highlight-current-row v-loading="loading" empty-text="暂无数据" >
                <el-table-column prop="id" label="ID"  width="80" align="center"></el-table-column>
                <el-table-column  label="姓名"  align="center">
                    <template slot-scope="scope">{{scope.row.name}} <template v-if="scope.row.name_en">({{scope.row.name_en}})</template></template>
                </el-table-column>
                <el-table-column label="手机号"  align="center">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column prop="email"  label="邮箱" align="center"></el-table-column>
                <el-table-column label="角色" align="center">
                    <template slot-scope="scope">
                        <el-tag v-for="(role,index) in scope.row.roles" :key='index'>{{role.description}}</el-tag>

                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center"></el-table-column>
                <el-table-column prop="created_at" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <router-link :to="`/user/${scope.row.id}`">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top"><el-button icon="el-icon-edit" type="primary" circle size="mini" ></el-button></el-tooltip>
                        </router-link>

                        <el-tooltip class="item" effect="dark" content="删除" placement="top"><el-button type="danger" icon="el-icon-delete" circle size="mini"  @click="delUser(scope.row.id)" ></el-button></el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination" >
            <el-pagination v-if="pagination.total > 0"  background layout="prev, pager, next" :page-size="pagination.per_page" :current-page = "pagination.current_page"       @current-change ="page" :total="pagination.total"></el-pagination>
        </div>

        <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="80px">
                <el-form-item label="中文名" >
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="英文名" >
                    <el-input v-model="form.name_en" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" >
                    <el-input v-model="form.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" >
                    <el-input v-model="form.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" >
                    <el-input v-model="form.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" >
                    <el-input v-model="form.password_confirmation" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" >
                    <el-select multiple v-model="form.role_id" placeholder="请选择角色">
                        <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button :loading="loading" type="primary" @click="createUser">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>



<script>
import { getUsers, preRequests,addUser, deleteUser  } from "@/api/api";
export default {
    data() {
        return {
            loading: false,
            users: [],
            dialogFormVisible: false,
            roles: [],
            pagination: { current_page: 0, per_page:20 }, //分页
            form: {
                name: '',
                name_en: '',
                gender: 'male',
                email: '',
                mobile: '',
                password: '',
                password_confirmation: '',
                role_id: [],
            },
            formInit:{},

        }
    },

    created: function() {
        this.formInit = this.form
        this.init();
        this.preData();
    },
    // 方法集合
    methods: {
        init() {
            this.loading = true;
            getUsers(this.pagination.current_page, this.pagination.per_page).then((res) => {
                this.users = res.data;
                this.pagination = {current_page: res.current_page, total: res.total, per_page: res.per_page};
                this.loading = false;
            });
        },

        preData() {
            preRequests().then(res => {
                this.roles = res.roles
            })
        },

        // 翻页操作
        page(currPage) {
            this.pagination.current_page = currPage;
            this.init();
        },

        createUser() {
            this.loading = true
            addUser(this.form).then(res => {
                helper.message('success', '新增用户成功!');
                this.form = this.formInit
                this.dialogFormVisible = false;
                this.loading = false;
                this.init();
            }).catch(e => this.loading = false)
        },

        delUser(id) {
            this.$confirm('即将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteUser(id).then(res => {
                        helper.message('success', '删除成功!');
                        this.init();
                    })
                }).catch(() => {}
            );
        },

    },
}
</script>



<style scoped>

</style>


