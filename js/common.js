/*JSON兼容*/
if (typeof JSON !== 'object') { JSON = {}; }
(function () {
    'use strict'; function f(n) { return n < 10 ? '0' + n : n; }
    if (typeof Date.prototype.toJSON !== 'function') { Date.prototype.toJSON = function (key) { return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null; }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) { return this.valueOf(); }; }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }, rep;
    function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) { var c = meta[a]; return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4); }) + '"' : '"' + string + '"'; }
    function str(key, holder) { var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === 'object' && typeof value.toJSON === 'function') { value = value.toJSON(key); } if (typeof rep === 'function') { value = rep.call(holder, key, value); } switch (typeof value) { case 'string': return quote(value); case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) { return 'null'; } gap += indent; partial = []; if (Object.prototype.toString.apply(value) === '[object Array]') { length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || 'null'; } v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']'; gap = mind; return v; } if (rep && typeof rep === 'object') { length = rep.length; for (i = 0; i < length; i += 1) { if (typeof rep[i] === 'string') { k = rep[i]; v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } else { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}'; gap = mind; return v; } }
    if (typeof JSON.stringify !== 'function') { JSON.stringify = function (value, replacer, space) { var i; gap = ''; indent = ''; if (typeof space === 'number') { for (i = 0; i < space; i += 1) { indent += ' '; } } else if (typeof space === 'string') { indent = space; } rep = replacer; if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) { throw new Error('JSON.stringify'); } return str('', { '': value }); }; }
    if (typeof JSON.parse !== 'function') { JSON.parse = function (text, reviver) { var j; function walk(holder, key) { var k, v, value = holder[key]; if (value && typeof value === 'object') { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v; } else { delete value[k]; } } } } return reviver.call(holder, key, value); } text = String(text); cx.lastIndex = 0; if (cx.test(text)) { text = text.replace(cx, function (a) { return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4); }); } if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) { j = eval('(' + text + ')'); return typeof reviver === 'function' ? walk({ '': j }, '') : j; } throw new SyntaxError('JSON.parse'); }; }
}());


var MdConfig = {
    //PC、Phone
    AppType: "Phone",
    //0 or 1 是否启用测试模式
    TestMode: 1
};
//各种接口连接地址
var MdAppUrl;
if (MdConfig.TestMode == 1) {
    MdAppUrl = {//测试服务器的接口地址
        Api: "http://222.173.15.182:8031",
        Api3: "http://222.173.15.182:8030",
        Api4: "http://222.173.15.182:8040",
        Api42: "http://222.173.15.182:8042",
        Api43: "http://222.173.15.182:8043",
        Api45: "http://222.173.15.182:8045",
        Img: "http://image.maidiyun.com",
        Pay:"http://222.173.15.182:9991",
        pic: "http://pic.maidiyun.com",
        im: "http://im.maidiyun.com", //通讯
        InnerCodeUrl: "http://222.173.15.182:9977",
        video: "http://222.173.15.182:8031/mdweb"
    };
} else {//正式服务器的接口地址
    MdAppUrl = {
        Api: "http://api.maidiyun.com",
        Api3: "http://api3.maidiyun.com",
        Api4: "http://api4.maidiyun.com",
        Api42: "http://api42.maidiyun.com",
        Api43: "http://api43.maidiyun.com",
        Api45: "http://api45.maidiyun.com",
        Img: "http://image.maidiyun.com",
        Pay:"http://pay.maidiyun.com",
        pic: "http://pic.maidiyun.com", //
        im: "http://im.maidiyun.com", //通讯
        InnerCodeUrl: "http://118.190.104.167:9977",
        video: "http://video.maidiyun.com"
    };
}
MdAppUrl.video = "http://video.maidiyun.com";
MdAppUrl.m = "http://m.maidiyun.com";
MdAppUrl.item = "http://item.maidiyun.com";
MdAppUrl.i = "http://i.maidiyun.com";
//获取URL参数
function query(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
};
/*
 * 想本地数据库中指定关键字中存入指定值，可以存入json结构，比如value = {"id":1, "name": "张三"}
 */
function localSave(key, value, toDistinct) {
    if (window.localStorage) {
        var datas = localStorage.getItem(key);

        if (datas) {
            datas = JSON.parse(datas);

            if (toDistinct) {//true时，不允许有重复的值
                var strValue;

                if (typeof value === "object") {
                    strValue = JSON.stringify(value);
                } else {
                    strValue = value;
                }
                for (var i = 0; i < datas.length; i++) {
                    var itemValue = datas[i];

                    if (typeof itemValue === "object") {
                        itemValue = JSON.stringify(itemValue);
                    }
                    if (itemValue == strValue) {
                        datas.splice(i, 1);
                        break;
                    }
                }
            }
            //找不到，则在数组中新增项
            datas.splice(0, 0, value);
        } else {
            datas = [value];
        }
        localStorage.setItem(key, JSON.stringify(datas));
    }
};
/*
 * 返回指定关键字的值，以数组的形式返回，例如[{"id":1, "name": "张三"}, {"id":2, "name": "李四"}]
 * count：返回的最大数量，如果没有传入count或传入为0，则表示返回所有数量
 */
