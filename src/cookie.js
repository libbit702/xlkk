define(function(){
    "use strict";
    /** 
     cookie操作集合对象
     @exports cookie
     @author lijunjun
     @version 1.0
     */
    var Cookie = {
        host : window.location.host,
        /**
          * 通过键值取值
          *
          * @method module:cookie#getcookie
          * @param {String} name
          * @return {String} the cookie value or empty string if not found
          */  
        getCookie : function( name ) {
            try{
                var str = (document.cookie.match(new RegExp("(^"+name+"| "+name+")=([^;]*)")) === null) ? "" : decodeURIComponent( RegExp.$2 );
                if (str !== "") {
                    return str;
                } else {
                    return "";
                }
            } catch( e ) { 
                return "";
            }
        },
        
        /**
         * 设置当前url域下的cookie值,并设置超时时间
         *
         * @method module:cookie#setCookie
         * @param {String} name
         * @param {String} value
         * @param {Num} hours
         */
        setCookie : function( name,value,hours ) {        
            if ( arguments.length > 2 ) {
                var expireDate = new Date(new Date().getTime() + hours * 3600000);
                document.cookie = name + "=" + encodeURIComponent( value ) + "; path=/; domain=" + this.host + "; expires=" + expireDate.toGMTString();
            } else {
                document.cookie = name + "=" + encodeURIComponent( value ) + "; path=/; domain=" + this.host;
            }
        },
        
        /**
         * 设置当前document的domain，为跨子域做准备
         *
         * @method module:cookie#setDomain
         * @param {String} domain
         */
        setDomain : function(domain){
            document.domain = domain;
        }
    };  
    return Cookie;
});
