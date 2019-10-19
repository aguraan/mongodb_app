import dbService from '@/services/dbService'
import { LOADING_START, LOADING_END, LOAD_DOCUMENTS, GET_OBJECT_ID, UPDATE_DOCUMENT, DELETE_DOCUMENT } from '@/mutationTypes'
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
                commit(LOADING_START)
                dbService.generateObjectId()
                .then(({ data }) => {
                    commit(GET_OBJECT_ID, data)
                    commit(LOADING_END)
                    resolve(data)
                })
                .catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        },
        [LOAD_DOCUMENTS]({ commit }, params) {
            const { dbname, collname } = params
            return new Promise((resolve, reject) => {
                commit(LOADING_START)
                dbService.loadDocuments(dbname, collname)
                .then(({ data }) => {
                    commit(LOAD_DOCUMENTS, data)
                    commit(LOADING_END)
                    resolve(data)
                })
                .catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        },
        [UPDATE_DOCUMENT]({ commit }, params) {
            const { dbname, collname, editedIndex} = params
            return new Promise((resolve, reject) => {
                commit(LOADING_START)
                dbService.updateDocument(dbname, collname, params)
                .then(({ data }) => {
                    commit(UPDATE_DOCUMENT, { editedIndex, data })
                    commit(LOADING_END)
                    resolve(data)
                })
                .catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        },
        [DELETE_DOCUMENT]({ commit, getters }, params) {
            const { dbname, collname, doc } = params
            return new Promise((resolve, reject) => {
                commit(LOADING_START)
                dbService.deleteDocument(dbname, collname, doc._id)
                .then(({ data }) => {
                    const index = getters.docs.indexOf(doc)
                    commit(DELETE_DOCUMENT, index)
                    commit(LOADING_END)
                    resolve(data)
                })
                .catch(err => {
                    commit(LOADING_END)
                    reject(err)
                })
            })
        }
    }   
}