import dbService from '@/services/dbService'
import { LOAD_DOCUMENTS, GET_OBJECT_ID, UPDATE_DOCUMENT, DELETE_DOCUMENT, CACHE_PUT } from '@/mutationTypes'
export default {
    state: {
        docs: [],
        objectId: ''
    },
    getters: {
        docs: state => state.docs,
        objectId: state => state.objectId
    },
    mutations: {
        [GET_OBJECT_ID]: (state, val) => state.objectId = val,
        [LOAD_DOCUMENTS]: (state, val) => state.docs = val,
        [UPDATE_DOCUMENT]: (state, { editedIndex, data }) => state.docs.splice(editedIndex, 1, data.value),
        [DELETE_DOCUMENT]: (state, index) => state.docs.splice(index, 1)
    },
    actions: {
        [GET_OBJECT_ID]({ commit }) {
            return new Promise((resolve, reject) => {
                dbService('generateObjectId')
                .then(({ data }) => {
                    commit(GET_OBJECT_ID, data)
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        [LOAD_DOCUMENTS]({ commit }, { cacheKey, dbName, collName }) {
            return new Promise((resolve, reject) => {
                dbService('loadDocuments', dbName, collName)
                .then(({ data }) => {
                    commit(LOAD_DOCUMENTS, data)
                    commit(CACHE_PUT, [cacheKey, data])
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        [UPDATE_DOCUMENT]({ commit }, payload) {
            return new Promise((resolve, reject) => {
                const { dbname, collname, editedIndex, document } = payload
                dbService('updateDocument', dbname, collname, document)
                .then(({ data }) => {
                    commit(UPDATE_DOCUMENT, { editedIndex, data })
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        },
        [DELETE_DOCUMENT]({ commit, getters }, payload) {
            return new Promise((resolve, reject) => {
                const { dbname, collname, document } = payload
                dbService('deleteDocument', dbname, collname, document._id)
                .then(({ data }) => {
                    const index = getters.docs.indexOf(document)
                    commit(DELETE_DOCUMENT, index)
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
            })
        }
    }   
}