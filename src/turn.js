/**
 * 类付费首页新片首播轮播图效果
 *
 * @module turn
 * @author lijunjun
 * @version 1.0
 * @example 
 	var t = new Turn();
    t.init({ 
    	current:0,//当前位置
    	allpage:3, //轮播图总数
    	step:484,//像素位移数
    	prev:'bt_movierecom_pre',//点击左箭头ID
    	next:'bt_movierecom_next',//点击右箭头ID
    	div:'div_movierecom',//轮播图父节点ID
    	clickflag:0, //轮播是否正在移动中，默认为0
    	offClsLeft:'off', //左箭头不可点击时添加class
    	offClsRight:'off',//右箭头不可点击时添加class
    	auto:true,//是否自动轮播
    	divSibling:'div_movierecom_1',//和自动轮播有关，复制轮播图节点内容的兄弟节点ID
    	time:3000,//自动轮播间隔
        speed:0.3//移动动画经历的时间
    });
 */
define(['dom', 'eventutil','node'],function(d,e,FX){
	function Turn(){
		this.config = {},
		this.node = {},
		this.interval = 0
	}

	Turn.prototype = {
		/**
         * 初始化轮播图配置
         *
         * @method module:turn#init
         * @param {Object} config
         */
		init: function(config){
			for(conf in config){
				this.config[conf] = config[conf];
			}
			this.node = new FX.Node(config.div);
			if(this.config.auto === true){
				d(this.config.divSibling).setHtml(d(this.config.div).getHtml());
			}

			var _self = this;

			e.addEventHandler(d(config.prev).getEle(), 'click', function(){
				_self.pre();
			});
			e.addEventHandler(d(config.next).getEle(), 'click',  function(){
				_self.next();
			});
			if(this.config.auto === true){
				e.addEventHandler(d(config.prev).getEle(), 'mouseover', function(){
					_self.stop();
				});
				e.addEventHandler(d(config.next).getEle(), 'mouseover', function(){
					_self.stop();
				});
				e.addEventHandler(d(config.prev).getEle(), 'mouseout', function(){
					_self.auto();
				});
				e.addEventHandler(d(config.next).getEle(), 'mouseout', function(){
					_self.auto();
				});
				this.auto();
			}
		},

		/**
         * 轮播图向前滚动
         *
         * @method module:turn#pre
         */
		pre: function(){
			if(this.config.clickflag > 0){
				return;
			}

			if(!this.config.auto && this.config.current==0){
				return;
			}else{
				this.go(this.config.current-1);
			}
		},

		/**
         * 轮播图向后滚动
         *
         * @method module:turn#next
         */
		next: function(){		
			if(this.config.clickflag > 0){
				return;
			}

			if(!this.config.auto && this.config.current==this.config.allpage-1){
				return;
			}else{			
				this.go(this.config.current+1);
			}
		},

		/**
         * 轮播图自动向后滚动
         *
         * @method module:turn#auto
         */
		auto: function(){
			var _self = this;
			this.interval = setInterval(function(){_self.pre();}, this.config.time);
		},

		/**
         * 轮播图停止移动
         *
         * @method module:turn#stop
         */
		stop: function(){
			clearInterval(this.interval);
		},

		/**
         * 轮播图移动到指定的图片位置
         *
         * @method module:turn#go
         * @param {Num} index
         */
		go: function(index){
			if(this.config.current === index){
				return;
			}
			this.config.clickflag = 1;
			var go = 0;
			if(index>=this.config.allpage){
				go = -(this.config.allpage * this.config.step);
			}else if(index<0){
				d(this.config.div).setStyle('margin-left', -(this.config.allpage * this.config.step)+'px');
				go = -((this.config.allpage-1) * this.config.step);
			}else{
				go = -(index * this.config.step);
			}
			//FX的animate方法调整marginleft
			var _self = this;
			this.node.animate({
	            duration:this.config.speed,
				attributes:{'marginLeft':{to:go}},
				callback:function(){
					_self.config.clickflag = 0;
					if(index>=_self.config.allpage){
						_self.config.current = 0;
						setTimeout(function(){
							d(_self.config.div).setStyle('margin-left', '0px');	
						});
					}else if(index<0){
						_self.config.current = _self.config.allpage-1;

					}else{
						_self.config.current = index;
					}
				}
			});
			if(!this.config.auto){
				if(index>=this.config.allpage-1){			
					d(this.config.next).addClass(this.config.offClsRight);
					d(this.config.prev).removeClass(this.config.offClsLeft);
				}else if(index<=0){
					d(this.config.next).removeClass(this.config.offClsRight);
					d(this.config.prev).addClass(this.config.offClsLeft);			
				}else{
					d(this.config.next).removeClass(this.config.offClsRight);
					d(this.config.prev).removeClass(this.config.offClsLeft);			
				}
			}
			
		}
	}

	return Turn;
})