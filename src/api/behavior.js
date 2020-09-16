import request from "../utils/request"

export  function getBehaviorList (param) {
    return request({
        url:"/admin/getBehaviorList",
        method:"get",
        param:param
    })
}

export  function removeBehaviorList(ids){
    return request({
        url:"/admin/removeBehaviors",
        method:"delete",
        param:{"ids":ids}
    })
}

export  function behaviorCount(){
    return request({
        url:"/admin/behaviorCount",
        method:"get",
    })
}