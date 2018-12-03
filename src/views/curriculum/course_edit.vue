<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <b>{{curriculum.title}}</b> (共{{curriculum.periods}}课时)
      </div>

      <div>
        <el-table :data="courses" element-loading-text="加载中..." border fit highlight-current-row v-loading="loading" empty-text="暂无数据" @cell-mouse-enter="cellEnter" @cell-click="cellClick">
          <el-table-column type="index" :index="getIndex" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="title" label="课时名称" width="180" align="center"></el-table-column>
          <el-table-column prop="courseware" show-overflow-tooltip label="课件" width="180" align="center" :render-header="renderHeader">
            <cell-content slot-scope="scope" :value="scope.row.courseware"></cell-content>
          </el-table-column>
          <el-table-column prop="teaching_goal" label="教学目标" align="center" width="180" :render-header="renderHeader">
            <cell-content slot-scope="scope" :value="scope.row.teaching_goal"></cell-content>
          </el-table-column>
          <el-table-column prop="home_suggestion" label="家辅建议" align="center" :render-header="renderHeader">
            <cell-content slot-scope="scope" :value="scope.row.home_suggestion"></cell-content>
          </el-table-column>
          <el-table-column prop="teachingcase" label="教案" align="center" :render-header="renderHeader">
            <template slot-scope="scope">
              <span v-if="scope.row.teachingcase">{{scope.row.teachingcase.file_name}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="video" label="视频资源" align="center" :render-header="renderHeader">
            <template slot-scope="scope">
              <span v-if="scope.row.video">{{scope.row.video.file_name}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="preclass" label="课前作业" align="center" :render-header="renderHeader"></el-table-column>
          <el-table-column prop="afterclass" label="课后作业" align="center" :render-header="renderHeader"></el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog title="编辑" :visible.sync="dialogVisible" width="60%" @close="onClose">
      <span>
        <el-input v-if="editData.editType == 'courseware'" placeholder="请输入课件地址" v-model="editData.value"><template slot="prepend">http://</template></el-input>
        <tinymce v-else-if="editData.editType == 'home_suggestion' || editData.editType == 'teaching_goal'" :ref="editData.id" :height=400 v-model="editData.content"></tinymce>

        <el-upload v-else-if="editData.editType == 'teachingcase' || editData.editType == 'video'" class="upload-demo" :limit="1" :action="upload_url" :headers="myHeaders" :data="upLoadData" ref="upload" :file-list="editData.fileList" :on-success="uploadResource" :on-change="handleChange" :on-remove="handleRemove" :on-error='handleError' :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import Tinymce from "@/components/Tinymce";
import CellContent from "@/components/CellContent.vue";
import { getCurriculumByID, saveCourseRes, globalUploadUrl } from "@/api/api";

export default {
  components: {
    Tinymce,
    CellContent
  },
  data() {
    return {
      loading: false,
      courses: [],
      curriculum: {},
      cid: this.$route.params.id,
      dialogVisible: false,
      upload_url: globalUploadUrl,
      // 上传
      // token
      myHeaders: {
        Authorization: `Bearer ${lockr.get("auth_token")}`
      },
      upLoadData: { source: "jobs" },
      editData: {
        editType: "", // 当前弹出框编辑类型
        id: "", // 当前弹出框编辑的课时ID
        content: "", // 解决富文本编辑器的bug
        value: "",
        fileList: []
      }
    };
  },

  created() {
    this.getData();
  },

  watch: {
    editData(oldVal, newVal) {
      console.log("editData 变化了:", oldVal, newVal);
    }
  },

  // 方法集合
  methods: {
    getData() {
      this.loading = true;
      getCurriculumByID(this.cid, { include: "course,classtype" })
        .then(res => {
          this.curriculum = res.data;
          res.data.course.data.forEach((v, k, a) => {
            v.show = {
              purpose: false
            };
          });
          this.courses = res.data.course.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 自定义的序号生成方法
    getIndex(index) {
      return index + 1;
    },

    delHtmlTag(str) {
      const newStr = str.replace(/<p>/g, "").replace(/<\/p>/g, "");
      return newStr;
      // return _.truncate(newStr, {
      //   length: 12,
      //   omission: '...',
      // });
    },

    onOver(data, flag) {
      console.log(data);
    },

    cellEnter(val, column, cell, event) {},

    cellClick(val, column, cell, event) {
      this.editData.editType = column.property;
      this.editData.id = val.id;
      if (
        column.property === "home_suggestion" ||
        column.property === "teaching_goal"
      ) {
        this.editData.content = val[column.property] || "";
        this.dialogVisible = true;
      } else if (column.property === "courseware") {
        this.editData.value = val[column.property] || "";
        this.dialogVisible = true;
      } else if (
        column.property === "teachingcase" ||
        column.property === "video"
      ) {
        // 教案
        if (_.has(val[column.property], "file_name")) {
          this.editData.fileList = [{ name: val[column.property].file_name }];
        } else {
          this.editData.fileList = [];
        }

        this.dialogVisible = true;
      }
    },

    // 保存文字或富文本类字段
    saveTxt() {
      if (!this.editData.id) {
        helper.message("error", "数据ID错误,请重新选择编辑");
        return;
      }
      const type =
        this.editData.editType === "courseware" ? "value" : "content";
      let content = this.delHtmlTag(this.editData[type]);
      content = content.replace(/(&nbsp;)|\s+/g, "");
      if (content === "") {
        this.editData[type] = "";
      }
      // if (this.editData[type] === "") {
      //   helper.message("error", "数据不能为空!");
      //   return;
      // }
      const params = {
        [this.editData.editType]: this.editData[type],
        id: this.editData.id
      };
      saveCourseRes(this.editData.id, params)
        .then(res => {
          this.$alert("数据保存成功!", "成功", {
            confirmButtonText: "确定",
            callback: action => {
              this.getData();
              this.dialogVisible = false;
            }
          });
        })
        .catch(err => {
          helper.message("error", err);
        });
    },

    // 保存上传类字段
    saveUpload() {
      if (this.editData.fileList.length > 0) {
        this.$refs.upload.submit();
      } else {
        // helper.message("error", "数据不能为空!");
        this.editData.content = "";
        this.saveTxt();
      }
    },
    handleError(err) {
      helper.message("error", JSON.parse(err.message));
    },
    handleRemove(file, fileList) {
      this.editData.fileList = fileList;
    },
    // 保存数据
    save() {
      if (
        this.editData.editType === "teachingcase" ||
        this.editData.editType === "video"
      ) {
        this.saveUpload();
      } else {
        this.saveTxt();
      }
    },

    // 上传成功回调
    uploadResource(res, file) {
      this.editData.content = res.data.resources_id;
      this.saveTxt();
    },

    handleChange(file, fileList) {
      this.editData.fileList = fileList.slice(-1);
    },

    onClose() {
      // console.log(this.$refs[this.editData.id].getContent())
      // console.log(123123123)
      // this.$refs[this.editData.editType + this.editData.id].destroyTinymce()
    },

    // 表头显示资源数
    renderHeader(h, { column }) {
      const label = column.label;
      const a = this.courses.filter(item => item[column.property]);
      return `${label}（${a.length}）`;
    },
    // 格式化单元格内容
    cellFormatter(row, column, cellValue, index) {
      cellValue = "a...";
    }
  }
};
</script>
<style scoped>
span >>> p {
  margin-bottom: 0;
}
</style>
