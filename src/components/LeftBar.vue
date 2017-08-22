<template>
  <nav class="leftbar" role="navigation" style="margin-bottom: 0">
    <div class="navbar-default sidebar" role="navigation">
      <el-row class="tac">
        <el-col :span="24" class="lefbar-menu">
          <el-menu :default-active="$route.path" class="el-menu-vertical-demo">
            <el-menu-item index="/favorite"><router-link to="/favorite"><div><i class="el-icon-check"></i> 我赞过的</div></router-link></el-menu-item>
            <el-menu-item index="/collect"><router-link to="/collect"><div><i class="el-icon-star-on"></i> 我的收藏</div></router-link></el-menu-item>
            <el-menu-item index="/fansmenu"><router-link to="/fansmenu"><div><i class="el-icon-menu"></i> 粉丝列表</div></router-link></el-menu-item>
            <el-menu-item index="/friendsmenu"><router-link to="/friendsmenu"><div><i class="el-icon-menu"></i> 关注列表</div></router-link></el-menu-item>
            <el-menu-item index="/userinfo"><router-link to="/userinfo"><div><i class="el-icon-information"></i> 个人资料</div></router-link></el-menu-item>
            <el-badge is-dot class="leftbar-item" v-show="isLogin=='true'" v-if="messageUnRead=='true'">
              <el-menu-item index="/message"><a @click="readMessage"><div><i class="el-icon-message"></i> 消息</div></a></el-menu-item>
            </el-badge>
            <el-badge class="leftbar-item" v-show="isLogin=='true'" v-if="messageUnRead=='false'">
              <el-menu-item index="/message"><a @click="readMessage"><div><i class="el-icon-message"></i> 消息</div></a></el-menu-item>
            </el-badge>
            <el-menu-item index="/updatepassword"><router-link to="/updatepassword"><div><i class="el-icon-setting"></i> 修改密码</div></router-link></el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'left-bar',
  data () {
    return {
      isLogin: localStorage.getItem('isLogin'),
      activeIndex: this.$route.path,
      messageUnRead: localStorage.getItem('messageUnRead')
    }
  },
  methods: {
    readMessage: function() {
      this.$router.push({path: '/message'});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tac,.lefbar-menu,.el-menu-vertical-demo {
  height: 100%;
}
.leftbar {
  position: relative;
  height: 100%;
  display: inline-block;
}
.sidebar {
  height: 100%;
}
.leftbar-item {
  width: 100%;
}
.el-menu-item.is-active {
  background: #D3DCE6;
}
</style>


