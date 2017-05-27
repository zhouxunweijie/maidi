var chooseParams = {
	callback: undefined,
	show: function(callback) {
		chooseParams.callback = callback;
		$("body").css("overflow", "hidden");
		$("#div_chooseParams").show();
		vm.IsShowParams = 1;
	},
	hide: function(isCallback) {
		vm.IsShowParams = 0;

		if(isCallback) {
			if(typeof(chooseParams.callback) == "function") {
				chooseParams.callback();
			}
		}

		setTimeout(function() {
			$("body").css("overflow", "auto");
			$("#div_chooseParams").hide();
		}, 600);
	}
};

$(function() {

	$("#div_chooseParams .div_mark").click(function() {
		chooseParams.hide();
	});

	$("#div_chooseParams .closeWin").click(function() {
		chooseParams.hide();
	});

	$("#div_chooseParams #btn_chooseParams_save").click(function() {

		if(vm.BuyType > 0 && !vm.skuName) {
			layer.open({ content: '请选择一个型号!', skin: 'msg', time: 2 });
			return;
		}

		chooseParams.hide(true);
	});

	//参数 选择
	$("#div_chooseParams #body-params").on("click", ".params-item", function() {
		if($(this).hasClass("disabled") || $(this).attr("data-filter") == "0") {
			return;
		}

		if($(this).hasClass("active")) {
			$(this).removeClass("active");
			$(this).parent().attr("data-Value", "");
		} else {
			$(this).parent().find(".active").removeClass("active");
			$(this).parent().attr("data-Value", $(this).text());
			$(this).addClass("active");
		}

		reLoadParams($(this).attr("data-id"));
	});

});

function reLoadParams(paramId) {
	var chooses = $(".params_choose_box[data-filter='1'][data-value!='']");

	var inputs = $(".params_input_box[data-value]");

	var configs = [];

	for(var i = 0; i < chooses.length; i++) {
		var obj = {
			ID: chooses[i].getAttribute("data-id"),
			Name:chooses[i].getAttribute("data-name"),
			Value: chooses[i].getAttribute("data-value")
		};
		configs.push(obj);
	}

	for(var i = 0; i < inputs.length; i++) {
		var obj = {
			ID: chooses[i].getAttribute("data-id"),
			Name:chooses[i].getAttribute("data-name"),
			Value: chooses[i].getAttribute("data-value")
		};
		configs.push(obj);
	}

	var postData = {
		ProdID: vm.prodId,
		ParamID: paramId || 0,
		SelConfigs: configs
	};

	filterProdParams(postData);
};