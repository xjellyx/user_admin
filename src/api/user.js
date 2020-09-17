import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/admin/login",
    method: "post",
    data
  });
}

export function getInfo(token) {
  return request({
    url: "/user/profile",
    method: "get",
    params: { token }
  });
}

export function logout() {
  return request({
    url: "/admin/logout",
    method: "post"
  });
}

export function changeLoginPwd(data) {
  return request({
    url:"/user/modifyLoginPwd",
    method:'put',
    data
  })
}

export function getUserList(data) {
  return request({
    url:"/admin/listUser",
    method:'get',
    params:data
  })
}

export function getUserTotal() {
  return request({
    url:"/admin/userTotal",
    method:'get'
  })
}


export function getUserCount() {
  return request({
    method:"get",
    url:"/admin/userTotal",
  })
}

export function delUser(uid) {
  return request({
    url:"/admin/deleteUser",
    method:'delete',
    params: {uid:uid}
  })
}

export function editUserInfo(data) {
  return request({
    url:"/admin/editUser",
    method:'put',
    data
  })
}
export function getUserKV() {
  return request({
    url:"/admin/getUserKV",
    method:'get',
  })
}

export function addUser(data) {
  return request({
    url:"/admin/addUser",
    method:'post',
    data
  })
}
