<template>
    <div>
    <div class="timetableItem">
        <div class="border-right lesson-index" style='width:11%'>第{{data.index+1}}课时</div>
        <div class="border-right" style='width:21%'>{{data.item.scheduled_at}}</div>
        <div class="border-right" style='width:24%'>
            外教：{{getTeacherName(data.item)}}
            <el-button class='button' size="mini" type="warning" plain @click='showLeave' v-if="canLeave">请假</el-button>
        </div>
        <div class="border-right" style='width:22%'>
            <span v-if="data.item.status == 'NORMAL'">
                未上课
                <el-tag type="warning" size="medium">学生请假</el-tag>
            </span>
            <span v-if="data.item.status == 'CANCELED'">已取消</span>
            <span v-if="data.item.status == 'FINISHED'">
                上课成功
                <el-button class='button' size="mini" type="primary" plain>回放</el-button>
            </span>
            <span v-if="data.item.status == 'PROGRESS'">上课中</span>



        </div>
        <div style='width:20%'>
            作业完成
            <!-- <el-button class='button' size="mini" type="primary" plain>报告</el-button> -->
            <el-button class='button' size="mini" type="primary" plain @click='showComment'>评语</el-button>
        </div>
    </div>

    <div v-if="data.markups">
        <div class="timetableItem" v-for="markup in data.markups">
            <div class="border-right lesson-index" style='width:11%'>
                第{{data.index+1}}课时
                <el-tag type="info" size='small'>补课</el-tag>
            </div>
            <div class="border-right" style='width:21%'>{{markup.scheduled_at}}</div>
            <div class="border-right" style='width:24%'>
                外教：{{getTeacherName(markup)}}
                <el-button class='button' size="mini" type="warning" plain @click='showLeave' v-if="canLeave">请假</el-button>
            </div>
            <div class="border-right" style='width:22%'>
                <span v-if="markup.status == 'NORMAL'">
                    未上课
                    <el-tag type="warning" size="medium">学生请假</el-tag>
                </span>
                <span v-if="markup.status == 'CANCELED'">已取消</span>
                <span v-if="markup.status == 'FINISHED'">
                    上课成功
                    <el-button class='button' size="mini" type="primary" plain>回放</el-button>
                </span>
                <span v-if="markup.status == 'PROGRESS'">上课中</span>



            </div>
            <div style='width:20%'>
                作业完成
                <!-- <el-button class='button' size="mini" type="primary" plain>报告</el-button> -->
                <el-button class='button' size="mini" type="primary" plain @click='showComment'>评语</el-button>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
export default {
    methods:{
        showLeave() {
            this.$emit('showLeave');
        },
        showComment() {
            this.$emit('showComment');
        },
         // 获取老师姓名
        getTeacherName(val) {
            if (this.data.teachers && this.data.teachers[val.teacher_id]) {
                return this.data.teachers[val.teacher_id].name;
            }
        },

    },
    // 计算属性
    computed: {
        // 判断是否可以请假
        canLeave() {
            let canLeaveHours = 1;     // 可以请假的提前小时数
            if (this.data.item.status == 'NORMAL' && moment() < moment(this.data.item.scheduled_at).subtract(canLeaveHours, 'hours')) {
                return true;
            } else {
                return false;
            }
        }
    },

    // 父组件传递进来的数据
    props: {
        data: {
            type: Object,
            required: true,
            default: function () {
                return {}
            }
        },
        index: {
            type: Number,
            required: true,
            default: function () {
                return 0
            }
        }
    },
}

</script>
<style scoped>
.timetableItem{
    margin-bottom: -1px;
    padding: 0 20px 0 0;
    border: 1px solid #eee;
}
.timetableItem:hover{
    background: rgb(243, 243, 243);
}
.timetableItem div{
    display: inline-block;
    padding-left: 20px;
    min-height:60px;
    line-height: 60px;
}
.timetableItem .lesson-index{
    text-align: center;
    padding-left: 0;
}
.button{
    margin-left: 5px;
}
.border-right{
   border-color: #eee !important;
}


</style>

