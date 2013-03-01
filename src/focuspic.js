define(['eventutil', 'fx', 'node'], function(e, f, n){
	function $(id){return document.getElementById(id);}
	var focusPic = {
		page:0,
		timeSet:false,
		bid:"",
		sid:"",
		sideid:"",
		totalcount:0,
		fxNodes:[],
		interval:5000,
	    init:function(interval,num,bid,sid,sideid){
			this.bid = bid;
			this.sid = sid;
			this.totalcount = num;
			this.interval = interval;
			var _self = this;
			for(var i=0;i<num;i++){
				e.addEventHandler($(sid+i),'mouseover', function(){
					_self.pause();
					_self.onone(parseInt(this.id.replace(_self.sid, ''), 10));
				});

				e.addEventHandler($(sid+i),'mouseout',function(){
					_self.play();
					_self.onone(parseInt(this.id.replace(_self.sid, ''), 10));
				});

				e.addEventHandler($(bid+i),'mouseover',function(){
					_self.pause()
				});

				e.addEventHandler($(bid+i),'mouseout',function(){
					_self.play()
				});

				this.fxNodes[i] = new FX.Node(this.bid+i);
			}

			this.play();
		},
		onone:function(num){
			if(num==this.page)return;
			$(this.sid+this.page).className="";
			$(this.sid+num).className="on";
			for(var i=0;i<this.fxNodes.length;i++){
				this.fxNodes[i].stop();
			}
			this.fxNodes[this.page].fadeOut({callback:(function(){this.style.display='none'}).call(this.fxNodes[this.page].el)});
			this.fxNodes[num].fadeIn({callback:(function(){this.style.display='block'}).call(this.fxNodes[num].el)});			
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
	return focusPic;
});
