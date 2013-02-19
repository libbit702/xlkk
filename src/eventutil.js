var EventUtil = {};
EventUtil.addEventHandler = function( oTarget, sEventType, fnHandler ) {
    if ( oTarget.addEventListener ) {
        oTarget.addEventListener( sEventType, fnHandler, false );
    } else if ( oTarget.attachEvent ) {
        oTarget.attachEvent( "on" + sEventType, fnHandler );
    } else {
        oTarget["on" + sEventType] = fnHandler;
    }
};
        
EventUtil.removeEventHandler = function( oTarget, sEventType, fnHandler ) {
    if ( oTarget.removeEventListener ) {
        oTarget.removeEventListener( sEventType, fnHandler, false );
    } else if ( oTarget.detachEvent ) {
        oTarget.detachEvent( "on" + sEventType, fnHandler );
    } else { 
        oTarget["on" + sEventType] = null;
    }
};
