

var G_DAPCTRL = null;
var G_DAPCTRL_VER = 0;
var G_CORE_CONTROL = null;
var kkCore = {};
function $(s){
	return document.getElementById(s);
}
var isIE=(navigator.appName).indexOf("Microsoft")!=-1;if(window.Event&&!isIE){function SearchEvent(){var func=SearchEvent.caller;while(func!=null){var arg=func.arguments[0];if(arg){if(String(arg.constructor).indexOf('Event')>-1){return arg}}func=func.caller}return null};if (navigator.userAgent.indexOf('afari') == -1 && navigator.userAgent.indexOf('Opera') == -1) {window.constructor.prototype.__defineGetter__("event",function(){return SearchEvent()});}; Event.prototype.__defineSetter__("returnValue",function(bool){if(!bool){this.preventDefault()}return bool});Event.prototype.__defineSetter__("cancelBubble",function(bool){if(bool){this.stopPropagation()}return bool});Event.prototype.__defineGetter__("clientX",function(){return this.pageX});Event.prototype.__defineGetter__("clientY",function(){return this.pageY});Event.prototype.__defineGetter__("keyCode",function(){return this.which});Event.prototype.__defineGetter__("button",function(){return this.which});Event.prototype.__defineGetter__("srcElement",function(){var n=this.target;while(n.nodeType!=1){n=n.parentNode}return n});Event.prototype.__defineGetter__("offsetX",function(){return this.layerX});Event.prototype.__defineGetter__("offsetY",function(){return this.layerY});Event.prototype.attachEvent=function(type,handler){this.addEventListener(type.substring(2),handler,true)};Event.prototype.detachEvent=function(type,handler){this.removeEventListener(type.substring(2),handler,true)};window.constructor.prototype.attachEvent=function(type,handler){this.addEventListener(type.substring(2),handler,true)};window.constructor.prototype.detachEvent=function(type,handler){this.removeEventListener(type.substring(2),handler,true)};document.constructor.prototype.attachEvent=function(type,handler){this.addEventListener(type.substring(2),handler,true)};document.constructor.prototype.detachEvent=function(type,handler){this.removeEventListener(type.substring(2),handler,true)};Element.prototype.attachEvent=function(type,handler){this.addEventListener(type.substring(2),handler,true)};Element.prototype.detachEvent=function(type,handler){this.removeEventListener(type.substring(2),handler,true)};HTMLElement.prototype.attachEvent=function(type,handler){this.addEventListener(type.substring(2),handler,true)};HTMLElement.prototype.detachEvent=function(type,handler){this.removeEventListener(type.substring(2),handler,true)}}
function cacheBackground(){
	try{
		var userAgent = navigator.userAgent.toLowerCase();
		var env = null;
		var ver = 0;
		env = userAgent.match(/msie ([\d.]+)/);
		ver = env ? parseInt(env[1], 10) : 0;
		if(ver == 6){
			document.execCommand("BackgroundImageCache", false, true);
		}
	}catch(e){}
}cacheBackground();

