import request from '@/utils/request'

export function getMenuList(id) {
    return request({
        method:"get",
        url:"/admin/getMenu",
        id
    })
}

export function setMenuList(data) {
    return request({
        method:"post",
        url:"/admin/addMenu",
        data
    })
}