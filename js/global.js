if (typeof JSON !== 'object') { JSON = {}; }
(function () {
    'use strict'; function f(n) { return n < 10 ? '0' + n : n; }
    if (typeof Date.prototype.toJSON !== 'function') { Date.prototype.toJSON = function (key) { return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null; }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) { return this.valueOf(); }; }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }, rep;
    function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) { var c = meta[a]; return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4); }) + '"' : '"' + string + '"'; }
    function str(key, holder) { var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === 'object' && typeof value.toJSON === 'function') { value = value.toJSON(key); } if (typeof rep === 'function') { value = rep.call(holder, key, value); } switch (typeof value) { case 'string': return quote(value); case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) { return 'null'; } gap += indent; partial = []; if (Object.prototype.toString.apply(value) === '[object Array]') { length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || 'null'; } v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']'; gap = mind; return v; } if (rep && typeof rep === 'object') { length = rep.length; for (i = 0; i < length; i += 1) { if (typeof rep[i] === 'string') { k = rep[i]; v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } else { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}'; gap = mind; return v; } }
    if (typeof JSON.stringify !== 'function') { JSON.stringify = function (value, replacer, space) { var i; gap = ''; indent = ''; if (typeof space === 'number') { for (i = 0; i < space; i += 1) { indent += ' '; } } else if (typeof space === 'string') { indent = space; } rep = replacer; if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) { throw new Error('JSON.stringify'); } return str('', { '': value }); }; }
    if (typeof JSON.parse !== 'function') { JSON.parse = function (text, reviver) { var j; function walk(holder, key) { var k, v, value = holder[key]; if (value && typeof value === 'object') { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v; } else { delete value[k]; } } } } return reviver.call(holder, key, value); } text = String(text); cx.lastIndex = 0; if (cx.test(text)) { text = text.replace(cx, function (a) { return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4); }); } if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) { j = eval('(' + text + ')'); return typeof reviver === 'function' ? walk({ '': j }, '') : j; } throw new SyntaxError('JSON.parse'); }; }
} ());
var key64 = {
    yb: "cGtnL3li"
};
var MDApp = {
    url: {
        api: "http://42.96.210.38:81", //42.96.210.38:81		
        video: "http://www.maidiyun.com",
        pic: "http://42.96.210.38:82", //42.96.210.38:82
        home: "http://wap.maidiyun.com",
        code: "http://www.maidiyun.com?m="
    }
};



//load html/post data
function gGet(url, callback) {
    $.ajax({
        url: url,
        dataType: 'jsonp',
        type: "GET",
        jsonp: 'jsonpcallback',
        success: function (reData) {
            if (typeof callback != "function")
                return;
            callback(reData);
        }
    });
};
function gPost(url, callback, data) {
    if (typeof data != "string") {
        data = JSON.stringify(data);
    }

    if (window.XDomainRequest) {
        var xdr = new XDomainRequest();
        xdr.open("post", url);
        xdr.onload = function () {
            var reData = JSON.parse(xdr.responseText);
            if (typeof callback != "function") {
                return;
            }
            callback(reData);
        };
        xdr.onprogress = function () { };
        xdr.ontimeout = function () {
            if (typeof callback != "function") {
                return;
            }
            callback();
        };
        xdr.onerror = function () {
            if (typeof callback != "function") {
                return;
            }
            callback();
        };
        xdr.send(data);
    } else {
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json",  //有的时候jsonp也是一个选择
            crossDomain: true,
            success: function (reData) {
                if (typeof callback != "function") {
                    return;
                }
                callback(reData);
            },
            error: function (e) {
                if (typeof callback != "function") {
                    return;
                }
                callback();
            },
            complete: function (e) {

            },
            beforeSend: function (xhr) {

            }
        });
    }
};


