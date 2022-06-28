import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Room from '../views/Room.vue'
import JoinRoom from '../views/JoinRoom.vue'
import SinglePlayer from '../views/SinglePlayer.vue'
import Tutorial from '../views/Tutorial.vue'
// import Game from '../views/Game.vue'
import store from '../store'
// import 'cookie-store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login/:join?',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  // {
  //   path: '/game',
  //   name: 'game',
  //   component: Game
  // },
  {
    path: '/room/:id',
    name: 'room',
    component: Room,
  },
  {
    path: '/join/:id',
    name: 'join',
    component: JoinRoom,
  },
  {
    path: '/singleplayer',
    name: 'singleplayer',
    component: SinglePlayer,
    meta: { requiresAuth: false }
  },
  {
    path: '/tutorial',
    name: 'tutorial',
    component: Tutorial,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  console.log('from:',from)
  console.log('to:',to)
  
  if (from.name === 'login' && to.name === 'singleplayer' && await window.cookieStore.get('session_id')) {
    next({ name: 'home' })
    // console.log('called')
  }
  
  if (to.name === 'login' && !(await window.cookieStore.get('session_id'))) {
    // console.log('login page is okay')
    next() // login route is always okay (we could use the requires auth flag below). prevent a redirect loop
  } else if (to.name === 'login' && await window.cookieStore.get('session_id')) {
    // console.log('already logged in, go to home')
    next({ name: 'home' })
  } else if (to.meta && to.meta.requiresAuth === false) {
    // console.log('does not require auth')
    next() // requires auth is explicitly set to false
  } else if (store.getters.getLoginStatus || await window.cookieStore.get('session_id')) {
    // console.log('im logged in, carry on');
    next() // i'm logged in. carry on
  } else {
    if (!to.params && !to.params.id && to.name !== 'join') {
      next({ name: 'login' }) // always put your redirect as the default case
    } else {
      next({ name: 'login', params: { join: to.params.id } })
    }
  }
})

export default router
