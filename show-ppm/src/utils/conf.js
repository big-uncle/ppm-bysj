//记得改的话也要带上api的login的url  还有那个导出表格的地址
//记住规则  别带默认default  且使用时别直接使用，推荐 * as
//本地配置
export  function apiurl() { //后端api
    return 'http://127.0.0.1:10800'
}
export function showurl() { //前端地址
    return 'http://127.0.0.1:10888'
}

// //服务器上
// export function showurl() { //前端地址
//     return 'http://39.105.211.25'
// }
// export  function apiurl() {//后端api
//     return 'http://39.105.211.25:10800'
// }

//本地穿透
// export  function apiurl() { //后端api
//     return 'http://ppmapi.mryl-frp.leconginfo.com'
// }
// export function showurl() { //前端地址
//     return 'http://ppmshow.mryl-frp.leconginfo.com'
// }




