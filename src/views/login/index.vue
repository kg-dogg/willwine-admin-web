<template>
  <el-container class="login-page">
    <el-header>
      <Header :showBar="false"></Header>
    </el-header>
    <el-main class="main">
      <img class="map" src="../../assets/images/map.png">
      <el-form class="form-wrap" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
        <div class="error-wrap" :class="{visible:message.length > 0}">{{message}}</div>
        <el-form-item class="title-item">
          <h3 class="form-title">员工登录</h3>
          <div class="form-title-line"></div>
        </el-form-item>
        <el-form-item prop="username" class="name-item">
          <!-- <el-input class="form-input" name="username" v-model="loginForm.username" size="large" :placeholder="$t('login.username')">
            <svg slot="prefix" class="icon" aria-hidden="true">
              <use xlink:href="#icon-user"></use>
            </svg>
          </el-input> -->
          <div class="form-input" :class="{focus:focusIndex === 1}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-user"></use>
            </svg>
            <input name="username" v-model="loginForm.username" :placeholder="$t('login.username')" @focus="setFocusIndex(1)" @blur="setFocusIndex(0)">
          </div>
        </el-form-item>
        <el-form-item prop="password" class="password-item">
          <!-- <el-input name="password" :type="passwordType" size="large" @keyup.enter.native="handleLogin" v-model="loginForm.password" :placeholder="$t('login.password')">
            <svg slot="prefix" class="icon" aria-hidden="true">
              <use xlink:href="#icon-password"></use>
            </svg>
            <svg slot="suffix" class="icon" aria-hidden="true" @click.stop="showPwd">
              <use xlink:href="#icon-eye"></use>
            </svg>
          </el-input> -->
          <div class="form-input" :class="{focus:focusIndex === 2}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-password"></use>
            </svg>
            <input :type="passwordType" name="password" v-model="loginForm.password" :placeholder="$t('login.password')" @keyup.enter.native="handleLogin" @focus="setFocusIndex(2)" @blur="setFocusIndex(0)">
            <svg class="icon" aria-hidden="true" @click.stop="showPwd">
              <use xlink:href="#icon-eye"></use>
            </svg>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox class="checkbox" v-model="loginForm.remember">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="form-btn" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>

    </el-main>
    <el-footer class="footer" height="90px">
      <div class="links">
        <!-- <a href="https://www.risecenter.com/" target="_blank">企业链接</a>
        <a href="https://www.risecenter.com/" target="_blank">瑞思官网</a>
        <a href="https://web.riselinkedu.com/" target="_blank">RISELINK</a>
        <a href="#" target="_blank">合作入口</a> -->
      </div>
      <hr>
      <div class="info">
        <!-- <span>北京领语堂教育科技发展有限公司 京ICP备09087483号</span>
        <img src="../../assets/images/police.png">
        <span>京公网安备11010102002030</span> -->
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { Header } from "@/views/layout/components";
import { isvalidUsername } from "@/utils/validate";
// import LangSelect from "@/components/LangSelect";

export default {
  components: { Header },
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        remember: false,
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur" }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      loading: false,
      // 错误消息
      message: "",
      // 记录 input focus
      focusIndex: 0,
      localAccount: "local_account"
    };
  },
  methods: {
    setFocusIndex(index) {
      this.focusIndex = index;
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid, errorObj) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(() => {
              if (this.loginForm.remember) {
                // 记住密码
                this.writeAccount();
              }
              this.loading = false;
              this.$router.push({ name: "Dashboard" });
            })
            .catch(e => {
              this.message = "用户名或密码错误";
              this.loading = false;
            });
        } else {
          Object.keys(errorObj).find(key => {
            // errorObj 的属性 都是数组
            for (let item of errorObj[key]) {
              if (item.message) {
                this.message = item.message;
                return true;
              }
            }
            return false;
          });
          return false;
        }
      });
    },
    writeAccount() {
      let rememberObj = {
        name: this.loginForm.username,
        password: this.loginForm.password,
        datetime: moment(new Date()).format()
      };
      try {
        let jsonStr = JSON.stringify(rememberObj);
        let writeStr = window.btoa(unescape(encodeURIComponent(jsonStr)));
        localStorage.setItem(this.localAccount, writeStr);
      } catch (e) {
        console.error(e);
      }
    },
    readAccount() {
      try {
        let readStr = localStorage.getItem(this.localAccount);
        if(!readStr){
          return false;
        }
        let jsonStr = decodeURIComponent(escape(window.atob(readStr)));
        let rememberObj = JSON.parse(jsonStr);
        if (
          moment(rememberObj.datetime)
            .add(7, "days")
            .isAfter(moment())
        ) {
          return false;
        }
        this.loginForm.username = rememberObj.name;
        this.loginForm.password = rememberObj.password;
      } catch (e) {
        console.error(e);
      }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    if (helper.isAuth()) {
      this.$router.replace({ name: "Dashboard" });
    } else {
      this.readAccount();
    }
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
};
</script>

