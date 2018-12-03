<template>
    <div class="app-container">
         <el-alert style="margin-bottom:20px" title="权限功能说明"  type="warning"  description="权限相关功能目前由开发在配置中维护,建议新增与删除功能由管理员或开发人员进行配置与开发"  show-icon></el-alert>
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card>
                    <div slot="header" class="clearfix">
                        <el-button type="text" >权限列表</el-button>
                        <router-link to="/configuration/permission/assign"><el-button style="float:right" type="success" plain>分配权限</el-button></router-link>
                    </div>
                    <el-table :data="permissions" element-loading-text="给我一点时间" highlight-current-row v-loading="loading" border empty-text="暂无数据" style="width: 100%" :span-method="objectSpanMethod">
                        <el-table-column  prop="group" label="模块"  >
                            <template slot-scope="scope"><b>{{scope.row.group_name}}</b> ({{scope.row.group}})</template>
                        </el-table-column>
                        <el-table-column  prop="desc" label="权限"  >
                            <template slot-scope="scope">{{scope.row.desc}} ({{scope.row.name}})</template>
                        </el-table-column>
                        <el-table-column  prop ="address" label="操作" width="100px">
                            <template slot-scope="scope">
                                <el-button type="danger" size="mini" icon="el-icon-delete" circle disabled ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>


                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <div slot="header" class="clearfix"><el-button type="text" >快速新增权限</el-button></div>
                    <permissionForm @completed="getPermissions"></permissionForm>
                </el-card>
            </el-col>


        </el-row>

    </div>
</template>



<script>
import permissionForm from './form';
export default {
    components: { permissionForm },

    data() {
        return {
            loading:false,
            permissions: [],
            pagination: {per_page:10, current_page:0}

        }
    },

    created: function() {
        this.getPermissions(1);
    },

    // 方法集合
    methods: {
        getPermissions() {
            axios.get(`/permission`)
                .then(response => response.data)
                .then((response) => {
                    this.processPermissions(response);
                })
                .catch((error) => {
                    helper.message('error', error);
                });
        },

        page(page) {
            this.pagination.current_page = page;
            this.getPermissions();
        },

        deleteConfirm(row) {
            this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deletePermission(row);
            }).catch(() => {});
        },

        deletePermission(permission) {
            axios.delete(`/permission/${permission.id}`)
                .then(response => response.data)
                .then((response) => {
                    this.loading = false;
                    helper.message('success', response.message);
                    this.getPermissions();
                }).catch((error) => {
                    helper.message('error', error);
                    this.loading = false;
                });
        },


        // 重新组装权限
        processPermissions(permissionGroup) {
            const permissions = [];
            permissionGroup.forEach((group) => {
                Object.keys(group.permissions).forEach((subPermissionEn) => {
                    let childNum = Object.keys(group.permissions).length;
                    let temp = {
                        name: `${subPermissionEn}_${group.name}`,
                        desc: group.permissions[subPermissionEn],
                        group: group.name,
                        group_name: group.des,
                        col: childNum,
                    }
                    permissions.push(temp);
                })
            })
            this.permissions = permissions;
        },

        // 合并单元格操作
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (row.col > 1) {
                    if ((rowIndex + 1) % row.col === 0) {
                        return {rowspan: row.col, colspan: 1};
                    } else {
                        return {rowspan: 0, colspan: 1};
                    }
                } else {
                    return {rowspan: 1, colspan: 1};
                }

            }
        }
    },
}
</script>


<style scoped>

</style>


