import Vue from 'vue'
import VueRouter from 'vue-router'

import ConnectToHost from '@/pages/ConnectToHost.vue'
import Databases from '@/pages/Databases.vue'
import Collections from '@/pages/Collections.vue'
import Documents from '@/pages/Documents.vue'

import store from '@/store'
import { CONNECT } from '@/mutationTypes'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'connectToHost',
            component: ConnectToHost
        },
        {
            path: '/databases',
            name: 'databases',
            component: Databases
        },
        {
            path: '/databases/:database',
            name: 'collections',
            component: Collections
        },
        {
            path: '/databases/:database/:collection',
            name: 'documents',
            component: Documents
        }

    ]
})

router.beforeEach((to, from, next) => {
    if (!store.getters.connected && to.fullPath !== '/') {
        store.dispatch(CONNECT)
        .then(() => {
            next()
        })
    }
    next()
})

export default router