var vm = avalon.define({
	$id: "appCtrl",
	ImgSrc: MdAppUrl.pic + "/" + imgPath.cmpLogo,
	ImgUrl: MdAppUrl.Img,
	Ids: "",
	//选择地址页面显示隐藏标识0隐藏1显示
	IsShowSelectAddr: 0,
	//是否来自购物车
	FromCart: "",
	//订单总价
	PriceTotal: 0,
	//订单产品数量
	OrderProdNum: 0,
	//总运费
	FreightAll: 0,
	//当前选择的收货地址
	PostAddr: {
		RecvUserName: "",
		LinkPhone: "",
		Address: "",
		AddrId: 0
	},
	//当前订单的信息
	OrderList: [],
	//订单中产品的信息
	ProdLists: [],
	//用户默认收货地址
	AddrList: "",
	//已选择收货地址ID
	SelectedID: 0,

	///*修改新增地址数据模型*///
	//修改，新增地址页面显示隐藏标识0隐藏1显示
	IsShowmodifyAddr: 0,
	IsAdd: true,
	//要修改的地址id
	AddrID: 0,
	//联系人姓名
	RecvUserName: "",
	//联系电话
	LinkPhone: "",
	//收货地址
	Province: "",
	ProvinceCode: "",
	City: "",
	CityCode: "",
	District: "",
	Address: "",
	//经度
	MapLng: "",
	//纬度
	MapLat: "",
	ZipCode: "",
	//是否设为默认地址
	IsDefault: 1,
	//删除收货地址
	delAddr: delAddr,
	//设置是否为默认地址
	setDefault: function(idx) {
		this.IsDefault = idx;
	}
});

//组合省市地址筛选器
avalon.filters.contractAddress = contractAddress;

$(function() {
	user.ready(function() {

		var Ids = query("Ids");
		if(Ids != undefined) {
			vm.Ids = Ids.split(",");
		}
		vm.FromCart = query("FromCart");
		//获取用户收货地址
		postAddr();
	});
})

//获取当前用户邮寄地址
function postAddr() {
	var url = MdAppUrl.Api45 + "/api/v1.0/Trade/GetDefaultAddr";
	getAjaxData(url, function(data) {
		if(data.Data && data.State == 1 && data.Data.ID != 0) {
			vm.PostAddr.RecvUserName = data.Data.RecvUserName;
			vm.PostAddr.LinkPhone = data.Data.LinkPhone;
			vm.PostAddr.Address = contractAddress(data.Data.Province, data.Data.City, data.Data.District, data.Data.Address);
			vm.PostAddr.AddrId = data.Data.ID;
			vm.SelectedID = data.Data.ID;
		}
		if(!vm.PostAddr.AddrId || vm.PostAddr.AddrId == 0) {
			$("#addAddress").css("display", "block");
		}
		//获取购物车列表，通过邮寄地址来确定邮寄费用
		orderDetail();
		//初始化-加载用户地址列表
		loadOtherAddr();
	}, true);
}

