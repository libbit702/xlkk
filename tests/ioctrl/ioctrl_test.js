require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()    
});

require(["ioctrl"], function(i) {    	
	var peerid = i.getPeerID();
	test("ioCtrl取PeerID测试", 1, function(){
		equal(peerid, '8C89A5BA6C5FAHFC', '获取PeerID成功');
	});
});