<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
  },
  mounted() {
    //document.querySelector('body').removeClass('fix-header fix-sidebar card-no-border');
    helper.notification();
  },
  destroyed() {
  },
};
</script>