function localGet(key, count) {
    if (window.localStorage) {
        var datas = localStorage.getItem(key);

        if (datas) {
            datas = JSON.parse(datas);

            if (count && count > 0) {
                datas.splice(count, datas.length - count);
            }
            return datas;
        }
    }
};
/*
 * 清理指定关键字的全部值
 */
function localClear(key) {
    if (window.localStorage) {
        window.localStorage.removeItem(key);
    }
};
/*
 * 利用Get的方式获取数据
 */
function getAjaxData(url, callback, needToken, contentType) {
    ajaxData(url, false, callback, "get", needToken, contentType);
};
/*
 * 向服务器Post数据，并获取返回数据
 */
function postAjaxData(url, data, callback, needToken, contentType) {
    ajaxData(url, data, callback, "post", needToken, contentType);
};
function ajaxData(url, data, callback, ajaxType, needToken, contentType) {
    jQuery.support.cors = true;

    if (typeof (data) == 'object') {
        data = JSON.stringify(data);
    }
    //验证是否需要加token
    var header = {};

    if (needToken) {
        header.Authorization = "Bearer " + getToken();
    }
    $.ajax(url, {
        dataType: 'json', //服务器返回json格式数据
        contentType: contentType || 'application/json', //提交到服务器的数据的格式
        type: ajaxType, //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        headers: header,
        data: data,
        crossDomain: true,
        success: function (data) {
            callback(data);
        },
        error: function (xhr, type, errorThrown) {
            callback({
                State: -99,
                ErrorMessage: xhr.statusText
            });
        }
    });
};
//注册事件
function addEvent(eventName, eventHandler, target) {
    if (!target) {
        target = window;
    }
    if (document.all) {
        target.attachEvent("on" + eventName, eventHandler);
    } else {
        target.addEventListener(eventName, eventHandler, true);
    }
};
//移除已注册的事件
function removeEvent(eventName, eventHandler, target) {
    if (!target) {
        target = window;
    }
    if (document.all) {
        target.detachEvent("on" + eventName, eventHandler);
    } else {
        target.removeEventListener(eventName, eventHandler, true);
    }
};

