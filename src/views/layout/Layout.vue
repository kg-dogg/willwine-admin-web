<template>
  <!-- <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <Header></Header>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <app-main></app-main>
    </div>
  </div> -->

  <el-container class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <el-header height="60px">
      <Header class="header-container"></Header>
    </el-header>
    <el-container>
      <el-aside width="180px">
        <Sidebar class="sidebar-container"></Sidebar>
      </el-aside>
      <el-main class="main-container">
        <AppMain></AppMain>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import { Sidebar, AppMain, Navbar, Header } from "@/views/layout/components";

export default {
  name: "layout",
  components: {
    Sidebar,
    AppMain,
    Navbar,
    Header
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../assets/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  .header-container {
    background-color: #202d3d;
  }
}
</style>
