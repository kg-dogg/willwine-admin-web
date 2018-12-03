<template>
  <div v-loading="loading">
    <el-button
      class="versionButton"
      type="primary"
      @click="showVersion"
      v-if='versionData.length>0'>
      {{versionVisable ? '收起版本管理' : '版本管理'}}
    </el-button>
    <el-card class="version" v-show='versionVisable'>
      <div slot="header">
        <span>版本管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click='submitVersion' :loading="addBtnLoading">新增版本</el-button>
      </div>
      <el-table
        :data="versionData"
        border
        max-height="300"
        v-loading="loading"
        style="width: 100%"
        v-if='versionData.length>0'>
        <el-table-column
          label="版本"
          align="center">
          <template slot-scope="scope">V{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column
          prop="job_num"
          label="作业统计"
          align="center">
        </el-table-column>
        <el-table-column
          prop="effective_time"
          label="生效时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="创建人"
          align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" >
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.effective_time !==''" @click="deleteVer(scope.row)" class='delete'> 删除</el-button>
            <el-switch
              v-model='scope.row.status'
              active-color="#13ce66"
              inactive-color="#bbb"
              active-value='effective'
              inactive-value='uneffective'
              class='switch'
              @change='switchChange(scope.row)'>
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <p class='noData' v-if='versionData.length <= 0'>请新增版本后添加作业吧~</p>
      <el-dialog
        :visible.sync="dialogVisible"
        @close="cancel"
        width="30%"
        center>
        <div class='dialogContent'>
          <span>生效时间：</span>
          <el-date-picker
            v-model="enableTime"
            type="datetime"
            placeholder="选择日期时间"
            :pickerOptions='pickerOptions'
            value-format='yyyy-MM-dd HH:mm:ss'
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="enable">确定启用</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { _debounce } from '@/services/helper'
export default {
  props:['versionData', 'loading'],
  data(){
    return {
      hwId: this.$route.params.id,
      versionVisable: true,// 显示版本管理
      enableTime:'',
      pickerOptions: {
        disabledDate: time => (time.getTime() < (Date.now() - 8.64e7)),
      },
      dialogVisible: false,
      dialogAddVersionVisible: false,
      form: {
        version: '',
        count: 0,
        effectiveTime: '',
        user: 'user',
        versionEnable: false,
      },
      formLabelWidth: '60px',
      curId: '',
      addBtnLoading:false
    }
  },
  created(){
    if(this.versionData.length <= 0){
      this.versionVisable = true;
    }
  },
  methods:{
    switchChange (val) {
      if (val.status === 'effective') {
        this.dialogVisible = true;
        this.curId = val._id;
        this.enableTime = val.effective_time;
      } else {
        this.$emit('unlaunchVersion', val);
      }
    },
    deleteVer(ver) {
      this.$confirm(`你确定要删除${ver.title}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delVersion', ver);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    submitVersion: _.debounce(function(){
      this.addBtnLoading = true;
      this.$emit('submitVersion');
      setTimeout(()=>{
        this.addBtnLoading = false;
      },1000);
    },300),
    toggleVer(){
      this.dialogAddVersionVisible = !this.dialogAddVersionVisible;
    },
    showVersion(){
      this.versionVisable = !this.versionVisable;
    },  
    cancel(){
      const restoreList = Array.from(this.versionData).map(item =>
        (item._id === this.curId) ?
          { ...item, status: 'uneffective' } :
          item
      );
      this.$emit('restoreVersions', restoreList);
    },
    enable(){
      if(!this.enableTime) {
        this.$message.error('请选择时间');
        return;
      }
      if(new Date(this.enableTime) < new Date()){
        this.$message.error('选择时间需大于当前时间');
        return;
      }
      this.$emit('launchVersion',{
        id: this.curId,
        effectiveTime: this.enableTime,
        status: 'effective',
      });
      this.curId = '';
      this.dialogVisible = false;
      this.enableTime = '';
    },
    k(n) {
      return function f(n, s) {
        if (n === 1) return s;
        return f(n - 1, (~~(Math.random() * 36)).toString(36) + s);
      }(n, (~~(Math.random() * 36)).toString(36));
    }
  }
}
</script>
<style scoped>
.versionButton{

}
.version{
  margin-top: 10px;
}
.switch{
  margin-left: 15px;
}
.dialogContent{
  text-align: center;
}
.delete{
  color: #f56c6c;
}
.delete:disabled{
  color: #c0c4cc;
}
.noData{
  text-align: center;
  padding-top: 20px;
}
</style>
