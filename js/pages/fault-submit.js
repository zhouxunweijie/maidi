var app = avalon.define({
    $id: "appCtl",
    ImgUrl: MdAppUrl.Img,

    /**提交数据信息**/
    postData: {
        IsHasAudio: 0, //是否有语音
        AudioLength: 0, //语音长度
        MdCode: query("code"), //产品码
        Description: "", //故障简介
        ProdInnerCode: "", //产品内部码
        ReportType: "", //报修类型
        ProdID: "", //产品编号
        ProdName: "", //产品名称
        ProdCompID: "", //产品所属厂家
        SkuName: "", //产品型号名称
        Province: "", //省
        City: "", //市
        District: "", //区
        Address: "", //产品地址
        MapLng: "", //地址经度
        MapLat: "", //地址纬度
        JobType: 1, //维修类型
        JobFrom: "1",
        ReportCompID: "", //报修企业编号
        ReportCompName: "", //报修企业名称
        ReportUserID: "", //报修用户编号
        ReportUserName: "", //报修用户名
        ReportPhone: "", //报修电话
        RcvUserList: [], //报修服务人员
    },

    /**不需要提交的数据**/
    other: {
        Photos: [], //报修的图片信息
        workId: "", //工单号
        taskId: "", //任务号
        splicePhoto: [],
        time: "",
        token: ""
    },

    IsLoadProdInfo: false,
    IsGeo: false,

    /**服务单位信息**/
    service: {
        AsssCompID: 0, //服务单位编号
        AsssDeptID: 0, //服务专员部门编号
        AsssUserID: 0, //服务专员编号
        AsssUserName: "", //服务专员姓名
        AsssName: "", //服务单位名称
        AsssProvince: "", //服务单位省
        AsssCity: "",
        AsssDistrict: "",
        AsssAddress: "",
        AsssDistance: "", //距您距离
        AsssType: 0, //0未选择  1服务专员 2服务站
    },
    /**提交步骤**/
    Process: {
        ProcessList: [{
            Text: "提交故障信息",
            State: 0, //0未执行 1执行中 2完成 3失败
        }, {
            Text: "上传图片",
            State: 0,
            Index: 0
        }]
    }
});
var fileData = []; //file文件对象

$("#faultMemo").on("blur",function(){
        app.postData.Description = $(this).text();
})


avalon.filters.contractAddress = function contractAddress(province, city, district, address) {
    province = province || "";
    city = city || "";
    district = district || "";
    address = address || "";

    address = address.replace(province, "");
    address = address.replace(city, "");
    address = address.replace(district, "");

    if (province == city) {
        return province + " " + district + " " + address;
    } else {
        return province + " " + city + " " + district + " " + address;
    }
};

$(function () {

    //获取本地消息
    //setTimeout(getLocal, 400);

    setTimeout(function () {
        loadProdInfo(app.postData.MdCode);
    }, 300);

    user.ready(function () {
        app.postData.ReportUserID = user.id;
        app.postData.ReportUserName = user.name;
        app.postData.ReportCompID = user.compid;
        app.postData.ReportCompName = user.compname;
        app.postData.ReportType = user.compid > 0 ? 2 : 1;

        app.other.token = user.token;
    });

    //获取定位信息
    setTimeout(getAddr, 500);

    //初始化事件
    initEvent();
});

//获取本地信息
function getLocal() {

    var info = localGet("fault-submit", 1);
    if (info > 0) {
        app.postData = info;
    }

    //不需要提交的信息
    info = localGet("fault-sbmit-other", 1);
    if (info) {
        app.other = info;
    }

    //获取服务信息
    info = localGet("fault-submit-service", 1);
    if (info) {
        app.service = info;
    }

    //获取文件地址
    info = localGet("fault-sumit-file", 1);
    if (info) {
        fileData = info;
    }
};

//保存信息到本地
function saveLocal() {
    //存储需要提交的数据
    localSave("fault-sumit", app.postData);

    //存储其他的数据
    localSave("fault-submit-other", app.other);

    //存储服务信息
    localSave("fault-submit-service", app.service);

    //存储文件消息
    localSave("fault-submit-file", fileData);
};

