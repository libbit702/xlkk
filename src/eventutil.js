define(function(){
    "use strict";
    /** 
     事件绑定的浏览器兼容
     @exports eventutil
     @author lijunjun
     @version 1.0
     */
    var EventUtil = {};
    /**
      * 注册事件
      *
      * @method module:eventutil.addEventHandler
      * @param {DOMObject} oTarget 事件绑定对象
      * @param {String} sEventType 事件绑定类型
      * @param {Function} fnHandler 触发事件后运行的函数
      */
    EventUtil.addEventHandler = function( oTarget, sEventType, fnHandler ) {
        if ( oTarget.addEventListener ) {
            oTarget.addEventListener( sEventType, fnHandler, false );
        } else if ( oTarget.attachEvent ) {
            oTarget.attachEvent( "on" + sEventType, fnHandler );
        } else {
            oTarget["on" + sEventType] = fnHandler;
        }
    };
    
    /**
      * 删除事件
      *
      * @method module:eventutil.addEventHandler
      * @param {DOMObject} oTarget 事件绑定对象
      * @param {String} sEventType 事件绑定类型
      * @param {Function} fnHandler 触发事件后运行的函数
      */  
    EventUtil.removeEventHandler = function( oTarget, sEventType, fnHandler ) {
        if ( oTarget.removeEventListener ) {
            oTarget.removeEventListener( sEventType, fnHandler, false );
        } else if ( oTarget.detachEvent ) {
            oTarget.detachEvent( "on" + sEventType, fnHandler );
        } else { 
            oTarget["on" + sEventType] = null;
        }
    };
    return EventUtil;
});

