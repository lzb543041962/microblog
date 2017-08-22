<template>
  <el-form name="commentForm" :model="commentForm" ref="commentForm" :rules="rules">
    <el-form-item label="评论" prop="commentContent">
      <el-col :span="22">
        <el-input id="saytext" name="saytext" type="textarea" v-model="commentForm.commentContent" cols="58"></el-input>
        <div id="facebox" v-if="isFaceShow">
          <ul>
            <li v-for="face in faceList" :key="face.name">
              <img :src="'./static/arclist/' + face.name" @click="addFace(face.value)">
            </li>
          </ul>
        </div>
      </el-col>
    </el-form-item>
    <el-form-item class="comment-btn-group">
      <el-button type="warning" class="emotion" @click="isFaceShow = !isFaceShow">表情</el-button>
      <el-button type="info" @click="postComment('commentForm')">发表</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  name: 'comment',
  created() {
    var _this = this;
    for (var i = 1;i < 76;i++) {
      _this.faceList.push({
        name: i + '.gif',
        value: '[em_' + i + ']'
      });
    }
  },
  data () {
    var checkCommentContent = (rule, value, callback) => {
      setTimeout(() => {
        if (value === '') {
          return callback(new Error('评论内容不能为空'));
        } else {
            if (value.length > 50) {
              return callback(new Error('评论内容不能超过50个字'));
            } else {
              callback();
            }
        }
      }, 500)
    };
    return {
      faceList: [],
      isFaceShow: false,
      commentForm: {
        commentContent: ''
      },
      weiboId: this.pId,
      userName: this.username,
      rules: {
        commentContent: [
          { validator: checkCommentContent, trigger:'blur'}
        ]
      },
      isLogin: localStorage.getItem('isLogin')
    }
  },
  props: {
    pId: String,
    username: String
  },
  methods: {
    addFace: function(val) {
      this.commentForm.commentContent += val;
      this.isFaceShow = false;
    },
    postComment: function(formName) {
      var _this = this;
      if (_this.isLogin == 'true') {
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = {
              commentContent: _this.commentForm.commentContent,
              commentTime: new Date(),
              userId: localStorage.getItem('userId'),
              weiboId: _this.weiboId,
              userName: localStorage.getItem('username')
            };
            _this.$ajax({
              method: 'get',
              url: _this.URL_PREFIX + '/weibo/front/comment/insertcomment',
              params: data
            }).then(function(response) {
              if (response.data.code == 200) {
                _this.$message({
                  showClose: true,
                  message: response.data.description,
                  type: 'success'
                });
                _this.$emit('commentpost',JSON.parse(response.data.data));
                _this.commentForm.commentContent = '';
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
        })
      }
      else {
        _this.$message({
          showClose: true,
          message: '您必须先登录才能进行评论操作',
          type: 'error'
        });
      }
    }
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
.comment-btn-group {
  text-align: right;
  margin-right: 5%;
}
.comment-btn-group button {
}
</style>
