define(['eventutil', 'node', 'dom'], function(e, FX, d){
	"use strict";
	/** 
     类门户首页及付费首页的轮播图效果
     @module focuspic
     @author lijunjun
     @version 1.0
     @example
     var f1 = new FocusPic;   
     f1.init(3000, 5,'focus_box_','focus_sbox_');
     */
	function FocusPic(){
		this.page = 0;
		this.timeSet = false;
		this.bid = "";
		this.sid = "";
		this.totalcount = 0;
		this.fxNodes = [];
		this.interval = 5000
	}
	FocusPic.prototype = {		
		/**
	      * 初始化轮播配置
	      *
	      * @method module:focuspic#init
	      * @param {Num} interval 自动轮播间隔
	      * @param {Num} num 轮播图总数
	      * @param {String} bid 轮播图中大图的ID前缀
	      * @param {String} sid 轮播图中小图的ID前缀
	      */
	    init:function(interval,num,bid,sid){
			this.bid = bid,
			this.sid = sid,
			this.totalcount = num,
			this.interval = interval
			var _self = this;
			
			for(var i=0;i<num;i++){
				(function(i){
					e.addEventHandler(d(sid+i).getEle(),'mouseover', function(){
						_self.pause();
						_self.onone(i, 10);
					});

					e.addEventHandler(d(sid+i).getEle(),'mouseout',function(){
						_self.play();
						_self.onone(i, 10);
					});

					e.addEventHandler(d(bid+i).getEle(),'mouseover',function(){
						_self.pause()
					});

					e.addEventHandler(d(bid+i).getEle(),'mouseout',function(){
						_self.play()
					});
				})(i);
				this.fxNodes[i] = new FX.Node(this.bid+i);
			}

			this.play();
		},

		/**
	      * 指定显示轮播图中某个图片的动作
	      *
	      * @method module:focuspic#onone
	      * @param {Num} num 指定显示的图片在轮播图中的顺序，从0开始
	      */
		onone:function(num){
			if(num==this.page)return;
			d(this.sid+this.page).removeClass('on');
			d(this.sid+num).addClass('on');
			for(var i=0;i<this.fxNodes.length;i++){
				this.fxNodes[i].stop();
			}
			this.fxNodes[this.page].fadeOut({
				callback:(function(){this.style.display='none'}).call(this.fxNodes[this.page].el)
			});
			this.fxNodes[num].fadeIn({
				callback:(function(){this.style.display='block'}).call(this.fxNodes[num].el)
			});			
			this.page=num;
		},

		/**
	      * 开始自动轮播
	      *
	      * @method module:focuspic#play
	      */
		play:function(){
			clearInterval(this.timeSet);
			var _self = this;
			this.timeSet=setInterval(function(){
				_self.next();
			},this.interval);
		},

		/**
	      * 暂停自动轮播
	      *
	      * @method module:focuspic#pause
	      */
		pause:function(){
			clearTimeout(this.timeSet);
		},

		/**
	      * 轮播切换至上一张图片
	      *
	      * @method module:focuspic#next
	      */
		next:function(){
			this.onone(this.page>=(this.totalcount-1)?0:this.page+1);
		},

		/**
	      * 轮播切换至下一张图片
	      *
	      * @method module:focuspic#prev
	      */
		prev:function(){
			this.onone(this.page<=0?this.totalcount-1:this.page-1);
		}
	}
	return FocusPic;
});
