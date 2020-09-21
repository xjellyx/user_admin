import request from "@/utils/request"

export function getProjectSettings(){
    return request({
        url:"/admin/getSettings",
        method:'get'
    })
}