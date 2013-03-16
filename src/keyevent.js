define(['eventutil'], function(e){
    var KeyEvent = {};

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

    KeyEvent.down = function( keys, fnHandler ) {
        var hitKey = 0;
        if(typeof this.map[keys] !== undefined){
            hitKey = this.map[keys];
        }

        e.addEventHandler(document, 'keydown', function(e){
            var e = e || event,
            currKey = e.keyCode || e.which || e.charCode;
            if(hitKey && currKey === hitKey){
                fnHandler(); 
            }
        });
    };

    KeyEvent.up = function( keys, fnHandler ) {
        var hitKey = 0;
        if(typeof this.map[keys] !== undefined){
            hitKey = this.map[keys];
        }

        e.addEventHandler(document, 'keyup', function(e){
            var e = e || event,
            currKey = e.keyCode || e.which || e.charCode;
            if(hitKey && currKey === hitKey){
                fnHandler(); 
            }
        });
    };

    KeyEvent.press = function( keys, fnHandler ) {
        var hitKey = 0;
        if(typeof this.map[keys] !== undefined){
            hitKey = this.map[keys];
        }

        e.addEventHandler(document, 'keypress', function(e){
            var e = e || event,
            currKey = e.keyCode || e.which || e.charCode;
            if(hitKey && currKey === hitKey){
                fnHandler(); 
            }
        });
    };
         
    return KeyEvent;
});

