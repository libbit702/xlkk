/**
 * ioctrl封装
 *
 * @module ioCtrl
 * @author lijunjun
 * @version 1.0
 *@example
     i.getPeerID();
 */
define(function(){  
	/* 浏览器判断 */  
	"use strict";
    var isIE=(navigator.appName).indexOf("Microsoft") !== -1,
    
	ioCtrl = {
		/* 自定义内部变量 */  
		ver:0,
		_isGet:false,
		dapctrl:null,
		/**
	     * 取得浏览器中的DapCtrl对象，如果已经定义了全局变量，优先取用
	     *
	     * @method module:ioCtrl#getDapctrl
	     * @return {Object} DapCtrl对象
	     */
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

		/**
	     * 初始化ioCtrl
	     *
	     * @method module:ioCtrl#init
	     * @return {Boolean|Null} 
	     */
		init:function(){
			var browserPlugins = navigator.plugins, bpi;
			if(!this.getDapctrl()){
				if(!isIE){
                    if(document.getElementById('dapctrl')){
                        this.dapctrl = document.getElementById('dapctrl');
                        return false;
                    } 
					
					for (bpi=browserPlugins.length-1; bpi>=0; bpi--) {
						try {
							if (browserPlugins[bpi].name.indexOf('Thunder DapCtrl') !== -1) {
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
			if(window.location.host===(document.domain==="kankan.com"?"vip.kankan.com":"movie.xunlei.com")){
				this.isKK = false;
				if(document.body){
					this.newKKIfr();
				}else{
					window.attachEvent("onload", ioCtrl.newKKIfr);
				}
			}
		},

		/**
	     * 取得DapCtrl的版本
	     *
	     * @method module:ioCtrl#getDapctrlVer
	     * @return {Num} 
	     */
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

		/**
	     * 写入sCookie
	     *
	     * @method module:ioCtrl#ioWriter
	     */
		ioWriter:function(name,value,hours){
			if(this.getDapctrlVer()>200000){
				this.ioCtrlWriter(name,value,hours||null);
			}
		},

		/**
	     * 读取sCookie
	     *
	     * @method module:ioCtrl#ioReader
	     * @param {String} name sCookie中存储的键值
	     * @return {String} sCookie中的对应值
	     */
		ioReader:function(name){
			if(this.getDapctrlVer()>200000){
				return this.ioCtrlReader(name) || "";
			}else{
				return '';
			}
		},

		/**
	     * 执行写入sCookie的动作
	     *
	     * @method module:ioCtrl#ioCtrlWriter
	     * @param {String} key 存储的键值
	     * @param {String} value 键值对应的真实值
	     * @param {Num} expires 过期时间
	     */
		ioCtrlWriter:function(key, value, expires){
			var player = this.getDapctrl(),
			iExpire = expires || 720;
			player.Put("sCookieFileName", key+".dat");
			player.Put("sCookie", value + "～" + ((new Date().getTime()) + iExpire * 3600000));
			player = null;
		},

		/**
	     * 执行读取sCookie的动作
	     *
	     * @method module:ioCtrl#ioCtrlReader
	     * @param {String} key 存储的键值
	     * @return {String} 返回在sCookie中存储的值
	     */
		ioCtrlReader:function(key){
			var player = this.getDapctrl(),
			sCookie = null,
			value = null,
			ioCtrlCheck = function(sCookie){
				var items = sCookie.split('～'),
				curDate = 0,
				expires = 0,
				value = null;
				if(items.length !== 2){return null;}
				value = ""===items[0]?null:items[0];
				expires = parseInt(items[1], 10);
				curDate = new Date().getTime();
				if(curDate > expires){
					return null;
				}else{
					return value;
				}
			};
			player.Put("sCookieFileName", key+".dat");
			sCookie = player.Get("sCookie")||null;
			if(null !== sCookie){
				value = ioCtrlCheck(sCookie);
			}
			player = null;
			return value;
			
		},

		/**
	     * 未知，后续
	     *
	     * @method module:ioCtrl#ioWritekkNmov
	     * @param {String} name 
	     * @param {String} value
	     * @param {Num} hours
	     */
		ioWritekkNmov: function(name,value,hours){
			if(this.getDapctrlVer()>200000){
				this.ioCtrlWriter(name,value,hours||null);
			}else{
				G_SHOP_INFO.setCookieWithDomain(name, value, hours, (document.domain==="kankan.com"?"vip.kankan.com":"movie.xunlei.com"));
				if(ioCtrl.kkCrossObj){
					ioCtrl.kkCrossObj.setCookie(name, value, hours);
				}
			}
		},

		/**
	     * 未知，后续
	     *
	     * @method module:ioCtrl#ioReadkkNmov
	     * @param {String} name 
	     */
		ioReadkkNmov: function(name){
			if(this.getDapctrlVer()>200000){
				return this.ioCtrlReader(name) || "";
			}else if(!this.isKK){
				return G_SHOP_INFO.getCookie(name);
			}else if(ioCtrl.kkCrossObj){
				return ioCtrl.kkCrossObj.getCookie(name);
			}
		},

		/**
	     * 未知，后续
	     *
	     * @method module:ioCtrl#newKKIfr
	     * @param {String} name 
	     */
		newKKIfr: function(){
			if(this.isKK){
				return;
			}
			var ifr = null,
				id = "kkCrossIfr";
			try{
				ifr=document.createElement('<iframe name="'+ id +'">');
			}catch(e){
				ifr=document.createElement('iframe');
				ifr.name=id;
			}
			ifr.width=ifr.height=0;
			ifr.id = id;
			ifr.frameBorder='0';
			ifr.src = "http://"+(document.domain==="kankan.com"?"vod.kankan.com":"kankan.xunlei.com/vod")+"/app/vip/cookie.html";
			ifr.scrolling='no';
			ifr.style.display = "none";
			ifr.onload = function(){
				ioCtrl.kkCrossObj = window.frames.kkCrossIfr.G_KK_CROSS;
			};
			document.body.insertBefore(ifr,document.body.firstChild);
		},

		/**
	     * 获取终端的PeerID
	     *
	     * @method module:ioCtrl#getPeerID
	     * @param {Num} bit 终端CPU参数
	     */
        getPeerID: function(bit){
            var peerId = null;
            if(this.dapctrl){
	            try{
	                if(32 === bit){
	                    peerId = this.dapctrl.Get("sPeerID32")||null;
	                }else{
	                    peerId = this.dapctrl.Get("sPeerID")||null;
	                }
	            }catch(e){}
        	}
            return peerId;
        }
	};

    ioCtrl.init();
    
	return ioCtrl;
});