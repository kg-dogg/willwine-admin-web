<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Welcom To 后台管理系统</div>
    <!-- <MyUploader listType="picture-card"></MyUploader> -->
  </div>
</template>

<script>
// import MyUploader from '@/components/MyUploader';

export default {
  name: 'dashboard',
  components:{
    // MyUploader
  },
  data(){
    return {
      // fileList:[{name: 'food.jpg', url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big51000.jpg',status:'uploading',percentage:10}]
    };
  },
  created() {
    // this.$store.dispatch('Courseglobaldata')
  },

};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
