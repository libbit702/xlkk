define([], function(){
    var Cookie = {};
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
        var host = window.location.host;
        if ( arguments.length > 2 ) {
            var expireDate = new Date(new Date().getTime() + hours * 3600000);
            document.cookie = name + "=" + encodeURIComponent( value ) + "; path=/; domain=" + host + "; expires=" + expireDate.toGMTString();
        } else {
            document.cookie = name + "=" + encodeURIComponent( value ) + "; path=/; domain=" + host;
        }
    };
    return Cookie;
});
