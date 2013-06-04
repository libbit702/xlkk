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
    cnon:'on',
    auto:true|false,//boolean,是否轮播
    interval:5000,//轮播时间间隔
});
 */
define(['dom','eventutil'], function(d,e){
	function SwitchTab(){
		this.config = {}; 
		this.tabs = [];
		this.lists = [];
		this.timer = 0;
		this.idx = 0;
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
		            if(_self.config.auto === true){
		            	e.addEventHandler(_self.tabs[i].getEle(), 'mouseover', function(){_self.pause();}); 
		            	e.addEventHandler(_self.lists[i].getEle(), 'mouseover', function(){_self.pause();});
			            e.addEventHandler(_self.tabs[i].getEle(), 'mouseout', function(){_self.auto();}); 
			            e.addEventHandler(_self.lists[i].getEle(), 'mouseout', function(){_self.auto();}); 
		        	}
		        })(i)	
			}	
			if(this.config.auto === true) {
				this.auto();
			}
		},

		/**
         * 自动轮播
         *
         * @method module:switchtab#auto
         */
		auto:function(){
			var _self = this;
			this.timer = setInterval(function(){
				_self.next();
			}, this.config.interval);
		},

		/**
         * 展示下一个tab及list
         *
         * @method module:switchtab#next
         */
		next:function(){
			this.idx = this.idx + 1;
			if(this.idx >= this.config.count){
				this.idx = 0;
			}
			this.show(this.idx);
		},

		/**
         * 暂停轮播
         *
         * @method module:switchtab#pause
         */
		pause:function(){
			clearInterval(this.timer);
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
            
            if(this.config.callback){
                for(key in this.config.callback){
                    if(index == key || 'all' == key){
                        (this.config.callback[key])(index);
                    }
                }
            }
            
            this.idx = index;
		}
	};

	return SwitchTab;
})