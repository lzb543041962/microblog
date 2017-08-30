# test-project

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

### 预览所有页面说明
# 通过npm run dev启动项目后，在浏览器console控制台运行以下语句初始化用户参数：
localStorage.setItem('loginDate', new Date());
localStorage.setItem('username', 'Mistake');
localStorage.setItem('userId', 1);
localStorage.setItem('isLogin', 'true');
# 之后就可以查看基本的界面效果


### 项目说明
1、类微博系统，包括用户登录设置、关注粉丝设置、微博应用设置、微博系统管理等功能模块，可以进行发表微博、评论微博、转发微博、收藏微博等，点赞收藏评论转发会以消息通知的形式通知用户<br>
2、项目使用了vuecli ＋ vue-router<br>
3、UI框架使用饿了么的element-ui框架<br>
4、使用axios，不使用vue-resource，因其貌似已停止维护<br>
5、因为系统本身不大，所以未采用vuex进行状态管理，只使用了localStorage<br>

### 运行项目需知
1、因为没有接口，若想要查看项目可以通过rap、faker.js等方式模拟数据，请求的地址修改在src/main.js下有全局变量声明
2、之后有时间会将模拟数据发布上来
