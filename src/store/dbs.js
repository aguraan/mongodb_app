import dbService from '@/services/dbService'
import { 
    LOAD_DATABASES, ADD_DATABASE, REMOVE_DATABASE, 
    CREATE_DATABASE, DROP_DATABASE, CACHE_PUT 
} from '@/mutationTypes'
export default {
    state: {
        databases: [],
    },
    getters: {
        databases: state => state.databases
    },
    mutations: {
        [LOAD_DATABASES]: (state, val) => state.databases = val,
        [ADD_DATABASE]: (state, val) => state.databases.push(val),
        [REMOVE_DATABASE]: (state, index) => state.databases.splice(index, 1),
    },
    actions: {
        [LOAD_DATABASES]({ commit }, { cacheKey }) {
            return new Promise((resolve, reject) => {
                dbService('loadDatabases')
                .then(({ data }) => {
                    commit(LOAD_DATABASES, data)
                    commit(CACHE_PUT, [cacheKey, data])
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        [CREATE_DATABASE]({ commit }, form) {
            return new Promise((resolve, reject) => {
                dbService('createDatabase', form)
                .then(({ data }) => {
                    commit(ADD_DATABASE, data)
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },

        [DROP_DATABASE]({ commit, getters }, db) {
            return new Promise((resolve, reject) => {
                dbService('dropDatabase', db.db)
                .then(({ data }) => {
                    const index = getters.databases.indexOf(db)
                    commit(REMOVE_DATABASE, index)
                    resolve(data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
    }
}