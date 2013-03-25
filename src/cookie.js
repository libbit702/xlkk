define(function(){
    /** 
        A module representing a cookie.
        @exports cookie
        @version 1.0
     */
    var Cookie = {
        host : window.location.host,
        /**
          * .... description goes here ...
          * @description 通过cookie键值取对应的value
          * @method module:cookie#getcookie
          * @param {String} name
          * @return {String} the cookie value or empty string if not found
          */  
        getCookie : function( name ) {
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
        },
        
        /**
         * 设置当前url域下的cookie
         *
         * @method setCookie
         * @param {String} name
         * @param {String} value
         * @param {Int} hours
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
         * 设置当前文档的domain域
         *
         * @method setDomain
         * @param {String} domain
         */
        setDomain : function(domain){
            document.domain = domain;
        }
    };  
    return Cookie;
});
