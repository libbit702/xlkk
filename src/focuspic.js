define(['eventutil', 'fx', 'node'], function(e, f, n){
	function $(id){return document.getElementById(id);}

	var focusPic = {
		page:0,
		timeSet:false,
		bid:"",
		sid:"",
		sideid:"",
		totalcount:0,
	    init:function(num,bid,sid,sideid){
			this.bid = bid;
			this.sid = sid;
			this.totalcount=num;
			var _self = this;
			for(var i=0;i<num;i++){
				e.addEventHandler($(sid+"img_"+i),'mouseover', function(){
					_self.pause();
					_self.onone(parseInt(this.id.replace(_self.sid+'img_', ''), 10));
				});

				e.addEventHandler($(sid+"img_"+i),'mouseout',function(){
					_self.play();
					_self.onone(parseInt(this.id.replace(_self.sid+'img_', ''), 10));
				});

				e.addEventHandler($(bid+i),'mouseover',function(){
					_self.pause()
				});

				e.addEventHandler($(bid+i),'mouseout',function(){
					_self.play()
				});
			}
			//this.play();
		},
		onone:function(num){
			if(num==this.page)return;
			$(this.sid+this.page).className="";
			$(this.sid+num).className="on";			
			
			(new FX.Node(this.bid+this.page)).animate({
				duration: 1,
			    attributes: {
			        opacity: {to: 0}
			    }
			}).style.display='none';
			(new FX.Node(this.bid+num)).animate({
				duration: 1,
			    attributes: {
			        opacity: {to: 1},
			        display: {from:'none', to:''}
			    }
			});
			this.page=num;
		},
		play:function(){
			clearInterval(this.timeSet);
			var _self = this;
			this.timeSet=setInterval(function(){
				_self.onone(_self.page>=(_self.totalcount-1)?0:_self.page+1);
			},5000);
		},
		pause:function(){
			clearTimeout(this.timeSet);
		}
	}
	return focusPic;

});
