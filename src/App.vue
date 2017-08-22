<template>
  <div id="app">
    <router-view class="main" :meta="$route.meta"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    var loginDate = new Date(localStorage.getItem('loginDate'));
    var nowDate = new Date();
    localStorage.setItem('messageUnRead', false);
    if (loginDate!=null) {
      if (nowDate.getTime() - loginDate.getTime() > 2*60*60*1000) {
        localStorage.removeItem('username');
        localStorage.removeItem('userHead');
        localStorage.removeItem('userUnRead');
        localStorage.removeItem('userId');
        localStorage.removeItem('loginDate');
        localStorage.removeItem('messageUnRead');
        localStorage.removeItem('activeIndex');
        localStorage.setItem('isLogin','false');
      }
    }
  }
}
</script>

<style src="./assets/main5152.less"></style>

