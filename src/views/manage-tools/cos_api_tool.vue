<template>
    <div class="app-container">
        <el-card>
            <div slot="header" class="clearfix"><el-button type="text" >COS接口工具</el-button> <i>(可以直接和COS接口通信，查看请求xml数据和COS返回xml数据，以及系统处理结果)</i></div>

            <div class="filter-container">
                <el-select clearable class="filter-item" v-model="search.action" placeholder="请选择接口">
                    <el-option label="学生" value="student"></el-option>
                    <el-option label="班型" value="classtype"></el-option>
                    <el-option label="合同" value="contract"></el-option>
                    <el-option label="异动" value="abnormal"></el-option>
                    <el-option label="校区班级" value="schoolclass"></el-option>
                    <el-option label="班级排课" value="classtimetable"></el-option>
                    <el-option label="班级学生" value="classstudent"></el-option>
                </el-select>
                <el-select clearable class="filter-item" v-model="search.action_type" placeholder="请选择接口类型">
                    <el-option label="新增" value="add"></el-option>
                    <el-option label="更新" value="update"></el-option>
                </el-select>
                <el-input style="width: 300px;" class="filter-item" placeholder="输入接口对应ID" v-model="search.action_id"></el-input>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchHandle" :loading="loading">测试</el-button>

                <el-form label-width="80px" label-position="top">
                    <el-tabs type="border-card">
                        <el-form-item label="请求XML">
                            <el-input  type="textarea" :rows="6" placeholder="显示接口请求COS的XML数据" v-model="res.request"></el-input>
                        </el-form-item>
                    </el-tabs>
                    <el-tabs type="border-card">
                        <el-form-item label="接收XML">
                            <el-input  type="textarea" :rows="10" placeholder="显示COS返回的XML数据" v-model="res.response"></el-input>
                        </el-form-item>
                    </el-tabs>
                    <el-tabs type="border-card">
                        <el-form-item label="系统处理结果">
                            <el-input  type="textarea" :rows="6" placeholder="显示系统处理数据结果" v-model="res.show"></el-input>
                        </el-form-item>
                    </el-tabs>
                </el-form>
            </div>
        </el-card>
    </div>
</template>


<script>
export default {
    data() {
        return {
            loading:false,
            search: [],
            res : [],
        }
    },

    created: function() {
    },

    // 方法集合
    methods: {
        searchHandle() {
            if(this.search.action == '' || this.search.action == undefined) {
                helper.message('error', '请选择接口');
                exit;
            }

            if(this.search.action_type == '' || this.search.action_type == undefined) {
                helper.message('error', '请选择接口类型');
                exit;
            }

            if(this.search.action_id == '' || this.search.action_id == undefined) {
                helper.message('error', '请输入接口对应ID');
                exit;
            }
            this.loading = true;
            axios.get(`/tools/cos_api?action=${this.search.action}&action_id=${this.search.action_id}&action_type=${this.search.action_type}`).then(response => response.data)
                .then((response) => {
                    this.loading = false;
                    this.res = response.data;
                    this.res.show = "【" + response.data.message + "】【" + JSON.stringify(response.data.data) + "】";
                })
                .catch((error) => {
                    helper.message('error', error);
                    this.loading = false
                });
        },
    },
}
</script>


<style scoped>

</style>


