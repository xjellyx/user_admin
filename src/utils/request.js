import axios from "axios";
import store from "../store";
import { MessageBox, Message } from 'element-ui'

const services = axios.create({
  baseURL: "/api/v1",
  timeout: 6000,
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


services.interceptors.response.use(response =>{
    const res = response.data
    if (res.meta.code !==20000){
        Message({
            message: res.meta.message || 'Error',
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(new Error(res.meta.message || 'Error'))
    }else {
        return res
    }
},error => {
    Message({
        message: error,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
})
