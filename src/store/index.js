import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import general from './general'
import colls from './colls'
import docs from './docs'

export default new Vuex.Store({
    modules: {
        general,
        colls,
        docs
    },
    strict: process.env.NODE_ENV !== 'production', // disable in production mode !!!
})