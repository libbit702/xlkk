/*
require.config({
    baseUrl: ".",
    paths: {
        "lib":"http://misc.web.xunlei.com/www_v6/js/lib/",
        "common":"http://misc.web.xunlei.com/www_v6/js/"
    },
    urlArgs: "rd=v2"
});

require(["http://misc.web.xunlei.com/www_v6/js/lib/jquery-1.8.2.min.js","vip"], function(j, v) {
    console.log(v);
});*/
define("vip",function(e){var t={berylType:0,products:null};return t.getBerylType=function(e){var t=e.shopInfo,n=new Date(Date.parse(t.curTime.replace(/-/g,"/"))),r=new Date(Date.parse(t.validtime.replace(/-/g,"/"))),i=r.getTime()-n.getTime(),s=Math.ceil(i/864e5);return parseInt(t.kkviptype,10)!==0&&(parseInt(t.ismobile,10)===0?s>0&&(this.berylType=t.kkviptype):this.berylType=t.kkviptype),this.berylType},t.loginout=function(){this.berylType=0,this.products=null},t}),require(["http://misc.web.xunlei.com/www_v6/js/lib/jquery-1.8.2.min.js","vip"],function(e,t){console.log(t)}),define("main",function(){});