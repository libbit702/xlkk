/**
 * 通用操作cookie的方法包装
 *
 * @module cookie
 */
define(function(){
    var Cookie = {
        host : window.location.host
    };
    
    /**
     * 通过cookie键值取对应的value
     *
     * @method getCookie
     * @param {String} name
     * @return String or empty string("") if not found
     */
    Cookie.getCookie = function( name ) {
        try{
            var str = (document.cookie.match(new RegExp("(^"+name+"| "+name+")=([^;]*)")) == null) ? "" : decodeURIComponent( RegExp.$2 );
            if (str !== "") {
                return str;
            } else {
                return "";
            }
        } catch( e ) { 
            return "";
        }
    };
     
    /**
     * 设置当前url域下的cookie
     *
     * @method setCookie
     * @param {String} name
     * @param {String} value
     * @param {Int} hours
     */
    Cookie.setCookie = function( name,value,hours ) {        
        if ( arguments.length > 2 ) {
            var expireDate = new Date(new Date().getTime() + hours * 3600000);
            document.cookie = name + "=" + encodeURIComponent( value ) + "; path=/; domain=" + this.host + "; expires=" + expireDate.toGMTString();
        } else {
            document.cookie = name + "=" + encodeURIComponent( value ) + "; path=/; domain=" + this.host;
        }
    };
    
    /**
     * 设置当前文档的domain域
     *
     * @method setDomain
     * @param {String} domain
     */
    Cookie.setDomain = function(domain){
        document.domain = domain;
    };
    return Cookie;
});
