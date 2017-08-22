<template>
  <div class="note-list">
    <head_bar></head_bar>
    <left_bar></left_bar>
    <el-col :span="16" :offset="6" class="grid-manage">
      <div class="grid-content bg-purple page-content">
        <article v-bind:id="'comment-' + item.messageId" v-for="item in messageList" v-bind:key="item.sendUserName">
          <div class="comment-meta">
             <div class="avatar">
              <router-link :to="{path:'/note',query: {id: item.sendUserId}}">
                <img alt="" :src="URL_PREFIX + item.sendUserHead" class="avatar-60 photo" height="60" width="60">
              </router-link>
            </div>
            <div class="caption">
              <h5 class="author">
                <span class="fn"><router-link :to="{path:'/note',query: {id: item.sendUserId}}" rel="external nofollow" class="url">{{item.sendUserName}}</router-link></span>
              </h5>
              <p class="date">
                {{item.messageTime}}
              </p>
            </div>
            <div class="block">
              <span class="wrapper">
                <el-button :plain="true" type="success" :class="item.messageUnRead==0?'btn-liked':''">{{item.messageUnRead==0?'已读':'未读'}}</el-button>
              </span>
            </div>
          </div>
          <div class="comment-body">
            <comment-part :originContent="item.messageContent"></comment-part>
            <fw-content :data="item"></fw-content>
          </div>
        </article>

        <el-row>
          <el-col :span="24" class="page-foot" v-if="messageList.length!=0 && messageList.length%10==0">
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
import Comment from './Comment.vue'
import Fwcontent from './Fwcontent.vue'

export default {
  name: 'note-list',
  created() {
    document.title = '您的消息 网宿微博';
  },
  mounted() {
    if (this.isLogin=='false') {
      this.$router.push({path: '/'});
    }
    var _this = this;
    _this.page = 1;
    _this.$ajax({
      method: 'get',
      url: _this.URL_PREFIX + '/weibo/front/message/getmessage',
      params: {
        page: _this.page,
        acceptUserId: localStorage.getItem('userId'),
        rows: 10
      }
    }).then(function(response) {
      if (response.data.code == 200) {
        _this.$message({
          showClose: true,
          message: response.data.description,
          type: 'success'
        });
        var parseData = JSON.parse(response.data.data)
        for (var i = 0;i < parseData.rows.length;i++) {
          if (parseData.rows[i].userName==undefined) {
            parseData.rows[i].userName = parseData.rows[i].sendUserName;
          }
          if (parseData.rows[i].userHead==undefined) {
            parseData.rows[i].userHead = parseData.rows[i].sendUserHead;
          }
          _this.messageList.push(parseData.rows[i]);
        }
        _this.$ajax({
          method: 'get',
          url: _this.URL_PREFIX + '/weibo/front/message/getmessage',
          params: {
            page: _this.page,
            acceptUserId: localStorage.getItem('userId'),
            rows: parseData.total
          }
        }).then(function(response) {
          if (response.data.code == 200) {
            var flag = true;
            var parseDataAll = JSON.parse(response.data.data);
            for (var i = 0;i < parseDataAll.rows.length;i++) {
              if (parseDataAll.rows[i].messageUnRead == 1) {
                localStorage.setItem('messageUnRead', true);
                flag = false;
                break;
              }
            }
            if (flag == true) {
              localStorage.setItem('messageUnRead', false);
            }
          }
        })
        .catch(function (response) {
          _this.$message({
              showClose: true,
              type: 'error',
              message: response
            })
        });
      }
      else {
        _this.$message({
          showClose: true,
          message: response.data.description,
          type: 'error'
        });
      }
    })
    .catch(function (response) {
      _this.$message({
          showClose: true,
          type: 'error',
          message: response
        })
    });
  },
  data () {
    return {
      labelPosition: top,
      page: 1,
      messageList: [],
      isLogin: localStorage.getItem('isLogin')
    }
  },
  components: {
    head_bar,
    foot_bar,
    left_bar,
    'comment-part':Comment,
    'fw-content':Fwcontent,
  },
  methods: {
    loadmore: function() {
      var _this = this;
      _this.page++;
      _this.$ajax({
        method: 'get',
        url: _this.URL_PREFIX + '/weibo/front/message/getmessage',
        params: {
          page: _this.page,
          acceptUserId: localStorage.getItem('userId'),
          rows: 10
        }
      }).then(function(response) {
        if (response.data.code == 200) {
          _this.$message({
            showClose: true,
            message: response.data.description,
            type: 'success'
          });
          var parseData = JSON.parse(response.data.data)
          for (var i = 0;i < parseData.rows.length;i++) {
            if (parseData.rows[i].userName==undefined) {
              parseData.rows[i].userName = parseData.rows[i].sendUserName;
            }
            if (parseData.rows[i].userHead==undefined) {
              parseData.rows[i].userHead = parseData.rows[i].sendUserHead;
            }
            _this.messageList.push(parseData.rows[i]);
          }
        }
        else {
          _this.$message({
            showClose: true,
            type: 'error',
            message: response.data.description
          })
        }
      })
      .catch(function (response) {
        _this.$message({
            showClose: true,
            type: 'error',
            message: response
          })
      });
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
