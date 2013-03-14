define(['ioctrl','dom','minisite'], function(ioCtrl, d, m){
	var G_SUBS_MOVIES_ID_STR = '';
	var G_SUBS_STATUS = [];
	var DYData = {
		getDYNumUrl: 'http://api.subscribe.kankan.com/subscribe.php?action=list&',
		submitDYUrl: 'http://api.subscribe.kankan.com/subscribe.php?action=sub&',
		cancleDYUrl: 'http://api.subscribe.kankan.com/subscribe.php?action=unsub&',
		queryDYUrl : 'http://api.subscribe.kankan.com/subscribe.php?action=status&',
		statDYUrl  : 'http://kkpgv2.xunlei.com?u=dingyue&u1=',
		movieID: G_MOVIEID,
		movDesc: G_OTHER_DESC,
		movType: G_MOVIE_TYPE,
		movTitle: G_MOVIE_TITLE,
		subtype: G_MOVIE_DATA.subtype,
		peerID: ioCtrl.getPeerID(),
		statKey: '',
		isNoDY:ioCtrl.ioReader('nosubscribe')=='1',
		onlineDate:G_MOVIE_INFO.onlinedate,
		randUrl: function(){
			return '&r='+new Date().getTime();
		},
		checkShowDY: function(){
			if(this.peerID==null) {return}
			var str = '更新通知我';
			this.initPage(str);
			
			if(this.isNoDY){
				d('dySubmit').show();
			}else{
				m.loadJSData(this.queryDYUrl+'peerid='+this.peerID+'&movieid='+this.movieID+this.randUrl(), 'utf-8', this.showDY);
			}
		},
		showDY: function(){
			if(G_SUBS_STATUS[DYData.statKey]!=null && G_SUBS_STATUS[DYData.statKey]==0){
				d('dySubmit').show();
			}else{
				d('dyCancle').show();
			}
		},
		showDYStat: function(statType){
			var str='';
			switch(statType) {
				case 0: str='<span>正在处理中...</span>';break;
				case 1: str='<span>(退订失败)</span><a href="javascript:void(0)" onclick="DYData.doCancleDY();return false;">重试</a>';break;
				case 2: str='<span>(订阅失败)</span><a href="javascript:void(0)" onclick="DYData.doSubmitDY();return false;">重试</a>';break;
				default:;
			}
			d('dyStat').html(str);
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
			if(G_DAPCTRL_VER>200000){ioCtrl.ioWriter('nosubscribe','0')}
			if(G_SUBS_STATUS[DYData.statKey]!=null && G_SUBS_STATUS[DYData.statKey]==1){
				d('dyStat').hide();
				d('dyCancle').show();
			}else{
				DYData.showDYStat(2);
			}
			G_SUBS_STATUS[DYData.statKey]=null;
		},
		init: function(){
			this.statKey = 's'+this.movieID;
			G_SUBS_STATUS[this.statKey]=null;
			this.checkShowDY();
		}
	};
	return DYData;
})