//获取订单中的企业信息及每个企业下的产品信息
function orderDetail(IsChooseAddr) {
	if(vm.FromCart == "true") {
		var url = MdAppUrl.Api42 + "/api/Cart/GetCartListById?addrId=" + vm.PostAddr.AddrId;
	} else {
		var url = MdAppUrl.Api42 + "/api/SingleBuy/GetSingleBuyProdInfo?singleId=" + vm.Ids[0] + "&addrId=" + vm.PostAddr.AddrId;
	}
	postAjaxData(url, vm.Ids, function(data) {
		if(data && data.State == 1 && data.Data.length > 0) {
			var reData = data.Data;
			for(var i = 0; i < reData.length; i++) {
				for(var j = 0; j < reData[i].ProdList.length; j++) {
					reData[i].ProdList[j].CartID = reData[i].ProdList[j].ID;
					reData[i].ProdList[j].CompID = reData[i].CompID;
					reData[i].ProdList[j].Total = parseFloat(reData[i].ProdList[j].Price * reData[i].ProdList[j].BuyNums).toFixed(2);
					delete reData[i].ProdList[j].ID;
					if(IsChooseAddr != true) {
						vm.ProdLists.push(reData[i].ProdList[j]);
					}

				}
				vm.OrderProdNum += parseInt(reData[i].ProdList.length);
			}
			vm.OrderList = reData;

			//获取所有运费
			var ware_freight = [];
			var allFreight = 0;
			var order_ware_freight = document.getElementsByClassName("order_ware_freight");
			for(var i = 0; i < order_ware_freight.length; i++) {
				ware_freight.push(order_ware_freight[i].innerHTML);
			}

			for(var j = 0; j < ware_freight.length; j++) {
				allFreight += parseFloat(ware_freight[j]);
			}
			var freightNum = Math.round(allFreight * 100) / 100;

			//获取所有总价
			var ware_price = [];
			var order_ware_price = document.getElementsByClassName("order_ware_price");
			for(var i = 0; i < order_ware_price.length; i++) {
				vm.PriceTotal = 0;
				ware_price.push(order_ware_price[i].innerHTML);
			}

			var allPrice = 0;
			for(var i = 0; i < ware_price.length; i++) {
				allPrice += parseFloat(ware_price[i]);
			}
			var priceNum = Math.round(allPrice * 100) / 100;

			//组合成为总价
			vm.PriceTotal = parseFloat(priceNum + freightNum).toFixed(2);

			$(".prod_list").click(function(e) {
				var prodid = this.getAttribute("prodid");
				innerProdView(prodid);
			})
		}
	}, true);
}

//获取用户其它收货地址
function loadOtherAddr() {
	setTimeout(function() {
		//获取用户收货地址
		var url = MdAppUrl.Api42 + "/api/PostAddr/GetList";
		getAjaxData(url, function(reData) {
			if(reData && reData.State == 1 && reData.Data) {
				vm.AddrList = reData.Data;

				//选择收货地址点击
				$(".select_address_info").unbind('click');
				$(".select_address_info").click(function() {
					var idx = this.getAttribute("idx");
					var addr = vm.AddrList[idx];
					vm.PostAddr.RecvUserName = addr.RecvUserName;
					vm.PostAddr.LinkPhone = addr.LinkPhone;
					vm.PostAddr.Address = contractAddress(addr.Province, addr.City, addr.District, addr.Address);
					vm.PostAddr.AddrId = addr.ID;
					vm.SelectedID = addr.ID;
					orderDetail(true);
					if(vm.IsShowSelectAddr == 0) {
						vm.IsShowSelectAddr = 1
					};
				});

				//收货地址编辑
				$(".icon-edit").unbind('click');
				$(".icon-edit").click(function() {
					var addrId = this.getAttribute("addrId");
					loadModifyView(addrId);
				})
			} else {
				layer.open({
					content: '获取收货地址信息失败，请于稍后再试！',
					skin: 'msg',
					time: 1
				});
			}
		}, true);
	}, 300);
}

/*新增收货地址*/
$("#btnAdd").click(function() {
	loadModifyView();
})

//跳转产品详情
function innerProdView(prodID) {
	window.location.href = "prod-info-new.html?prodId=" + prodID;
};

//收货地址栏点击事件
$("#sel_address").click(function() {
	//及时更新-加载地址列表
	loadOtherAddr();
	if(vm.IsShowSelectAddr == 1) {
		vm.IsShowSelectAddr = 0;
	}
	$("#selectAddr").css("display", "block");
});

//选择地址页面返回
$(".selAddrBack").click(function() {
	vm.IsShowSelectAddr = 1;
});

