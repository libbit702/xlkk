define(['dom'], function(d){
	var switchTab = {
		config:{},
		tabs:[],
		lists:[]
	};

	switchTab.init = function(config) {
		for(conf in config){
			switchTab.config[conf] = config[conf];
		}
		for(var i=0;i<switchTab.config.count;i++) {
			switchTab.tabs[i] = d.$(switchTab.config.identifyTab+i);
			switchTab.lists[i] = d.$(switchTab.config.identifyList+i);				
		}		
	};

	switchTab.show = function(index){
		for(var i=0;i<switchTab.config.count;i++) {
			if (i != index) {
				d.removeClass(switchTab.tabs[index], switchTab.config.cnon);
				switchTab.lists[index].style.display="none" ;
			}
		}
		d.addClass(switchTab.tabs[index], switchTab.config.cnon);
		switchTab.lists[index].style.display="";
	};

	return switchTab;
})