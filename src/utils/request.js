import axios from "axios";
import store from "../store";
import {resetRouter} from "../router";
import { MessageBox, Message } from 'element-ui'

const services = axios.create({
  baseURL: "/api/v1",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json"
  }
});

//
services.interceptors.request.use((config) => {
    const token = store.getters["user/token"];
    // console.log(config.baseURL)
    if (token) {
        config.headers["token"] = token
    }
    return config

},error => {
    return Promise.reject(error)
})

export default services;


services.interceptors.response.use( async response =>{
    const res = response.data
    switch (res.meta.code) {
        case 40001:
             await store.dispatch('user/resetToken')
            resetRouter()
            break
        case 20000:
            return res
        default:
            Message({
                message: res.meta.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(new Error(res.meta.message || 'Error'))
    }
},error => {
    Message({
        message: error,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
})
