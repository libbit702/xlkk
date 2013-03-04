var MovieRecom= 
define(['dom', 'eventutil'],function(d,e){
	var Turn = {
		config:{},
		node:''
	};

	Turn.init = function(config){
		for(conf in config){
			Turn.config[conf] = config[conf];
		}
		Turn.node = new FX.Node(config.div);
		e.addEventHandler(d(config.prev).getEle(), 'click', Turn.pre);
		e.addEventHandler(d(config.next).getEle(), 'click', Turn.next);
	};

	Turn.pre=function(){
		if(Turn.config.clickflag > 0){
			return;
		}

		if(Turn.config.current==0){
			return;
		}else{
			Turn.go(Turn.config.current-1);
		}
	};

	Turn.next=function(){		
		if(Turn.config.clickflag > 0){
			return;
		}

		if(Turn.config.current==Turn.config.allpage-1){
			return;
		}else{			
			Turn.go(Turn.config.current+1);
		}
	};

	Turn.go=function(index){
		if(Turn.config.current === index){
			return;
		}
		Turn.config.clickflag = 1;
		//FX的animate方法调整marginleft
		Turn.node.animate({
			attributes:{'marginLeft':{to:(-index) * Turn.config.step}},
			callback:function(){
				Turn.config.clickflag = 0;
			}
		});
		Turn.config.current=index;
		if(Turn.config.current==Turn.config.allpage-1){			
			d(Turn.config.next).addClass(Turn.config.offClsRight);
			d(Turn.config.prev).removeClass(Turn.config.offClsLeft);
		}else if(Turn.config.current==0){
			d(Turn.config.next).removeClass(Turn.config.offClsRight);
			d(Turn.config.prev).addClass(Turn.config.offClsLeft);			
		}else{
			d(Turn.config.next).removeClass(Turn.config.offClsRight);
			d(Turn.config.prev).removeClass(Turn.config.offClsLeft);			
		}
	};

	return Turn;
})