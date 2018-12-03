<template>
  <div>
    <el-form ref="form" label-width="100px" v-if="acc && acc.name">
      <el-form-item>
        <img class="avatar" v-if="!acc.icon" src="/static/images/avatar_default_b.png" />
        <img class="avatar" v-else :src="acc.icon" />
      </el-form-item>
      <el-form-item label="云信Id:" prop="Id">
        <span>{{acc.accid}}</span>
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <!-- <el-input :value="value.name" readonly></el-input> -->
        <span>{{acc.name}}</span>
      </el-form-item>

      <el-form-item label="性别:" prop="gender">
        <!-- <el-radio-group :value="value.gender" size="small">
          <el-radio-button v-for='(item,index) in genderList' :key='item.value' :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group> -->
        <span>{{acc.gender === '1'? '男':'女'}}</span>
      </el-form-item>

      <el-form-item label="好友:">
        <div class="friends">
          <el-card :body-style="{ padding: '0px' }" class="friend-item" v-for="(item, index) in acc.friends" :key="item.name">
            <img :src="item.icon || '/static/images/avatar_default_b.png'" class="avatar">
            <div class="friend-item-text">
              <span>{{item.name || item.accid}}</span>
            </div>
          </el-card>
        </div>
      </el-form-item>

    </el-form>
    <el-alert v-else title="暂无信息" type="error">
    </el-alert>
  </div>
</template>


<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    acc() {
      if (this.value && this.value.acc) {
        let acc = { ...this.value.acc, friends: this.value.accFriends };
        return acc;
      }
      return { friends: [] };
    }
  },
  data() {
    return {
      genderList: [{ label: "男", value: "1" }, { label: "女", value: "2" }]
      // value: {
      //   accid: "10086",
      //   name: "孙悟空",
      //   gender: 1,
      //   icon: "/static/images/avatar_default_b.png",
      //   friends: [
      //     {
      //       accid: "10010",
      //       name: "friend1",
      //       gender: 1,
      //       icon: "/static/images/avatar_default_b.png"
      //     },
      //     {
      //       accid: "10010",
      //       name: "friend1",
      //       gender: 1,
      //       icon: "/static/images/avatar_default_b.png"
      //     },
      //     {
      //       accid: "10010",
      //       name: "friend1",
      //       gender: 1,
      //       icon: "/static/images/avatar_default_b.png"
      //     },
      //     {
      //       accid: "10010",
      //       name: "friend1",
      //       gender: 1,
      //       icon: "/static/images/avatar_default_b.png"
      //     }
      //   ]
      // }
    };
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  max-width: 120px;
  max-height: 120px;
}
.friends {
  display: flex;
  flex-wrap: wrap;
  .friend-item {
    margin: 10px;
    .friend-item-text {
      text-align: center;
    }
  }
}
</style>






