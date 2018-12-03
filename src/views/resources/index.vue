<template>
  <div class="app-container">
    <div class="handle-box">
        <el-button type="primary" @click="addResource" >新建渠道</el-button>
        <span style="float:right; margin-right: 50px; margin-top: 9px;">渠道数量: {{total}}</span>
    </div>
    <el-table  :data="resources" border fit highlight-current-row v-loading="loading" empty-text="暂无数据" >
      <el-table-column prop='provider' label='渠道名称'></el-table-column>
      <el-table-column prop='email' label="邮箱"></el-table-column>
      <el-table-column prop='contacts' label="联系人"></el-table-column>
      <el-table-column prop='cell_phone' label="手机号"></el-table-column>
      <el-table-column prop='teacher_num' label="在职外教"></el-table-column>
      <el-table-column prop='created_at' label="创建时间"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini"  @click="modifyResource(scope.row.id)">编辑</el-button>
          <el-button size="mini" :disabled='scope.row.teacher_num !== 0' type="danger"  @click="deleteConfirm(scope.row.id)" >删除</el-button>
          <el-button v-if="scope.row.week_status === 'activated'" size="mini"  type="danger"  plain  @click="openDialog(scope.row)" >停用</el-button>
          <el-button v-if="scope.row.week_status === 'banned' || scope.row.week_status === 'initial'" size="mini"  type="success"  plain  @click="openDialog(scope.row)" >启用</el-button>
          <el-button v-if="scope.row.week_status === 'will_activate'" size="mini"  type="primary"  plain  @click="openDialog(scope.row)" >已启用</el-button>
          <el-button v-if="scope.row.week_status === 'will_ban'" size="mini"  type="warning"  plain  @click="openDialog(scope.row)" >已停用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog :title="dialogConfig.title[dialogType]" :visible.sync="dialogVisible" center width='500px' @close='dialogClosed' v-if='dialogType'>
      <!-- 停用 -->
      <div class='dialogContent' v-if='dialogType === "activated"'>
        <el-date-picker
          type="date"
          v-model="banDate"
          placeholder="选择停用日期"
          value-format='yyyy-MM-dd'>
        </el-date-picker>
        <p class='notice'>停用后，这个渠道的外教不会再被排新课。但已经排好课的外教需要继续完成授课工作。特殊情况可以通过换老师功能处理。</p>
      </div>
      <!-- 启用 -->
      <div class='dialogContent' v-if='dialogType === "banned" || dialogType === "initial"'>
        <el-date-picker
          type="date"
          v-model="activateDate"
          placeholder="选择启用日期"
          value-format='yyyy-MM-dd'>
        </el-date-picker>
        <p class='notice'>启用后，这个渠道的买断外教可以开始排新课。</p>
      </div>
      <!-- 已停用 -->
      <div class='dialogContent' v-if='dialogType === "will_ban"'>
        <p>停用起始时间：{{effectiveTime}}</p>
        <el-button class='openAgain' type="primary" @click="openAgain">重新启用</el-button>
        <p class='notice'>重新启用即可生效，请慎重！</p>
      </div>
      <!-- 已启用 -->
      <div class='dialogContent' v-if='dialogType === "will_activate"'>
        <p>启用起始时间：{{effectiveTime}}</p>
      </div>
      <div slot="footer" class="dialog-footer" v-if='dialogType === "activated" || dialogType === "banned" || dialogType === "initial"'>
        <el-button type="primary" @click="switchProvider(selectedId)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from '@/utils/time';
import { getProviders, deleteProvider, switchProvider } from '@/api/api';
export default {
  data() {
    return {
      loading: false,
      resources: [],
      total: 0,
      dialogType: '',
      dialogVisible: false,

      effectiveTime: '',
      activateDate: '',
      banDate: '',
      selectedId:'',

      dialogConfig: {
        title: {
          initial: '启用',
          activated: '停用',
          banned: '启用',
          will_activate: '已启用',
          will_ban: '已停用',
        }
      },
    };
  },
  created() {
    this.getResources();
  },
  methods: {
    getResources() {
      this.loading = true;
      getProviders(0).then((res) => {
        this.loading = false;
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.resources = res.data;
        this.total = res.data.length;
      }).catch((err) => {
        this.loading = false;
        this.$message.error(err);
      });
    },
    addResource() {
       this.$router.push({ name: 'addResources' });
    },
    deleteConfirm(id) {
      this.$confirm('确定要删除所选择的渠道吗？如果填错信息可以编辑。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRes(id)
      })
    },
    deleteRes(id) {
      deleteProvider(id).then((res) => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getResources();
      }).catch((err) => {
        this.$message.error(err);
      });
    },
    modifyResource(id) {
      this.$router.push({ name: 'modifyResources',params: { id } });
    },
    openDialog(data) {
      this.dialogType = data.week_status;
      this.effectiveTime = data.week_at;
      this.selectedId = data.id;
      this.dialogVisible = true;
    },
    dialogClosed() {
      setTimeout(() => {
        this.dialogType = '';
        this.effectiveTime = '';
        this.selectedId = '';
        this.activateDate = '';
        this.banDate = '';
      }, 200);
    },
    switchProvider(id) {
      const type = this.dialogType === 'activated' ? 'banned' : 'activated';
      const dateType = type === 'banned' ? 'banDate' : 'activateDate';
      if(!this[dateType]) {
        this.$message.error('请选择日期');
        return;
      }
      switchProvider(id, { week_status: type, week_at: this[dateType] }).then((res) => {
        if (res.status_code !== 200) {
          this.$message.error(res.message);
          return;
        }
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.dialogVisible = false;
        this.getResources();
      }).catch((err) => {
        this.$message.error(err);
      });
    },
    openAgain() {
      this.$confirm('重新启用立即生效，现在要重新启用吗？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.activateDate = parseTime(new Date(), '{y}-{m}-{d}');
        this.switchProvider(this.selectedId);
        this.dialogVisible = false;
      }).catch(() => {});
    }
    
  },
};
</script>
<style scoped>
.notice{
  color:#aaa;
  margin-top: 20px;
}
.dialogContent{
  text-align: center;
}
.openAgain{
  margin-top: 30px;
}
</style>

