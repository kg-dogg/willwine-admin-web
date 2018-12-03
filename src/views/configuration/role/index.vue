<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card>
                    <div slot="header" class="clearfix">角色列表</div>
                    <el-table :data="roles" element-loading-text="给我一点时间" highlight-current-row v-loading="loading" empty-text="暂无数据" style="width: 100%">
                        <el-table-column  prop="name" label="角色名"  ></el-table-column>
                        <el-table-column  prop="description" label="描述"></el-table-column>
                        <el-table-column  prop ="address" label="操作" width="100px">
                            <template slot-scope="scope">
                                <el-button type="danger" size="mini" :disabled="scope.row.name == 'admin'" icon="el-icon-delete" circle @click="deleteConfirm(scope.row)" ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <div slot="header" class="clearfix">快速新增角色</div>
                    <roleForm @completed="getRoles"></roleForm>
                </el-card>
            </el-col>


        </el-row>

    </div>
</template>

<script>
import roleForm from './form';
import { roleList } from "@/api/api";
export default {
    components: { roleForm },

    data() {
        return {
            loading: false,
            roles: [],
        }
    },

    created: function() {
        this.getRoles();
    },

    // 方法集合
    methods: {
        getRoles() {
            this.loading = true
            roleList().then(res => {
                this.roles = res
                this.loading = false
            }).catch(e => {
                this.loading = false
            })
        },
        deleteConfirm(row) {
            this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRole(row);
            }).catch(() => {});
        },

        deleteRole(role) {
            this.loading = true;
            axios.delete(`/role/${role.id}`)
                .then(response => response.data)
                .then((response) => {
                    helper.message('success', response.message);
                    this.loading = false
                    this.getRoles();
                }).catch((error) => {
                    this.loading = false
                });
        },
    }
}
</script>


<style scoped>

</style>