function getGeocode(callback, fromGps) {
    if (typeof callback != "function") {
        return;
    }

    //获取本地存储的位置,并且没有超过15分钟,则直接返回
    if (!fromGps) {
        var location = localGet("MyPosition");
        if (location && (((new Date()).getTime() - location.geoTime) <= 900000)) {
            callback(location);
            return;
        }else{
        }
    }
}
//当前登录用的信息
var user = {
    token: "",
    id: 0,
    name: "",
    mdt: "",
    compid: 0,
    compname: "",
    compmdt: "",
    address: "",
    userAuth: "",
    InnerCodeName:"出厂编号",
    logout: function () {
    },
    ready: function (callback) {
        user.readyCallback = callback;
    }
};
//获取元素的上边距
function elTop(el) {
    if (!el) {
        return 0;
    }
    var offsetTop = el.offsetTop;

    while (el = el.offsetParent) {
        offsetTop += el.offsetTop;
    }
    return offsetTop;
};
//获取元素的左边距
function elLeft(el) {
    if (!el) {
        return 0;
    }
    var offsetLeft = el.offsetLeft;

    while (el = el.offsetParent) {
        offsetLeft += el.offsetLeft;
    }
    return offsetLeft;
};
(function ($) {
    /*监听滚动事件，当指定元素露头时，触发该事件：：：每个元素只触发一次*/
    $.fn.listenScroll = function (callback) {
        var elList = $(this), scrollTimer;
        this.each(function (ix, e) {
            e.isLoaded = false;
        });
        var listenCount = elList.length;
        var scrollEvent = function () {
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(function () {
                var bd_top = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
                var seeY = window.innerHeight || document.documentElement.clientHeight; //浏览器可视区域高度
                var bd_h = bd_top + seeY - 10;

                $.each(elList, function (ix, e) {
                    if (!e.isLoaded && (e.initTop = elTop(e)) <= bd_h && e.initTop > bd_top) {
                        callback(e); e.isLoaded = true; listenCount -= 1;
                    }
                });
                if (listenCount <= 0) {
                    removeEvent("scroll", scrollEvent);
                }
            }, 100);
        };
        scrollEvent();
        addEvent("scroll", scrollEvent);
        return this;
    };
    /*执行自动铆住元素*/
    $.fn.autoFixed = function (callback) {
        var elList = $(this);
        var fixedEvent = function () {
            var bd_top = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
            var isfixed = false;

            for (var i = elList.length - 1; i >= 0; i--) {
                var e = elList[i];

                if (elTop(e) <= bd_top) {
                    if (isfixed) {
                        if ($(e).hasClass("fixedClone")) {
                            elList[i] = clearFixed(e);
                        }
                        break;
                    } else if ($(e).hasClass("fixedClone")) {
                        break;
                    }
                    var html = "<" + $(e)[0].localName + " />";
                    $(e).after($(html).attr({ "class": $(e).attr("class"), "style": $(e).attr("style") })).addClass("fixed");
                    elList[i] = $(e).next().addClass("fixedClone").css("height", $(e).height() + "px")[0];
                    isfixed = true;
                } else if ($(e).hasClass("fixedClone")) {
                    elList[i] = clearFixed(e);
                }
            }
        };
        var clearFixed = function (e) {
            var el = $(e).prev().removeClass("fixed");
            $(e).remove();
            return el[0];
        };
        fixedEvent();
        addEvent("scroll", fixedEvent);

        elList.cancelFixed = function () {
            removeEvent("scroll", fixedEvent);

            if (elList) {
                for (var i = elList.length - 1; i >= 0; i--) {
                    var e = elList[i];

                    if ($(e).hasClass("fixedClone")) {
                        elList[i] = clearFixed(e);
                    }
                }
            }
            elList = undefined;
        };
        return elList;
    };
    /*在指定元素中生成一个二维码图样
     */
    $.fn.renderQRCode = function (codeText, imgSrc, width, height) {
        if (!width) {
            width = 60;
        }
        if (!height) {
            height = 60;
        }
        $(this).qrcode({
            render: 'canvas',
            text: codeText,
            height: height,
            width: width,
            src: imgSrc
        });
    };
    /*在指定容器中创建分页控件
     *page：当前页码
     *pageCount：每页的数据量
     *total：总数据量
     *callback：点击页码时的回调
     *showJump：是否显示跳转按钮
     *showTotal：是否显示总数
     */
    $.fn.pageWrap = function (page, pageCount, total, callback, showJump, showTotal) {
        if (page <= 0) page = 1;
        if (pageCount <= 0) pageCount = 10;
        var pageNums = (total <= 0) ? 1 : Math.ceil(total / pageCount);
        var pageEnd = (page <= 5) ? ((pageNums < 10) ? pageNums : 10) : ((pageNums < (page + 5)) ? pageNums : (page + 5));
        var pageStart = (pageEnd <= 9) ? 1 : (pageEnd - 9);
        var wrap = $(this), sb = new Array(), memo = wrap.attr("memo");

        if (pageStart < pageEnd) {
            sb.push("<ul class=\"pagenav-list\">");
            sb.push("<li class=\"first " + ((pageStart == page) ? "selected" : "") + "\">" + pageStart + "</li>")
            for (var p = pageStart + 1; p < pageEnd; p++) {
                sb.push("<li class=\"" + ((p == page) ? "selected" : "") + "\">" + p + "</li>");
            }
            if (pageStart < pageEnd) {
                sb.push("<li class=\"last " + ((pageEnd == page) ? "selected" : "") + "\">" + pageEnd + "</li>");
            }
            sb.push("</ul>");
            if (showJump) {
                sb.push("<div class=\"pagenav-list\"><input type=\"text\" class=\"jump-nums\" /><span class=\"jump-btn\">跳转</span><span class=\"jump-btnfirst\">首页</span><span class=\"jump-btnend\">尾页</span></div>");
            }
        }
        if (total && showTotal) {
            sb.push("<div class=\"pagenav-list\">共 <span class=\"h\">" + total + "</span> 条" + (memo ? memo : "数据") + "</div>");
        }
        sb.push("<div class=\"clear\"></div>");
        wrap.html(sb.join('')).off()
            .one("click", "li:not(.selected)", function () {
                var cp = parseInt($(this).html());
                if (!isNaN(cp) && cp != page) {
                    if (callback) {
                        callback(cp, pageCount);
                    }
                    wrap.pageWrap(cp, pageCount, total, callback, showJump, showTotal);
                }
            })
            .on("click", ".jump-btn", function () {
                var cp = parseInt($(this).prev("input.jump-nums").val());
                if (!isNaN(cp)) {
                    if (cp <= 0) cp = 1;
                    else if (cp < pageNums) cp = cp; else if (cp > pageNums) cp = pageNums;
                    if (cp == page) return;
                    if (callback) {
                        callback(cp, pageCount);
                    }
                    wrap.off("click", ".jump-btn");
                    wrap.off("keypress", ".jump-nums");
                    wrap.pageWrap(cp, pageCount, total, callback, showJump, showTotal);
                    wrap.find(".jump-nums").focus();
                }
            })
            .on("click", ".jump-btnfirst", function () {
                var cp = 1;
                if (cp == page) return;
                if (callback) {
                    callback(cp, pageCount);
                    wrap.off("click", ".jump-btn");
                    wrap.off("keypress", ".jump-nums");
                    wrap.pageWrap(cp, pageCount, total, callback, showJump, showTotal);
                    wrap.find(".jump-nums").focus();
                }
            })
            .on("click", ".jump-btnend", function () {
                var cp = pageNums;
                if (cp == page) return;
                if (callback) {
                    callback(cp, pageCount);
                    wrap.off("click", ".jump-btn");
                    wrap.off("keypress", ".jump-nums");
                    wrap.pageWrap(cp, pageCount, total, callback, showJump, showTotal);
                    wrap.find(".jump-nums").focus();
                }


            })


            .one("keypress", ".jump-nums", function (e) {
                if (e.keyCode == 13) {
                    wrap.find(".jump-btn").click();
                }
            });
    };
})(jQuery);
//获取登录用户TOKEN
function getToken() {
    if (MdConfig.AppType == "PC") {
        return user.token;
    } else {

        return user.token;
    }
    //这里是测试使用的token
    //return "4xdyLVS2nff57TDHhNCKeHMJoR2X_7DyNnueLSOqKJdZbO_IK5b1h2m7BsrZ1gRZtosBnoRYUhS7gsCJ5S9j08USdINdIvQnEWv-xfK4_IGi1ezGhi8OTtL2IKogaJO1Qvu6cj0BZDijyVV_S3Nmsch1Msgxfsdvse4QSN8oZXap2OWLhxPrVCToRTdoddqurPKE-UKjJ8TA3Esb-mM5xNsR-WBejQNKsxqlMqlJs0o";
};
user.reload = function () {
    var mu;

    if (MdConfig.AppType == "PC") {
       
    } else {
        var objs = localGet("user", 1);
        if (objs) {
            mu = objs[0];
        }
    }
    if (mu) {
        user.id = mu.UserID;
        user.name = mu.RealName;
        user.mdt = mu.Mdt;
        user.compid = mu.CompID || "";
        user.compname = mu.CompName || "";
        user.compmdt = mu.CompMdt || "";
        user.address = mu.Address || "";
        user.token = mu.Token || "";
        user.userAuth = mu.UserAuth || "";

  
    }
};
user.logout = function () {
    user.id = 0;
    user.compid = 0;
    if (MdConfig.AppType == "PC") {
     
    } else {
        localClear("user");
    }

};
setTimeout(function () {
    user.reload();

    if (user.readyCallback) {
        user.readyCallback();
    }
}, 500);

