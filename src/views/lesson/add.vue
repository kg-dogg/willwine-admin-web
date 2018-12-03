<template>
    <div class="app-container">
        <el-row>
          <el-form label-width="160px">
                <el-form-item label="课程">
                      <el-select v-model="selectCourse"  placeholder="选择课程">
                          <el-option v-for="curriculum in curriculums" :key="curriculum._id" :label="curriculum.title" :value="curriculum._id"></el-option>
                      </el-select>
                </el-form-item>
                <div style="margin-left:160px" v-if="selectCourseItem">所选课程详情: 共{{selectCourseItem.periods || 0}}课时, 每课时{{selectCourseItem.duration || 0}}分钟</div>
          </el-form>
        </el-row>
<hr>
        <lessonTime :finalDates.sync="finalDates" type="trial"></lessonTime>

            <hr />
        <el-form>
            <el-form-item>
              <el-button @click="goBackToList" >返回</el-button>
              <el-button type="primary" @click="onSubmit" :loading="loading" >立即创建</el-button>
            </el-form-item>
        </el-form>

    </div>

</template>


<script>
import { addLesson, getProducts, getCurriculums } from '../../api/api';
import lessonTime from '../../components/lesson_time';

export default {
  // 引入的组件列表
  components: {
    lessonTime,
  },
  data() {
    return {
      selectProduct: '',
      product: [], // 产品包,暂时没有
      selectCourse: '', // 选择的课程
      curriculums: [], // 课程列表
      finalDates: [], // 最终计算完成后要传的时间数组
      loading: false,
      timer: null,
    };
  },

  created() {
    // 获取线上课试听课课程列表信息
    let condition = {is_online:1, category: 'TRIAL', per_page: 100, page: 1};
    getCurriculums(condition).then((res) => {
      this.curriculums = res.data;
    })
  },

  // 计算属性
  computed: {
    selectCourseItem() {
      return _.find(this.curriculums, ['id', this.selectCourse]);
    },
  },

  // 方法集合
  methods: {
    onSubmit() {
      this.loading = true;
      if (!this.selectCourse) {
        helper.message('error', '请选择课程');
        this.loading = false;
        return false;
      }
      if (this.finalDates.length <= 0) {
        this.$message({ message: '请选择时间段', type: 'error' });
        this.loading = false;
        return false;
      }

      // 判断下时间:
      const ifLate = _.every(this.finalDates, (item, index, collection) => moment().isBefore(item));
      if (!ifLate) {
        helper.message('error', '您选择的时间里有已过期时间,请重新选择!');
        this.loading = false;
        return false;
      }
      // 发送请求
      addLesson(this.selectCourse, this.finalDates).then((res) => {
        this.$alert('添加成功,请到列表查看', '成功', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$router.replace({ name: 'lessonIndex' });
          },
        });
      }).catch((err) => {
        this.loading = false;
      });
      return true;
    },

    // 无产品功能,暂时无用
    productChange(val) {
      this.selectCourse = '';
      this.courses = _.find(this.product, ['id', val]).curriculum.data;
    },

    goBackToList() {
      this.$router.go(-1);
    },
  },
};
</script>


<style scoped>

</style>

