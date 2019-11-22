import Api from '@/services/Api'
import store from '@/store'
import { LOADING_START, LOADING_END } from '@/mutationTypes'

const methods = {
    connect:            data                            => Api().post('/connection', data),
    disconnect:         ()                              => Api().delete('/connection'),
    generateObjectId:   ()                              => Api().get('/objectId'),
    loadDatabases:      ()                              => Api().get('/connection'),
    createDatabase:     form                            => Api().post('/dbs', form),
    dropDatabase:       dbname                          => Api().delete(`/dbs/${dbname}`),
    loadCollections:    dbname                          => Api().get(`/dbs/${dbname}`),
    createCollection:   (dbname, coll)                  => Api().post(`/dbs/${dbname}/colls`, coll),
    dropCollection:     (dbname, collname)              => Api().delete(`/dbs/${dbname}/colls/${collname}`),
    loadDocuments:      (dbname, collname)              => Api().get(`/dbs/${dbname}/colls/${collname}`),
    updateDocument:     (dbname, collname, document)    => Api().put(`/dbs/${dbname}/colls/${collname}`, { document }),
    deleteDocument:     (dbname, collname, id)          => Api().delete(`/dbs/${dbname}/colls/${collname}/${id}`),
}

export default (method, ...args) => new Promise((resolve, reject) => {

    if (methods[method]) {
        store.commit(LOADING_START)
        return methods[method](...args)
            .then(data => {
                resolve(data)
            })
            .catch(err => {
                reject(err)
            })
            .finally(() => {
                store.commit(LOADING_END)
            })
    } else {
        reject(new Error(`The мethod '${method}' hasn't been found`))
    }
})