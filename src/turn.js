define(['dom', 'eventutil','node'],function(d,e,FX){
	var Turn = {
		config:{},
		node:'',
		interval:0
	};

	Turn.init = function(config){
		for(conf in config){
			Turn.config[conf] = config[conf];
		}
		Turn.node = new FX.Node(config.div);
		if(Turn.config.auto === true){
			d(Turn.config.divSibling).setHtml(d(Turn.config.div).getHtml());
		}

		e.addEventHandler(d(config.prev).getEle(), 'click', Turn.pre);
		e.addEventHandler(d(config.next).getEle(), 'click', Turn.next);
		if(Turn.config.auto === true){
			e.addEventHandler(d(config.prev).getEle(), 'mouseover', Turn.stop);
			e.addEventHandler(d(config.next).getEle(), 'mouseover', Turn.stop);
			e.addEventHandler(d(config.prev).getEle(), 'mouseout', Turn.auto);
			e.addEventHandler(d(config.next).getEle(), 'mouseout', Turn.auto);
			Turn.auto();
		}
	};

	Turn.pre=function(){
		if(Turn.config.clickflag > 0){
			return;
		}

		if(!Turn.config.auto && Turn.config.current==0){
			return;
		}else{
			Turn.go(Turn.config.current-1);
		}
	};

	Turn.next=function(){		
		if(Turn.config.clickflag > 0){
			return;
		}

		if(!Turn.config.auto && Turn.config.current==Turn.config.allpage-1){
			return;
		}else{			
			Turn.go(Turn.config.current+1);
		}
	};

	Turn.auto = function(){
		Turn.interval = setInterval(Turn.pre, Turn.config.time);
	};

	Turn.stop = function(){
		clearInterval(Turn.interval);
	};

	Turn.go=function(index){
		if(Turn.config.current === index){
			return;
		}
		Turn.config.clickflag = 1;
		var go = 0;
		if(index>=Turn.config.allpage){
			go = -(Turn.config.allpage * Turn.config.step);
		}else if(index<0){
			d(Turn.config.div).setStyle('margin-left', -(Turn.config.allpage * Turn.config.step)+'px');
			go = -((Turn.config.allpage-1) * Turn.config.step);
		}else{
			go = -(index * Turn.config.step);
		}
		//FX的animate方法调整marginleft
		Turn.node.animate({
			attributes:{'marginLeft':{to:go}},
			callback:function(){
				Turn.config.clickflag = 0;
				if(index>=Turn.config.allpage){
					Turn.config.current = 0;
					setTimeout(function(){
						d(Turn.config.div).setStyle('margin-left', '0px');	
					});
				}else if(index<0){
					Turn.config.current = Turn.config.allpage-1;

				}else{
					Turn.config.current = index;
				}
			}
		});
		if(!Turn.config.auto){
			if(index>=Turn.config.allpage-1){			
				d(Turn.config.next).addClass(Turn.config.offClsRight);
				d(Turn.config.prev).removeClass(Turn.config.offClsLeft);
			}else if(index<=0){
				d(Turn.config.next).removeClass(Turn.config.offClsRight);
				d(Turn.config.prev).addClass(Turn.config.offClsLeft);			
			}else{
				d(Turn.config.next).removeClass(Turn.config.offClsRight);
				d(Turn.config.prev).removeClass(Turn.config.offClsLeft);			
			}
		}
		
	};

	return Turn;
})