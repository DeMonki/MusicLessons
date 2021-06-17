import Vue from 'vue'
import App from './App.vue'
import TurnOffAutocomplete from 'vue-turn-off-autocomplete';

import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue'
import router from './router'
import store from './store'


// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(BootstrapVueIcons)
Vue.use(TurnOffAutocomplete)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
