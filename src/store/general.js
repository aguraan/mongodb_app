import dbService from '@/services/dbService'
import { LOADING_START, LOADING_END, CONNECT, DISCONNECT, CONNECTED, DISCONNECTED, UPDATE_HOST, UPDATE_PORT, LOAD_DATABASES,
         ADD_DATABASE, REMOVE_DATABASE, CREATE_DATABASE, DROP_DATABASE } from '@/mutationTypes'
export default {
    state: {
        loading: false,
        connected: false,
        host: 'localhost',
        port: '27017',
        databases: []
    },
    getters: {
        loading: state => state.loading,
        connected: state => state.connected,
        host: state => state.host,
        port: state => state.port,
        databases: state => state.databases
    },
    mutations: {
        [LOADING_START]: state => state.loading = true,
        [LOADING_END]: state => state.loading = false,
        [CONNECTED]: state => state.connected = true,
        [DISCONNECTED]: state => state.connected = false,
        [UPDATE_HOST]: (state, val) => state.host = val,
        [UPDATE_PORT]: (state, val) => state.port = val,
        [LOAD_DATABASES]: (state, val) => state.databases = val,
        [ADD_DATABASE]: (state, val) => state.databases.push(val),
        [REMOVE_DATABASE]: (state, index) => state.databases.splice(index, 1)
    },
    actions: {
        [CONNECT]({getters, commit}) {
            return new Promise((resolve, reject) => {
                const { host, port } = getters
                commit(LOADING_START)
                dbService.connect({ host, port })
                .then(({ data }) => {
                    commit(LOADING_END)
                    commit(CONNECTED)
                    commit(LOAD_DATABASES, data)
                    resolve(data)
                })
                .catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
                
            })
        },
        [DISCONNECT]({ commit }) {
            return new Promise((resolve, reject) => {
                commit(LOADING_START)
                dbService.disconnect()
                .then(({ data }) => {
                    commit(DISCONNECTED)
                    commit(LOADING_END)
                    resolve(data)
                })
                .catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        },
        [CREATE_DATABASE]({commit}, form) {
            return new Promise((resolve, reject) => {
                commit(LOADING_START)
                dbService.createDatabase(form)
                .then(({ data }) => {
                    commit(ADD_DATABASE, data)
                    commit(LOADING_END)
                    resolve(data)
                })
                .catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        },
        [DROP_DATABASE]({commit, getters}, db) {
            return new Promise((resolve, reject) => {
                commit(LOADING_START)
                dbService.dropDatabase(db.db)
                .then(({ data }) => {
                    const index = getters.databases.indexOf(db)
                    commit(REMOVE_DATABASE, index)
                    commit(LOADING_END)
                    resolve(data)
                }).catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        },
    }
}