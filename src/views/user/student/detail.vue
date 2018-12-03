<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card>
                    <el-row :gutter="40">
                        <el-col :span="6">
                            <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect">
                                <el-menu-item index="1"><i class="el-icon-location"></i><span slot="title">基本信息</span></el-menu-item>
                                <el-menu-item index="3"><i class="el-icon-document"></i><span slot="title">密码重置</span></el-menu-item>
                                <el-menu-item index="2"><i class="el-icon-menu"></i><span slot="title">头像信息</span></el-menu-item>
                                <el-menu-item index="4"><i class="el-icon-setting"></i><span slot="title">扩展信息</span></el-menu-item>
                                <el-menu-item index="5"><i class="el-icon-info"></i><span slot="title">云信信息</span></el-menu-item>
                            </el-menu>
                        </el-col>
                        <el-col :span="18">
                            <div v-loading="loading" v-if="user.id" class="userinfo_edit">
                                <info-basic v-if="itemIndex == '1'" :user="user" @change='init'></info-basic>
                                <info-password v-if="itemIndex == '3'" :user="user"></info-password>
                                <info-avatar v-if="itemIndex == '2'" :user="user" @change='init'></info-avatar>
                                <info-profile v-if="itemIndex == '4'" :user="user" @change='init'></info-profile>
                                <info-yunxin v-if="itemIndex == '5'" :value="user"></info-yunxin>
                            </div>
                        </el-col>
                    </el-row>

                </el-card>
            </el-col>

            <el-col :span="8">
                <el-card>
                    <employee-summary :user="user"></employee-summary>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>


<script>
import { getUserInfo } from "@/api/api";
import infoBasic from "./basic";
import infoPassword from "../components/password";
import infoAvatar from "../components/avatar";
import infoProfile from "../components/profile";
import infoYunxin from "../components/yunxin";
import employeeSummary from "../summary";
export default {
  // 引入的组件列表
  components: {
    infoBasic,
    employeeSummary,
    infoPassword,
    infoAvatar,
    infoProfile,
    infoYunxin
  },
  data() {
    return {
      id: this.$route.params.id,
      itemIndex: "1",
      user: {},
      loading: false
    };
  },

  created: function() {
    this.init();
  },

  // 方法集合
  methods: {
    init() {
      this.loading = true;
      getUserInfo(this.id)
        .then(res => {
          return this.checkUser(res.user);
        })
        .then(res => {
          if (res) {
            this.user = res;
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },

    handleOpen(index) {
      console.log(index);
      this.itemIndex = index;
    },
    handleClose(index) {},
    handleSelect(index) {
      this.itemIndex = index;
    },
    checkUser(data) {
      if (data.profile == null) {
        helper.message("error", "查看错误!");
        return false;
      }
      return data;
    }
  }
};
</script>

<style scoped>
.userinfo_edit {
  padding-top: 2rem;
  padding-right: 2rem;
}
</style>


