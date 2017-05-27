//定义模型
var app = avalon.define({
	$id: 'appCtrl',
	IsEdit: false,
	IsLoadList: false,
	List: "",
	getLogo: getLogo,
	AllPrice: 0,
	ChooseCount: 0,
	Choosed: [],
	encode: encode,
	IsOverflow: false,
	TotalAll: 0,
	//加减方法
	changeProdNum: function(method, idx, pidx, compid, num) {
		var prod = app.List[idx].ProdList[pidx];
		if(method == "add") {
			changeNum(prod.ID, parseInt(num) + 1, compid);

		} else if(num != 1) {
			changeNum(prod.ID, parseInt(num) - 1, compid);
		}
		return false;
	},
	//跳转产品详情
	prodinfo: function(prodId, skuName, carId) {
		location.href = "prod-info-new.html?prodId=" + prodId + "&skuName=" + encodeURI(skuName) + "&carId=" + carId;
	}
});
//顶部返回
$(".mui-action-back").click(function() {
	history.back();
});

$(function() {
	user.ready(function() {
		getCart();
	});
});

//获取购物车记录
function getCart() {
	var url = MdAppUrl.Api42 + "/api/Cart/GetCartList";
	getAjaxData(url, function(reData) {
		if(reData && reData.State > 0) {
			app.List = reData.Data;
			$(".mui-input-numbox").click(function(e) { e.stopPropagation() });
		} else {}
	}, true);
};

//更改本地购物车数量
function changeLocalCount() {
	//清空
	localClear("CartInfo" + user.UserID);
	//重新赋值
	var cartList = [];
	for(var i = 0; i < app.List.length; i++) {
		for(var j = 0; j < app.List[i].ProdList.length; j++) {
			var temp = {
				ProdID: app.List[i].ProdList[j].ProdID,
				SkuName: app.List[i].ProdList[j].SkuName
			};
			cartList.push(temp);
		}
	}
	localSave("CartInfo" + user.UserID, cartList);
};

function encode(value) {
	return encodeURI(value);
};

function getLogo(id) {
	return MdAppUrl.Img + "/prod/logo/" + id + "_70x70.jpg";
};

//输入框改变
$(".mui-content").on("change", ".mui-input-numbox", function() {
	changeNums(this);
	//输入框最小值1
	$(".numprice").on('input propertychange', function() {
			   var price=$(this).val();
			   if(price<0){
			   	$(this).val(1);
			   }

	});
	$(".numprice").blur(function() {
			   var price=$(this).val();
			   if(price<1){
			   	$(this).val(1);
			   }

		})
});
//改变购物的数量
	
function changeNums(dom) {
	if(dom.value != null && dom.value != 0) {
		var cartId = dom.getAttribute("data-cartId");
		var nums = dom.value;
		var url = MdAppUrl.Api42 + "/api/cart/EditBuyNums?cartId=" + cartId + "&nums=" + nums;
		getAjaxData(url, function(reData) {
			if(reData && reData.State == 1) {
				$("#provSelect1").val(nums + 1); //设置
				var compId = dom.getAttribute("data-compId");
				var prodId = dom.getAttribute("data-id");
				for(var i = 0; i < app.List.length; i++) {
					if(app.List[i].CompID == compId) {
						for(var j = 0; j < app.List[i].ProdList.length; j++) {
							if(app.List[i].ProdList[j].ID == cartId) {
								app.List[i].ProdList[j].BuyNums = nums;
								break;
							}
						}
						break;
					}
				}
				countBottom();
			} else {
				layer.open({
					content: '修改数量失败!',
					skin: 'msg',
					time: 1
				})
			}
		}, true);
	} else {
		return false;
	}

};
//+-改变购物的数量
function changeNum(prodid, nums, compId) {
	var url = MdAppUrl.Api42 + "/api/cart/EditBuyNums?cartId=" + prodid + "&nums=" + nums;
	getAjaxData(url, function(reData) {
		if(reData && reData.State == 1) {
			for(var i = 0; i < app.List.length; i++) {
				if(app.List[i].CompID == compId) {
					for(var j = 0; j < app.List[i].ProdList.length; j++) {
						if(app.List[i].ProdList[j].ID == prodid) {
							app.List[i].ProdList[j].BuyNums = nums;
							break;
						}
					}
					break;
				}
			}
			countBottom();
		} else {
			layer.open({
				content: '修改数量失败!',
				skin: 'msg',
				time: 1
			})
		}
	}, true);
};

