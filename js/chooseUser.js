function showChooseUser(callback) {
	chooseUser.show(function(user) {
		if(!user) {
			layer.open({
				content: '请完善用户信息！',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			showChooseUser(callback);
		} else {
			callback(user);
		}
	});

};

var chooseUserCtl = avalon.define({
	$id: "ChooseUserCtl",
	Phone: "",
	CodePhone: '',
	Code: "",
	intvl: "",
	IsShowMain: 0,
	IsShowChoose: 0,
	PhoneCode: "",
	Countdown: 60,
	Datas: "",
	getUserLogo: function(id) {
		return MdAppUrl.pic + "/dXNlci9sb2dv_" + id + "_40x40.png";
	},
	getCode: function(e) {
		var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
		var flag = reg.test(chooseUserCtl.Phone);
		if(!flag) {
			layer.open({
				content: '请输入正确的手机号！',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			return;
		}

		if(chooseUserCtl.Countdown != 60) {
			return;
		}

		$(e.target).removeClass("color-blue").addClass("color-gray-deep");

		chooseUserCtl.intvl = setInterval(function() {
			chooseUserCtl.Countdown -= 1;
			if(chooseUserCtl.Countdown == 0) {
				$(e.target).removeClass("color-gray-deep").addClass("color-blue");
				chooseUserCtl.Countdown = 60;
				clearInterval(chooseUserCtl.intvl);
			}
		}, 1000);

		var url = MdAppUrl.Api + "/u/validRegPhone?phone=" + $.trim(chooseUserCtl.Phone);
		chooseUserCtl.CodePhone = chooseUserCtl.Phone;
		getAjaxData(url, function(reData) {
			setTimeout(function() {
				if(reData.State == 0) {
					layer.alert(reData.Message);
				} else {
					chooseUserCtl.PhoneCode = reData.Data;
					chooseUserCtl.Code = reData.Data;
				}
			}, 1000);
		});
	},
	btnConfirmInfo: function(e) {
		if(!chooseUserCtl.Phone) {
			layer.open({
				content: '请输入手机号！',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			return;
		}

		if(!chooseUserCtl.Code) {
			layer.open({
				content: '请输入验证码！',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			return;
		}

		if(chooseUserCtl.PhoneCode != chooseUserCtl.Code) {
			layer.open({
				content: '您输入的验证码不正确！',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			return;
		}

        if(chooseUserCtl.Phone != chooseUserCtl.CodePhone){
                layer.open({
                	content:"手机号发生改变，是否继续?",
                    btn: ["确定","取消"],
					yes:function(index){
                		console.log(chooseUserCtl.Phone , chooseUserCtl.CodePhone)
                        chooseUserCtl.CodePhone = chooseUserCtl.Phone;
                        phoneSubmit(),
						layer.close(index);
					}
				})
			return
         }
         phoneSubmit();
		function phoneSubmit(){
            var url = MdAppUrl.Api45 + "/api/v1.0/User/LoginUserByPhone?phone=" + chooseUserCtl.CodePhone;

            getAjaxData(url, function(res) {
                if(res && res.State >= 1) {
                    var datas = res.Data;
                    if(datas.length > 1) {
                        chooseUserCtl.Datas = datas;
                        chooseUserCtl.IsShowChoose = 1;
                        $("#div-chooseUser-list").css("display", "block");
                    } else {
                        if(datas[0].IsNew == 1) {
                            layer.open({
                                content: '请使用手机号作为密码登陆',
                                btn: '我知道了',
                                shadeClose: false,
                                yes: function() {
                                    layer.closeAll();
                                    chooseUser.hide();
                                }
                            });
                        } else {
                            chooseUser.hide();
                        }
                        localSave("user", datas[0]);
                        chooseUser.user = datas[0];

                    }
                } else {
                    layer.open({
                        content: res ? res.ErrorMessage : '提交失败！',
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            });
		}
	}
});




var chooseUser = {
	callback: undefined,
	user: undefined,
	show: function(callback) {
		$("#div-chooseUser-info").css("display", "block");
		$("body").css("overflow", "hidden");
		chooseUserCtl.IsShowMain = 1;
		chooseUser.callback = callback;
	},
	hide: function() {
		chooseUserCtl.Countdown = 60;
		chooseUserCtl.PhoneCode = "";
		chooseUserCtl.Phone = "";
		chooseUserCtl.Code = "";
		$("#div-chooseUser-info #btn-idtCode").removeClass("color-gray-deep").addClass("color-blue");
		clearInterval(chooseUserCtl.intvl);
		chooseUserCtl.IsShowMain = 0;
		if(chooseUser.callback) {
			chooseUser.callback(chooseUser.user);
		}
		chooseUser.user = undefined;
		$("#div-chooseUser-info").fadeOut("normal");
	},
	showChoose: function() {
		chooseUserCtl.IsShowChoose = 1;
	},
	hideChoose: function() {
		chooseUserCtl.IsShowChoose = 0;
		$("#div-chooseUser-list").fadeOut("normal");
	}
};

$(function() {
	$("#div-chooseUser-main .mui-action-back").click(function() {
		if(chooseUserCtl.IsShowChoose == 1) {
			chooseUser.hideChoose();
		} else if(chooseUserCtl.IsShowMain == 1) {
			chooseUser.hide();
		}
	});

	$("#div-chooseUser-list").on("click", ".chooseUser", function() {
		var idx = $(this).attr("idx");
		localSave("user", chooseUserCtl.Datas[idx]);
		chooseUser.user = chooseUserCtl.Datas[idx];
		chooseUser.hideChoose();
		chooseUser.hide();
	});
});