import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

function loadView (view: string) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: loadView('LandingPage'),
  },
  {
    path: '/marks',
    component: loadView('MarksPage'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
