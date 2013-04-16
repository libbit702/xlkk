(function(window) {
	var KK = {};

	KK.Guidance = {
		$element: null,
		left: 0,
		width: 0,

		itemWidth: 0,
		itemCount: 0,

		navWidth: 0,
		windowWidth: 0,

		direction: '',
		interval: 0,

		init: function($element) {
			KK.Guidance.$element = $element;
			KK.Guidance.initWidth();
			KK.Guidance.addListeners();
		},

		initWidth: function() {
			KK.Guidance.navWidth = $('#nav_wrap').width();
			KK.Guidance.windowWidth = $(window).width();

			KK.Guidance.itemWidth = KK.Guidance.$element.find('.mov_bar:first').width();
			KK.Guidance.itemCount = KK.Guidance.$element.find('.mov_bar').length;
			KK.Guidance.width = KK.Guidance.itemWidth * KK.Guidance.itemCount;
			KK.Guidance.$element.css('width', KK.Guidance.width+'px');
		},

		addListeners: function() {
			KK.Guidance.$element.mousemove(function(event) {
				var windowLeft = KK.Guidance.windowWidth - KK.Guidance.navWidth;
				var cursorLeft = event.pageX - KK.Guidance.navWidth;
				
				if (cursorLeft * 5 < windowLeft * 1) {
					KK.Guidance.move('+');
				} else if (cursorLeft * 5 > windowLeft * 4) {
					KK.Guidance.move('-');
				} else {
					KK.Guidance.move('');
				}
			});
		},

		resize: function() {
			KK.Guidance.windowWidth = $(window).width();
		},

		clear: function() {
			if (KK.Guidance.interval > 0) {
				clearInterval(KK.Guidance.interval);
				KK.Guidance.interval = 0;
			}
		},

		move: function(direction) {
			if (KK.Guidance.direction != direction) { // 变化
				KK.Guidance.clear();
				if (direction != '') {
					KK.Guidance.scroll(direction, KK.Guidance.itemWidth);
					KK.Guidance.interval = setInterval(function() {
						KK.Guidance.scroll(direction, KK.Guidance.itemWidth);
					}, 1000);
				}
				KK.Guidance.direction = direction;
			}
		},

		scroll: function(direction, step) {
			var leave = KK.Guidance.windowWidth - KK.Guidance.navWidth - KK.Guidance.width;

			if (direction == '+') {
				if (KK.Guidance.left >= 0) return;
				KK.Guidance.left += step;
			}
			if (direction == '-') {
				if (KK.Guidance.left <= leave) return;
				KK.Guidance.left -= step;
			}

			if (KK.Guidance.left > 0) {
				KK.Guidance.left = 0;
				KK.Guidance.clear();
			}

			if (KK.Guidance.left < leave) {
				KK.Guidance.left = leave;
				KK.Guidance.clear();
			}
			
			KK.Guidance.$element.animate({
				left: KK.Guidance.left
			}, 800);
		}
	};
    /*
	$(function() {
		KK.Guidance.init($('#guidance'));

		$(window).on('resize', function() {
	        KK.Guidance.resize();
	    });
	});
    */
})(window);
