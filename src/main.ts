import 'reflect-metadata'
import '@babel/polyfill'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import buildDependencyContainer from '@/app.container'
import VueCompositionApi from '@vue/composition-api'

class AppBootstrap {
  constructor () {
    this.loadDependencyContainer()
    this.loadVueApp()
  }

  private loadDependencyContainer (): void {
    buildDependencyContainer()
  }

  private loadVueApp (): void {
    Vue.config.productionTip = false

    Vue.use(VueCompositionApi)

    new Vue({
      router,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app')
  }
}

new AppBootstrap()
