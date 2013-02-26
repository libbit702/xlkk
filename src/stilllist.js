define(function(){
	var stillList = {
		config:{
			pgIndex : 0,
			pgCount : 0,
			pgSector : 0,
			pgSectorLen : 5,
			pgInterval : 5,
			pgTimer:0,
			pgSmallPrefix:'s2_',
			pgBigPrefix:'s1_'
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
