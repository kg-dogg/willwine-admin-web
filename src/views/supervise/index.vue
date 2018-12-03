<template>
    <div class="app-container">
        <div class="filter-container">
            <h2>班级管理</h2>
        </div>
        <div>
            <el-table :data="tableDatas" border fit highlight-current-row
                      style="width: 100%" v-loading="loading" element-loading-text="给我一点时间">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="title" label="课程"></el-table-column>
                <el-table-column prop="live_type" label="类型"></el-table-column>
                <el-table-column label="班级数">
                    <template slot-scope="scope">
                        <div>总数：{{ scope.row.total}}</div>
                        <div>已分配：{{ scope.row.assigned}}</div>
                        <div>未分配：{{ scope.row.unassigned}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { classCurriculum } from "../../api/api.js"
    export default {
        data() {
            return {
                loading: true,
                tableDatas: []
            }
        },
        created: function() {
            this.getData()
        },

        // 方法集合
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                classCurriculum().then((res) => {
                    this.tableDatas = res;
                    this.loading = false;
                }).catch(error => console.log(error.response.data))
            }
        }
    }
</script>
<style scoped>
</style>