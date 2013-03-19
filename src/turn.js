define(['dom', 'eventutil','node'],function(d,e,FX){
	function Turn(){
		this.config = {},
		this.node = {},
		this.interval = 0
	}

	Turn.prototype = {
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

		auto: function(){
			var _self = this;
			this.interval = setInterval(function(){_self.pre();}, this.config.time);
		},

		stop: function(){
			clearInterval(this.interval);
		},

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