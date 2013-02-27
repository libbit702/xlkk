define(function(){
	var ioCtrl = {
		ver:0,
		_isGet:false,
		dapctrl:null,
		getDapctrl:function(){
			this._isGet = true;
			if(this.dapctrl){
				return this.dapctrl;
			}else{
				if(window.G_DAPCTRL){
					this.dapctrl = window.G_DAPCTRL;
					return this.dapctrl;
				}else if(window.G_PLAYER_INIT&&window.G_PLAYER_INIT.dapctrl){
					this.dapctrl =window.G_PLAYER_INIT.dapctrl;
					return this.dapctrl;
				}
			}
			return false;
		},
		init:function(){
			if(!this.getDapctrl()){
				if(!isIE){
					var browserPlugins = navigator.plugins;
					for (var bpi=browserPlugins.length-1; bpi>=0; bpi--) {
						try {
							if (browserPlugins[bpi].name.indexOf('Thunder DapCtrl') != -1) {
								document.write('<object id="dapctrl"  type="application/x-thunder-dapctrl" width=0 height=0 ></object>');
								break;
							}
						} catch (e) {}
					}
					try{
						this.dapctrl = document.getElementById('dapctrl');
					}catch(e){
						this.dapctrl = null;
					}
				}else{
					try{
						this.dapctrl =  new ActiveXObject("DapCtrl.DapCtrl");
					}catch(e){
						this.dapctrl = null;
						return false;
					}
				}		
			}
			//judge is kk
			if(window.location.host==(document.domain=="kankan.com"?"vip.kankan.com":"movie.xunlei.com")){
				this.isKK = false;
				if(document.body){
					this.newKKIfr();
				}else{
					window.attachEvent("onload", ioCtrl.newKKIfr);
				}
			}
		},
		getDapctrlVer:function(){
			if(this.ver){
				return this.ver;
			}
			if(!this._isGet){
				this.getDapctrl();
			}
			if(this.dapctrl){
				try{
					this.ver = this.dapctrl.Get("iVersion");
					return this.ver;
				}catch(e){
					return 0;
				}
			}else{
				return 0;
			}
		},
		ioWriter:function(name,value,hours){
			if(this.getDapctrlVer()>200000){
				this.ioCtrlWriter(name,value,hours||null);
			}/*else{
				if(hours){
					setCookie(name,value,hours);
				}else{
					setCookie(name,value);
				}
			}*/
		},
		ioReader:function(name){
			if(this.getDapctrlVer()>200000){
				return this.ioCtrlReader(name) || "";
			}else{
				return '';
			}
		},
		ioCtrlWriter:function(key, value, expires){
			var player = this.getDapctrl();
			var iExpire = expires || 720;
			player.Put("sCookieFileName", key+".dat");
			player.Put("sCookie", value+"～"+((new Date().getTime()) + iExpire * 3600000));
			player = null;
		},
		ioCtrlReader:function(key){
			var player = this.getDapctrl();
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
		},
		ioWritekkNmov: function(name,value,hours){
			if(this.getDapctrlVer()>200000){
				this.ioCtrlWriter(name,value,hours||null);
			}else{
				G_SHOP_INFO.setCookieWithDomain(name, value, hours, (document.domain=="kankan.com"?"vip.kankan.com":"movie.xunlei.com"));
				if(ioCtrl.kkCrossObj){ioCtrl.kkCrossObj.setCookie(name, value, hours)}
			}
		},
		ioReadkkNmov: function(name){
			if(this.getDapctrlVer()>200000){
				return this.ioCtrlReader(name) || "";
			}else if(!this.isKK){
				return G_SHOP_INFO.getCookie(name);
			}else if(ioCtrl.kkCrossObj){
				return ioCtrl.kkCrossObj.getCookie(name);
			}
		},
		newKKIfr: function(){
			if(this.isKK){return}
			var ifr = null,
				id = "kkCrossIfr";
			try{ifr=document.createElement('<iframe name="'+ id +'">')}catch(e){ifr=document.createElement('iframe');ifr.name=id}
			ifr.width=ifr.height=0;
			ifr.id = id;
			ifr.frameBorder='0';
			ifr.src = "http://"+(document.domain=="kankan.com"?"vod.kankan.com":"kankan.xunlei.com/vod")+"/app/vip/cookie.html";
			ifr.scrolling='no';
			ifr.style.display = "none";
			ifr.onload = function(){ioCtrl.kkCrossObj = window.frames["kkCrossIfr"].G_KK_CROSS};
			document.body.insertBefore(ifr,document.body.firstChild);
		}
	};
	return ioCtrl;
})