var ioCtrl = {
	ioWriter:function(name,value,hours){
		if(G_DAPCTRL_VER>200000){
			this.ioCtrlWriter(name,value,hours||null);
		}else{
			if(hours){
				setCookie(name,value,hours);
			}else{
				setCookie(name,value);
			}
		}
	},
	ioReader:function(name){
		if(G_DAPCTRL_VER>200000){
			return this.ioCtrlReader(name) || "";
		}else{
			return getCookie(name);
		}
	},
	ioCtrlWriter:function(key, value, expires){
		var player = G_DAPCTRL;
		var iExpire = expires || 720;
		player.Put("sCookieFileName", key+".dat");
		player.Put("sCookie", value+"～"+((new Date().getTime()) + iExpire * 3600000));
		player = null;
	},
	ioCtrlReader:function(key){
		var player = G_DAPCTRL;
		var sCookie = null;
		var value = null;
		player.Put("sCookieFileName", key+".dat");
		sCookie = player.Get("sCookie")||null;
		if(null != sCookie){
			value = ioCtrlCheck(sCookie);
		}
		player = null;
		return value;
		function ioCtrlCheck(sCookie){
			var items = sCookie.split("～");
			var curDate = expires = 0;
			var value = null;
			if(items.length != 2){return null;}
			value = ""==items[0]?null:items[0];
			expires = parseInt(items[1], 10);
			curDate = new Date().getTime();
			if(curDate > expires){
				return null;
			}else{
				return value;
			}
		}
	}
};
var KankanCoreObj = KankanEventObj.extend({
	init: function(){
		this._super();
		this.pageTitle = '';
		var id=this.getParameter("id");
		var u=this.getParameter("u");
		if(id){this.setCookie("qs_id", id);}
		if(u){this.setCookie("qs_u",u);}
		var uAgent = navigator.userAgent.toLowerCase();
		this.sourceId = id||this.getCookie("qs_id")||3;
		this.isx64 = /x64/.test(uAgent);
		this.ismac = /mac/.test(uAgent) || /opera/.test(uAgent);
		try{
			this.mdata = G_MOVIE_INFO;
		}catch(e){};
		//this.isx64 = true;+
		if(document.domain=='kankan.com'){
			this.subDomain = 'vod.kankan.com';
		}else{
			this.subDomain = 'kankan.xunlei.com';
			if(window.location.href.indexOf('kankan1.xunlei.com')>0){
				this.subDomain = 'kankan1.xunlei.com';
			}
		}

		this.date = new Date().getFullYear()+this.formatDate(new Date().getTime());
	},
	setTitle: function(str) {
		this.pageTitle = str;
		document.title=str;
	},
	string2Array: function(str,splitChar) {
		return str.split(splitChar);
	},
	array2String: function(arr,joinChar) {
		return arr.join(joinChar);
	},
	getGCID: function(url) {
		var gcid = url.split("/").length>4?(url.split("/")[4]).toUpperCase():'';
		return gcid;
	},
	getCID: function(url){
		var cid = url.split("/").length>5?(url.split("/")[5]).toUpperCase():'';
		return cid;
	},
	getVcutSubname: function(index){
		var p3=/(第)[0-9]+(集|话)/;
		var subname = G_MOVIE_DATA.subnames[index];
		if(G_SUBMOVIE_DATA[index].vCut==1){
			if(G_MOVIE_TYPE=='movie'||G_MOVIE_TYPE=='vmovie'){
				if(p3.test(subname)){
					return '全集';
				}
			}
			subname = subname.replace(/\[[^0-9]\]/gi, "");
			return subname;
			//if()
		}else{
			return subname;
		}
	},
	getPeerID: function(bit){
		var peerId = null;
		try{
			if(32 == bit){
				peerId = G_DAPCTRL.Get("sPeerID32")||null;
			}else{
				peerId = G_DAPCTRL.Get("sPeerID")||null;
			}
		}catch(e){}
		return peerId;
	},
	compareVersions: function(v1, v2){
		for (i = 0; i < v1.length; ++i){
			var n1 = new Number(v1[i]);
			var n2 = new Number(v2[i]);
			if (n1 < n2)
				return -1;
			if (n1 > n2)
				return 1;
		}
		return 0;
	},
	getBitrate: function(url){
		try{
			var bit = parseInt(url.split("/")[9], 16);
			return bit;
		}catch(e){
			return "0";
		}
	},
	loadJSData: function(url, handler, args, isDestory ,charset){
		var head = document.getElementsByTagName("head")[0];
		var script = this.$C("script");
		var id = "dynamic_script_"+(new Date().getTime())+"_"+Math.random();
		var eventType = (undefined !== script.onreadystatechange && undefined !== script.readyState) ? "onreadystatechange" : "onload";
		script.language="javascript";
		script.type="text/javascript";
		if(typeof charset != 'undefined'){
			script.charset = charset;
		}
		script.src = url;
		script.id = id;
		if(!isIE){
			try{
				script.addEventListener('error', function(){
					if(typeof(handler) == "string"){
						setTimeout(function(){var hdl = eval(handler);hdl.apply(null, args);}, 50);
					}else if(typeof(handler) == "function"){
						setTimeout(function(){handler.apply(null, args);}, 50);
					}
				}); 
			}catch(e){};
		}
		script.attachEvent(eventType, function(){
			var state = script.readyState || "loaded";
			if("loaded" == state || "complete" == state){
				if(typeof(handler) == "string"){
					setTimeout(function(){var hdl = eval(handler);hdl.apply(null, args);}, 50);
				}else if(typeof(handler) == "function"){
					setTimeout(function(){handler.apply(null, args);}, 50);
				}
				if(isDestory){
					$R(script, head);
				}
				head = null;
				script = null;
			}
		});
		this.$P(script, head);
	},
	loadJSDataByTimeslice:function(url, handler, args, isDestory, interval,charset){
		var head = document.getElementsByTagName("head")[0];
		var script = $C("script");
		var intvId = null;
		var isLoaded = false;
		var id = "dynamic_script_"+(new Date().getTime())+"_"+Math.random();
		var eventType = (undefined !== script.onreadystatechange && undefined !== script.readyState) ? "onreadystatechange" : "onload";
		script.language="javascript";
		script.type="text/javascript";
		if(typeof charset != 'undefined'){
			script.charset = charset;
		}
		script.src = url;
		script.id = id;
		script.attachEvent(eventType, function(){
			var state = script.readyState || "loaded";
			if("loaded" == state || "complete" == state){
				if(null!=intvId){
					clearTimeout(intvId);
					intvId = null;
				}
				
				if(!isLoaded){
					isLoaded = true;
					args.unshift(false);
					if(typeof(handler) == "string"){
						setTimeout(function(){try{var hdl = eval(handler);hdl.apply(null, args);}catch(e){}}, 50);
					}else if(typeof(handler) == "function"){
						setTimeout(function(){handler.apply(null, args);}, 50);
					}
				}
				if(isDestory){
					$R(script, head);
				}
				head = null;
				script = null;
			}
		});
		$P(script, head);
		intvId = setTimeout(function(){
			clearTimeout(intvId);
			intvId = null;
			if(!isLoaded){
				isLoaded = true;
				args.unshift(true);
				if(typeof(handler) == "string"){
					setTimeout(function(){try{var hdl = eval(handler);hdl.apply(null, args);}catch(e){}}, 50);
				}else if(typeof(handler) == "function"){
					setTimeout(function(){try{handler.apply(null, args);}catch(e){}}, 50);
				}
			}
		}, interval);
	},
	loadJSONDataByTimeslice:function(url, handler, args, responseObj, isDestory, _parent, interval){
		var ifr = $C("iframe");
		var id = "dynamic_iframe_"+(new Date().getTime())+"_"+Math.random();
		var isLoaded = false;
		var intvId = null;
		ifr.style.cssText="display:none";
		ifr.width = 1;
		ifr.height = 1;
		ifr.src = url;
		ifr.id=id;
		ifr.name=id;
		ifr.attachEvent("onload", function(){
			if(null!=intvId){
				clearTimeout(intvId);
				intvId = null;
			}
			if(!isLoaded){
				isLoaded = true;
				try{
					if(typeof(responseObj) == "object"){
						for(var i=0;i<responseObj.length;i++){
							var json = eval("ifr.contentWindow."+responseObj[i]);
							args.unshift(json);
						}
					}else{
						var json = eval("ifr.contentWindow."+responseObj);
						args.unshift(json);
					}
				}catch(e){
					args.unshift(null);
				}finally{
					if(typeof(handler) == "string"){
						setTimeout(function(){var hdl = eval(handler);hdl.apply(null, args);}, 50);
					}else if(typeof(handler) == "function"){
						setTimeout(function(){handler.apply(null, args);}, 50);
					}
					if(isDestory){
						$R(ifr, _parent||null);
					}
					ifr = null;
				}
			}else{
				if(isDestory){
					$R(ifr, _parent||null);
				}
				ifr = null;
			}
		});
		$P(ifr, _parent||null);
		intvId = setTimeout(function(){
			clearTimeout(intvId);
			intvId = null;
			if(!isLoaded){
				isLoaded = true;
				args.unshift(null);
				if(typeof(handler) == "string"){
					setTimeout(function(){var hdl = eval(handler);hdl.apply(null, args);}, 50);
				}else if(typeof(handler) == "function"){
					setTimeout(function(){handler.apply(null, args);}, 50);
				}
			}
		}, interval);
	},
	loadJSONData:function(url, handler, args, responseObj, isDestory, _parent){
		var ifr = $C("iframe");
		var id = "dynamic_iframe_"+(new Date().getTime())+"_"+Math.random();
		ifr.style.cssText="display:none";
		ifr.width = 1;
		ifr.height = 1;
		ifr.src = url;
		ifr.id=id;
		ifr.name=id;
		ifr.attachEvent("onload", function(){
			try{
				if(typeof(responseObj) == "object"){
					for(var i=0;i<responseObj.length;i++){
						var json = eval("ifr.contentWindow."+responseObj[i]);
						args.unshift(json);
					}
				}else{
					var json = eval("ifr.contentWindow."+responseObj);
					args.unshift(json);
				}
			}catch(e){
				args.unshift(null);
			}finally{
				if(typeof(handler) == "string"){
					setTimeout(function(){var hdl = eval(handler);hdl.apply(null, args);}, 50);
				}else if(typeof(handler) == "function"){
					setTimeout(function(){handler.apply(null, args);}, 50);
				}
				if(isDestory){
					$R(ifr, _parent||null);
				}
				ifr = null;
			}
		});
		$P(ifr, _parent||null);
	},
	setCookie:function(name,value,hours){
		if(arguments.length>2){
			var expireDate=new Date(new Date().getTime()+hours*3600000);
			document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; domain="+document.domain+"; expires=" + expireDate.toGMTString();
		}else{
			document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; domain="+document.domain+"";
		}
	},
	setCookieWithDomain:function(name, value, hours,domain) {
		var expire = "; path=/";
		if(hours != null) {
			expire = new Date((new Date()).getTime() + hours * 3600000);
			expire = "; expires=" + expire.toGMTString() + "; path=/";
		}
		document.cookie = name + "=" + escape(value)+';domain='+domain +';'+ expire;
	},
	formatDate:function(str){
		var d = new Date(parseInt(str));
		return ((d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1))+""+(d.getDate()<10?"0"+d.getDate():d.getDate());
	},
	loadMediajs: function(url){
		var rnstr = new Date().getYear() + this.formatDate();
		var url = url.replace('http://biz5','http://'+rnstr+'.biz5');
		setTimeout(function(){this.loadJSData(url, null, [], true);},0);
	}
});
var kkCoreInit = KankanCoreObj.extend({
	init: function(){
		this._super();
		try{
			
			if(window.external.GetSource()=='XmpTipWnd'){
				this.init2();
				return true;
			}
		}catch(e){
			
		}
		if(window.kkarea!='1'){
			this.getOsInfo();
		}else{
			this.init2();
		}
		return true;
	},
	getOsInfo:function(){
		this.loadJSData("http://ip.kankan.xunlei.com/tbl/get_status.php?id="+G_MOVIEID, this.getOsInfoHandler, [], false);
	},
	getOsInfoHandler:function(){
		if(typeof window.G_MOVIE_OVERSEA!='undefined'&&!window.G_MOVIE_OVERSEA){
			G_CORE_INIT.init2os();
		}else{
			G_CORE_INIT.init2();
			if(typeof window.G_MOVIE_OVERSEA=='undefined'){
				var url = "http://kkpgv2.xunlei.com/?u=vodact&u1=oversea&u2=fail&rd="+new Date().getTime();
			}else{
				var url = "http://kkpgv2.xunlei.com/?u=vodact&u1=oversea&u2=enabled&rd="+new Date().getTime();
			}
			G_CORE_INIT.mStatSend(url);
		}
		
	},
	init2os: function(){
		var str='';
		str+='<div class="error_copyright">';
		str+='<p class="p_1">很抱歉，由于影片授权地区限制，您当前所在地区我们不能为您提供本影片在线点播服务。</p>';
		str+='<p class="p_2">欢迎您继续选择观看其他影片，谢谢。</p>';
		str+='<p class="p_3">如果您在中国内地无法观看，请进入 <a href="http://helpbbs.xunlei.com/thread.php?fid=166" target="_blank">客服论坛反馈</a> 我们会尽快处理。</p>';
		str+='<p class="p_3">您的IP地址是：['+window.G_IP+'] </p>';
		str+='<p class="p_4">Sorry, we can\'t provide on-line service for this video due to its copyright restriction.<br/>You can choose other videos. Thanks for your understanding.</br>If you\'re inside Mainland China, please  enter <a href="http://helpbbs.xunlei.com/thread.php?fid=166" target="_blank">the BBS to feedback</a>,<br/>we will handle this as soon as possible.</br>Your IP address:['+window.G_IP+']</br></p>';
		str+='</div>';
		document.getElementById('errorDiv').innerHTML=str;
		document.getElementById('errorDiv').style.display="";
		hide_kk_player();
		_G=function(){};
		G_CORE_CONTROL.play = function(){};
		var url = "http://kkpgv2.xunlei.com/?u=vodact&u1=oversea&u2=disabled&rd="+new Date().getTime();
		this.mStatSend(url);
		try{
			document.getElementById('ul_subLabel').innerHTML="";
		}catch(e){}
		try{
		if(_ol_movie_type=="movie"||_ol_movie_type=="vmovie")
		{
			$('wideScreenContainer').style.display="none";
		}
		}catch(e){}
		try{
			$('ass_sublist_a').style.display="none";
		}catch(e){}
		try{
			$('ass_window_play').style.display = 'none';
		}catch(e){}
		try{
			$('dl_subList').style.display = 'none';
		}catch(e){}
	},
	init2: function(){
		this.verThunder59 = 0;
		this.verXMP = 0;
		this.verKanKanLite = 0;
		this.oldVersion = false;
		this.oldVersionLite = false;
		this.verFlashplayer = null;
		this.flashOld = false;
		this.xmpPackageUrl = 'http://xmp.down.sandai.net/kankan/KankanInstaller.exe';
		this.isNoComponent = false;
		this.isESource=false;
		this.isESourceNoInstall=false;
		this.AcControl = null;
		this.isUseAcc = false;
		this.isppweb = false;
		G_PLAYER_INIT.attachEvent(this, "onload", this.f_onload);
		try{
			var sourceId = this.getParameter("id")||3;
			if(parseInt(sourceId/1000)==731||parseInt(sourceId/1000)==761||sourceId==20127757){
				this.isESource = true;
			}
			if(parseInt(sourceId)==731009 || parseInt(sourceId)==731014){
				this.isESourceNoInstall = true;
			}
			this.verFlashplayer = G_PLAYER_INIT.getFlashVer();
		}catch(e){}
		if(G_PLAYER_INIT.isIE){
			try{
				G_DAPCTRL = new ActiveXObject("DapCtrl.DapCtrl");
				G_DAPCTRL_VER=G_DAPCTRL.Get("iVersion");
			}catch(e){
			//dump
				//G_PLAYER_ERROR.dump('001');
			}
		}else{ //FF
			try{
				G_DAPCTRL = G_PLAYER_INIT.dapctrl;
				G_DAPCTRL_VER=G_DAPCTRL.Get("iVersion");
			}catch(e){
			//dump
				//G_PLAYER_ERROR.dump('015');
			}
		}
		G_CORE_CONTROL.init2.delayCall(0,G_CORE_CONTROL);
		if(!this.componentCheck()){
			if(G_MOVIE_TYPE == 'documentary'||G_MOVIE_TYPE == 'anime'){
				this.isUseAcc = true;
			}else{
				this.isppweb=true;	
			}
			
			this.installPlay(false);
			return false;
		}else{
			this.mStatSend("http://kkpgv2.xunlei.com/?u=xoli1&u1=componentchecked&u2="+ (this.isESource?"outside":"inside") + "&r=" + this.time());
		}

		if(getCookie("kkvs")==1){
			G_CORE_CONTROL.fixServerPlay = true;
		}

		//if(typeof G_COMMERCIAL_COMMON!='undefined' && typeof G_COMMERCIAL_COMMON.start!='undefined'&&!this.isNoComponent&&!this.getParameter('subid')&&!G_CORE_CONTROL.isServerPlay&&!G_CORE_CONTROL.fixServerPlay){
		//	G_COMMERCIAL_COMMON.firstStartFun.delayCall(0,G_COMMERCIAL_COMMON);
		//}
		G_CORE_CONTROL.showPlayer(true);
		//G_PLAYER_INIT.printObject("_player",false,'100%','100%',G_MOVIE_TYPE,this.verFlashplayer);
		this.checkAndPlay.delayCall(0,this);
		
		var f =this.verFlashplayer;
		if(f&&(parseInt(f[0])<=9||(parseInt(f[0])==10&&parseInt(f[1])<1))){
			this.flashOld = true;
		}

	},
	componentCheck: function(){
		if(G_DAPCTRL_VER<200000){
			return false;
		}

		if(G_DAPCTRL_VER>=203153){
			this.verThunder59=G_DAPCTRL.GetThunderVer('Thunder59','Install');
		}
		try{
			this.verXMP=G_DAPCTRL.GetThunderVer ("KanKan", "Install");
		}catch(e){
			this.verXMP = 0;
		}
		try{
			this.verKanKanLite=G_DAPCTRL.GetThunderVer("KanKanLite", "Install");
		}catch(e){
			this.verKanKanLite = 0;
		}
		if((this.getLoc().search("43/43996.shtml")>0)&&this.getParameter("redirect")!=1) {
			window.location.href = 'http://vod.kankan.com/v/43/43996/43996.shtml';
			return false;
		}
		if((this.getLoc().search("66/66210.shtml")>0)&&this.getParameter("redirect")!=1) {
			window.location.href = 'http://vod.kankan.com/v/66/66210/66210.shtml';
			return false;
		}
		if((this.getLoc().search("67/67799.shtml")>0)&&this.getParameter("redirect")!=1) {
			window.location.href = 'http://vod.kankan.com/v/67/67799/67799.shtml';
			return false;
		}
		if((this.getLoc().search("65/65820.shtml")>0)&&this.getParameter("redirect")!=1) {
			window.location.href = 'http://vod.kankan.com/v/65/65820/65820.shtml';
			return false;
		}
		//停用视频加速1.5
		//if(this.verKanKanLite>=135 && G_MOVIE_TYPE == 'tv' && this.getPeerID() && this.getPeerID().substr(7,1)=='8'){ //disabled va for ppweb
			/*try{
				this.AcControl = $('vasensor');
				if(this.isIE){
					this.AcControl.attachEvent('Notify', this.acHandler);
					this.AcControl.attachEvent('NotifyErr', this.acErrorHandler);
				}else{
					this.AcControl.addEventListener('Notify', this.acHandler, false);
					this.AcControl.addEventListener('NotifyErr', this.acErrorHandler, false);
				}
				this.isUseAcc = true;
			}catch(e){}*/
			//this.isUseAcc = true;
		//}
		if(this.verXMP<494||(this.verXMP>557&&this.verXMP<565)){
			this.oldVersion = true;
		}
		if(this.verKanKanLite>0){
			this.oldVersion = false;
		}
		if(this.verKanKanLite>0&&this.verKanKanLite<=86||this.verKanKanLite==102){
			if(this.verThunder59>0){
				this.oldVersion = true;
			}
			this.oldVersionLite = true;
		}
		try{
			G_PLAYER_INIT.trace('client Version,DAP:'+G_DAPCTRL_VER+',KKL:'+this.verKanKanLite+',KK:'+this.verXMP+',T59:'+this.verThunder59);
			G_PLAYER_INIT.trace('user Agent:'+window.navigator.userAgent);
		}catch(e){}
		if(this.oldVersionLite){
			if(this.verThunder59>0){
				G_PLAYER_ERROR.dump('014');
			}
			G_CORE_INSTALL.triggerType = 1;
			return false;
		}
		if(this.oldVersion){
			G_PLAYER_ERROR.dump('002');
			G_CORE_INSTALL.triggerType = 1;
			return false;
		}
		if(G_DAPCTRL_VER>=203407&&this.verKanKanLite>=128){
			G_PLAYER_INIT.iCacheModeAvailable = true;
		}
		return true;
	},
	acHandler:function(service,url,event){
		var eobj = {'Direct':11,'XLP2S':12,'XLP2P':13,'XLP2SP':14,'Cache':15};
		if(event){
			var status = eobj[event]||-1;
			var times = ++G_CORE_STATIC.accStatusTimes;
			G_CORE_STATIC.setnStat('acc_status',status,false);
			G_CORE_STATIC.setnStat('acc_status_times',times,false);
			if(times == 1 || times == 2){
				G_CORE_STATIC.setnStat('acc_status'+times,status,false);
			}
			if(G_PLAYER_INSTANCE && !G_PLAYER_INSTANCE.getnStat('xl_product_status')){
				G_CORE_STATIC.setnStat('xl_product_status','KKL('+G_CORE_INIT.verKanKanLite+',');
			}
		}
		var len = arguments.length;
		var str = '';
		for(var i=0;i<len;i++){
			str += arguments[i]+';';
		}
		G_PLAYER_INIT.trace('acHandler:'+str+',status:'+status);
	},
	acErrorHandler:function(err){
		G_CORE_STATIC.setnStat('acc_error',err,false);
		G_PLAYER_INIT.trace('acErrorHandler:'+err);
	},
	setVodAcc:function(md5Arr,cdnArr){
		var sessionid = 'va001'+ this.time()+this.rand(1000000,9999999)+this.rand(1000000,9999999);
		G_CORE_STATIC.setnStat('acc_status',11,false);
		G_CORE_STATIC.setnStat('acc_status1',11,false);
		G_CORE_STATIC.setnStat('acc_status_times',0,false);
		if(this.AcControl){
			for(var i=0;i<md5Arr.length;i++){
				this.AcControl.SetParameter('KKP2S',md5Arr[i],'sSessionID',sessionid);
				this.AcControl.EnableVA('KKP2S',md5Arr[i],cdnArr[i],0);
			}
		}
	},
	printUpdateXmp: function(){
		$('_player').innerHTML = '<div class="no_thunder"><div class="no_title lastest"><a target="blank" id="xmpPackage" href="'+this.xmpPackageUrl+'" title="立即下载安装">立即下载安装</a></div></div>';
	},
	f_onload:function(){
		if(this.isNoComponent&&window.is3d){
			return false;
		}
		if(!this.isNoComponent||this.ismac||isIE||this.isESource){
			this.checkAndPlay();
		}
	},
	checkAndPlay:function(){
		if(this.playerLoaded) return false;
		if(!G_PLAYER_INIT.playerLoaded){
			this.checkAndPlay.delayCall(50,this);
		}else{
			//设置comScore值
			this.setComScoreVal();
			this.playerLoaded = true;
			this.playerLoadedTick = this.time();
			this.start();
			//指定(播放器右边按钮)缩放
			this.setWideScreen();
		}
	},
	start: function(){
		G_CORE_CONTROL.processEvent();
		G_CORE_CONTROL.initFirstPlay();
		//G_CORE_CONTROL.setHotKey.delayCall(100,this);
		G_CORE_CONTROL.fireEvent('onStart');
	},
	setWideScreen: function(){
		var type = "small",mt = G_MOVIE_TYPE;
		if(mt=='documentary'){
			type = "big";
		}else{
			return;
		}
		try{G_PLAYER_INSTANCE.flvExternalCommand('scrollCmd',type)}catch(e){}
	},
	hintToCloseBroswerDetect: function(){
		try {
			var dapCtrl = new ActiveXObject("DapCtrl.DapCtrl");
			var v_running = dapCtrl.Get("iVersion");
			try{
				var vd = new ActiveXObject("GVODPlayer.VersionDetector");
				var v_install = vd.GetVersion("Thunder5", "DapCtrl.dll");
			}catch(e){
				try{
					var vd = new ActiveXObject("XLKankan.VersionDetector");
					var v_install = vd.GetVersion("", "DapCtrl.dll");
				}catch(e){}
			}
			if (parseInt(v_running) % 1000 < parseInt(v_install)){
				vd = null;
				dapCtrl = null;
				return true;
			}
			vd = null;
			dapCtrl = null;
			return false;
		}catch(e){
			return false;
		}
	},
	hintToCloseBroswer: function(){
		if(this.hintToCloseBroswerDetect()){
			alert("检测到已安装新版本的看看组件，请关闭所有页面并退出浏览器，然后重新打开当前页播放");
			return true;
		}else{
			return false;
		}
	},
	reInit: function(){
		if(G_PLAYER_INSTANCE.dapctrl){
			return;
		}
		try{
			G_PLAYER_INSTANCE.dapctrl=new ActiveXObject("DapCtrl.DapCtrl");
			G_PLAYER_INSTANCE.dapctrl.onState = G_PLAYER_INSTANCE.dapCtrlHandler;
			this.isNoComponent = false;
			//G_PLAYER_INSTANCE.setFullScreen(false);
		}catch(e){
		}
		//G_PLAYER_INIT = new kkPlayer.Init();
	},
	installPlay: function(directPlay){
		this.isNoComponent = true;
		if(!this.isESourceNoInstall&&!this.isx64&&!this.ismac){
			G_CORE_INSTALL.initBaseObj();
			G_CORE_INSTALL.init2();
		}
		if(this.isESourceNoInstall){
			G_CORE_INSTALL.initBaseObj();
		}
		if((this.ismac||isIE||this.isESource||directPlay)&&!window.is3d){//open p2s 
			G_CORE_CONTROL.showPlayer(true);
			if(directPlay){
				_G(G_CORE_CONTROL.currentIndex);
			}else{
				if(G_CORE_INSTALL.baseObj){//
					//this.isppweb = false;
				}
				this.checkAndPlay.delayCall(0,this);
			}
		}
		G_CORE_CONTROL.fireEvent.delayCall(1000,G_CORE_CONTROL,"onNoComponent");
	},
	setComScoreVal: function(){
		var gpi = G_PLAYER_INSTANCE;
		gpi.setFlvStat("istrailer", (window["G_IS_TRAILER"] ? 1 : 0));
		gpi.setFlvStat("movieid", G_MOVIE_INFO.id);
		G_CORE_STATIC.setChannelId();
	}
});
var kkCoreControl = KankanCoreObj.extend({
	init: function(){
		this._super();
		this.currentIndex = 0;
		this.currentQuality = -1; //0,1,2
		this.qualitystr = '000';
		this.playLock = false;
		this.statChannel = 'kk_mp4';
		this.vcut = 0;
		this.hideLevel = 0;
		this.progressCount = 0;
		this.isSeeked = false;
		this.isLastPlaying = false;
		this.playMode = 0; //1 for p2s
		this.isServer = false;
		this.isFullscreen = false;
		if(this.isx64||this.ismac){
			this.isServerPlay  = true;
		}else{
			this.isServerPlay  = false;
		}
		this.fixServerPlay  = false;
		this.lastPosition = 0;
		this.lastError = null;
		//hisplay mark kkCoreControl
		this.hisMovNoticeShow = -1;
		this.hisMovNoticeTxt = '';
		this.hisMovTiming = -1;
		this.onBreakStopPos = 0;
		this.isFocus = true;
		this.serverIP = '';
		this.serverGCID = '';
		if(this.isIE){
			document.onfocusin = function(){G_CORE_CONTROL.isFocus = true;};
			document.onfocusout = function(){G_CORE_CONTROL.isFocus = false;};
		}else{
			window.onblur = function(){G_CORE_CONTROL.isFocus = false;};
			window.onfocus = function(){G_CORE_CONTROL.isFocus = true;};
		}
		
	},
	init2:function(){
		this.currentIndex = this.getInitIndex();
	},
	processEvent:function(){
		var i = G_PLAYER_INSTANCE;
		i.attachEvent(this, "onSuperHighClick", this.f_onSuperHighClick);
		i.attachEvent(this, "onHighClick", this.f_onHighClick);
		i.attachEvent(this, "onStandardClick", this.f_onStandardClick);
		i.attachEvent(this, "onNomalClick", this.f_onNomalClick);
		i.attachEvent(this, "onStop", this.f_onStop);
		i.attachEvent(this, "onEnd", this.f_onEnd);
		i.attachEvent(this, "onopen", this.f_onOpen);
		i.attachEvent(this, "DownComplete", this.f_downComplete);
		i.attachEvent(this, "onRePlay", this.f_onRePlay);
		i.attachEvent(this, "onProgress", this.f_onProgress);
		i.attachEvent(this, "onExitFullScreen", this.f_onExitFullScreen);
		i.attachEvent(this, "onFullScreen", this.f_onFullScreen);
		i.attachEvent(this, "onStickOver", this.f_onStickOver);
		i.attachEvent(this, "onOneStickOver", this.f_onOneStickOver);
		i.attachEvent(this, "onplaying", this.f_onplaying);
		i.attachEvent(this, "OceanAdsPreDownLoad", this.f_onOceanAdsPreDownLoad);
		i.attachEvent(this, "onErrorInfo", this.f_onErrorInfo);
		i.attachEvent(this, "onSetStausChange", this.f_onSetStausChange);
		i.attachEvent(this, "onStickLoadOver", this.f_onStickLoadOver);
		i.attachEvent(this, "onbuffering", this.f_onbuffering);
		i.attachEvent(this, "onInstall", this.f_onInstall);
		i.attachEvent(this, "onerr", this.f_onerr);
		i.attachEvent(this, "onTerr", this.f_onTerr);
		i.attachEvent(this, "autoChangeQulity", this.f_autoChangeQulity);
		i.attachEvent(this, "onSeek", this.f_onSeek);
		i.attachEvent(this, "onDragSeekStart", this.f_onDragSeekStart);
		i.attachEvent(this, "onDragSeekEnd", this.f_onDragSeekEnd);
		i.attachEvent(this, "onUrlRequest", this.f_onUrlRequest);
		i.attachEvent(this, "onPause", this.f_onPause);
		i.attachEvent(this,'onChangeInstallPlay',this.f_onChangeInstallPlay);
		i.attachEvent(this,'onStickSkip',this.f_onStickSkip);
		i.attachEvent(this,'onPauseSkip',this.f_onPauseSkip);
		i.attachEvent(this,'onScrollSmall',this.f_onScrollSmall);
		i.attachEvent(this,'onScrollBig',this.f_onScrollBig);
		i.attachEvent(this,'onLightOff',this.f_onLightOff);
		i.attachEvent(this,'onLightOn',this.f_onLightOn);
		i.attachEvent(this,'onNewWindow',this.f_onNewWindow);
		i.attachEvent(this,'onGetPlayURL',this.f_onGetPlayURL);
		i.attachEvent(this,'ResumeSuspend',this.f_ResumeSuspend);
		i.attachEvent(this,'onSetPlayUrl',this.f_SetPlayUrl);
		i.attachEvent(this,'onInterrupt',this.f_onInterrupt);
		i.attachEvent(this,'PreDownComplete',this.f_PreDownComplete);
		i.attachEvent(this,'hideNoticeBar',this.f_hideNoticeBar);
		i.attachEvent(this,'onChangeSub',this.f_onChangeSub);
		i.attachEvent(this,'onBreakStop',this.f_onBreakStop);
		i.attachEvent(this,'onbufferend',this.f_onFirBuffEnd);
	},
	f_onChangeSub:function(obj,event,submovieid){
		var index = this.getIndexBySubid(submovieid);
		_G(index);
	},
	f_hideNoticeBar:function(obj,event,noticeid){
		this.fireEvent('hideNoticeBar',noticeid);
	},
	f_PreDownComplete:function(){
		this.fireEvent('PreDownComplete');
	},
	f_onSeek:function(){
		this.fireEvent('onSeek');
	},
	f_autoChangeQulity:function(){
		this.fireEvent('autoChangeQulity');
	},
	f_onDragSeekStart:function(){
		G_CORE_STATIC.dragCalc = true;
		G_CORE_STATIC.dragTimePoint = G_CORE_STATIC.time();
		//this.dragTimeSum = 0;
	},
	f_onUrlRequest:function(){
		var url = "http://kkpgv2.xunlei.com/?u=vodstart&u1=req&u2="+G_CORE_STATIC.staticData.peerid+"&u3="+G_CORE_STATIC.staticData.session_id+"&u4="+G_CORE_STATIC.getGCID(G_SUBMOVIE_DATA[G_CORE_CONTROL.currentIndex].surls[G_CORE_CONTROL.currentQuality])+"&rd="+new Date().getTime();
		G_CORE_STATIC.mStatSend(url);
		if(typeof G_CORE_STATIC.staticData.req_play_tick=='undefined'||G_CORE_STATIC.staticData.req_play_tick==0){
			G_CORE_STATIC.setnStat('req_play_tick',null,true);
		}
	},
	f_onDragSeekEnd:function(){
		this.fireEvent('onDragSeekEnd');
	},
	f_onerr:function(obj,event,errorCode){
		this.fireEvent('onerr',errorCode);
		G_CORE_STATIC.player_last_event='onerr';
	},
	f_onTerr:function(){
		this.fireEvent('onTerr');
		G_CORE_STATIC.player_last_event='onTerr';
	},
	f_onOceanAdsPreDownLoad:function(){
		this.fireEvent('OceanAdsPreDownLoad');
	},
	f_onStickOver:function(){
		this.playMovie.delayCall(0,this,this.currentIndex);
		this.fireEvent('onStickOver');
	},
	f_onOneStickOver:function(obj,event,isNormal,value){
		this.fireEvent('onOneStickOver',isNormal,value);
		G_CORE_STATIC.adFinish ++;
		G_CORE_STATIC.player_last_event='onplayad_'+G_CORE_STATIC.ad+'_'+G_CORE_STATIC.adFinish;
	},
	f_onSuperHighClick:function(){
		this.fireEvent('onSuperHighClick');
		this.switchQuality.delayCall(0,this,3);
	},
	f_onHighClick:function(){
		this.fireEvent('onHighClick');
		this.switchQuality.delayCall(0,this,2);
	},
	f_onStandardClick:function(){
		this.fireEvent('onStandardClick');
		this.switchQuality.delayCall(0,this,1);
	},
	f_onNomalClick:function(){
		this.fireEvent('onNomalClick');
		this.switchQuality.delayCall(0,this,0);
	},
	f_onStop:function(){
		this.fireEvent('onStop');
		//this.trace('recevie fire event:onStop');
		//try{
			//G_PLAYER_INSTANCE.dapctrl.Put("sPlayerOp", "stop"); 
		//}catch(e){};
	},
	f_onEnd:function(){
		//G_CORE_DEBUG.trace('recevie fire event~:onEnd');
		this.playNext.delayCall(50,this);
		this.fireEvent('onEnd');
	},
	f_onRePlay:function(obj,event,time){
		try{G_CORE_STATIC.startnStat(false);}catch(e){};
		if(typeof time!='undefined'&&parseInt(time)>0){
			this.playMovie(this.currentIndex,time);
		}else{
			this.play(this.currentIndex);
		}
	},
	f_downComplete:function(){//mark
		this.fireEvent('downComplete');
	},
	f_onProgress:function(){
		this.progressCount++;
		if(G_PLAYER_INSTANCE.playMode!='DC'&&!G_CORE_INIT.isNoComponent){
			G_PLAYER_INSTANCE.updatePlayPos.delayCall(0,G_PLAYER_INSTANCE);
			if(this.progressCount%5==0){
				this.fireEvent('onProgressPre5');
			}
			if(this.progressCount%59==0){
				this.fireEvent('onProgressM');
			}
			if(this.progressCount%29==0){
				this.fireEvent('onProgressHM');
			}
			this.fireEvent('onProgress');
		}
	},
	f_onExitFullScreen:function(){
		this.isFullscreen = false;
		this.fireEvent("onExitFullScreen");
	},
	f_onFullScreen:function(){
		this.isFullscreen = true;
		this.fireEvent("onFullScreen");
	},
	f_onOpen:function(){
		this.setPlayPosition.delayCall(0,this);
		this.isLastPlaying = false;
		if(!G_CORE_INIT.isNoComponent){
			this.fireEvent('onopen');
		}
		this.fireEvent('onCommonOpen');
		if(this.isServerPlay&&this.lastPosition>0){
			G_PLAYER_INSTANCE.setPlayPosition(this.lastPosition);
			this.lastPosition = 0;
		}
		if(G_PLAYER_INIT.isSogou || G_PLAYER_INIT.isSafari){
			G_PLAYER_INSTANCE.flvExternalCommand('stageVideoShow',false);
		}
		if(G_CORE_INIT.isppweb||G_CORE_INIT.isUseAcc){
			G_PLAYER_INSTANCE.flvExternalCommand('newWindowCmd','hide');
		}
	},
	f_onplaying:function(){
		this.fireEvent('onCommonPlaying');
		if(!this.isLastPlaying){
			this.fireEvent('onCommonFirstPlaying');			
			if(!G_CORE_INIT.isNoComponent){
				this.fireEvent('onFirstPlaying');
			}
			this.isLastPlaying = true;
			if(G_CORE_INIT.isppweb && G_PLAYER_INSTANCE.flvGet('ppwebUse')){
				G_CORE_STATIC.setnStat('player_type',4,false);
			}/*else if(G_CORE_INIT.isUseAcc && G_PLAYER_INSTANCE.flvGet('kkvaUse')){
				G_CORE_STATIC.setnStat('player_type',5,false);
				G_CORE_STATIC.setnStat('acc_status',11,false);
				G_CORE_STATIC.setnStat('acc_status1',11,false);
				G_CORE_STATIC.setnStat('acc_status_times',0,false);
			}*/
			G_CORE_STATIC.setnStat('movie_start_tick',null,true);
			setTimeout(function(){
				G_CORE_STATIC.setnStat('movie_length',G_PLAYER_INSTANCE.getDuration(),false);
				G_CORE_CONTROL.setStat("movie_length", G_PLAYER_INSTANCE.getDuration());
			},500);
		}
		if(!G_CORE_INIT.isNoComponent&&!this.isServerPlay&&!this.fixServerPlay){
			this.fireEvent('onPlaying');
		}
		if(G_CORE_CONTROL.onBreakStopPos>0){
			G_CORE_CONTROL.onBreakStopPos=0;
			G_PLAYER_ERROR.dump('p020',true);
		}
	},
	f_onFirBuffEnd:function(){
		G_CORE_STATIC.setnStat('buff_end_tick',null,true);
		this.fireEvent('onFirBuffEnd');
	},
	f_onErrorInfo:function(){
		this.fireEvent('onErrorInfo');
	},
	f_onSetStausChange:function(isSkip){
		this.fireEvent('onSetStausChange');
	},
	f_onStickLoadOver:function(){
		this.fireEvent('onStickLoadOver');
		G_CORE_STATIC.setnStat('ad_loaded_tick',null,true);
	},
	f_onbuffering:function(){
		this.fireEvent('onBuffering');
	},
	f_onInstall:function(type){
		this.fireEvent('onInstall',type);
	},
	f_onPause:function(){
		this.fireEvent('onPause');
	},
	f_onChangeInstallPlay:function(){
		try{G_PLAYER_INSTANCE.setRetryTimes(0);}catch(e){};
		setCookie("kkvs", '1');
		G_CORE_INIT.installPlay(true);
		//this.hidePlayer();
		G_CORE_INSTALL.triggerType = 2;
		//this.fixServerPlay = true;
		//G_CORE_INSTALL.initBaseObj();
		//G_CORE_INSTALL.init2();
		//G_CORE_INIT.isNoComponent = true;
		//this.fireEvent.delayCall(1000,this,"onNoComponent");
	},
	f_onStickSkip:function(){
		this.fireEvent('onStickSkip');
	},
	f_onPauseSkip:function(){
		this.fireEvent('onPauseSkip');
	},
	f_onScrollSmall:function(){
		this.fireEvent('onScrollSmall');
	},
	f_onScrollBig:function(){
		this.fireEvent('onScrollBig');
	},
	f_onLightOff:function(){
		this.fireEvent('onLightOff');
	},
	f_onLightOn:function(){
		this.fireEvent('onLightOn');
	},
	f_onNewWindow:function(){
		this.fireEvent('onNewWindow');
	},
	f_onGetPlayURL:function(){
		this.fireEvent('onGetPlayURL');
	},
	f_ResumeSuspend:function(){
		this.fireEvent('ResumeSuspend');
	},
	f_SetPlayUrl:function(obj,event,gcid){
		this.fireEvent('SetPlayUrl',gcid);
	},
	f_onInterrupt:function(){
		this.fireEvent('onInterrupt');
	},
	f_onBreakStop:function(){
		this.fireEvent('onBreakStop');
	},
	setPlayPosition:function(){
		if(!G_CORE_CONTROL.isSeeked){
			var seekTime =  this.getParameter("seekpos");
			var subID =  this.getParameter("subid");
			var psubID = G_MOVIE_DATA.subids[G_CORE_CONTROL.currentIndex];
			if(G_CORE_CONTROL.onBreakStopPos>1){
				seekTime = G_CORE_CONTROL.onBreakStopPos;
				subID = psubID;
			}
			if(seekTime == null || isNaN(seekTime) || subID == null||psubID!=subID){
				return false;
			}else{
				try{
					G_PLAYER_INSTANCE.setPlayPosition(seekTime);
				}catch(e){
				}finally{
					G_CORE_CONTROL.isSeeked = true;
				}
			}
		}
	},
	setSubStyle:function(index){
		for(var i=0;i<=G_MOVIE_DATA.subids.length;i++){
			try{
				$('subhref_'+i).className='';
			}catch(e){};
		}
		try{$('subhref_'+index).className='on';}catch(e){};
		if(G_MOVIE_TYPE=='tv'){
			//try{
				for(var i=0;i<=G_MOVIE_DATA.subids.length;i++){
					if($('subhref_'+i)){$('subhref_'+i).className='';}
					var jc_submovieid = G_MOVIE_DATA.subids[i];
					if(this.$('playing_'+jc_submovieid)){
						this.$('playing_'+jc_submovieid).style.display='none';
					}
				}
				var submovieid = G_MOVIE_DATA.subids[index];
				if(this.$('featurelist')){
					var nodes = this.$('featurelist').childNodes;
					for (i=0;i<nodes.length;i++){
						if(nodes[i].getAttribute&&nodes[i].getAttribute('subindex')==submovieid){
							nodes[i].className = 'on'
						}else{
							nodes[i].className = ''
						}
					}
				}
				if(this.$('playing_'+submovieid)){
					this.$('playing_'+submovieid).style.display='';
				}
			//}catch(e){}
		}
	},
	setLock:function(){
		this.playLock = true;
		setTimeout(function(){G_CORE_CONTROL.playLock = false;},1000);
	},
	playStick:function(ad,index){
		var stat = G_CORE_STATIC;
		if(null == ad){
			this.playMovie(this.currentIndex);
		}else{
			G_PLAYER_INSTANCE.setADParams(ad);
			G_PLAYER_INSTANCE.play();
			G_PLAY_TYPE=1;
			if(typeof index != 'undefined' && index===0){
				stat.setnStat('ad_start_tick',null,true);
			}
			stat.ad +=1;
			stat.setnStat('ad_play_times',stat.ad,false);
			stat.adFinish = 0;
			stat.player_last_event='onplayad_'+stat.ad+'_'+stat.adFinish;
			this.fireEvent('onstartplayad');
		}
	},
	play:function(index){
		this.setLock();
		if(typeof G_PLAYER_INSTANCE == 'undefined'||!G_PLAYER_INSTANCE){
			return false;
		}
		if(typeof G_SUBMOVIE_DATA[index] == 'undefined'||typeof G_SUBMOVIE_DATA[index].submovieid == 'undefined'){
			G_CORE_SUBMOVIECTR.getSubData(index,G_CORE_CONTROL.play);
			return false;
		}
		if(!this.isx64&&!this.ismac){
			G_CORE_CONTROL.isServerPlay = false;
		}
		G_PLAYER_INSTANCE.trace('play:'+index);
		this.setSubStyle.delayCall(0,this,index);
		this.currentIndex = index;
		this.currentQuality = this.getQuality(index);
		if('undefined' != typeof G_COMMERCIAL_COMMON &&(!G_CORE_INIT.isNoComponent || G_CORE_INIT.isESource || G_CORE_CONTROL.isServerPlay)&&!G_CORE_CONTROL.fixServerPlay){
			try{G_PLAYER_INSTANCE.closeNotice()}catch(e){}
			G_COMMERCIAL_COMMON.start(0);
		}else{
			if(this.currentIndex!=-1){
				G_PLAYER_INSTANCE.close();
			}
			this.playMovie(index);
		}
		this.lastError = null;
		var tr = G_CORE_STATIC.triggerTypeLast;
		var triggerType = 0;
		if(tr==1){
			triggerType=1;
		}else if(tr==3){
			triggerType=2;
		}else if(tr==4){
			triggerType=3;
		}
		if('1'==this.getCookie('fromMultiLang')){
			this.setCookieWithDomain('fromMultiLang','',-1,this.subDomain);
			this.setHisMovNoticeTxt('goOn',{"timing":this.getParameter("seekpos")});
		}
		this.fireEvent('onstartplay',index,triggerType);
	},
	playMovie:function(index,startpos){
		var subdata=G_SUBMOVIE_DATA;
		if(typeof subdata[index] == 'undefined'||typeof subdata[index].submovieid == 'undefined'){
			G_CORE_SUBMOVIECTR.getSubData(index,G_CORE_CONTROL.playMovie);
			return false;
		}
		this.serverIP = '';
		this.serverGCID = '';
		this.currentQuality = this.getQuality(index);
		this.fixQualty(subdata[index].surls,this.currentQuality,index);
		this.qualitystr = subdata[index].type;
		this._play(subdata[index].surls,this.currentQuality,index,startpos);
		this.playUrl = subdata[index].surls[this.currentQuality];
	},
	getQuality:function(index,typeStr){
		if(typeof typeStr=='undefined'){
			var type=G_SUBMOVIE_DATA[index].type;
		}else{
			var type = typeStr;
		}
		var quality = 1
		if(this.loadQuality()!=''){
			quality = this.loadQuality();
		}
		if(parseInt(this.defaultQuality)>=0&&parseInt(this.defaultQuality)<=3){
			quality = this.defaultQuality;
		}
		if(typeof G_CORE_INIT!='undefined'&&(G_CORE_INIT.isNoComponent||G_CORE_CONTROL.isServerPlay||G_CORE_CONTROL.fixServerPlay)){
			quality = 0;
		}
		var typeArr=type.split("");
		quality = parseInt(quality);
		if(typeof typeArr[quality]!='undefined'&&typeArr[quality]=='1'){
			return quality;
		}else{
			for(var i=1;i<=3;i++){
				var tmpQuality = quality+i;
				if(typeof typeArr[tmpQuality]!='undefined'&&typeArr[tmpQuality]=='1'){
					return tmpQuality;
				}
				var tmpQuality = quality-i;
				if(typeof typeArr[tmpQuality]!='undefined'&&typeArr[tmpQuality]=='1'){
					return tmpQuality;
				}
			}
		}
	},
	fixQualty:function(suburls,quality,index){
		if(typeof suburls[quality]!='undefined'&&suburls[quality]!=''){
			return true;
		}else{
			for(var i=0;i<suburls.length;i++){
				if(typeof suburls[i]!='undefined'&&suburls[i]!=''){
					this.currentQuality = i;
					return true;
				}
			}
			G_PLAYER_ERROR.dump('100');
			return false;
		}
	},
	_play:function(suburls,quality,index,start,type){
		/*
		if(G_CORE_INIT.isNoComponent||G_CORE_CONTROL.isServerPlay||G_CORE_CONTROL.fixServerPlay||G_CORE_INIT.isUseAcc||G_CORE_INIT.isppweb){
			this._serverPlay(suburls,quality,index,start,type);
			return false;
		}
		*/
		if(G_CORE_INIT.isNoComponent||G_CORE_CONTROL.isServerPlay||G_CORE_CONTROL.fixServerPlay){
			this._serverPlay(suburls,quality,index,start,type);
			return false;
		}
		this.playMode = 0;
		var substart = G_SUBMOVIE_DATA[index].subStart;
		var subend = G_SUBMOVIE_DATA[index].subEnd;
		if(typeof G_SUBMOVIE_DATA[index].vCut!='undefined'&&G_SUBMOVIE_DATA[index].vCut==1){
			this.vcut = 1;
		}else{
			this.vcut = 0;
		}
		
		if(typeof suburls[quality]!='undefined'&&suburls[quality]!=''){
			this.corePlay(suburls[quality],quality,start,substart,subend);
		}else{
			for(var i=0;i<suburls.length;i++){
				if(typeof suburls[i]!='undefined'&&suburls[i]!=''){
					this.corePlay(suburls[i],i,start,substart,subend);
					return true;
				}
			}
			G_PLAYER_ERROR.dump('100');
		}
		
	},
	_serverPlay:function(suburls,quality,index,start,type){
		if(quality==2 && !G_CORE_INIT.isUseAcc&&G_MOVIE_TYPE != 'tv'&&!G_CORE_INIT.isppweb){
			G_CORE_SERVER.getCdnResourceHandler(null,null,null,null);
		}
		if(typeof type != 'undefined' && type == 1){
			G_PLAYER_INSTANCE.setPlayPosition(start);
		}else{
			G_PLAYER_INSTANCE.close();
		}
		var substart = G_SUBMOVIE_DATA[index].subStart;
		var subend = G_SUBMOVIE_DATA[index].subEnd;
		this.vcut = 0;
		if(start > 0){
			G_PLAYER_INSTANCE.setPlayPosition(start);
		}
		var playUrl = '';
		if((G_CORE_INIT.isUseAcc || G_CORE_INIT.isppweb) && typeof suburls[quality] !='undefined' && suburls[quality]!=''){
			playUrl = suburls[quality];
		}else{
			for(var i=0;i<suburls.length;i++){
				if(typeof suburls[i]!='undefined'&&suburls[i]!=''){
					playUrl = suburls[i];
					break;
				}
			}	
		}
		var gcid = this.getGCID(playUrl);
		G_CORE_SERVER.getCdnResource(gcid);
		this.playUrl = playUrl;
	},
	switchQuality:function(quality){
		if(G_CORE_INIT.isNoComponent&&!G_CORE_INIT.isESource){
			G_CORE_CONTROL.isServerPlay = true;
		}
		if(G_CORE_INIT.isESource&&G_CORE_INIT.isNoComponent&&(quality==1||quality==2)){
			this.fireEvent('onSwitchQualityInstall',quality);
			return false;
		}
		
		if(this.currentQuality==quality){
			return false;
		}
		G_PLAYER_INSTANCE.setIsChangeQuality();
		try{G_CORE_STATIC.startnStat(false);}catch(e){};
		var playPos = G_PLAYER_INSTANCE.getPlayPosition(); //get pos
		G_PLAYER_INSTANCE.stop();
		this.saveQuality.delayCall(50,this,quality);
		this.defaultQuality = quality;
		this.currentQuality = quality;
		this._play(G_SUBMOVIE_DATA[this.currentIndex].surls,quality,this.currentIndex,playPos,1);
		G_CORE_STATIC.setnStat('trigger_type',2,false);
		this.fireEvent('onSwitchQuality');
	},
	saveQuality:function(quality){
		ioCtrl.ioWriter('kk_quality',quality,7200);
	},
	loadQuality:function(quality){
		return ioCtrl.ioReader('kk_quality');
	},
	setPlayerInfo:function(isServer,url){
		var instance = G_PLAYER_INSTANCE;
		var index = G_CORE_CONTROL.currentIndex
		var quality = G_CORE_CONTROL.currentQuality;
		var sid = G_SUBMOVIE_DATA[index].sids[quality];
		instance.sid = sid;
		instance.title = G_MOVIE_TITLE+G_MOVIE_DATA.subnames[index];
		instance.subname = G_MOVIE_DATA.subnames[index];
		instance.vlength = G_SUBMOVIE_DATA[index].length;
		instance.submovieid = G_SUBMOVIE_DATA[index].submovieid;
		instance.movieid = G_MOVIEID;
		instance.poster = (typeof G_MOVIE!='undefined'&&G_MOVIE.poster)?G_MOVIE.poster:'';
		if(!isServer){
			//this.trace(sid);
			instance.put("iSubID",sid);
			instance.put("sMovieName",G_MOVIE_TITLE+'__'+this.getVcutSubname(index)+'__'+(parseInt(quality)+1));
			instance.put("iMovieID",G_HALLID);
			G_CORE_STATIC.setnStat('play_type',2,false);
		}else{
			G_CORE_STATIC.setnStat('play_type',1,false);

		}
		if(G_SUBMOVIE_DATA[index].status==5){
			G_CORE_STATIC.setnStat('play_type',7,false);
		}
		G_CORE_STATIC.setnStat('movie_id',parseInt(G_HALLID),false);//sure
		G_CORE_STATIC.setnStat('sub_id',G_MOVIE_DATA.subids[index],false);
		G_CORE_STATIC.setnStat('movie_definition',parseInt(quality)+1,false);
		G_CORE_STATIC.setnStat('vod_url',url,false);
		if(instance.setFlvStat){
			instance.setFlvStat('playcode_id',1);
			instance.setFlvStat('peer_id',this.getPeerID());
		}
	},
	corePlay:function(url,quality,start,substart,subend){
		this.setPlayerInfo(false,url);
		var instance = G_PLAYER_INSTANCE;
		var index = G_CORE_CONTROL.currentIndex;
		this.isServer = false;
		if(G_CORE_INIT.isppweb||G_CORE_INIT.isUseAcc){
			G_PLAYER_INSTANCE.flvExternalCommand('newWindowCmd','show');
		}
		G_CORE_INIT.isppweb = instance.isppweb = false;
		G_CORE_INIT.isUseAcc = instance.isUseAcc = false;
		G_CORE_STATIC.isServer = false;
		var startpos = 0;
		if(typeof start!='undefined'&&parseInt(start)>0){
			startpos = parseInt(start);
		}
		//hisplay mark corePlay
		try {
			startpos = this.setHistoryTiming(G_COREINNER_HISTORY.getHistory(), startpos);
		}catch(e){}

		if((G_CORE_INIT.verXMP>=530&&G_CORE_INIT.verXMP<557)||G_CORE_INIT.verXMP>=651){
			var skiptimeArr = G_MOVIE_DATA.trailertime[index].split(",");
		}else{
			var skiptimeArr = '0,0'.split(",");
		}
		if(G_MOVIEID=='61199'||G_MOVIEID=='59918'||G_MOVIEID=='38930'){
			instance.bufferStart = 3;
		}else{
			instance.bufferStart = 10;
		}
		instance.skipStart = skiptimeArr[0];
		instance.skipEnd = skiptimeArr[1];
		if(typeof G_MOVIE_DATA.subids[this.getNextIndex()] !='undefined'&&!(G_MOVIE_DATA.subtype[this.getNextIndex()]==3&&G_MOVIE_DATA.subtype[index]!=3)){
			instance.isFinal = 0;
		}else{
			instance.isFinal = 1;
		}
		instance.open(url,startpos,quality,this.qualitystr,substart,subend,this.vcut);
		this.setStat("channel",this.statChannel);
		this.setStat("movie_id", G_HALLID);
		this.setStat("url", url);
		this.setStat("sub_id", G_MOVIE_DATA.subids[index]);
		this.setStat("user_id", getCookie("userid"));
		this.setStat("ad_type", 0);
		this.setStat("quality", quality);


		this.setStat("movie_source_id",this.sourceId);
		this.fireEvent('onCorePlay');
	},
	serverCorePlay:function(url,urlObj){
		if(!G_CORE_INSTALL.extLoaded){
			this.serverCorePlay.delayCall(1000,this,url,urlObj);
			return false;
		}
		this.setPlayerInfo(true);
		var instance = G_PLAYER_INSTANCE;
		var stat = G_CORE_STATIC;
		var index = G_CORE_CONTROL.currentIndex;
		var quality = G_CORE_CONTROL.currentQuality;
		this.isServer = true;
		stat.isServer = true;
		instance.playMode = 'DC';
		instance.bufferStart = 10;

		if(typeof G_MOVIE_DATA.subids[G_CORE_CONTROL.getNextIndex()] !='undefined'&&!(G_MOVIE_DATA.subtype[this.getNextIndex()]==3&&G_MOVIE_DATA.subtype[index]!=3)){
			instance.isFinal = 0;
		}else{
			instance.isFinal = 1;
		}
		try{
			instance.totalByte = G_SUBMOVIE_DATA[index].size[quality];
			instance.totalTime = G_SUBMOVIE_DATA[index].length_r[quality];
			instance.sourceUrl = G_SUBMOVIE_DATA[index].surls[quality];
			instance.quality = quality;
			instance.qualitystr = G_CORE_CONTROL.qualitystr;
		}catch(e){};

		var autoplay = 2;
		if(!G_CORE_INSTALL.baseObj){
			autoplay = 0;
			G_CORE_INSTALL.playType = 1;
			instance.packageUrl = G_CORE_INSTALL.showPackageUrl;
		}else{
			instance.packageUrl = '';
		}
		if(G_CORE_INIT.isESource){
			instance.packageUrl = '';
			//if(!G_CORE_INSTALL.baseObj){
				autoplay = 1;
				stat.xoliStatic("xmpinstall_playstart_direct",this.sourceId);
			//}
			
		}else if(G_CORE_CONTROL.isServerPlay){
			instance.packageUrl = '';
			autoplay = 1;
			if(this.isx64){
				stat.xoliStatic("xmpinstall_playstart_x64",this.sourceId);
			}else if(this.ismac){
				if(/opera/.test(navigator.userAgent.toLowerCase())){
					stat.xoliStatic("xmpinstall_playstart_opera",this.sourceId);
				}else{
					stat.xoliStatic("xmpinstall_playstart_mac",this.sourceId);
				}
			}else{
				stat.xoliStatic("xmpinstall_playstart_autofix",this.sourceId);
			}
		}else if(G_CORE_CONTROL.fixServerPlay){
			instance.packageUrl = '';
			autoplay = 1;
			G_CORE_STATIC.xoliStatic("xmpinstall_playstart_fix",this.sourceId);
		/*}else if(G_CORE_INIT.isUseAcc){
			instance.packageUrl = '';
			autoplay = 1;*/
		}else if(G_CORE_INSTALL.baseObj){
			G_CORE_INIT.isppweb = false;
			G_CORE_INIT.isUseAcc = false;
		}
		if(G_CORE_INIT.isppweb){
			G_CORE_STATIC.xoliStatic("xmpinstall_useppweb",this.sourceId);
		}if(G_CORE_INIT.isUseAcc){
			G_CORE_STATIC.xoliStatic("xmpinstall_useacc",this.sourceId);
			G_CORE_STATIC.setnStat('play_type',30,false);
		}
		instance.isUseAcc = G_CORE_INIT.isUseAcc;
		instance.isppweb = G_CORE_INIT.isppweb;
		instance.flashopen(url,true,urlObj,autoplay);
		/*var cdnUrl = instance.flvExternalCommand('encryptUrl',urlObj);
		if(cdnUrl && G_CORE_INIT.isUseAcc && G_MOVIE_DATA.subtype[index]==1){
			G_CORE_INIT.setVodAcc([this.getGCID(this.playUrl)],[cdnUrl]);
		}
		instance.flashopen(url,true,urlObj,autoplay);
		if(G_CORE_INIT.isUseAcc && G_MOVIE_DATA.subtype[index]==1 && !cdnUrl){
			G_CORE_INIT.setVodAcc([this.getGCID(this.playUrl)],[instance.getPlayUrl()]);
		}*/
	},
	getIndexBySubid:function(subid){
		var index = -1;
		for(var i=0;i<G_MOVIE_DATA.subids.length;i++){
			if(G_MOVIE_DATA.subids[i]==subid){
				return i;
			}
		}
		return index;
	},
	_getInitIndex:function(){
		var index = 0;
		var sns=G_MOVIE_DATA.subnames;
		var tmpIndex=G_MOVIE_DATA.subnames.length;
		var subtypeArr = G_MOVIE_DATA.subtype
		if(typeof subtypeArr!='undefined'){
			for(var i=G_MOVIE_DATA.subnames.length-1;i>=0;i--){
				if(subtypeArr[i]!=3&&subtypeArr[i]!=2){
					tmpIndex = i+1;
					break;
				}
			}
		}
		
		var p1 = /(更新至)([0-9]+)(集|话)/;
		var p2 = /([\d]{4}\-[\d]{1,2}\-[\d]{1,2})(期)/;
		try{
			if(p1.test(G_OTHER_DESC)||p2.test(G_OTHER_DESC)){
				index = this._getLatestSub(sns,tmpIndex,subtypeArr);
			}
		}catch(e){}
		return index;
	},
	_getLatestSub:function(sns,lastIndex,subtypeArr){
		var pd =/\d+/gmi;
		var p=null;
		var last=sns[lastIndex-1];
		var start=lastIndex-1;
		var lastValue="",tmp="";
		lastValue=parseInt(last.match(pd).join(''),10); //new way
		var isPreview = false;
		var previewSub = 0;
		for(var i=start;i>=0;i--){
			tmp = parseInt(sns[i].match(pd).join(''),10); //new way
			if(tmp!=lastValue){
				if(typeof subtypeArr!='undefined'&&(subtypeArr[i]=='3'||subtypeArr[i]=='2')){
					isPreview = true;
					if(previewSub==0){
						previewSub = i+1;
					}
					continue;
				}else{
					return (i+1);
				}
			}
		}
		if(isPreview){
			return previewSub;
		}
		return 0;
	},
	initFirstPlay:function(){
		var index = 0;
		index = this.getInitIndex();
		this.defaultQuality = this.getParameter("quality");
		G_CORE_STATIC.triggerType = 1;
		_G(index);
	},
	getInitIndex:function(){
		var index = 0;
		var subid = this.getParameter("subid");
		if(parseInt(subid)>0){
			index = this.getIndexBySubid(subid);
		}else if(parseInt(G_SUBMOVIEID)>0){
			index = this.getIndexBySubid(G_SUBMOVIEID);
		}else{
			index = this._getInitIndex();
		}
		if(index==-1){
			index = 0;
		}
		return index;
	},
	getNextIndex:function(index){
		var nextIndex = G_CORE_CONTROL.currentIndex+1;
		if(window.G_CORE_TAB&&G_CORE_TAB.isSubInsert){
				if(G_MOVIE_DATA.subtype[G_CORE_CONTROL.currentIndex]>2&&G_MOVIE_DATA.subtype[nextIndex]<3){
					return -1;
				}
				var searchIndex = nextIndex;
				if(G_MOVIE_DATA.subtype[G_CORE_CONTROL.currentIndex]<3&&G_MOVIE_DATA.subtype[nextIndex]>2){
					do{
						var searchIndex = searchIndex+1;
						if(G_MOVIE_DATA.subtype[searchIndex]<3){
							break;
						}
					}while(typeof G_MOVIE_DATA.subids[searchIndex] != 'undefined');
				}
				nextIndex = searchIndex;
		}
		return nextIndex;
	},
	playNext:function(){
		var nextIndex = this.getNextIndex();
		if(typeof G_MOVIE_DATA.subids[nextIndex] != 'undefined'&&typeof G_MOVIE_DATA.subtype[G_CORE_CONTROL.currentIndex]!= 'undefined'&&(G_MOVIE_DATA.subtype[nextIndex]!=3)||(G_MOVIE_DATA.subtype[G_CORE_CONTROL.currentIndex]==G_MOVIE_DATA.subtype[nextIndex])){
			if(G_CORE_CONTROL.isFullscreen){
				G_CORE_STATIC.fullScreen(false);
			}
			G_CORE_STATIC.triggerType = 3;
			//this.trace('G playNext');
			_G(nextIndex,1);
		}else{
			G_CORE_CONTROL.setSubStyle(-1);
		}
	},
	setStat:function(key, value){
		if(key!='ad_type'){
			value=value.toString();
		}
		try{
			G_PLAYER_INSTANCE.setStat(key, value);
		}catch(e){};
	},
	getPredownloadUrl:function(){ 
	},
	getPerdownloadIndex:function(){
		return -1;//nopredownload
	},
	hidePlayer:function(){
		if(this.hideLevel==0){
			try{G_PLAYER_INSTANCE.setFullScreen(false);}catch(e){};
			this.$('_player').style.top = '-2000px';
			if(G_PLAYER_INSTANCE&&G_PLAYER_INSTANCE.getPlayStatus()=='playing'){
				G_PLAYER_INSTANCE.pause();
				this.hidePlaying = true;
			}
		}
		this.hideLevel++;
	},
	showPlayer:function(isForce){
		if(this.hideLevel!=0){
			this.hideLevel--;
		}
		if(this.hideLevel==0||isForce){
			this.$('_player').style.top = '';
			this.hideLevel = 0;
			G_CORE_CONTROL.fireEvent('onPlayerShow');
			if(G_PLAYER_INSTANCE&&G_PLAYER_INSTANCE.getPlayStatus()=='pause'&&typeof this.hidePlaying !='undefined'&&this.hidePlaying){
				G_PLAYER_INSTANCE.play();
				this.hidePlaying = false;
			}
		}
	},
	ADPreDownload:function(){
		if(!G_COMMERCIAL_COMMON.ADPlaying || G_CORE_INIT.isUseAcc || G_CORE_INIT.isppweb){
			return false;
		}
		if(this.currentQuality<0){ //init
			var index = this.getInitIndex();
		}else{
			var index = this.currentIndex;
		}
		var quality = this.getQuality(index);
		var url = G_SUBMOVIE_DATA[index].surls[quality];
		var startpos = parseInt(this.hisMovTiming);
		var substart = G_SUBMOVIE_DATA[index].subStart;
		var subend = G_SUBMOVIE_DATA[index].subEnd;
		try {
			startpos = this.setHistoryTiming(G_COREINNER_HISTORY.getHistory(), startpos);
		}catch(e){}
		if(url){
			G_PLAYER_INSTANCE.put("sMovieName",G_MOVIE_TITLE+'__'+G_MOVIE_DATA.subnames[index]+'__'+(parseInt(quality)+1));
			G_PLAYER_INSTANCE.put("iMovieID",G_HALLID);
			//this.trace(G_SUBMOVIE_DATA[index].sids[quality]);
			G_PLAYER_INSTANCE.put("iSubID",G_SUBMOVIE_DATA[index].sids[quality]);
			G_PLAYER_INSTANCE.preDownload(url);
			G_CORE_STATIC.setnStat('vod_url',url,false);
			G_PLAYER_INSTANCE.setStartMsg(startpos,substart,subend);
		}
	},
	moviePreDownload:function(){
	},
	clearPredownloadInterval:function(){
	},
	getUStatus:function(){
		//G_PLAYER_INSTANCE.trace('getUStatus~');
		var userid = getCookie('userid');
		if(!userid){
			userid = getCookie('luserid');
		}
		if(parseInt(getCookie('isvip'))>0||(parseInt(getCookie('vod_vip'))>0&&getCookie('vod_vip')==userid)){
			//if(getCookie('stick_type')=='kk10'){
				return true;
			//}
		}
		return false;
	},
	formatTimeBySecond:function(timing){
		var timeShow  = '';
		var timeShowH = parseInt(timing/3600);
		var timeShowM = parseInt(timing/60-timeShowH*60);
		var timeShowS = timing%60;
		timeShow += timeShowH > 0  ? (timeShowH < 10 ? '0'+timeShowH : timeShowH)+':' : '';
		timeShow +=(timeShowM < 10 ? '0'+timeShowM : timeShowM)+':';
		timeShow += timeShowS < 10 ? '0'+timeShowS : timeShowS;
		return timeShow;
	},
	setHisMovNoticeTxt:function(type,obj){
		if(!obj||obj.timing==null||parseInt(obj.timing)<=0){return}
		var str = '';
		var timeShow = this.formatTimeBySecond(parseInt(obj.timing));
		if(type=='goOn'){
			str = '自动从您上次观看的'+timeShow+'续播，您也可以<a target="_self" href="javascript:G_PLAYER_INSTANCE.close();G_CORE_CONTROL.playMovie(G_CORE_CONTROL.currentIndex,0);">从头观看</a>';
		}else{
			str = '您上次观看到“'+obj.subname+'”'+timeShow+'，可以<a target="_self" href="javascript:G_CORE_CONTROL.gotoHistoryMovie(G_CORE_CONTROL.getIndexBySubid('+obj.subid+'), '+obj.timing+');">继续观看</a>';
		}
		this.hisMovNoticeTxt = str;
	},
	setHistoryTiming:function(history ,initPos){
		//hisplay mark setHistoryTiming
		var timing = initPos || 0;
		if(this.getParameter("seekpos")>0||timing>0) {
			return timing;
		}
		if(typeof(G_IS_TRAILER)=='undefined' && this.hisMovNoticeShow<0) {
			//非片花页
			if(history.length>0) {
				for(var i = 0; i < history.length; i++) {
					if(history[i].movieid==G_MOVIEID) {
						//有记录
						var tmpTime = parseInt(history[i].timing);
						if(tmpTime>0) {
							if(G_SUBMOVIE_DATA[this.currentIndex].submovieid == history[i].subid) {
								if((G_SUBMOVIE_DATA[this.currentIndex].length - parseInt(history[i].timing)) > 180) {
									timing = tmpTime;
									this.setHisMovNoticeTxt('goOn',{"timing":timing});
								}
							} else {
								this.setHisMovNoticeTxt('tips',history[i]);
							}
						}
						break;
					}
				}//end for
			}
			this.hisMovNoticeShow = 1;
		}
		return timing;
	},
	gotoHistoryMovie:function(index, timing){
		this.hisMovTiming = timing;
		_G.delayCall(0, this, index);
	},
	_GForGotoHistoryMov:function(index){
		G_PLAYER_INSTANCE.close();
		this.playMovie(index, this.hisMovTiming);
		this.hisMovTiming = 0;
		this.fireEvent('onstartplayHistory',index);
		this.setSubStyle.delayCall(0,this,index);
	}
});
var kkCoreServer = KankanCoreObj.extend({
	init: function(){
		this.retryTimes = 0;
		this.hasCdnRes = null;
		this._super();
		if(document.domain=='kankan.com'){
			this.url = 'http://p2s.cl.kankan.com/getCdnresource_flv?gcid=';
		}else{
			this.url = 'http://p2s.cl.kankan.xunlei.com/getCdnresource_flv?gcid=';
		}
		
	},
	getCdnResource:function(gcid){
		this.hasCdnRes = null;
		this.loadJSONDataByTimeslice(this.url+gcid,G_CORE_SERVER.getCdnResourceHandler,[gcid],["jsonObj","jsCheckOutObj"],true,null,15000);
	},
	getCdnResourceHandler:function(){
		var control = G_CORE_CONTROL;
		var args = arguments;
		var json = args[1];
		var jsonCheck = args[0];
		var gcid = args[2];
		if(null!=json&&jsonCheck!=null&&json.cdnlist1.length>0){
			G_CORE_SERVER.hasCdnRes = true;
			var urlObj = {ip:"",port:0,path:"",param1:0,param2:0};
			var list = json.cdnlist1;
			urlObj.ip = list[0].ip;
			urlObj.port = list[0].port;
			urlObj.path = list[0].path;
			urlObj.param1 = jsonCheck.param1;
			urlObj.param2 = jsonCheck.param2;
			control.serverIP = urlObj.ip;
			control.playMode = 1;
			control.showPlayer(true);
			control.serverCorePlay('',urlObj);
			G_CORE_STATIC.xoliStatic("xmpinstall_showplayer",G_CORE_STATIC.sourceId);
			G_CORE_CONTROL.serverIP = urlObj.ip;
			G_CORE_CONTROL.serverGCID = gcid;
		}else{
			G_CORE_SERVER.hasCdnRes = false;
			if(typeof json!='object'||json==null||!json){
				G_CORE_STATIC.xoliStatic("xmpinstall_cdn_error_"+G_CORE_SERVER.retryTimes,G_CORE_STATIC.sourceId);
			}else{
				G_CORE_STATIC.xoliStatic("xmpinstall_cdn_empty",gcid);
			}
			if(G_CORE_INIT.isESourceNoInstall||control.isx64||control.ismac){
				if(typeof args[1]=='string'&&!gcid) gcid = args[1];
				if(G_CORE_SERVER.retryTimes<3&&gcid){
					G_CORE_SERVER.retryTimes++;
					setTimeout( function(){
						G_CORE_SERVER.getCdnResource(gcid);
					},1000);
					return false;
				}
				control.showPlayer(true);
				G_PLAYER_ERROR.dump('100');
				return false;
			}
			if(control.isServerPlay&&control.lastError){
				G_PLAYER_ERROR.dump(control.lastError);
				control.lastError = null;
				return false;
			}
			if(control.fixServerPlay){
				control.fixServerPlay = false;
				G_CORE_INIT.isNoComponent = false;
				control.showPlayer(true);
				control.play(G_CORE_CONTROL.currentIndex);
				return false;
			}
			/*if(G_CORE_INIT.isUseAcc){
				G_CORE_INIT.isUseAcc = false;
				control.showPlayer(true);
				control.play(G_CORE_CONTROL.currentIndex);
				return false;
			}*/
			control.playMode = 0;
			hide_kk_player();
			//G_CORE_STATIC.xoliStatic("xmpinstall_show",false);

		}
	}
	
});
var KKCoreStatic = KankanCoreObj.extend({
	init: function(){
		this._super();
		this.statBuffer = {};
		this.bufTime = 0;
		this.seek = 0;
		this.seekCalc = false;
		this.seekTimePoint = 0;
		this.seekTimeSum = 0;
		this.pause = 0;
		this.pauseCalc = false;
		this.pauseTimePoint = 0;
		this.pauseTimeSum = 0;
		this.ad = 0;
		this.triggerType = 4; 
		this.triggerTypeLast = 4; 
		this.staticData = {session_id:0};
		this.isServer = false;
		this.isBufferSend = false;
		this.processEvent.delayCall(0,this);
		this.initTick = new Date().getTime();
		this.userStatus = 1;
		this.userid = 0;
		//3001 mark init
		this.isFirstPlay = false;
		this.bufPos = 0;
		if(typeof G_OPEN_TICK!='undefined'){
			this.pageOpenTick = G_OPEN_TICK;
		}else{
			this.pageOpenTick = 0;
		}
		this.bufferData = {position:-1,tick:-1,bufferSpeed:[-1],dataStart:-1};
		this.bufSeekObj = {num:0,bufferTime:0,calc:false,startTick:0,lastTime:-1};
		this.speedObj = {num:0,sum:0};
	},
	processEvent: function(){
		var con = G_CORE_CONTROL;
		window.attachEvent("onload", function(){G_CORE_STATIC.setnStat('page_loaded_tick',null,true);});
		window.attachEvent("onunload",G_CORE_STATIC.f_unload);
		con.attachEvent(this,'onPause',this.f_onPause);
		con.attachEvent(this,'onCommonPlaying',this.f_onplaying);
		con.attachEvent(this,'onBuffering',this.f_onbuffering);
		con.attachEvent(this,'onSeek',this.f_onseek);
		con.attachEvent(this,'onStop',this.f_onstop);
		con.attachEvent(this,'onCommonOpen',this.f_onopen);
		con.attachEvent(this,'onStickOver',this.f_onstickover);
		con.attachEvent(this,'onOneStickOver',this.f_ononestickover);
		//con.attachEvent(this,'onopen',G_CORE_STATIC.f_onopen);
		con.attachEvent(this,'onplaying',this.f_onplaying);
		
		con.attachEvent(this,'onstartplay',this.f_coreplay);
		//3001 mark processEvent
		con.attachEvent(this,'onFirstPlaying',this.f_onfirstplay);
		con.attachEvent(this,'onDragSeekEnd',this.f_onDragSeekEnd);
		
	},
	f_onDragSeekEnd:function(){
		if(G_CORE_STATIC.dragCalc){
			G_CORE_STATIC.dragTimeSum += Math.max(G_CORE_STATIC.time()-G_CORE_STATIC.dragTimePoint,0);
			G_CORE_STATIC.setnStat('drag_time',G_CORE_STATIC.dragTimeSum,false);
			G_CORE_STATIC.dragCalc = false;
			G_CORE_STATIC.dragTimePoint = 0;
		}
	},
	f_onopen:function(){
		if(G_CORE_INIT.isUseAcc){
			var mode = G_PLAYER_INSTANCE.pobject.flv_get('vpMode');
			if(G_CORE_STATIC.staticData.play_type>=30&&G_CORE_STATIC.staticData.play_type<40){
				G_CORE_STATIC.setnStat('play_type',30 + parseInt(mode) + 1,false);
			}else if(G_CORE_STATIC.staticData.play_type>=40&&G_CORE_STATIC.staticData.play_type<50){
				G_CORE_STATIC.setnStat('play_type',40 + parseInt(mode) + 1,false);
			}
		}
		if(!G_CORE_INIT.isNoComponent&&!G_CORE_CONTROL.isServerPlay&&!G_CORE_CONTROL.fixServerPlay){
			this.initBuffer();
		}
		this.setnStat('req_data_tick',null,true);
		this.player_last_event='onopen';

		this.setStatusEnd('onopen');
		this.trace('host_prog:'+G_PLAYER_INSTANCE.getnStat('host_prog'));
		this.trace('disk_info:'+G_PLAYER_INSTANCE.getnStat('disk_info'));
		if(G_CORE_INIT.isNoComponent&&G_CORE_CONTROL.serverIP&&G_CORE_CONTROL.serverGCID){
			this.speedUpdate.delayCall(1000,this);
		}
	},
	f_onPause:function(){
		this.pause++;
		this.setnStat('pause_times',this.pause,false);
		this.setnStat('pause_tick',null,true);
		this.pauseCalc = true;
		this.pauseTimePoint = this.time();
		this.player_last_event='onpause';
		this.setStatusEnd('onpause');
	},
	f_onplaying:function(){
		if(G_CORE_INIT.isUseAcc){
			var mode = G_PLAYER_INSTANCE.pobject.flv_get('vpMode');
			if(G_CORE_STATIC.staticData.play_type>=30&&G_CORE_STATIC.staticData.play_type<40){
				G_CORE_STATIC.setnStat('play_type',30 + parseInt(mode) + 1,false);
			}else if(G_CORE_STATIC.staticData.play_type>=40&&G_CORE_STATIC.staticData.play_type<50){
				G_CORE_STATIC.setnStat('play_type',40 + parseInt(mode) + 1,false);
			}
		}
		this.player_last_event='onplaying';
		this.setStatusEnd('onplaying');
		this.bufferData = {position:-1,tick:-1,bufferSpeed:[-1],dataStart:-1,sendposS:-1};
		
	},
	f_onbuffering:function(){
		this.setnStat('play_interrupt_times',G_PLAYER_INSTANCE.bufferTimes,false);
		//3001 mark f_onbuffering
		this.bufPos = parseInt(G_PLAYER_INSTANCE.getPlayPosition());
		if(this.seekCalc){
			this.player_last_event='onbuffering_seek';
		}else if(this.isBufferCalc){
			this.setnStat('play_interrupt_tick',null,true);
			this.player_last_event='onbuffering_interrupt';
		}else{
			this.player_last_event='onbuffering';
		}
		this.setStatusEnd('onbuffering');
		if(G_CORE_INIT.isNoComponent||G_CORE_CONTROL.isServerPlay||G_CORE_CONTROL.fixServerPlay){return false;}
		this.initBuffer();
		this.trace('sysSpace:'+G_PLAYER_INSTANCE.getSystemFreeSpace());
		
	},
	f_onseek:function(){
		var pos = G_PLAYER_INSTANCE.getPlayPosition(true)*100;
		if(G_PLAYER_INSTANCE.downPos.lastDrag>0&&pos>G_PLAYER_INSTANCE.downPos.lastDrag+200){//2 percent
			if(this.bufSeekObj.lastTime!=0){
				this.bufSeekObj.num++;
			}
			this.bufSeekObj.calc = true;
			this.bufSeekObj.startTick = this.time();
			this.bufSeekObj.lastTime = 0;
		}
		G_PLAYER_INSTANCE.downPos.lastDrag = 0;
		this.seek++;
		this.setnStat('drag_times',this.seek,false);
		this.seekCalc = true;
		this.seekTimePoint = this.time();
		this.player_last_event='onseek';
		this.setStatusEnd('onseek');
		this.setnStat('drag_buffer_tick',null,true);
	},
	f_onstop:function(){
		this.setnStat('movie_stop_tick',null,true);
		if(this.player_last_event!='onerr'||this.player_last_event!='onend'){
			this.player_last_event='onstop';
		}
		this.setStatusEnd('onstop');
	},
	f_onend:function(){
		this.player_last_event='onend';
		this.setnStat('movie_stop_tick',null,true);
		this.setStatusEnd('onend');
	},
	f_onstickover:function(){
		this.setnStat('ad_stop_tick',null,true);
		this.adFinish ++;
		this.player_last_event='onplayad_'+this.ad+'_'+this.adFinish;
	},
	f_ononestickover:function(obj,event,isNormal,value){
		if(typeof isNormal!='undefined'&&!isNormal){
			if(typeof value!='undefined'&&value>0){
				this.setnStat('ad_play_timeout',parseInt(value)+1,false);
			}else{
				this.setnStat('ad_play_timeout',null,true);
			}
		}
	},
	f_coreplay:function(){
		this.setChannelId();
	},
	f_onfirstplay:function(){
		//3001 mark f_onfirstplay
		this.isFirstPlay = true;
		
		var url = "http://kkpgv2.xunlei.com/?u=vodstart&u1=play&u2="+G_CORE_STATIC.staticData.peerid+"&u3="+G_CORE_STATIC.staticData.session_id+"&u4="+this.getGCID(G_SUBMOVIE_DATA[G_CORE_CONTROL.currentIndex].surls[G_CORE_CONTROL.currentQuality])+"&rd="+new Date().getTime();
		this.mStatSend(url);
	},

	setStatusEnd:function(event){
		if(this.pauseCalc&&event!='onpause'){
			this.pauseTimeSum += Math.max(this.time()-this.pauseTimePoint,0);
			this.setnStat('pause_time',this.pauseTimeSum,false);
			this.pauseCalc = false;
			this.pauseTimePoint = 0;
			this.setnStat('pause_tick',0,false);
		}
		if(G_PLAYER_INSTANCE.isBufferCalc&&event!='onbuffering'){
			//3001 mark setStatusEnd
			var thisBufTime = Math.max(this.time()-G_PLAYER_INSTANCE.bufferBeginTime,0);
			G_PLAYER_INSTANCE.isBufferCalc = false;
			this.bufTime = this.bufTime+ thisBufTime;
			this.setnStat('play_interrupt_time',this.bufTime,false);
			this.setnStat('play_interrupt_tick',0,false);
			if(this.player_last_event == "onplaying") {
				if(this.isFirstPlay) {
					this.setnStat('fisrt_interrupt_tick',G_PLAYER_INSTANCE.bufferBeginTime,false);
					this.setnStat('first_interrupt_playpos',this.bufPos,false);
					this.setnStat('first_interrupt_buf_time',thisBufTime,false);
					this.isFirstPlay = false;
				}
				this.setnStat('last_interrupt_tick',G_PLAYER_INSTANCE.bufferBeginTime,false);
				this.setnStat('last_interrupt_playpos',this.bufPos,false);
				this.setnStat('last_interrupt_buf_time',thisBufTime,false);
			}
			G_PLAYER_INSTANCE.bufferBeginTime = 0;
		}
		if(this.seekCalc&&event!='onbuffering'&&event!='onseek'){
			this.seekTimeSum += Math.max(this.time()-this.seekTimePoint,0);
			this.setnStat('drag_buffer_time',G_CORE_STATIC.seekTimeSum,false);
			this.seekCalc = false;
			this.seekTimePoint = 0;
			this.setnStat('drag_buffer_tick',0,false);
			if(this.bufSeekObj.calc){
				this.bufSeekObj.bufferTime += (this.time() - this.bufSeekObj.startTick);
				this.bufSeekObj.lastTime = (this.time() - this.bufSeekObj.startTick);
				this.bufSeekObj.calc = false;
				this.bufSeekObj.startTick = 0;
			}
			this.fireEvent('onSeekEnd');
		}
	},
	initBuffer:function(){
		this.bufferData = {position:-1,tick:-1,bufferSpeed:[-1],dataStart:-1,sendposS:-1};
		this.bufferData.tick = this.time();
		this.bufferData.position =  parseInt(G_PLAYER_INSTANCE.getPlayPosition());
		this.bufferData.dataStart = G_PLAYER_INSTANCE.pobject.flv_getStreamBytesLoaded();
		this.bufferData.sendposS = G_PLAYER_INSTANCE.getnStat('svr_send_pos');
	},
	isEmptyObject: function(obj){
		for(var name in obj){
			return false;
		}
		return true;
	},
	time: function(){
		return new Date().getTime();
	},
	send: function(u){
		this.mStatSend(u);
	},
	sendkkpgv:function(u){
		var v = arguments;
		var url = "http://kkpgv2.xunlei.com/?u=vodact&u1="+v[0]+"&u2="+(v[1]||'')+'&u3='+(v[2]||'')+'&u4='+(v[3]||'')+"&rd="+this.time();
		this.send(url);
	},
	jsSend:function(url){
		var s = $C("script");
		s.type="text/javascript";
		s.language="javascript";
		s.lang="zh-cn";
		s.src=url;
		$P(s, document.getElementsByTagName("head")[0]||null)
		s.attachEvent("onreadystatechange",function(){
			var state = s.readyState;
			if("loaded"==state || "complete"==state){
			try{$R(s,document.getElementsByTagName("head")[0]||null);}catch(e){}
				s=null;
			}
		});
	},
	sendKkpgvStrict:function(u){
		var url = "http://kkpgv.xunlei.com/?u=kankan_4_0_"+u+"_51&rd="+this.time();
		this.jsSend(url);
	},
	xoliStatic:function(key,value,value2){
		var u3='';
		if(key=='xmpinstall_install_error_testFileFailed'||key=='xmpinstall_install_error_downloadError'||key=='xmpinstall_install_error_installError'){
			var err_times = this.getCookie('ins_err');
			if(err_times){
				err_times = parseInt(err_times)+1;
			}else{
				err_times = 1;
			}
			this.setCookieWithDomain('ins_err',err_times,720,this.subDomain);
			u3 = "&u3="+err_times;
		}
		var u4="";
		if(value2){
			u4 = "&u4="+value2;
		}
		if(value){
			var str="http://kkpgv2.xunlei.com/?u=xoli&u1="+key+"&u2="+value+u3+u4+"&rd="+Math.random();
		}else{
			var str="http://kkpgv2.xunlei.com/?u=xoli&u1="+key+"&u2="+u3+u4+"&rd="+Math.random();
		}
		G_CORE_STATIC.jsSend(str);
	},
	setWebuid:function(){
		if(typeof hex_md5=='function'){
			var random = Math.random();
			var browser = navigator['appName'] + '_' + navigator['appVersion'] + '_' + navigator['userAgent'] + '_' + navigator['appCodeName'] + '_' + navigator['platform'] ;
			var nowtime = new Date() ;
			var nowtime_sec = nowtime.valueOf() ;
			var kankan_web_uid = (nowtime_sec + browser + random).hex_md5() ;
			setCookie("KANKANWEBUID" , kankan_web_uid , 24*365*10) ;
		}else{
			var kankan_web_uid = 'cc007'+ this.time()+this.rand(1000000,9999999)+this.rand(1000000,9999999);
			setCookie("KANKANWEBUID" , kankan_web_uid , 24*365*10);
		}
	
	},
	startnStat:function(isServer){
		this.sendnStat(isServer);
		var p = G_PLAYER_INSTANCE;
		this.fsTime = 0;
		this.exf = 0;
		this.enf = 0;
		this.bufTime = 0;
		this.seek = 0;
		this.seekCalc = false;
		this.seekTimePoint = 0;
		this.seekTimeSum = 0;
		this.pause = 0;
		this.pauseCalc = false;
		this.pauseTimePoint = 0;
		this.pauseTimeSum = 0;
		this.dragCalc = false;
		this.dragTimePoint = 0;
		this.dragTimeSum = 0;
		this.accStatusTimes = 0;
		this.ad = 0;
		this.staticData = {session_id:0,req_start_tick:'0',ad_start_tick:'0',ad_stop_tick:'0',movie_start_tick:'0',movie_stop_tick:'0',buff_end_tick:'0',fullscreen_time:'0',full_to_nor_times:'0',nor_to_full_times:'0',play_interrupt_times:'0',play_interrupt_time:'0',drag_times:'0',drag_time:'0',drag_buffer_time:'0',pause_times:'0',pause_time:'0',movie_id:'null',sub_id:'0',moviesource_id:'0',player_type:'0',channel_id:'0',trigger_type:'0',play_type:'0',movie_format:'0',movie_definition:'0',flashplayer_ver:'null',web_url:'null',ref_url:'null',peerid:'null',svr_type:'null',buildver:'null',thunderup_begin_tick:'null',thunderup_end_tick:'null',req_data_tick:'null',stream_ver:'null',req_play_tick:0,req_data_tick:0,first_refer:'null',peerid:'null',svr_type:'null',buildver:'null',thunderup_begin_tick:0,thunderup_end_tick:0,stream_ver:'null',vod_url:'null',ad_url:'null',ad_play_times:0,movie_length:0,user_status:0,page_open_tick:0,player_loaded_tick:0,page_loaded_tick:0,userid:0,acc_status:0,acc_status1:0,acc_status2:0,acc_status_times:0,acc_error:'null',acc_bytes_p2s:0,acc_bytes_p2p:0,ad_play_timeout:0};
		this.isServer = false;
		this.player_last_event = 'init';
		//3001 mark startnStat
		this.isFirstPlay = false;
		this.bufPos = 0;
		this.bufSeekObj = {num:0,bufferTime:0,calc:false,startTick:0};
		
		if(!this.getCookie('KANKANWEBUID')){
			this.setWebuid();
		}
		this.setnStat('session_id',this.getCookie('KANKANWEBUID'));
		if(this.getCookie('f_refer')){
			this.setnStat('first_refer',this.getCookie('f_refer'));		
		}
		if(!this.isEmptyObject(this.statBuffer)){
			this.isBufferSend = true;
			for(var s in this.statBuffer){
				if(typeof this.statBuffer[s] =='string'||typeof this.statBuffer[s] =='number')
				this.setnStat(s,this.statBuffer[s]);
			}
			this.statBuffer = {};
			
		}
		this.setnStat('req_start_tick',null,true);

		var id = this.getParameter("id")||getCookie("qs_id")||3;
		var u = this.getParameter("u")||getCookie("qs_u")||0;
		this.setnStat('moviesource_id',id,false);
		this.setnStat('player_type',2,false);

		this.setnStat('movie_format',G_CORE_INIT.isUseAcc?G_CORE_INIT.verKanKanLite:2,false);
		this.setnStat('flashplayer_ver',G_CORE_INIT.getFlashVer().join('.'),false);
		this.setnStat('web_url',window.location.href,false);
		if(G_CORE_INIT.playerLoadedTick&&G_CORE_INIT.playerLoadedTick>0){
			G_CORE_STATIC.setnStat('player_loaded_tick',G_CORE_INIT.playerLoadedTick,false);
			G_CORE_INIT.playerLoadedTick = 0;
		}
		if(document.referrer){
			this.setnStat('ref_url',document.referrer,false);
		}
		
		this.setnStat('trigger_type',this.triggerType,false);
		this.triggerTypeLast = this.triggerType;
		this.triggerType = 4;//hand
		this.staticData.peerid=this.getPeerID();
		this.setnStat('page_open_tick',this.pageOpenTick,false)
		this.setnStat('user_status',this.userStatus,false);
		this.setnStat('userid',this.userid,false);
		this.speedObj = {num:0,sum:0};

		
	},
	setnStat:function(key,value,isTime){
		var staticData = this.staticData;
		if(staticData.movie_start_tick==0&&key=='movie_stop_tick'){
			return false;
		}
		if(!this.isBufferSend){
			if(isTime)
				this.statBuffer[key] = this.time();
			else
				this.statBuffer[key] = value;
		}
		if(key == 'userid'){
			value *= 1;
		}
		if(typeof G_PLAYER_INSTANCE=='undefined'||!G_PLAYER_INSTANCE){
			
		}else{
			if(isTime)
				G_PLAYER_INSTANCE.setnStat(key,this.time());
			else
				G_PLAYER_INSTANCE.setnStat(key,value);
		}
		if(isTime)
			this.staticData[key] = this.time();
		else
			this.staticData[key] = value;
		if(!this.getCookie('KANKANWEBUID')){
			this.setWebuid();
		}
		if(G_PLAYER_INSTANCE && G_PLAYER_INSTANCE.setFlvStat){
			G_PLAYER_INSTANCE.setFlvStat(key,value);
		}
	},
	sendnStat:function(isServer){
		if(this.isServer||isServer||G_CORE_INIT.isNoComponent||G_CORE_CONTROL.isServerPlay||G_CORE_CONTROL.fixServerPlay){
			G_CORE_STATIC.sendnStatServer();
			
		}else{
			G_PLAYER_INSTANCE.sendnStat();
			if(!G_CORE_INIT.isNoComponent&&G_CORE_STATIC.staticData.movie_start_tick>0){
				G_CORE_STATIC.sendkkpgv('datadrag',G_CORE_STATIC.bufSeekObj.num+'',G_CORE_STATIC.bufSeekObj.bufferTime+'',G_CORE_STATIC.staticData.session_id);
			}
		}
	},
	f_unload:function(){
		G_CORE_STATIC.setnStat('player_last_event',G_CORE_STATIC.player_last_event,false);
		if(G_CORE_STATIC.isServer){
			G_CORE_STATIC.sendnStatServer();
		}
		if(!G_CORE_INIT.isNoComponent){
			G_CORE_STATIC.sendkkpgv('datadrag',G_CORE_STATIC.bufSeekObj.num+'',G_CORE_STATIC.bufSeekObj.bufferTime+'',G_CORE_STATIC.staticData.session_id);
		}
		/*var closeTick = G_CORE_STATIC.time();
		var url = 'http://kkpgv2.xunlei.com/?u=vodtimepv&u1='+encodeURIComponent(window.location.href)+'&u2='+G_CORE_STATIC.getCookie('KANKANWEBUID')+'&u3='+G_CORE_STATIC.getPeerID()+'&u4='+G_MOVIE_TYPE+'&u5='+G_CORE_STATIC.initTick+'&u6='+closeTick;
		G_CORE_STATIC.send(url);*/
	},
	sendnStatServer:function(){
		var staticData = this.staticData;
		if(staticData.session_id!=0){
			if(staticData.movie_start_tick>0&&staticData.movie_stop_tick==0){
				G_CORE_STATIC.setnStat('movie_stop_tick',null,true);
			}
			var u1_arr = [staticData.session_id];
			var u2_arr = [staticData.req_start_tick,staticData.ad_start_tick,staticData.ad_stop_tick,staticData.movie_start_tick,staticData.movie_stop_tick,staticData.buff_end_tick];
			var u3_arr = [staticData.fullscreen_time,staticData.full_to_nor_times,staticData.nor_to_full_times];
			var u4_arr = [staticData.play_interrupt_times,staticData.play_interrupt_time,staticData.drag_times,staticData.drag_time,staticData.drag_buffer_time,staticData.pause_times,staticData.pause_time];
			var u5_arr = [staticData.movie_id,staticData.sub_id,staticData.moviesource_id,staticData.player_type,staticData.channel_id,staticData.trigger_type,staticData.play_type,staticData.movie_format,staticData.movie_definition];
			var u6_arr = [staticData.flashplayer_ver];
			var u7_arr = [encodeURIComponent(staticData.web_url)]; //u
			var u8_arr = [encodeURIComponent(staticData.ref_url),staticData.user_status,staticData.page_open_tick,staticData.player_loaded_tick,staticData.page_loaded_tick,staticData.userid,staticData.acc_status,staticData.acc_status1,staticData.acc_status2,staticData.acc_status_times,encodeURIComponent(staticData.acc_error),staticData.acc_bytes_p2s,staticData.acc_bytes_p2p];
			var u9_arr = [staticData.peerid,staticData.req_play_tick,staticData.req_data_tick,encodeURIComponent(staticData.first_refer),staticData.vod_url,staticData.ad_url,staticData.ad_play_times,staticData.movie_length,staticData.ad_play_timeout];
			var url = 'http://kkpgv2.xunlei.com/?u=svod&u1='+u1_arr.join(',')+'&u2='+u2_arr.join(',')+'&u3='+u3_arr.join(',')+'&u4='+u4_arr.join(',')+'&u5='+u5_arr.join(',')+'&u6='+u6_arr.join(',')+'&u7='+u7_arr.join(',')+'&u8='+u8_arr.join(',')+'&u9='+u9_arr.join(',');
			this.send(url);
		}
		if(G_CORE_INIT.isNoComponent&&G_CORE_CONTROL.serverIP&&G_CORE_CONTROL.serverGCID&&this.speedObj.num>0){
			var u6=G_PLAYER_INSTANCE.flvGet('ppwebUse')?'12':'11';
			var url = 'http://kkpgv2.xunlei.com/?u=p2sspeed&u1='+parseInt(this.speedObj.sum/this.speedObj.num)+'&u2='+this.speedObj.num+'&u3='+G_CORE_CONTROL.serverIP+'&u4='+G_CORE_CONTROL.serverGCID+'&u5='+staticData.session_id+'&u6='+u6+'&rd='+this.time();
			this.send(url);
			G_CORE_CONTROL.serverIP = '';
			G_CORE_CONTROL.serverGCID = '';
		}
	},
	setChannelId:function(){
		var channelId = 0;
		if(G_MOVIE_TYPE=='movie'){
			channelId = 1
		}else if(G_MOVIE_TYPE=='teleplay'){
			channelId = 2;
		}else if(G_MOVIE_TYPE=='tv'){
			channelId = 3;
		}else if(G_MOVIE_TYPE=='anime'){
			channelId = 4;
		}else if(G_MOVIE_TYPE=='documentary'){
			channelId = 6;
		}else if(G_MOVIE_TYPE=='push'){
			channelId = 7;
		}else if(G_MOVIE_TYPE=='lesson'){
			channelId = 8;
		}else if(G_MOVIE_TYPE=='vmovie'){
			channelId = 9;
		}
		if(typeof G_IS_TRAILER!='undefined'&&G_IS_TRAILER){
			channelId = 5;
		}
		if(typeof G_MOVIE_DATA.subtype!='undefined'&&G_MOVIE_DATA.subtype[G_CORE_CONTROL.currentIndex]!=1){
			channelId = 5;
		}
		this.setnStat('channel_id',channelId,false);
	},
	speedUpdate:function(){
		var speed = G_PLAYER_INSTANCE.pobject.getDownloadSpeed();
		if(speed>0){
			this.speedObj.num++; 
			this.speedObj.sum += speed; 
		}
		if(G_CORE_INIT.isNoComponent&&G_CORE_CONTROL.serverIP&&G_CORE_CONTROL.serverGCID){
			this.speedUpdate.delayCall(30000,this);
		}
		
		//G_CORE_CONTROL.serverIP = urlObj.ip;
		//G_CORE_CONTROL.serverGCID = gcid;
	}
});
var KKCoreInstall = KankanCoreObj.extend({
	init: function(){
		this._super();
		this.extLoaded = false;
		this.triggerType = 0; //0-no com 1-update 2-error
	},
	init2:function(){
		if(typeof this.init2Ext!='function'){
			this.init2.delayCall(1000,this);
		}else{
			this.init2Ext();
		}
	},
	initBaseObj:function(){
		this.baseObj = null;
		try{this.baseObj = new ActiveXObject('xoli.xoliimpl')}catch(e){}
	}
});
var KKCoreSubmovieCtr = KankanCoreObj.extend({
	init: function(){
		this._super();
		this.preDownloadFaild=0;//预加载json失败次数
		this.preDownloadIndex=0;//预加载子集数
		this.pathURL="http://kankan.xunlei.com/vod/mp4/";//子集播放页路径
		this.dataURL="http://api.movie.kankan.com/vodjs/subdata/";//子集json数据路径
		this.moviedataURL="http://api.movie.kankan.com/vodjs/moviedata/";
		this.targetIndex = 0;
	},
	getSubData:function(index,callback){
		this.trace('getSubData :'+index);
		this.loadJSDataByTimeslice(this.dataURL+Math.floor(parseInt(G_MOVIEID)/1000)+"\/"+G_MOVIEID+"\/"+G_MOVIE_DATA.subids[index]+"\.js", G_CORE_SUBMOVIECTR.getSubDataSuccess, [callback,index], true, 4000);
	},
	getSubDataSuccess:function(obj,callback,index){
		if(typeof index!='undefined'&&index>=0){
			G_CORE_SUBMOVIECTR.targetIndex = index;
		}else{
			G_CORE_SUBMOVIECTR.targetIndex = G_CORE_CONTROL.currentIndex;
		}
		var recall="if(typeof submoviedata_"+G_MOVIE_DATA.subids[G_CORE_SUBMOVIECTR.targetIndex]+"!= 'undefined')";
		recall+="G_SUBMOVIE_DATA[G_CORE_SUBMOVIECTR.targetIndex]=submoviedata_"+G_MOVIE_DATA.subids[G_CORE_SUBMOVIECTR.targetIndex];
		eval(recall);

		if(typeof G_SUBMOVIE_DATA[G_CORE_SUBMOVIECTR.targetIndex].submovieid != 'undefined'){
			if(typeof callback =='function'){
				if(callback==G_CORE_CONTROL.play){
					G_CORE_CONTROL.play(G_CORE_SUBMOVIECTR.targetIndex);
					G_CORE_SUBMOVIECTR.trace('getSubDataSuccess : play '+G_CORE_SUBMOVIECTR.targetIndex);
					return true;
				}else if(callback==G_CORE_CONTROL.playMovie){
					G_CORE_CONTROL.playMovie(G_CORE_SUBMOVIECTR.targetIndex);
					G_CORE_SUBMOVIECTR.trace('getSubDataSuccess : playMovie '+G_CORE_SUBMOVIECTR.targetIndex);
					return true;
				}
			}
			_G(G_CORE_SUBMOVIECTR.targetIndex);
			G_CORE_SUBMOVIECTR.trace('getSubDataSuccess : G '+G_CORE_SUBMOVIECTR.targetIndex);
		}else{
			G_CORE_SUBMOVIECTR.trace('getSubDataSuccess:SubDataEmpty');
			window.location.href="http://vod.kankan.com/v/"+Math.floor(parseInt(G_MOVIEID)/1000)+"\/"+G_MOVIEID+"\/"+G_MOVIE_DATA.subids[G_CORE_SUBMOVIECTR.targetIndex]+"\.shtml?stopre=1";
		}
	},
	preDownload:function(){ //bk
	},
	loadMovieData:function(movieid,callback){
		var args = arguments;
		this.loadJSData(this.moviedataURL+'/'+Math.floor(movieid/1000)+'/'+movieid+'.js',callback,args,false);
	},
	loadSubData:function(isNormal,nextIndex,submovieid,callback){
		var args = arguments;
		this.loadJSData(this.dataURL+Math.floor(parseInt(G_MOVIEID)/1000)+"\/"+G_MOVIEID+"\/"+submovieid+"\.js",G_CORE_SUBMOVIECTR.loadSubDataHandler,args,false);
	},
	loadSubDataHandler:function(){
		var args = arguments;
		var isNormal = args[0];
		var index = args[1];
		var submovieid = args[2];
		if(isNormal){
			var recall="if(typeof submoviedata_"+submovieid+"!= 'undefined')";
			recall+="G_SUBMOVIE_DATA["+index+"]=submoviedata_"+submovieid;
			eval(recall);
		}else{
			var recall="if(typeof submoviedata_"+submovieid+"!= 'undefined')";
			recall+="G_CORE_PREDOWNLOAD.predownSubData.subdata["+index+"]=submoviedata_"+submovieid;
			eval(recall);
		}
		var callback = args[3];
		callback.apply(null, [args[4],args[5],args[6]]);
	}
});
var kkCoreHistory = KankanCoreObj.extend({
	init: function(){
		this._super();
		this.itemChar="@@";
		this.groupChar="|";
		
	},
	getHistory:function(){
		var latest=this.getLatestInfo();
		var items=this.getInfo();
		if(!latest){
			return false;
		}else if(!latest.movie_id){
			return false;
		}
		return items;
	},
	getLatestInfo:function(){
		var group = this.getInfo();
		if(group.length>0){
			return group[0];
		}else{
			return null;
		}
	},
	getInfo:function(){
		this.checkInfoFormat();
		var info = this.readInfo();
		var group = this.string2Array(info,this.groupChar);
		var size = group.length;
		var tmp = [];
		for(var i=0;i<size;i++){
			if(group[i]!=''){
				tmp.push(this.formatInfo(group[i]));
			}
		}
		return tmp;
	},
	readInfo:function(str){
		return ioCtrl.ioReader("view_histroy");
	},
	checkInfoFormat:function(){
		var info = this.readInfo();
		var group = this.string2Array(info,this.groupChar);
		var items = [];
		if(group.length > 0){
			items = this.string2Array(group[0],this.itemChar);
			if(items.length < 6){
				return false;
				//this.writeInfo("");
			}
		}
	},
	formatInfo:function(info){
		var items=this.string2Array(info,this.itemChar);
		var size=items.length;
		if(size>10){
			var obj = {isLatest:true,movie_id:items[0],time:items[1],movie_name:decodeURI(items[2]),cp:items[3],ext:items[4],type:items[5],subid:items[6],subname:decodeURI(items[7]),nextid:items[8],nextname:decodeURI(items[9]),movieid:items[10],movietype:items[11],subnum:items[12],timing:items[13]};
			if(size>=20){
				obj.quality=items[19];
			}
			return obj;
		}else if(size>6){
			return {isLatest:true,movie_id:items[0],time:items[1],movie_name:decodeURI(items[2]),cp:items[3],ext:items[4],type:items[5],subid:items[6],subname:decodeURI(items[7]),nextid:items[8],nextname:decodeURI(items[9])};
		}else{
			return {isLatest:false,movie_id:items[0],time:items[1],movie_name:decodeURI(items[2]),cp:items[3],ext:items[4],type:items[5]};
		}
	}

});
function _G(index){
	if(G_CORE_CONTROL.playLock){
			return;
	}
	if(typeof G_SUBMOVIE_DATA[index].submovieid != 'undefined'){
		try{G_CORE_STATIC.startnStat(false);}catch(e){};
		G_CORE_CONTROL.currentIndex=index;
		//hisplay mark _G
		if(G_CORE_CONTROL.hisMovTiming>0) {
			try{G_CORE_CONTROL._GForGotoHistoryMov(index);}catch(e){G_CORE_CONTROL.play(index);}
		} else {
			G_CORE_CONTROL.play(index);
		}
	}else{
		G_CORE_CONTROL.currentIndex=index;
		G_CORE_SUBMOVIECTR.getSubData(index);
	}
	try{
		G_PLAYER_INSTANCE.closeNotice();
	}catch(e){};
	return;
}
function show_kk_player(){
	G_CORE_CONTROL.showPlayer();
}
function hide_kk_player(){
	G_CORE_CONTROL.hidePlayer();
}