//提交订单点击事件
$(".submit_btn").click(function() {
	var url = MdAppUrl.Api42 + "/api/Order/AddOrder";
	var submitData = {
		"Data": "",
		"AddressID": "",
		"IsFromCart": "",
		"TexType": "0",
		"OrderFrom": 2 //手机端下单
	};
	submitData.Data = vm.ProdLists;
	submitData.AddressID = vm.PostAddr.AddrId;
	if(query("isCart")) {
		submitData.IsFromCart = true;
	} else {
		submitData.IsFromCart = false;
	}

	if(submitData.AddressID == "0") {
		layer.open({
			content: '请选择收货地址！',
			skin: 'msg',
			time: 1
		});
		return false;
	}
	postAjaxData(url, submitData, function(data) {
		if(data.Data && data.State == 1) {
			var params = [];
			for(var i = 0; i < data.Data.length; i++) {
				params.push({
					PayPlanID: 0,
					OrderID: data.Data[i]
				});
			}

			//保存购物车数量
			var cartList = localGet("CartInfo" + user.UserID);
			//未在订单中的购物车产品列表
			var tempCartList = [];
			if(cartList && cartList.length > 0) {
				//遍历本地存储的购物车产品数据
				for(var i = 0; i < cartList.length; i++) {
					//遍历当前提交单据中的产品数据
					for(var j = 0; j < vm.ProdLists.length; j++) {
						//如果当前单据中的产品与购物车中的产品相同，则跳出循环，否则保存未在订单中的购物车数据
						if(cartList[i].ProdCompID == vm.ProdLists[j].CompID && cartList[i].ProdID == vm.ProdLists[j].ProdID && cartList[i].SkuName == vm.ProdLists[j].SkuName) {
							break;
						}

						//遍历完单据的产品后，保存
						if(j == vm.ProdLists.length - 1)
							tempCartList.push(cartList[i]);
					}
				}
				localSave("CartInfo" + user.UserID, tempCartList);
			}

			window.location.replace("pay.html?params=" + $.base64.encode(JSON.stringify(params)) + "&payTotal=" + vm.PriceTotal + "&userid=" + user.id);

		} else {
			layer.open({
				content: '提交订单失败，请稍后再试！',
				skin: 'msg',
				time: 1
			})
		}
	}, true);
});

$(".submitBack").click(function() {
	history.back();
})

//////////修改新增地址页面js//////////

function loadModifyView(addrId) {
	if(vm.IsShowmodifyAddr == 1) {
		vm.IsShowmodifyAddr = 0;
	}
	$("#modifyAddr").css("display", "block");
	vm.AddrID = addrId
	vm.IsAdd = addrId ? false : true;

	if(!vm.IsAdd) {
		//获取编辑的地址信息
		var url = MdAppUrl.Api42 + "/api/PostAddr/GetByID?addrID=" + vm.AddrID;
		getAjaxData(url, function(reData) {
			if(reData && reData.State == 1 && reData.Data) {
				vm.ProvinceCode = reData.Data.ProvinceCode;
				vm.Province = reData.Data.Province;
				vm.CityCode = reData.Data.CityCode;
				vm.City = reData.Data.City;
				vm.District = reData.Data.District;
				vm.Address = reData.Data.Address;

				vm.RecvUserName = reData.Data.RecvUserName;
				document.getElementById("txtRecvUserName").value = reData.Data.RecvUserName;

				vm.LinkPhone = reData.Data.LinkPhone;
				document.getElementById("txtLinkPhone").value = reData.Data.LinkPhone;

				vm.ZipCode = reData.Data.ZipCode;
				document.getElementById("txtZipCode").value = reData.Data.ZipCode;

				vm.IsDefault = reData.Data.IsDefault;
			}
		}, true);
	} else {
		vm.ProvinceCode = "";
		vm.Province = "";
		vm.CityCode = "";
		vm.City = "";
		vm.District = "";
		vm.Address = "";
		vm.RecvUserName = "";
		document.getElementById("txtRecvUserName").value = "";
		vm.LinkPhone = "";
		document.getElementById("txtLinkPhone").value = "";
		vm.ZipCode = "";
		document.getElementById("txtZipCode").value = "";
		vm.IsDefault = 1;
	}
}

