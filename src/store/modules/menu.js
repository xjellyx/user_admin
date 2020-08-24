import {setMenuList,getMenuList} from "../../api/menu";
import Vue from "vue";

const  state = {
    menuList: []
}

const getters = {
    menuList: state => state.menuList
}

const mutations = {
    setMenu(state,list) {
        state.menuList = list
    }
}

const actions  ={
    async getMenuList() {
       const {data}  = await getMenuList()

    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
