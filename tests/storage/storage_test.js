require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()    
});

require(["storage"], function(s) {
    
    s.setItem('key', '你号	');
    var  t= s.getItem('key');
    console.log(t);
});