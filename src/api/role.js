import request from '@/utils/request'

export function getRoleList() {
    return request({
        url:"/admin/getRoleList",
        method:"get"
    })
}