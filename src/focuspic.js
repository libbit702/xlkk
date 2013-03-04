define(['eventutil', 'fx', 'node', 'dom'], function(e, f, n, d){
	function FocusPic(){
		this.page = 0;
		this.timeSet = false;
		this.bid = "";
		this.sid = "";
		this.sideid = "";
		this.totalcount = 0;
		this.fxNodes = [];
		this.interval = 5000
	}
	FocusPic.prototype = {		
	    init:function(interval,num,bid,sid,sideid){
			this.bid = bid,
			this.sid = sid,
			this.totalcount = num,
			this.interval = interval
			var _self = this;
			
			for(var i=0;i<num;i++){
				(function(i){
					e.addEventHandler(d(sid+i).getEle(),'mouseover', function(){
						_self.pause();
						_self.onone(i, 10);
					});

					e.addEventHandler(d(sid+i).getEle(),'mouseout',function(){
						_self.play();
						_self.onone(i, 10);
					});

					e.addEventHandler(d(bid+i).getEle(),'mouseover',function(){
						_self.pause()
					});

					e.addEventHandler(d(bid+i).getEle(),'mouseout',function(){
						_self.play()
					});
				})(i);
				this.fxNodes[i] = new FX.Node(this.bid+i);
			}

			this.play();
		},
		onone:function(num){
			if(num==this.page)return;
			d(this.sid+this.page).removeClass('on');
			d(this.sid+num).addClass('on');
			for(var i=0;i<this.fxNodes.length;i++){
				this.fxNodes[i].stop();
			}
			this.fxNodes[this.page].fadeOut({
				callback:(function(){this.style.display='none'}).call(this.fxNodes[this.page].el)
			});
			this.fxNodes[num].fadeIn({
				callback:(function(){this.style.display='block'}).call(this.fxNodes[num].el)
			});			
			this.page=num;
		},
		play:function(){
			clearInterval(this.timeSet);
			var _self = this;
			this.timeSet=setInterval(function(){
				_self.next();
			},this.interval);
		},
		pause:function(){
			clearTimeout(this.timeSet);
		},
		next:function(){
			this.onone(this.page>=(this.totalcount-1)?0:this.page+1);
		},
		prev:function(){
			this.onone(this.page<=0?this.totalcount-1:this.page-1);
		}
	}
	return FocusPic;
});
