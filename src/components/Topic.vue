<template>
  <div class="note-list">
    <head_bar></head_bar>
    <div class="login-main">
      <div class="page-container">
        <div class="container">
            <el-row :gutter="20">
              <el-col :span="20" :offset="2">
                <div class="grid-content bg-purple page-content">
                  <div class="topic-title">
                    <h2>#{{topic}}#</h2>
                  </div>
                  <article v-bind:id="'comment-' + item.weiboId" v-for="item in noteList" v-bind:key="item.userName">
                      <div class="comment-meta">
                        <div class="avatar">
                          <router-link :to="{path:'/note',query: {id: item.userId}}">
                            <img alt="" :src="URL_PREFIX + item.userHead" class="avatar-60 photo" height="60" width="60">
                          </router-link>
                        </div>
                        <div class="caption">
                          <h5 class="author">
                            <span class="fn"><router-link :to="{path:'/note',query: {id: item.userId}}" rel="external nofollow" class="url">{{item.userName}}</router-link></span>
                                - <span class="comment-reply-link" href="#respond">发布</span>
                          </h5>
                          <p class="date">
                            {{item.weiboTime}}
                          </p>
                        </div>
                        <div class="block">
                          <span class="wrapper">
                            <el-button :plain="true" type="warning" @click="addFavorite(item)" :class="item.weiboisCollect?'btn-collected':''">{{item.weiboisCollect?'已收藏'+item.weiboCollect:'收藏'+item.weiboCollect}}</el-button>
                            <el-button :plain="true" type="success" @click="thumbUp(item)" :class="item.weiboisLike?'btn-liked':''">{{item.weiboisLike?'已点赞'+item.weiboLike:'点赞'+item.weiboLike}}</el-button>
                            <el-button :plain="true" type="info" @click="openComments(item)">评论{{item.weiboComment}}</el-button>
                            <el-button :plain="true" type="danger" @click="forward(item)">转发{{item.weiboForward}}</el-button>
                          </span>
                        </div>
                      </div>
                      <div class="comment-body">
                        <p v-if="item.weiboTopic"><router-link :to="'/topic/' + item.weiboTopic" class="theme-a">#{{item.weiboTopic}}# </router-link></p>
                        <comment-part :originContent="item.weiboRootIds==-1||item.rootWeibo==null?item.weiboContent:item.weiboFwContent"></comment-part>
                        <fw-content v-if="item.rootWeibo!=null" :data="item.rootWeibo!=null?item.rootWeibo:item"></fw-content>
                        <p><router-link :to="{path:'/note',query: {username: at}}" v-if="at!=''" v-for="at in item.weiboAts" v-bind:key="at" class="at-a">@{{at}} </router-link></p>
                      </div>
                      <div v-if="item.weiboRootId==-1 && item.weiboPhoto!=''" class="comment-picture">
                        <div class="media_box">
                          <ul>
                            <li>
                              <img :src="URL_PREFIX + item.weiboPhoto">
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="comment-child" v-if="!item.open">
                        <comment-post :pId="item.weiboId" :username="item.userName" @commentpost="addComment"></comment-post>
                        <div class="comment-child-meta">
                          <div class="grid-content bg-purple" v-show="cItem.weiboId == item.weiboId" v-for="cItem in commentList" v-bind:key="cItem.date">
                            <div class="avatar">
                              <router-link :to="{path:'/note',query: {id: cItem.userId}}">
                                <img alt="" :src="URL_PREFIX + cItem.userHead" class="avatar-20 photo" height="30" width="30">
                              </router-link>
                            </div>
                            <div class="caption">
                              <h5 class="author">
                                <span class="fn"><router-link :to="{path:'/note',query: {id: cItem.userId}}" rel="external nofollow" class="url">{{cItem.userName}}</router-link></span>
                                <span class="comment-reply-link" href="#respond">评论</span>
                              </h5>
                              <p class="date">
                                <a>{{cItem.commentTime}}</a>
                              </p>
                            </div>
                            <div class="comment-body">
                              <p>{{cItem.commentContent}}</p>
                            </div>
                          </div>
                          <div class="load-comment" v-if="(commentList.length!=0 && commentList.length%3==0) || addCommentFlag==true">
                            <a @click="loadmoreComments(item)" class="loadmore">点击查看更多评论</a>
                          </div>
                        </div>
                      </div>
                    </article>

                    <el-col :span="24" class="page-foot" v-if="(noteList.length !=0 && noteList.length%10==0) || addWeiboFlag==true">
                        <a @click="attentionFlag?getWeiboAttentionPage():getWeiboAll()" class="loadmore">点击查看更多微博内容</a>
                    </el-col>


                </div>
              </el-col>

              <el-dialog class="fw-dialog" title="转发" :visible.sync="dialogVisibleFw" size="tiny">
                  <fw-form :item="fwItem" @forwardpost="addforward($event, fwItem)"></fw-form>
              </el-dialog>

              <div class="to-top">
                <el-button type="primary" @click="toTop" icon="arrow-up"></el-button>
              </div>
            </el-row>
        </div>
      </div>
    </div>
    <foot_bar></foot_bar>
  </div>
