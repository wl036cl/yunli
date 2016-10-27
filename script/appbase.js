/******************************************
 *2015年11月19日 15:02:12
 *公用方法：
    1.getQueryString(name)//获取URL参数
    2.goTo(url)//页面跳转
    3.addEvent(el,e,f)//绑定事件
    4.SoftDown()//下载链接
 *全局参数：
    1.isAndroid;        //安卓访问
    2.isIPhone;         //IOS访问
    3.isWx;             //微信端
    3.isTbs;            //X5内核
    4.isPhone;          //手机端
    5._isiphone;        //IOS中APP
    6._isandroid;       //安卓中APP
    7._iosUrl;          //IOS的APPStore
    8._androidUrl;      //安卓APK下载地址
    9._tencentUrl;      //腾讯应用宝下载地址

    10.obj_wlui         //wlui(jquery)
 *加载“底栏”：调用
 *<script src="http://img2.peiyinxiu.com/web/common/js/appbase.js" type="text/javascript"></script>
 *<script type="text/javascript">
    //javascript版
    GetFoot(document.getElementById("wlui"), {
        android: '@ViewBag.AndroidApk',
        ios: 'https://itunes.apple.com/cn/app/id746925035?mt=8',
        isshow: true,
        downEls: [document.getElementById("btn_img_play")]
    });
    //jquery或者zepto版
    $("#wlui").getFoot({
        android: '@ViewBag.AndroidApk',
        ios: 'https://itunes.apple.com/cn/app/id746925035?mt=8',
        isshow: true,
        downEls: [$("#btn_img_play")]
    });
 *</script>
*******************************************/
//获取URL参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
//页面跳转
function goTo(link) {
    if (link != null && link.length > 0) {
        var uid = getQueryString("uid");
        var token = getQueryString("token");
        var v = getQueryString("v");
        if (uid != null && uid.length > 0 && link.indexOf("uid=") == -1)
            link += link.indexOf("?") >= 0 ? ("&uid=" + uid) : ("?uid=" + uid);
        if (token != null && token.length > 0 && link.indexOf("token=") == -1)
            link += link.indexOf("?") >= 0 ? ("&token=" + token) : ("?token=" + token);
        if (v != null && v.length > 0 && link.indexOf("v=") == -1)
            link += link.indexOf("?") >= 0 ? ("&v=" + v) : ("?v=" + v);
        window.location.href = link;
    }
}
//绑定事件
function addEvent(el, e, f) {
    if (el) {
        if (el.addEventListener)
            el.addEventListener(e, f);
        else if (el.attachEvent)
            el.addEventListener('on' + e, f);
        else
            el['on' + e] = f;
    }
}
var _iosUrl = "https://itunes.apple.com/cn/app/id1054912187?mt=8";//APPStore
var _androidUrl = "http://img2.peiyinxiu.com/Fyx_official.apk";//安卓APK官方地址
var _tencentUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.fangyanshow.dialectshow";//应用宝下载地址
//下载APP
function SoftDown() {
    //第一个参数是否打开，第二个参数filmId
    if (isWx)//微信中====跳转到应用宝
        location.href = _tencentUrl;
    else if (isIPhone) {
        //下载
        location.href = _iosUrl;
    }
    else if (isAndroid) {
        if (confirm("是否下载"))
            window.location.href = _androidUrl;
    }
    else {
        location.href = "http://peiyinxiu.com";
    }
}
//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
//判断浏览器类型
var isAndroid = false;//安卓访问
var isIPhone = false;//IOS访问
var isWx = false;//微信客户端
var isTbs = false;//是否腾讯X5内核
var isPhone = false;//手机客户端
var _isiphone = false;//IOS中APP
var _isandroid = false;//安卓中APP
var obj_wl = null;
var clickType ="click";
(function () {
    //判断浏览器类型
    function IsIPhone() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var isIpad = sUserAgent.match(/ipad/i) == "ipad";
        var isIpod = sUserAgent.match(/ipod/i) == "ipod";
        var isIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        isAndroid = sUserAgent.match(/android/i) == "android";
        isWx = sUserAgent.match(/micromessenger/i) == "micromessenger";
        isTbs = sUserAgent.match(/tbs/i) == "tbs";
        isIPhone = isIpad || isIpod || isIphoneOs;
        isPhone = isIPhone || isAndroid;
        var url = getQueryString("t");
        if (url == "iphone")
        { _isiphone = true; return; }
        if (url == "android")
        { _isandroid = true; return; }
        var v = getQueryString("v");
        if (v != null && v.length > 0) {
            if (isIPhone)
                _isiphone = true;
            if (isAndroid)
                _isandroid = true;
        }
    }
    IsIPhone();
    //构造底栏
    var FixFoot = function () {
        this.settings = {
            fatherEl: null,
            footEl: null,
            androidUrl: _androidUrl,
            iosUrl: _iosUrl,
            downEls: null,
            isshow: true
        }
    };

    FixFoot.prototype.insertHtml = function () {
        if (!this.settings.footEl) {
            this.settings.footEl = document.createElement("ul");
            this.settings.footEl.id = 'fix_footer';
            this.settings.footEl.innerHTML = '<li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASgAAABUCAMAAAAGTlolAAACT1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////+2F7/////////////////////2F7/////////2V7/////////////////////////////////////////////////////2V7/////////////////////////////////////////////////////////////////////////2V7/////2F//2F//2V//////2F7/2F//2V7/2F7/2V//113/2Fz/1l3/////1Vr/2Vn/////////////////////////////////////////////1lr/////////11//////////////////////2F7/////////2F7/////////////117/////////2V9JRURXUEaNi4pfV0eCf35/fHxsaWhRTk34+Pi6ubmqp6ZbV1bz8vJyb25oZWPKrlZNSUV4dnXTtlhbVEb9/Prs7Ozp6Oje3t6/vr6koqJkYV9iX1741F2eilCWhE90aEpNSklTTUXl5eXi4eGdmpr/2mTzz12kj1GCc0x5bEtpX0hkW0f/9tjX1tbNzMy1s7Ovrq3wzVzqyFvjwlrDqFaznFNWUlGHd03u7u7/+urT0tLEwsKWlJOSkI//44uIhYV9d23x0GjbvFm9o1SullKPfk5vZEn/662akHeOhnbkx2/szW3fv1rAplWLek3/+eXh2cb/77//77usn3n/3XD51WPBqywLAAAAbXRSTlMAq2rADIh068o6mIEVtA/8Gt5bf479dsT+pQP18/DhKAehvUERBPnheGAsCv6vnWUjAZpW3Ni5hW1HNzIdGxj59e3n1dTGvLupn2BIRD4wFMeUUkgg59C3e11QJR/ogXLkzLOMT03jgkPyiyaoStTzBAAAClpJREFUeNrk2fdTE0EUwPEnil1jY4yJxkTRqAhW7Eqvgr1h17GMOm8Xla4RBEWxoWLvvfdex7H8YXp3m4x33iZ7y0Wc+PmFyUx+4Zvl8TYHeisKVxfkZnky3GkJo0kEoxPS3BmerNyC1YUr4L9SlJ9JJGXmF8H/YnYOaZWc2fA/mJtHWi1vLsS8OR5i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" /></li><li><div class="btn_down">立即下载</div></li>';
            this.settings.fatherEl.appendChild(this.settings.footEl);
        }
        this.settings.fatherEl.style.padding = "0 0 5rem 0";
    }

    FixFoot.prototype.bindEvent = function () {
        if (this.settings.downEls) {
            for (var i = 0; i < this.settings.downEls.length; i++) {
                var el = this.settings.downEls[i];
                el = el.length ? el[0] : el;
                addEvent(el, 'click', SoftDown);
            }
        }
        if (this.settings.footEl && this.settings.footEl.children.length > 1) {
            addEvent(this.settings.footEl.children[0], 'click', function () { window.location.href = "/game/list"; });
            addEvent(this.settings.footEl.children[this.settings.footEl.children.length - 1], 'click', SoftDown);
        }
    }

    FixFoot.prototype.init = function (el, settings) {
        var $this = this;
        this.settings.fatherEl = el;
        if (settings.hasOwnProperty("androidUrl"))
            this.settings.androidUrl = settings.androidUrl;
        if (settings.hasOwnProperty("androidUrl"))
            this.settings.androidUrl = settings.androidUrl;
        if (settings.hasOwnProperty("iosUrl"))
            this.settings.iosUrl = settings.iosUrl;
        if (settings.hasOwnProperty("iosUrl"))
            this.settings.iosUrl = settings.iosUrl;
        if (settings.hasOwnProperty("isshow"))
            this.settings.isshow = settings.isshow;
        if (settings.hasOwnProperty("downEls"))
            this.settings.downEls = settings.downEls;
        if (this.settings.fatherEl) {
            if (this.settings.isshow && !_isiphone && !_isandroid) {
                _iosUrl = this.settings.iosUrl;
                _androidUrl = this.settings.androidUrl;
                this.insertHtml();
            }
        }
        this.bindEvent();
        if (!isPhone)
            console.log(["                   _ooOoo_",
        "                  o8888888o",
        "                  88\" . \"88",
        "                  (| -_- |)",
        "                  O\\  =  /O",
        "               ____/`---'\\____",
        "             .'  \\\\|     |//  `.",
        "            /  \\\\|||  :  |||//  \\",
        "           /  _||||| -:- |||||-  \\",
        "           |   | \\\\\\  -  /// |   |",
        "           | \\_|  ''\\---/''  |   |",
        "           \\  .-\\__  `-`  ___/-. /",
        "         ___`. .'  /--.--\\  `. . __",
        "      .\"\" '<  `.___\\_<|>_/___.'  >'\"\".",
        "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
        "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /",
        "======`-.____`-.___\\_____/___.-`____.-'======",
        "                   `=---='",
        "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "        佛祖保佑    需求不改    永无BUG"].join('\n'));
    }
    
    function GetFoot(el, options) {
        if (el) {
            var fixfoot = new FixFoot();
            fixfoot.init(el.length ? el[0] : el, options);
        }
    };
    //javascript调用
    window.GetFoot = GetFoot;
    //兼容旧jquery或zepto调用方法
    if (window.jQuery || window.Zepto) {
        if (window.Zepto) {
            window.Zepto.fn.getFoot = function (options) {
                GetFoot(this, options);
            }
            clickType = isPhone ? "tap" : "click";
        }
        else if (window.jQuery)
            window.jQuery.fn.getFoot = function (options) {
                GetFoot(this, options);
            }
    }
    //全局obj_wl
    obj_wl = document.getElementById("wlui");

    //变形刷新
    var _html = document.body.parentElement;
    var setTime = null;
    var body_width = 0;

    function reSize() {
        if (setTime)
        { clearTimeout(setTime); setTime = null; }
        setTime = setTimeout(function () {
            setTime = null;
            var body_width_change = document.body.clientWidth;
            body_width_change = body_width_change > 512 ? 512 : body_width_change;
            if (body_width != body_width_change) {
                body_width = body_width_change;
                _html.style.fontSize = Math.round((body_width / 320 / 16 * 1000) * 100) / 100 + "%";
            }
        }, 100);
    }
    reSize();
    
    window.onload = function () {
        if (_html) {
            window.onresize = function () {
                reSize();
            };
        }
    };
})();