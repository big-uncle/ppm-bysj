$(function () {
    //地址栏参数，回调地址
    var redirect_uri = decodeURIComponent("/login");
     // 账户名效验
     $('#js_account').bind('keyup blur', function () {
        if (!$('#js_account').val()) {
            $('span[for="js_account"]').html("请填写账户名")
            $('span[for="js_account"]').parent().attr("style", "display: block")
        } else if (!(/[0-9a-zA-Z\u4E00-\u9FA5\\s]+$/.test($('#js_account').val()))) {
            $('span[for="js_account"]').html('请输入正确的账户名');
            $('span[for="js_account"]').parent().attr("style", "display: block")
        } else {
            $('span[for="js_account"]').parent().attr("style", "display: none")
        }
    })
    // 手机号效验
    $('#js_oldpwd').bind('keyup blur', function () {
        if (!$('#js_oldpwd').val()) {
            $('span[for="js_oldpwd"]').html("请填写手机号")
            $('span[for="js_oldpwd"]').parent().attr("style", "display: block")
        } else if (!(/^1[34578]\d{9}$/.test($('#js_oldpwd').val()))) {
            $('span[for="js_oldpwd"]').html('请输入正确的手机号');
            $('span[for="js_oldpwd"]').parent().attr("style", "display: block")
        } else {
            $('span[for="js_oldpwd"]').parent().attr("style", "display: none")
        }
    })
    // 新密码效验
    $('#js_newpwd').bind('keyup blur', function () {
        if (!$('#js_newpwd').val()) {
            $('span[for="js_newpwd"]').html("请填写新密码")
            $('span[for="js_newpwd"]').parent().attr("style", "display: block")
        } else if ($('#js_newpwd').val().length < 7) {
            $('span[for="js_newpwd"]').html("密码长度不足7位")
            $('span[for="js_newpwd"]').parent().attr("style", "display: block")
        } else if (!CheckPassWord($('#js_newpwd').val())) {
            $('span[for="js_newpwd"]').html("密码必须包含数字、字母，区分大小写")
            $('span[for="js_newpwd"]').parent().attr("style", "display: block")
        } else {
            $('span[for="js_newpwd"]').parent().attr("style", "display: none")
        }
    })
    // 确认密码效验
    $('#js_repwd').bind('keyup blur', function () {
        if (!$('#js_repwd').val()) {
            $('span[for="js_repwd"]').html("请再次输入新密码")
            $('span[for="js_repwd"]').parent().attr("style", "display: block")
        } else if ($('#js_newpwd').val() != $('#js_repwd').val()) {
            $('span[for="js_repwd"]').html("两次输入的密码不一致")
            $('span[for="js_repwd"]').parent().attr("style", "display: block")
        } else {
            $('span[for="js_repwd"]').parent().attr("style", "display: none")
        }
    })
    // 返回
    $('#js_return').bind('click', function () {
        location.href = redirect_uri
    })
    // 提交
    $('#js_submit').bind('click', function () {
        $('#js_oldpwd').blur()
        $('#js_newpwd').blur()
        $('#js_repwd').blur()
        $('#js_account').blur()
        
        var accountStatus = $('span[for="js_account"]').parent().attr("style") == "display: none"
        var oldStatus = $('span[for="js_oldpwd"]').parent().attr("style") == "display: none"
        var newStatus = $('span[for="js_newpwd"]').parent().attr("style") == "display: none"
        var reStatus = $('span[for="js_repwd"]').parent().attr("style") == "display: none"
        var oldpwd = $('#js_oldpwd').val()
        var newpwd = $('#js_newpwd').val()
        var account = $('#js_account').val()
        // 页面没有错误提示
        if (oldStatus && newStatus && reStatus&& accountStatus) {
            //提交
            $.post("/api/changepwd", { account :account, phone: oldpwd, newpwd: newpwd, }, function (result) {
                if (typeof result == 'string') {
                    result = JSON.parse(result)
                }
                if (!result.success) {
                    jQuery.alertWindowError(result.msg + "请重新修改")
                    if (result.msg=="没有找到该账户"){
                        $('span[for="js_account"]').html(result.msg+"请重新修改")
                        $('span[for="js_account"]').parent().attr("style", "display: block")
                }else{  
                    $('span[for="js_oldpwd"]').html(result.msg+"请重新修改")
                     $('span[for="js_oldpwd"]').parent().attr("style", "display: block")}
                 
                } else {
                    jQuery.alertWindowSuccess("密码修改成功,即将跳转至登陆页面...");
                    setTimeout(() => {
                        location.href = redirect_uri
                    }, 2000)

                }
            });
        }
    })
    //弹出提示的事件
    //成功弹框
    jQuery.extend({
        alertWindowSuccess: function (e, n) {
            var e = e, r; n === undefined ? r = "#00a8b7" : r = n;
            if ($("body").find(".alertWindowSuccess").length === 0) {
                var i = '<div class="alertWindowSuccess" style="width: 100%;height: 100%; background:rgba(0,0,0,0.5);position: fixed; left:0px; top: 0px; z-index: 9999;"><div  style="width: 360px; height: 150px;background: #FFF;margin: 100px auto;border: 2px solid #CFCFCF;">' + '<div  style="width: inherit;height: 20px;">' + '<div class="alertWindowCloseButton1" style="float: right; width: 10px; height: 30px;margin-right:5px;font-family:\'microsoft yahei\';color:' + r + ';cursor: pointer;"></div>' + "</div>" + '<div id="successImg" class="alertWindowTitle" style="margin-top:10px;text-align:center;font-family:\'Verdana, Geneva, Arial, Helvetica, sans-serif\';font-size: 18px;font-weight: normal;color: ' + r + ';">' + "</div>" + '<div class="alertWindowContent" style="width:360px;height: 40px;text-align:center;font-size: 18px;color: #7F7F7F;margin-top:10px;">' + e + "</div>" + "</div>" + "</div>";
                $("body").append(i);
                var s = $(".alertWindowSuccess");
                //2秒后自动关闭窗口
                setTimeout(function () { s.hide() }, 1800);
            }
            else { $(".alertWindowContent").text(e), $(".alertWindowSuccess").show(), setTimeout(function () { $(".alertWindowSuccess").hide() }, 1900); }
        }
    }
    )
    //失败提示
    jQuery.extend({
        alertWindowError: function (e, n) {
            var e = e, r; n === undefined ? r = "#00a8b7" : r = n;
            if ($("body").find(".alertWindowError").length === 0) {
                var i = '<div class="alertWindowError" style="width: 100%;height: 100%; background:rgba(0,0,0,0.5);position: fixed; left:0px; top: 0px; z-index: 9999;"><div  style="width: 360px; height: 150px;background: #FFF;margin: 100px auto;border: 2px solid #CFCFCF;">' + '<div  style="width: inherit;height: 20px;">' + '<div class="alertWindowCloseButton1" style="float: right; width: 10px; height: 30px;margin-right:5px;font-family:\'microsoft yahei\';color:' + r + ';cursor: pointer;"></div>' + "</div>" + '<div id="errorImg" class="alertWindowTitle" style="margin-top:10px;text-align:center;font-family:\'Verdana, Geneva, Arial, Helvetica, sans-serif\';font-size: 18px;font-weight: normal;color: ' + r + ';">' + "</div>" + '<div class="alertWindowContent" style="width:360px;height: 40px;text-align:center;font-size: 18px;color: #7F7F7F;margin-top:10px;">' + e + "</div>" + "</div>" + "</div>";
                $("body").append(i);
                var s = $(".alertWindowError");
                //2秒后自动关闭窗口
                setTimeout(function () { s.hide() }, 1800);
            }
            else { $(".alertWindowContent").text(e), $(".alertWindowError").show(), setTimeout(function () { $(".alertWindowError").hide() }, 1900); }
        }
    }
    )
    //了解更多按钮绑定事件
    $('.www').bind('click', function () {
        location.href = 'https://baike.baidu.com/item/%E6%99%BA%E8%83%BD%E4%BB%93%E5%BA%93%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F';
    })
})
//密码必须包含数字和字母
function CheckPassWord(password) {
    var str = password;
    if (str == null || str.length < 7) {
        return false;
    }
    var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
    if (reg.test(str))
        return true;
}