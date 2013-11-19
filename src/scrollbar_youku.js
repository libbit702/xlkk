/***
 * @description div模拟滚动条
 * @link http://www.cnblogs.com/darkli/archive/2012/02/15/2352744.html
 * @example  
	var scroll_tab_1 = new ScrollBar();
    scroll_tab_1.init({
         barContent: 'tabbox_list_1_scrollcontent',
         borderValue: 1,
         barId: 'tabbox_list_1_scrollbar',
         scrollContent: 'tabbox_list_1'
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
        
    function position(o){
        var p={Top:0,Left:0};
        while(!!o){
            p.Top+=o.offsetTop;
            p.Left+=o.offsetLeft;
            o=o.offsetParent;
        }
        return p;
    }

	function ScrollBar(){		
		this.defaults = {
			barContent: null,
			barId:'scrollBar',
			borderValue:0,
            scrollContent:''
		};
		this.options = {};
		this.bar = null;
		this.content = null;
        this.scrollObj = null;
		this.wheelThread = 20;
		this.isScrolling = !1;
	}

	ScrollBar.prototype = {
		init:function(options){
			this.options = utils.extend(this.defaults, options || {});//bar的配置
			this.content = d(this.options.barContent).getEle();//文档中的真实内容
            this.scrollObj = d(this.options.scrollContent).getEle();//实际可见的展示区域
			this.bar = d(this.options.barId).getEle();
            contentOffset = position(this.content.parentNode);
			
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
					if (true || self.isScrolling) {
						self.isScrolling = 0;
					}
				},
				onMouseWheel: function(e) {
					e = e || window.event;                    
					if (self.bar.style.display !== 'none') {
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
                onWheel: function(e) {
					e = e || window.event;                    
					if (self.bar.style.display !== 'none') {
						self.D = e.deltaY;
						e.returnValue = !1;
                        e.stopPropagation && e.stopPropagation();
						e.preventDefault && e.preventDefault();
						var dd = self.D > 0 ? self.wheelThread : 0 - self.wheelThread;
						self.bar.y = e.clientY;
						self.bar.t = parseInt(self.bar.style.marginTop);
						self.scroll(dd);
					} else {
						self.scrollToBottom(e);
					}
				},
				onBarClick: function(e) {
                    e = e || window.event;               
                    var doctop = document.documentElement.scrollTop || document.body.scrollTop, mousePos = e.clientY, barPos = Math.abs(Math.abs(parseInt(self.bar.style.marginTop)) +parseInt(self.bar.style.height)/2+ contentOffset.Top - doctop ); 
                    console.log( Math.abs(parseInt(self.bar.style.marginTop)) +'_'+parseInt(self.bar.style.height)/2+'_'+contentOffset.Top +'_'+ doctop );
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                    console.log(mousePos + '_' + barPos);
                    self.scroll(mousePos - barPos);
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
				},
                onClick: function(e) {
					e.stopPropagation && e.stopPropagation()
				},
				onDomMouseScroll: function(e) {
					if (self.bar.style.display !== 'none') {
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
			et.addEventHandler(doc, 'mouseup', events.onMouseUp);
			et.addEventHandler(this.content, 'mousewheel', events.onMouseWheel);
            et.addEventHandler(this.content, 'wheel', events.onWheel);
			et.addEventHandler(this.content, 'dommousescroll', events.onDomMouseScroll);
            //点击滚动条空白处时
            //et.addEventHandler(this.bar.parentNode, 'click', events.onBarClick);
		},

		onscroll : doc.onscroll || function(){},

		scrollToBottom : doc.scrollToBottom || function(){},

		scroll: function(b) {
			this.marginTop = (this.bar.t || 0) + b;
			if (this.marginTop < 0){
				this.marginTop = 0;
            }
			if (this.marginTop > this.scrollObj.clientHeight - this.bar.offsetHeight){
				this.marginTop = this.scrollObj.clientHeight - this.bar.offsetHeight;
                this.scrollToBottom();
            }
			this.bar.style.marginTop = this.marginTop + "px";
			if (b == 0){
				this.onscroll(b, b);
			}
			//var a = (this.content.scrollHeight - this.content.offsetHeight) * parseInt(this.marginTop) / (this.content.offsetHeight - this.bar.offsetHeight);
			var a = (this.content.scrollHeight - this.scrollObj.offsetHeight ) * parseInt(this.marginTop) / (this.scrollObj.offsetHeight - this.bar.offsetHeight);
            a = parseInt(a);
			//this.content.scrollTop = a;
            
			this.content.style.marginTop = (0-a)+'px';
			this.onscroll(a, b)
		},

		setBarHeight: function() {
			this.onscroll(0, 0);
			this.bar.style.height = "0";
			d(this.bar).hide();
			this.scrollObj.offsetHeight - this.content.scrollHeight >= 0 ? (this.bar.t = 0) : (this.bar.style.height = parseInt(this.scrollObj.offsetHeight / this.content.scrollHeight * this.scrollObj.offsetHeight) + "px",d(this.bar).show(),this.bar.t = parseInt(this.bar.style.marginTop));
			this.scroll(0);
		}
	}

	return ScrollBar;
})