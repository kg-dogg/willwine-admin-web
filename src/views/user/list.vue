<template>
    <div class="app-container">

            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="员工用户" name="employee">
                    <employees v-if="activeName == 'employee'"></employees>
                </el-tab-pane>
                <el-tab-pane label="学生用户" name="student">
                    <students v-if="activeName == 'student'"></students>
                </el-tab-pane>
                <el-tab-pane label="家长用户" name="parent">
                    <parents v-if="activeName == 'parent'"></parents>
                </el-tab-pane>
            </el-tabs>

    </div>
</template>


<script>
import employees from "./lists/employees";
import students from "./lists/students";
import parents from "./lists/parents";
export default {
    // 引入的组件列表
    components: {
        employees,
        students,
        parents
    },
    data() {
        return {
            activeName: 'employee',
        }
    },
}
</script>

<style scoped>

</style>


