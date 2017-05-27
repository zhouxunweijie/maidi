//初始化avalon
var vm = avalon.define({
    $id: "myCtl",
    api: MdAppUrl.Api,
    start: '',
    isLoadProdInfo: false, //是否加在产品基本 信息
    prodInfo: {
        ProdID: "",
        Photos: [],
        Models: [],
        HasMx: 0,
        IsNew: 0,
        ProdName: "",
        CompID: 0,
        ProdBrief: "",
        Views: 0,
        LoveNums: 0,
        CollectNums: 0,
        SkuName: "",
        Price: "",
        State: "", //0新建 1已上传模型 7自主下架 8迈迪下架 9发布 z删除
    }, //产品基本信息
    InnerCodeName: "", //内部编码名称
    prodIntro: "",
    isLoadParams: false, //是否加载参数
    prodParams: [], //参数集合
    prodParamShow: [],
    choosedParams: [], //已经选择的参数
    isLoadSParams: false, //是否加载生产参数
    prodSParams: {
        produceInfo: "",
        ProduceParams: []
    }, //产品生产参数
    getImg: getImgPath, //获取图片路径
    mdCode: query("mdCode") || "", //迈迪码
    prodId: query("prodId") || "", //产品编号
    skuId: query("skuId") || "", //型号编号
    carId: query("carId") || "", //购物车编号
    compId: query("compId") || "", //公司编号
    prodName: query("prodName") || "", //产品名称
    skuName: query("skuName"), //型号名称
    price: null, //价格
    compInfo: {
        CompID: "",
        CompName: "",
        CompMdt: "",
        LinkPhone: "",
        Province: "",
        City: "",
        District: "",
        JoinLevel: ""
    }, //产品所属企业信息
    isLoadCompInfo: false, //是否加载产品企业信息
    getAddress: contractAddress, //获取地址
    isPrice: null, //是否有价格
    isShowSkuName: showSkuName, //参数是否显示型号
    filter_value: filter_value, //参数过滤显示
    isShowValue: isShowValue, //生产参数过滤
    tab_idx: 1, //产品tab标签
    isLoadTab1: false, //是否加载tab1页面
    isLoadTab2: false, //是否加载tab2页面，
    isLoadTab3: false, //是否加载tab3页面
    isSelected: false, //是否选型结束
    eBook: [], //产品二位样本
    video: [], //产品视频说明书
    serviceUsers: [], //店小2 列表
    isCollect: false, //是否已经收藏
    cartCount: 0, //购物车数量
    BuyType: 0,
    BuyNums: 1,
    BuyNumsPlus: function (method) {
        var num = $('#buy_nums').val();
        if (method == 'add') {
            vm.BuyNums = parseInt(num) + 1;
        } else {
            if (vm.BuyNums != 1) {
                vm.BuyNums = parseInt(num) - 1;
            }
        }
    },
    CanBuy: false,
    IsShowParams: 0,
    showParams: true,
    filter_params: function (obj) {
        if (vm.mdCode || vm.skuId) {
            if (vm.prodParamShow.length > 0) {
                return obj.IsLectotype;
            }
            else {
                return false;
            }
        }
        return obj.IsLectotype;
    },
    isShowChooseParams: function () {
        if (!vm.isLoadParams) {
            return false;
        } else if (vm.mdCode || vm.skuId) {
            if (vm.prodParamShow.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (vm.prodParams.length > 0) {
            return true;
        }
        else {
            return false;
        }
    },
    isActive: function (obj, cObj) {
        if (vm.filterData.length > 0) {
            var active = "";
            for (var i in vm.filterData) {
                if (vm.filterData[i].ID == obj.ID) {
                    if (vm.filterData[i].Values.length == 1 || cObj == vm.filterData[i].Value) {
                        active = "active";
                        return active;
                    }
                }
            }
            return active;
        } else if (obj.Values.length == 1) {
            return "active";
        } else if (obj.Value == cObj) {
            return 'active';
        }
        return "";
    },
    getDataValue: function (obj) {
        if (vm.filterData.length > 0) {
            for (var i in vm.filterData) {
                if (vm.filterData[i].ID == obj.ID) {
                    if (vm.filterData[i].Value) {
                        return vm.filterData[i].Value;
                    } else if (vm.filterData[i].Values.length == 1) {
                        return vm.filterData[i].Values[0];
                    } else {
                        return "";
                    }
                }
            }
        } else if (obj.Values.length == 1) {
            return obj.Values[0];
        } else if (obj.Value) {
            return obj.Value;
        }
        return "";
    },
    isFilter: function (obj) {
        if (obj.Value == '' && obj.Values.length == 1) {
            return 0;
        } else if (obj.Values.length == 1) {
            return 0;
        } else {
            return 1;
        }
    },
    filterData: [],
    paramsIsDisable: function (id, value) {
        if (vm.filterData.length == 0) {
            return "";
        } else {
            var isDisable = "disabled";
            for (var i in vm.filterData) {
                if (vm.filterData[i].ID == id && vm.filterData[i].Values.indexOf(value) >= 0) {
                    isDisable = "";
                    return;
                }
            }
            return isDisable;
        }
    }
});

vm.$watch("BuyNums", function() {
	if(vm.BuyNums < 1) {
		setTimeout(function() {
			vm.BuyNums = 1;
		}, 300)
	}
});

//avalon filter getImg
function getImgPath(type, id, isOriginal, ex) {
	if(!vm.prodId) {
		return "../../images/defImg70.png";
	}

	if(!ex) {
		ex = "_360x250.jpg";
	}
	if(isOriginal == 1) {
		ex = ".jpg"
	}
	switch(type) {
		case 1: //获取产品的Logo
			return MdAppUrl.Img + "/prod/logo/" + vm.prodId + ex;
		case 2: //获取产品的外观图
			if(!id) {
				return "../../images/defImg70.png";
			}
			if(parseInt(vm.prodInfo.IsNew) > 0) {
				return MdAppUrl.Img + "/prod/photo/" + vm.prodInfo.ProdID + "/" + id + ex;
			} else {
				return md.MdAppUrl.pic + "/cGtnL2ltYWdlcw==_" + vm.prodInfo.ProdID + "_" + id + ex;
			}
		case 3: //获取产品的模型图
			if(!id) {
				return "../../images/defImg70.png";
			}
			if(parseInt(vm.prodInfo.IsNew) > 0) {
				return MdAppUrl.Img + "/prod/model/" + vm.prodInfo.ProdID + "/" + id + ex;
			} else {
				return md.MdAppUrl.pic + "/cGtnL2ltYWdlcw==_" + vm.prodInfo.ProdID + "_" + id + ex;
			}
		case 4: //获取产品的样本图
			if(isOriginal != 1) {
				ex = "_600x0.jpg"
			}
			if(parseInt(vm.prodInfo.IsNew) > 0) {
				return MdAppUrl.Img + "/prod/sample/" + vm.prodInfo.ProdID + "/" + id + ex;
			} else {
				return MdAppUrl.pic + "/cGtnL3li_" + vm.prodInfo.ProdID + "_" + id + ex;

			}
		case 5: //获取用户图片
			return MdAppUrl.pic + "/dXNlci9sb2dv_" + id + "_30x30.jpg";
		case 6: //获取企业图片
			return MdAppUrl.pic + "/Y29tcC9sb2dv_" + id + "_70x70.jpg";
		default:
			return "../../images/default.jpg";
	}
};

//avalon filter showSkuName
function showSkuName() {
	var isHave = false;
	for(var i in vm.prodParams) {
		if(vm.prodParams[i].Name == "型号") {
			isHave = true;
			break;
		}
	}
	return !isHave;
};

//avalon filter filter_value
function filter_value(obj) {
	return obj.Value != '' || obj.Values.length == 1;
};

//avalon filter isShowValue
function isShowValue() {
	if(user.CompID == vm.prodInfo.CompID) {
		return true;
	} else {
		return false;
	}
};

function init() {
	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		spaceBetween: 30,
		autoplay: 3000, //可选选项，自动滑动
		onSlideChangeStart: function(swiper) {
			vm.start = swiper.activeIndex;
		}
	});
};
var loading;
$(function() {
	if(vm.mdCode) {
		vm.prodId = vm.mdCode.substr(1, 12);
		vm.skuId = vm.mdCode.substr(13, 4);
	}
	user.ready(function() {

		loading = layer.open({
			type: 2,
			shadeClose: false
		});
		setTimeout(function() {
			//加载产品信息
			loadInfo();
			isCollectProd();
		}, 800);

	});
});

