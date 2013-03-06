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
        },

        setHtml: function(html){
            this.node.innerHTML = html;
            return this;
        },

        getHtml: function(){
            return this.node.innerHTML;
        },

        setStyle: function (prop, value){
            if(prop == 'opacity'){
                this.node.style.filter = "alpha(opacity=" + value * 100 + ")";
                this.node.style.opacity = value;
            }else{
                prop = this.toCamelCase(prop);
                this.node.style[prop] = value;
            }
            return this;
        },

        toCamelCase: function(str){            
            var parts = str.split('-'), camel = parts[0], len = parts.length;
            if(len > 1){
                for(var i=1; i < len; i++){
                    camel += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
                }
            }
            return camel;
        }
    };

    Dom.prototype.init.prototype = Dom.prototype;

    return Dom;
})