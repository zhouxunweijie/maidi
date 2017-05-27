var mapAddressCtl = avalon.define({
	$id: "mapAddressCtl",
	/**地址对象**/
	Address: {
		Province: "",
		City: "",
		District: "",
		Address: "",
		MapLng: "",
		MapLat: ""
	},
	/***控制对象***/
	Control: {
		IsShowSearch: 0,
		IsShowFooter: 0,
		IsLocation: false,
	},
	Picker: {
		province: "",
		city: "",
		district: "",
		provinceList: [],
		cityList: [],
		districtList: [],
		chooseIdx: 0,
		level: 0,
		isReturn: false,
	},
	Map: {
		Province: "",
		City: "",
		District: "",
		Address: "",
		MapLng: "",
		MapLat: "",
		LocationLng: "",
		LocationLat: "",
		IsLoadedMap: 0,
		SearchAddress: "",
		SearchResult: [],
		IsShowSearch: 0
	}
});

avalon.filters.contractAddress = function contractAddress(province, city, district, address) {
	province = province || "";
	city = city || "";
	district = district || "";
	address = address || "";

	address = address.replace(province, "");
	address = address.replace(city, "");
	address = address.replace(district, "");

	if(province == city) {
		return province + "  " + district + "  " + address;
	} else {
		return province + "  " + city + "  " + district + "  " + address;
	}
};

