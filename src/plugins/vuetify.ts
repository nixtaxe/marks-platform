import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import ru from 'vuetify/src/locale/ru'
import light from './lightTheme'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { ru },
    current: 'ru',
  },
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    // @ts-ignore
    themes: { light },
  },
})
