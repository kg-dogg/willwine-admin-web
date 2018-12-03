<template>
  <div class="copy-upload-result">
    <el-row :gutter="20" type="flex">
      <el-col :span="16">
        <el-table :data="tableData" :show-header="false" border size="mini" :cell-class-name="getCellClassName">
          <el-table-column prop="source.title" label="source" align="center">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.source.message" placement="top" v-if="scope.row.source.verfiy === false">
                <span>{{scope.row.source.title}}</span>
              </el-tooltip>
              <span v-else>{{scope.row.source.title}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="target.title" label="target" align="center">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.target.message" placement="top" v-if="scope.row.target.verfiy === false">
                <span>{{scope.row.target.title}}</span>
              </el-tooltip>
              <span v-else>{{scope.row.target.title}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8" class="result-message">
        <div v-if="value.verfiy">
          <p>共检测到{{tableData.length - 2}}条记录</p>
          <p>点击“确认复制”按钮后开始复制</p>
        </div>
        <div v-else>
          <p>检测到{{errorCount}}条错误记录</p>
          <p>请修改文件内容后返回上一步重新上传！</p>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" type="flex" style="margin-top:20px" v-if="!value.verfiy">
      <el-col :span="16">
        <el-alert title="请确认上传文件中的班型名称、版本号、课时名称是否与本系统中显示的完全一致，包括空格和特殊字符！" type="warning" :closable="false">
        </el-alert>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data() {
    return {};
  },
  computed: {
    errorCount() {
      if (!this.value || !this.value.copy) {
        return 0;
      }
      const sourceCount = this.value.copy.source.filter(
        item => item.verfiy === false
      ).length;
      const targetCount = this.value.copy.target.filter(
        item => item.verfiy === false
      ).length;
      return sourceCount + targetCount;
    },
    tableData() {
      let tableData = [];
      if (!this.value || !this.value.copy) {
        return tableData;
      }
      const length = Math.max(
        this.value.copy.source.length,
        this.value.copy.target.length
      );
      for (let i = 0; i < length; i++) {
        const source =
          this.value.copy.source.length > i ? this.value.copy.source[i] : {};
        const target =
          this.value.copy.target.length > i ? this.value.copy.target[i] : {};
        tableData.push({ source, target });
      }
      return tableData;
    }
  },
  methods: {
    getCellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && row.source.verfiy === false) {
        return "cell-error";
      }

      if (columnIndex === 1 && row.target.verfiy === false) {
        return "cell-error";
      }
      return "";
    }
  }
};
</script>

<style lang="scss">
.copy-upload {
  .el-table {
    .cell-error {
      color: #f56c6c;
    }
  }
  .copy-upload-result {
    padding: 10px 0;
    .result-message {
      align-self: flex-end;
    }
  }
}
</style>

