import Vue from 'vue'
import Router from 'vue-router'
import Note from '@/components/Note'
import MyNote from '@/components/MyNote'
import Topic from '@/components/Topic'
import UpdatePwd from '@/components/UpdatePassword'
import Favorite from '@/components/Favorite'
import Collect from '@/components/Collect'
import FansMenu from '@/components/FansMenu'
import FriendsMenu from '@/components/FriendsMenu'
import Message from '@/components/Message'
import UserInfo from '@/components/UserInfo'

Vue.use(Router)

export default new Router({
  routes: [
    // 微博大厅
    {
      path: '/',
      name: 'note-list',
      component: Note
    },
    // 主题列表
    {
      path: '/topic/:weiboTopic',
      name: 'topic-list',
      component: Topic
    },
    // 个人主页
    {
      path: '/note',
      name: 'my-note',
      component: MyNote,
      meta: {
        username: localStorage.getItem('username')
      }
    },
    // 修改密码
    {
      path: '/updatepassword',
      name: 'update-password',
      component: UpdatePwd
    },
    // 我赞过的
    {
      path: '/favorite',
      name: 'favorite-menu',
      component: Favorite
    },
    // 我的收藏
    {
      path: '/collect',
      name: 'collect-menu',
      component: Collect
    },
    // 关注列表
    {
      path: '/friendsmenu',
      name: 'friends-menu',
      component: FriendsMenu
    },
    // 粉丝列表
    {
      path: '/fansmenu',
      name: 'fans-menu',
      component: FansMenu
    },
    // 消息列表
    {
      path: '/message',
      name: 'message-menu',
      component: Message
    },
    // 个人资料
    {
      path: '/userinfo',
      name: 'user-info',
      component: UserInfo
    }
  ]
})
