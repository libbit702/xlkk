/**
 * 仿jQuery的DOM方法封装
 *
 * @module dom
 * @author lijunjun
 * @version 1.0
 * @example
    d('id_of_dom').hasClass('cls');
    d('id_of_dom').addClass('cls').hide().setHtml('inner html content');
    var trimed_str = d.trim('string to be trimed');
    var strCamelExample = d.toCamelCase('str-camel-example');
 */
define(function(){
    "use strict";
    var core_version = "@VERSION",
        core_trim = core_version.trim,
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,        
    
    Dom = function( id ) {
        return new Dom.prototype.init( id );
    };

    Dom.prototype = {
        constructor: Dom,
 
        /**
         * 通过document的原生方法id取dom
         *
         * @constructor
         * @method module:dom#init
         * @param {String} id
         * @return {Object} dom类的实例
         */
        init:function(id){
            this.node = document.getElementById(id);
            return this;
        },

        /**
         * 节点是否有指定的class
         *
         * @method module:dom#hasClass
         * @param {String} cls
         * @return {Boolean} true if found or false if not
         */
        hasClass : function(cls) {
            return this.node.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },

        /**
         * 向节点添加指定的class
         *
         * @method module:dom#addClass
         * @param {String} cls
         * @return {Object} dom object for js chain
         */
        addClass : function(cls) {
            if (!this.hasClass(cls)) {
                this.node.className += " " + cls;
            }
            return this;
        },

        /**
         * 节点删除指定的class
         *
         * @method module:dom#removeClass
         * @param {String} cls
         * @return {Object} dom object for js chain
         */
        removeClass : function(cls) {
            if (this.hasClass(cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                this.node.className = this.node.className.replace(reg, ' ');
            }
            return this;
        },

        /**
         * 返回原生的DOM节点，为了eventutil的绑定
         *
         * @method module:dom#getEle
         * @return {Object} document dom object
         */
        getEle : function(){
            return this.node;
        },

        /**
         * 隐藏节点
         *
         * @method module:dom#hide
         * @return {Object} dom object for js chain
         */
        hide: function(){
            this.node.style.display = 'none';
            return this;
        },

        /**
         * 显示节点
         *
         * @method module:dom#show
         * @return {Object} dom object for js chain
         */
        show: function(){
            this.node.style.display = '';
            return this;
        },

        /**
         * 设置节点的innerHTML
         *
         * @method module:dom#setHtml
         * @param  {String} html
         * @return {Object} dom object for js chain
         */
        setHtml: function(html){
            this.node.innerHTML = html;
            return this;
        },

        /**
         * 获取节点的innerHTML
         *
         * @method module:dom#getHtml
         * @return {Object} dom object for js chain
         */
        getHtml: function(){
            return this.node.innerHTML;
        },

        /**
         * 设置节点的样式
         *
         * @method module:dom#setStyle
         * @param {String} prop
         * @param {String} value
         * @return {Object} dom object for js chain
         */
        setStyle: function (prop, value){
            if(prop === 'opacity'){
                this.node.style.filter = "alpha(opacity=" + value * 100 + ")";
                this.node.style.opacity = value;
            }else{
                prop = Dom.toCamelCase(prop);
                this.node.style[prop] = value;
            }
            return this;
        },

        /**
         * 获取节点在文档中的位置
         *
         * @method module:dom#getPos
         * @return {Object} dom object for js chain
         */
        getPos: function(){
            var p={"t":0,"l":0}, o=this.node;
            while(o){
                p.t+=o.offsetTop;
                p.l+=o.offsetLeft;
                o=o.offsetParent;
            }
            return p;
        },

        /**
         * 节点在浏览器视图中是否可见
         *
         * @method module:dom#isInView
         * @return {Object} dom object for js chain
         */
        isInView: function(){
            var t1=document.body.scrollTop + document.documentElement.scrollTop,
            t2=t1 + document.documentElement.clientHeight,
            l1=document.documentElement.scrollLeft,
            l2=l1 + document.documentElement.clientWidth,
            o=this.node,
            p={};

            if(o){
                p=this.getPos();
                if((p.t>=t1||p.t+o.clientHeight>=t1)&&p.t<=t2&&(p.l>=l1||p.l+o.clientWidth>=l1)&&p.l<=l2){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }
    };

    /**
     * 对字符进行驼峰式处理
     *
     * @method module:dom.toCamelCase
     * @return {String} string with camel pattern
     */
    Dom.toCamelCase = function(str){            
        var parts = str.split('-'), camel = parts[0], len = parts.length, i;
        if(len > 1){
            for(i=1; i < len; i++){
                camel += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
            }
        }
        return camel;
    };

    /**
     * 去除字符左右两边的空白字符
     *
     * @method module:dom.trim
     * @return {String} string without left or right spaces
     */
    Dom.trim = function(text){
        if(core_trim && !core_trim.call("\uFEFF\xA0")){
            return text === null ? "" : core_trim.call( text );
        } else {
            return text === null ? "" : ( text + "" ).replace(rtrim, "");
        }
    };

    Dom.prototype.init.prototype = Dom.prototype;

    return Dom;
});