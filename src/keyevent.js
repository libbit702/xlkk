/**
 * 监视键盘敲击事件并触发绑定动作
 *
 * @module keyevent 
 * @author lijunjun
 * @version 1.0
 * @example
     ke.down('delete', function(){
        //do sth here
     });
     
     ke.up('esc', function(){
        //do sth here
     });
 */
define(['eventutil'], function(e){
    "use strict";
    var KeyEvent = {};

    /**
     * 预定义的键盘字符对应的ASCII码
     *
     * @private
     */
    KeyEvent.map = {
        'backspace':8,
        'tab':9,
        'enter':13,
        'space':32,
        'pageup':33,
        'pagedown':34,
        'end':35,
        'home':36,
        'left':37,
        'up':38,
        'down':40,
        'right':39,
        'delete':46
    };

    /**
     * 监视key down
     *
     * @method module:keyevent.down
     * @param {String} keys 键盘对应字符
     * @param {Function} fnHandler 触发的动作
     */
    KeyEvent.down = function( keys, fnHandler ) {
        var hitKey = 0;
        if(typeof this.map[keys] !== undefined){
            hitKey = this.map[keys];
        }

        e.addEventHandler(document, 'keydown', function(e){
            e = e || event;
            var currKey = e.keyCode || e.which || e.charCode;
            if(hitKey && currKey === hitKey){
                fnHandler(); 
            }
        });
    };

    /**
     * 监视key up
     *
     * @method module:keyevent.up
     * @param {String} keys 键盘对应字符
     * @param {Function} fnHandler 触发的动作
     */
    KeyEvent.up = function( keys, fnHandler ) {
        var hitKey = 0;
        if(typeof this.map[keys] !== undefined){
            hitKey = this.map[keys];
        }

        e.addEventHandler(document, 'keyup', function(e){
            e = e || event;
            var currKey = e.keyCode || e.which || e.charCode;
            if(hitKey && currKey === hitKey){
                fnHandler(); 
            }
        });
    };

    /**
     * 监视key press
     *
     * @method module:keyevent.press
     * @param {String} keys 键盘对应字符
     * @param {Function} fnHandler 触发的动作
     */
    KeyEvent.press = function( keys, fnHandler ) {
        var hitKey = 0;
        if(typeof this.map[keys] !== undefined){
            hitKey = this.map[keys];
        }

        e.addEventHandler(document, 'keypress', function(e){
            e = e || event;
            var currKey = e.keyCode || e.which || e.charCode;
            if(hitKey && currKey === hitKey){
                fnHandler(); 
            }
        });
    };
         
    return KeyEvent;
});

