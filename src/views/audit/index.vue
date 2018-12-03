<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                placeholder="模块 ID" v-model="listQuery.auditable_id">
      </el-input>
      <el-select clearable class="filter-item" v-model="listQuery.auditable_type"
                 placeholder="模块">
        <el-option v-for="item in types" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="模块ID">
              <span>{{ props.row.auditable_id }}</span>
            </el-form-item>
            <el-form-item label="操作IP">
              <span>{{ props.row.ip_address }}</span>
            </el-form-item>
            <el-form-item label="修改记录变更 （修改后）（修改前）" class="list">
              <el-row v-for="(item, index) in props.row.new_values" :key="index">
                <el-col :span="8">{{ index }}</el-col>
                <el-col :span="8">{{ item }}</el-col>
                <el-col :span="8">{{ (props.row.old_values)[index] }}</el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
              label="ID"
              prop="id">
      </el-table-column>
      <el-table-column
              label="模块"
              prop="auditable_type">
      </el-table-column>
      <el-table-column
              label="模块ID"
              prop="auditable_id">
      </el-table-column>
      <el-table-column
              label="操作"
              prop="event">
      </el-table-column>
      <el-table-column
              label="操作人"
              prop="user_id">
      </el-table-column>
      <el-table-column
              label="操作时间"
              prop="created_at">
      </el-table-column>
    </el-table>
    <br>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getAudit, getAuditType} from '../../api/api';

  export default {
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        types: [],
        listQuery: {
          page: 1,
          limit: 10,
          auditable_id: undefined,
          auditable_type: undefined,
        }
      };
    },
    mounted() {
      this.getList();
      this.getType();
    },
    methods: {
      getType() {
        getAuditType().then(
          (res) => {
            this.types = res
          }
        )
      },
      getList() {
        this.listLoading = true;
        getAudit(this.listQuery).then(
          (res) => {
            this.list = res.data;
            this.total = res.total;
            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          }
        )
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList()
      },
    },
  };
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-form-item.list {
    width: 100%;
  }

  .el-form-item.list .el-form-item__content {
    display: block;
  }

  .el-form-item.list .el-form-item__label {
    width: 100%;
  }
</style>