require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["eventutil"], function(e) {
    test('事件绑定测试', 1, function(){
        var aid = document.getElementById('lnk1');
        e.addEventHandler(aid, 'click', function(){
            ok(true, aid.id+'触发点击了');
        });
        aid.click();
    });
});