//选中
$(".mui-content").on("click", ".select", function() {
	var id = this.getAttribute("data-id");
	var dataType = this.getAttribute("data-type");
	var selType;

	if(app.Choosed.indexOf(id) >= 0) {
		app.Choosed.splice(app.Choosed.indexOf(id), 1);
		selType = 0;

	} else {
		app.Choosed.push(id);
		selType = 1;
	}

	if(dataType == "group") {
		if(selType == 0) {
			var selected = document.querySelector("#cart_group_" + id).querySelectorAll(".select-child.icon-select")

			for(var i = 0; i < selected.length; i++) {
				var key = selected[i].getAttribute("data-id");
				if(app.Choosed.indexOf(key) >= 0) {
					app.Choosed.splice(app.Choosed.indexOf(key), 1);
				}
			}
		} else {
			var unSelected = document.querySelector("#cart_group_" + id).querySelectorAll(".select-child.icon-unselect")

			for(var i = 0; i < unSelected.length; i++) {
				var key = unSelected[i].getAttribute("data-id");
				if(app.Choosed.indexOf(key) < 0) {
					app.Choosed.push(key);
				}
			}
		}
	} else {
		var compId = this.getAttribute("data-compId");

		var count = document.querySelector("#cart_group_" + compId).getAttribute("data-count");
		var select_count = document.querySelector("#cart_group_" + compId).querySelectorAll(".select-child.icon-select").length;

		if(count == select_count) {
			if(app.Choosed.indexOf(compId) < 0) {
				app.Choosed.push(compId);
			}
		} else {
			if(app.Choosed.indexOf(compId) >= 0) {
				app.Choosed.splice(app.Choosed.indexOf(compId), 1);
			}
		}
	}
	//是否全选
	isSelectAll();
	//计算底部信息 
	countBottom();
});

//是否全部选中
function isSelectAll() {
	//计算是否全选中
	var groupCount = document.querySelector(".mui-content").querySelectorAll(".select-group.icon-select").length;
	if(groupCount == app.List.length) {
		if(app.Choosed.indexOf('all') < 0) {
			app.Choosed.push("all");
		}
	} else {
		if(app.Choosed.indexOf('all') >= 0) {
			app.Choosed.splice(app.Choosed.indexOf('all'), 1);
		}
	}
};

//计算底部信息
function countBottom() {
	var selected = document.querySelector(".mui-content").querySelectorAll(".select-child.icon-select");

	var allNums = 0;
	var allPrice = 0;
	var total = [];
	for(var i = 0; i < selected.length; i++) {
		var price = selected[i].getAttribute("data-price");
		var nums = selected[i].getAttribute("data-nums");
		allNums += parseInt(nums);
		total.push(price * nums).toFixed(2);
		var choosePrice = parseFloat(price * nums).toFixed(2);

	}
	for(var i = 0; i < total.length; i++) {
		allPrice += parseFloat(total[i]);
		if(app.IsEdit == false) {
			if(total[i] > 10000000) {
				layer.open({
					content: '单个商品购买的总价格不能大于一千万!',
					skin: 'msg',
					time: 2
				})
				app.IsOverflow = true;
				app.TotalAll = 1;
				app.ChooseCount = 0;
				app.AllPrice = 0;
				return false;
			}
		}

	}

	app.IsOverflow = false;
	app.TotalAll = 0;
	var priceNum = Math.round(allPrice * 100) / 100;
	allPrice = parseFloat(priceNum).toFixed(2);
	app.ChooseCount = allNums;
	app.AllPrice = allPrice;
};
//清空底部信息
function clearBottom() {
	app.ChooseCount = 0;
	app.AllPrice = 0;
	document.getElementsByClassName("choose_num").value = "0";
}
//编辑
$("#btnEdit").click(function() {
	app.IsEdit = true;
	countBottom();
});