//修改、添加添加收货地址
$("#selAddress,#selAddress+.body").click(function() {
	mapAddress.show({
		Province: vm.Province,
		City: vm.City,
		District: vm.District,
		Address: vm.Address,
		MapLng: vm.MapLng,
		MapLat: vm.MapLat
	}, function(res) {
		if(res) {
			vm.Province = res.Province;
			vm.City = res.City;
			vm.District = res.District;
			vm.Address = res.Address;
			vm.MapLng = res.MapLng;
			vm.MapLat = res.MapLat;
		}
	});
})

//页面返回
$(".modifyBack").click(function() {
	vm.IsShowmodifyAddr = 1;
});

//保存收货地址
$("#btnSave").click(saveAddr);

function saveAddr() {
	vm.RecvUserName = trim(document.getElementById("txtRecvUserName").value);
	if(!vm.RecvUserName) {
		layer.open({
			content: '请输入收货人姓名！',
			skin: 'msg',
			time: 1
		});
		return;
	}

	vm.LinkPhone = trim(document.getElementById("txtLinkPhone").value);
	var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
	var flag = reg.test(vm.LinkPhone);
	if(!flag) {
		layer.open({
			content: '您输入的手机号码有误，请核对后再试！',
			skin: 'msg',
			time: 1.5
		});
		return;
	}

	if(!vm.Province) {
		layer.open({
			content: '请输入收货地址！',
			skin: 'msg',
			time: 1.5
		});
		return;
	}

	$("#btnSave").unbind('click');

	//获取省的code
	var idx = 0;
	areaData.every(function(item, index) {
		var arr = item.split('@');
		if(arr[0] == vm.Province) {
			vm.ProvinceCode = arr[1];
			idx = index;
			return false;
		}
		return true;
	});

	//获取市的code
	if(vm.Province == vm.City) {
		vm.CityCode = vm.ProvinceCode;
	} else {
		//获取市的code
		for(idx = idx + 1; idx < areaData.length; idx++) {
			var arr = areaData[idx].split('@');
			var city = arr[0];
			if(city == vm.City) {
				vm.CityCode = arr[1];
				break;
			}
			continue;
		}
	}

	vm.ZipCode = trim(document.getElementById("txtZipCode").value);

	//新增
	if(vm.IsAdd) {
		var data = {
			"ProvinceCode": vm.ProvinceCode,
			"Province": vm.Province,
			"CityCode": vm.CityCode,
			"City": vm.City,
			"District": vm.District,
			"Address": vm.Address,
			"RecvUserName": vm.RecvUserName,
			"LinkPhone": vm.LinkPhone,
			"ZipCode": vm.ZipCode,
			"IsDefault": vm.IsDefault
		};
		var url = MdAppUrl.Api42 + "/api/PostAddr/Add";
		postAjaxData(url, data, function(reData) {

			if(reData && reData.State == 1 && reData.Data > 0) {
				//重新获取选择收货地址页面数据
				loadOtherAddr();
				layer.open({
					content: '保存收货地址成功！',
					skin: 'msg',
					time: 1
				});
				if(vm.AddrList.length == 1) {
					vm.SelectedID = vm.AddrList[0].ID;

					//提交订单页选择的地址
					vm.PostAddr.RecvUserName = vm.AddrList[0].RecvUserName;
					vm.PostAddr.LinkPhone = vm.AddrList[0].LinkPhone;
					vm.PostAddr.Address = contractAddress(vm.AddrList[0].Province, vm.AddrList[0].City, vm.AddrList[0].District, vm.AddrList[0].Address);
				}
				setTimeout(function() {
					vm.IsShowmodifyAddr = 1;
				}, 1000);

			} else {
				layer.open({
					content: '保存收货地址失败，请于稍后再试！',
					skin: 'msg',
					time: 1
				});
			}
			setTimeout(function() {
				$("#btnSave").click(saveAddr);
			}, 1500);
		}, true);
	} else {
		//修改
		var data = {
			"ID": vm.AddrID,
			"Province": vm.Province,
			"CityCode": vm.CityCode,
			"City": vm.City,
			"District": vm.District,
			"Address": vm.Address,
			"RecvUserName": vm.RecvUserName,
			"LinkPhone": vm.LinkPhone,
			"ZipCode": vm.ZipCode,
			"IsDefault": vm.IsDefault
		};
		var url = MdAppUrl.Api42 + "/api/PostAddr/Edit";
		postAjaxData(url, data, function(reData) {
			if(reData && reData.State == 1 && reData.Data == true) {
				//如果修改的是当前订单选择的收货地址
				if(data.ID == vm.SelectedID) {
					vm.PostAddr.RecvUserName = data.RecvUserName;
					vm.PostAddr.LinkPhone = data.LinkPhone;
					vm.PostAddr.Address = contractAddress(data.Province, data.City, data.District, data.Address);
				}
				//重新获取选择收货地址页面数据
				loadOtherAddr();
				layer.open({
					content: '修改收货地址成功！',
					skin: 'msg',
					time: 1
				});
				setTimeout(function() {
					vm.IsShowmodifyAddr = 1;
				}, 1000);

			} else {
				layer.open({
					content: '修改收货地址失败，请于稍后再试！',
					skin: 'msg',
					time: 1
				});
			}
			setTimeout(function() {
				$("#btnSave").click(saveAddr);
			}, 1500);
		}, true);
	}
}

