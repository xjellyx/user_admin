import request from '@/utils/request'
import Qs from 'qs'
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

export function delMenu(id) {
    return request({
        method:"delete",
        url:"/admin/delMenu",
        params: {id: id},
    })
}

export function editMenu(data) {
    return request({
        method:"put",
        url:"/admin/editMenu",
        data
    })
}
