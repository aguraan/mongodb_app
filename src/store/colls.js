import dbService from '@/services/dbService'
import { LOADING_START, LOADING_END, LOAD_COLLECTIONS, ADD_COLLECTION, REMOVE_COLLECTION, 
         DROP_COLLECTION, CREATE_COLLECTION } from '@/mutationTypes'
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
        [LOAD_COLLECTIONS]({commit}, name) {
            return new Promise((resolve, reject) => {
                commit(LOADING_START)
                dbService.loadCollections(name)
                .then(({ data }) => {
                    commit(LOAD_COLLECTIONS, data)
                    commit(LOADING_END)
                    resolve(data)
                })
                .catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        },
        [CREATE_COLLECTION]({commit}, params) {
            const { dbname, coll } = params
            return new Promise((resolve, reject) => {
                commit(LOADING_START)
                dbService.createCollection(dbname, coll)
                .then(({ data }) => {
                    commit(LOADING_END)
                    commit(ADD_COLLECTION, data)
                    resolve(data)
                })
                .catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        },
        [DROP_COLLECTION]({commit, getters}, params) {
            const { dbname, coll } = params
            return new Promise((resolve, reject) => {
                commit(LOADING_START)
                dbService.dropCollection(dbname, coll.name)
                .then(({ data }) => {
                    const index = getters.colls.indexOf(coll)
                    commit(REMOVE_COLLECTION, index)
                    commit(LOADING_END)
                    resolve(data)
                }).catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        }
    }
}