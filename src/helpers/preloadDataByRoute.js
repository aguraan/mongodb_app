import store from '@/store'
import { LOAD_DOCUMENTS, LOAD_COLLECTIONS, LOAD_DATABASES } from '@/mutationTypes'

export default ({ fullPath, name, params }) => {
    const pages = {
        databases: {
            operation: LOAD_DATABASES,
            payload: { 
                cacheKey: fullPath
            }
        },
        collections: {
            operation: LOAD_COLLECTIONS,
            payload: { 
                cacheKey: fullPath,
                dbName: params.database
            }
        },
        documents: {
            operation: LOAD_DOCUMENTS,
            payload: { 
                cacheKey: fullPath,
                dbName: params.database,
                collName: params.collection
            }
        }
    }
    const data = store.getters.getFromCache(fullPath)

    if (pages[name]) {
        const { operation, payload } = pages[name]
        if (!data) return store.dispatch(operation, payload)
        store.commit(operation, data)
    }
    return Promise.resolve(data)
}