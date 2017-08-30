<template>
  <div class="fw-form">
    <el-form label-width="80px" :model="formFw" ref="formFw" :rules="rules">
        <el-form-item label="内容" prop="desc">
          <el-col :span="22" class="com_form">
            <span>转发默认获取所转发微博的主题和@，若需修改请按格式填写，#主题#，@名字后接空格</span>
            <el-input type="textarea" v-model="formFw.desc" :rows="5" auto-complete="off" placeholder="微博主题只能有一个，超过部分自动转为正文，微博内容不能多于140字"></el-input>
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
          <el-col :span="2" :offset="19">
          </el-col>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" class="emotion" @click="isFaceShow = !isFaceShow">表情</el-button>
      <el-button type="danger" @click="submitForm('formFw')">转发</el-button>
    </span>
  </div>
</template>

<script>
export default {
  // 转发表单组件
  name: 'fw-form',
  created() {
    var _this = this;
    // 加载表情
    for (let i = 1;i < 76;i++) {
      _this.faceList.push({
        name: i + '.gif',
        value: '[em_' + i + ']'
      });
    }
    // 获取原微博主题和@
    if (_this.article.weiboTopic!='') {
      _this.formFw.desc = '#' + _this.article.weiboTopic + '#';
    }
    if (_this.article.hasOwnProperty('weiboAts')) {
      if (_this.article.weiboAts[0]!='') {
        for (var i = 0;i < _this.article.weiboAts.length;i++) {
          _this.formFw.desc += '@' + _this.article.weiboAts[i] + ' ';
        }
      }
    }
  },
  props: {
    item: Object
  },
  watch: {
    item: function() {
      var _this = this;
      _this.article = _this.item;
      _this.formFw.desc = '';
      if (_this.article.weiboTopic!='') {
        _this.formFw.desc = '#' + _this.article.weiboTopic + '#';
      }
      if (_this.article.hasOwnProperty('weiboAts')) {
        if (_this.article.weiboAts[0]!='') {
          for (var i = 0;i < _this.article.weiboAts.length;i++) {
            _this.formFw.desc += '@' + _this.article.weiboAts[i] + ' ';
          }
        }
      }
    }
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
      faceList: [],
      isFaceShow: false,
      page: 1,
      formFw: {
        desc: ''
      },
      rules: {
        desc: [
          { validator: checkBlogContent, trigger:'blur'}
        ]
      },
      article: this.item,
      isLogin: localStorage.getItem('isLogin')
    }
  },
  methods: {
    addFace: function(val) {
      this.formFw.desc += val;
      this.isFaceShow = false;
    },
    submitForm(formName) {
      var _this = this;
      if (_this.isLogin == 'true') {
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_this.formFw.desc!='') {
              var content = _this.formFw.desc;
              var at = [];
              var theme = '';

              // 主题过滤
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

              // @过滤
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

              if (_this.article.rootWeibo!=null) {
                var data = {
                  userId: localStorage.getItem('userId'),
                  weiboFwContent: content,
                  weiboRootId: _this.article.weiboRootId,
                  weiboParentId: _this.article.weiboId,
                  weiboAt: at.join('@'),
                  weiboTopic: theme
                }
              }
              else {
                var data = {
                  userId: localStorage.getItem('userId'),
                  weiboRootId: _this.article.weiboId,
                  weiboParentId: _this.article.weiboId,
                  weiboFwContent: content,
                  weiboAt: at.join('@'),
                  weiboTopic: theme.trim(),
                }
              }


              _this.$ajax({
                method: 'get',
                url: _this.URL_PREFIX + '/weibo/front/forward',
                params: data
              }).then(function(response) {
                if (response.data.code == 200) {
                  _this.$message({
                    showClose: true,
                    message: response.data.description,
                    type: 'success'
                  });
                  _this.formFw.desc = '';
                  _this.$emit('forwardpost',response.data.data);
                }
                else {
                  _this.$message({
                    showClose: true,
                    message: response.data.description,
                    type: 'error'
                  });
                }
              })
            } else {
              return false;
            }
          }
        })
      }
      else {
        _this.$message({
          showClose: true,
          message: '您必须先登录才能转发微博',
          type: 'error'
        });
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#facebox ul {
  padding: 0;
}
#facebox ul li {
  display: inline-block;
  list-style: none;
}
.fw-dialog {
  width: 40%!important;
}
.dialog-footer {
  float: right;
  margin: 0 9% 1rem 0;
}
</style>
