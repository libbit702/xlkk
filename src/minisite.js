var MiniSite = {};
//Check User Browser type by UA
MiniSite.Browser = {
	ie: /msie/.test(window.navigator.userAgent.toLowerCase()),
	moz: /gecko/.test(window.navigator.userAgent.toLowerCase()),
	opera: /opera/.test(window.navigator.userAgent.toLowerCase()),
	safari: /safari/.test(window.navigator.userAgent.toLowerCase())
};

//Simple JSONP Implementation
MiniSite.loadJSData = function( sUrl, sCharset, fCallback ){
	var _script = document.createElement('script');
	_script.setAttribute('charset', sCharset);
	_script.setAttribute('type', 'text/javascript');
	_script.setAttribute('src', sUrl);
	document.getElementsByTagName('head')[0].appendChild(_script);
	if(MiniSite.Browser.ie){
		_script.onreadystatechange = function(){
			if(this.readyState == 'loaded' || this.readyState == 'complete'){
				setTimeout(function(){
					try{
						fCallback();
					}catch(e){}
				}, 50);
			}
		};
	}else if(MiniSite.Browser.moz){
		_script.onload = function(){
			setTimeout(function(){
				try{
					fCallback();
				}catch(e){}
			}, 50);
		};
	}else{
		setTimeout(function(){
			try{
				fCallback();
			}catch(e){}
		}, 50);
	}
};