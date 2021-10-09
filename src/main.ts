import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueCompositionAPI from '@vue/composition-api'
import vuetify from './plugins/vuetify'
import VueGtag from 'vue-gtag'

Vue.use(VueGtag, {
  config: { id: 'UA-206693173-1', params: { send_page_view: true } },
})
Vue.use(VueCompositionAPI)
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