//获取定位信息
function getAddr() {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {

            trasnforPoint(r);
        } else {

        }
    }, { enableHighAccuracy: true })
};

//将坐标点转换为真实的地址
function trasnforPoint(r) {
    var geo = new BMap.Geocoder();

    geo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function (res) {

        if (res) {
            app.IsGeo = true;
            app.postData.Province = res.addressComponents.province;
            app.postData.City = res.addressComponents.city;
            app.postData.District = res.addressComponents.district;
            app.postData.Address = res.addressComponents.street;
            app.postData.MapLat = res.point.lat;
            app.postData.MapLng = res.point.lng;

            if (app.IsLoadProdInfo) {
                getDefaultServiceStation();
            }
            if (app.other.time) {
                window.clearInterval(app.other.time);
            }
        } else {
            app.other.time = setInterval(getAddr, 1000);
        }

    }, { poiRadius: 10, numPois: 1 });
};

//通过迈迪码获取产品概要信息
function loadProdInfo(code) {
    var url = MdAppUrl.Api45 + "/api/v1.0/MdCode/GetProdInfoByMdCode?code=" + code;
    getAjaxData(url, function (res) {
        if (res.State == 1 || res.State == 2) {
            app.postData.ProdID = res.Data.ProdID;
            app.postData.ProdName = res.Data.ProdName;
            app.postData.SkuName = res.Data.SkuName;
            app.postData.ProdCompID = res.Data.CompID;
            app.postData.ProdCompName = res.Data.CompName;

            app.IsLoadProdInfo = true;
            app.service.AsssType = 0;

            if (app.IsGeo) {
                getDefaultServiceStation();
            }

            //获取出厂编号
            setTimeout(function () {
                getInnerCodeByMdCode(code);
            }, 300);
        } else {

        }
    })
};

//根据迈迪码获取内部码
function getInnerCodeByMdCode(mdCode) {
    var url = MdAppUrl.Api45 + "/api/v1.0/MdCode/GetInnerRelationByMdCode?MdCode=" + mdCode;
    getAjaxData(url, function (reData) {
        if (reData && reData.Data && reData.State == 1) {
            app.postData.ProdInnerCode = reData.Data.InnerCode;
        } else { }
    }, false);
};

//获取默认的服务单位
function getDefaultServiceStation() {
    //没有 token则不获取 
    if (!user.token) {
        return;
    }

    if (!app.postData.Province || !app.postData.ProdCompID) {
        return;
    }
    var url = MdAppUrl.Api45 + "/api/v1.0/ServiceStation/GetServiceStation?compId=" + app.postData.ProdCompID;
	var province = app.postData.Province.replace(/(.*)省|壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区/, '$1');
	var city = app.postData.City.replace(/(.*)市/, '$1');
    var data = {
        Province: province,
        City: city,
        MapLat: app.postData.MapLat,
        MapLng: app.postData.MapLng
    }
    postAjaxData(url, data, function (e) {
        if (e.Data) {
            var station = e.Data.DefaultUser;
            //如果不存在默认负责人，则使用默认服务站
            if (!station || !station.UserID) {
                station = e.Data.DefaultStation;

                if (!station) {
                    if (e.Data.Stations.length == 0) {
                        layer.open({ content: "无法在线报修，该设备厂家未设置在线售后服务网点！" });
                        return;
                    } else {
                        station = e.Data.Stations[0];
                    }
                }
                app.service.AsssType = 2;
                app.service.AsssCompID = station.Leader.RcvCompID;
                app.service.AsssDeptID = station.Leader.RcvDeptID;
                app.service.AsssUserID = station.Leader.RcvUserID;
                app.service.AsssUserName = station.Leader.RcvUserName;
                app.service.AsssName = station.Name;
                app.service.AsssProvince = station.Province;
                app.service.AsssCity = station.City;
                app.service.AsssDistrict = station.District;
                app.service.AsssAddress = station.Adderss;
                app.service.AsssDistance = formatM2KM(station.Instance);
            } else {
                app.service.AsssType = 1;
                app.service.AsssCompID = station.CompID;
                app.service.AsssDeptID = station.OrgID;
                app.service.AsssUserID = station.UserID;
                app.service.AsssUserName = station.RealName;
                app.service.AsssProvince = "";
                app.service.AsssDistance = "";
            }
        }
    }, true);
};