//完成
$("#btnComplete").click(function() {
	app.IsEdit = false;
	app.Choosed = [];
	countBottom();
});

//全选
$("#btnSltAll").click(function() {
	if(app.Choosed.indexOf('all') >= 0) {
		app.Choosed = [];
	} else {
		app.Choosed.push('all');
		var unSelected = document.querySelector(".mui-content").querySelectorAll(".icon-unselect");

		for(var i = 0; i < unSelected.length; i++) {
			var key = unSelected[i].getAttribute("data-id");

			if(app.Choosed.indexOf(key) < 0) {
				app.Choosed.push(key);
			}
		}
	}

	//重新计算价格
	countBottom();
});

//结算
$("#btnSubmit").click(function() {
	if(app.ChooseCount > 0 || app.TotalAll > 0) {
		var selected = document.querySelector(".mui-content").querySelectorAll(".select-child.icon-select");
		var cartIds = [];
		for(var i = 0; i < selected.length; i++) {
			cartIds.push(selected[i].getAttribute("data-cartId"));
		}

		if(app.IsOverflow == false) {
			window.location.href = "submit-order.html?Ids=" + cartIds.join(',') + "&FromCart=true&isCart=y";
		} else {
			layer.open({
				content: '单个商品购买的总价格不能大于一千万!',
				skin: 'msg',
				time: 1
			})

		}
	} else {
		layer.open({
			content: '请至少选择一个商品!',
			skin: 'msg',
			time: 1
		})
	}
});

//删除
$("#btnDelete").click(function() {
	if(app.ChooseCount == 0) {
		layer.open({
			content: '请选择您要删除的数据!',
			skin: 'msg',
			time: 1
		})
		return;
	}

	layer.open({
		content: '您确定要删除吗？',
		btn: ['是', '否'],
		yes: function(index) {
			var selected = document.querySelector(".mui-content").querySelectorAll(".select-child.icon-select");

			var cartIds = [];

			for(var i = 0; i < selected.length; i++) {
				cartIds.push(selected[i].getAttribute("data-cartId"));
			}

			//删除购物车数据
			deleteCarts(cartIds);
			layer.close(index);
		}
	});
});

//删除购物车
function deleteCarts(cartIds) {
	var url = MdAppUrl.Api42 + "/api/Cart/DeleteList";
	postAjaxData(url, cartIds, function(reData) {
		if(reData && reData.State == 1) {
			var selected = document.querySelector(".mui-content").querySelectorAll(".select-child.icon-select");
			for(var i = 0; i < selected.length; i++) {
				var id = selected[i].getAttribute("data-id");
				var compId = selected[i].getAttribute("data-compId");

				deleteCartByID(id, compId);
			}
			isSelectAll();
			countBottom();
			changeLocalCount();
			getCart();
		} else {
			layer.open({
				content: '删除购物车失败!',
				skin: 'msg',
				time: 1
			})
		}
	}, true);
};

//根据编号删除购物车
function deleteCartByID(id, compId) {
	//取消选择
	if(app.Choosed.indexOf(id) >= 0) {
		app.Choosed.splice(app.Choosed.indexOf(id), 1);
	}

	for(var i = 0; i < app.List.length; i++) {
		if(app.List[i].CompID == compId) {
			for(var j = 0; j < app.List[i].ProdList.length; j++) {
				if(app.List[i].ProdList[j].ID == id) {
					app.List[i].ProdList.splice(app.List[i].ProdList.indexOf(app.List[i].ProdList[j]), 1)
					break;
				}
			}

			if(app.List[i].ProdList.length == 0) {
				if(app.Choosed.indexOf(compId) >= 0) {
					app.Choosed.splice(app.Choosed.indexOf(compId), 1);
				}
				app.List.splice(app.List.indexOf(app.List[i]));
			}
			break;
		}
	}
}