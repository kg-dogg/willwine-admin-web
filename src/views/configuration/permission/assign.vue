<template>
    <div class="app-container">
        <el-alert style="margin-bottom:20px" title="权限功能说明" type="warning" description="权限相关功能目前由开发在配置中维护,建议新增与删除功能由管理员或开发人员进行配置与开发" show-icon></el-alert>

        <el-card>
            <div slot="header" class="clearfix">分配权限</div>

            <!-- <table class="table table-bordered" v-loading="loading">
                <thead>
                    <tr>
                        <th>模块</th>
                        <th>权限列表</th>
                        <th v-for="(role,index) in roles" :key='index' class="text-center">{{role.description}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(permission,index) in permissionsShow" :key='index'>
                        <td v-if="getRowSpan(permission, index).rowspan > 0" :rowspan="getRowSpan(permission, index).rowspan" :colspan="getRowSpan(permission, index).colspan"><b>{{permission.groupname}}</b></td>
                        <td>{{permission.description}}({{permission.name}})</td>
                        <td v-for="(role,index) in roles" :key='index' class="text-center">
                            <el-switch v-model="assignPermission.data[role.id][permission.id]"></el-switch>
                        </td>
                    </tr>
                </tbody>
            </table> -->

            <el-table v-loading="loading" :data="permissionsShow" :span-method="spanMethod" border >
                <el-table-column prop="groupname" label="模块" width="100" fixed >
                </el-table-column>
                <el-table-column prop="description" label="权限列表" width="180" fixed>
                    <template slot-scope="scope">
                        <span>{{scope.row.description}}({{scope.row.name}})</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(role,index) in roles" :key="role.name" :label="role.description">
                    <template slot-scope="scope">
                        <el-switch v-model="assignPermission.data[role.id][scope.row.id]"></el-switch>
                    </template>
                </el-table-column>
            </el-table>

            <div style="float:left; margin:20px 0">
                <el-button type="primary" icon="el-icon-success" :loading="loading" @click="savePermission()">保存</el-button>
                <router-link to="/configuration/permission">
                    <el-button type="info" icon="el-icon-back">返回</el-button>
                </router-link>
            </div>
        </el-card>
    </div>
</template>



<script>
import { getPermissionPre, getPermissions } from "@/api/api";
export default {
  data() {
    return {
      guards: [{ lable: "后台角色权限管理", name: "web" }],
      guard: "web",
      roles: [],
      loading: false,
      permissions: [],
      permissionsShow: [],
      permissionConfig: {},
      assignPermission: {
        data: {}
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
      getPermissionPre(this.guard)
        .then(res => {
          this.permissions = res.permissions;
          this.roles = res.roles;
          this.assignPermission.data = res.data;
          // 获取权限中文描述配置
          getPermissions()
            .then(res => {
              this.processPermissions(res);
              this.loading = false;
            })
            .catch(e => {
              this.loading = false;
            });
        })
        .catch(error => {
          helper.message("error", error);
        });
    },

    savePermission() {
      this.loading = true;
      axios
        .post("/permission/assign", {
          data: this.assignPermission.data
        })
        .then(response => response.data)
        .then(response => {
          helper.message("success", "权限分配成功");
          this.init();
          this.loading = false;
        })
        .catch(error => {
          helper.message("error", error);
          this.loading = false;
        });
    },

    // 重新组装权限
    processPermissions(permissionGroup) {
      this.permissions.forEach((permission, k, a) => {
        let group = _.split(permission.name, "-");
        let groupFind = _.find(permissionGroup, ["name", group[1]]);
        this.permissions[k].groupname = groupFind.des;
        this.permissions[k].col = Object.keys(groupFind.permissions).length;
      });
      this.permissionsShow = this.permissions;

      // permissionGroup.forEach((group) => {
      //     Object.keys(group.permissions).forEach((subPermissionEn) => {
      //         let childNum = Object.keys(group.permissions).length;
      //         let temp = {
      //             name: `${subPermissionEn}_${group.name}`,
      //             desc: group.permissions[subPermissionEn],
      //             group: group.name,
      //             group_name: group.des,
      //             col: childNum,
      //         }
      //         permissions.push(temp);
      //     })
      // })
      // //this.permissionConfig = permissions;
    },

    getRowSpan(row, rowIndex) {
      if (row.col > 1) {
        if ((rowIndex + 1) % row.col === 0) {
          return { rowspan: row.col, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 1 };
        }
      } else {
        return { rowspan: 1, colspan: 1 };
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      return this.getRowSpan(row, rowIndex);
    }
  }
};
</script>



<style scoped>
.el-card {
  overflow-x: auto;
}
</style>


