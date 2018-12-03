<template>
  <el-popover placement="right" width="300" trigger="click">
    <el-table :data="list" :show-header="false">
      <el-table-column width="100" property="week" label="week"></el-table-column>
      <el-table-column property="time" label="time">
        <template slot-scope="scope">
          <el-tag style="margin-top:5px" v-for="time in scope.row.times" :key="time" disable-transitions>{{time}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-button slot="reference" type="text">点击查看</el-button>
  </el-popover>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data() {
    return {
      weeks: [
        "每周日",
        "每周一",
        "每周二",
        "每周三",
        "每周四",
        "每周五",
        "每周六"
      ]
    };
  },
  computed: {
    list() {
      const list = [];
      if (this.value) {
        Object.keys(this.value).forEach((key, index) => {
          const weekItem = this.value[key];
          const times = [];
          Object.keys(weekItem).forEach((key2, index2) => {
            const item2 = weekItem[key2];
            times.push(`${item2[0]}~${item2[1]}`);
          });
          list.push({
            week: this.weeks[index],
            times:times.sort()
          });
        });
      }
      return list;
    }
  }
};
</script>

<style>
</style>
