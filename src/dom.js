define(function(){
    var core_version = "@VERSION",
        core_trim = core_version.trim,
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,    
    
    Dom = function( id ) {
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

        getPos: function(){
            var p={"t":0,"l":0}, o=this.node;
            while(o){
                p.t+=o.offsetTop;
                p.l+=o.offsetLeft;
                o=o.offsetParent;
            }
            return p;
        },

        isInView: function(){
            var t1=document.body.scrollTop + document.documentElement.scrollTop,
            t2=t1 + document.documentElement.clientHeight,
            l1=document.documentElement.scrollLeft,
            l2=l1 + document.documentElement.clientWidth,
            o=this.node;

            if(o){
                p=this.getPos();
                if((p.t>=t1||p.t+o.clientHeight>=t1)&&p.t<=t2&&(p.l>=l1||p.l+obj.clientWidth>=l1)&&p.l<=l2){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }
    };

    Dom.toCamelCase = function(str){            
        var parts = str.split('-'), camel = parts[0], len = parts.length;
        if(len > 1){
            for(var i=1; i < len; i++){
                camel += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
            }
        }
        return camel;
    };

    Dom.trim = function(text){
        if(core_trim && !core_trim.call("\uFEFF\xA0")){
            return text == null ? "" : core_trim.call( text );
        } else {
            return text == null ? "" : ( text + "" ).replace( rtrim, "" );
        }
    };

    Dom.prototype.init.prototype = Dom.prototype;

    return Dom;
})