var mapAddress = {
	callback: "",
	time: "",
	show: function(addrObj, callback) {
		$("#mapAddress-main").addClass("animated").removeClass("slideOutRight").addClass("slideInRight").show();

		var province = addrObj.Province.replace(/(.*)省|壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区/, '$1');
		var city = addrObj.City.replace(/(.*)市/, '$1');

		mapAddressCtl.Map.Province = mapAddressCtl.Address.Province = province || "";
		mapAddressCtl.Map.City = mapAddressCtl.Address.City = city || "";
		mapAddressCtl.Map.District = mapAddressCtl.Address.District = addrObj.District || "";
		mapAddressCtl.Map.Address = mapAddressCtl.Address.Address = addrObj.Address || "";
		mapAddressCtl.Map.MapLat = mapAddressCtl.Address.MapLat = addrObj.MapLat || "";
		mapAddressCtl.Map.MapLng = mapAddressCtl.Address.MapLng = addrObj.MapLng || "";
		mapAddress.callback = callback;
	},
	hide: function() {
		$("#mapAddress-main").removeClass("slideInRight").addClass("slideOutRight");
		$("#mapAddress-main").fadeOut("slow");
	},
	mapCallback: function() {
		if(mapAddressCtl.Control.IsShowFooter == 1) {
			layer.open({
				content: "地图中的位置发生了改变，是否使用此地址？",
				btn: ["确定", "取消"],
				yes: function(idx) {
					mapAddressCtl.Control.IsShowFooter = 0;
					mapAddressCtl.Address.Address = mapAddressCtl.Map.Address;
					mapAddressCtl.Address.Province = mapAddressCtl.Map.Province;
					mapAddressCtl.Address.City = mapAddressCtl.Map.City;
					mapAddressCtl.Address.District = mapAddressCtl.Map.District;
					mapAddressCtl.Address.MapLng = mapAddressCtl.Map.MapLng;
					mapAddressCtl.Address.MapLat = mapAddressCtl.Map.MapLat;
					layer.close(idx);
					mapAddress.mapCallback();
				}
			})

			return;
		}

		if(!mapAddressCtl.Address.MapLat && !mapAddressCtl.Address.MapLng) {
			layer.open({ content: "定位失败！", skin: "msg", time: 2 });
			return;
		}

		if(!mapAddressCtl.Address.Province || !mapAddressCtl.Address.City) {
			layer.open({ content: "请选择所在地市！", skin: "msg", time: 2 });
			return;
		}

		if(!mapAddressCtl.Address.Address.trim() || /\s+/g.test(mapAddressCtl.Address.Address)) {
			layer.open({ content: "请输入详细地址！", skin: "msg", time: 2 });

			return;
		}

		if(mapAddressCtl.Address.Province == "内蒙古自治区") {
			mapAddressCtl.Address.Province = "内蒙古";
		} else if(mapAddressCtl.Address.Province == "新疆维吾尔自治区") {
			mapAddressCtl.Address.Province = "新疆";
		} else if(mapAddressCtl.Address.Province == "广西壮族自治区") {
			mapAddressCtl.Address.Province = "广西";
		} else if(mapAddressCtl.Address.Province == "西藏自治区") {
			mapAddressCtl.Address.Province = "西藏";
		} else if(mapAddressCtl.Address.Province == "宁夏回族自治区") {
			mapAddressCtl.Address.Province = "宁夏";
		} else if(mapAddressCtl.Address.Province == "澳门特别行政区") {
			mapAddressCtl.Address.Province = "澳门";
		} else if(mapAddressCtl.Address.Province == "香港特别行政区") {
			mapAddressCtl.Address.Province = "香港";
		} else {
			mapAddressCtl.Address.Province = (mapAddressCtl.Address.Province || "").replace("省", "");
		}

		if(mapAddressCtl.Address.City == "香港特别行政区") {
			mapAddressCtl.Address.City = "香港";
		} else if(mapAddressCtl.Address.City == "澳门特别行政区") {
			mapAddressCtl.Address.City = "澳门";
		}

		if(typeof(mapAddress.callback) == "function") {
			mapAddress.callback(mapAddressCtl.Address);
		}
		mapAddress.hide();
	},
	pickerCallback: "",
	showPicker: function(addrObj, callback) {
		pickerLoadData(addrObj.Province, addrObj.City, addrObj.District);
		mapAddress.pickerCallback = callback;
		$(".m-cityselect-main").addClass("animated").removeClass("fadeOutDownBig").addClass("fadeInUpBig").show();
	},
	hidePicker: function() {
		mapAddressCtl.Picker.isReturn = false;
		$(".m-cityselect-main").fadeOut("slow");
		$(".m-cityselect-main").removeClass("fadeInUpBig").addClass("fadeOutDownBig");
	},
	pickCallback: function() {
		if(!mapAddressCtl.Picker.isReturn) {
			return;
		}
		if(typeof(mapAddress.pickerCallback) == "function") {
			mapAddress.pickerCallback({
				Province: mapAddressCtl.Picker.province,
				City: mapAddressCtl.Picker.level == 2 ? mapAddressCtl.Picker.province : mapAddressCtl.Picker.city,
				District: mapAddressCtl.Picker.level == 2 ? mapAddressCtl.Picker.city : mapAddressCtl.Picker.district
			});
		}

		mapAddress.hidePicker();
	},
	map: "",
	localSearch: "",
	myGeo: ""
};

//获取地图位置
function getMapAddress() {
	//如果传入了位置则显示传入的位置    
	if(mapAddressCtl.Map.MapLat && mapAddressCtl.Map.MapLng) {
		var point = new BMap.Point(mapAddressCtl.Map.MapLng, mapAddressCtl.Map.MapLat);
		getLocationInfo(point, mapAddressCtl.Map.Address, false);
	}
	//判断是否传入了省市区
	else if(mapAddressCtl.Address.Province || mapAddressCtl.Address.City || mapAddressCtl.Address.District || mapAddressCtl.Address.Address) {
		getPointByAddr();
	}
	//获取定位信息
	else {
		mapAddressCtl.Control.IsLocation = true;
		getLocation();
	}
};

