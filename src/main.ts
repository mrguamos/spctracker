import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueCompositionAPI from '@vue/composition-api'
import vuetify from './plugins/vuetify'

Vue.use(VueCompositionAPI)
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
