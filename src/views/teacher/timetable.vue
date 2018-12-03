<template>
    <div class="app-container">
        <el-card class="teacher-timetable">
            <div slot="header" class="clearfix">
                <span style="float:left; padding-top:10px; padding-bottom:10px">外教的个人日程</span>
                <span style="float:right;"><el-button type="text" icon="el-icon-d-arrow-left" @click="back">返回</el-button></span>
            </div>

            <div>
                <el-alert title="老师统计" type="info" description="" show-icon style="margin-bottom:10px;" :closable="false">
                    <div class="ft_small">
                        <span>老师使用率: {{teacherDetail.timetable_using || 0.0}}%</span>
                        <span class="ml-25">排课课时数: {{teacherDetail.timetable_lessonscount || 0}}</span>
                        <span class="ml-25">实际排课小时: {{teacherDetail.timetable_actualtime || 0}}</span>
                        <span class="ml-25">买断排课小时: {{teacherDetail.timetable_buytime || 0}}</span>
                    </div>
                </el-alert>
            </div>

            <div style="margin-top: 20px">
                <div style="float:left">
                    <el-form :inline="true" label-width="80px">
                        <el-form-item label="选择时间">
                            <el-date-picker class="filter-item" style="width:450px" v-model="select_date" type="daterange" range-separator="至"  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                            <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="searchHandle">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="float:right">
                    <el-checkbox v-model="switch_show.normal" label="已预约" border size="medium"></el-checkbox>
                    <el-checkbox v-model="switch_show.canceled" label="已取消" border size="medium"></el-checkbox>
                    <el-checkbox v-model="switch_show.finished" label="已结束" border size="medium"></el-checkbox>
                    <el-checkbox v-model="switch_show.worded" label="可用" border size="medium"></el-checkbox>
                </div>
            </div>

             <el-table  :data="schedules"   element-loading-text="加载中" border highlight-current-row v-loading="loading" empty-text="暂无数据" :cell-class-name="getCellClass" :header-row-class-name="getHeaderClass" >
                <el-table-column  align="right" width="80">
                    <template slot-scope="scope"  >
                        {{scope.row.time}}
                    </template>
                </el-table-column>

                <el-table-column v-for="day in schedules_day" :key="day"   :label="day" align="center" >
                    <template slot-scope="scope"  >
                        <div v-if="hasLessons(scope.row, day)" :class="getCellDivClass(scope.row, day)">
                            <!-- 这里价格循环,为了和大课表的数据处理保持一致 + 扩展性, 这里针对单个老师的话,实际上只有一个值 -->
                            <div v-for="lesson in scope.row[day]" :key="lesson.id">
                                <div v-if="lesson.status == 'NORMAL' && switch_show.normal">
                                    <div>已预约</div>
                                    <div>{{lesson.scheduled_at | timeShow}} ~ {{lesson.scheduled_end_at | timeShow}}</div>
                                </div>

                                <div v-if="lesson.status == 'CANCELED' && switch_show.canceled">
                                    <div>已取消</div>
                                    <div>{{lesson.scheduled_at | timeShow}} ~ {{lesson.scheduled_end_at | timeShow}}</div>
                                </div>

                                <div v-if="lesson.status == 'FINISHED' && switch_show.finished">
                                    <div>已结束</div>
                                    <div>{{lesson.scheduled_at | timeShow}} ~ {{lesson.scheduled_end_at | timeShow}}</div>
                                </div>

                                <div v-if="lesson.status == 'PROGRESS'">
                                    <div>上课中</div>
                                    <div>{{lesson.scheduled_at | timeShow}} ~ {{lesson.scheduled_end_at | timeShow}}</div>
                                </div>

                                <div v-if="lesson.status == 'ABNORMAL'">
                                    <div>已请假</div>
                                    <div>{{lesson.scheduled_at | timeShow}} ~ {{lesson.scheduled_end_at | timeShow}}</div>
                                </div>

                            </div>
                        </div>
                    </template>
                </el-table-column>

            </el-table>

        </el-card>
    </div>
</template>