//获取坐标详情
function getLocationInfo(point, address, isLocation, province, city, district) {
	//如果坐标为空直接返回
	if(point.lng == 0 || point.lat == 0) {
		return;
	}

	//设置地图中心点为传入坐标
	mapAddress.map.centerAndZoom(point, mapAddress.map.getZoom());

	//通过接口解析坐标详情
	var url = "http://api.map.baidu.com/geocoder/v2/?location=" + point.lat + "," + point.lng + "&output=json&pois=1&ak=9c4caff586a3366ce9bcdb670e14ad5d";
	$.ajax({
		url: url,
		headers: {
			"Access-Control-Allow-Origin": "*"
		},
		dataType: "jsonp",
		type: "get",
		success: function(res) {
			if(res && res.status == 0) {

				//省市区信息
				mapAddressCtl.Map.Province = res.result.addressComponent.province.replace("省", '').replace('市', '');
				mapAddressCtl.Map.City = res.result.addressComponent.city.replace('市', '');
				mapAddressCtl.Map.District = res.result.addressComponent.district;
				//如果没有传入地址则使用解析后的地址
				if(!address) {
					//判断附近有没有建筑物 如果有建筑物取第一个建筑物 如果没有则取返回的详细地址
					if(res.result.pois.length > 0) {
						address = res.result.pois[0].name;
					} else {
						address = res.result.addressComponent.street + res.result.addressComponent.street_number
					}
				}

				//将详细地址中的省市区替换为空只留下街道地址
				address = address.replace(res.result.addressComponent.province, '');
				address = address.replace(res.result.addressComponent.city, '');
				address = address.replace(res.result.addressComponent.district, '');

				mapAddressCtl.Map.Address = address;
				mapAddressCtl.Map.MapLng = res.result.location.lng;
				mapAddressCtl.Map.MapLat = res.result.location.lat;

				//显示底部使用该地址
				showFooter();

				//是否是定位信息 
				if(isLocation) {
					//如果是定位信息  判断是否有定位信息 没有定位信息则 赋值
					if(!mapAddressCtl.Map.LocationLat) {
						mapAddressCtl.Map.LocationLat = res.result.location.lat;
					}
					if(!mapAddressCtl.Map.LocationLng) {
						mapAddressCtl.Map.LocationLng = res.result.location.lng;
					}
				}
			} else {

			}
		}
	});
};

//逆转地址获得坐标点
function getPointByAddr() {
	var address = "";
	if(mapAddressCtl.Address.Province) {
		address += mapAddressCtl.Address.Province;
	}
	if(mapAddressCtl.Address.City) {
		address += mapAddressCtl.Address.City;
	}
	if(mapAddressCtl.Address.Address) {
		address += mapAddressCtl.Address.Address;
	}

	var url = "http://api.map.baidu.com/geocoder/v2/?address=" + address + "&output=json&ak=9c4caff586a3366ce9bcdb670e14ad5d";
	getAjaxData(url, function(res) {
		if(res && res.status == 0) {
			var point = res.result.location;
			getLocationInfo(new BMap.Point(point.lng, point.lat), mapAddressCtl.Addresss.Address);
		} else {
			mapAddress.map.setCenter(mapAddressCtl.Addresss.Province + mapAddressCtl.Addresss.City + mapAddressCtl.Addresss.District);
			setTimeout(function() {
				var point = mapAddress.map.getCenter();
				getLocationInfo(new BMap.Point(point.lng, point.lat));
			}, 800);
		}
	});
};

//获取定位信息
function getLocation() {
	getGeocode(function(geo) {
		if(geo){
			getLocationInfo(new BMap.Point(geo.longitude, geo.latitude), (geo.street + geo.poiName), true);
		}else{
			layer.open({ content: "定位失败！", skin: "msg", time: 2 });
			var point = mapAddress.map.getCenter();
			mapAddressCtl.Address.MapLat = point.lat;
			mapAddressCtl.Address.MapLng = point.lng;
			getLocationInfo(point, "");
		}
	});
};

//显示底部是否使用该地址
function showFooter() {
	if(mapAddressCtl.Address.MapLat && (mapAddressCtl.Address.MapLng)) {
		if((new Number(mapAddressCtl.Map.MapLat)).toFixed(6) != (new Number(mapAddressCtl.Address.MapLat)).toFixed(6) || (new Number(mapAddressCtl.Map.MapLng)).toFixed(6) != (new Number(mapAddressCtl.Address.MapLng)).toFixed(6)) {
			document.body.querySelector("#mapAddress-main footer").style.display = "block";
			mapAddressCtl.Control.IsShowFooter = 1;
		} else {
			mapAddressCtl.Control.IsShowFooter = 0;
		}
	} else {
		document.body.querySelector("#mapAddress-main footer").style.display = "block";
		mapAddressCtl.Control.IsShowFooter = 1;
	}
};

