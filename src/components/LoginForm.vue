<template>
  <div class="login-form">
    <el-dialog :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录" name="first">
          <el-form label-width="80px" :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item label="用户名：" prop="loginname">
              <el-input v-model="loginForm.loginname" auto-complete="off" placeholder="请输入手机号码或电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :plain="true" type="primary" @click="login('loginForm')">登录</el-button>
              <el-button @click="back">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="second">
          <el-form ref="form" :model="form" :rules="rules" rel="form" class="update-pwd-form" label-width="80px">
            <el-form-item label="用户名：" prop="loginname">
              <el-input v-model="form.loginname" auto-complete="off" placeholder="请输入您的手机号码或电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="昵称：" prop="username">
              <el-input type="text" v-model="form.username" auto-complete="off" placeholder="请输入您的昵称(不包含特殊字符)"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input type="password" v-model="form.password" auto-complete="off" placeholder="密码由8~16位的字符和数字组成"></el-input>
            </el-form-item>
            <el-form-item label="验证码：" prop="code">
              <div class="code" id="checkCode" @click="createCode">{{checkcode}}</div>
              <a href="#" @click="createCode">看不清换一张</a>
              <el-input type="text" v-model="form.code" auto-complete="off" placeholder="请输入验证码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')">注册</el-button>
              <el-button @click="back">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import head_bar from './HeadBar.vue'
import foot_bar from './Foot.vue'

