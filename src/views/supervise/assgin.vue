<template>
    <div class="app-container">
        <div class="filter-container">
            <h2>督导管理</h2>
        </div>
        <div>
            <el-row>
                <el-col :span="14">
                    <el-button type="primary" size="mini" @click="handleSupervisorMult()">统一分配</el-button>
                </el-col>
                <el-col :span="5"><span>未分配班级数：{{ total_class_num }}</span></el-col>
                <el-col :span="5"><span>未分配学生数：{{ total_student_num }}</span></el-col>
            </el-row>
            <hr>
            <el-table :data="tableDatas" border fit highlight-current-row @selection-change="handleSelectionChange"
                style="width: 100%" v-loading="loading" element-loading-text="给我一点时间">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="title" label="班级名" header-align="center" align="center"></el-table-column>
                <el-table-column prop="number" label="学生数量" header-align="center" align="center"></el-table-column>
                <el-table-column label="学生名" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div v-for="(student,index) in scope.row.students" :key='index'>
                            <span v-if="student.name">{{student.name}}</span>
                            <span v-else>&nbsp;</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="年龄" prop="students" :filters="search.age" :filter-method="filterAge"
                                :filter-multiple="false" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div v-for="(student,index) in scope.row.students" :key='index'>
                            <span v-if="student.age">{{student.age}}</span>
                            <span v-else>&nbsp;</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="性别" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div v-for="(student,index) in scope.row.students" :key='index'>
                            <span v-if="student.sex">{{student.sex}}</span>
                            <span v-else>&nbsp;</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="地区（市）" prop="students" :filters="search.region" :filter-multiple="false"
                                :filter-method="filterRegion" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div v-for="(student,index) in scope.row.students" :key='index'>
                            <span v-if="student.region">{{student.region}}</span>
                            <span v-else>&nbsp;</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="curriculum.title" label="课程产品" :filters="search.curriculum_title"
                    header-align="center" align="center"
                    :filter-multiple="false" :filter-method="filterTitle" ></el-table-column>
                <el-table-column prop="live_type" label="直播类型" :filters="search.live_type"
                    header-align="center" align="center"
                    :filter-multiple="false" :filter-method="filterType" ></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleSupervisor(scope.row)">分配督导</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <el-dialog title="分配督导" :visible.sync="dialogFormVisible" @close='closeDialog'>
                <el-row>
                    <el-col :span="4"><span>已选班级：{{ form.class_num }}</span></el-col>
                    <el-col :span="6"><span>已选学生：{{ form.student_num }}</span></el-col>
                    <el-col :span="14"><span>注：督导老师名字后的数字表示当前带的学生数量。</span></el-col>
                </el-row>
                <el-form :model="form"  v-loading="loading_2" element-loading-text="给我一点时间">
                    <fieldset>
                        <legend>
                            选择督导（督导总数：{{supervisors.total}}）
                        </legend>
                        <el-radio-group v-model="form.supervisor_id" size="medium">
                            <el-radio border :label="supervisor.user_id" v-for="supervisor in supervisors.data"
                                class="radio-mg" :key="supervisor.user_id" >
                                {{supervisor.name+'('+supervisor.student_num+')'}}</el-radio>
                        </el-radio-group>
                    </fieldset>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog()">取 消</el-button>
                    <el-button type="primary" @click="assignSupervisor()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
  classroom,
  classSupervisor,
  classMultAssign,
} from '../../api/api';

export default {
  data() {
    return {
      dialogFormVisible: false,
      loading: true,
      loading_2: true,
      multipleSelection: [],
      total_class_num: 0,
      total_student_num: 0,
      mult_ids: [],
      form: {
        supervisor_id: 0,
        _id: 0,
        class_num: 0,
        student_num: 0,
        mult_ids: [],
      },
      search: {},
      supervisors: [],
      tableDatas: [],
    };
  },
  created() {
    this.getClassData();
  },
  // 方法集合
  methods: {
    // 获取数据
    getClassData() {
      this.loading = true;
      classroom()
        .then((res) => {
          this.tableDatas = res.data;
          this.total_class_num = res.total_class_num;
          this.total_student_num = res.total_student_num;
          this.search = res.search;
          this.loading = false;
        })
        .catch(error => console.log(error.response.data));
    },
    getSupervisorData() {
      this.loading_2 = true;
      classSupervisor()
        .then((res) => {
          this.supervisors = res;
          this.loading_2 = false;
        })
        .catch(error => console.log(error.response.data));
    },
    handleSupervisor(row) {
      this.dialogFormVisible = true;
      this.form.class_num = 1;
      this.form.student_num = row.number;
      this.form.mult_ids = [row._id];
      this.getSupervisorData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      const ids = [];
      this.multipleSelection.forEach((item) => {
        ids.push(item._id);
      });
      this.mult_ids = ids;
      this.form.mult_ids = ids;
    },
    handleSupervisorMult() {
      if (this.mult_ids && this.mult_ids.length >= 2) {
        this.dialogFormVisible = true;
        this.form.mult_ids = this.mult_ids;
        this.form.class_num = 0;
        this.form.student_num = 0;
        this.multipleSelection.forEach((item) => {
          this.form.class_num += 1;
          this.form.student_num += item.number;
        });
        this.getSupervisorData();
      } else {
        this.$notify.warning({
          title: 'Warning',
          message: '统一分配至少选择两条数据',
        });
      }
    },
    assignSupervisor() {
      if (!this.form.supervisor_id) {
        this.$notify.warning({
          title: 'Warning',
          message: '请选择督导',
        });
        return false;
      }
      classMultAssign(this.form)
        .then((res) => {
          this.getClassData();
          this.dialogFormVisible = false;
          this.form = {};
          this.$notify.success({
            title: 'Success',
            message: 'assign success',
          });
        })
        .catch(error => console.log(error.response.data));
      return true;
    },
    closeDialog() {
      this.dialogFormVisible = false;
      this.form = {};
    },
    filterAge(value, row) {
      return Object.keys(row.students).some(item => row.students[item].age === value);
    },
    filterRegion(value, row) {
      return Object.keys(row.students).some(item => row.students[item].region === value);
    },
    filterTitle(value, row) {
      if (row.curriculum != null) {
        return row.curriculum.title === value;
      }
      return false;
    },
    filterType(value, row) {
      if (row.live_type != null) {
        return row.live_type === value;
      }
      return false;
    },
  },
};
</script>
<style>
fieldset {
  border: 1px solid black;
  padding: 12px;
  margin-top: 20px;
}
legend {
  width: auto;
  margin-left: 20px;
}
.radio-mg {
  margin: 5px 10px;
}
legend {
  font-size: 1.12rem;
}
.el-table th > .cell.highlight {
  padding: 0;
  margin: 0;
  background-color: white;
}
</style>
