<template>
    <div class="app-container">
        <el-card class="box-card">
            <el-form ref="ruleForm"  :model="form" :rules="rules" label-width="80px" style="width:50%" v-loading="loading">
                <el-form-item label="可补课时" prop="lessons">
                    <el-select v-model="form.lessons" placeholder="请选择需要补课的课时">
                        <el-option v-for="course in data.course" :key="course._id" :label="course.title" :value="course._id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="补课日期" required>
                    <el-col :span="11">
                        <el-form-item prop="date">
                            <el-date-picker :picker-options="pickerOptionsDate" type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;" @change="dateChange"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="1" > &nbsp;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="time">
                            <el-select v-model="form.time" placeholder="选择时间">
                                <el-option v-for="time in pickerOptionsTime" :key="time" :label="time" :value="time"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="选择外教" prop="teacher">
                    <el-autocomplete
                        class="inline-input"
                        style="width:60%"
                        v-model="form.teacher"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                        >
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.name_en }}</div>
                                <span class="addr">{{ item.email }}</span>
                            </template>
                        </el-autocomplete>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="loading_btn">安排补课</el-button>
                    <el-button  @click="back">取消</el-button>
                </el-form-item>

            </el-form>
        </el-card>
    </div>
</template>


<script>
import { getMakeupLesson, addMakeupLesson } from "@/api/api";
export default {
    data() {
         var validateTeacher = (rule, value, callback) => {
            if (this.teacher_id == "") {
                callback(new Error('请选择正确的外教老师'));
            }
            callback();
        };
        return {
            loading:false,
            loading_btn:false,
            curriculum_id: this.$route.query.curriculum_id,
            student_id: this.$route.query.student_id,
            form: {
                lessons:"",
                date:"",
                time:"",
                teacher: "",
                teacher_id: "",
            },
            teachers:[],

            data: {},

            pickerOptionsDate: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
            },

            times: {
                'm': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],   //morning
                'a': ['15:00', '15:30', '16:00', '16:30'],      // afternoon
                'e': ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'], // evening
            },



            rules: {
                lessons: [
                    { required: true, message: '请选择课时', trigger: 'change' },
                ],
                date: [
                    { required: true, type: 'date', message: '请选择日期', trigger: 'change' },
                ],
                time: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
                teacher: [
                    { required: true, message: '请选择外教', trigger: 'blur' },
                    { validate: validateTeacher, trigger: 'blur' }
                ]
            }
        }

    },

    // 计算属性
    computed: {
        pickerOptionsTime() {
            if (this.form.date != "") {
                if (moment(this.form.date).day() === 0 || moment(this.form.date).day() === 6) {
                    return _.concat(this.times.m, this.times.a, this.times.e);
                } else {
                    return this.times.e;
                }
            }
        }
    },

    created: function() {
        this.init();
    },

    // 方法集合
    methods: {
        init() {
            this.loading = true
            getMakeupLesson(this.curriculum_id, this.student_id).then((res) => {
                this.data = res.data
                this.teachers = res.data.teacher
                this.loading = false
            }).catch(error => {
                this.loading = false
            })
        },

        dateChange(date) {
            this.form.time = "";
        },
        back() {
            this.$router.push({ name: 'timetableList', query:{student_id:this.student_id, curriculum_id:this.curriculum_id} });
        },
        onSubmit() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    let formData = {
                        student_id: this.student_id,
                        teacher_id: this.form.teacher_id,
                        course_id: this.form.lessons + "",
                        time: `${moment(this.form.date).format("YYYY-MM-DD")} ${this.form.time}`
                    }
                    this.loading_btn = true;
                    addMakeupLesson(formData).then(res => {
                        this.$alert('补课成功!', '成功', {
                            confirmButtonText: '确定',
                            callback: (action) => { this.$router.push({ name: 'timetableList', query:{student_id:this.student_id, curriculum_id:this.curriculum_id} }); },
                        });
                        this.loading_btn = false;
                    }).catch(error => {
                        this.loading_btn = false
                        helper.message('error', error);
                    })
                } else {
                    return false;
                }
            });
        },

        querySearch(queryString, cb) {
            var teachers = this.teachers;
            var results = queryString ? teachers.filter(this.createFilter(queryString)) : teachers;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (teachers) => {
                return (teachers.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
                || (teachers.name_en.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
                || (teachers.email.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
            };
        },
        handleSelect(item) {
            this.form.teacher = item.name_en ? item.name_en : item.name
            this.form.teacher_id = item.id
        }

    },
}
</script>


<style scoped>

</style>