<script>
import { getTeacherDetail } from "@/api/api";
export default {
    data() {
        return {
            loading: false,
            select_date: '',
            teacherDetail: {},
            id: this.$route.params.id,
            schedules_time: [
                '08:00:00', '08:30:00', '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00',
                '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00', '17:30:00',
                '18:00:00', '18:30:00', '19:00:00', '19:30:00', '20:00:00', '20:30:00', '21:00:00', '21:30:00',
            ],
            schedules_day: [],
            schedules: [],
            switch_show: {
                normal: true,
                canceled:true,
                finished:true,
                worded:true
            }
        }
    },

     created() {
        this.initDay().then(() => {
            this.getData();
        });
    },

    // 方法集合
    methods: {
        // 初始化日期
        initDay() {
            this.schedules_day = [];
            if (this.select_date.length === 2) {
                for (let i = 0; i <= moment(this.select_date[1]).diff(this.select_date[0], 'days'); i += 1) {
                    this.schedules_day.push(moment(this.select_date[0]).add(i, 'days').format('YYYY-MM-DD'));
                }
            } else {
                // const start = moment();
                for (let i = 0; i < 7; i += 1) {
                    this.schedules_day.push(moment().add(i, 'days').format('YYYY-MM-DD'));
                }
            }
            return new Promise((resolve, reject) => resolve());
        },

        getData() {
            this.loading = true;
            getTeacherDetail(this.id, 'lessons', _.head(this.schedules_day), _.last(this.schedules_day)).then((res) => {
                this.schedulesData = res.data.lessons.data;
                this.teacherDetail = res.data;
                this.fliterData();
                this.loading = false;
            });
        },

        // 判断某列日期下是否有数据
        hasLessons(row, day) {
            if (_.has(row, day)) {
                return true;
            }
            return false;
        },

        getCellClass({ row, column, columnIndex }) {
            if (columnIndex === 0) {
                return 'time';
            }

            // 有数据的单元格
            if (_.has(row, column.label)) {
                let lesson = row[column.label][0];
                // 如果已经结束
                if (lesson.status == 'FINISHED' && this.switch_show.finished)
                    return 'cell_table_finished'

                // 如果已取消
                if (lesson.status == 'CANCELED' && this.switch_show.canceled)
                    return 'cell_table_cancel';

                // 如果已预约
                if (lesson.status == 'NORMAL' && this.switch_show.normal)
                    return 'cell_table_normal';

                // 默认
                return 'cell_table_default';
            } else {
                // 没有数据的格子,看是否在老师的可上课时间
                if (this.checkIsInWorkTime(row.time, column.label) && this.switch_show.worded) {
                    return 'cell_table_work';
                };

            }

            //return 'cell_table_normal';
        },

        getCellDivClass(row, day) {

                return 'cell_normal';


        },

        getHeaderClass({ row, rowIndex }) {
            return 'schedule_table_header';
        },

        // 组装数据
        fliterData() {
            this.schedules = [];
            if (this.schedulesData.length <= 0) {
                // return
            }


            for (let j = 0; j < this.schedules_time.length; j += 1) {
                const lessons = {};
                for (let i = 0; i < this.schedules_day.length; i += 1) {
                    const time = `${this.schedules_day[i]} ${this.schedules_time[j]}`;
                    const lessonData = _.find(this.schedulesData, ['scheduled_at', time]);

                    if (lessonData) {
                        if (_.has(lessons, this.schedules_day[i])) {
                            lessons[this.schedules_day].push(lessonData);
                        } else {
                            lessons[this.schedules_day[i]] = [lessonData];
                        }
                    }
                }

                // 找渲染数组的时间点是否已经有
                const idx = _.findIndex(this.schedules, ['time', this.schedules_time[j]]);
                if (idx === -1) {
                    lessons.time = this.schedules_time[j];
                    this.schedules.push(lessons);
                } else {
                    this.schedules[idx] = {
                        ...this.schedules[idx],
                        lessons,
                    };
                }
            }
        },

        // 判断某个时间段是否属于老师的工作区间内
        // 注意这里的time是起始时间,区间结束还应算上time+30min
        checkIsInWorkTime(time, day) {
            // 获取day是周几
            const week = moment(day).weekday();

            if (!_.has(this.teacherDetail.work_time, week)) {
                return false;
            }

            // 计算表格过来的time的区间结束时间
            var rtn = false;
            const time_end = moment(`${day} ${time}`).add(30, 'm').format('HH:mm:ss');
            this.teacherDetail.work_time[week].forEach(v => {
                if (v[0] <= time && v[1] >= time_end) {
                    rtn = true;
                }
            })
            return rtn;
        },

        // 选择时间后的搜索
        searchHandle() {
            this.initDay().then(() => {
                this.getData();
            });
        },

        // 返回按钮
        back() {
            this.$router.go(-1);
        }


    },

    filters: {
        timeShow(time) {
            return moment(time).format('hh:mm');
        }
    }
}
</script>



<style lang="scss" >
.ml-25 {
    margin-left: 25px;
}
.teacher-timetable {
    .time {
        border-bottom: none;
        border-left: none;
        color: brown;
    }
    .schedule_table_header {
        color: red;
    }

    .ft_small {
        font-size: 0.3em;
    }

    // 单元格没有数据切在工作时间内
    .cell_table_work {
        background-color: #86FDA4;
        color: #660033;
        font-size: 0.3em;
        padding: 30px
    }

    // 单元格有数据时候的各种状态样式
    // 默认
    .cell_table_defatul {
        background-color: gainsboro;
        color: #660033;
        font-size: 0.3em;
        height: 100px;
        padding: 30px
    }
    // 正常预约状态
    .cell_table_normal {
        background-color: #DC7CFD;
        color: #660033;
        font-size: 0.3em;
        height: 100px;
        padding: 30px
    }

    .cell_table_finished {
        background-color: #F2F2F2;
        color: #660033;
        font-size: 0.3em;
        height: 100px;
        padding: 30px
    }

    // 取消状态
    .cell_table_cancel {
        background-color: #FECDB5;
        color: #660033;
        font-size: 0.3em;
    }
}

</style>



