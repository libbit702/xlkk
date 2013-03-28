require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()    
});

/**
 * 引用了模拟键盘敲击事件的JS
 * @see https://github.com/gtramontina/keyvent.js
 */
require(["keyevent"], function(ke) {
	test("监视键盘按键测试", 2, function(){
		ke.down('delete', function(){
	    	ok(1, "用户点击了Del键" );
	    });
	    ke.up('enter', function(){
	    	ok(1, "用户点击了Enter键" );
	    });
		keyvent.down('del');
		keyvent.up('enter');
	});    
});