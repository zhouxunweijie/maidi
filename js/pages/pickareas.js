var vm = avalon.define({
	$id: "myCtl1",
	isReturn: true,
	province: "",
	chooseIdx: 1,
	level: 2,
	city: "",
	district: "",
	provinceList: [],
	cityList: [],
	districtList: [],
	data: ""
});
var callback;
var viewId;



//初始化城市选择

vm.$watch("province", function(value) {
	var city = cityData[vm.province];
	console.log(city);
	vm.city = "";
	vm.cityList = [];
	if(city) {
		vm.district = "";
		vm.chooseIdx = 2;
		if(Object.getOwnPropertyNames(city).length == 1) {
			vm.level = 2;
			vm.cityList = cityData[vm.province][vm.province];
		} else {
			vm.level = 3;
			for(var i in city) {
				vm.cityList.push(i);
			}
		}
	} else {
		vm.province = "";
		vm.city = "";
		vm.district = "";
	}
});
vm.$watch("city", function(value) {
	vm.district = "";
	if(vm.city) {
		if(vm.level == 3) {
			vm.districtList = cityData[vm.province][vm.city] || [];
			if(vm.districtList.length > 0) {
				vm.chooseIdx = 3;
			} else {
				callbackData();
			}

		} else {
			callbackData();
		}
	}

});
vm.$watch("district", function(value) {
	if(vm.district) {

		callbackData();
	}
});

document.body.querySelector("#cityselect-content").addEventListener("change", function(event) {
	if(event.detail.deltaX < 0) {
		if(vm.level == 3 && vm.chooseIdx == 2) {
			vm.chooseIdx = 3;
		}
	} else if(event.detail.deltaX > 0) {
		if(vm.chooseIdx == 3) {
			vm.chooseIdx = 2;
		}
	}

});
var hashref = function(key) {
	history.back(key)
}

//初始化省数据
function initProvince() {
	for(var i in cityData) {
		vm.provinceList.push(i);
		vm.cityList = vm.provinceList[vm.province]
		loadData(vm.province, vm.city, vm.district)
	}
};
initProvince()
loadData(model.Province,model.City,model.district);
function loadData(province, city, district) {
	vm.isReturn = false;
	if(province == city && province) {
		vm.chooseIdx = 2;
		vm.province = province;
		vm.city = district;
	} else if(province && city && district) {
		vm.chooseIdx = 3;
		vm.province = province;
		vm.city = city;
		vm.district = district;
	} else if(province && city) {
		vm.chooseIdx = 2;
		vm.province = province;
		vm.city = city;
		vm.district = "";
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
	}, 200)
};

$(".m-cityselect").on("click", ".cityselect-item a", function() {
    console.log(vm.$model);
	vm.isReturn = true;
	var idx = this.parentElement.getAttribute("data-idx");
	var value = this.getAttribute("data-value");
	switch(idx) {
		case "1": //选择省
			vm.province = value;
			break;
		case "2": //选择市或区
			vm.city = value;
			break;
		case "3": //选择区
			vm.district = value;
			break;
	}
});

$(".m-cityselect").on("click", ".cityselect-nav a", function() {
	var idx = this.getAttribute("data-idx");
	vm.chooseIdx = parseInt(idx);

});

function callbackData() {
	if(callback && viewId && vm.isReturn) {
		var province = vm.province;
		var city = vm.level == 2 ? vm.province : vm.city;
		var district = vm.level == 2 ? vm.city : vm.district;
	}
   // model.Drovince = $("#item-province .crt").siblings("span").text();
   // model.City = $("#item-city .crt").siblings("span").text();
   // model.District = $("#item-district .crt").siblings("span").text();
    model.District = vm.district;
	model.City = vm.city;
	model.Province = vm.province
	model.Address = "";
	model.getCode();
	var str = vm.province + vm.city + vm.district;
	$("#province").removeClass("color-gray ");
	$("#main-box").animate({
		top: 587
}, 1000).css({
    display: "none"
});
};



//
// function initCityPicker() {
//
//     var str = true;
//     $("body").on("click", ".chooseArea", function() {
//         vm.district = model.District;
//         vm.province = model.Province.replace("省","");
//         vm.city = model.City.replace("市","");
//         if(str) {
//             $("#main-box").css({
//                 display: "block"
//             }).animate({
//                 top: 188
//             }, 1000)
//             str = false
//         }else{
//
//         }
//
//         // showPickArea();
//     });
// };

// $("#btn_save").on("click",function(){
//     console.log(vm.Address);
//     if(vm.Address !=""){
//         window.location.href = encodeURI("./index.html?"+vm.data);
//     }else{
//         alert("请填写详细地址")
//     }
// })