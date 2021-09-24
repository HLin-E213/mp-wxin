import Vue from 'vue';
import Vuex from 'vuex';

import state from './state.js';
import getters from './getters.js';
import mutations from './mutations.js';
import actions from './actions.js';

import server from './server/index.js';
import serviceinfo from './serviceinfo/index.js';
import users from './users/index.js';
import orders from './orders/index.js';

Vue.use(Vuex)

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules: {
        server,
        users,
        orders,
        serviceinfo
    }
})

export default store
