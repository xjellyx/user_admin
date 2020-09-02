import request from "../utils/request"

export function getApiList(data) {
    return request({
        method:"get",
        url:"/admin/getApiGroupList",
        params: data
    })
}

export function removeApi(id) {
    return request({
        method:'delete',
        url:'/admin/removeApiGroup',
        params:{id:id}
    })
}

export function addApi(data){
    return request({
        method:'post',
        url:'/admin/addApiGroup',
        data
    })
}

export function editApi(data) {
    return request({
        method:'put',
        url:'/admin/editApiGroup',
        data
    })
}