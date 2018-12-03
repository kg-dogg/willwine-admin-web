<template>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :unique-opened="true"
    >
      <sidebar-item :routes="routers"></sidebar-item>
    </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';

export default {
  components: { SidebarItem  },
  computed: {
    ...mapGetters([
      'sidebar',
      'routers'
    ]),
    routes() {
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>
