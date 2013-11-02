/***
 * @description div模拟滚动条
 * @link http://www.cnblogs.com/darkli/archive/2012/02/15/2352744.html
 * @example  
	var scroll = new ScrollBar();
	scroll.init({
		barContent: 'text_div'
	});
 */
define(['dom','eventutil'], function(d, et){
	var doc = document,
		utils = {			
			extend :function() {
				var args = Array.prototype.slice.call(arguments);
				if (args.length == 1)
					args.unshift({});
				for (var name in args[1]) {
					if (args[1].hasOwnProperty(name)) {
						args[0][name] = args[1][name];
					}
				}
				return args[0];
			}
		};

	function ScrollBar(){		
		this.defaults = {
			barClass:'scrollBar',
			barHoverClass: 'scrollBarHover',
			barActiveClass: 'scrollBarActive',
			barContent: null
		};
		this.options = {};
		this.bar = doc.createElement('div');
		this.content = null;
		this.wheelThread = 20;
		this.isScrolling = !1;
	}

	ScrollBar.prototype = {
		init:function(options){
			this.options = utils.extend(this.defaults, options || {});//bar的配置
			this.content = d(this.options.barContent).getEle();//bar所在的位置
			this.bar.className = this.options.barClass || 'scrollBar';//bar的class
			this.content.appendChild(this.bar);//将bar插入父节点

			var el = doc.createElement('div'),style = d(this.content).getStyle();
			//el.style.cssText = 'overflow: hidden; position: relative;padding:2px; width:' + style.width + '; height: ' + style.height + ';';
			d(el).setStyle('overflow', 'hidden');
			d(el).setStyle('position', 'relative');
			d(el).setStyle('padding', '0px');
			d(el).setStyle('width', style.width);
			d(el).setStyle('height', style.height);

			var contentParent = this.content.parentNode;			
			el.appendChild(this.content);
			el.appendChild(this.bar);
			contentParent.appendChild(el);

			this.setBarHeight();
			var self = this;
			var events = {
				onMouseDown: function(e) {
					e = e || window.event;
					var target = e.currentTarget || e.srcElement;
					target.style.cursor = 'default';
					self.bar.y = e.clientY;
					self.bar.t = parseInt(self.bar.style.marginTop);
					self.isScrolling = 1;
					self.options.barActiveClass && d(self.bar).addClass(self.options.barActiveClass);
				},
				onMouseMove: function(e) {
					e = e || window.event;
					var isClickButton = (e.button === 1 || e.button === 0);
					if (self.isScrolling && isClickButton) {
						window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
						self.scroll(e.clientY - self.bar.y);
						e.preventDefault && e.preventDefault();
						e.stopPropagation && e.stopPropagation();
					}
				},
				onMouseUp: function() {
					if (self.isScrolling) {
						self.isScrolling = 0;					   
						self.options.barActiveClass && d(self.bar).removeClass(self.options.barActiveClass);
					}
				},
				onMouseOver: function() {				   
					self.options.barHoverClass && d(self.bar).addClass(self.options.barHoverClass);
				},
				onMouseOut: function() {
					d(self.bar).removeClass(self.options.barHoverClass);
				},
				onMouseWheel: function(e) {
					e = e || window.event;
					if (d(self.bar).getEle().style.display !== 'none') {
						self.D = e.wheelDelta;
						e.returnValue = !1;
						var dd = self.D < 0 ? self.wheelThread : 0 - self.wheelThread;
						self.bar.y = e.clientY;
						self.bar.t = parseInt(self.bar.style.marginTop);
						self.scroll(dd);
					} else {
						self.scrollToBottom(e);
					}
				},
				onClick: function(e) {
					e.stopPropagation && e.stopPropagation()
				},
				onDomMouseScroll: function(e) {
					if (d(self.bar).getEle().style.display !== 'none') {
						self.D = e.detail > 0 ? -1 : 1;
						e.stopPropagation && e.stopPropagation();
						e.preventDefault && e.preventDefault();
						self.bar.y = e.clientY;
						self.bar.t = parseInt(self.bar.style.marginTop);
						self.scroll(self.D < 0 ? self.wheelThread : 0 - self.wheelThread);
					} else {
						self.scrollToBottom(e)
					}
				}
			}

			//绑定鼠标事件
			et.addEventHandler(this.bar, 'mousedown', events.onMouseDown);
			et.addEventHandler(doc, 'mousemove', events.onMouseMove);
			et.addEventHandler(this.bar, 'mouseout', events.onMouseOut);
			et.addEventHandler(this.bar, 'mouseover', events.onMouseOver);
			et.addEventHandler(doc, 'mouseup', events.onMouseUp);
			et.addEventHandler(this.content, 'mousewheel', events.onMouseWheel);
			et.addEventHandler(this.content, 'dommousescroll', events.onDomMouseScroll);
		},

		onscroll : doc.onscroll || function(){},

		scrollToBottom : doc.scrollToBottom || function(){},

		scroll: function(b) {
			this.marginTop = (this.bar.t || 0) + b;
			if (this.marginTop < 0)
				this.marginTop = 0;
			if (this.marginTop > this.content.clientHeight - this.bar.offsetHeight)
				this.marginTop = this.content.clientHeight - this.bar.offsetHeight,this.scrollToBottom();
			this.bar.style.marginTop = this.marginTop + "px";
			if (b == 0){
				this.onscroll(b, b);
			}
			var a = (this.content.scrollHeight - this.content.offsetHeight) * parseInt(this.marginTop) / (this.content.offsetHeight - this.bar.offsetHeight);
			this.content.scrollTop = a;
			//this.content.style.marginTop = a+'px';
			this.onscroll(a, b)
		},

		setBarHeight: function() {
			this.onscroll(0, 0);
			this.bar.style.height = "0";
			d(this.bar).hide();

			this.content.offsetHeight - this.content.scrollHeight >= 0 ? (this.bar.t = 0) : (this.bar.style.height = parseInt(this.content.offsetHeight /
					this.content.scrollHeight * this.content.offsetHeight) + "px",d(this.bar).show(),this.bar.t = parseInt(this.bar.style.marginTop));
			this.scroll(0);
		}
	}

	return ScrollBar;
})