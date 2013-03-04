define(function(){
    var Dom = function( id ) {
        return new Dom.prototype.init( id );
    };

    Dom.prototype = {
        constructor: Dom,

        init:function(id){
            this.node = document.getElementById(id);
            return this;
        },

        hasClass : function(cls) {
            return this.node.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },

        addClass : function(cls) {
            if (!this.hasClass(cls)) {
                this.node.className += " " + cls;
            }
            return this;
        },

        removeClass : function(cls) {
            if (this.hasClass(cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                this.node.className = this.node.className.replace(reg, ' ');
            }
            return this;
        },

        getEle : function(){
            return this.node;
        },

        hide: function(){
            this.node.style.display = 'none';
            return this;
        },

        show: function(){
            this.node.style.display = '';
            return this;
        }
    };

    Dom.prototype.init.prototype = Dom.prototype;

    return Dom;
})