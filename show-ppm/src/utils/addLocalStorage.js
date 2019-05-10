import  loginCheck from "./loginCheck";
import * as conf from "./conf";
function login() {
  var userId = GetParameter("userId");
  var userName = GetParameter("userName");
  var account = GetParameter("account");
  var phone = GetParameter("phone");
  var date = GetParameter("date");
  var loginStatus = GetParameter("loginStatus");
  if (userId!==""&&loginStatus!==""&&userName!==""){
    localStorage.clear()
  localStorage.setItem("userId", userId);
  localStorage.setItem("userName", userName);
  localStorage.setItem("account", account);
  localStorage.setItem("phone", phone);
  localStorage.setItem("loginStatus", loginStatus);
  localStorage.setItem("date", date);
  window.location.href=conf.showurl()+'#/home'
    }else{
      loginCheck();
    }
 }
export default login;


//获取url参数
function GetParameter(param) {
    var query = decodeURIComponent(window.location.search);
    var paramLength = param.length;
    var start = query.indexOf(param);
    if (start == -1) {
      return "";
    }
    start += paramLength + 1;
    var end = query.indexOf("&", start);
    if (end == -1) {
      return query.substring(start);
    }
    return query.substring(start, end);
  }