$(function() {
	$("#mapAddress-main").on("click", ".mui-action-back", function() {
		if(mapAddressCtl.Control.IsShowSearch == 1) {
			mapAddressCtl.Control.IsShowSearch = 0;
		} else {
			mapAddress.hide();
		}

	});

	//初始化百度地图
	initMap();

	//初始化body事件
	initBodyEvent();
});

//初始化百度地图
function initMap() {
	//初始化百度地图
	mapAddress.map = new BMap.Map("map_container");

	//添加右上角控件
	var top_right_navigation = new BMap.NavigationControl({
		anchor: BMAP_ANCHOR_TOP_RIGHT,
		type: BMAP_NAVIGATION_CONTROL_ZOOM
	}); //右
	mapAddress.map.addControl(top_right_navigation);

	//默认先定位到北京中心
	mapAddress.map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);

	//地理解析组件
	mapAddress.map.myGeo = new BMap.Geocoder();

	//添加地图拖拽事件
	mapAddress.map.addEventListener("dragend", function() {
		var point = mapAddress.map.getCenter();
		getLocationInfo(point, "", false);
	});

	// //添加地图zoom事件
	// mapAddress.map.addEventListener("zoomend", function() {
	// 	mapAddress.map.centerAndZoom(new BMap.Point(mapAddressCtl.Map.MapLng, mapAddressCtl.MapLat), mapAddress.map.getZoom());
	// });

	//添加地图touched事件
	mapAddress.map.addEventListener("touchend", function() {
		document.body.querySelector("#divAddr").blur();
	});

	//地图加载完成事件
	mapAddress.map.addEventListener("tilesloaded", function() {
		mapAddressCtl.Map.IsLoadedMap = true;
	});

	//初始化本地搜索
	var options = {
		onSearchComplete: localSerachComplete
	};

	mapAddress.localSearch = new BMap.LocalSearch(mapAddress.map, options);

};

//搜索回掉
function localSerachComplete(results) {
	// 判断状态是否正确
	if(mapAddress.localSearch.getStatus() == BMAP_STATUS_SUCCESS) {
		mapAddressCtl.Map.SearchResult = results.ur;

		if(mapAddressCtl.Map.SearchResult.length == 0) {
			layer.open({ content: "未找到此地址!", skin: "msg", time: 2 });
		}
	} else {
		layer.open({ content: "未找到此地址!", skin: "msg", time: 2 });
	}
};

