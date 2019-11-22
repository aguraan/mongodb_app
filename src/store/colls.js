import dbService from '@/services/dbService'
import { LOAD_COLLECTIONS, ADD_COLLECTION, REMOVE_COLLECTION, 
         DROP_COLLECTION, CREATE_COLLECTION, CACHE_PUT } from '@/mutationTypes'
export default {
    state: {
        colls: [],
    },
    getters: {
        colls: state => state.colls,
    },
    mutations: {
        [LOAD_COLLECTIONS]: (state, val) => state.colls = val,
        [ADD_COLLECTION]: (state, val) => state.colls.push(val),
        [REMOVE_COLLECTION]: (state, index) => state.colls.splice(index, 1),
    },
    actions: {
        [LOAD_COLLECTIONS]({ commit }, { cacheKey, dbName }) {
            return new Promise((resolve, reject) => {
                dbService('loadCollections', dbName)
                .then(({ data }) => {
                    commit(LOAD_COLLECTIONS, data)
                    commit(CACHE_PUT, [cacheKey, data])
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        [CREATE_COLLECTION]({commit}, { dbname, coll }) {
            return new Promise((resolve, reject) => {
                dbService('createCollection', dbname, coll)
                .then(({ data }) => {
                    commit(ADD_COLLECTION, data)
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        [DROP_COLLECTION]({commit, getters}, { dbname, coll }) {
            return new Promise((resolve, reject) => {
                dbService('dropCollection', dbname, coll.name)
                .then(({ data }) => {
                    const index = getters.colls.indexOf(coll)
                    commit(REMOVE_COLLECTION, index)
                    resolve(data)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}