import Api from '@/services/Api'

export default {
    generateObjectId() {
        return Api().get('/objectId')
    },
    connect(data) {
        return Api().post('/connection', data)
    },
    disconnect() {
        return Api().delete('/connection')
    },
    createDatabase(form) {
        return Api().post('/dbs', form)
    },
    dropDatabase(dbname) {
        return Api().delete(`/dbs/${dbname}`)
    },
    loadCollections(dbname) {
        return Api().get(`/dbs/${dbname}`)
    },
    createCollection(dbname, coll) {
        return Api().post(`/dbs/${dbname}/colls`, coll)
    },
    dropCollection(dbname, collname) {
        return Api().delete(`/dbs/${dbname}/colls/${collname}`)
    },
    loadDocuments(dbname, collname) {
        return Api().get(`/dbs/${dbname}/colls/${collname}`)
    },
    updateDocument(dbname, collname, params) {
        return Api().put(`/dbs/${dbname}/colls/${collname}`, params)
    },
    deleteDocument(dbname, collname, id) {
        return Api().delete(`/dbs/${dbname}/colls/${collname}/${id}`)
    }
}