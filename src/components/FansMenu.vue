<template>
  <div class="note-list">
    <head_bar></head_bar>
    <left_bar></left_bar>
    <el-col :span="16" :offset="6" class="grid-manage">
      <div class="grid-content bg-purple page-content">
        <article v-bind:id="'comment-' + item.id" v-for="item in friendList" v-bind:key="item.date">
            <div class="comment-meta">
              <div class="avatar">
                <router-link :to="{path:'/note',query: {id: item.userId}}">
                  <img alt="" :src="URL_PREFIX + item.userHead" class="avatar-60 photo" height="60" width="60">
                </router-link>
              </div>
              <div class="caption">
                <h5 class="author">
                  <span class="fn"><router-link :to="{path:'/note',query: {id: item.userId}}" rel="external nofollow" class="url">{{item.userName}}</router-link></span>
                </h5>
              </div>
            </div>
            <div class="comment-body">
              <span>个人简介：</span><p>{{item.userIntroduce || '微博主很懒，什么也没写'}}</p>
            </div>
          </article>
          <el-row>
            <el-col :span="24" class="page-foot" v-if="friendList.length!=0 && friendList.length%10==0">
              <a @click="loadmore" class="loadmore">点击查看更多</a>
            </el-col>
          </el-row>
      </div>
    </el-col>
    <foot_bar></foot_bar>
  </div>
</template>

<script>
import head_bar from './HeadBar.vue'
import foot_bar from './Foot.vue'
import left_bar from './LeftBar.vue'

export default {
  // 粉丝列表页面
  name: 'fans-list',
  created() {
    document.title = '粉丝列表';
  },
  mounted() {
    // 初始化粉丝列表
    if (this.isLogin=='false') {
      this.$router.push({path: '/'});
    }
    var _this = this;
    _this.page = 1;
    _this.$ajax({
      method: 'get',
      url: _this.URL_PREFIX + '/weibo/front/attention/getfans',
      params: {
        page: _this.page,
        attentionUserId: localStorage.getItem('userId'),
        rows: 10
      }
    }).then(function(response) {
      if (response.data.code == 200) {
        _this.$message({
          showClose: true,
          message: response.data.description,
          type: 'success'
        });
        _this.friendList = response.data.data;
      }
      else {
        _this.$message({
          showClose: true,
          message: response.data.description,
          type: 'error'
        });
      }
    })
  },
  data () {
    return {
      page: 1,
      friendList: [],
      isLogin: localStorage.getItem('isLogin')
    }
  },
  components: {
    head_bar,
    foot_bar,
    left_bar
  },
  methods: {
    // 加载更多粉丝列表
    loadmore: function() {
      var _this = this;
      _this.page++;
      _this.$ajax({
        method: 'get',
        url: _this.URL_PREFIX + '/weibo/front/attention/getfans',
        params: {
          page: _this.page,
          attentionUserId: localStorage.getItem('userId'),
          rows: 10
        }
      }).then(function(response) {
        if (response.data.code == 200) {
          _this.$message({
            showClose: true,
            message: response.data.description,
            type: 'success'
          });
          for (var i = 0;i < response.data.data.length;i++) {
            _this.friendList.push(response.data.data[i]);
          }
        }
        else {
          _this.$message({
            showClose: true,
            message: response.data.description,
            type: 'error'
          });
        }
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid-manage {
  display: inline-block;
  position: absolute;
  height: 60%;
  width: 70%;
  margin-top: 2rem;
}
.comment-meta .avatar img {
  border-radius: 50%;
}
#search {
  display: inline-block;
  padding: 1rem 0 0.5rem 0;
  width: 100%;
}
.note-list {
  height: 100%;
  width: 100%;
}
.page-content {
	padding: 2rem 0 0 2rem;
  height: 100%;
  overflow-y: scroll;
}
.page-content::-webkit-scrollbar {
    width: 12px;
    background-color: #F5F5F5;
}
.page-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,.3);
    background-color: #324157;
}
.page-content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
}
.page-content article {
	padding: 1rem 0;
	border-top: 1px solid #ddd;
  width: 98%;
}
.page-content article .comment-meta {
  padding-left: 1rem;
	display: inline-block;
	width: calc(100% - 65px);
}
.page-content article .comment-meta .avatar,.caption {
  display: inline-block;
  float: left;
}
.page-content article .comment-body {
  padding: 0.5rem 1rem;
  font-size: 14px;
  word-break:break-all;
  letter-spacing: 1.5px;
}
.page-content article .comment-body span {
  font-weight: bold;
}

#comments #respond el-col {
	padding-left: 0;
}
.copyright {
	text-align: center;
	color: #fff;
}
.block {
  float: right;
}
.page-foot {
  text-align: center;
  margin: 1rem 0;
}
.loadmore {
  cursor: pointer;
  text-decoration: underline;
}
.at-a {
  cursor: pointer;
}
.loadmore:hover {
  text-decoration: none;
}
.comment-meta .caption h5 {
  margin-left: 0.5rem;
}
</style>
