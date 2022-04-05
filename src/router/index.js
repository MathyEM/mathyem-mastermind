import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from '../views/Game.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
  {
    path: '/room',
    name: 'room',
    component: Game,
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

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    if (store.getters.getLoginStatus) {
      next({ name: 'home' }) // if the login page is accessed when already logged in
      return
    }
    next() // login route is always  okay (we could use the requires auth flag below). prevent a redirect loop
  } else if (to.meta && to.meta.requiresAuth === false) {
    next() // requires auth is explicitly set to false
  } else if (store.getters.getLoginStatus) {
    next() // i'm logged in. carry on
  } else {
    next({ name: 'login' }) // always put your redirect as the default case
  }
})

export default router
