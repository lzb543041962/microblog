<template>
  <div class="weibo-header header-wrapper">
    <el-menu theme="dark" class="el-menu-demo" mode="horizontal" :default-active="$route.path">
      <el-menu-item index="/"><router-link class="personal" to="/"><div>广播大厅</div></router-link></el-menu-item>
      <el-menu-item index="/note" v-show="isLogin=='true'"><router-link class="personal" :to="{path:'/note',query: {id: userId}}" @click.native="flushCom"><div>个人主页</div></router-link></el-menu-item>
      <el-submenu index="2" v-show="isLogin=='true'">
        <template slot="title">{{username}}</template>
        <el-menu-item index="/userinfo"><a class="personal" v-on:click="toPersonal"><div>个人中心</div></a></el-menu-item>
        <el-menu-item index="2-2"><a class="personal" v-on:click="logout"><div>登出</div></a></el-menu-item>
      </el-submenu>
      <el-menu-item index="3" v-show="isLogin=='false'"><a href="#" class="personal" @click="dialogFormVisible = true"><div>{{username}}</div></a></el-menu-item>
      <el-badge is-dot class="item" v-show="isLogin=='true'" v-if="messageUnRead == 'true'">
        <el-menu-item index="/message"><a @click="readMessage"><div>消息</div></a></el-menu-item>
      </el-badge>
      <el-badge class="item" v-show="isLogin=='true'">
        <el-menu-item index="/message"><a @click="readMessage"><div>消息</div></a></el-menu-item>
      </el-badge>
      <!-- <el-menu-item index="5" class="logo-item"><div><img src="../assets/chinanetcenter.png"></div></el-menu-item> -->
    </el-menu>
    <login-dialog :dialogFlag="dialogFormVisible" @dialogToggle="setDialogFlag"></login-dialog>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm'

export default {
  name: 'header-wrapper',
  data () {
    return {
      dialogFormVisible: false,
      isLogin: localStorage.getItem('isLogin'),
      username: localStorage.getItem('username') || '登录',
      userId: localStorage.getItem('userId'),
      messageUnRead: localStorage.getItem('messageUnRead')
    }
  },
  prop: {
    newName: String
  },
  watch: {
    newName: function() {
      this.username = this.newName;
    }
  },
  components: {
    'login-dialog': LoginForm
  },
  methods: {
    flushCom: function () {
      this.$router.go(0);
    },
    toPersonal: function() {
      var isLogin = localStorage.getItem('isLogin');
      if (isLogin == 'true') {
        this.$router.push({ path: '/userinfo' });
      }
    },
    logout: function() {
      this.username = '登录';
      localStorage.removeItem('username');
      localStorage.removeItem('userHead');
      localStorage.removeItem('userUnRead');
      localStorage.removeItem('userId');
      localStorage.removeItem('loginDate');
      localStorage.removeItem('messageUnRead');
      localStorage.setItem('isLogin','false');
      this.$router.push({ path: '/' });
      this.$router.go(0);
    },
    setDialogFlag: function(data) {
      this.dialogFormVisible = data;
    },
    readMessage: function() {
      this.$router.push({path: '/message'});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo-container {
  display: inline-block;
  float: left;
  min-width: 270px;
}
.el-menu-demo {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
}
/* .logo-item {
  float: right;
}
.logo-item img {
  width: auto;
  height: 60px;
} */
</style>
