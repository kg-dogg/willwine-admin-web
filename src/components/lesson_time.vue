<template>
    <div>
        <el-form label-width="160px">
            <el-form-item label="选择开课时间">
                <el-date-picker v-if="type=='normal'"
                    v-model="form.dateRange"
                    type="date"
                    placeholder="开课日期"
                    @change="onSelectOneDay"
                    :picker-options="pickerOptions">
                </el-date-picker>

                <el-date-picker v-if="type=='trial'"
                    v-model="form.dateRange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开课日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>


            <el-form-item label="选择星期">
                <el-select v-model="selectWeeks"  placeholder="请选择星期" @change="weekChange">
                    <el-option v-for="week in weekList" :key="week.value" :label="week.label" :value="week.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="开课时间">
                <el-row>
                    <el-col :span="6">
                    <el-card class="box-card" style="margin-right:20px">
                        <div slot="header" class="clearfix">
                            <span>上午</span>
                            <!-- <el-button style="float: right; " type="text">全选</el-button> -->
                        </div>
                        <el-checkbox-group v-model="checkList" @change="timeChange" :disabled="!isWeekend && isProduction">
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

                    <el-col :span="6">
                    <el-card class="box-card" style="margin-right:20px">
                        <div slot="header" class="clearfix">
                            <span>下午</span>
                            <!-- <el-button style="float: right; " type="text">全选</el-button> -->
                        </div>
                        <el-checkbox-group v-model="checkList" @change="timeChange" :disabled="!isWeekend && isProduction">
                            <el-checkbox label="15:00" style="margin-left: 30px;"></el-checkbox>
                            <el-checkbox label="15:30"></el-checkbox>
                            <el-checkbox label="16:00"></el-checkbox>
                            <el-checkbox label="16:30"></el-checkbox>
                        </el-checkbox-group>
                    </el-card>
                    </el-col>

                    <el-col :span="6">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>晚上</span>
                                <!-- <el-button style="float: right; " type="text">全选</el-button> -->
                            </div>
                            <el-checkbox-group v-model="checkList" @change="timeChange" :disabled="selectWeeks === ''">
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
            </el-form-item>

            <el-form-item label="开课时间">
                <el-tag style="margin-right:20px" v-for="tag in tags"  :key="tag.name" closable :type="tag.type" @close="closeTag(tag)">{{tag.name}}</el-tag>
                <p v-if="tags.length == 0">暂无选择数据</p>
            </el-form-item>

        </el-form>
    </div>
</template>


<script>
import config from '@/config';
export default {
  data() {
    return {
      selectWeeks: '',
      checkList: [],
      weeks: ['每周日', '每周一', '每周二', '每周三', '每周四', '每周五', '每周六'], // 所有的星期数
      weekList: [], // 动态计算出的应该显示的星期
      tags: [],
      form: {
        startDay: '',
        endDay: '',
        dateRange: '',
      },

      pickerOptions: {

        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
        onPick: ({ maxDate, minDate }) => {
          if (maxDate && minDate && maxDate >= minDate) {
            this.changeDate(minDate, maxDate);
          }
        },
      },

      finalDatesLocal: [],
      isProduction:config.ENV === 'prod'
    };
  },
  // 计算属性
  computed: {
    isWeekend() {
      if (this.selectWeeks === 0 || this.selectWeeks === 6) {
        return true;
      }
      return false;
    },
  },
  // 父组件传递进来的数据
  props: {
    finalDates: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    type: {
      type: String,
      default() {
        return 'trial';
      },
    },
  },

  watch: {
    tags(curVal) {
      const finalDates = [];
      curVal.forEach((item) => {
        // 更新给后端要传的时间数据
        let startDay = '';
        if (this.type === 'trial') {
          startDay = this.form.dateRange[0];
        } else {
          startDay = this.form.dateRange;
        }
        const tmp = moment(startDay).days(item.week_num);
        if (tmp < moment(startDay)) {
          tmp.add(7, 'days');
        }
        const timeString = `${tmp.format('YYYY-MM-DD')} ${item.time}:00`;
        finalDates.push(timeString);
      });

      this.$emit('update:finalDates', finalDates);
    },
    form: {
      handler(val) {
        this.$emit('dataChange');
      },
      deep:true,
    },
    checkList: {
      handler(val) {
        this.$emit('dataChange');
      },
      deep:true,
    },
    selectWeeks() {
      this.$emit('dataChange');
    },
  },

  // 方法集合
  methods: {
    // 当选择单个日期后: 只有正式课时候
    onSelectOneDay() {
      const weekList = [];
      for (let i = 0; i < this.weeks.length; i += 1) {
        weekList.push({ value: i, label: this.weeks[i] });
      }
      this.weekList = _.unionBy(weekList, 'value');
      if (this.weekList) {
        this.checkList = '';
        this.tags = [];
        this.selectWeeks = '';
      }
    },

    // 当选择日期范围后
    changeDate(minDate, maxDate) {
      // 计算差额天数
      const start = moment(minDate);
      const end = moment(maxDate);

      const diffDays = end.diff(start, 'days');
      const weekList = [];
      for (let i = 0; i <= diffDays; i += 1) {
        const startConst = moment(minDate);
        const weekNum = startConst.add(i, 'days').weekday();
        weekList.push({ value: weekNum, label: this.weeks[weekNum] });
      }
      this.weekList = _.sortBy(_.unionBy(weekList, 'value'), 'value');
    },

    // 选择星期改变后
    weekChange() {
      this.checkList = [];
      const finder = this.tags.filter(item => item.week_num === this.selectWeeks);
      if (finder.length > 0) {
        this.checkList = _.map(finder, 'time');
      }

      this.dataChange([], false);
    },

    dataChange(val, ifChangeTag = false) {
      if (this.selectWeeks === '') {
        helper.message('error', '请先选择星期数据');
        return;
      }
      if ((val.length <= 0 && !ifChangeTag) || this.selectWeeks === '') {
        console.log('数据不全,不进行显示');
        return;
      }
      const tags = [];
      const oldTags = this.tags;
      // 确认本次是否有改变
      if (ifChangeTag) {
        const finder = this.tags.filter(item => item.week_num === this.selectWeeks);
        let oldChecked = [];
        oldChecked = _.map(finder, 'time');
        if (oldChecked.length === val.length) {
          return;
        }
        _.remove(this.tags, ['week_num', this.selectWeeks]);
      }

      for (let j = 0; j < val.length; j += 1) {
        tags.push({ name: `${this.weeks[this.selectWeeks]} ${val[j]}`, week_num: this.selectWeeks, type: '', time: val[j] });
      }
      console.log(tags);

      if (ifChangeTag) {
        this.tags = _.unionBy(oldTags, tags, 'name');
      }
    },

    // 选择时间的变化触发
    timeChange(val) {
      this.dataChange(val, true);
    },

    // 移除tags
    closeTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      if (tag.week_num === this.selectWeeks) {
        this.checkList.splice(this.checkList.indexOf(tag.time), 1);
      }
    },

  },
};
</script>


<style scoped>
  .box-card {
    /* width: 260px; */
  }
</style>

