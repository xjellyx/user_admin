const loadView = (viewPath) => {
    return () => import(`@/views/${viewPath}`)
}
export const asyncRouterHandle = (asyncRouter) => {
    asyncRouter.map(item => {
        if (item.component) {
            item.component = loadView(item.component)
        } else {
            delete item['component']
        }
        if (item.children) {
            asyncRouterHandle(item.children)
        }
    })
}