</template>

<script>
import head_bar from './HeadBar.vue'
import foot_bar from './Foot.vue'
import Comment from './Comment.vue'
import Fwcontent from './Fwcontent.vue'
import Fwform from './Fwform.vue'
import PostComment from './PostComment.vue'
import person from '../assets/person.png'
import $ from 'jquery';

export default {
  name: 'note-list',
  created() {
    var _this = this;
    for (let i = 1;i < 76;i++) {
      _this.faceList.push({
        name: i + '.gif',
        value: '[em_' + i + ']'
      });
    }
  },
  mounted() {
    this.getWeiboAll();
    document.title = '主题 ' + _this.topic + ' 网宿微博';
  },
  data () {
    var checkBlogContent = (rule, value, callback) => {
      setTimeout(() => {
        if (value === '') {
          return callback(new Error('微博内容不能为空'));
        } else {
            if (value.length > 140) {
              return callback(new Error('微博内容不能超过140个字'));
            } else {
              callback();
            }
        }
      }, 500)

    };
    return {
      addWeiboFlag: false,
      addCommentFlag: false,
      topic: this.$route.params.weiboTopic,
      fwItem: {},
      faceList: [],
      isFaceShow: false,
      imageUrl: 'http://wx3.sinaimg.cn/mw690/8235fbe6gy1fi3k0zfa5bj20y81f47wi.jpg',
      options: [{
        value: 'news',
        label: 'news'
      }, {
        value: '双皮奶',
        label: '双皮奶'
      }, {
        value: '蚵仔煎',
        label: '蚵仔煎'
      }, {
        value: '龙须面',
        label: '龙须面'
      }, {
        value: '北京烤鸭',
        label: '北京烤鸭'
      }],
      themeValue: '',
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisibleFw: false,
      page: 1,
      attentionPage: 1,
      attentionFlag: false,
      noteList: [],
      commentList: [],
      form: {
        desc: ''
      },
      formFw: {
        desc: ''
      },
      rules: {
        desc: [
          { validator: checkBlogContent, trigger:'blur'}
        ]
      },
      commentPage: [],
      file: null
    }
  },
  components: {
    head_bar,
    foot_bar,
    'comment-part': Comment,
    'comment-post': PostComment,
    'fw-content': Fwcontent,
    'fw-form': Fwform
  },
  watch: {
    attentionFlag: function() {
      this.noteList = [];
      if (this.attentionFlag == true) {
        this.page = 1;
      }
      else {
        this.attentionPage = 1;
      }
    }
  },
  methods: {
    getFile($event) {
      this.file = $event.target.files[0];
    },
    forward: function(item) {
      this.dialogVisibleFw = true;
      this.fwItem = item;
    },
    getWeiboAll: function() {
      var _this = this;
      if (_this.attentionFlag == true) {
        _this.attentionFlag = false;
      }
      var data = {};
      var url = '';
      data = {
        weiboTopic: _this.$route.params.weiboTopic,
        page: _this.page,
        rows: 10,
      };
      url = _this.URL_PREFIX + '/weibo/front/weibo/getWeiboByTopic';

      _this.$ajax({
        method: 'get',
        url: url,
        params: data
      }).then(function(response) {
        if (response.data.code == 200) {
          var parseData = JSON.parse(response.data.data);
          if (parseData.rows.length < 10) {
            _this.addWeiboFlag = false;
          }
          else {
            _this.addWeiboFlag = true;
          }
          if (_this.page == 1) {
            for (var i = 0;i < parseData.rows.length;i++) {
              if (!parseData.rows[i].weiboRootId) {
                parseData.rows[i].weiboRootId = -1;
              }
            }
            _this.noteList = parseData.rows;
            _this.page++;
          }
          else {
            for (var i = 0;i < parseData.rows.length;i++) {
              _this.noteList.push(parseData.rows[i]);
            }
            _this.page++;
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
      .catch(function (response) {
        _this.$message({
            showClose: true,
            type: 'error',
            message: response
          })
      });
    },
    getWeiboAttentionPage: function() {
      var _this = this;
      if (_this.attentionFlag == false) {
        _this.attentionFlag = true;
      }
      _this.$ajax({
        method: 'get',
        url: _this.URL_PREFIX + '/weibo/front/weibo/getWeiboAttentionPage',
        params: {
          page: _this.attentionPage,
          rows: 10,
          userId: localStorage.getItem('userId')
        }
      }).then(function(response) {
        if (response.data.code == 200) {
          var parseData = JSON.parse(response.data.data);
          if (_this.attentionPage == 1) {
            _this.noteList = parseData.rows;
            _this.attentionPage++;
          }
          else {
            for (var i = 0;i < parseData.rows.length;i++) {
              _this.noteList.push(parseData.rows[i]);
              _this.attentionPage++;
            }
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
      .catch(function (response) {
        _this.$message({
            showClose: true,
            type: 'error',
            message: response
          })
      });
    },
    delArticle: function(id) {
      var _this = this;
      _this.$ajax({
        method: 'get',
        url: _this.URL_PREFIX + '/weibo/front/weibo/deleteWeibo',
        params: {
          weiboId: id
        }
      }).then(function(response) {
        if (response.data.code == 200) {
          _this.$message({
            showClose: true,
            message: response.data.description,
            type: 'success'
          });
          for (var i = 0;i < _this.noteList.length;i++) {
            if (_this.noteList[i].weiboId === id) {
              _this.noteList.splice(i, 1);
            }
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
      .catch(function (response) {
        _this.$message({
            showClose: true,
            type: 'error',
            message: response
          })
      });
    },
    addFavorite: function(item) {
      var _this = this;
      if (item.weiboisCollect != true) {
        _this.$ajax({
          method: 'get',
          url: _this.URL_PREFIX + '/weibo/front/addmark',
          params: {
            userId: localStorage.getItem('userId'),
            weiboId: item.weiboId
          }
        }).then(function(response) {
          if (response.data.code == 200) {
            _this.$message({
              showClose: true,
              message: response.data.description,
              type: 'success'
            });
            item.weiboisCollect = true;
            item.weiboCollect++;
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
      }
      else {
        _this.$ajax({
          method: 'get',
          url: _this.URL_PREFIX + '/weibo/front/removemark',
          params: {
            userId: localStorage.getItem('userId'),
            weiboId: item.weiboId
          }
        }).then(function(response) {
          if (response.data.code == 200) {
            _this.$message({
              showClose: true,
              message: response.data.description,
              type: 'success'
            });
            item.weiboisCollect = false;
            item.weiboCollect--;
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
      }
    },
    thumbUp: function(item) {
      var _this = this;
      if (item.weiboisLike != true) {
        _this.$ajax({
          method: 'get',
          url: _this.URL_PREFIX + '/weibo/front/addlike',
          params: {
            userId: localStorage.getItem('userId'),
            weiboId: item.weiboId
          }
        }).then(function(response) {
          if (response.data.code == 200) {
            _this.$message({
              showClose: true,
              message: response.data.description,
              type: 'success'
            });
            item.weiboisLike = true;
            item.weiboLike++;
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
      }
      else {
        _this.$ajax({
          method: 'get',
          url: _this.URL_PREFIX + '/weibo/front/removelike',
          params: {
            userId: localStorage.getItem('userId'),
            weiboId: item.weiboId
          }
        }).then(function(response) {
          if (response.data.code == 200) {
            _this.$message({
              showClose: true,
              message: response.data.description,
              type: 'success'
            });
            item.weiboisLike = false;
            item.weiboLike--;
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
      }
    },
    addFace: function(val) {
      this.form.desc += val;
      this.isFaceShow = false;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleChange(file, fileList) {
      if (fileList.length > 9) {
        this.fileList = fileList.shift();
      }
    },
    loadmoreComments: function(item) {
      var _this = this;
      _this.$ajax({
        method: 'get',
        url: _this.URL_PREFIX + '/weibo/front/comment/getcomment',
        params: {
          page: _this.commentPage[item.weiboId],
          weiboId: item.weiboId,
          rows: 3
        }
      }).then(function(response) {
        if (response.data.code == 200) {
          var parsedata = JSON.parse(response.data.data);
          if (parsedata.rows.length < 3) {
            _this.addCommentFlag = false;
          }
          else {
            _this.addCommentFlag = true;
          }
          for (var i = 0;i < parsedata.rows.length;i++) {
            _this.commentList.push(parsedata.rows[i]);
          }
          _this.commentPage[item.weiboId]++;
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
    openComments: function(item) {
      if (item.open != false) {
        item.open=!item.open;
        var _this = this;
        if (!_this.commentPage[item.weiboId]) {
          _this.commentPage[item.weiboId] = 1;
          _this.loadmoreComments(item);
        }
      }
      else {
        item.open=!item.open;
      }
    },
    addComment: function(data) {
      this.addCommentFlag = true;
      this.commentList.unshift(data);
    },
    addforward: function (data, fwItem) {
      var _this = this;
      _this.addWeiboFlag = true;
      _this.dialogVisibleFw = false;
      for (var i = 0;i < _this.noteList.length;i++) {
        if (fwItem.weiboId == _this.noteList[i].weiboId) {
          _this.noteList[i].weiboForward++;
          break;
        }
      }
      for (var i = 0;i < _this.noteList.length;i++) {
        if (data.rootWeiboId == _this.noteList[i].weiboId) {
          _this.noteList[i].weiboForward++;
          break;
        }
      }
      _this.noteList.unshift(data);
    },
    confirmAt() {
      this.dialogVisible = false;
      for (var i = 0;i < this.multipleSelection.length;i++) {
        this.form.desc+='@' + this.multipleSelection[i].name + ' ';
      }
      this.$refs.multipleTable.clearSelection();
    },
    confirmTheme() {
      this.dialogVisible2 = false;
      this.form.desc = '#' + this.themeValue + '#' + this.form.desc;
      this.themeValue = '';
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.form.desc!='') {
            var content = _this.form.desc;
            _this.form.desc = '';
            var at = [];
            var theme = '';

            if (content[0] == '#') {
              var end;
              for (var i = 1;i < content.length;i++) {
                if (content[i] == '#') {
                  end = i;
                  break;
                }
              }
              theme = content.split('').slice(1,end).join('');
              content = content.replace('#'+theme+'#', '');
            }

            for (var i = 0;content.indexOf('@')!=-1;i++) {
              var idx = content.indexOf('@');
              var end;
              for (var j = idx;j < content.length;j++) {
                if (content[j] == ' ') {
                  end = j;
                  break;
                }
              }
              at[i] = content.split('').slice(idx+1,end).join('');
              var addat = '@' + at[i];
              while (content.indexOf(addat) >= 0){
                content = content.replace(addat, '');
              }
            }

            var formData = new FormData();
            formData.append('userId', localStorage.getItem('userId'));
            formData.append('file', _this.file);
            formData.append('weiboContent', content);
            formData.append('weiboAt', at.join('@'));
            formData.append('weiboTopic', theme);

            var config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }

            _this.$ajax.post(_this.URL_PREFIX + '/front/weibo/postWeibo',formData,config)
            .then(function(response) {
              if (response.data.code == 200) {
                var parsedata = JSON.parse(response.data.data);
                parsedata.weiboRootId = -1;
                _this.noteList.unshift(parsedata);
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
          } else {
            return false;
          }
        }
      })
    },
    toTop() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.note-list {
  height: 100%;
  width: 100%;
}
.login-main {
  min-height: calc(100% - 60px - 5rem);
  width: 100%;
}
.page-content article {
	padding: 1rem 0;
	border-bottom: 1px solid #ddd;
}
.page-content article .comment-meta {
  padding-left: 1rem;
	display: inline-block;
	width: calc(100% - 65px);
}
.page-content article .comment-meta .avatar,.caption {
  display: inline-block;
}
.page-content article .comment-body {
  padding: 0.5rem 1rem;
  font-size: 14px;
  word-break:break-all;
  letter-spacing: 1.5px;
}
.post-weibo-btn button {
  float: right;
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
.at-a,.theme-a {
  cursor: pointer;
}
.theme-a {
  color: #eb7350;
}
.loadmore:hover {
  text-decoration: none;
}
.read-comment-child {
  float: right;
}
.comment-child-meta .caption,.avatar {
  display: inline-block;
}
.comment-child-meta {
  padding: 0 1rem;
}
.comment-child-meta .grid-content {
  padding: 0 5px;
}
.comment-child-meta .grid-content p {
  font-size: 12px;
}
.comment-child-meta .comment-body {
  display: inline-block;
  max-width: 75%;
  word-break:break-all;
  letter-spacing: 1.5px;
}
.comment-child-meta .caption h5,a {
  margin: 0;
}

.load-comment {
  margin-top: 0.2rem;
  text-align: center;
  font-size: 12px;
}
.type-section {
  background: #f3f3f3;
  padding: 1rem 1rem;
  text-align: center;
}
.type-section span {
  font-size: 1rem;
  text-align: center;
}
.type-section button {
  border: none;
  background: #f3f3f3;
}
.date {
  color: #999999;
  font-size: 14px;
}
.comment-picture {
  display: inline-block;
  width: calc(100% - 65px);
}
.comment-picture .media_box {
  width:50%;
  min-width: 350px;
}
.comment-picture ul li {
  width: 300px;
  height: 200px;
  margin: 4px 0 0 4px;
  list-style: none;
  float: left;
  overflow: hidden;
}
.comment-picture ul li img {
  width: 300px;
  height: auto;
  display: inline-block;
  vertical-align: top;
}
#facebox ul li {
  display: inline-block;
  list-style: none;
}
.btn-collected {
  color:  #dea726;
  border-color: #dea726;
}
.btn-liked {
  color: #13ce66;
  border-color: #13ce66;
}

.to-top {
  position: fixed;
  top: 88%;
  right: 2%;
  z-index: 999;
}
.tip {
  position: fixed;
  right: 1%;
}
.tip h3 {
  color: #666666;
}
.tip p {
  color: #777777;
}
.topic-title {
  color: #eb7350;
}
</style>
