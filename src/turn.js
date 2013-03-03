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
		e.addEventHandler(d.$(config.prev), 'click', Turn.pre);
		e.addEventHandler(d.$(config.next), 'click', Turn.next);
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
			d.addClass(d.$(Turn.config.next), Turn.config.offCls);
			d.removeClass(d.$(Turn.config.prev), Turn.config.offCls);
		}else if(Turn.config.current==0){
			d.addClass(d.$(Turn.config.prev), Turn.config.offCls);
			d.removeClass(d.$(Turn.config.next), Turn.config.offCls);
		}else{
			d.removeClass(d.$(Turn.config.prev), Turn.config.offCls);
			d.removeClass(d.$(Turn.config.next), Turn.config.offCls);
		}
	};

	return Turn;
})