import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import {getProjectSettings} from "@/api/config"
const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  settings: {},
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  setSettings(state,settings){
    state.settings = settings
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  async getSettings({commit}){
    const res = await getProjectSettings()
    commit("setSettings",res.data)
  }
}

const getters = {
  showSettings: state => state.showSettings,
  needTagsView: state => state.tagsView,
  fixedHeader: state => state.fixedHeader,
  settings: state => state.settings
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

