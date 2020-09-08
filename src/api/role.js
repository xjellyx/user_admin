import request from '@/utils/request'

export function getRoleList() {
    return request({
        url:"/admin/getRoleList",
        method:"get"
    })
}

export function getRoleLevelList() {
    return request({
        url:"/admin/getRoleLevel",
        method:"get"
    })
}
export function editRole(data) {
    return request({
        url:"/admin/editRole",
        method:"put",
        data
    })
}

export function removeRole(id) {
    return request({
        url:"/admin/removeRole",
        method:"delete",
        params:{id:id}
    })
}

export function addRole(data) {
    return request({
        url:"/admin/addRole",
        method:"post",
        data
    })
}