/**
 * 类首页右侧排行榜的Tab切换
 *
 * @module switchtab
 * @author lijunjun
 * @version 1.0
 * @example
s1 = new s;
s1.init({
    identifyTab:'Tab_rebo_',//标签ID的前缀
    identifyList:'List_rebo_',//内容ID的前缀
    count:5,
    cnon:'on'
});
 */
define(['dom','eventutil'], function(d,e){
	function SwitchTab(){
		this.config = {}; 
		this.tabs = [];
		this.lists = [];
	};

	SwitchTab.prototype = {
		/**
         * tab配置初始化
         *
         * @method module:switchtab#init
         * @param {Object} config
         */
		init : function(config) {
			for(conf in config){
				this.config[conf] = config[conf];
			}
			var _self = this;
			for(var i=0;i<this.config.count;i++) {
				this.tabs[i] = d(this.config.identifyTab+i);
				this.lists[i] = d(this.config.identifyList+i);	
				(function(i){
		            e.addEventHandler(_self.tabs[i].getEle(), 'mouseover', function(){_self.show(i)}); 
		        })(i)	
			}		
		},

		/**
         * tab切换初始化
         *
         * @method module:switchtab#show
         * @param {Num} index 显示指定的tab
         */
		show : function(index){
			for(var i=0;i<this.config.count;i++) {
				if (i != index) {
					this.tabs[i].removeClass(this.config.cnon);
					this.lists[i].hide() ;
				}
			}
			this.tabs[index].addClass(this.config.cnon);
			this.lists[index].show();
		}
	};

	return SwitchTab;
})