$(document).ready(function(){
    var lang = $("body").attr("lang");

 function refreshCaptcha() {
            $.ajax({
                url: "/account/refreshcaptcha",
                data: {
                },
                dataType: "json",
                type: "post",
                error: function () {
                    alert("error ")
                },
                success: function (data) {
                    switch(data.Code){
                        case "0":
                            $("#j-captcha-img").attr("src", "/captcha/"+data.Msg+".png");
                            $("#j-captcha-id").attr("value", data.Msg);
                            break;
                    }
                }
            });
    };

    $("#j-captcha-refresh").click(function() {
        refreshCaptcha();
    });

    function checkEmail(warn_empty) {
        var v = $("#j-reset-email").val();
        if (v) {
            $.ajax({
                url: "/account/email_exist/",
                data: {email: v},
                dataType: "json",
                type: "get",
	            error: function () {
	            },
                success: function(data) {
                    if (data.Code != "11") {
                        $("#j-reset-email-error").addClass("show");
                        var message = data.Msg;
                        if (data.Code == 0) {
                            if (lang == 'cn') {
                                message = '邮箱地址不存在';
                            } else {
                                message = 'Email address not exist';
                            }
                        }
                        $("#j-reset-email-error").html(message);
                        return false;
                    }
                }
            });
        } else {
            if (warn_empty == true) {
                $("#j-reset-email-error").addClass("show");
                if (lang == 'cn') {
                    $("#j-reset-email-error").html('请输入邮箱地址');
                } else {
                    $("#j-reset-email-error").html('Please input email address');
                }
            }
            return false;
        }
        return true;
    };

    function checkCaptcha(warn_empty) {
        var v = $("#j-reset-captcha").val();
        if (v.length == 0 && warn_empty == true) {
            $("#j-reset-captcha-error").addClass("show");
            if (lang == 'cn') {
                $("#j-reset-captcha-error").html('请输入验证码');
            } else {
                $("#j-reset-captcha-error").html('Please input captcha');
            }
            return false;
        }
        return true;
    }

    $("#j-reset-email").focus(function() {
        $("#j-reset-email-error").removeClass("show");
    }).blur(checkEmail);

    $("#j-reset-captcha").focus(function() {
        $("#j-reset-captcha-error").removeClass("show");
    });

    $("#j-reset-send-email-btn").click(function () {
        if (!checkEmail(true)) {
            return;
        }
        if (!checkCaptcha(true)) {
            return;
        }
        var email   = $("#j-reset-email").val();
        var captcha = $("#j-reset-captcha").val();
        var captcha_id = $("#j-captcha-id").val();

        $.ajax({
            url: "/account/send_reset_password_email/",
            data: {
                email  : email,
                captcha: captcha,
                captcha_id: captcha_id
            },
	        dataType: "json",
	        type: "post",
            error: function () {
                 message = '发送失败';
	        },
            success: function (data) {
                var message = data.Msg;
                if (data.Code == "0") {
                    if (lang == 'cn') {
                       // message = '发送成功, 请注意查收邮件';
                        window.location.href='/account/send_reset_email_success?email='+email;
                    } else {
                        message = 'Send success';
                    }
                   // $("#j-reset-email").val("");
                } else {
                    alert(message);//弹窗在这里被实现/**********************************************/
                    refreshCaptcha();
                   // alert("发送失败，请重新填写发送。");
                }
                //alert(message);
                //$("#j-reset-captcha").val("");
                //refreshCaptcha();
                
            }
        });
    });
    $("#j-reset-send-email-btn-again").click(function() {
        var email   = $("#Email").text();
        $.ajax({
            url: "/account/send_reset_password_email_again/",
            data: {
                email  : email
            },
	        dataType: "json",
	        type: "post",
            error: function () {
                 message = '发送失败';
	        },
            success: function (data) {
                var message = data.Msg;
                if (data.Code == "0") {
                    if (lang == 'cn') {
                        alert('再次发送成功, 请注意查收邮件')
                        message = '再次发送成功, 请注意查收邮件';
                        //window.location.href='/account/send_reset_email_success?email='+email;
                    } else {
                        message = 'Send success';
                    }
                   // $("#j-reset-email").val("");
                } else {
                    alert(message);//弹窗在这里被实现/**********************************************/
                    refreshCaptcha();
                }
            }
        });
    });
    function checkPswd(warn_empty) {
        var v = $("#j-new-pswd").val();
        if (v.length == 0 && warn_empty == true) {
            $("#j-new-pswd-error").addClass("show");
            if (lang == 'cn') {
                $("#pswd-Box").addClass('m_inputBox_error');
                $("#j-new-pswd-error").html('请输入密码');
            } else {
                $("#j-new-pswd-error").html('Please input password');
            }
            return false;
        }
        if (v.length > 0 && v.length < 6) {
            $("#j-new-pswd-error").addClass("show");
            if (lang == 'cn') {
                $("#pswd-Box").addClass('m_inputBox_error');
                $("#j-new-pswd-error").html('密码过短');
            } else {
                $("#j-new-pswd-error").html('Password is too short');
            }
            return false;
        }
        $("#pswd-Box").removeClass('m_inputBox_error');
        return true;
    }

    function checkPswdRept(warn_empty) {
        var pswd = $("#j-new-pswd").val();
        var rept = $("#j-new-rept-pswd").val();
        if (rept.length == 0 && warn_empty == true)
        {
            $("#j-new-rept-pswd-error").addClass("show");
            if (lang == 'cn') {
                $("#rept-pswd-Box").addClass('m_inputBox_error');
                $("#j-new-rept-pswd-error").html('请再次输入密码');
            } else {
                $("#j-new-rept-pswd-error").html('Please repeat the password');
            }
            return false;
        }
        if (rept.length > 0 && rept != pswd) {
            $("#j-new-rept-pswd-error").addClass("show");
            if (lang == 'cn') {
                $("#rept-pswd-Box").addClass('m_inputBox_error');
                $("#j-new-rept-pswd-error").html('两次输入密码不一致');
            } else {
                $("#j-new-rept-pswd-error").html('Password not match');
            }
            return false;
        }
        $("#rept-pswd-Box").removeClass('m_inputBox_error');
        return true;
    }

    $("#j-new-pswd").focus(function() {
        $("#j-new-pswd-error").removeClass("show");
    }).blur(checkPswd);

    $("#j-new-rept-pswd").focus(function() {
        $("#j-new-rept-pswd-error").removeClass("show");
    }).blur(checkPswdRept);

    $("#j-reset-pswd-btn").click(function() {
        if (!checkPswd(true)) {
            return;
        }
        if (!checkPswdRept(true)) {
            return;
        }
        var pswd = $("#j-new-pswd").val();
        $.ajax({
            url: "/account/reset_password/",
            data: {
                password: pswd
            },
	        dataType: "json",
	        type: "post",
	        error: function () {
	        },
	        success: function (data) {
                switch (data.Code) {
                case "0":
                    window.location.href = data.Msg;
                    break;
                default:
                    alert(data.Msg);
                    $("#j-new-pswd").val("");
                    $("#j-new-rept-pswd").val("");
                    break;
                }
            }
        });
    });
    
    $("#reset-finish").click(function () {
        $("#login-box").removeClass("hide");
        $("#login-box").addClass("show");
        //window.location.href = "http://www.baidu.com"
    });
});
