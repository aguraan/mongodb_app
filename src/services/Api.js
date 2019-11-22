import Vue from 'vue'
export default () => {
    return Vue.axios.create({
        baseURL: 'http://localhost:8082/api/'
    })
}

