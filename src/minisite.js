/**
 * jsonp封装
 *
 * @module minisite
 * @author lijunjun
 * @version 1.0
 */
define(function(){
    'use strict';
    var MiniSite = {};

    /**
     * 根据UserAgent检测浏览器类型
     *
     * @method module:minisite.Browser
     */
    MiniSite.Browser = {
        ie: /msie/.test(window.navigator.userAgent.toLowerCase()),
        moz: /gecko/.test(window.navigator.userAgent.toLowerCase()),
        opera: /opera/.test(window.navigator.userAgent.toLowerCase()),
        safari: /safari/.test(window.navigator.userAgent.toLowerCase())
    };

    /**
     * JSONP跨域取数据方法
     *
     * @method module:minisite.loadJSData
     * @param {String} sUrl
     * @param {String} sCharset
     * @param {Function} fCallback
     */
    MiniSite.loadJSData = function( sUrl, sCharset, fCallback ){
        var _script = document.createElement('script');
        _script.setAttribute('charset', sCharset);
        _script.setAttribute('type', 'text/javascript');
        _script.setAttribute('src', sUrl);
        document.getElementsByTagName('head')[0].appendChild(_script);
        if(MiniSite.Browser.ie){
            _script.onreadystatechange = function(){
                if(this.readyState === 'loaded' || this.readyState === 'complete'){
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
    return MiniSite;
});
