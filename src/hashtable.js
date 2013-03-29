define(function(){
    "use strict";
    /** 
     object对象简单包装为hash类
     @module Hashtable
     @author lijunjun
     @version 1.0
     @example
     var h = new Hashtable;   
     h.add('key', value);
     h.remove('key');
     h.get('key');
     h.clear();
     h.contains('key');
     h.size();
     */
    function Hashtable() {

        this._hash = {};

        /**
          * 向Hash对象添加元素
          *
          * @method module:Hashtable#add
          * @param {String} key 键值
          * @param {Num|Object|Array|String|Other} value 储存值
          * @return {Boolean} 是否添加成功，如果hash对象中已经有该键值，则添加失败
          */
        this.add = function(key,value){
            if( typeof(key) !== "undefined" ){
                if( this.contains(key) === false ){
                    this._hash[key] = typeof(value) === "undefined" ? null : value;
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        /**
          * 从Hash对象删除元素
          *
          * @method module:Hashtable#remove
          * @param {String} key 键值
          */
        this.remove = function(key){
            delete this._hash[key];
        };

        /**
          * 取得Hash对象储存元素个数
          *
          * @method module:Hashtable#size
          * @return {Num} 对象中元素总个数
          */
        this.size = function(){
            var i=0;
            for(var k in this._hash){
                i++;
            } 
            return i;
        };

        /**
          * 取得Hash对象储存元素个数
          *
          * @method module:Hashtable#get
          * @param {String} key 需要取得键值
          * @return {Num|Object|Array|String|Other} hash中键值对应值
          */
        this.get = function(key){
            return this._hash[key];
        };
        
        /**
          * 检测Hash对象是否有某元素
          *
          * @method module:Hashtable#contains
          * @param {String} key 需要检测的键值
          * @return {Boolean} 是否储存有该键
          */
        this.contains = function(key){
            return typeof(this._hash[key]) !== "undefined";
        };

        /**
          * 清空Hash对象
          *
          * @method module:Hashtable#clear
          */
        this.clear = function(){
            for(var k in this._hash){
                delete this._hash[k];
            }
        };
    }
    return Hashtable;
});

