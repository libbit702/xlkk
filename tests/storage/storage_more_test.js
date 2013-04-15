require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()    
});

require(["storage", 'domReady'], function(s,domReady) {
    domReady(function () {
        test('Storage跨页面取值测试', function(){
            strictEqual(s.getItem('key4'), 'storage_more_test', '跨页面获取值正常');
        });
    });    
});