//删除收货地址
function delAddr() {
	layer.open({
		content: '确定删除此收货地址？',
		btn: ['删除', '取消'],
		yes: function(index) {
			//获取用户收货地址
			var url = MdAppUrl.Api42 + "/api/PostAddr/Delete?addrID=" + vm.AddrID;
			getAjaxData(url, function(reData) {
				if(reData && reData.State == 1 && reData.Data == true) {
					//重新获取选择收货地址页面数据
					loadOtherAddr();
					//如果删除的是当前订单选择的收货地址
					if(vm.AddrID == vm.SelectedID) {
						vm.PostAddr.RecvUserName = "";
						vm.PostAddr.LinkPhone = "";
						vm.PostAddr.Address = "";
						vm.PostAddr.AddrId = 0;
						vm.SelectedID = 0;
					}
					layer.open({
						content: '删除收货地址成功！',
						skin: 'msg',
						time: 1
					});
					setTimeout(function() {
						vm.IsShowmodifyAddr = 1;
					}, 1000);
				}
			}, true);
			layer.closeAll();
		}
	});
}

var areaData = ["上海@310000", "上海市@310100", "江苏@320000", "南京@320100", "无锡@320200", "徐州@320300", "常州@320400", "苏州@320500", "南通@320600", "连云港@320700", "淮安@320800", "盐城@320900", "扬州@321000", "镇江@321100", "泰州@321200", "宿迁@321300", "浙江@330000", "杭州@330100", "宁波@330200", "温州@330300", "嘉兴@330400", "湖州@330500", "绍兴@330600", "金华@330700", "衢州@330800", "舟山@330900", "台州@331000", "丽水@331100", "安徽@340000", "合肥@340100", "芜湖@340200", "蚌埠@340300", "淮南@340400", "马鞍山@340500", "淮北@340600", "铜陵@340700", "安庆@340800", "黄山@341000", "滁州@341100", "阜阳@341200", "宿州@341300", "六安@341500", "亳州@341600", "池州@341700", "宣城@341800", "江西@360000", "南昌@360100", "景德镇@360200", "萍乡@360300", "九江@360400", "新余@360500", "鹰潭@360600", "赣州@360700", "吉安@360800", "宜春@360900", "抚州@361000", "上饶@361100", "北京@110000", "北京市@110100", "天津@120000", "天津市@120100", "山西@140000", "太原@140100", "大同@140200", "阳泉@140300", "长治@140400", "晋城@140500", "朔州@140600", "晋中@140700", "运城@140800", "忻州@140900", "临汾@141000", "吕梁@141100", "山东@370000", "济南@370100", "青岛@370200", "淄博@370300", "枣庄@370400", "东营@370500", "烟台@370600", "潍坊@370700", "济宁@370800", "泰安@370900", "威海@371000", "日照@371100", "莱芜@371200", "临沂@371300", "德州@371400", "聊城@371500", "滨州@371600", "菏泽@371700", "河北@130000", "石家庄@130100", "唐山@130200", "秦皇岛@130300", "邯郸@130400", "邢台@130500", "保定@130600", "张家口@130700", "承德@130800", "沧州@130900", "廊坊@131000", "衡水@131100", "内蒙@150000", "呼和浩特@150100", "包头@150200", "乌海@150300", "赤峰@150400", "通辽@150500", "鄂尔多斯@150600", "呼伦贝尔@150700", "巴彦淖尔@150800", "乌兰察布@150900", "兴安盟@152200", "锡林郭勒盟@152500", "阿拉善盟@152900", "湖南@430000", "长沙@430100", "株洲@430200", "湘潭@430300", "衡阳@430400", "邵阳@430500", "岳阳@430600", "常德@430700", "张家界@430800", "益阳@430900", "郴州@431000", "永州@431100", "怀化@431200", "娄底@431300", "湘西@433100", "湖北@420000", "武汉@420100", "黄石@420200", "十堰@420300", "宜昌@420500", "襄阳@420600", "鄂州@420700", "荆门@420800", "孝感@420900", "荆州@421000", "黄冈@421100", "咸宁@421200", "随州@421300", "恩施@422800", "仙桃@429004", "潜江@429005", "天门@429006", "神农架@429021", "河南@410000", "郑州@410100", "开封@410200", "洛阳@410300", "平顶山@410400", "安阳@410500", "鹤壁@410600", "新乡@410700", "焦作@410800", "济源@419001", "濮阳@410900", "许昌@411000", "漯河@411100", "三门峡@411200", "南阳@411300", "商丘@411400", "信阳@411500", "周口@411600", "驻马店@411700", "广东@440000", "广州@440100", "韶关@440200", "深圳@440300", "珠海@440400", "汕头@440500", "佛山@440600", "江门@440700", "湛江@440800", "茂名@440900", "肇庆@441200", "惠州@441300", "梅州@441400", "汕尾@441500", "河源@441600", "阳江@441700", "清远@441800", "东莞@441900", "中山@442000", "东沙群岛@442100", "潮州@445100", "揭阳@445200", "云浮@445300", "广西@450000", "南宁@450100", "柳州@450200", "桂林@450300", "梧州@450400", "北海@450500", "防城港@450600", "钦州@450700", "贵港@450800", "玉林@450900", "百色@451000", "贺州@451100", "河池@451200", "来宾@451300", "崇左@451400", "福建@350000", "福州@350100", "厦门@350200", "莆田@350300", "三明@350400", "泉州@350500", "漳州@350600", "南平@350700", "龙岩@350800", "宁德@350900", "海南@460000", "海口@460100", "三亚@460200", "三沙@460300", "五指山@469001", "琼海@469002", "儋州@460400", "文昌@469005", "万宁@469006", "东方@469007", "安定县@469021", "屯昌县@469022", "澄迈县@469023", "临高县@469024", "白沙@469025", "昌江@469026", "乐东@469027", "陵水@469028", "保亭@469029", "琼中@469030", "西沙群岛@469037", "南沙群岛@469038", "中沙群岛@469039", "辽宁@210000", "沈阳@210100", "大连@210200", "鞍山@210300", "抚顺@210400", "本溪@210500", "丹东@210600", "锦州@210700", "营口@210800", "阜新@210900", "辽阳@211000", "盘锦@211100", "铁岭@211200", "朝阳@211300", "葫芦岛@211400", "吉林@220000", "长春@220100", "吉林@220200", "四平@220300", "辽源@220400", "通化@220500", "白山@220600", "松原@220700", "白城@220800", "延边@222400", "黑龙江@230000", "哈尔滨@230100", "齐齐哈尔@230200", "鸡西@230300", "鹤岗@230400", "双鸭山@230500", "大庆@230600", "伊春@230700", "佳木斯@230800", "七台河@230900", "牡丹江@231000", "黑河@231100", "绥化@231200", "大兴安岭@232700", "陕西@610000", "西安@610100", "铜川@610200", "宝鸡@610300", "咸阳@610400", "渭南@610500", "延安@610600", "汉中@610700", "榆林@610800", "安康@610900", "商洛@611000", "新疆@650000", "乌鲁木齐@650100", "克拉玛依@650200", "吐鲁番@650400", "哈密@650500", "昌吉@652300", "博尔塔拉@652700", "巴音郭楞@652800", "阿克苏@652900", "克孜勒苏@653000", "喀什@653100", "和田@653200", "伊犁@654000", "塔城@654200", "阿勒泰@654300", "石河子@659001", "阿拉尔@659002", "图木舒克@659003", "五家渠@659004", "甘肃@620000", "兰州@620100", "嘉峪关@620200", "金昌@620300", "白银@620400", "天水@620500", "武威@620600", "张掖@620700", "平凉@620800", "酒泉@620900", "庆阳@621000", "定西@621100", "陇南@621200", "临夏@622900", "甘南@623000", "宁夏@640000", "银川@640100", "石嘴山@640200", "吴忠@640300", "固原@640400", "中卫@640500", "青海@630000", "西宁@630100", "海东@630200", "海北@632200", "黄南@632300", "海南藏族@632500", "果洛@632600", "玉树@632700", "海西@632800", "重庆@500000", "重庆市@500100", "云南@530000", "昆明@530100", "曲靖@530300", "玉溪@530400", "保山@530500", "昭通@530600", "丽江@530700", "普洱@530800", "临沧@530900", "楚雄@532300", "红河@532500", "文山@532600", "西双版纳@532800", "大理@532900", "德宏@533100", "怒江@533300", "迪庆@533400", "贵州@520000", "贵阳@520100", "六盘水@520200", "遵义@520300", "安顺@520400", "铜仁@520600", "黔西南@522300", "毕节@520500", "黔东南@522600", "黔南@522700", "西藏@540000", "拉萨@540100", "昌都@540300", "山南@540500", "日喀则@540200", "那曲@542400", "阿里@542500", "林芝@540400", "四川@510000", "成都@510100", "自贡@510300", "攀枝花@510400", "泸州@510500", "德阳@510600", "绵阳@510700", "广元@510800", "遂宁@510900", "内江@511000", "乐山@511100", "南充@511300", "眉山@511400", "宜宾@511500", "广安@511600", "达州@511700", "雅安@511800", "巴中@511900", "资阳@512000", "阿坝@513200", "甘孜@513300", "凉山@513400", "香港@810000", "香港岛@810100", "九龙@810200", "新界@810300", "澳门@820000", "澳门半岛@820100", "离岛@820200", "台湾@710000", "台北@710100", "高雄@710200", "台南@710300", "台中@710400", "金门县@710500", "南投县@710600", "基隆@710700", "新竹@710800", "嘉义@710900", "新北@711100", "宜兰县@711200", "新竹县@711300", "桃园县@711400", "苗栗县@711500", "彰化县@711700", "嘉义县@711900", "云林县@712100", "屏东县@712400", "台东县@712500", "花莲县@712600", "澎湖县@712700", "连江县@712800"];