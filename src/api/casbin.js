import request from '@/utils/request'

export function addRoleApi(data){
    return request({
        url:"/admin/addRoleApiPerm",
        method:'post',
        data
    })
}

export function removeRoleApi(data){
    return request({
        url:"/admin/removeRoleApiPerm",
        method:'delete',
        data
    })
}


export function getRoleAPIList(role){
    return request({
        url:"/admin/getRoleApiList",
        method:'get',
        params:{role:role}
    })
}