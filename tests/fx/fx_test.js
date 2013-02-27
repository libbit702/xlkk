require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["fx",'node'], function(f, n) {    
    console.log(FX);
});