var G_CORE_SUBMOVIECTR = new KKCoreSubmovieCtr();
var G_CORE_CONTROL = new kkCoreControl();
var G_CORE_STATIC = new KKCoreStatic();
var G_CORE_COMMON = G_CORE_CONTROL;
var G_CORE_INSTALL = new KKCoreInstall();
var G_CORE_SERVER = new kkCoreServer();
//var G_PLAYER_INSTANCE = new kkPlayer.Player();
var G_COREINNER_HISTORY = new kkCoreHistory();

G_LOAD_COMPLETE = 1;


function $C(tagName){
	return G_CORE_CONTROL.$C(tagName);
}
function $P(child,parent){
	return G_CORE_CONTROL.$P(child,parent);
}
function $R(child,parent){
	return G_CORE_CONTROL.$R(child,parent)
}

function loadJSData(url, handler, args, isDestory ,charset){
	return KankanCoreObj.prototype.loadJSData(url, handler, args, isDestory ,charset)
}

function loadJSDataByTimeslice(url, handler, args, isDestory, interval){
	return KankanCoreObj.prototype.loadJSDataByTimeslice(url, handler, args, isDestory, interval);
}
function loadJSONDataByTimeslice(url, handler, args, responseObj, isDestory, _parent, interval){
	return KankanCoreObj.prototype.loadJSONDataByTimeslice(url, handler, args, responseObj, isDestory, _parent, interval);
}
function loadJSONData(url, handler, args, responseObj, isDestory, _parent){
	return KankanCoreObj.prototype.loadJSONData(url, handler, args, responseObj, isDestory, _parent);
}
function getParameter(name){
	return KankanCoreObj.prototype.getParameter(name);
}
function getCookie(name){
	return G_CORE_CONTROL.getCookie(name);
}
function setCookie(name,value,hours){
	return G_CORE_CONTROL.setCookie(name,value,hours);
}
function setCookieWithDomain(name, value, hours,domain) {
	return G_CORE_CONTROL.setCookieWithDomain(name, value, hours,domain);
}
var G_CORE_DEBUG = {trace:function(){}};
kkCore.Init = kkCoreInit;