<template>
  <div class="note-list">
    <head_bar></head_bar>
    <div class="login-main">
      <div class="page-container">
        <div class="container">
          <el-row :gutter="20">
            <el-col :span="16">
              <div class="grid-content bg-purple page-content">
                <section id="comments">
                  <el-form :model="form" ref="form" :rules="rules">
                    <h3>发布微博</h3>
                    <el-form-item label="" prop="desc" label-width="80">
                      <el-col :span="22" class="com_form">
                        <p>
                          <span class="input-tip">Tip：</span>@格式：@xxx后面接一个空格</p>
                        <el-input type="textarea" v-model="form.desc" :rows="10" auto-complete="off" placeholder="微博主题只能有一个，超过部分自动转为正文，微博内容不能多于140字"></el-input>
                        <div id="facebox" v-if="isFaceShow">
                          <ul>
                            <li v-for="face in faceList" :key="face.name">
                              <img :src="'./static/arclist/' + face.name" @click="addFace(face.value)">
                            </li>
                          </ul>
                        </div>
                        <div id="show"></div>
                      </el-col>
                    </el-form-item>
                    <el-form-item>
                      <el-col :span="10">
                        <el-button type="default" class="file gradient">
                          选择图片
                          <input type="file" ref="file" @change="getFile" accept="image/jpeg,image/jpg,image/png,image/svg,image/bmp">
                        </el-button>
                        <span>{{file!=null?file.name:'没有选择图片'}}</span>
                      </el-col>
                      <el-col :span="14" :offset="0" class="post-weibo-btn">
                        <el-row>
                          <el-col :span="5" :offset="5">
                            <el-button type="primary" class="emotion" @click="isFaceShow = !isFaceShow">表情</el-button>
                          </el-col>
                          <el-col :span="6">
                            <el-button type="warning" @click="confirmTheme">#主题#</el-button>
                          </el-col>
                          <el-col :span="5">
                            <el-button type="danger" @click="submitForm('form')">发布</el-button>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-form-item>
                  </el-form>
                </section>
                <div class="type-section" v-show="isLogin=='true'">
                  <el-breadcrumb separator="|">
                    <el-breadcrumb-item>
                      <span>
                        <el-button size="mini" @click="getWeiboAll" :disabled="!attentionFlag">全部</el-button>
                      </span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                      <span>
                        <el-button size="mini" @click="getWeiboAttentionPage" :disabled="attentionFlag">我关注的</el-button>
                      </span>
                    </el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
                <article v-bind:id="'comment-' + item.weiboId" v-for="item in noteList" v-bind:key="item.weiboId">
                  <div class="comment-meta">
                    <div class="avatar">
                      <router-link :to="{path:'/note',query: {id: item.userId}}">
                        <img alt="" :src="URL_PREFIX + item.userHead" class="avatar-60 photo" height="60" width="60">
                      </router-link>
                    </div>
                    <div class="caption">
                      <h5 class="author">
                        <span class="fn">
                          <router-link :to="{path:'/note',query: {id: item.userId}}" rel="external nofollow" class="url">{{item.userName}}</router-link>
                        </span>
                        -
                        <span class="comment-reply-link" href="#respond">发布</span>
                      </h5>
                      <p class="date">
                        {{item.weiboTime}}
                      </p>
                    </div>
                    <div class="block">
                      <span class="wrapper">
                        <el-button v-show="isLogin=='true'" :plain="true" type="warning" @click="addFavorite(item)" :class="item.weiboisCollect?'btn-collected':''">{{item.weiboisCollect?'已收藏'+item.weiboCollect:'收藏'+item.weiboCollect}}</el-button>
                        <el-button v-show="isLogin=='true'" :plain="true" type="success" @click="thumbUp(item)" :class="item.weiboisLike?'btn-liked':''">{{item.weiboisLike?'已点赞'+item.weiboLike:'点赞'+item.weiboLike}}</el-button>
                        <el-button :plain="true" type="info" @click="openComments(item)">评论{{item.weiboComment}}</el-button>
                        <el-button v-show="isLogin=='true'" :plain="true" type="danger" @click="forward(item)">转发{{item.weiboForward}}</el-button>
                      </span>
                    </div>
                  </div>
                  <div class="comment-body">
                    <p v-if="item.weiboTopic">
                      <router-link :to="'/topic/' + item.weiboTopic" class="theme-a">#{{item.weiboTopic}}# </router-link>
                    </p>
                    <comment-part :originContent="item.weiboRootIds==-1||item.rootWeibo==null?item.weiboContent:item.weiboFwContent"></comment-part>
                    <fw-content v-if="item.rootWeibo!=null" :data="item.rootWeibo!=null?item.rootWeibo:item"></fw-content>
                    <p>
                      <router-link :to="{path:'/note',query: {username: at}}" v-if="at!=''" v-for="at in item.weiboAts" v-bind:key="at" class="at-a">@{{at}} </router-link>
                    </p>
                  </div>
                  <div v-if="item.weiboRootId==-1 && item.weiboPhoto != ''" class="comment-picture">
                    <div class="media_box">
                      <ul>
                        <li>
                          <img :src="URL_PREFIX + item.weiboPhoto">
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="comment-child" v-if="!item.open">
                    <comment-post :pId="item.weiboId" :username="item.userName" @commentpost="addComment($event, item)"></comment-post>
                    <div class="comment-child-meta">
                      <div class="grid-content bg-purple" v-show="cItem.weiboId == item.weiboId" v-for="cItem in commentList" v-bind:key="cItem.userName">
                        <div class="avatar">
                          <router-link :to="{path:'/note',query: {id: cItem.userId}}">
                            <img alt="" :src="URL_PREFIX + cItem.userHead" class="avatar-20 photo" height="30" width="30">
                          </router-link>
                        </div>
                        <div class="caption">
                          <h5 class="author">
                            <span class="fn">
                              <router-link :to="{path:'/note',query: {id: cItem.userId}}" rel="external nofollow" class="url">{{cItem.userName}}</router-link>
                            </span>
                            <span class="comment-reply-link" href="#respond">评论</span>
                          </h5>
                          <p class="date">
                            <a>{{cItem.commentTime}}</a>
                          </p>
                        </div>
                        <div class="comment-body">
                          <comment-part :originContent="cItem.commentContent"></comment-part>
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

            <el-col :span="7" :offset="0" class="tip">
              <div class="grid-content bg-purple-light">
                <section class="widget">
                  <div class="support-widget">
                    <h3 class="title">小贴士</h3>
                    <p class="intro">如果有任何问题，都可以发邮件和我联系，邮箱地址mistakelzb@gmail.com</p>
                  </div>
                </section>
              </div>
            </el-col>
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
    document.title = '微博大厅 类微博系统';
    var _this = this;
    for (let i = 1; i < 76; i++) {
      _this.faceList.push({
        name: i + '.gif',
        value: '[em_' + i + ']'
      });
    }
  },
  mounted() {
    this.getWeiboAll();
  },
  data() {
    var checkBlogContent = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('微博内容不能为空'));
      }
      else {
        setTimeout(() => {
          if (value.length > 140) {
            callback(new Error('微博内容不能超过140个字'));
          } else {
            callback();
          }
        }, 500)
      }
    };
    return {
      addWeiboFlag: false,
      addCommentFlag: false,
      fwItem: {},
      faceList: [],
      isFaceShow: false,
      imageUrl: 'http://wx3.sinaimg.cn/mw690/8235fbe6gy1fi3k0zfa5bj20y81f47wi.jpg',
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
          { validator: checkBlogContent, trigger: 'blur' }
        ]
      },
      commentPage: [],
      file: null,
      isLogin: localStorage.getItem('isLogin')
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
    attentionFlag: function () {
      this.noteList = [];
      if (this.attentionFlag == true) {
        this.page = 1;
        this.addCommentFlag = false;
        this.addWeiboFlag = false;
      }
      else {
        this.attentionPage = 1;
        this.addCommentFlag = false;
        this.addWeiboFlag = false;
      }
    }
  },
  methods: {
    getFile($event) {
      this.file = $event.target.files[0];
    },
    forward: function (item) {
      this.dialogVisibleFw = true;
      this.fwItem = item;
    },
    getWeiboAll: function () {
      var _this = this;
      if (_this.attentionFlag == true) {
        _this.attentionFlag = false;
      }
      var data = {};
      var url = '';
      if (_this.isLogin == 'true') {
        data = {
          page: _this.page,
          rows: 10,
          userId: localStorage.getItem('userId')
        };
        url = _this.URL_PREFIX + '/weibo/front/weibo/getpageweibo';
      }
      else {
        data = {
          page: _this.page,
          rows: 10
        };
        url = _this.URL_PREFIX + '/weibo/front/weibo/getpageweiboNoUserName';
      }

      _this.$ajax({
        method: 'get',
        url: url,
        params: data
      }).then(function (response) {
        if (response.data.code == 200) {
          var parseData = JSON.parse(response.data.data);
          if (parseData.rows.length < 10) {
            _this.addWeiboFlag = false;
          }
          else {
            _this.addWeiboFlag = true;
          }
          if (_this.page == 1) {
            _this.noteList = parseData.rows;
            _this.page++;
          }
          else {
            for (var i = 0; i < parseData.rows.length; i++) {
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
    getWeiboAttentionPage: function () {
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
      }).then(function (response) {
        if (response.data.code == 200) {
          var parseData = JSON.parse(response.data.data);
          if (parseData.rows.length < 10) {
            _this.addWeiboFlag = false;
          }
          if (_this.attentionPage == 1) {
            _this.noteList = parseData.rows;
            _this.attentionPage++;
          }
          else {
            for (var i = 0; i < parseData.rows.length; i++) {
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
    delArticle: function (id) {
      var _this = this;
      _this.$ajax({
        method: 'get',
        url: _this.URL_PREFIX + '/weibo/front/weibo/deleteWeibo',
        params: {
          weiboId: id
        }
      }).then(function (response) {
        if (response.data.code == 200) {
          _this.$message({
            showClose: true,
            message: response.data.description,
            type: 'success'
          });
          for (var i = 0; i < _this.noteList.length; i++) {
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
    addFavorite: function (item) {
      var _this = this;
      if (_this.isLogin == 'true') {
        if (item.weiboisCollect != true) {
          _this.$ajax({
            method: 'get',
            url: _this.URL_PREFIX + '/weibo/front/addmark',
            params: {
              userId: localStorage.getItem('userId'),
              weiboId: item.weiboId
            }
          }).then(function (response) {
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
          }).then(function (response) {
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
      }
      else {
        _this.$message({
          showClose: true,
          message: '您必须先登录才能进行收藏操作',
          type: 'error'
        });
      }
    },
    thumbUp: function (item) {
      var _this = this;
      if (_this.isLogin == 'true') {
        if (item.weiboisLike != true) {
          _this.$ajax({
            method: 'get',
            url: _this.URL_PREFIX + '/weibo/front/addlike',
            params: {
              userId: localStorage.getItem('userId'),
              weiboId: item.weiboId
            }
          }).then(function (response) {
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
          }).then(function (response) {
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
      }
      else {
        _this.$message({
          showClose: true,
          message: '您必须先登录才能进行点赞操作',
          type: 'error'
        });
      }
    },
    addFace: function (val) {
      this.form.desc += val;
      this.isFaceShow = false;
    },
    loadmoreComments: function (item) {
      var _this = this;
      _this.$ajax({
        method: 'get',
        url: _this.URL_PREFIX + '/weibo/front/comment/getcomment',
        params: {
          page: _this.commentPage[item.weiboId],
          weiboId: item.weiboId,
          rows: 3
        }
      }).then(function (response) {
        if (response.data.code == 200) {
          var parsedata = JSON.parse(response.data.data);
          if (parsedata.rows.length < 3) {
            _this.addCommentFlag = false;
          }
          else {
            _this.addCommentFlag = true;
          }
          for (var i = 0; i < parsedata.rows.length; i++) {
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
    openComments: function (item) {
      if (item.open != false) {
        item.open = !item.open;
        var _this = this;
        if (!_this.commentPage[item.weiboId]) {
          _this.commentPage[item.weiboId] = 1;
          _this.loadmoreComments(item);
        }
      }
      else {
        item.open = !item.open;
      }
    },
    addComment: function (data, item) {
      this.commentList.unshift(data);
      this.addCommentFlag = true;
      item.weiboComment++;
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
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.form.desc += '@' + this.multipleSelection[i].name + ' ';
      }
      this.$refs.multipleTable.clearSelection();
    },
    confirmTheme() {
      this.form.desc = '#请在此输入话题#' + this.form.desc;
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
      if (_this.isLogin == 'true') {
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_this.form.desc != '') {
              var content = _this.form.desc;
              var at = [];
              var theme = '';

              if (content[0] == '#') {
                var end = 0;
                for (var i = 1; i < content.length; i++) {
                  if (content[i] == '#') {
                    end = i;
                    break;
                  }
                }
                theme = content.split('').slice(1, end).join('');
                if (end!=1) {
                  content = content.replace('#' + theme + '#', '');
                }
              }

              for (var i = 0; content.indexOf('@') != -1; i++) {
                var idx = content.indexOf('@');
                var end = 0;
                for (var j = idx; j < content.length; j++) {
                  if (content[j] == ' ') {
                    end = j;
                    break;
                  }
                }
                if (end == 0 || end == idx+1) {
                  break;
                }
                else {
                  at[i] = content.split('').slice(idx + 1, end).join('');
                  var addat = '@' + at[i] + ' ';
                  while (content.indexOf(addat) >= 0) {
                    content = content.replace(addat, '');
                  }
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

              _this.$ajax.post(_this.URL_PREFIX + '/weibo/front/weibo/postWeibo', formData, config)
                .then(function (response) {
                  if (response.data.code == 200) {
                    var parsedata = JSON.parse(response.data.data);
                    _this.noteList.unshift(parsedata);
                    _this.addWeiboFlag = true;
                    if (_this.file != null) {
                      _this.$refs.file.outerHTML = _this.$refs.file.outerHTML;
                      _this.file = null;
                    }
                    _this.form.desc = '';
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
      }
      else {
        _this.$message({
          showClose: true,
          message: '您必须先登录才可以发布微博',
          type: 'error'
        });
      }
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
  min-height: calc(100% - 60px);
  width: 100%;
}

#comments {
  padding: 1% 3%;
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

.page-content article .comment-meta .avatar,
.caption {
  display: inline-block;
}

.page-content article .comment-meta .avatar img {
  border-radius: 50%;
}

.page-content article .comment-body {
  padding: 0.5rem 1rem;
  font-size: 14px;
  word-break: break-all;
  letter-spacing: 1.5px;
}

.post-weibo-btn button {
  min-width: 4rem;
  width: 80%;
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

.at-a,
.theme-a {
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

.comment-child-meta .caption,
.avatar {
  display: inline-block;
}

.comment-child-meta .caption,
.avatar img {
  border-radius: 50%;
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
  word-break: break-all;
  letter-spacing: 1.5px;
}

.comment-child-meta .caption h5,
a {
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
  width: 50%;
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
  color: #dea726;
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
  right: 2%;
}

.tip h3 {
  color: #666666;
}

.tip p {
  font-size: 16px;
  color: #777777;
  line-height: 1.6;
  margin: 0;
}
.tip p img {
  width: 40%;
  height: auto;
  margin-left: 30%;
  margin-top: 0.5rem;
}

.input-tip {
  color: #e64242;
}

.file {
  position: relative;
  display: inline-block;
  border: 1px solid #d2d2d2;
  overflow: hidden;
  text-decoration: none;
  text-indent: 0;
  color: #333;
  font-size: 13px;
  cursor: pointer;
}

.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
</style>
