/**
 * 针对单部影片的独立订阅功能，需要迅雷插件支持
 *
 * @module dy
 * @require ioctrl 核心模块，PeerID支持
 * @require dom 可选，用来控制订阅相关功能按钮显示隐藏
 * @require minisite 核心模块 提供jsonp功能
 */
 define(['ioctrl','dom','minisite'], function(ic, d, m){    
	if(!!window.G_SUBS_STATUS === false){
        window.G_SUBS_STATUS = [];
    }
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
         * @method randUrl
         * @return {String} 随机参数键值对
         */
		randUrl: function(){
			return '&r='+new Date().getTime();
		},

		/**
         * 页面载入时检测订阅情况，并控制相应功能按钮显示状态
         *
         * @method checkShowDY
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
         * @method checkShowDY
         */
		showDY: function(){
			if(G_SUBS_STATUS[DYData.statKey]!=null && G_SUBS_STATUS[DYData.statKey]==0){                
				//d('dySubmit').show();
			}else{
                DYData.callback();                
				//d('dyCancle').show();
			}
		},
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
		doCancleDY: function(){
			d('dyTips').hide();
			d('dyCancle').hide();
			this.showDYStat(0);
			m.loadJSData(this.cancleDYUrl+'peerid='+this.peerID+'&movieid='+this.movieID+this.randUrl(), 'utf-8', this.cancledDY);
		},
		doSubmitDY: function(){
			this.showDYStat(0);
			m.loadJSData(this.submitDYUrl+'peerid='+this.peerID+'&movieid='+this.movieID+this.randUrl(), 'utf-8', this.submitedDY);
		},
		cancledDY: function(){
			if(G_SUBS_STATUS[DYData.statKey]!=null && G_SUBS_STATUS[DYData.statKey]==-1){
				d('dyStat').hide();
				d('dySubmit').show();
			}else{
				DYData.showDYStat(1);
			}
			G_SUBS_STATUS[DYData.statKey]=null;
		},
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