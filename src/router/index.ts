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
  {
    path: '*',
    component: loadView('PageNotFound'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  // redirect to landing page if not logged in and trying to access a restricted page
  const publicPages = ['/']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user-info')

  if (authRequired && !loggedIn) {
    return next('/')
  }

  // redirect to marks if logged in (in testiong purposes)
  if (loggedIn && to.path !== '/marks') {
    return next('/marks')
  }

  next()
})

export default router
