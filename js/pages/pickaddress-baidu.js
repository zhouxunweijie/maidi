/***初始化信息--start--***/
var model = avalon.define({
	$id: "myCtl",
	Province: "",
	City: "",
	District: "",
	Address: "", //详细地址
	LabelAddress: "",
	MapLng: "",
	MapLat: "",
	LocalLng: "",
	LocalLat: "",
	CLng: "",
	CLat: "",
	SearchAddr: "",
	SearchResult: "", //查询结果
	SearchAddress: "",
	IsShowSearch: 0,
	IsShowPick: 0,
	IsShowFooter: 0,
	IsLoadedMap: true,
	IsLocation: true,
	show: true,
	CProvince: "",
	CCity: "",
	CDistrict: "",
	result:{},
	getCode:function(){
    var str = model.Province + model.City + model.District + model.Address;
    myGeo.getPoint(str, function(point){
        console.log(point);
        if (point) {
            getLocationInfo(point)
        }else{
            alert("您选择地址没有解析到结果!");
        }
    });
}
});

	console.log("???????")
    model.CLng = query("lng");
    model.CLat = query("lat");

    model.Province = query("Province").replace("省", "")
    model.City = query("City").replace("市", "");
    model.Address = query("address");
    model.District = query("District");
    model.chooseIdx = 3;
    model.level = 3;
    console.log(model);

    if(model.Province){
    	getCode()
	}

    initCityPicker()



/***初始化信息--end--***/

/***百度地图--start--***/

//初始化百度地图
function initBaiDuMap() {
	map = new BMap.Map("map_container");

	var top_right_navigation = new BMap.NavigationControl({
		anchor: BMAP_ANCHOR_TOP_RIGHT,
		type: BMAP_NAVIGATION_CONTROL_SMALL
	}); //右
	map.addControl(top_right_navigation);
	var point = new BMap.Point(116.404, 39.915);
	map.centerAndZoom(point, 15);


	map.addEventListener("dragend", function() {
		var point = map.getCenter();
		getLocationInfo(point, "", false);
		model.IsShowFooter = 1;
		model.MapLat = point.lat;
		model.MapLng = point.lng;


	});

	map.addEventListener("zoomend", function() {
		map.centerAndZoom(new BMap.Point(model.CLng, model.CLat), map.getZoom());
	});

	map.addEventListener("touchend", function() {
		document.body.querySelector("#divAddr").blur();
	});

	map.addEventListener("tilesloaded", function() {
		model.IsLoadedMap = true;
	});

}
initBaiDuMap();

function getCode(){
    myGeo = new BMap.Geocoder();
    var str = model.Province + model.City + model.District + model.Address;
    myGeo.getPoint(str, function(point){
        console.log(point);
        if (point) {
            getLocationInfo(point)
        }else{
            alert("您选择地址没有解析到结果!");
        }
    });
}


//获取定位
function getLocation() {
	getGeocode(function(geo) {
		console.log(geo);
		hideWaiting();
		if(geo) {
			getLocationInfo(new BMap.Point(geo.longitude, geo.latitude), (geo.street + geo.poiName), true);
		} else {
			mui.toast("定位失败!");
			var point = map.getCenter();
			model.CLat = point.lat;
			model.CLng = point.lng;
			getLocationInfo(point, "");
		}
	});
};


//获取定位信息
function getLocationInfo(point, address, isLocation, province, city, district) {
	if(point.lng == 0 || point.lat == 0) {
		return;
	}
	 map.centerAndZoom(point, map.getZoom());

	var url = "http://api.map.baidu.com/geocoder/v2/?location=" + point.lat + "," + point.lng + "&output=json&pois=1&ak=9c4caff586a3366ce9bcdb670e14ad5d";
	$.ajax({
		url: url,
		headers: {
			"Access-Control-Allow-Origin": "*"
		},
		dataType: "jsonp",
		type: "get",
		success: function(res) {
			model.result = res.result.addressComponent;
			model.CLat = res.result.location.lat;
			model.CLng = res.result.location.lng;
			// model.Province = res.result.province;
			// model.City = res.result.city;
			// model.District = res.result.district;
			model.LabelAddress = model.result.street + model.result.street_number;

			if(isLocation) {
				if(!model.LocalLat) {
					model.LocalLat = res.result.location.lat;
				}
				if(!model.LocalLng) {
					model.LocalLng = res.result.location.lng;
				}
			} else {

			}
		}

	});
};

$("#btnConfirm").on("click", function() {
    model.IsShowFooter = 0;
    model.Province = model.result.province.replace("省", '');
    model.City = model.result.city.replace('市', '');
    model.District = model.result.district;
    model.Address = model.result.street + model.result.street_number;
    $("#Province").text(model.Province + model.City + model.District);
})


//
// 	//地图搜索点击
document.body.querySelector(".div-search").addEventListener("tap", function() {
	document.body.querySelector(".search_box").style.display = "block";
	model.SearchAddress = "";
	model.SearchResult = [];
	model.IsShowSearch = 1;

});
//
// 	//根据关键字搜索
document.body.querySelector("#btn-search-map").addEventListener("tap", function() {
	if(!model.SearchAddress) {
		alert("请输入关键字!");
		return;
	}
	document.body.querySelector("#it_search").blur();
	localSearch.search(model.SearchAddress);
});
//

// 	//确定按钮
// document.querySelector("#btnCancle").addEventListener("click", function() {
// 	model.IsShowFooter = 0;
// 	console.log(model.$model)
// });

//初始化城市选择
function initCityPicker() {
	$("body").on("click", ".chooseArea", function() {
			$(".main-box").css({
				display: "block"
			}).animate({
				top: 188
			}, 1000)
		// showPickArea();
	});
};

//保存
// function ev_save() {

	// if(model.IsShowFooter == 1) {
	// 	layer.msg("地图中的位置发生了改变，是否使用此地址？", {
	// 		btn: ["确定", "取消"],
	// 		yes: function(e) {
	// 			if(e.index == 0) {
	// 				// model.IsShowFooter = 0;
	// 				model.Address = model.LabelAddress;
	// 				model.Province = model.CProvince;
	// 				model.City = model.CCity;
	// 				model.District = model.CDistrict;
	// 				model.MapLng = model.CLng;
	// 				model.MapLat = model.CLat;
    //
	// 				ev_save();
	// 				return
	// 			}
	// 		}
	// 	})
	// }

	// if(isNetWorkCanUse()) {
	// 	if(!model.MapLat && !model.MapLng) {
	// 		alert("请选择地址!");
	// 		return;
	// 	}
	// }
	// if(!model.Province || !model.City) {
	// 	alert("请选择所在地市!");
	// 	return;
	// }
    //
	// if(!model.Address.trim() || /\s+/g.test(model.Address)) {
	// 	alert("请输入详细地址!");
	// 	return;
	// }

	//触发上一个页面的getArea事件
// 	var tempData = {
// 		"Province": model.Province,
// 		"City": model.City,
// 		"District": model.District,
// 		"Address": model.Address.trim(),
// 		"Lat": model.MapLat,
// 		"Lng": model.MapLng,
// 	};
//
// };

$("#btn_save").on("click", function() {
	var Reg = /(\w+):\/\/([^/:]+)(:\d*)?([^# \?$]*)/;
	var temp = Reg.exec(document.referrer);
	var urlArray = temp[4].split("/");
	var finalUrl = urlArray[urlArray.length-1];
	window.location.href = encodeURI(finalUrl + "?Province=" + model.Province + "&City=" + model.City + "&District=" + model.District + "&Address=" + model.Address + "&FromMap=true")
})


