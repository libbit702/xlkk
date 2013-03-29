/**
 * 付费频道用户信息处理
 *
 * @module vip
 * @author lijunjun
 * @version 1.0
 * @example
 vip.getBerylType(G_XLKANKANUSERINFO);
 */
define(function(c){
    'use strict';
    var Vip = {
        berylType: 0,
        products: null
    };

    /**
     * 仅限于使用付费频道头的页面使用，传入参数G_XLKKUSERINFO只有在付费页面才会生成
     * 
     * @method module:vip#getBerylType
     * @param {Object} userinfo
     * @return {Num} 付费用户的类型
     */
    Vip.getBerylType = function(userinfo) {
        var shop_user_info = userinfo.shopInfo,
            date1 = new Date(Date.parse(shop_user_info.curTime.replace(/-/g, "/"))),
            date2 = new Date(Date.parse(shop_user_info.validtime.replace(/-/g, "/"))),
            date3 = date2.getTime() - date1.getTime(),
            days = Math.ceil(date3 / (24 * 3600 * 1000));
        if (parseInt(shop_user_info.kkviptype, 10) !== 0) {
            if (parseInt(shop_user_info.ismobile, 10) === 0) {
                if (days > 0) {
                    this.berylType = shop_user_info.kkviptype;
                }
            } else {
                this.berylType = shop_user_info.kkviptype;
            }
        }
        return this.berylType;
    };

    /**
     * 用户登出后清理
     * 
     * @method module:vip#loginout
     */
    Vip.loginout = function() {
       this.berylType = 0;
       this.products = null;
    };
    /* 
    用户付费影片列表有点搞不明白
    Vip.getProducts = function() {
        if (this.products == null) {
            var callback = typeof arguments[0] === "function" ? arguments[0] : function(){};
            MiniSite.loadJSData.load('http://shop.vip.kankan.com/product/list?callback=Vip.setProducts&rd=' + Math.random(), 'utf-8', callback );
        }
        return this.products;
    };

    Vip.setProducts = function( data ) {
        if (typeof data === "object" && data.rtn && parseInt(data.rtn, 10) === 1) {
            this.products = data.data.products;
        }
    };
    */
    return Vip;
});
