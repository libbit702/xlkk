define(['dom','eventutil'], function(d,e){
	function SwitchTab(){
		this.config = {}; 
		this.tabs = [];
		this.lists = [];
	};

	SwitchTab.prototype = {
		init : function(config) {
			for(conf in config){
				this.config[conf] = config[conf];
			}
			var _self = this;
			for(var i=0;i<this.config.count;i++) {
				this.tabs[i] = d.$(this.config.identifyTab+i);
				this.lists[i] = d.$(this.config.identifyList+i);	
				(function(i){
		            e.addEventHandler(_self.tabs[i], 'mouseover', function(){_self.show(i)}); 
		        })(i)	
			}		
		},

		show : function(index){
			for(var i=0;i<this.config.count;i++) {
				if (i != index) {
					d.removeClass(this.tabs[i], this.config.cnon);
					this.lists[i].style.display="none" ;
				}
			}
			d.addClass(this.tabs[index], this.config.cnon);
			this.lists[index].style.display="";
		}
	};

	return SwitchTab;
})