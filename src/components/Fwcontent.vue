<template>
  <div class="fw-content">
    <div class="fw-meta" v-if="item.weiboAlive==1 || item.messageId!=undefined">
      <div class="avatar">
        <router-link :to="{path:'/note',query: {id: item.userId}}">
          <img alt="" :src="URL_PREFIX + item.userHead" class="avatar-60 photo" height="30" width="30">
        </router-link>
      </div>
      <div class="caption">
        <h5 class="author">
          <span class="fn"><router-link :to="{path:'/note',query: {id: item.userId}}" rel="external nofollow" class="url">{{item.userName}}</router-link></span>
              - <span class="comment-reply-link" href="#respond">发布</span>
        </h5>
        <p class="date">
          {{item.messageId==undefined?formatDate(item.weiboTime * 1000):item.weiboTime}}
        </p>
      </div>
    </div>

    <div class="fw-body" v-if="item.weiboAlive==1 || item.messageId!=undefined">
      <p v-if="item.weiboTopic"><router-link :to="'/topic/' + item.weiboTopic" class="theme-a">#{{item.weiboTopic}}# </router-link></p>
      <comment-part :originContent="item.weiboContent"></comment-part>
      <p><router-link :to="{path:'/note',query: {username: at}}" v-if="at!=''" v-for="at in item.weiboAts" v-bind:key="at" class="at-a">@{{at}} </router-link></p>
      <div class="fw-picture" v-if="item.weiboPhoto != ''">
        <div class="media_box">
          <ul>
            <li>
              <img :src="URL_PREFIX + item.weiboPhoto">
            </li>
          </ul>
        </div>
      </div>
      <div class="fw-hot">
        <el-breadcrumb separator="|">
          <el-breadcrumb-item><span>收藏{{item.weiboCollect}}</span></el-breadcrumb-item>
          <el-breadcrumb-item><span>点赞{{item.weiboLike}}</span></el-breadcrumb-item>
          <el-breadcrumb-item><span>评论{{item.weiboComment}}</span></el-breadcrumb-item>
          <el-breadcrumb-item><span>转发{{item.weiboForward}}</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="fw-body deleted" v-if="item.weiboAlive==0 && item.messageId==undefined">
      <p class="deleted-weibo">原微博已被删除</p>
    </div>

  </div>
</template>

<script>
import Comment from './Comment.vue'
import {formatDate} from '@/filter/formatDate.js';

export default {
  name: 'fw-content',
  data () {
    return {
      item: this.data,
      imageUrl: 'http://wx3.sinaimg.cn/mw690/8235fbe6gy1fi3k0zfa5bj20y81f47wi.jpg',
    }
  },
  props: {
    data: Object
  },
  watch: {
    data: function() {
      this.item = this.data;
    }
  },
  components: {
    'comment-part': Comment,
  },
  methods: {
    formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fw-content {
  padding: 1rem 0;
  background-color: #f2f2f5;
}
.fw-meta {
  padding-left: 1rem;
	display: inline-block;
	width: calc(100% - 65px);
}
.fw-meta .avatar,.caption {
  display: inline-block;
  font-size: 12px;
}
.fw-meta .avatar img {
  border-radius: 50%;
}
.fw-meta .caption h5,p {
  margin: 0;
}
.fw-body {
  padding: 0.2rem 0.3rem;
  font-size: 12px;
  word-break:break-all;
  letter-spacing: 1px;
}
.fw-body p {
  margin: 0;
  padding-left: 1rem;
  display: inline-block;
}
.fw-body p a {
  padding-left: 0;
}

.fw-picture {
  display: inline-block;
  width: calc(100% - 65px);
}
.fw-picture .media_box {
  width: 100%;
  min-width: 450px;
}
.fw-picture ul li {
  width: 120px;
  height: 90px;
  list-style: none;
  float: left;
  overflow: hidden;
}
.fw-picture ul li img {
  width: 120px;
  height: auto;
  display: inline-block;
  vertical-align: top;
}

.at-a {
  color: #2c3e50;
}
.at-a:hover {
  color: #1D8CE0;
}
.at-a,.theme-a {
  cursor: pointer;
  padding-left: 1rem;
}
.theme-a {
  color: #eb7350;
}

.fw-hot {
  float: right;
  margin-right: 1rem;
}
.fw-hot .el-breadcrumb {
}

.fw-body.deleted {
  text-align: center;
}
.deleted-weibo {
  display: block;
  margin: 2rem 2rem!important;
  font-size: 16px;
  font-family: SimHei;
}
</style>
