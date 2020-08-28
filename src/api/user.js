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
