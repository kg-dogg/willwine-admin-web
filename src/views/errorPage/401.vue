<template>
    <div class="errPage-container">
        <el-button @click="back" icon='arrow-left' class="pan-back-btn">返回</el-button>
        <el-row>
            <el-col :span="12">
                <h1 class="text-jumbo text-ginormous">Oops!</h1>
                <h2>您没有权限去该页面</h2>
                <ul class="list-unstyled">
                    <li>或者您可以:</li>
                    <li class="link-type">
                        <router-link to="/dashboard"><h3>回首页</h3></router-link>
                    </li>
                </ul>
            </el-col>
            <el-col :span="12">
                <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
            </el-col>
        </el-row>
    </div>
</template>
<script>
import errGif from '@/assets/401_images/401.png';

export default {
  name: '401',
  data() {
    return {
      errGif,

    };
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' });
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .errPage-container {
        width: 800px;
        margin: 100px auto;
        .pan-back-btn {
            background: #008489;
            color: #fff;
        }
        .pan-gif {
            margin: 0 auto;
            display: block;
        }
        .pan-img {
            display: block;
            margin: 0 auto;
            width: 100%;
        }
        .text-jumbo {
            font-size: 60px;
            font-weight: 700;
            color: #484848;
        }
        .list-unstyled {
            font-size: 14px;
            li {
                padding-bottom: 5px;
            }
            a {
                color: #008489;
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
