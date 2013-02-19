require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["vip"], function(v) {
    test( "付费频道测试", function() {
        var baoyueUser = {
            daily:"15",
            expire:"2013-07-03",
            grow:"3570",
            isvip:1,
            payid:"5",
            userid:"205615142",
            vlevel:3,
            shopInfo:{
                bought:1,
                curTime:"2013-02-19 13:57:47",
                ismobile:"0",
                kkviptype:"1",
                mobileNo:"",
                timelimit:0,
                validtime:"2013-10-15"
            }
        };
        
        var jinjiUser = {
            daily:"15",
            expire:"2013-07-03",
            grow:"3570",
            isvip:1,
            payid:"5",
            userid:"205615142",
            vlevel:3,
            shopInfo:{
                bought:1,
                curTime:"2013-02-19 13:57:47",
                ismobile:"0",
                kkviptype:"3",
                mobileNo:"",
                timelimit:0,
                validtime:"2013-10-15"
            }
        };
        
        equal( v.getBerylType(baoyueUser), 1, "豪华套餐非包月用户" );
        equal( v.getBerylType(jinjiUser), 3, "经济套餐非包月用户" );
    });
});