var vm = avalon.define({
	$id: "myCtl",
	Reason: "",
	IsFromMyOrder: false
})

$(function() {
	//				var view = plus.webview.currentWebview();
	//				vm.IsFromMyOrder = view.IsFromMyOrder;
	//				setTimeout(function() {
	//					if(view.msg.indexOf("6001") > 0 || view.msg.indexOf("62001") > 0)
	//						vm.Reason = "用户支付中途取消";
	//					else if(view.msg.indexOf("8000") > 0)
	//						vm.Reason = "正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态";
	//					else if(view.msg.indexOf("4000") > 0)
	//						vm.Reason = "订单支付失败";
	//					else if(view.msg.indexOf("5000") > 0)
	//						vm.Reason = "重复请求";
	//					else if(view.msg.indexOf("6002") > 0)
	//						vm.Reason = "网络连接出错";
	//					else if(view.msg.indexOf("6004") > 0)
	//						vm.Reason = "支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态";
	//					else
	//						vm.Reason = view.msg;
	//				}, 300);
});

$(".mui-action-back").click(function() {
	history.back();
})

$("#btnMyOrder").click(function() {
	//如果来自于我的订单支付的，则直接返回
	if(vm.IsFromMyOrder) {
		history.back();
	} else {
		//如果是从订单列表进入订单详情后支付的，要关闭订单列表和详情，重新打开订单列表
		//					var view = plus.webview.getWebviewById("my-order-main.html");
		//					if(view && view.id) {
		//						var viewDetail = plus.webview.getWebviewById("order-detail.html");
		//						if(viewDetail && viewDetail.id) {
		//							//关闭订单详情
		//							viewDetail.close("none");
		//						}
		//						//添加关闭订单列表事件
		//						view.addEventListener("close", function() {
		//							//关闭后再打开订单列表
		//							var view2 = openWindow("my-order-main.html");
		//							view2.addEventListener("show", function() {
		//								plus.webview.currentWebview().close("none");
		//							});
		//						})
		//						//关闭订单列表
		//						view.close("none");
		//					} else {
		//						//从购物车列表进入时
		//						view = openWindow("my-order-main.html");
		//						view.addEventListener("show", function() {
		//							plus.webview.currentWebview().close("none");
		//						});
		//					}
	}
});