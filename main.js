import Vue from 'vue'
import App from './App'

import store from './store'

import { ISIPX, ISNOTCHSCREEN } from './config/constant';

Vue.config.productionTip = false

Vue.prototype.$store = store




Vue.prototype.$isIPX = ISIPX;
Vue.prototype.$isNotchScreen = ISNOTCHSCREEN;

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
