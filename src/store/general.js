import dbService from '@/services/dbService'
import { createHash } from '@/helpers'
import { 
    LOADING_START, LOADING_END, CONNECT, DISCONNECT, CONNECTED, 
    DISCONNECTED, UPDATE_HOST, UPDATE_PORT, CACHE_PUT 
} from '@/mutationTypes'
export default {
    state: {
        loading: false,
        connected: false,
        operations: 0,
        host: 'localhost',
        port: '27017',
        cache: new Map(),
    },
    getters: {
        loading: state => !!state.operations,
        operations: state => state.operations,
        connected: state => state.connected,
        host: state => state.host,
        port: state => state.port,
        cache: state => state.cache,
        hasInCache: state => key => state.cache.has( createHash(key) ),
        getFromCache: state => key => state.cache.get( createHash(key) ),
    },
    mutations: {
        [LOADING_START]: state => state.operations++,
        [LOADING_END]: state => state.operations--,
        [CONNECTED]: state => state.connected = true,
        [DISCONNECTED]: state => state.connected = false,
        [UPDATE_HOST]: (state, val) => state.host = val,
        [UPDATE_PORT]: (state, val) => state.port = val,
        [CACHE_PUT]: (state, data) => state.cache.set(createHash(data[0]), data[1]),
    },
    actions: {
        [CONNECT]({ getters, commit }) {
            return new Promise((resolve, reject) => {
                const { host, port } = getters
                dbService('connect', { host, port })
                .then(({ data }) => {
                    commit(CONNECTED)
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        [DISCONNECT]({ commit }) {
            return new Promise((resolve, reject) => {
                dbService('disconnect')
                .then(({ data }) => {
                    commit(DISCONNECTED)
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
    }
}