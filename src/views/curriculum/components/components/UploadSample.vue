<template>
  <div class="upload-sample">
    <h3>表格示例</h3>
    <p>1.第一列为已有作业班型信息。其中，第一行请填写完整的版型名称，第二行填写作业的版本号，第三行填写课时名称。</p>
    <p>2.第二列为需要复制作业班型信息，第一行请填写完整的版型名称，第二行留空，第三行填写课时名称。</p>
    <p class="h4">注：需要填写的版型名称和课时名称，必须是此系统中已存在的，且必须与本系统显示的完全一致（包括空格、特殊字符在内），否则将会报错！</p>
    <el-table :data="tableData" border size="mini">
      <el-table-column prop="key1" label="Prek160全天班" align="center">
      </el-table-column>
      <el-table-column prop="key2" label="pre-k160全天浸泡班" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props:{
    sourceType:String
  },
  data(){
    return {};
  },
  computed:{
    tableData(){
      let tableData = [
        // {key1:'v1-1',key2:''},
        {key1:'PreK 160版 全天班 第1课时',key2:'PreK 160版 全浸入式班 第1课时'},
        {key1:'PreK 160版 全天班 第2课时',key2:'PreK 160版 全浸入式班 第2课时'},
        {key1:'PreK 160版 全天班 第3课时',key2:'PreK 160版 全浸入式班 第3课时'},
        {key1:'...',key2:'...'}
      ];
      if(['PRECLASS','AFTERCLASS'].indexOf(this.sourceType) > -1){
        tableData.unshift({key1:'v1-1',key2:''});
      }
      return tableData;
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-sample {
  p {
    text-indent: 2em;
  }
}
</style>

