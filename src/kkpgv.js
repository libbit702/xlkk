/**
 * 发包函数封装
 *
 * @module kkpgv
 * @author lijunjun
 * @version 1.0
 */
define(function(){
    var kkpgv ={
        sendkkpv:function (e){
            var t=new Image(1,1);
            t.src=e+"&rd="+Math.random();
        }
    };
    return kkpgv;
});
    