//时间格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "H+": this.getHours(),                   //小时   
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
//日期转换
function GetDate(val, showTime, isSimplify) {
    if (typeof val == "number") {
        val = new Date(val);
    } else if (typeof val == "string") {
        val = new Date(val.replace(/-/g, "/"));
    }
    if (isSimplify) {
        var date = val.Format("yyyy-MM-dd");
        var today = new Date();
        var time = showTime ? (" " + val.Format("HH:mm")) : "";

        if (date == today.Format("yyyy-MM-dd")) {
            return "今天" + time;
        } else {
            today.setDate(today.getDate() - 1);

            if (date == today.Format("yyyy-MM-dd")) {
                return "昨天" + time;
            } else {
                return date + time;
            }
        }
    } else if (showTime) {
        return val.Format("yyyy-MM-dd HH:mm");
    } else {
        return val.Format("yyyy-MM-dd");
    }

};

//百度统计
var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?dcd7a3d5d17936632d3dcc5f0a99b3a3";
    hm.setAttribute("async", "");
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

/**
 * 组合省市地址
 * @param {Object} province
 * @param {Object} city
 * @param {Object} district
 * @param {Object} address
 */
function contractAddress(province, city, district, address) {
    province = province || "";
    city = city || "";
    district = district || "";
    address = address || "";

    if (province == city) {
        return province + " " + district + " " + address;
    } else {
        return province + " " + city + " " + district + " " + address;
    }
}

//以下供产品详情和企业详情页使用
//获取图片服务器Base64
var imgPath = {
    cmpLogo: "Y29tcC9sb2dv", //企业Logo
    pkgLogo: "cGtnL2xvZ28=", //产品缩略图
    pkgImgs: "cGtnL2ltYWdlcw==", //产品宣传图
    pkgYb: "cGtnL3li", //产品二维样本
    userLogo: "dXNlci9sb2dv", //用户头像
};

//删除左右两端的空格
function trim(str) {　　
	return str.replace(/(^\s*)|(\s*$)/g, "");
}