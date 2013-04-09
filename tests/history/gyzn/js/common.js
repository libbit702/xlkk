(function(window) {
	var KK = {};

	KK.Common = {
		$header: null,
		$nav: null,
		$footer: null,

		title: '2013年3月观影指南 - 迅雷看看',
		baseurl: 'http://www.localtest.com/xlkk/tests/history/gyzn/',
        shareurl:'http://www.localtest.com/xlkk/tests/history/gyzn/share.jpg',

		Header: function($element) {
			$element.load(KK.Common.baseurl+'header.html');
		},

		Nav: function($element) {
			$element.load(KK.Common.baseurl+'nav.html', function() {
				$element.find('h1>a:first').attr('href', KK.Common.baseurl);

				$element.find('.mov_list_nav:first').attr('href', KK.Common.baseurl+'list.html');
				$element.find('.topic_nav:first').attr('href', KK.Common.baseurl+'topic.html');
				$element.find('.contact_nav:first').attr('href', KK.Common.baseurl+'contact.html');

				$element.find('.weibo>.tecentt:first').attr('href', 'http://v.t.qq.com/share/share.php?url='+encodeURIComponent(KK.Common.baseurl)+'&appkey=29109dfbe2334392a6452150a9034b4f&site=topics.kankan.com&assname=xlkk0728&title='+encodeURIComponent(KK.Common.title)+'&pic='+encodeURIComponent(KK.Common.shareurl));
				$element.find('.weibo>.sinat:first').attr('href', 'http://service.t.sina.com.cn/share/share.php?url='+encodeURIComponent(KK.Common.baseurl)+'&appkey=212641900&title='+encodeURIComponent(KK.Common.title)+'&ralateUid=1710335571&searchPic=false&pic='+encodeURIComponent(KK.Common.shareurl));
			});
		},

		Footer: function($element) {
			$element.load(KK.Common.baseurl+'footer.html');
		}
	};
    /*
	$(function() {
		KK.Common.Header($('.topchannel:first'));
		KK.Common.Nav($('.nav_wrap:first'));
		KK.Common.Footer($('.footer:first'));
		$('#close').attr('target', '_self');
		$('#close').attr('href', KK.Common.baseurl);
	});
    */
    window.KK = KK;
})(window);