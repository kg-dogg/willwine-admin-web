<template>
    <div>
        <el-table :data="data" element-loading-text="加载中" v-loading="loading" empty-text="暂无数据" style="width: 100%" border>
            <el-table-column label="课程时间">
                <template slot-scope="scope">
                    {{dataFormat(scope.row.scheduled_at)}} ~ {{dataFormat(scope.row.scheduled_end_at)}}
                </template>
            </el-table-column>
            <el-table-column label="异常状况" width='180'>
                <template slot-scope="scope">
                    <p v-if="scope.row.teacherStatus === 'off_line'">
                        老师不在直播间
                        <el-tag type="danger" size="mini" v-if="isAfter(scope.row.scheduled_at)">迟</el-tag>
                    </p>
                    <p v-if="scope.row.studentStatus === 'off_line'">
                        学生不在直播间
                        <el-tag type="danger" size="mini" v-if="isAfter(scope.row.scheduled_at)">迟</el-tag>
                    </p>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="note" label="课程名称" width='280'></el-table-column>
            <el-table-column prop="teacher.data.name" label="老师"></el-table-column>
            <el-table-column label="学生">
                <template slot-scope="scope">
                    <el-tooltip :content="item.mobile" placement="top" v-for="(item,index) in scope.row.student.data" :key="item.name">
                        <div class="name-wrapper">
                            {{ `${item.name}(${item.name_en})` }}
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="求助状态">
                <template slot-scope="scope">
                    <p v-if='scope.row.teacherHelpStatus'>
                        老师求助&nbsp;
                        <el-button type="danger" size='mini' @click='answer'>解答</el-button>
                    </p>
                    <p v-if='scope.row.studentHelpStatus'>
                        学生求助&nbsp;
                        <el-button type="danger" size='mini' @click='answer'>解答</el-button>
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="操作" align='center'>
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click='gotoRoom(scope.row.class_id)'>进教室</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
  props: ["data", "meta", "loading"],
  data() {
    return {};
  },
  methods: {
    gotoRoom(id) {
      window.open(
        FRONT_URL + "h5/parents/classroom/" + this.meta.token + "/" + id
      );
    },
    answer() {
      this.$emit("showAnswer");
    },
    dataFormat(data) {
      if (data) return data.slice(-8, -3);
    },
    isAfter(time) {
      return moment().isAfter(moment(time));
    }
  }
};
</script>
<style scoped>
.cell p {
  margin: 0;
  line-height: 30px;
}
</style>

