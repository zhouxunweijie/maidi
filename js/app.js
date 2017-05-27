var MDApp = {
	url: {
		api: "http://api.maidiyun.com",//42.96.210.38:81		
		video: "http://www.maidiyun.com",
		pic: "http://pic.maidiyun.com",//42.96.210.38:82
		home: "http://wap.maidiyun.com",
		code: "http://www.maidiyun.com?m=",
        m:"http://m.maidiyun.com/"
	}
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

var getUrlParams = function() {
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
var header = { };

function MDLoadData(http, url, callback) {
	var header = {};
	http.get(url, header)
		.success(function(data) {
			callback(data);
		})
		.error(function() {

			callback(undefined);
		});
};

function MDPostData(http, url, postData, callback) {
	var header = {};
	http.post(url, postData, header)
		.success(function(data) {
			callback(data);
		})
		.error(function() {
			callback(undefined);
		});
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