define([], function(){
    var Cookie = {
        host : window.location.host
    };
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
            
    Cookie.setCookie = function( name,value,hours ) {        
        if ( arguments.length > 2 ) {
            var expireDate = new Date(new Date().getTime() + hours * 3600000);
            document.cookie = name + "=" + encodeURIComponent( value ) + "; path=/; domain=" + this.host + "; expires=" + expireDate.toGMTString();
        } else {
            document.cookie = name + "=" + encodeURIComponent( value ) + "; path=/; domain=" + this.host;
        }
    };

    Cookie.setDomain = function(domain){
        this.host = domain;
        document.domain = this.host;
    };
    return Cookie;
});
