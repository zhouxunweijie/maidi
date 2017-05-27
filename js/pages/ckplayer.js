$(function () {
    document.querySelector("#title").innerText = query("name").replace(".mp4", "");
    setTimeout(initPlayer, 800);
});

function initPlayer() {
	var flashvars = {
		p: 1,
		e: 1,
		i: '',
		wh: '100:100',
		h: 4,
		s: 1
	};
	//var video = ['http://img.ksbbs.com/asset/Mon_1605/0ec8cc80112a2d6.mp4->video/mp4'];
	var url = MdAppUrl.video + query("path");
	var video = [url + '->video/mp4'];
	var support = ['all'];
	CKobject.embedHTML5('a1', 'ckplayer_a1', '100%', '100%', video, flashvars, support);
};