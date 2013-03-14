require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()    
});

require(["ioctrl"], function(i) {    
    console.log(i.getPeerID());
});