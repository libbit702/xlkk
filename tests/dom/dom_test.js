require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["dom"], function(d) {
    test( "DOM静态方法测试", function() { 
        equal( d.trim('  123  '), '123', "TRIM正常" );
        equal( d.toCamelCase('a-bc-de-fg-'), 'aBcDeFg', "Camel正常" );
    });
});