//初始化body事件
function initBodyEvent() {
	//初始化城市选择控件
	initCityPicker();

	//选择省市区
	$("#mapAddress-main").on("click", ".chooseArea", function() {
		document.body.querySelector("#divAddr").blur();

		mapAddress.showPicker({
			Province: mapAddressCtl.Address.Province,
			City: mapAddressCtl.Address.City,
			District: mapAddressCtl.Address.District
		}, function(res) {
			if(res) {
				mapAddressCtl.Address.Province = res.Province;
				mapAddressCtl.Address.City = res.City;
				mapAddressCtl.Address.District = res.District;
				mapAddressCtl.Address.Address = "";

				mapAddress.map.setCenter(mapAddressCtl.Address.Province + mapAddressCtl.Address.City + mapAddressCtl.Address.District);

				setTimeout(function() {
					var point = mapAddress.map.getCenter();

					getLocationInfo(point, "", "", mapAddressCtl.Address.Province, mapAddressCtl.Address.City, mapAddressCtl.Address.District);
				}, 800);
			}
		});
	});

	//地图搜索点击
	document.body.querySelector(".div-search").addEventListener("click", function() {
		document.body.querySelector(".search_box").style.display = "block";
		mapAddressCtl.Map.SearchAddress = "";
		mapAddressCtl.Map.SearchResult = [];
		mapAddressCtl.Control.IsShowSearch = 1;
	});

	//根据关键字搜索
	document.body.querySelector("#btn-search-map").addEventListener("click", function() {
		if(!mapAddressCtl.Map.SearchAddress) {
			layer.open({ content: "请输入关键字!", skin: "msg", time: 2 });
			return;
		}
		document.body.querySelector("#it_search").blur();
		mapAddress.localSearch.search(mapAddressCtl.Address.Province + mapAddressCtl.Address.City + mapAddressCtl.Map.SearchAddress);
	});

	//地址选择
	$(".search_box .search_result").on("click", ".data-row", function() {
		mapAddressCtl.Control.IsShowSearch = 0;
		var lng = this.getAttribute("data-lng");
		var lat = this.getAttribute("data-lat");
		var address = this.getAttribute("data-addr");

		var point = new BMap.Point(lng, lat);

		getLocationInfo(point, address);
	});

	//返回我的定位信息
	document.querySelector("#location_self").addEventListener("click", function() {
		if(!mapAddressCtl.Map.LocalLat && !mapAddressCtl.Map.LocalLng && !mapAddressCtl.Control.IsLocation) {
			mapAddressCtl.Control.IsLocation = true;
			layer.open({ content: "正在定位...", skin: "msg", time: 2 });
                if (navigator.geolocation) { //判断浏览器是否能获取当前位置
                    navigator.geolocation.getCurrentPosition(function(param){
                    	var page = {};
                        layer.open({ content: "正在"+page.lat+page.lng, skin: "msg", time: 2 });
                        page.lng = param.coords.longitude;
                        page.lat = param.coords.latitude;
                        getLocationInfo(page)
					});
                } else {
                    layer.open({content:"无法自动定位,请输入您的用餐地址",skin:"msg",time:5});
                }
            layer.open({ content: "正在...", skin: "msg", time: 9 });
			getLocation();
			return;
		}

		if(mapAddressCtl.Map.LocalLat == mapAddressCtl.Map.MapLat && mapAddressCtl.Map.LocalLng == mapAddressCtl.Map.MapLng) {
			return;
		}

		var point = new BMap.Point(mapAddressCtl.Map.LocalLng, mapAddressCtl.Map.LocalLat);

		getLocationInfo(point);
	});

	//根据地址解析点
	document.querySelector("#location_addr").addEventListener("click", function() {
		document.body.querySelector("#divAddr").blur();
		setTimeout(function() {
			getPointByAddr();
		}, 500);
	});

	//确定按钮
	document.querySelector("#btnCancle").addEventListener("click", function() {
		mapAddressCtl.Control.IsShowFooter = 0;
	});

	document.querySelector("#btnConfirm").addEventListener("click", function() {
		mapAddressCtl.Control.IsShowFooter = 0;
		mapAddressCtl.Address.Address = mapAddressCtl.Map.Address;
		mapAddressCtl.Address.Province = mapAddressCtl.Map.Province;
		mapAddressCtl.Address.City = mapAddressCtl.Map.City;
		mapAddressCtl.Address.District = mapAddressCtl.Map.District;
		mapAddressCtl.Address.MapLng = mapAddressCtl.Map.MapLng;
		mapAddressCtl.Address.MapLat = mapAddressCtl.Map.MapLat;
	});

	document.querySelector("#btn_save").addEventListener("click", mapAddress.mapCallback);

};

//监视Picker省改变
mapAddressCtl.$watch("Picker.province", function(value) {
	var city = cityData[mapAddressCtl.Picker.province];
	mapAddressCtl.Picker.city = "";
	mapAddressCtl.Picker.cityList = [];
	if(city) {
		mapAddressCtl.Picker.district = "";
		mapAddressCtl.Picker.chooseIdx = 2;
		if(Object.getOwnPropertyNames(city).length == 1) {
			mapAddressCtl.Picker.level = 2;
			mapAddressCtl.Picker.cityList = cityData[mapAddressCtl.Picker.province][mapAddressCtl.Picker.province];
		} else {
			mapAddressCtl.Picker.level = 3;
			for(var i in city) {
				mapAddressCtl.Picker.cityList.push(i);
			}
		}
	} else {
		mapAddressCtl.Picker.province = "";
		mapAddressCtl.Picker.city = "";
		mapAddressCtl.Picker.district = "";
	}
});