export default {
  // 登录注册组件
  name: 'login-form',
  created() {
    this.createCode();
  },
  data() {
    var that = this;
    // 用户名、昵称以及密码正则校验
    var checkLoginname = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入用户名'));
      } else {
        var reMobile = /^1\d{10}$/;
        var reEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        setTimeout(() => {
          if (!reMobile.test(value) && !reEmail.test(value)) {
            return callback(new Error('请输入正确的手机账号或邮箱地址'));
          } else if (reEmail.test(value) && value.length > 25) {
            callback(new Error('邮箱地址需要在25位以内'));
          } else {
            callback();
          }
        }, 1000);
      }
    };
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'));
      } else {
        var rePass = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
        setTimeout(() => {
          if (value.length < 8 || value.length > 16) {
            callback(new Error('密码需在8~16位之间'))
          } else {
            if (!rePass.test(value)) {
              return callback(new Error('密码需由至少1个字符和数字组成'));
            } else {
              callback();
            }
          }
        }, 1000);
      }
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
    var validateCode = function (rule, value, callback) {
      var checkCode = that.checkcode.toUpperCase();
      var Value = value.toUpperCase();
      if (value === '') {
        return callback(new Error('请输入验证码'));
      } else {
        setTimeout(() => {
          if (Value != checkCode) {
            callback(new Error('验证码输入有误'));
          }
          else {
            callback();
          }
        }, 1000)
      }

    }
    return {
      checkcode:'',
      activeName: 'first',
      dialogFormVisible: this.dialogFlag,
      loginForm: {
        loginname: '',
        password: ''
      },
      form: {
        loginname: '',
        username: '',
        password: '',
        code: ''
      },
      rules: {
        loginname: [{
          validator: checkLoginname, trigger: 'change'
        }],
        username: [{
          validator: checkName, trigger: 'change'
        }],
        password: [{
          validator: checkPass, trigger: 'change'
        }],
        code: [{
          validator: validateCode, trigger: 'change'
        }]
      }
    }
  },
  props: {
    dialogFlag: Boolean
  },
  watch: {
    dialogFlag: function () {
      this.dialogFormVisible = this.dialogFlag;
    },
    dialogFormVisible: function () {
      this.$emit('dialogToggle', this.dialogFormVisible);
    }
  },
  components: {
    head_bar,
    foot_bar
  },
  methods: {
    login: function (formName) {
      var _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            loginname: _this.loginForm.loginname,
            password: _this.loginForm.password
          }
          _this.$ajax({
            method: 'post',
            url: _this.URL_PREFIX + '/weibo/front/account/login',
            params: data
          }).then(function (response) {
            if (response.data.code == 200) {
              _this.$message({
                showClose: true,
                message: response.data.description,
                type: 'success'
              });
              _this.activeName = 'first';
              _this.dialogFormVisible = false;
              _this.$refs[formName].resetFields();
              var parsedata = JSON.parse(response.data.data);
              localStorage.setItem('username', parsedata.userName);
              localStorage.setItem('userId', parsedata.userId);
              localStorage.setItem('userHead', parsedata.userHead);
              localStorage.setItem('userUnRead', parsedata.userUnRead);
              localStorage.setItem('loginDate', new Date());
              localStorage.setItem('isLogin', 'true');
              _this.$ajax({
                method: 'get',
                url: _this.URL_PREFIX + '/weibo/front/message/getmessage',
                params: {
                  page: 1,
                  acceptUserId: localStorage.getItem('userId'),
                  rows: 100
                }
              }).then(function(response) {
                if (response.data.code == 200) {
                  var parseData = JSON.parse(response.data.data);
                  for (var i = 1;i < parseData.rows.length;i++) {
                    if (parseData.rows[i].messageUnRead == 1) {
                      localStorage.setItem('messageUnRead', true);
                      setTimeout(function() {
                        _this.$router.go({ path: '/' });
                      }, 500);
                      break;
                    }
                  }
                  setTimeout(function() {
                    _this.$router.go({ path: '/' });
                  }, 500);
                }
                else {
                  setTimeout(function() {
                    _this.$router.go({ path: '/' });
                  }, 500);
                }
              })
            }
            else {
              _this.$message({
                showClose: true,
                message: response.data.description,
                type: 'error'
              });
            }
          });
        } else {
          _this.$message({
            showClose: true,
            message: '请根据提示填写',
          });
          return false;
        }
      });
    },
    onSubmit: function (formName) {
      var _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$ajax({
            method: 'post',
            url: _this.URL_PREFIX + '/weibo/front/account/register',
            params: {
              loginname: _this.form.loginname,
              username: _this.form.username,
              password: _this.form.password
            }
          }).then(function (response) {
            if (response.data.code == 200) {
              _this.$message({
                showClose: true,
                message: response.data.description,
                type: 'success'
              });
              _this.activeName = 'first';
              _this.dialogFormVisible = false;
              _this.$refs[formName].resetFields();
            }
            else {
              _this.$message({
                showClose: true,
                message: response.data.description,
                type: 'error'
              });
            }
          })
        }
        else {
          _this.createCode();
          _this.$message({
            showClose: true,
            message: '请根据提示填写',
            type: 'warning'
          });
        }
      })
    },
    back: function () {
      this.dialogFormVisible = false;
      var formName1 = 'loginForm';
      var formName2 = 'form';
      this.$refs[formName1].resetFields();
      this.$refs[formName2].resetFields();
    },
    // 生成简易验证码
    createCode: function() {
      this.checkcode = '';
      var codeLength = 4;
      var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
      for (var i = 0; i < codeLength; i++) {
        var charNum = Math.floor(Math.random() * 52);
        this.checkcode += codeChars[charNum];
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-form {
  height: 100%;
  width: 100%;
}

.login-main {
  height: calc(100% - 60px - 5rem);
  width: 100%;
}

.panel {
  width: 90%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* border: 1px solid #20A0FF; */
}

.login {
  height: 100%;
}

.login>.container {
  height: calc(100% + 60px);
}

.login-content {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.btn {
  float: left;
}
.caption {
  margin-bottom: 1rem;
  text-align: center;
}
.code
{
  background: #eee;
  font-family:Arial;
  font-style:italic;
  color:blue;
  font-size:30px;
  border:0;
  padding:2px 3px;
  letter-spacing:3px;
  font-weight:bolder;
  float:left;
  cursor:pointer;
  width:150px;
  text-align:center;
  vertical-align:middle;
  margin: 0 10px 10px 0;
}
</style>
