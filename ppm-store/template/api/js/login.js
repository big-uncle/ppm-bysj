var redirect_uri;
$(function () {
    //地址栏参数，回调地址
    redirect_uri = decodeURIComponent("http://bysj.store.pp");
    document.onkeydown = function (e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            $('#login').click()
        }
    }
    $('.www').bind('click', function () {
        location.href = 'https://baike.baidu.com/item/%E6%99%BA%E8%83%BD%E4%BB%93%E5%BA%93%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F';
    })
    $('.forget').bind('click', function () {
        location.href = decodeURIComponent("changepwd");
    })
    $('.regist').bind('click', function () {
        location.href = decodeURIComponent("regist");
    })
    //登录
    $('#login').bind('click', function () {
        var phone = $('#phone').val();
        var passwd = $('#passwd').val();
        if (!phone || $.trim(phone) == "") {
            $(".error").html('请输入账号');
            $(".error").show();
        } else if (!passwd || $.trim(passwd) == "") {
            $(".error").html('请输入密码');
            $(".error").show();
        } else if (!(/[0-9a-zA-Z\u4E00-\u9FA5\\s]+$/.test(phone))) {
            $(".error").html('请输入正确的账号');
            $(".error").show();
        } else {
            //提交
            $.post("/api/authentication", { account: phone, passwd: passwd }, function (result) {
                if (typeof result == 'string') {
                    result = JSON.parse(result)
                }
                if (!result.success) {
                    $(".error").html(result.msg);
                    $(".error").show();
                } else {
                    $(".error").hide();
                    $(".login").hide();
                    var dataArr = result.data;
                    var params = 'userId=' + dataArr.user_id + '&userName=' + dataArr.user_name + '&account=' + dataArr.user_account + '&phone=' + dataArr.user_phone + '&loginStatus=success'+ '&date=' + dataArr.add_date ;
                    // localStorage.setItem("userId", dataArr.user_id);//给localStorage里面存放信息
                    //    localStorage.mycolor= '456';
                    //     //获取：
                    //     var asas = localStorage.getItem("loginStatus");
                        // var $color = localStorage.mycolor
                        // var $color = localStorage.key(0);//获取第一个键，按角标获取
                        // var $color = localStorage.key("");//获取最后一个键
                        // var $length = localStorage.length;//获取数据的长度
                        //删除
                        // localStorage.removeItem("mycolor");
                        //清空
                        // localStorage.clear();//将所有保存的数据删除
                    location.href = encodeURI( redirect_uri + '?' + params);
                }
            });
            
        }
    })
})
//获取地址栏中的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
// request.form("") 取值post
// get传递数据量较小，没有post安全性强，用request.querystring("取值") 。

//不带ajax的post
function post(URL, PARAMS) {   
    alert(URL)     
    var temp = document.createElement("form");        
    temp.action = URL;        
    temp.method = "post";        
    temp.style.display = "none";        
    for (var x in PARAMS) {        
        var opt = document.createElement("textarea");        
        opt.name = x;        
        opt.value = PARAMS[x];               
        temp.appendChild(opt);        
    }        
    document.body.appendChild(temp);        
    temp.submit();        
    return temp;        
}        
//
function httpPost(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";

    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp.appendChild(opt);
    }

    document.body.appendChild(temp);
    temp.submit();
    return temp;
}
