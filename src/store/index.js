import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import general from './general'
import dbs from './dbs'
import colls from './colls'
import docs from './docs'

export default new Vuex.Store({
    modules: {
        general,
        dbs,
        colls,
        docs
    },
    strict: process.env.NODE_ENV !== 'production', // disable in production mode !!!
})