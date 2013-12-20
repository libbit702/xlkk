/**
 * 图片延时加载插件
 *
 * @module lazy
 * @author lijunjun
 * @version 1.0
 * @example
     lazy.init();
     lazy.run();
 */
define(['eventutil'], function(e){
	"use strict";
	var LAZY = {};
	LAZY=(function(){
		var pResizeTimer = null,
		imgs={};

		function position(o){
			var p={Top:0,Left:0};
			while(!!o){
				p.Top+=o.offsetTop;
				p.Left+=o.offsetLeft;
				o=o.offsetParent;
			}
			return p;
		}

		function resize_run(){
			var i,
			min={},
			max={},
			_img, img, width, height, wh;
	        min.Top = document.body.scrollTop + document.documentElement.scrollTop;
			min.Left=document.documentElement.scrollLeft;
			max.Top=min.Top+document.documentElement.clientHeight;
			max.Left=min.Left+document.documentElement.clientWidth;

			for(i in imgs){
				if(imgs[i]){
					_img=imgs[i];
					img = document.getElementById(i);
					width = img.clientWidth;
					height = img.clientHeight;
					wh=position(img);
					if( (wh.Top>min.Top && wh.Top<max.Top && wh.Left>min.Left && wh.Left<max.Left) || ((wh.Top+height)>min.Top && wh.Top<max.Top && (wh.Left+width)>min.Left && wh.Left<max.Left)){
						(function(imgobj,realsrc){
							setTimeout(function() {
								imgobj.src = realsrc;
								imgobj.removeAttribute('_src');
							}, 100) ;
						})(img,_img.src) ;
						delete imgs[i];
					}

				}
			}
		}

		function resize(){
			if(pResizeTimer){
				return '';
			}
			resize_run();
		}

		
		/** @lends lazy */
		return {
			/**
	         * 初始化
	         *
	         * @method module:lazy.init
	         */
			init:function(){
				var i = 0,ttiframes=document.body.getElementsByTagName("iframe"),img,config;
				for(i=0;i<document.images.length;i++){
					img = document.images[i];
					config={};
					config.id = img.id;
					config.src = img.getAttribute('_src');
					if(config.src && !config.id){
						config.id = encodeURIComponent(config.src) + Math.random();
						img.id = config.id;
					}
					if(!config.id || !config.src){
						continue;
					}
					LAZY.push(config);
				}

				for(i=0;i<ttiframes.length;i++){
					config={};
					config.id = ttiframes[i].id;
					config.src = ttiframes[i].getAttribute('_src');
					if(config.src && !config.id){
						config.id = encodeURIComponent(config.src) + Math.random();
						ttiframes[i].id = config.id;
					}
					if(!config.id || !config.src){
						continue;
					}
					LAZY.push(config);
				}
			},

			/**
	         * 添加需要延时加载的图片
	         *
	         * @method module:lazy.push
	         * @param config 封装好的图片对象
	         */
			push:function(config){
				imgs[config.id] = config;
			},

			/**
	         * 注册浏览器滚动事件，触发延时加载
	         *
	         * @method module:lazy.run
	         */
			run:function(){
				e.addEventHandler(window,'scroll',resize);
				resize_run();
			}
		};
	})();
	return LAZY;
});
