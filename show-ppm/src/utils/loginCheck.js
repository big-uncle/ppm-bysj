import * as conf from "./conf";
function loginCheck(){

    if(localStorage.getItem('userId')&&localStorage.getItem('loginStatus')==="success"){
        // console.log('有缓存')//有缓存什么都不做，就留在这个页面
    }else{
        // console.log('没有缓存')//如果没有缓存证明不是从登录过来的,所以清空缓存和跳转到登录页面
        localStorage.clear()
        window.location.href=conf.apiurl()+'/api/login'
    }
}
export default loginCheck;
