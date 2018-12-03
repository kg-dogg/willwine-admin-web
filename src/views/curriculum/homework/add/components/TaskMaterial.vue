<template>
  <div>
    <Tinymce class='tinymce' v-model="model.description"></Tinymce>
    <!-- <MyUploader class="uploader" :data="updalodData"></MyUploader> -->
    <el-form>
      <ResUpload :item="model" :source="updalodData.source"></ResUpload>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
// import MyUploader from "@/components/MyUploader";
import ResUpload from "@/views/curriculum/components/resUpload.vue";
export default {
  components: {
    // MyUploader,
    Tinymce,
    ResUpload
  },
  props: {
    value: Object,
    updalodData: Object
  },
  data() {
    return {
      model: {
        description: "",
        resource_id: "",
        attachment: "",
        // 非 form 需要的字段，帮助提交api前的预览使用
        file_name:'',
      }
    };
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if(!val.resource_id){
          val.file_name = '';
        }
        this.model = Object.assign(this.model,val);
      }
    },
    model: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.uploader {
  margin: 10px 0;
}
</style>

