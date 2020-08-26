import { login, logout, getInfo } from "@/api/user";
import Vue from "vue";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router/index";
import router from "@/router/index"

const state = {
  token: getToken(),
  username: "",
  avatar: "",
  userInfo: {}
};

const getters = {
  token: state => state.token,
  username: state => state.username,
  avatar: state => state.avatar,
  userInfo: state => state.userInfo
};
const mutations = {
  setToken(state, token) {
    state.token = token;
    setToken(token);
  },
  setUsername(state, name) {
    state.username = name;
  },
  setAvatar(state, avatar) {
    state.avatar = avatar;
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  }
};

const actions = {
  // gin
  async login({ commit }, userForm) {
    const { data } = await login(userForm);
    const token = data["token"];
    if (token) {
      commit("setToken", token);
      const redirect = router.history.current.query.redirect
      if (redirect) {
        router.push({ path: redirect })
      } else {
        router.push({ path: '/layout/dashboard' })
      }
    } else {
      Vue.prototype.message({
        message: data.meta.message,
        type: "error",
        duration: 1000
      });
    }
  },
  // get user info
  async getUserInfo({ commit }) {
    const { data } = await getInfo();
    if (!data) {
      Vue.prototype.message({
        message: "login failed, please login again",
        type: "error"
      });
      return false;
    }
    //
    if (data.username) {
      commit("setUsername", data.username);
    }
    commit("setUserInfo", data);
  },

  async logout({ dispatch }) {
    await logout();
    await dispatch("resetToken");
    await resetRouter();
  },
  resetToken({ commit }) {
    commit("setToken", "");
    removeToken();
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
