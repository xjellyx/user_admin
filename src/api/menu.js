import request from '@/utils/request'

export function getMenuList() {
    return request({
        method:"get",
        url:"/admin/getMenuList"
    })
}

export function setMenuList(data) {
    return request({
        method:"post",
        url:"/admin/addMenu",
        data
    })
}