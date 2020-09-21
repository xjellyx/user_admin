import {getApiListAll} from "../../api/api"

const state = {
    apiList: []
}

const mutations = {
    SET_API_LIST(state, data) {
        state.apiList = data
    }
}

const actions = {
    async setApiList({commit}){
        const res = await getApiListAll()
        commit("SET_API_LIST",res.data)
    }
}

const getters = {
    apiList: state => state.apiList
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
