<template>
    <h1>
        <i class="el-icon-time"></i>{{hour}}:{{minute}}<span>:{{second}}</span>
    </h1>
</template>
<script>
export default {
  data() {
    return {
      hour: '00',
      minute: '00',
      second: '00',
    };
  },
  created() {
    this.getTime();
    setInterval(this.getTime, 1000);
  },
  methods: {
    getTime() {
      const time = new Date();
      this.hour = time.getHours().toString().length >= 2 ? time.getHours() : `0${time.getHours()}`;
      this.minute = time.getMinutes().toString().length >= 2 ? time.getMinutes() : `0${time.getMinutes()}`;
      this.second = time.getSeconds().toString().length >= 2 ? time.getSeconds() : `0${time.getSeconds()}`;
    },
  },
};
</script>
<style scoped>
h1 {
  color: #409eff;
  letter-spacing: 2px;
  text-align: center;
  font-size: 50px;
}
h1 span{
  font-size: 25px;
}
h1 i{
  font-size: 30px;
}
</style>

