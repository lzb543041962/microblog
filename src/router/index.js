import Vue from 'vue'
import Router from 'vue-router'
import Note from '@/components/Note'
import MyNote from '@/components/MyNote'
import Topic from '@/components/Topic'
import LoginForm from '@/components/LoginForm'
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
    {
      path: '/',
      name: 'note-list',
      component: Note
    },
    {
      path: '/topic/:weiboTopic',
      name: 'topic-list',
      component: Topic
    },
    {
      path: '/note',
      name: 'my-note',
      component: MyNote,
      meta: {
        username: localStorage.getItem('username')
      }
    },
    {
      path: '/login',
      name: 'LoginForm',
      component: LoginForm
    },
    {
      path: '/updatepassword',
      name: 'update-password',
      component: UpdatePwd
    },
    {
      path: '/favorite',
      name: 'favorite-menu',
      component: Favorite
    },
    {
      path: '/collect',
      name: 'collect-menu',
      component: Collect
    },
    {
      path: '/friendsmenu',
      name: 'friends-menu',
      component: FriendsMenu
    },
    {
      path: '/fansmenu',
      name: 'fans-menu',
      component: FansMenu
    },
    {
      path: '/message',
      name: 'message-menu',
      component: Message
    },
    {
      path: '/userinfo',
      name: 'user-info',
      component: UserInfo
    }
  ]
})