function MDPostData(http, url, postData, callback) {
    var header = {};
    http.post(url, postData, header)
		.success(function (data) {
		    callback(data);
		})
		.error(function () {
		    callback(undefined);
		});
};
Array.prototype.contains = function (item) {
    return RegExp(item).test(this);
};
//get element top value
function elTop(el) {
    var offsetTop = el.offsetTop;

    while (el = el.offsetParent) {
        offsetTop += el.offsetTop;
    }
    return offsetTop;
};
//url params
function query(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return "";
};
//qt params
function queryQt(name) {
    var qt = query("qt");
    var reg = new RegExp("(^|;)" + name + "\:([^;]*)(;|$)", "i");
    var r = qt.match(reg);
    if (r != null) return r[2]; return "";
};
function queryParams() {
    var qt = query("qt");
    var reg = new RegExp("(^|;)(\\d{4,})(\:|$)", "g");
    var r = qt.match(reg);

    if (r != null) return r;
};
var getUrlParams = function () {
    var args = [];
    var query = decodeURI(location.search.substring(1));
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1)
            continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        args[argname] = value;
    }
    return args;
};
//data page
function pageWrap(wrapId, page, count, total, callback) {
    if (page <= 0) page = 1;
    if (count <= 0) count = 10;
    var pageNums = (total <= 0) ? 1 : Math.ceil(total / count);
    var pageEnd = (page <= 5) ? ((pageNums < 10) ? pageNums : 10) : ((pageNums < (page + 5)) ? pageNums : (page + 5));
    var pageStart = (pageEnd <= 9) ? 1 : (pageEnd - 9);
    var wrap = $("#" + wrapId), sb = new Array(), memo = wrap.attr("memo");

    sb.push("<ul class=\"pagenav-list\">");
    for (var p = pageStart; p <= pageEnd; p++) {
        sb.push("<li class=\"nav" + ((p == page) ? " selected" : "") + ((p == pageStart) ? " first" : "") + ((p == pageEnd) ? " end" : "") + "\">" + p + "</li>");
    }
    sb.push("<li><input type=\"text\" class=\"jump-nums\" /><span class=\"jump-btn\">跳转</span></li>");
    if (total) {
        sb.push("<li>共 <span class=\"h\">" + total + "</span> 条" + (memo ? memo : "数据") + "</li>");
    }
    sb.push("</ul>");
    wrap.html(sb.join(''));
    if (callback && !wrap.hasClass("jp")) {
        wrap.addClass("jp").on("click", "li.nav", function () {
            var cp = parseInt($(this).html());
            if (!isNaN(cp) && cp != page) {
                callback(page = cp, count);
            }
        })
            .on("click", ".jump-btn", function () {
                var cp = parseInt($(this).prev("input.jump-nums").val());
                if (!isNaN(cp) && cp != page) {
                    callback(page = cp, count);
                }
            });
    }
};
//event
function addEvent(eventText, eventHandler) {
    if (document.all) {
        window.attachEvent("on" + eventText, eventHandler);
    } else {
        window.addEventListener(eventText, eventHandler, true);
    }
};
function removeEvent(eventText, eventHandler) {
    if (document.all) {
        window.detachEvent("on" + eventText, eventHandler);
    } else {
        window.removeEventListener(eventText, eventHandler, true);
    }
};
 
//window scroll event
var $$el = function (el) {
    return new $$el.instance(el);
};
$$el.instance = function (el) {
    this.list = $(el);
    this.list.each(function (ix, e) {
        e.isLoaded = false;
    });
};
$$el.instance.prototype.listenScroll = function (callback) {
    var elList = this.list, scrollTimer;
    var listenCount = elList.length;
    var scrollEvent = function () {
        var bd_top = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
        var seeY = window.innerHeight || document.documentElement.clientHeight; //浏览器可视区域高度
        bd_top += seeY - 10;

        $.each(elList, function (ix, e) {
            if (!e.isLoaded && (e.initTop = elTop(e)) <= bd_top) {
                callback(e); e.isLoaded = true; listenCount -= 1;
            }
        });
        if (listenCount <= 0) {
            removeEvent("scroll", scrollEvent);
        }
    };
    scrollEvent();
    addEvent("scroll", scrollEvent);
    return this;
};
$$el.instance.prototype.autoFixed = function (callback) {
    var elList = this.list, fixedTimer;
    var scrollEvent = function () {
        if (fixedTimer) {
            clearTimeout(fixedTimer);
        }
        fixedTimer = setTimeout(function () {
            var bd_top = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
            var isfixed = false;

            for (var i = elList.length - 1; i >= 0; i--) {
                var e = elList[i];
                if (!isfixed && (e.initTop = elTop(e)) <= bd_top) {
                    if ($(e).next(".fixed").length == 0) {
                        $(e).after($(e).clone(true).addClass("fixed").css("width", $(e).width() + "px"));
                    }
                    isfixed = true;
                } else {
                    $(e).show().next(".fixed").remove();
                }
            }
        }, 100);
    };
    addEvent("scroll", scrollEvent);
};
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
function GetDate(val, isTime) {
    var dt = (val - 621355968000000000 - 8 * 3600 * 10000000) / 10000;

    var dayFormat = new Date(dt).Format("yyyy-MM-dd");
    var timeFormat = new Date(dt).Format("HH:mm");
    var nowDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
    var yesterday = new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDate();

    if (dayFormat == nowDate) {
        if (isTime == false) {
            return "今天";
        }
        else {
            return "今天 "+timeFormat;
        }
    }
    else if (dayFormat == yesterday) {
        if (isTime == false) {
            return "昨天";
        }
        else {
            return "昨天 " + timeFormat;
        }
    }
    else {
        return dayFormat + " " + timeFormat;
    }
};