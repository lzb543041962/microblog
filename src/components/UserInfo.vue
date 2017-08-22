<template>
  <div class="user-info">
    <head_bar :newName="form.userName"></head_bar>
    <left_bar></left_bar>
    <el-col :span="16" :offset="6" class="grid-manage">
      <fieldset>
        <legend> 个人资料 </legend>
      </fieldset>
      <el-form ref="form" :model="form" class="update-userinfo-form" label-width="80px" :rules="rules">
        <el-form-item label="头像" style="padding-top:20px;">
          <div class="user-photo">
            <img :src="URL_PREFIX + form.userHead">
          </div>
          <el-col>
            <el-button type="default" class="file gradient">
              选择图片
              <input type="file" ref="file" @change="getFile" accept="image/jpeg,image/jpg,image/png,image/svg,image/bmp">
            </el-button>
            <span>{{file!=null?file.name:'没有选择图片'}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="form.userLoginName" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-radio class="radio" v-model="form.userSex" :label="1">男</el-radio>
          <el-radio class="radio" v-model="form.userSex" :label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="个人介绍" prop="userIntroduce">
          <el-input type="textarea" v-model="form.userIntroduce" :rows="3" auto-complete="off" placeholder="个人简介内容不能多于100字"></el-input>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-input v-model="form.userRegisterDate" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="reset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <foot_bar></foot_bar>
  </div>
</template>

<script>
import head_bar from './HeadBar.vue'
import foot_bar from './Foot.vue'
import left_bar from './LeftBar.vue'

export default {
  name: 'user-info',
  created() {
    document.title = '个人资料 网宿微博';
  },
  mounted() {
    if (this.isLogin=='false') {
      this.$router.push({path: '/'});
    }
    var _this = this;
    _this.$ajax({
      method: 'get',
      url: _this.URL_PREFIX + '/weibo/front/account/getinfo',
      params: {
        userId: localStorage.getItem('userId')
      }
    }).then(function (response) {
      if (response.data.code == 200) {
        _this.$message({
          showClose: true,
          message: response.data.description,
          type: 'success'
        });
        _this.form = JSON.parse(response.data.data);
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
  data() {
    var checkBlogContent = (rule, value, callback) => {
      setTimeout(() => {
        if (value.length > 100) {
          return callback(new Error('个人简介内容不能超过100个字'));
        } else {
          callback();
        }
      }, 500)
    };
    var checkName = (rule, value, callback) => {
      var regName = /^([\u4e00-\u9fa5a-zA-Z0-9]+)$/ig;
      if (value === '') {
        return callback(new Error('请输入昵称'));
      } else {
        setTimeout(() => {
          if (value.length > 14) {
            callback(new Error('昵称长度需在14字以内'));
          } else if (!regName.test(value)) {
            callback(new Error('昵称不能包含@、#、空格等特殊字符'))
          } else {
            callback();
          }
        }, 1000);
      }
    };
    return {
      isLogin: localStorage.getItem('isLogin'),
      file: null,
      form: {},
      rules: {
        userIntroduce: [
          { validator: checkBlogContent, trigger: 'change' }
        ],
        userName: [
          { validator: checkName, trigger: 'change'}
        ]
      }
    }
  },
  components: {
    head_bar,
    foot_bar,
    left_bar
  },
  methods: {
    getFile($event) {
      this.file = $event.target.files[0];
    },
    submitForm(formName) {
      var _this = this;
      var formData = new FormData();
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('file', _this.file);
      formData.append('sex', _this.form.userSex);
      formData.append('introduce', _this.form.userIntroduce);
      formData.append('username', _this.form.userName);
      // var data = {
      //   userId: localStorage.getItem('userId'),
      //   sex: _this.form.userSex,
      //   introduce: _this.form.userIntroduce,
      //   username: _this.form.userName
      // };
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$ajax({
            method: 'post',
            url: _this.URL_PREFIX + '/weibo/front/account/updateinfo',
            data: formData
          }).then(function (response) {
            if (response.data.code == 200) {
              _this.$message({
                showClose: true,
                message: response.data.description,
                type: 'success',
                duration: 500,
                onClose: function() {
                  localStorage.setItem('username',_this.form.userName);
                  setTimeout(function() {
                    _this.$router.go({path: '/userinfo'});
                  }, 1000);
                }
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
        }
      })
    },
    reset(formName) {
      this.$refs[formName].resetFields();
      this.$refs.file.outerHTML = this.$refs.file.outerHTML;
    },
    back: function () {
      window.history.go(-1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid-manage {
  display: inline-block;
  position: absolute;
  height: 70%;
  width: 70%;
  margin-top: 0.5rem;
}

textarea {
  resize: none;
}

.user-info {
  height: 120%;
  width: 100%;
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

.user-photo img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}

fieldset {
  margin: 10px;
  border-color: #f2f2f5;
  display: block;
  padding: 0 0 0 20px;
  border-style: solid;
  border-width: 1px 0 0 0;
}

legend {
  font-weight: bold;
  color: #324157;
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
