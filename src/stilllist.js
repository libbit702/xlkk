/**
 * 小图固定不变的轮播图
 *
 * @module stillList
 * @author lijunjun 
 * @version 1.0
 * @example
   参看<a href="http://topics.kankan.com/nsj/" target="_blank">实例</a>
 */
define(function(){
	var stillList = {
		config:{
			pgIndex : 0,//当前播放图片在群组中的位置
			pgCount : 0,//需要展示的图片个数
			pgSector : 0,//可视区域的最左侧图片位置
			pgSectorLen : 5,//可视区域个数
			pgInterval : 5000,//自动轮播间隔时长，毫秒
			pgTimer:0,//计时器句柄
			pgSmallPrefix:'s2_',//小图的ID前缀
			pgBigPrefix:'s1_'//大图的ID前缀
		},
		
		
		init : function (config) {
			for (var property in config) {
			    this.config[property] = config[property];
			}
		},

		auto : function(){
			var _self = this;
			this.config.pgTimer = setInterval(function(){
				_self.jump('next');
			}, this.config.pgInterval);
		},
		
		jump : function (page) {
			this.config.pgIndex = parseInt(this.config.pgIndex, 10);
			var _oldIndex = this.config.pgIndex;
			if (page == 'prev') {
				this.config.pgIndex = (this.config.pgIndex <= 0)?this.config.pgCount-1:(this.config.pgIndex-1);
			} else if (page == 'next') {
				this.config.pgIndex = (this.config.pgIndex >= this.config.pgCount-1)?0:(this.config.pgIndex+1);
			} else {
				this.config.pgIndex = (page >= 0 && page <= this.config.pgCount-1)?page:this.config.pgIndex;
			}

			if (_oldIndex == this.config.pgIndex) return;
			
			document.getElementById(this.config.pgBigPrefix+_oldIndex).style.display = "none";
			document.getElementById(this.config.pgSmallPrefix+_oldIndex).className = "";
			
			for (var i=this.config.pgSector;i<=this.sectorEnd(this.config.pgSectorLen);i++) {
				document.getElementById(this.config.pgSmallPrefix+i).style.display = "none";
			}
			if (this.config.pgIndex < this.config.pgSector || this.config.pgIndex > this.sectorEnd()) {
				if (this.config.pgIndex < this.config.pgSector) {// 在当前区间左侧
					this.config.pgSector = this.config.pgIndex;
				}
				if (this.config.pgIndex > this.sectorEnd()) {// 在当前区间右侧
					this.config.pgSector += this.config.pgIndex - this.sectorEnd();
				}
			}
			for (var i=this.config.pgSector;i<=this.sectorEnd();i++) {
				document.getElementById(this.config.pgSmallPrefix+i).style.display = "block";
			}
			document.getElementById(this.config.pgBigPrefix+this.config.pgIndex).style.display = "block";
			document.getElementById(this.config.pgSmallPrefix+this.config.pgIndex).className = "on";
		},
		
		sectorEnd : function() {
			return ((this.config.pgSector + this.config.pgSectorLen - 1) >= this.config.pgCount-1)?(this.config.pgCount-1):(this.config.pgSector + this.config.pgSectorLen - 1);
		}
	};
	return stillList;
});
