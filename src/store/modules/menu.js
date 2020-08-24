import {setMenuList,getMenuList} from "../../api/menu";
import Vue from "vue";

const  state = {
    menuList: []
}

const getter = {
    menuList: state => state.menuList
}

const mutation = {
    setMenu(state,list) {
        state.menuList = list
    }
}

const actions  ={
    async getMenuList() {
       const {data}  = await getMenuList()

    }
}