<style lang="scss">
$bgcolor: #3a4d64;
.login-page {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url(../../assets/images/bg.png) no-repeat;
  background-size: 100% 100%;
  .main {
    width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .map {
      width: 36rem;
      height: 36rem;
      margin-top: 4rem;
    }
    .form-wrap {
      width: 25rem;
      height: 25rem;
      margin-left: 2rem;
      background-color: #ffffff;
      box-shadow: 0px 4px 16px 0px #202e40;
      padding: 1.5rem 3rem 3rem 3rem;
      .error-wrap {
        height: 2rem;
        line-height: 2rem;
        margin-bottom: 1.25rem;
        background-color: #ff6666;
        border-radius: 3px;
        color: #ffffff;
        text-align: center;
        font-size: 0.7rem;
        visibility: hidden;
        &.visible {
          visibility: visible;
        }
      }
      .title-item {
        margin-bottom: 2rem;
      }
      .name-item {
        margin-bottom: 1.5rem;
      }
      .password-item {
        margin-bottom: 0.2rem;
      }
      .form-title {
        font-size: 1rem;
        color: #304156;
      }
      .form-title-line {
        display: block;
        width: 1.5rem;
        height: 0.2rem;
        border-radius: 3px;
        background-color: #304156;
      }
      .icon {
        height: 100%;
        color: #d8d8d8;
      }
      .checkbox {
        margin-top: 5px;
      }
      .form-btn {
        width: 100%;
        height: 2.3rem;
        background-color: #304156;
        border-color: #304156;
        box-shadow: 0px 4px 9px 0px rgba(35, 9, 38, 0.3);
        border-radius: 3px;
        font-size: 0.9rem;
      }
      .form-input {
        width: 100%;
        background-color: #f8f8f8;
        height: 2.3rem;
        border-radius: 3px;
        display: flex;
        align-items: center;
        &.focus {
          border-left: 3px solid #f4b33f;
        }
        .icon {
          width: 1rem;
          height: 1rem;
          margin: 0 8px 0 9px;
        }
        input {
          height: 1.2rem;
          line-height: 1.2rem;
          background-color: hsla(0, 0%, 97%, 0);
          font-size: 0.8rem;
          color: #5c5c5c;
          flex-grow: 1;
          border: 0;
          outline: 0;
          padding-right: 2em;
          box-shadow: 0 0 0px 1000px #f8f8f8 inset; //关于解决浏览器记住密码情况下的输入框背景颜色
        }
      }
      .is-error {
        .form-input {
          border: 1px solid #f56c6c;
        }
      }
      .el-checkbox__label {
        font-size: 0.7rem;
        color: #9b9b9b;
      }
      .el-form-item__error {
        display: none;
      }
      .el-input__inner {
        background-color: #f8f8f8;
        &:focus {
          border-left: 3px solid #f4b33f;
        }
      }
      .el-input__prefix,
      .el-input__suffix {
        width: 25px;
      }
    }
  }
  .footer {
    display: flex;
    flex-direction: column;
    justify-content: bottom;
    align-items: center;
    padding-bottom: 1rem;
    font-size: 12px;
    color: #b2bfcd;
    .links {
      width: 600px;
      display: flex;
      justify-content: space-between;
    }
    hr {
      width: 100%;
      background-color: #202f44;
    }
    .info {
      font-weight: 500;
      img {
        width: 22px;
        height: 22px;
        margin: -5px 12px 0 12px;
      }
    }
  }
}
</style>
