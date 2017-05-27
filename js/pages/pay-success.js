var vm = avalon.define({
	$id: "myCtl",
	OrderIds: "",
	Datas: "",
	TotalPrice: 0
});

$(function() {
	vm.OrderIds = query("out_trade_no");
	setTimeout(function() {
		paySuccess();
	}, 300);
});

//通知成功
function paySuccess() {
	var url = MdAppUrl.Api42 + "/api/Pay/MobilePaySuccess?paySerial=" + vm.OrderIds;
	getAjaxData(url, function(res) {
		if(res && res.State > 0 && res.Data) {
			//加载信息
			loadInfo();
		}
	}, true);
}

//加载信息
function loadInfo() {
	var url = MdAppUrl.Api42 + "/api/pay/GetOrderList?paySerialId=" + vm.OrderIds;
	getAjaxData(url, function(res) {
		if(res && res.State > 0) {
			vm.Datas = res.Data;
			if(vm.Datas.length > 1) {
				for(var i in vm.Datas) {
					vm.TotalPrice += parseFloat(vm.Datas[i].PayPrice);
				}
				vm.TotalPrice = vm.TotalPrice.toFixed(2);
			}
			//支付成功之后给设计宝发送消息
			sendToSjb();
		} else {
			layer.msg("获取订单信息失败！")
		}
	}, true);
}

///支付成功之后给设计宝发送消息
function sendToSjb() {
	for(var i in vm.Datas) {
		//付款成功之后需要给设计宝发消息
		var url = MdAppUrl.Api4 + "/api/IMMsg/AddNoticeMsg";

		var msgPackage = {
			UserID: user.UserID,
			SendID: user.UserID,
			SendType: 1,
			ReceiveID: vm.Datas[i].SupplierID,
			ReceiveType: 2,
			MsgContent: JSON.stringify({
				MT: 5,
				CT: JSON.stringify({
					Type: 10,
					SID: user.UserID,
					Count: vm.Datas[i].PayCount,
					Sum: vm.Datas[i].PayTatalCount,
					OrderID: vm.Datas[i].OrderID,
					Name: user.RealName
				}),
				IR: 0
			}),
			MsgType: 10
		};

		postAjaxData(url, msgPackage, function(reData) {
			if(reData && reData.State >= 1) {

			} else {}
		});
	}
};