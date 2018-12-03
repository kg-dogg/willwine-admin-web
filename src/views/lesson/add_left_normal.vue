<template>
    <div class="app-container">
        <el-card class="box-card">


                <el-form label-width="160px" v-if="orderDetail.product">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item  label="学生姓名">
                                <el-input :value="orderDetail.student.data.name" disabled></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="订单产品">
                                <el-input :value="orderDetail.product.data.name" disabled></el-input>
                            </el-form-item>

                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="课程">
                                <el-input :value="orderDetail.curriculum.data.title" disabled></el-input>
                            </el-form-item>

                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="补加课时数">
                                {{tags.length}} / {{leftNum}}
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="已选老师" v-if="orderDetail.teacher">
                                <el-input v-for="i in orderDetail.teacher.data" :key="i.id" disabled :value="i.name" ></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>


                </el-form>
        </el-card>

        <el-card class="box-card" style="margin-top:20px">
            <div><span style="color:red">*</span>  选择上课时间:</div>
            <div style="margin-top:10px;margin-bottom:10px; width:25%; float:left">
                <full-calendar ref="calendar" :config="config" :events="events" @day-click="dayClick"/>
            </div>

            <div style="float:left; margin-left:70px;margin-top:50px; width:60%">
                <el-card class="box-card" style="">
                    <el-row>
                        <el-col :span="8">
                            <el-card class="box-card" >
                                <div slot="header" class="clearfix">
                                    <span>上午</span>
                                    <!-- <el-button style="float: right; " type="text">全选</el-button> -->
                                </div>
                                <el-checkbox-group v-model="dymicTimesSelected" @change="timeChange" :disabled="!isWeekend">
                                    <el-checkbox label="08:00" style="margin-left: 30px;"></el-checkbox>
                                    <el-checkbox label="08:30"></el-checkbox>
                                    <el-checkbox label="09:00"></el-checkbox>
                                    <el-checkbox label="09:30"></el-checkbox>
                                    <el-checkbox label="10:00"></el-checkbox>
                                    <el-checkbox label="10:30"></el-checkbox>
                                    <el-checkbox label="11:00"></el-checkbox>
                                </el-checkbox-group>
                            </el-card>
                        </el-col>

                        <el-col :span="8">
                        <el-card class="box-card" style="margin-left:30px">
                            <div slot="header" class="clearfix">
                                <span>下午</span>
                                <!-- <el-button style="float: right; " type="text">全选</el-button> -->
                            </div>
                            <el-checkbox-group v-model="dymicTimesSelected" @change="timeChange" :disabled="!isWeekend">
                                <el-checkbox label="15:00" style="margin-left: 30px;"></el-checkbox>
                                <el-checkbox label="15:30"></el-checkbox>
                                <el-checkbox label="16:00"></el-checkbox>
                                <el-checkbox label="16:30"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        </el-col>

                        <el-col :span="8">
                            <el-card class="box-card" style="margin-left:30px">
                                <div slot="header" class="clearfix">
                                    <span>晚上</span>
                                    <!-- <el-button style="float: right; " type="text">全选</el-button> -->
                                </div>
                                <el-checkbox-group v-model="dymicTimesSelected" @change="timeChange" :disabled="currDate === ''">
                                    <el-checkbox label="17:00" style="margin-left: 30px;"></el-checkbox>
                                    <el-checkbox label="17:30"></el-checkbox>
                                    <el-checkbox label="18:00"></el-checkbox>
                                    <el-checkbox label="18:30"></el-checkbox>
                                    <el-checkbox label="19:00"></el-checkbox>
                                    <el-checkbox label="19:30"></el-checkbox>
                                    <el-checkbox label="20:00"></el-checkbox>
                                    <el-checkbox label="20:30"></el-checkbox>
                                    <el-checkbox label="21:00"></el-checkbox>
                                    <el-checkbox label="21:30"></el-checkbox>
                                </el-checkbox-group>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>

                 <!-- <el-checkbox-group v-model="dymicTimesSelected" @change="timeChange">
                    <el-checkbox v-for="time in dymicTimes" :key="time.value" :label="time.value" :value="time.value" ></el-checkbox>
                </el-checkbox-group> -->
            </div>

        </el-card>

        <el-card class="box-card" style="margin-top:20px">
            <div><span style="color:red">*</span>  已选上课时间:</div>
                <el-tag style="margin-right:20px" v-for="tag in tags" closable  :key="tag"  @close="closeTag(tag)">{{tag}}</el-tag>
                <p v-if="tags.length == 0">暂无选择数据</p>

        </el-card>

        <hr />

        <el-form>
            <el-form-item>
                <el-button type="primary" @click="searchTeacher">确认排课</el-button>
            </el-form-item>
        </el-form>


    </div>
</template>


