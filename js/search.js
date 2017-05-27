var options = ["s601", "s602", "s700", "s701", "s703", "s704"], params = [], qt = [], needChangeUrl = true, baseUrl = "http://www.maidiyun.com/search/?";
function initParams() {
    initEvents();
};
var backWindowEvent = function (e) {
    initParams();
    refreshData(true);
};
function initEvents() {
    $("#msrp-content div.row:eq(0)").addClass("row-first");
    $("#msrp-content div.row a.item").click(function () { itemClick($(this)); });
    $("#msrp-content div.crump>a.pro").click(function () {
        var key = $(this).attr("key");
        qt["s" + key] = "";
        if (key == "601") {
            for (var k in qt) {
                var keyIndex = parseInt(k.substr(1));

                if (keyIndex >= 1000) qt["s" + keyIndex] = "";
            }
        }
        refreshData();
    });
    $("#msrp-content div.overlay div.btns span.btn-red").click(function () {
        var proId = $("#msrp-content div.has-overlay span.trigger-over").attr("data-idx");
        var values = [];
        $(this).parent().prev().find("a.selected").each(function () {
            values.push($(this).attr("title"));
        });
        qt["s" + (parseInt(proId) + 1000)] = values.join(",");
        refreshData();
    });
    $("#msrp-content div.overlay div.btns span.btn-white").click(function () {
        $("#msrp-content div.overlay a.selected").removeClass("selected");
    });
    $("#msrp-content div.has-overlay span.trigger").mouseenter(function () {
        $(this).parent().find("span.trigger-over").removeClass("trigger-over");
        var proId = $(this).addClass("trigger-over").attr("data-idx");
        var overLay = $("#msrp-content div.overlay").show();
        overLay.css("top", (this.offsetTop + 36) + "px");
        overLay.find("a[data-idx!=" + proId + "]").hide();
        overLay.find("a[data-idx=" + proId + "]").show();
    });
    $("#msrp-content div.has-overlay").mouseleave(function () {
        $(this).find("span.trigger-over").removeClass("trigger-over");
        $(this).find("a.selected").removeClass("selected");
        $(this).find("div.overlay").hide();
    });
    $("#msrp-content .x-clear:eq(0)").click(function () {
        $(this).parent().find(".pro").each(function () {
            qt["s" + $(this).attr("key")] = "";
        });
        qt["s703"] = "";
        qt["s704"] = "";
        refreshData();
    });
    $("#msrp-content .x-switch:eq(0)").click(function () {
        if ($(this).hasClass("shop")) {
            params["app"] = "shop";
        } else {
            params["app"] = "";
        }
        refreshData();
    });
    $("#msrp-content .x-collapse:eq(0)").click(function () {
        if ($(this).html() == "收起筛选") {
            $(this).html("展开筛选");
        } else {
            $(this).html("收起筛选");
        }
        $("#msrp-content .groups:eq(0)").toggle();
    });
    $("#msrp-content .sort>.link").click(function () {
        params["psort"] = $(this).attr("data-idx");
        refreshData();
    });
    $("#msrp-content .pager .icon-btn-prev").parent().click(function () {
        var pager = $("#msrp-content .pager");
        var cp = parseInt(pager.find(".cpage").html());
        if (cp > 1) {
            params["page"] = (cp - 1);
            refreshData();
        }
    });
    $("#msrp-content .pager .icon-btn-next").parent().click(function () {
        var pager = $("#msrp-content .pager");
        var cp = parseInt(pager.find(".cpage").html());
        var tp = parseInt(pager.find(".tpage").html());
        if (cp < tp) {
            params["page"] = (cp + 1);
            refreshData();
        }
    });
    $("#msrp-content div.row span.show-mode").click(function () {
        var more_text = $(this).html();
        if (more_text == "更多") {
            $(this).html("收起").closest("div.row").find("div.items").addClass("expand-mode");
        } else {
            $(this).html("更多").closest("div.row").find("div.items").removeClass("expand-mode");
        }
    });
    if (typeof endLoadedWindow == "function") endLoadedWindow();
};
areaChanged = function (province, city, district) {
    if (province == "全国") province = "";
    qt["s703"] = province;
    qt["s704"] = city;
    refreshData();
}
var itemClick = function (This) {
    var row = This.closest("div.row");
    var key = row.attr("key");

    if (key == "1000") {
        This.toggleClass("selected");
    } else {
        qt["s" + key] = This.attr("value");

        refreshData();
    }
};
var isListenBackEvent = false;
function refreshData(isback, callback) {
    var url = getUrl();
    refreshDataResult(url, callback);
};
function refreshDataResult(url, callback) {
    var responseType = params["type"], compid = params["compid"];
    if (!responseType && compid) {
        $.get(url, function (s) {
            $("#msrp-content").html(s);
            initEvents();
            if (callback) callback();
        });
    } else {
        $("#msrp-content").load(url + " #msrp-content", function () {
            initEvents();
            if (callback) callback();
        });
    }
};
function getUrl() {
    var url = new Array();
    url.push(baseUrl);
    url.push(getParamStr("q"));
    url.push(getParamStr("type"));
    url.push(getParamStr("compid"));
    url.push(getParamStr("pkgid"));
    url.push(getParamStr("gid")); //分组
    url.push(getParamStr("page"));
    url.push(getParamStr("app"));
    url.push(getParamStr("psort"));
    url.push("qt=");

    for (var key in qt) {
        url.push(getKeyStr(key));
    }
    return url.join("");
};
function getParamStr(name) {
    var value = params[name];

    if (value && value != "") {
        return name + "=" + escape(value) + "&";
    }
    return "";
};
function getKeyStr(key) {
    var value = qt[key];

    if (value && typeof value == "string" && value != "") {
        return escape(key.substr(1) + ":" + value + ";");
    }
    return "";
};
