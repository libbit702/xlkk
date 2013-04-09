(function(window) {
	var KK = {};

	KK.Contact = {
		$container: null,
		$show: null,
		$prev: null,
		$next: null,
		
		count: 0,
		index: 1,

		containerWidth: 0,
		showWidth: 0,
		liWidth: 0,

		left: 0,

		init: function($container, $show, $prev, $next) {
			KK.Contact.$container = $container;
			KK.Contact.$show = $show;
			KK.Contact.$prev = $prev;
			KK.Contact.$next = $next;

			KK.Contact.containerWidth = KK.Contact.$container.width();
			KK.Contact.liWidth = KK.Contact.$show.find('li:first').width() + 20;
			KK.Contact.count = KK.Contact.$show.find('li').length;
			KK.Contact.showWidth = KK.Contact.liWidth * KK.Contact.count;

			KK.Contact.addListeners();
		},

		prev: function() {
			KK.Contact.animate('+');
		},

		next: function() {
			KK.Contact.animate('-');
		},

		animate: function(direction) {
			if (direction == '+') KK.Contact.left += KK.Contact.liWidth;
			if (direction == '-') KK.Contact.left -= KK.Contact.liWidth;

			if (KK.Contact.left > 0) {
				KK.Contact.left = 0
				return;
			}

			if (KK.Contact.left < (KK.Contact.containerWidth - KK.Contact.showWidth)) {
				KK.Contact.left = KK.Contact.containerWidth - KK.Contact.showWidth;
				return;
			}

			KK.Contact.$show.animate({
				left: direction+'='+KK.Contact.liWidth
			}, 500);
		},

		addListeners: function() {
			KK.Contact.$prev.click(function() {
				KK.Contact.prev();
			});
			KK.Contact.$next.click(function() {
				KK.Contact.next();
			});
		}
	};

	$(function() {
		KK.Contact.init($('#look_back .old_ones:first'), $('#look_back ul:first'), $('#look_back .pre:first'), $('#look_back .next:first'));
	});
})(window);
