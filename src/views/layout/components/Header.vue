<template>
  <div class="app-header" :class="{collapse:isCollapse}">
    <router-link to="/" class="logo-wrap">
      <!-- <img class="logo" src="../../../assets/logo.png"> -->
    </router-link>
    <div class="header">
      <span class="header-title">Online Education Management System</span>
      <div class="header-bar" v-if="showBar">
        <el-button class="item-bar" type="text" @click="logout">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-quit"></use>
          </svg>
          <span>退出</span>
        </el-button>
        <el-button class="item-bar" type="text">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-user"></use>
          </svg>
          <span>用户</span>
        </el-button>
        <el-button class="item-bar" type="text">
          <el-badge is-dot class="item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-information"></use>
            </svg>
          </el-badge>
          <span>消息</span>
        </el-button>
      </div>

    </div>
  </div>
</template>
<script>
// import Hamburger from "@/components/Hamburger";
export default {
  name: "Header",
  components: {
    // Hamburger
  },
  props:{
    showBar:{
      type:Boolean,
      default(){
        return true;
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    sidebar() {
      return this.$store.getters.sidebar;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("ResetRoutes");
      this.$store
        .dispatch("LogOut")
        .then(() => {
          // helper.message('success', '已成功登出');
        })
        .catch(e => {
          helper.message("error", e.message || "服务器异常");
        });
      if (this.isProvider) {
        this.$router.push("/flogin");
      } else {
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/variables.scss";
.app-header {
  z-index: 10;
  width: 100%;
  height: $header-height;
  // max-height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  .logo-wrap {
    width: 179px;
    height: 38px;
    line-height: 38px;
    color: #bfcbd9;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #505A65;
    .logo{
      width: 107px;
      height: 34px;
    }
  }
  .header {
    flex-grow: 1;
    display: flex;
    align-items: center;
    color: #bfcbd9;
    .hamburger-container {
      margin-left: 1rem;
    }
    &-title {
      padding: 0 1rem;
    }
    .header-bar {
      height: 50px;
      flex-grow: 1;
      display: flex;
      flex-direction: row-reverse;
      .item-bar {
        margin-right: 2rem;
        color: #bfcbd9;
      }
    }
  }
}
.app-header.collapse {
  .logo-area {
    width: 36px;
    overflow: hidden;
  }
}
</style>