//switch点击事件
var clickType = function (key) {
    $(key).on("click", "a", function () {
        $(this).addClass("md-active");
        $(this).siblings("a").removeClass("md-active");
        var Id = $(this).attr("dataId");
        if (key == "#jobType") {
            app.postData.JobType = Id;
        } else {
            app.postData.ReportType = Id;
        }
    })
};

//初始化界面事件
function initEvent() {
    //报修类型选择
    clickType("#jobType");

    //报修单位选择
    clickType("#reportComp");

    //问题描述 plancehodel
    $("#faultMemo").on("focus", function () {
        $(this).siblings("span").text("")
    }).on("blur", function () {
        if ($(this).text() == "") {
            $(this).siblings("span").text("请输入问题描述")
        }
    });

    //上传图片
    $("#phoneFile").on("change", function (e) {
        var file = this.files[0];
        var reader = new FileReader();
        switch (file.type) {
            case 'image/jpg':
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
                reader.readAsDataURL(file);
                break;
        }

        $(reader).on('load', function () {
            //         如果说让读取的文件显示的话 还是需要通过文件的类型创建不同的标签
            switch (file.type) {
                case 'image/jpg':
                case 'image/png':
                case 'image/jpeg':
                case 'image/gif':
                    app.other.Photos.push({
                        name: file.name,
                        src: reader.result,
                        size: file.size,
                        type: file.type,
                        lastModified: file.lastModified
                    });

                    break;
            }
        });

        fileData.push(file);
    });


	$(".data-row").on("click", ".removes", function() {
		var index = $(this).attr("index");
		app.other.Photos.splice(index, 1);
		fileData.splice(index, 1);
	});
    $("#selAddress").on("click", function () {
        mapAddress.show({
            Province: app.postData.Province,
            City: app.postData.City,
            District: app.postData.District,
            Address: app.postData.Address,
            MapLng: app.postData.MapLng,
            MapLat: app.postData.MapLat
        }, function (res) {
            if (res) {
                app.postData.Province = res.Province;
                app.postData.City = res.City;
                app.postData.District = res.District;
                app.postData.Address = res.Address;
                app.postData.MapLng = res.MapLng;
                app.postData.MapLat = res.MapLat;

                //重新获取服务地址
                getDefaultServiceStation();
            }
        });
    });

    //点击提交 提交data
    $(".mui-btn-block").click(function () {
        app.postData.Description = $("#faultMemo").text();
        //验证数据是否有误
        validateData();
    });

    $(".notice").on("click", ".retry", function () {
        var method = this.getAttribute("method");

        eval(method + "()");
    }).on("clicl", ".closeNotice", function () {
        $(".notice").hide();
        app.Process.ProcessList[0].State = 0;
        app.Process.ProcessList[1].State = 0;
    });

};