//加载产品详情
function loadInfo() {
	var url = MdAppUrl.Api45 + "/api/v1.0/Prod/GetInfoForMobile?prodId=" + vm.prodId + "&skuId=" + (vm.skuId || "");
	getAjaxData(url, function(reData) {
		vm.isLoadProdInfo = true;
		layer.close(loading);
		$("#main-div").css("display", "block");
		if(reData && reData.State > 0) {
			vm.prodInfo = reData.Data;
			init();

			if(!vm.compId || vm.compId == 0) {
				vm.compId = vm.prodInfo.CompID;
			}

			if(!vm.prodName) {
				vm.prodName = vm.prodInfo.ProdName;
			}

			if(!vm.skuName) {
				vm.skuName = reData.Data.SkuName;
			}

			//加载产品参数
			setTimeout(loadParams, 100);

			//加载产品生产参数
			setTimeout(loadSParams, 300);

			//加载企业信息
			setTimeout(loadCompInfo, 500);

		} else {

		}
	});
};

//加载产品参数信息 
function loadParams() {
    var url = MdAppUrl.Api4 + "/api/Lectotype/GetBuyParams?prodid=" + vm.prodId;
    getAjaxData(url, function (reData) {
        vm.isLoadParams = true;
        if (reData && reData.State > 0) {
            vm.prodParams = reData.Data.LectotypeParams;
            vm.prodParamShow = reData.Data.LectotypeParams;
            if (reData.Data.SkuName) {
                vm.skuName = reData.Data.SkuName;
            }
            vm.price = reData.Data.Price || reData.Data.RangePrice;
            vm.isSelected = reData.Data.IsSelected;
            if (vm.price) {
                vm.isPrice = true;
            } else {
                vm.isPrice = false;
            }

			//加载产品参数
			if(vm.carId) {
				setTimeout(loadParamsByCarId, 100);
			} else if(vm.skuId) {
				setTimeout(loadParamsBySkuID, 100);
			}
		} else {}

	});
};