//监视Picker市改变
mapAddressCtl.$watch("Picker.city", function(value) {
	mapAddressCtl.Picker.district = "";
	if(mapAddressCtl.Picker.city) {
		if(mapAddressCtl.Picker.level == 3) {
			mapAddressCtl.Picker.districtList = cityData[mapAddressCtl.Picker.province][mapAddressCtl.Picker.city] || [];
			if(mapAddressCtl.Picker.districtList.length > 0) {
				mapAddressCtl.Picker.chooseIdx = 3;
			} else {
				mapAddress.pickCallback();
			}

		} else {
			mapAddress.pickCallback();
		}
	}
});

//监视Picker区改变
mapAddressCtl.$watch("Picker.district", function(value) {
	if(mapAddressCtl.Picker.district) {
		mapAddress.pickCallback();
	}
});

//初始化城市选择控件
function initCityPicker() {
	//初始化省列表
	for(var i in cityData) {
		mapAddressCtl.Picker.provinceList.push(i);
	}

	//初始化省市区选择事件
	$(".m-cityselect").on("click", ".cityselect-item a", function() {
		mapAddressCtl.Picker.isReturn = true;
		var idx = this.parentElement.getAttribute("data-idx");
		var value = this.getAttribute("data-value");
		switch(idx) {
			case "1": //选择省
				mapAddressCtl.Picker.province = value;
				break;
			case "2": //选择市或区
				mapAddressCtl.Picker.city = value;
				break;
			case "3": //选择区
				mapAddressCtl.Picker.district = value;
				break;
		}
	});

	//顶部省市切换
	$(".m-cityselect").on("click", ".cityselect-nav a", function() {
		var idx = this.getAttribute("data-idx");
		mapAddressCtl.Picker.chooseIdx = parseInt(idx);
	});

	//地址选择遮罩
	$(".m-cityselect-mark").click(function() {
		mapAddress.hidePicker();
	});
};

//选择城市组件省市切换加载数据
function pickerLoadData(province, city, district) {
	mapAddressCtl.Picker.isReturn = false;
	if(province == city && province) {
		mapAddressCtl.Picker.chooseIdx = 2;
		mapAddressCtl.Picker.province = province;
		mapAddressCtl.Picker.city = district;
	} else if(province && city && district) {
		mapAddressCtl.Picker.chooseIdx = 3;
		mapAddressCtl.Picker.province = province;
		mapAddressCtl.Picker.city = city;
		mapAddressCtl.Picker.district = district;
	} else if(province && city) {
		mapAddressCtl.Picker.chooseIdx = 2;
		mapAddressCtl.Picker.province = province;
		mapAddressCtl.Picker.city = city;
		mapAddressCtl.Picker.district = "";
	}

	setTimeout(function() {
		//document.body.querySelector("#item-province .crt")
		var itemProvince = document.body.querySelector("#item-province .crt");
		var itemCity = document.body.querySelector("#item-city .crt");
		var itemDistrict = document.body.querySelector("#item-district");

		var scrollTop;
		if(itemProvince) {
			scrollTop = itemProvince.offsetTop - 85;
			if(scrollTop > 140) {
				document.body.querySelector("#item-province").scrollTop = scrollTop - 120;
			}
		}
		if(itemCity) {
			scrollTop = itemCity.offsetTop - 85;
			if(scrollTop > 140) {
				document.body.querySelector("#item-city").scrollTop = scrollTop - 120;
			}
		}

		if(itemDistrict) {
			scrollTop = itemDistrict - 85;
			if(scrollTop > 140) {
				document.body.querySelector("#item-district").scrollTop = scrollTop - 120
			}
		}
	}, 200);
};