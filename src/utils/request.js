import Vue from "vue";
import axios from "axios";
import router from "../router";
import store from "../store";

const services = axios.create({
  url: "http://127.0.0.1:8085/api/v1",
  timeout: 6000,
  headers: {
    "Content-Type": "application/json"
  }
});

//
services.interceptors.request.use((config) => {
    if (store.getters["token"]) {
        config.headers["token"] = store.getters["token"]
    }

})

export default services;
