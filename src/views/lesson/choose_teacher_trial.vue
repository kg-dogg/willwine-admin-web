<template>
    <div class="app-container">
        <div class="filter-container">
            <div class="filter-item" style="width: 30%">选择外教 (这个时间段有 {{allTeachersCnt}} 名外教) </div>
            <div class="filter-item" style="width: 30%">已选择外教: {{checkedTeachersCnt}} </div>
        </div>
        <hr />
        <div>
            <el-form ref="form" label-width="80px">
                <el-form-item label="全选">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                </el-form-item>
                <el-form-item label="选择外教">
                    <el-checkbox-group v-model="checkedTeachers" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="teacher in teachers" :label="teacher" :key="teacher.id" :checked="teacher.is_checked" :disabled="!teacher.can_check">{{teacher.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="loading">立即创建</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>


<script>
import { chooseTeachersTrial, listTeachersTrial } from '@/api/api';

export default {
  data() {
    return {
      checkAll: false,
      checkLenthOrigin: 0,
      checkedTeachers: [],
      teachers: [],
      isIndeterminate: false,
      tid: this.$route.query.tid,
      loading: false,
    };
  },

  created() {
    this.getData();
  },

  // 计算属性
  computed: {
    allTeachersCnt() {
      return this.teachers.length;
    },
    checkedTeachersCnt() {
      return this.checkedTeachers.length;
    },
  },

  // 方法集合
  methods: {

    cancel() {
      this.$router.replace({ name: 'lessonIndex' });
    },

    // 获取该排课的可排课的老师数据
    getData() {
      // ajax
      this.loading = true;
      listTeachersTrial(this.tid).then((res) => {
        this.teachers = Object.values(res.data);

        const checkLenth = this.teachers.filter(item => item.is_checked === true).length;
        this.checkLenthOrigin = checkLenth;   // 把最原始的有选择的数目记一下,最后提交的时候需要判断是去除还是未选择
        if (checkLenth === 0) {
          this.checkAll = false;
          this.isIndeterminate = false;
        } else if (checkLenth === this.teachers.length) {
          this.checkAll = true;
          this.isIndeterminate = false;
        } else {
          this.checkAll = false;
          this.isIndeterminate = true;
        }
        // 处理初始的全选状态
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkedTeachers = this.teachers.filter(item => item.can_check === true || item.is_checked === true);
      } else {
        this.checkedTeachers = this.teachers.filter(item => item.can_check === false && item.is_checked === true);
      }
      if (this.checkedTeachers.length === 0) {
        this.isIndeterminate = false;
      } else if (this.checkedTeachers.length === this.teachers.length) {
        this.isIndeterminate = false;
      } else {
        this.isIndeterminate = true;
      }
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.teachers.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.teachers.length;
    },

    // 提交选定
    onSubmit() {
      this.loading = true;

      const checkedTeachers = [];
      this.checkedTeachers.forEach((item) => {
        checkedTeachers.push(item.id);
      });

      if (this.checkLenthOrigin == 0 && checkedTeachers.length == 0) {
        helper.message('error', '还没有选择任何外教!');
        this.loading = false;
        return false;
      }


      chooseTeachersTrial(this.tid, checkedTeachers).then((res) => {
        this.loading = false;
        this.$alert('选择外教成功!', '成功', {
          confirmButtonText: '确定',
          callback: (action) => { this.$router.replace({ name: 'lessonIndex' }); },
        });
      }).catch(() => {
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped>
</style>