//根据购物车获取已经选择的参数
function loadParamsByCarId() {
	var url = MdAppUrl.Api42 + "/api/Cart/GetProdSkuParams?cartId=" + vm.carId;
	getAjaxData(url, function(reData) {
		vm.isLoadParams = true;
		if(reData && reData.State > 0) {
			vm.isLoadParams = false;
			var data = {};
			data.ProdID = vm.prodId;
			data.ParamID = 0;
			data.SelConfigs = reData.Data;

			filterProdParams(data);
		}
	}, true);
};

//根据型号名称获取已经选择的参数
function loadParamsBySkuID() {
	var url = MdAppUrl.Api45 + "/api/v1.0/Prod/GetSelectParamsBySkuId?prodid=" + vm.prodId + "&skuid=" + vm.skuId

	getAjaxData(url, function(reData) {
		vm.isLoadParams = true;
		if(reData && reData.State > 0) {
			if(reData.Data) {

				if(typeof(reData.Data) == "string") {
					reData.Data = JSON.parse(reData.Data);
				}

				if(typeof(reData.Data.SelConfigs) == "string") {
					reData.Data.SelConfigs = JSON.parse(reData.Data.SelConfigs);
				}

                //根据skuId未获取到产品的已选参数，使用一口价不显示产品选型 参数
                if (reData.Data.SelConfigs.length > 0) {
                    vm.isLoadParams = false;
                    filterProdParams(reData.Data);
                } else {
                    userProdPrice();
                    vm.prodParamShow = [];
                }
            } else {
                userProdPrice();
                vm.prodParamShow = [];
            }
        }
    });
};

//使用产品的一口价
function userProdPrice() {
	vm.isPrice = true;
	vm.price = vm.prodInfo.Price;
	vm.CanBuy = true;
};

//过滤 产品的选型 参数
function filterProdParams(postData) {

	if(typeof(postData) == "string") {
		postData = JSON.parse(postData);
	}

	var selConfig = postData.SelConfigs;

	if(typeof(selConfig) == "string") {
		selConfig = JSON.parse(selConfig);
	}

	var url = MdAppUrl.Api4 + "/api/Lectotype/FilterBuyParams";
	postAjaxData(url, postData, function(reData) {
		vm.isLoadParams = true;
		if(reData && reData.State > 0) {
			vm.filterData = reData.Data.LectotypeParams;
			vm.prodParamShow = reData.Data.LectotypeParams;
			vm.skuName = reData.Data.SkuName;
			vm.price = reData.Data.Price || reData.Data.RangePrice;
			if(vm.price) {
				vm.isPrice = true;
			} else {
				vm.isPrice = false;
			}
			var params = [];
			$.each(reData.Data.LectotypeParams, function(index, item) {
				params.push({
					ID: item.ID,
					Name: item.Name,
					Value: item.Value
				});
			});
			vm.choosedParams = params;
		} else {

		}
	});
};