<script>
import { getSuborderDetail, addLeftLessonsNormal } from '@/api/api';
import { FullCalendar } from 'vue-full-calendar';
import 'fullcalendar/dist/locale/zh-cn';

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      soid: this.$route.query.soid,

      orderDetail: {}, // 产品包,暂时没有
      finalDates: [], // 最终计算完成后要传的时间数组
      teachers: [],

      selectedAddNums: '',
      dates: {},
      checkList: [],
      isWeekend: false,

      // 日历配置
      config: {
        defaultView: 'month',
        locale: 'zh-cn',
        // height: 200,
        contentHeight: 'auto',
        editable: true,
        // aspectRatio: 18.4,
        eventRender(event, element) {
          console.log(event);
        },

        header: {
          left: '',
          center: 'title',
          right: 'prev,next',
        },

        // dayClick(date, jsEvent, view) {
        //     //alert('Clicked on: ' + date.format());

        //     // change the day's background color just for fun
        //     //$(this).css('background-color', 'red');
        //     //this.changeDate(date);

        // }
      },
      // 事件列表
      events: [],

      // 时间列表
      dymicTimes: [],
      dymicTimesSelected: [],
      currDate: '',
      tags: [],
      times: [
        { value: '08:00', isWeekend: false },
        { value: '08:30', isWeekend: false },
        { value: '09:00', isWeekend: false },
        { value: '09:30', isWeekend: false },
        { value: '10:00', isWeekend: false },
        { value: '10:30', isWeekend: false },
        { value: '11:00', isWeekend: false },
        { value: '15:00', isWeekend: false },
        { value: '15:30', isWeekend: false },
        { value: '16:00', isWeekend: false },
        { value: '16:30', isWeekend: false },
        { value: '17:00', isWeekend: true },
        { value: '17:30', isWeekend: true },
        { value: '18:00', isWeekend: true },
        { value: '18:30', isWeekend: true },
        { value: '19:00', isWeekend: true },
        { value: '19:30', isWeekend: true },
        { value: '20:00', isWeekend: true },
        { value: '20:30', isWeekend: true },
        { value: '21:00', isWeekend: true },
        { value: '21:30', isWeekend: true },
      ],
    };
  },

  // 计算属性
  computed: {
    add_nums_list() {
      const rangeArray = (start, end) => Array((end - start) + 1).fill(0).map((v, i) => i + start);
      return rangeArray(1, this.leftNum);
    },

    leftNum() {
      return this.orderDetail.not_course;
    },
  },

  created() {
    // 获取所有课程列表信息

    getSuborderDetail(this.soid, { include: 'product,teacher,student,curriculum' }).then((res) => {
      console.log(res);
      this.orderDetail = res.data;
    }).catch(err => console.log(err));


    this.dymicTimesSelected = this.times;
  },

  // 方法集合
  methods: {
    changeDate(selectedDay) {
      console.log(selectedDay);
    },

    // 点击日历中的日期
    dayClick(date, jsEvent, view) {
      const momentDay = moment(date);
      if (date < moment()) {
        this.isWeekend = false;
        this.currDate = '';
        return false;
      }

      this.isWeekend = (date.day() === 0 || date.day() === 6);
      const dateString = date.format();
      this.currDate = dateString;
      if (_.has(this.dates, dateString)) {
        this.dymicTimesSelected = this.dates[dateString];
      } else {
        this.dymicTimesSelected = [];
      }
      this.dymicTimes = this.times;
      return true;
    },

    // 点击时间
    timeChange(val) {
      _.remove(this.tags, item => item.indexOf(this.currDate) !== -1);


      if (val.length > 0) {
        this.dates[this.currDate] = val;

        // 放入到tags中
        // const tags = [];
        for (let i = 0; i < val.length; i += 1) {
          this.tags.push(`${this.currDate} ${val[i]}`);
        }
        this.tags = _.uniqBy(this.tags);

        // 设置日历未选中状态
        const event = { start: this.currDate, rendering: 'background' };
        this.events.push(event);
      } else {
        this.dates[this.currDate] = [];
        const events = this.events.filter(item => item.start !== this.currDate);
        this.events = events;
      }

      if (this.tags.length === 0) {
        this.tags = [];
      } else {
        this.tags = _.uniqBy(this.tags);
      }
    },

    // 请求可用的老师数据
    searchTeacher() {
      if (this.tags.length <= 0) {
        helper.message('error', '请选择上课时间');
        return false;
      }
      if (this.tags.length > this.leftNum) {
        helper.message('error', '选择的时间超过最大可排课数目,请重新选择');
        return false;
      }

      const times = [];
      this.tags.forEach((item) => {
        times.push(`${item}:00`);
      });

      addLeftLessonsNormal(this.orderDetail.id, this.orderDetail.teacher.data[0].id, times).then(() => {
        this.$alert('排课成功!', '成功', {
          confirmButtonText: '确定',
          callback: () => { this.$router.replace({ name: 'lessonIndexNormal' }); },
        });
      });
      return true;
    },

    // chooseTeacher(index, data) {

    // },

    closeTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      const dayString = moment(tag).format('YYYY-MM-DD');
      if (moment(tag).day() === moment(this.currDate).day()) {
        this.dymicTimesSelected.splice(this.dymicTimesSelected.indexOf(tag.time), 1);
      }
      const time = moment(tag).format('HH:mm');
      _.pull(this.dates[dayString], time);


      if (this.dates[dayString].length <= 0) {
        const events = this.events.filter(item => item.start !== dayString);
        this.events = events;
      }
    },

  },


};
</script>


<style >
@import 'fullcalendar/dist/fullcalendar.css';
.fc-toolbar {
    padding-bottom: 0px
}
.fc-today {
    background: none
}
</style>

