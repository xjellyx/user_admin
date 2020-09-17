import request from "../utils/request"

export  function getBehaviorList (param) {
    return request({
        url:"/admin/getBehaviorList",
        method:"get",
        params:param
    })
}

export  function removeBehaviorList(data){
    return request({
        url:"/admin/removeBehaviors",
        method:"delete",
        data
    })
}

export  function behaviorCount(){
    return request({
        url:"/admin/behaviorCount",
        method:"get",
    })
}