$("#main-div").on("click", ".selParams", function() {
	vm.BuyType = 0;
	vm.showParams = (vm.mdCode || vm.skuId) ? false : true;
	chooseParams.show();
});

//加载产品生产 参数
function loadSParams() {
	if(vm.mdCode) {
		var url = MdAppUrl.Api45 + "/api/v1.0/Produce/GetProdProduceInfo?mdcode=" + vm.mdCode + "&compId=" + (user.CompID || 0);
		getAjaxData(url, function(reData) {
			vm.isLoadSParams = true;
			if(reData && reData.State > 0) {
				vm.prodSParams = reData.Data;
			} else {

			}
		});
	} else {

	}
};

//加载企业信息
function loadCompInfo() {
	var url = MdAppUrl.Api4 + "/api/comp/GetInfo?compId=" + vm.compId;
	getAjaxData(url, function(reData) {
		vm.isLoadCompInfo = true;
		if(reData && reData.State > 0) {
			vm.compInfo = reData.Data;
		}
		//加在产品详情
		setTimeout(loadIntro, 100);

	});
};

//tab标签点击
$(".md-tab").on("click", ".md-tab-item", function() {
	var idx = this.getAttribute("data-idx");
	if(parseInt(idx) != vm.tab_idx) {
		vm.tab_idx = parseInt(idx);
	}
	switch(parseInt(idx)) {
		case 1:
			loadIntro();
			break;
		case 2:
			loadEbook();
			break;
		case 3:
			loadVideo();
			break;
	}
});

//加载产品详情
function loadIntro() {
	if(vm.isLoadTab1) {
		return;
	}
	var url = MdAppUrl.Api45 + "/api/v1.0/Prod/GetProdIntro?prodId=" + vm.prodId;

	getAjaxData(url, function(reData) {
		vm.isLoadTab1 = true;
		if(reData && reData.State > 0) {
			vm.prodIntro = reData.Data;
		} else {

		}
	});
};

//获取电子图册
function loadEbook() {
	if(vm.isLoadTab2) {
		return;
	}

	var url = MdAppUrl.Api45 + "/api/v1.0/Prod/GetProdYbPics?prodId=" + vm.prodId;

	getAjaxData(url, function(reData) {
		vm.isLoadTab2 = true;
		if(reData && reData.State > 0) {
			vm.eBook = reData.Data;
		} else {

		}

	});
};

//加载产品视频说明书
function loadVideo() {
	if(vm.isLoadTab3) {
		return;
	}

	var url = MdAppUrl.Api45 + "/api/v1.0/Prod/GetProdVideo?prodId=" + vm.prodId;

	getAjaxData(url, function(reData) {
		vm.isLoadTab3 = true;
		if(reData && reData.State > 0) {
			vm.video = reData.Data;
		} else {}
	});
};

$("#tab-video").on("click", ".data-row", function() {
	var name = this.getAttribute("data-value");
	var path = this.getAttribute("data-path"); //"/extras/video_prod/151110100002/打标机2.mp4";//
	var type = this.getAttribute("data-type");

	window.location.href = "ckplayer.html?path=" + encodeURI(path) + "&name=" + encodeURI(name);
});
$("footer #btn_service").click(function() {
	//询问框
	layer.open({
		content: '如需联系商家，需要下载迈迪通！',
		btn: ['立即下载', '取消'],
		yes: function(index) {
			window.location.href = "../down.html";
			layer.close(index);
		}
	});
});

/***加载购物车--start***/

//加载购物车数量
/*function getCartNums() {
    if (user && user.token) {
        var url = MdAppUrl.Api42 + "/api/cart/getcount";

        getAjaxData(url, function (reData) {
            if (reData && reData.State > 0) {
                vm.cartCount = parseInt(reData.Data);
            } else {

            }
        }, true);
    }
};*/

//判断用户是否收藏了产品
function isCollectProd() {
	if(user.token) {
		var url = MdAppUrl.Api45 + "/api/v1.0/Prod/IsCollectProduct?prodId=" + vm.prodId + "&userid=" + user.id;

		getAjaxData(url, function(reData) {
			if(reData && reData.State > 0) {
				vm.isCollect = reData.Data;
			} else {

			}
		});
	}
};
//关注产品以及取消关注产品
var is_collect_click = false;

