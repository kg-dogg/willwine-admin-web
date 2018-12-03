<template>
  <el-popover v-if="value" trigger="hover" placement="right" width="400" popper-class="cell-content-popover">
    <span v-html="value"></span>
    <el-button slot="reference" type="text">{{this.content}}</el-button>
  </el-popover>
</template>

<script>
export default {
  name: "CellContent",
  props: {
    value: String
  },
  data() {
    return {};
  },
  computed: {
    // 字节长度 是否过长
    isLonger() {
      let str = this.value;
      if (str) {
        let byteLength = 0;
        let charCode = -1;
        for (let i = 0; i < str.length; i++) {
          charCode = str.charCodeAt(i);
          if (charCode >= 0 && charCode <= 128) {
            byteLength += 1;
          } else {
            byteLength += 2;
          }
        }
        return byteLength > 10;
      }
      return false;
    },
    content() {
      if (!this.value) return "";
      if (/<p(([\s\S])*?)<\/p>/.test(this.value)) {
        return "悬浮查看";
      }
      if (this.isLonger) {
        return this.value.substr(0, 10) + "...";
      }
      return this.value;
    }
  }
};
</script>

<style lang="scss">
.cell-content-popover {
  max-height: 100%;
  overflow: scroll;
  img {
    max-width: 100%;
    height: auto;
  }
}
</style>

