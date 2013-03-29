
 define(['ioctrl','dom','minisite'], function(ic, d, m){    
	if(!!window.G_SUBS_STATUS === false){
        window.G_SUBS_STATUS = [];
    }
    /**
	 * 针对单部影片的独立订阅功能，需要迅雷插件支持
	 *
	 * @module dy
	 * @requires ioctrl 核心模块，PeerID支持
	 * @requires dom 可选，用来控制订阅相关功能按钮显示隐藏
	 * @requires minisite 核心模块 提供jsonp功能
     * @example 
     dy.init();
     onclick="doSubmitDY();"
	 */
	var DYData = {
		/*-------------------- 订阅数据来源接口 -------------------------*/
		getDYNumUrl: 'http://api.subscribe.kankan.com/subscribe.php?action=list&',
		submitDYUrl: 'http://api.subscribe.kankan.com/subscribe.php?action=sub&',
		cancleDYUrl: 'http://api.subscribe.kankan.com/subscribe.php?action=unsub&',
		queryDYUrl : 'http://api.subscribe.kankan.com/subscribe.php?action=status&',
		/*-------------------- 基本数据结构 -------------------------*/
        peerID: ic.getPeerID(),
		statKey: '',
		isNoDY:ic.ioReader('nosubscribe')=='1',

		/**
         * 向服务器发请求取数据的随机参数，防止结果缓存
         *
         * @method module:dy.randUrl
         * @return {String} 随机参数键值对
         */
		randUrl: function(){
			return '&r='+new Date().getTime();
		},

		/**
         * 页面载入时检测订阅情况，并控制相应功能按钮显示状态
         *
         * @method module:dy.checkShowDY
         */
		checkShowDY: function(){
			if(this.peerID==null) {return}
			if(this.isNoDY){
				d('dySubmit').show();
			}else{
				m.loadJSData(this.queryDYUrl+'peerid='+this.peerID+'&movieid='+this.movieID+this.randUrl(), 'utf-8', this.showDY);
			}
		},

		/**
         * 拿到用户对当前影片的订阅数据后显示或隐藏相应功能按钮
         *
         * @method module:dy.showDY
         */
		showDY: function(){
			if(G_SUBS_STATUS[DYData.statKey]!=null && G_SUBS_STATUS[DYData.statKey]==0){                
				//d('dySubmit').show();
			}else{
                DYData.callback();                
				//d('dyCancle').show();
			}
		},

		/**
         * 点击订阅或者退订时即时显示的交互信息
         *
         * @method module:dy.showDYStat
         * @param {Num} statType 显示信息的种类
         */
		showDYStat: function(statType){
			var str='';
			switch(statType) {
				case 0: str='<span>正在处理中...</span>';break;
				case 1: str='<span>(退订失败)</span>';break;
				case 2: str='<span>(订阅失败)</span>';break;
				default:;
			}
			d('dyStat').setHtml(str);
			d('dyStat').show();
		},

		/**
         * 退订动作
         *
         * @method module:dy.doCancleDY
         */
		doCancleDY: function(){
			d('dyTips').hide();
			d('dyCancle').hide();
			this.showDYStat(0);
			m.loadJSData(this.cancleDYUrl+'peerid='+this.peerID+'&movieid='+this.movieID+this.randUrl(), 'utf-8', this.cancledDY);
		},

		/**
         * 订阅动作
         *
         * @method module:dy.doCancleDY
         */
		doSubmitDY: function(){
			this.showDYStat(0);
			m.loadJSData(this.submitDYUrl+'peerid='+this.peerID+'&movieid='+this.movieID+this.randUrl(), 'utf-8', this.submitedDY);
		},

		/**
         *  退订后的回调
         *
         * @method module:dy.cancledDY
         */
		cancledDY: function(){
			if(G_SUBS_STATUS[DYData.statKey]!=null && G_SUBS_STATUS[DYData.statKey]==-1){
				d('dyStat').hide();
				d('dySubmit').show();
			}else{
				DYData.showDYStat(1);
			}
			G_SUBS_STATUS[DYData.statKey]=null;
		},

		/**
         *  订阅后的回调
         *
         * @method module:dy.submitedDY
         */
		submitedDY: function(){
			if(ic.getDapctrlVer()>200000){ic.ioWriter('nosubscribe','0')}
			if(G_SUBS_STATUS[DYData.statKey]!=null && G_SUBS_STATUS[DYData.statKey]==1){
				d('dyStat').hide();
				d('dyCancle').show();
			}else{
				DYData.showDYStat(2);
			}
			G_SUBS_STATUS[DYData.statKey]=null;
		},

		/**
         * 调用订阅功能页面的初始化
         *
         * @method module:dy.init
         */
		init: function(config){
            for(conf in config){
                DYData[conf] = config[conf];
            }
            this.statKey = 's'+this.movieID;
			G_SUBS_STATUS[this.statKey]=null;
			this.checkShowDY();
		}
	};
	return DYData;
})