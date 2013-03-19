require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()    
});

require(["storage"], function(s) {	
	module("基本功能测试");
	//初始化本地存储值
	s.setItem('key1', 'value_string');
	s.setItem('key2', [1, {'obj_key':'obj_val'}, [1,2,3]], true);
	s.setItem('key3', '测试用例');

    test('Storage存取兼容性测试', function(){
    	strictEqual(s.getItem('key1'), 'value_string', "存储英文字符正常" );
    	deepEqual(s.getItem('key2', true), [1, {'obj_key':'obj_val'}, [1,2,3]], "存储数组及对象正常" );
    	strictEqual(s.getItem('key3'), '测试用例', "存储中文字符正常" );
    });

    test('Storage删除及长度测试', function(){
    	strictEqual(s.length(), 3, "删除前长度正常" );
    	s.removeItem('key1');
    	strictEqual(s.getItem('key1'), null, "删除后KEY对应的值正常" );
    	strictEqual(s.length(), 2, "删除后长度正常" );
    	s.clear();
    	strictEqual(s.length(), 0, "清空存储后长度正常" );
    });
});