//验证数据
function validateData() {
    //问题描述是否为空
    if (app.postData.Description.replace(/\s/, '') == "") {
        layer.open({ content: "请输入文字描述！", skin: "msg", time: 2 });
        $("#faultMemo").focus();
        return;
    }
    else if (app.postData.Description.replace(/\s/, '').length > 200) {
        layer.open({ content: "文字描述过长，200字以内！", skin: "msg", time: 2 });
        return;
    }

    //报修单位是否为空
    if (app.postData.ReportType == 2 && app.postData.ReportCompName.replace(/\s/, '') == "") {
        layer.open({ content: "请输入您的报修单位！", skin: "msg", time: 2 });
        $("#it-reportcompname").focus();
        return;
    }

    //报修人是否为空
    if (app.postData.ReportUserName.replace(/\s/, '') == "") {
        layer.open({ content: "请输入您的姓名！", skin: "msg", time: 2 });
        $("#it-reportusername").focus();
        return;
    }
    else if (app.postData.ReportUserName.replace(/\s/, '').length > 10) {
        layer.open({ content: "您输入的姓名过长，10个字以内！", skin: "msg", time: 2 });
        return;
    }

    //手机号不能为空

    if (app.postData.ReportPhone.replace(/\s/, '') == "") {
        layer.open({ content: "请输入您的手机号！", skin: "msg", time: 2 });
        $("#it-reportphone").focus();
        return;
    }
    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    var flag = reg.test(app.postData.ReportPhone);
    if(!flag){
        layer.open({ content: "请输入您正确的手机号！", skin: "msg", time: 2 });
        $("#it-reportphone").focus();
        return;
    }

    //报修地址  经纬度 不能为空
    //if (!app.postData.MapLat || !app.postData.MapLng) {
    //    layer.open({ content: "请修改您的报修地址！", skin: "msg", time: 2 });
    //    return;
    //}

    //判断当前是否登录
    if (user.token) {
        submitData()
    } else {
        chooseUser.show(function () {
            user.reload();

            app.other.token = user.token;
            if (user.token) {
                //重新获取服务站
                getDefaultServiceStation();
            }
        });
    }

    return true;
};

//提交数据
function submitData() {
    //失去焦点
    document.activeElement.blur();

    //显示提交步骤
    $(".notice").show();

    //正式提交数据
    app.Process.SaveState = 2;

    //提交故障信息
    submitFailt();

};

//提交故障信息
function submitFailt() {
    //提交故障报修信息
    app.Process.ProcessList[0].State = 1;
    console.log(app.postData.$model);
    var url = MdAppUrl.Api45 + "/api/v1.0/WorkOrder/ReportWorkOrder";
    postAjaxData(url, app.postData, function (e) {
        if (e.State == 1) {
            app.Process.ProcessList[0].State = 2;
            app.other.workId = e.Data.WorkOrderId;
            app.other.taskId = e.Data.TaskId;

            //上传图片
            uploadImage();

        } else {
            app.Process.ProcessList[0].State = 3;
            layer.open({ content: e.ErrorMessage, skin: "msg", time: 2 });
        }
    });
};

//上传图片
function uploadImage() {
    app.Process.ProcessList[1].State = 1;

    if (app.other.Photos.length == 0) {

        app.Process.ProcessList[1].State = 2;

        //上报成功
        gotoSuccess();

        return;
    }

    app.Process.ProcessList[1].State = 1;

    postImg();
};

//提交image 到服务器
function postImg() {

    if (app.Process.ProcessList[1].Index == app.other.Photos.length) {
        app.Process.ProcessList[0].State = 2;
        gotoSuccess();
        return;
    }

    var url = MdAppUrl.Api45 + "/api/v1.0/WorkOrder/SaveWorkOrderImg?workOrderId=" + app.other.workId + "&userId=" + user.id;

    var formData = new FormData();

    formData.append("form", fileData[app.Process.ProcessList[1].Index]);

    $.ajax({
        url: url,
        type: "post",
        cache: false,
        headers: { Authorization: "Bearer " + user.token },
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res && res.State >= 1) {
                app.Process.ProcessList[1].Index += 1;
                postImg();
            } else {
                app.Process.ProcessList[1].State = 3;
            }

        },
        error: function () {
            app.Process.ProcessList[1].State = 3;
        }
    })
};

//提报成功
function gotoSuccess() {
    setTimeout(function () {
        window.location.replace("submit-success.html");
    }, 500);
};

//格式化距离
function formatM2KM(m) {
    if (m < 1000) {
        return m + "m";
    }
    return (m / 1000) + "km";
}

//转换表情
function TransEmotion(str) {
    var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
    str = str.replace(patt, function (char) {
        var H, L, code;
        if (char.length === 2) {
            H = char.charCodeAt(0);
            L = char.charCodeAt(1);
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
}