function cllectProd() {
	if(is_collect_click) {
		return;
	}
	is_collect_click = true;
	var url = MdAppUrl.Api45 + "/api/v1.0/Prod/UserCollectProduct?prodId=" + vm.prodId + "&optype=" + (vm.isCollect ? 1 : 0);
	getAjaxData(url, function(reData) {
		is_collect_click = false;
		if(reData && reData.State > 0) {
			if(vm.isCollect) {
				vm.prodInfo.CollectNums -= 1;
			} else {
				vm.prodInfo.CollectNums += 1;
			}
			vm.isCollect = !vm.isCollect;

		} else {
			layer.open({
				content: '操作失败!',
				skin: 'msg',
				time: 2
			});
		}

	}, true);
}

$(".btn_collect").click(function() {
	if(user.token) {
		cllectProd();
	} else {
		showLogin();
	}
});

function showLogin() {
	chooseUser.show(function() {
		user.reload();
	});
};

function showParams() {
	vm.showParams = (vm.mdCode || vm.skuId) ? false : true;
	chooseParams.show(function() {
		if(vm.BuyType > 0 && vm.price == 0|"") {
			layer.open({
				content: '该产品没有定价无法购买！',
				skin: 'msg',
				time: 2
			});
			return;
		}
		if(vm.BuyType == 1) {
			var postData = getBuyData();

			addCart(postData);
		} else if(vm.BuyType == 2) {
			var postData = getBuyData();

			buyNow(postData);
		}
	});
};

$(".btn_addcart").click(function() {
	vm.BuyNums = 1;
	vm.BuyType = 1;
	if(user.token) {
		showParams();
	} else {
		showLogin();
	}
});

//立即购买
function buy() {
	vm.BuyType = 2;
	vm.showParams = (vm.mdCode || vm.skuId) ? false : true;
	showParams();
};

function getBuyData() {
	var SkuParams = {
		ProdID: vm.prodId,
		ParamID: 0,
		SelConfigs: vm.choosedParams
	}
	var postData = {};
	postData.ProdID = vm.prodId;
	postData.ProdCompID = vm.compId;
	postData.SkuName = vm.skuName;
	postData.SkuParams = JSON.stringify(SkuParams);
	postData.BuyNums = vm.BuyNums;

	return postData;
};

$(".btn_buy").click(function() {
	vm.BuyNums = 1;
	vm.BuyType = 2;
	if(user.token) {
		buy();
	} else {
		showLogin();
	}
});
//加入购物车
//var cartSkuName = [];

function addCart(data) {
	
	var nums = document.body.querySelector("#buy_nums").value;
	var choosePrice = document.body.querySelector("#choosePrice").innerHTML;
	var allPrice = parseFloat(nums * choosePrice).toFixed(2);

	if(allPrice > 10000000) {
		layer.open({
			content: '加入购物车失败！单个商品购买的总价格不能大于一千万!',
			skin: 'msg',
			time: 2
		});
	} else {
		var url = MdAppUrl.Api42 + "/api/Cart/AddCart"
		postAjaxData(url, data, function(reData) {
			if(reData && reData.State > 0) {
				layer.open({
					content: '加入购物车成功!',
					skin: 'msg',
					time: 2
				});
			} else {
				layer.open({
					content: '加入购物车失败!' + reData.ErrorMessage,
					skin: 'msg',
					time: 2
				});
			}
		}, true);
	}
};

$("#btn_loginOut").click(function() {
	user.logout();

	user.redy(function() {

	});

	user.reload();
});

//立即购买
function buyNow(data) {
	var url = MdAppUrl.Api42 + "/api/SingleBuy/AddSingleBuy";
	postAjaxData(url, data, function(reData) {
		if(reData && reData.State == 1) {
			var ids = [];
			ids.push(reData.Data);

			window.location.href = "submit-order.html?Ids=" + ids.join(',') + "&FromCart=" + false;
		} else {
			//获取信息失败
			layer.open({
				content: reData ? reData.ErrorMessage : "购买失败!",
				skin: 'msg',
				time: 2
			});
		}
	}, true);
};

//头部点击购物车
$('#cart').click(function() {
	if(user && user.token) {
		location.href = "cart-list.html";
	} else {
		showLogin();
	}
});
//订单按钮
$('#icon-order').click(function() {
	if(user && user.token) {
	//询问框
	layer.open({
		content: '如需查看订单，需要下载迈迪通！',
		btn: ['立即下载', '取消'],
		yes: function(index) {
			window.location.href = "../down.html";
			layer.close(index);
		}
	});
	} else {
		showLogin();
	}
});
//返回按钮
$("#icon-back").click(function() {
	history.back();
});