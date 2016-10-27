(function () {
    //验证
    var codeVerify = {
        num: 9999,
        obj_txt: $("#txt_code"),
        obj_img: $("#img_code"),
        Refresh: function () {
            this.obj_txt.attr("value", "");
            var num1 = Math.floor(Math.random() * 100);
            var num2 = Math.floor(Math.random() * 100);
            num = num1 + num2;
            this.obj_img.html(num1 + "+" + num2 + "=?");
            if (!this.obj_img.hasClass("code")) {
                this.obj_img.addClass("code");
            }
        },
        Verify: function () {
            return num == Number(this.obj_txt.val());
        }
    }
    var login = {
        btn_register: $("#btn_register"),
        btn_login: $("#btn_login"),
        btn_codeimg: $("#login_img"),
        span_msg: $("#span_msg"),
        data: { username: "", password: "" },
        test: function () {
            var msg = "";
            if (!codeVerify.Verify())
                return "验证码不正确！";
            if (this.data.username.length == 0)
                msg += "帐号，";
            if (this.data.password.length == 0)
                msg += "密码，";
            if (msg.length > 0)
                return msg.substr(0, msg.length - 1) + "不能为空！<br/>";

            if (!/[\u4e00-\u9fa5 \w]{6,20}/.test(this.data.username))
                msg += "用户名为6-20位汉字，数字或字母组合！<br/>";
            if (!/\w{6,20}/.test(this.data.password))
                msg += "密码为6-20位数字或字母组合！<br/>";
            return msg;
        },
        showMsg: function (tf, msg) {
            if (tf)
                this.span_msg.removeClass().addClass("green").html(msg);
            else
                this.span_msg.removeClass().addClass("red").html(msg);
        },
        upload: function (_username, _password) {
            this.data = $.extend(this.data, {
                username: _username,
                password: _password
            });
            var _msg = this.test();
            if (_msg.length > 0)
                this.showMsg(false, _msg);
            else
                this.ajax();
        },
        isrun: false,
        ajax: function () {
            if (this.isrun)
                return;
            this.isrun = true;
            var now = Date.now();
            var $this = this;
            $.ajax({
                url: "https://d.apicloud.com/mcm/api/user/login",
                type: "POST",
                cache: false,
                headers: {
                    "X-APICloud-AppId": app.appId,
                    "X-APICloud-AppKey": hex_sha1(app.appId + "UZ" + app.appKey + "UZ" + now) + "." + now
                },
                data: this.data,
                success: function (data, status, header) {
                    $this.isrun = false;
                    if (data.id && data.userId) {
                        localStorage["u_id"] = data.userId;
                        localStorage["u_token"] = data.id;
                        $('#txt_uname').val('');
                        $('#txt_upsd').val('');
                        api.openWin({
                            name: "index",
                            url: "index.html",
                            pageParam: {
                                uid: data.userId,
                                token: data.id
                            },
                            animation: {
                                type: "flip", //动画类型（详见动画类型常量）
                                subType: "from_right", //动画子类型（详见动画子类型常量）
                                duration: 500 //动画过渡时间，默认300毫秒
                            }
                        });
                    } else
                        $this.showMsg(false, data.error.message || "登陆失败，请重试！");
                },
                error: function (header, status, errorThrown) {
                    //fail body
                    $this.isrun = false;
                    $this.showMsg(false, JSON.parse(header.response).error.message);
                }
            });
        },
        bindEvent: function () {
            var $this = this;
            if (this.btn_register) {
                //跳入注册
                this.btn_register.bind(clickType, function () {
                    api.openWin({
                        name: "register",
                        url: "register.html",
                        animation: {
                            type: "flip", //动画类型（详见动画类型常量）
                            subType: "from_right", //动画子类型（详见动画子类型常量）
                            duration: 500 //动画过渡时间，默认300毫秒
                        }
                    });
                });
            }
            if (this.btn_login) {
                //跳入登陆
                this.btn_login.bind(clickType, function () {
                    $this.upload($('#txt_uname').val().trim(), $('#txt_upsd').val().trim());
                });
            }
            if (this.btn_codeimg) {
                //刷新验证码
                this.btn_codeimg.bind(clickType, function () {
                    codeVerify.Refresh();
                });
            }
        },
        init: function () {
            alert(localStorage["u_token"] + "--" + localStorage["u_id"]);
            if (localStorage["u_token"] && localStorage["u_id"]) {
                api.openWin({
                    name: "index",
                    url: "index.html",
                    pageParam: {
                        uid: localStorage["u_id"],
                        token: localStorage["u_token"]
                    },
                    animation: {
                        type: "flip", //动画类型（详见动画类型常量）
                        subType: "from_right", //动画子类型（详见动画子类型常量）
                        duration: 500 //动画过渡时间，默认300毫秒
                    }
                });
            } else {
                //验证码初始化
                codeVerify.Refresh();
                this.bindEvent();
            }
        }
    }
    login.init();
})();