<template>
  <div id="update-password" class="update-password">
    <head_bar></head_bar>
    <left_bar></left_bar>
    <el-col :span="16" :offset="6" class="grid-manage">
      <fieldset>
        <legend> 修改密码 </legend>
      </fieldset>
      <el-form ref="form" :model="form" :rules="rules" class="update-pwd-form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" minlength="6"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保存</el-button>
          <el-button   @click="reset('form')">重置</el-button>
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
  name: 'update-password',
  created() {
    document.title = '修改密码 网宿微博';
  },
  mounted() {
    if (this.isLogin=='false') {
      this.$router.push({path: '/'});
    }
  },
  data () {
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
    return {
      form: {
        username: localStorage.getItem('username'),
        password: ''
      },
      rules: {
        password: [{
          validator: checkPass, trigger: 'change'
        }]
      },
      isLogin: localStorage.getItem('isLogin')
    }
  },
  components: {
    head_bar,
    foot_bar,
    left_bar
  },
  methods: {
    onSubmit: function(formName) {
      var _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            userId: localStorage.getItem('userId'),
            password: _this.form.password
          };
          _this.$ajax({
            method: 'get',
            url: _this.URL_PREFIX + '/weibo/front/account/updatepwd',
            params: data
          }).then(function(response) {
            if (response.data.code == 200) {
              _this.$message({
                showClose: true,
                message: response.data.description,
                type: 'success'
              });
              localStorage.removeItem('username');
              localStorage.removeItem('userHead');
              localStorage.removeItem('userUnRead');
              localStorage.removeItem('userId');
              localStorage.setItem('isLogin','false');
              _this.$router.push({ path: '/' });
              _this.$router.go(0);
            }
            _this.$message({
              showClose: true,
              message: response.data.description,
              type: 'error'
            });
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
    },
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
.update-password {
  height: 120%;
  width: 100%;
}
h4 {
  margin: 0 auto;
}
.update-pwd-form {
  margin: 2rem 1rem 0 1rem;
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
fieldset {

    margin:10px;
    border-color:#f2f2f5;
    display: block;
    padding: 0 0 0 20px;
    border-style: solid;
    border-width: 1px 0 0 0;
}
legend {
    font-weight: bold;
    color:#324157;
}

</style>
